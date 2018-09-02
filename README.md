# remem - 영어 문장 암기 프로그램

- 플래시 카드 처럼 한글 문장을 보여주고 영어 문장을 생각해 내도록 함  
- 틀린 경우 가중치를 줘서 틀린 문장 위주로 복습 유도

```
# 영어 문장 생성기
tmp/ 

  # 영어 사전 크롤러
  endic_scraper/

    # 크롤러 : 각 단어를 영어 사전에서 검색하여 단어 별 문장을 추출
    SentenceListMaker.py

    # 토익에서 가장 많이 나온 우선 순위 단어 목록
    input.csv
  
  # 추출한 단어 별 문장 파일
  sentence.tsv

  # 문장 파일을 DB에 저장
  sentence_uploader.py
```
