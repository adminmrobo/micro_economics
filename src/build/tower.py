# -*- coding: utf-8 -*-
"""C&C 마켓 타워 — 3D 첫 화면(건물 안내)

건물 보기 쪽(tower.html)은 건물 전체를, 장 쪽은 그 장이 들어 있는 층을 3D로 보여 주고
층 평면(방 = 이 쪽의 단계)과 둘러보는 순서를 안내한다.

- build.py / build_extra.py 가 nav 바로 뒤, 표지 그림 앞에 tower_html(key)를 넣는다.
- 이미 빌드된 HTML에는 add_tower.py 로 같은 블록을 넣거나 갈아 끼운다(표식 <!--tower:start--> … <!--tower:end-->).
- three.js 는 CDN(jsdelivr)에서 불러온다. 불러오지 못하면 오른쪽 안내판만으로 쓸 수 있다.
"""
import os, json, html

B = os.path.dirname(os.path.abspath(__file__))
CSS = open(os.path.join(B, 'tower.css'), encoding='utf-8').read()
JS = open(os.path.join(B, 'tower.js'), encoding='utf-8').read()
THREE_VER = '0.170.0'

COMPANY = dict(ko='C&C 경제연구원', en='Choice & Constraint Institute', hq='마켓 타워',
               motto='선택(Choice)과 제약(Constraint)으로 시장을 읽는 연구원',
               sign=['C&C MARKET', 'Choice & Constraint'], plate='C&C 마켓 타워  ·  서울',
               note='가상의 경제연구원입니다. 층마다 한 연구실이 있고, 연구실마다 그 장의 미시경제학 도구로 일합니다.')

CLOCKS = [('서울', 'Asia/Seoul'), ('런던', 'Europe/London'), ('뉴욕', 'America/New_York'), ('싱가포르', 'Asia/Singapore')]

PAL = ['#3f5fa8', '#138a52', '#d23f2c', '#2563c9', '#a8329f', '#b77800', '#14899a', '#7a45d6']

def LES(a, b, c, sa, sb, sc):
    return [('three', '안내 데스크', '3줄 요약'), ('cast', '팀 라운지', '연구실 식구'), ('lv1', a, '단계 ① ' + sa), ('lv2', b, '단계 ② ' + sb), ('lv3', c, '단계 ③ ' + sc),
            ('dash', '상황실', '한눈에 보는 대시보드'), ('duel', '대결 홀', '초파리 대 주판봇 대결'), ('sum', '정리 데스크', '정리'), ('kg', '자료실', '지식 색인 · 꾸러미')]

REV = [('three', '안내 데스크', '3줄 요약'), ('cast', '팀 라운지', '연구실 식구'), ('summary', '요약 갤러리', '1부 요약'), ('orig', '원자료 문제 시험장', '2부 원자료 문제'),
       ('calc', '업무 계산실', '3부 업무 계산'), ('score', '점수판', '장별 점수'), ('kg', '자료실', '지식 색인 · 꾸러미')]

IDX = [('micro', '안내 데스크', '미시경제학이란'), ('map', '층별 안내판', '목차'), ('keys', '한 줄 핵심 게시판', '한 줄 핵심 모음'), ('dash', '종합 상황실', '종합 대시보드'),
       ('path', '개념 계단', '개념 흐름'), ('how', '식구 라운지', '식구 · 사용법'), ('about', '자료 보관실', '자료와 원칙')]

PRAC = [('factory', '공장 운영실', '공장 — 생산·비용'), ('shop', '가게 계산대', '가게 — 가격·수요'), ('insurer', '보험사 창구', '보험사 — 위험·정보'), ('exchange', '거래소 객장', '거래소 — 균형·자산')]

