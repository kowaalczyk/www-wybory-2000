import codecs
import requests
from bs4 import BeautifulSoup

# raw data files to parse, <source file prefix, parent file, target file prefix>
data_files = {
    ('http://prezydent2000.pkw.gov.pl/gminy/', 'raw_data/html/gminy.html', 'raw_data/xls/gminy/'),
    ('http://prezydent2000.pkw.gov.pl/obwody/', 'raw_data/html/gminy.html', 'raw_data/xls/obwody/'),
}


def load_data(prefix, parent_file, save_target):
    with codecs.open(parent_file, 'r', 'iso-8859-1') as file:
        data = file.read()

        soup = BeautifulSoup(data, 'html.parser')

        for link in soup.find_all('a'):
            url = "{}{}".format(prefix, link['href'])
            print("GET {}".format(url))
            response = requests.get(url)
            print("  Status {}".format(response.status_code))

            if response.status_code == 200:
                save_path = "{}{}".format(save_target, link['href'])
                print("  Saving to {}...".format(save_path))
                with open(save_path, 'wb') as sf:
                    for chunk in response:
                        sf.write(chunk)
                print("  Saved.")


for src_prefix, src_file, dst_prefix in data_files:
    load_data(src_prefix, src_file, dst_prefix)
