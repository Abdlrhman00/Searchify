import java.io.IOException;

import org.apache.hadoop.io.DoubleWritable;
import org.apache.hadoop.conf.Configuration;
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


public class PageRanking {
    //private boolean isFirstLine = true;

    public static class PageRankMapper extends Mapper<LongWritable, Text, Text, DoubleWritable> {
        private Text outLink = new Text();

        @Override
        protected void setup(Context context) throws IOException, InterruptedException {
            FileSplit fileSplit = (FileSplit) context.getInputSplit();
            BufferedReader reader = new BufferedReader(new InputStreamReader(fileSplit.getPath().getFileSystem(context.getConfiguration()).open(fileSplit.getPath()))); // Open input split file
            String url = reader.readLine(); // Read the first line as URL
            reader.close();
            outLink.set(url);
        }

        protected void map(LongWritable key, Text value, Context context)
                throws IOException, InterruptedException {
            if (key.get() == 0) {
                return;
            }

            String[] outgoingLinks = value.toString().split("::");

            for (String link : outgoingLinks) {
                context.write(new Text(link), new DoubleWritable(1.0)); // Emit (link, 1.0) for each outgoing link
            }
            context.write(outLink, new DoubleWritable(outgoingLinks.length)); // Emit (mainUrl, outgoingLinks.length)
        }
    }

    public static class PageRankReducer extends Reducer<Text, DoubleWritable, Text, DoubleWritable> {
        @Override
        protected void reduce(Text key, Iterable<DoubleWritable> values, Context context)
                throws IOException, InterruptedException {
            int count = 0;

            for (DoubleWritable value : values) {
                count++;
            }

            double initialPageRank = 1.0 / count; // Initialize PageRank to 1/N for each URL, where N is the number of outgoing links
            context.write(key, new DoubleWritable(initialPageRank)); // Emit (key, initialPageRank)
        }
    }

    public static void main(String[] args) throws Exception {
        if (args.length != 2) {
            System.err.println("Usage: PageRankMain <inputPath> <outputPath>");
            System.exit(1);
        }

        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "PageRanking");
        job.setJarByClass(PageRanking.class); // Corrected class name

        job.setMapperClass(PageRanking.PageRankMapper.class);
        job.setReducerClass(PageRanking.PageRankReducer.class);

        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(DoubleWritable.class);

        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));

        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}