# 아래에서 위로: 로비 → 1~4층 → 4M 라운지 → 5~8층 → 9층 기말 라운지 → 옥상 실전 연습장
FLOORS = [
 dict(key='lobby', label='L', file='index.html', dept='로비 · 안내 데스크', en='Lobby & Directory', branch='서울 마켓 타워',
      title='목차 — 미시경제학 연구실', ep='목차',
      biz='마켓 타워의 로비입니다. 층별 안내판에서 연구실(장)을 고르면 그 층으로 올라갑니다.', rooms=IDX),
 dict(key='00', label='1F', file='00_economic_models.html', dept='모형 설계실', en='Model Design Lab', branch='협업 지사 서울',
      title='CH0 경제모형과 수학적 사고', ep='CH0',
      biz='새 질문이 들어오면 무엇을 고정하고 무엇을 설명할지 먼저 정하는 곳이에요. 효율과 형평을 나누고, 이미 쓴 돈을 지우는 습관을 들입니다.',
      rooms=LES('비교정태 작업실', '효용가능경계 회의실', '최적화 계산실', '고정과 설명', '효율과 형평', '제약과 최적화')),
 dict(key='01', label='2F', file='01_consumer_choice.html', dept='소비자 행동연구실', en='Consumer Behavior Lab', branch='협업 지사 싱가포르',
      title='CH01 소비자이론', ep='CH01',
      biz='예산 안에서 무엇을 사는지, 가격이 바뀌면 얼마나 덜 사고 얼마나 손해인지를 계산하는 연구실이에요.',
      rooms=LES('장바구니 진열실', '수요곡선 실험실', '생계비 계산실', '예산과 선호', '최적 선택과 수요', '가격 변화와 후생')),
 dict(key='02', label='3F', file='02_producer_choice.html', dept='생산·원가본부', en='Production & Cost', branch='협업 지사 로테르담',
      title='CH02 생산자이론', ep='CH02',
      biz='사람과 장비를 어떻게 섞어야 같은 산출을 가장 싸게 내는지, 가격이 낮을 때 공장을 멈출지 정하는 본부예요.',
      rooms=LES('기술 분석실', '배합 최적화실', '공급 결정실', '생산함수', '비용최소화', '공급과 조업중단')),
 dict(key='03', label='4F', file='03_market_power.html', dept='가격전략실', en='Pricing Strategy', branch='협업 지사 뉴욕',
      title='CH03 시장이론', ep='CH03',
      biz='가격을 스스로 정하는 기업의 한계수입, 독점의 사회적 손실과 규제, 손님별 가격을 다루는 부서예요.',
      rooms=LES('한계수입 데스크', '규제 검토실', '요금 설계실', '한계수입과 이윤', '사중손실과 규제', '가격차별')),
 dict(key='03m', label='4M', file='03m_midterm_review.html', dept='중간 점검 라운지', en='Mid-term Review Lounge', branch='모든 지사 공용 공간',
      title='중간 요약정리 및 퀴즈 — CH0~CH03', ep='CH0~CH03 점검',
      biz='1~4층을 돌아본 연구원들이 쉬어 가며 요약을 보고, 원자료 문제와 업무 계산으로 점검하는 라운지예요.', rooms=REV),
 dict(key='04', label='5F', file='04_game_theory.html', dept='전략·협상센터', en='Strategy & Negotiation', branch='협업 지사 런던',
      title='CH04 게임과 과점', ep='CH04',
      biz='경쟁사·동료·협상 상대가 있는 결정을 보수표와 반응함수로 분석하고, 오래 가는 협조의 조건을 계산하는 센터예요.',
      rooms=LES('보수표 분석실', '과점 시뮬레이터', '장기 관계 회의실', '내시균형', '과점', '반복과 협조')),
 dict(key='05', label='6F', file='05_general_equilibrium.html', dept='시장 청산소 · 자산운용실', en='Market Clearing & Assets', branch='협업 지사 싱가포르',
      title='CH05 일반균형과 자산시장', ep='CH05',
      biz='모든 시장이 함께 맞는 가격을 찾고, 이자율과 위험의 가격까지 다루는 층이에요. (교육용 · 투자 자문 아님)',
      rooms=LES('교환 상자실', '이자율 데스크', '위험 분산실', '교환과 균형', '시간과 이자율', '위험 나누기')),
 dict(key='06', label='7F', file='06_welfare_policy.html', dept='공공정책·조세연구실', en='Public Policy & Tax', branch='협업 지사 런던',
      title='CH06 후생과 공공경제', ep='CH06',
      biz='시장이 잉여를 남김없이 만드는 조건, 세금의 실제 부담, 외부 피해를 가격에 넣는 정책을 평가하는 연구실이에요.',
      rooms=LES('잉여 측정실', '세금 귀착실', '환경 정책실', '총잉여', '조세 귀착', '외부성과 교정')),
 dict(key='07', label='8F', file='07_information.html', dept='정보·계약센터', en='Information & Contracts', branch='협업 지사 뉴욕',
      title='CH07 정보경제학', ep='CH07',
      biz='정보의 값을 매기고, 한쪽만 아는 정보 때문에 생기는 시장 문제와 성과급 계약을 설계하는 센터예요.',
      rooms=LES('정보 가치 평가실', '품질 인증실', '계약 설계실', '정보의 가치', '역선택과 신호', '성과급')),
 dict(key='07f', label='9F', file='07f_final_review.html', dept='기말 점검 라운지', en='Final Review Lounge', branch='모든 지사 공용 공간',
      title='기말 요약정리 및 퀴즈 — CH04~CH07', ep='CH04~CH07 점검',
      biz='5~8층을 돌아본 뒤 요약하고 퀴즈로 마무리하는 라운지예요. 옥상 실전 연습장으로 올라가기 전에 들러요.', rooms=REV),
 dict(key='roof', label='R', file='practice/index.html', dept='옥상 실전 연습장', en='Rooftop Practice Market', branch='모든 지사 공용 공간',
      title='마지막 장 · 실전 연습장 — 공장·가게·보험사·거래소', ep='실전 연습장',
      biz='옥상의 작은 시장 광장이에요. 공장·가게·보험사·거래소를 직접 운영하며 여덟 장의 선택 원리를 적용합니다.', rooms=PRAC),
]
for i, f in enumerate(FLOORS):
    f['color'] = '#5d6278' if f['key'] == 'lobby' else ('#138a52' if f['key'] in ('03m', '07f', 'roof') else PAL[(i - 1) % len(PAL)])
