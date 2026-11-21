# -*- coding: utf-8 -*-
"""더 마켓(THE MARKET) — 2권 3D 첫 화면(건물 안내)

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

COMPANY = dict(ko='더 마켓', en='THE MARKET', hq='마켓 빌딩',
               motto='한 건물에 공방부터 거래소까지 — 시장이 움직이는 모든 자리를 층마다 모은 가상의 종합 시장 빌딩',
               sign=['THE MARKET', 'Microeconomics Vol.2'], plate='더 마켓  ·  시장의 모든 자리',
               note='가상의 시장 빌딩입니다. 층마다 한 매장·사무소가 있고, 그 층의 장(교과서 한 장)을 그 자리의 일로 풀어 봅니다.')

CLOCKS = [('서울', 'Asia/Seoul'), ('런던', 'Europe/London'), ('뉴욕', 'America/New_York'), ('시카고', 'America/Chicago')]

GROUPS = [('생산자 구역', ['01', '02', '03', '04', '05', '06'], 'r1', '#3f5fa8'), ('소비자 구역', ['07', '08', '09', '10', '11', '12'], 'r2', '#a8329f'),
          ('시장 구역', ['13', '14', '15', '16'], 'r3', '#d23f2c'), ('일반균형 구역', ['17', '18', '19', '20', '21'], 'r4', '#b77800'),
          ('후생·정보 구역', ['22', '23', '24', '25'], 'r5', '#14899a'), ('수학 부록', ['26', '27'], None, '#5d6278')]

def LES(a, b, c, sa, sb, sc):
    return [('three', '안내 데스크', '3줄 요약'), ('cast', '직원 휴게실', '연구실 식구'), ('lv1', a, '단계 ① ' + sa), ('lv2', b, '단계 ② ' + sb), ('lv3', c, '단계 ③ ' + sc),
            ('duel', '대결 무대', '초파리 대 주판봇 대결'), ('sum', '정리 데스크', '정리'), ('prompt', '코드 공방', 'AI 프롬프트'), ('dash', '복습 상황판', '복습 대시보드'), ('kg', '자료실', '지식 색인')]
REV = [('three', '안내 데스크', '3줄 요약'), ('cast', '휴게실', '연구실 식구'), ('summary', '요약 갤러리', '1부 요약'), ('orig', '원자료 문제 시험장', '2부 원자료 문제'),
       ('calc', '업무 계산실', '3부 업무 계산'), ('score', '점수판', '장별 점수'), ('kg', '자료실', '지식 색인')]
IDX = [('micro', '안내 데스크', '이 강의노트는'), ('map', '층별 안내판', '목차'), ('keys', '한 줄 핵심 게시판', '한 줄 핵심 모음'), ('dash', '종합 상황판', '종합 대시보드'),
       ('path', '개념 계단', '개념 흐름'), ('how', '식구 라운지', '식구 · 사용법'), ('about', '자료 보관실', '자료와 원칙')]
PRAC = [('factory', '공장 운영실', '공장'), ('shop', '가게 계산대', '가게'), ('insurer', '보험사 창구', '보험사'), ('exchange', '거래소 객장', '거래소')]

SHOP = {'01': ('공방', 'Workshop'), '02': ('제조 상회', 'Maker Store'), '03': ('가격표 분석실', 'Price Lab'), '04': ('자재 조달처', 'Procurement'), '05': ('원가 계산소', 'Cost Office'), '06': ('거울 상점', 'Duality Shop'),
        '07': ('장바구니 상가', 'Basket Arcade'), '08': ('영수증 감정소', 'Receipt Checker'), '09': ('수요 관측소', 'Demand Watch'), '10': ('영수증 센터', 'Surplus Desk'), '11': ('보험 창구', 'Insurance Desk'), '12': ('데이터 분석실', 'Data Room'),
        '13': ('자유 시장 광장', 'Open Market'), '14': ('단독 매장', 'Sole Store'), '15': ('협상 테이블', 'Negotiation Table'), '16': ('대형마트 3사', 'Big Three'),
        '17': ('물물교환 장터', 'Barter Fair'), '18': ('공장 직판장', 'Factory Outlet'), '19': ('은행 창구', 'Bank Counter'), '20': ('증권 거래소', 'Exchange Floor'), '21': ('시장 관리소', 'Market Office'),
        '22': ('시민 광장', 'Civic Plaza'), '23': ('공원 관리소', 'Park Office'), '24': ('환경 감시소', 'Environment Watch'), '25': ('품질 인증센터', 'Quality Center'),
        '26': ('설계 사무소', 'Design Office'), '27': ('계산 공학실', 'Optimization Lab')}

import os, importlib.util
PD = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'pages_v2')
def _meta(k):
    f = os.path.join(PD, f'p{k}.py')
    if not os.path.exists(f): return None
    sp = importlib.util.spec_from_file_location('m' + k, f); m = importlib.util.module_from_spec(sp)
    import sys; sys.path.insert(0, PD); sp.loader.exec_module(m); return m.P
FLOORS = [dict(key='lobby', label='L', file='index.html', dept='로비 · 층별 안내', en='Lobby & Directory', branch='더 마켓 정문', title='목차 — 미시경제학 연구실 2', ep='목차',
               biz='더 마켓의 로비입니다. 층별 안내판에서 매장(장)을 고르면 그 층으로 올라갑니다.', rooms=IDX, color='#5d6278')]
fl = 1
for gname, keys, rk, col in GROUPS:
    for k in keys:
        P = _meta(k)
        if not P: continue
        lv = P['levels']; nm, en = SHOP[k]
        FLOORS.append(dict(key=k, label=f'{fl}F', file=P['file'], dept=nm, en=en, branch=gname, title=P['title'].split(' — ')[0], ep=f'CH{k}',
                           biz=P.get('shop_biz', P['three']['what']), rooms=LES(*[x[0] for x in P.get('rooms', [('작업대 ①',), ('작업대 ②',), ('작업대 ③',)])], *[l['short'] for l in lv]), color=col)); fl += 1
    if rk:
        P = _meta(rk)
        if P:
            FLOORS.append(dict(key=rk, label=f'{fl}F', file=P['file'], dept=f'{gname} 점검 라운지', en='Review Lounge', branch='모든 구역 공용', title=P['short_title'], ep=P['short_title'],
                               biz=f'{gname}을 돌아본 뒤 요약을 보고 원자료 문제와 업무 계산으로 점검하는 라운지예요.', rooms=REV, color='#138a52')); fl += 1
FLOORS.append(dict(key='roof', label='R', file='practice/index.html', dept='옥상 실전 장터', en='Rooftop Practice Market', branch='모든 구역 공용', title='마지막 장 · 실전 연습장', ep='실전 연습장',
                   biz='옥상의 작은 장터예요. 공장·가게·보험사·거래소를 직접 운영하며 배운 원리를 적용합니다.', rooms=PRAC, color='#138a52'))
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
<p class="tw-biz">{e(COMPANY["motto"])}. 스물일곱 매장이 한 층씩 쓰고, 구역마다 점검 라운지에서 요약정리와 퀴즈를, 옥상 장터에서 실전 연습장을 봅니다. 건물의 층을 누르거나 아래 안내판에서 골라 올라가세요.</p>
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
    cap = (f'{COMPANY["ko"]} 마켓 빌딩 3D 모형: 로비부터 옥상까지 층마다 한 매장(장)' if idx else
           f'{COMPANY["ko"]} 마켓 빌딩 3D 모형에서 {f["label"]} {f["dept"]}을(를) 건물 밖으로 꺼내 보여 주는 층 평면')
    data = json.dumps(_data(key, 'index.html' if standalone else ''), ensure_ascii=False).replace('</', '<\\/')
    imap = json.dumps({'imports': {'three': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/build/three.module.js',
                                   'three/addons/': f'https://cdn.jsdelivr.net/npm/three@{THREE_VER}/examples/jsm/'}})
    return f'''<!--tower:start-->
<style>
{CSS}
</style>
<section class="tower{' tw-idx' if idx else ''}" id="tower" data-floor="{key}" aria-label="{e(COMPANY['ko'])} 마켓 빌딩 — 건물 안내">
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
