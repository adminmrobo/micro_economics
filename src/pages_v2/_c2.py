"""2권(교과서판 강의노트) 페이지 공용: 출처·장 제목·도우미"""
CH = {1: '기술', 2: '이윤극대화', 3: '이윤함수', 4: '비용최소화', 5: '비용함수', 6: '쌍대성', 7: '효용극대화', 8: '선택', 9: '수요', 10: '소비자잉여', 11: '불확실성', 12: '계량경제학',
      13: '경쟁시장', 14: '독점', 15: '게임이론', 16: '과점', 17: '교환', 18: '생산', 19: '시간', 20: '자산시장', 21: '균형분석', 22: '후생', 23: '공공재', 24: '외부성', 25: '정보', 26: '수학', 27: '최적화'}
FILE = {1: '01_technology', 2: '02_profit_maximization', 3: '03_profit_function', 4: '04_cost_minimization', 5: '05_cost_function', 6: '06_duality', 7: '07_utility_maximization', 8: '08_choice', 9: '09_demand',
        10: '10_consumer_surplus', 11: '11_uncertainty', 12: '12_econometrics', 13: '13_competitive_markets', 14: '14_monopoly', 15: '15_game_theory', 16: '16_oligopoly', 17: '17_exchange', 18: '18_production',
        19: '19_time', 20: '20_asset_markets', 21: '21_equilibrium_analysis', 22: '22_welfare', 23: '23_public_goods', 24: '24_externalities', 25: '25_information', 26: '26_mathematics', 27: '27_optimization'}
def F(n): return FILE[n] + '.html'
def T(n): return f'CH{n:02d} {CH[n]}'
PROV = '저자가 Hal R. Varian 『Microeconomic Analysis』로 진행한 강의의 강의노트. 2005·2008·2011년 세 차례 업데이트, 2014·2015년 강의에 사용'
def REFN(n):
    return {'id': f'ahn2011varnote{n:02d}', 'type': 'manuscript', 'title': f'Varian 『Microeconomic Analysis』 강의노트 제{n}장 {CH[n]} (2005·2008·2011 업데이트)', 'author': [{'family': '안', 'given': '상선'}], 'issued': {'date-parts': [[2011]]},
            'URL': f'https://adminmrobo.github.io/micro_economics/archive/v2/chapters/ch{n:02d}/index.html',
            'lab': {'work': f'lab:work/ahn2011varnote{n:02d}', 'role': 'primary', 'verified': {'title': True, 'authors': True, 'year': True, 'venue': False}, 'checkedBy': '저장소 archive/v2 원본 대조',
                    'note': '저자 본인의 강의노트. 2005·2008·2011년 업데이트, 2014·2015년 강의에 사용. 게재처 없음'}}
VARIAN = {'id': 'varian1992', 'type': 'book', 'title': 'Microeconomic Analysis, 3rd ed.', 'author': [{'family': 'Varian', 'given': 'Hal R.'}], 'issued': {'date-parts': [[1992]]}, 'container-title': 'W. W. Norton',
          'lab': {'work': 'lab:work/varian1992', 'role': 'background', 'verified': {'title': True, 'authors': True, 'year': True, 'venue': True, 'doi': False}, 'checkedBy': '강의노트 참고문헌 대조', 'note': '강의 교재. 본문·문제·증명을 옮기지 않음'}}
def SRCN(n): return f'안상선. Varian 『Microeconomic Analysis』 강의노트 제{n}장 「{CH[n]}」 — 2005·2008·2011년 업데이트, 2014·2015년 강의에 사용. 원본(버전2_강화판)은 저장소 archive/v2/에 보존.'
SRCV = 'Varian, H. R. (1992). Microeconomic Analysis, 3rd ed. W. W. Norton. 강의 교재(본문·문제·증명은 옮기지 않음).'
def fin(P):
    """try_ → try, 기본값 채우기"""
    for l in P['levels']:
        if l.get('math') and 'try_' in l['math']: l['math']['try'] = l['math'].pop('try_')
        l.setdefault('code', None); l.setdefault('limit_en', '')
    P.setdefault('domain', ['econ']); P.setdefault('family', 'micro2')
    return P