KEYS = [f['key'] for f in FLOORS]
BYKEY = {f['key']: f for f in FLOORS}

e = lambda s: html.escape(str(s), quote=True)

def floor_name(f):
    return f'{f["label"]} {f["dept"]}'

def _data(cur, home=''):
    fl = [dict(key=f['key'], label=f['label'], dept=f['dept'], en=f['en'], branch=f['branch'], title=f['title'], ep=f['ep'], file=f['file'],
               biz=f['biz'], color=f['color'], rooms=[dict(id=a, name=b, sec=c) for a, b, c in f['rooms']]) for f in FLOORS]
    return dict(cur=cur, home=home, company=COMPANY, floors=fl)

def _route_items(f):
    o = []
    for i, (a, b, c) in enumerate(f['rooms']):
        tag = 'EV' if i == 0 else str(i)
        o.append(f'<li data-i="{i}"><a href="#{a}"><i>{tag}</i><b>{e(b)}</b><span>{e(c)}</span></a></li>')
    return ''.join(o)

def _panel_floor(f):
    i = KEYS.index(f['key'])
    dn = FLOORS[i - 1] if i > 1 else None          # 1F의 아래는 로비(목차)
    up = FLOORS[i + 1] if i + 1 < len(FLOORS) else None
    el = []
    el.append(f'<a class="dn" href="{dn["file"]}" title="{e(dn["title"])}">▼ {e(floor_name(dn))}</a>' if dn else '<span class="dn off">▼ 아래층 없음</span>')
    el.append('<a class="lob" href="index.html">로비 · 목차</a>')
    el.append(f'<a class="up" href="{up["file"]}" title="{e(up["title"])}">▲ {e(floor_name(up))}</a>' if up else '<span class="up off">▲ 옥상이 맨 위층</span>')
    first = '엘리베이터에서 내리면 안내 데스크(3줄 요약)부터 들러요. 걷는 사람 표시가 둘러보는 순서를 따라 움직입니다.'
    return f'''<aside class="tw-panel" aria-label="{e(f["label"])} 층 안내">
<p class="tw-co"><b>{e(COMPANY["ko"])}</b> {e(COMPANY["hq"])} · <span>{e(COMPANY["en"])}</span></p>
<div class="tw-fl"><span class="tw-badge" style="--c:{f["color"]}">{e(f["label"])}</span><div><h2>{e(f["dept"])}</h2><p class="tw-en">{e(f["en"])} · {e(f["branch"])}</p></div></div>
<p class="tw-ep"><b>{e(f["ep"])}</b> {e(f["title"])}</p>
<p class="tw-biz">{e(f["biz"])}</p>
<h3>이 층 둘러보는 순서</h3>
<p class="tw-tip">{first}</p>
<ol class="tw-route">{_route_items(f)}</ol>
<nav class="tw-elev" aria-label="엘리베이터 — 층 이동">{"".join(el)}</nav>
</aside>'''

