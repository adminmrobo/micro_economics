CHT = {0: '경제모형과 수학적 사고', 1: '소비자이론', 2: '생산자이론', 3: '시장이론', 4: '게임과 과점', 5: '일반균형과 자산시장', 6: '후생과 공공경제', 7: '정보경제학'}
def CHL(n):
    return 'CH0' if n == 0 else f'CH{n:02d}'
def REF0(n):
    t = CHT[n]
    return {'id': f'ahn2026micro{n:02d}', 'type': 'manuscript', 'title': f'미시경제학 연구실 버전1_강화판 {CHL(n)} {t} (강의 노트)', 'author': [{'family': '안', 'given': '상선'}], 'issued': {'date-parts': [[2026]]},
            'URL': f'https://adminmrobo.github.io/micro_economics/archive/v1/ch0{n}/index.html',
            'lab': {'work': f'lab:work/ahn2026micro{n:02d}', 'role': 'primary', 'verified': {'title': True, 'authors': True, 'year': True, 'venue': False}, 'checkedBy': '저장소 archive/v1 원본 대조', 'note': '저자 본인의 강의 노트(버전1_강화판). 게재처 없음'}}
def REF(id, typ, title, authors, year, venue='', role='background', note='', url=''):
    r = {'id': id, 'type': typ, 'title': title, 'author': authors, 'issued': {'date-parts': [[year]]}, 'lab': {'work': f'lab:work/{id}', 'role': role, 'verified': {'title': True, 'authors': True, 'year': True, 'venue': bool(venue), 'doi': False}, 'checkedBy': '버전1 참고문헌 목록 대조', 'note': note}}
    if venue: r['container-title'] = venue
    if url: r['URL'] = url
    return r
VARIAN = REF('varian1992', 'book', 'Microeconomic Analysis, 3rd ed.', [{'family': 'Varian', 'given': 'Hal R.'}], 1992, 'W. W. Norton', url='https://wwnorton.co.uk/books/9780393957358-microeconomic-analysis', note='장 배열과 개념 정의의 참고 교과서. 본문·문제를 옮기지 않음')
def SRC0(n):
    return f'안상선 (2026). 미시경제학 연구실 버전1_강화판 {CHL(n)} 「{CHT[n]}」 강의 노트와 연구실 실험(lab0{n}). 이 페이지의 주 자료. 원본은 저장소 archive/v1/에 보존.'
SRCV = 'Varian, H. R. (1992). Microeconomic Analysis, 3rd ed. W. W. Norton. 개념 정의의 참고 교과서(본문·문제는 옮기지 않음).'
