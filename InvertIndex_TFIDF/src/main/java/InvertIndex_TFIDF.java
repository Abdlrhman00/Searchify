import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.StringTokenizer;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.input.FileSplit;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class InvertIndex_TFIDF {

    public static class InvertIndexMapper extends Mapper<LongWritable, Text, Text, Text> {
        private Text word = new Text();
        private Text docInfo = new Text();
        private String url;
        private boolean isFirstLine = true;

        @Override
        protected void setup(Context context) throws IOException, InterruptedException {
            FileSplit fileSplit = (FileSplit) context.getInputSplit();
            String fileName = fileSplit.getPath().getName();
            BufferedReader reader = new BufferedReader(new InputStreamReader(fileSplit.getPath().getFileSystem(context.getConfiguration()).open(fileSplit.getPath()))); // Open input split file
            url = reader.readLine(); // Read the first line as URL
            reader.close();
        }

        protected void map(LongWritable key, Text value, Context context)
                throws IOException, InterruptedException {
            if (key.get() == 0) {
                return;
            }
//            if(isFirstLine){
//                context.write(new Text("{"), new Text()); // Write '{' as the first character in the file                isFirstLine = false;
//            }


            StringTokenizer tokenizer = new StringTokenizer(value.toString());

            while (tokenizer.hasMoreTokens()) {
                String token = tokenizer.nextToken();
                word.set(token);
                docInfo.set(url + "::1"); // Document info: URL:frequency

                context.write(new Text("\"" + word + "\": ["), docInfo);
            }
        }
    }

    public static class Reduce extends Reducer<Text, Text, Text, Text> {
        private Text result = new Text();
        private boolean isFirst = true;

        protected void reduce(Text key, Iterable<Text> values, Context context)
                throws IOException, InterruptedException {
            Map<String, Integer> wordFrequencyMap = new HashMap<>();

            int totalWordsInDocument = 0;
            int documentCount = 0;

            // Iterate through the values to calculate total frequency across all documents
            for (Text value : values) {
                String[] parts = value.toString().split("::");
                String url = parts[0];
                int frequency = Integer.parseInt(parts[1]);

                // Increment total frequency of the word
                wordFrequencyMap.put(url, wordFrequencyMap.getOrDefault(url, 0) + frequency);

                // Increment total words in document
                totalWordsInDocument += frequency;

                // Increment documentCount
                documentCount++;
            }

            // Calculate Term Frequency (TF) and Inverse Document Frequency (IDF)
            StringBuilder outputBuilder = new StringBuilder();
            for (Map.Entry<String, Integer> entry : wordFrequencyMap.entrySet()) {
                String url = entry.getKey();
                int totalFrequency = entry.getValue();

                // Term Frequency (TF)
                double tf = (double) totalFrequency / totalWordsInDocument;

                // Inverse Document Frequency (IDF)
                double idf = Math.log10((double) context.getConfiguration().getInt("totalDocuments", 0) / documentCount);

                // TF-IDF
                double tfIdf = tf * idf;


                String urlObject = " ";
                //if(counter != 0) {
                // Construct the URL object as a string
                urlObject = String.format("{\"url\":\"%s\", \"frequency\":%d, \"tf\":%.2f, \"idf\":%.2f, \"tf-idf\":%.2f}",
                        url, totalFrequency, tf, idf, tfIdf);
//                }else{
//                    urlObject = String.format("{\"url\":\"%s\", \"frequency\":%.2f, \"tf\":%.2f, \"idf\":%.2f, \"tf-idf\":%.2f}",
//                            url, frequency, tf, idf, tfIdf);
//                }
                // Append the URL object to the output
                outputBuilder.append(urlObject).append(",");

            }
            outputBuilder.deleteCharAt(outputBuilder.length()-1);

            outputBuilder.append("],");



            // Convert the output to Text and emit it
            result.set(outputBuilder.toString());
            if (isFirst) {
                context.write(new Text("{"), null); // Write '{' as the first character in the file
                isFirst = false;
            }
            context.write(key, result);

        }
        protected void cleanup(Context context) throws IOException, InterruptedException {

            context.write(new Text("}"), null); // Write '}' as the last character in the file
        }
    }


    public static void main(String[] args) throws Exception {
        if (args.length != 3) {
            System.err.println("Usage driver <input> <output> <totalDocuments>");
            System.exit(2);
        }

        String input = args[0];
        String output = args[1];
        int totalDocuments = Integer.parseInt(args[2]);

        Configuration conf = new Configuration();
        conf.setInt("totalDocuments", totalDocuments);
        FileSystem fs = FileSystem.get(conf);

        boolean exists = fs.exists(new Path(output));
        if (exists) {
            fs.delete(new Path(output), true);
        }

        Job job = Job.getInstance(conf);
        job.setJarByClass(InvertIndex_TFIDF.class);

        job.setMapperClass(InvertIndexMapper.class);
        job.setReducerClass(Reduce.class);

        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(Text.class);

        FileInputFormat.addInputPath(job, new Path(input));
        FileOutputFormat.setOutputPath(job, new Path(output));

        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}