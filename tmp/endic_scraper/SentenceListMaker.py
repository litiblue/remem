import sys
import requests
from scrapy.selector import Selector
from HTMLParser import HTMLParser
from urlparse import parse_qs, urlparse


class TagParser(HTMLParser):

    def setup(self):
        self.eng_sentence = None
        self.kr_sentence = None

    def handle_starttag(self, tag, attrs):
        try:
            attr_dict = dict(attrs)
            if attr_dict["href"][:12] == "/example.nhn" and \
            attr_dict["class"] == "N=a:xmp.detail":
                self.eng_sentence = \
                parse_qs(urlparse(attr_dict["href"]).query)["query"][0]
        except:
            pass

    def handle_data(self, data):
        if self.eng_sentence != None:
            if self.kr_sentence == None:
                self.kr_sentence = data
            else:
                self.kr_sentence = self.kr_sentence + data

    def get_sentence(self):
        return self.eng_sentence, self.kr_sentence


class SentenceScraper(object):

    def __init__(self):
        self.parser = TagParser()
        self.parser.setup()

    def fetch_page(self, url):
        r = requests.get(url)
        return r.text

    def get_sentences(self, search_word, num_of_sentence=3):
        url = \
        "http://endic.naver.com/search_example.nhn?sLn=kr&query=%s&pageNo=1" \
        % search_word

        html = self.fetch_page(url).encode("utf-8");
        sel = Selector(text=html)
        tags = sel.css("#exampleAjaxArea ul li .mar_top1 a").extract()

        sentences = []
        for tag in tags:
            self.parser.setup()
            self.parser.feed(tag);
            eng_sentence, kr_sentence = self.parser.get_sentence();
            if eng_sentence == None: continue

            sentences.append((eng_sentence, kr_sentence))
            if len(sentences) >= num_of_sentence:
                break
        return sentences


class SentenceListMaker(object):

    def __init__(self):
        self.sentenceScraper = SentenceScraper()

    def append_sentences(self, out_file, sentences):
       for sentence_tup in sentences:
           out_file.write(u'\t'.join(sentence_tup).encode('utf-8')+'\n')

    def run(self, in_name, out_name):
        with open(in_name, 'r') as in_file, open(out_name, 'w') as out_file:
            for line in in_file:
                word = line.split(',')[1]
                sentences = self.sentenceScraper.get_sentences(word)
                self.append_sentences(out_file, sentences)

if __name__ == "__main__":
    if len(sys.argv) == 3:
        sentenceListMaker = SentenceListMaker()
        sentenceListMaker.run(sys.argv[1], sys.argv[2])