def _panel_index(f, standalone=False):
    rows = []
    for g in reversed(FLOORS[1:]):
        rows.append(f'<li data-k="{g["key"]}"><a href="{g["file"]}"><span class="tw-badge" style="--c:{g["color"]}">{e(g["label"])}</span><b>{e(g["dept"])}</b><span>{e(g["ep"])} · {e(g["title"])}</span></a></li>')
    if standalone:
        rows.append(f'<li data-k="00" class="here"><a href="index.html"><span class="tw-badge" style="--c:{f["color"]}">L</span><b>로비 · 안내 데스크</b><span>목차 · 미시경제학 해설 쪽으로</span></a></li>')
    else:
        rows.append(f'<li data-k="00" class="here"><a href="#three"><span class="tw-badge" style="--c:{f["color"]}">L</span><b>로비 · 안내 데스크</b><span>지금 계신 곳 · 이 목차 쪽</span></a></li>')
    clocks = ''.join(f'<span data-tz="{tz}"><b>{c}</b><i>--:--</i></span>' for c, tz in CLOCKS)
    return f'''<aside class="tw-panel" aria-label="층별 안내판">
<p class="tw-co"><b>{e(COMPANY["ko"])}</b> {e(COMPANY["hq"])} · <span>{e(COMPANY["en"])}</span></p>
<h2>층별 안내판</h2>
<p class="tw-biz">{e(COMPANY["motto"])}. 여덟 연구실이 한 층씩 쓰고, 4층 위 라운지와 9층 라운지에서 요약정리와 퀴즈를, 옥상에서 실전 연습장을 봅니다. 건물의 층을 누르거나 아래 안내판에서 골라 올라가세요.</p>
<div class="tw-clock" aria-label="세계 지사 시각">{clocks}</div>
<ol class="tw-dir">{"".join(rows)}</ol>
<p class="tw-note">{e(COMPANY["note"])}</p>
</aside>'''

def tower_html(key, standalone=False):
    f = BYKEY[key]
    idx = key == 'lobby'
    panel = _panel_index(f, standalone) if idx else _panel_floor(f)
    tools = ('<button type="button" data-v="b" class="on">건물 전체</button><button type="button" data-v="spin" aria-pressed="true">자동 회전</button>' if idx else
             '<button type="button" data-v="b">건물 전체</button><button type="button" data-v="p" class="on">이 층 평면</button>')
    hint = '드래그로 돌려 보고 층을 누르면 안내 카드가 열려요' if idx else '방을 누르면 그 단계로 내려갑니다 · 드래그로 돌려 보기'
    cap = (f'{COMPANY["ko"]} 마켓 타워 3D 모형: 로비부터 옥상까지 12개 층, 층마다 한 연구실(장)' if idx else
           f'{COMPANY["ko"]} 마켓 타워 3D 모형에서 {f["label"]} {f["dept"]}을(를) 건물 밖으로 꺼내 보여 주는 층 평면')
    data = json.dumps(_data(key, 'index.html' if standalone else ''), ensure_ascii=False).replace('</', '<\\/')
    imap = json.dumps({'imports': {'three': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/build/three.module.js',
                                   'three/addons/': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/examples/jsm/'}})
    return f'''<!--tower:start-->
<style>
{CSS}
</style>
<section class="tower{' tw-idx' if idx else ''}" id="tower" data-floor="{key}" aria-label="{e(COMPANY['ko'])} 마켓 타워 — 건물 안내">
<div class="tw-stage" role="img" aria-label="{e(cap)}">
<div class="tw-cv" aria-hidden="true"></div><div class="tw-labels" aria-hidden="true"></div>
<div class="tw-tools">{tools}</div>
<p class="tw-hint">{hint}</p>
<div class="tw-card" hidden></div>
<div class="tw-err" hidden>3D 건물을 불러오지 못했습니다(인터넷 연결 · WebGL 확인). 오른쪽 안내판으로 그대로 이동할 수 있어요.</div>
<div class="tw-load">건물을 짓는 중…</div>
</div>
{panel}
</section>
<script type="application/json" id="towerData">{data}</script>
<script type="importmap">{imap}</script>
<script type="module">
{JS}
</script>
<!--tower:end-->
'''

NAV_LINK = '<a href="#tower">건물 안내</a>'
