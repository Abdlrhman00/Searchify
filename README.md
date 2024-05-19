# Searchify:

Searchify is a comprehensive text search engine designed to provide users with the ability to explore vast amounts of textual data efficiently and accurately. Leveraging advanced techniques such as inverted indexing, frequency analysis, and TF-IDF scoring, Searchify offers a seamless search experience for both casual users and data enthusiasts alike.

## Features

- **Web Crawling**: Searchify includes a web crawling module that retrieves page content and metadata for analysis, ensuring a comprehensive search index.
- **MapReduce with Hadoop**: Utilizing the power of Hadoop, Searchify employs MapReduce algorithms to create inverted indices and calculate frequency and TF-IDF scores, enabling fast and scalable processing of large datasets.
- **Page Ranking Algorithm**: Searchify implements a page ranking algorithm to improve search result relevance and ranking, enhancing the overall search experience.
- **User-Friendly Web Interface**: With Searchify, users can interact with the search engine through a user-friendly web interface. The search results, generated from the output files of the implemented algorithms, are presented in JSON format for easy retrieval and display.

## Technologies Used

- **Programming Languages**: Java, Python, JavaScript
- **Frameworks/Libraries**: Apache Hadoop, Node.js, Bootstrap
- **Tools**: Git, GitHub

## Getting Started

### Prerequisites

Before getting started with Searchify, ensure you have Node.js and npm installed on your system. If not, you can download and install them from the [official Node.js website](https://nodejs.org/).

### Installation and Setup

1. **Clone Repository**: Clone the Searchify repository to your local machine:

    ```bash
    git clone https://github.com/your-username/searchify.git
    ```

2. **Navigate to Directory**: Change your working directory to the cloned repository:

    ```bash
    cd searchify
    ```

3. **Install Dependencies**: Use npm to install the required dependencies and set up the web interface:

    ```bash
    npm install
    ```

4. **Configure Environment Variables**: Create a `.env` file in the root directory of the project to store environment variables. You may need to set variables such as port number, database credentials, etc. Refer to the `.env.example` file for guidance.

### Running Searchify

Once you've completed the installation and setup steps, you can run Searchify locally using npm:

```bash
npm run devStart
```

This command will start the Node.js server, and you should see output indicating that the server is running. By default, the web interface should be accessible at `http://localhost:3000` in your web browser.

### Accessing Searchify

Open your web browser and navigate to `http://localhost:3000` (or the appropriate URL if you've configured a different port). You should now be able to interact with Searchify through the user-friendly web interface.

## Team

Meet the team behind Searchify:

- [Abdulrahman Muhammad](https://github.com/Abdlrhman00)
- [Alaa Saeed](https://github.com/Alaa0Saeed)
- [Ahmed Mostafa](https://github.com/AhmedMu7)
- [Mohamed Khaled](https://github.com/moh18khaled)
- [Kareem Ragab](https://github.com/KareemRagabAbdelhameed)

## Feedback and Support

We value your feedback and are committed to continuously improving BookWise. If you have any suggestions, ideas, or issues, please don't hesitate to [open an issue]https://github.com/Abdlrhman00/Searchify/issues) on GitHub. Our team is here to assist you and ensure that your experience with BookWise is enjoyable and fulfilling.