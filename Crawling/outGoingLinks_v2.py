import os
import requests
from bs4 import BeautifulSoup

def clean_html(html):
    soup = BeautifulSoup(html, 'html.parser')
    for script in soup.find_all('script'):
        script.extract()
    clean_text = soup.get_text()
    cleaned_text = ' '.join(clean_text.split())
    cleaned_text = cleaned_text.replace('"', '')  # Remove double quotes
    return cleaned_text

def get_content(link, output_content, output_links, file_counter):
    print(f"Number of Files Generated: {file_counter}")

    try:
        res = requests.get(link)
        if res.status_code == 200:
            html_content = res.text
            cleaned_text = clean_html(html_content)
            if cleaned_text:
                # Create the output directory if it doesn't exist
                if not os.path.exists(output_content):
                    os.makedirs(output_content)
                # Write URL as the first line in the file
                with open(f'{output_content}/url{file_counter}.txt', 'w', encoding='utf-8') as file:
                    file.write(link + '\n')  # URL as the first line
                    file.write(cleaned_text)
                    
                    # Extract outgoing links and store them
                    outgoing_links = extract_outgoing_links(html_content)
                    if not os.path.exists(output_links):
                        os.makedirs(output_links)

                    with open(f'{output_links}/links{file_counter}.txt', 'w', encoding='utf-8') as links_file:
                        links_file.write(link + '\n')  # URL as the first line
                        for outgoing_link in outgoing_links:
                            links_file.write(outgoing_link + '::')
                        file_counter += 1
    except requests.RequestException as e:
        print(f"Error occurred while fetching {link}: {e}")
    return file_counter

def extract_outgoing_links(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    links = soup.find_all('a', href=True)
    outgoing_links = [link['href'] for link in links if link['href'].startswith('https://')]
    return outgoing_links

def crawl_and_extract_content(start_page, max_files, output_content, output_links):
    current_link = start_page
    files_generated = 0

    while files_generated < max_files and current_link:
        print(f"Number of Files Generated: {files_generated}")
        files_generated = get_content(current_link, output_content, output_links, files_generated)
        try:
            res = requests.get(current_link)
            if res.status_code == 200:
                soup = BeautifulSoup(res.text, 'html.parser')
                links = soup.find_all('a', href=True)
                for a in links:
                    href = a['href']
                    if href.startswith('https://') and files_generated < max_files:
                        current_link = href
                        files_generated = get_content(current_link, output_content, output_links, files_generated)
        except requests.RequestException as e:
            print(f"Error occurred while fetching {current_link}: {e}")
            continue

# Example usage:
start_page = 'https://en.wikipedia.org/wiki/Main_Page'
max_files = 10
output_content = 'output_content'
output_links = 'output_links'
crawl_and_extract_content(start_page, max_files, output_content, output_links)
