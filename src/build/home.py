# -*- coding: utf-8 -*-
"""목차(index) 첫 화면 = 미시경제학 해설 + 건물 보기 썸네일.

- index.html : 표지 → 머리말(미시경제학 설명) → 미시경제학이란 → 목차 카드 → 건물로 둘러보기(썸네일) → …
- tower.html : C&C 마켓 타워 3D(건물 전체 · 층별 안내판)를 따로 보는 쪽
build_extra.index() 와 patch_home.py(이미 빌드된 index.html 고치기)가 함께 쓴다.
"""
import base64, html, re, json
import tower

e = html.escape
strip = lambda s: re.sub('<[^>]+>', '', s)
DATE = '2026-11-21'
WHO_PAGE = 'https://adminmrobo.github.io/who_am_i/who_am_i.html'

LEAD = ('<b>미시경제학</b>은 사람과 기업이 <b>목적</b>(만족·이윤)을 이루려고 <b>제약</b>(예산·기술·정보) 안에서 고르는 방법과, '
        '그 선택들이 시장에서 만나 <b>가격과 거래량</b>을 정하는 원리를 다룹니다. 이 시리즈는 CH0에서 모형을 읽는 습관을 들이고, '
        'CH01~CH03에서 소비자·생산자·시장지배력을, CH04~CH07에서 게임·일반균형·후생과 정책·정보를 다룹니다. '
        'CH03과 CH07 뒤에는 요약정리와 퀴즈가 있고, 마지막에는 네 사업장을 운영해 보는 실전 연습장이 있어요.')

def byline():
    return (f'<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="{WHO_PAGE}" target="_blank" rel="noopener">저자 소개</a>'
            f' · {DATE} 개정</p>')

# ---------- 건물 썸네일 (픽셀풍 SVG) ----------
def tower_svg(w=192, h=108):
    """16비트 RPG 픽셀아트 느낌의 마켓 타워 그림. 층 색은 tower.FLOORS 와 같다."""
    r = []
    R = lambda x, y, ww, hh, c: r.append(f'<rect x="{x}" y="{y}" width="{ww}" height="{hh}" fill="{c}"/>')
    # 하늘(흰 바탕에 가까운 옅은 파랑) · 구름 · 땅
    R(0, 0, 192, 108, '#f3f7fd'); R(0, 60, 192, 40, '#e8f0fb')
    for cx, cy in ((22, 18), (150, 12), (168, 34)):
        R(cx, cy, 14, 3, '#ffffff'); R(cx + 3, cy - 2, 7, 2, '#ffffff')
    # 뒤쪽 낮은 건물들
    for x, hh, c in ((10, 26, '#d6deec'), (28, 18, '#cdd7e8'), (140, 22, '#d6deec'), (160, 30, '#cdd7e8'), (178, 16, '#d6deec')):
        R(x, 100 - hh, 16, hh, c)
        for wy in range(100 - hh + 3, 98, 5):
            R(x + 3, wy, 2, 2, '#f3f7fd'); R(x + 8, wy, 2, 2, '#f3f7fd')
    R(0, 100, 192, 8, '#a9c48a'); R(0, 100, 192, 1, '#8fb070'); R(0, 104, 192, 1, '#9cba7d')
    # 타워 본체: 아래(로비)에서 위(옥상)로
    X, W = 72, 48
    hgt = {'lobby': 8, '03m': 3, '07f': 4, 'roof': 3}
    y = 100
    for f in tower.FLOORS:
        fh = hgt.get(f['key'], 5)
        y -= fh
        R(X, y, W, fh, f['color'])
        R(X, y, W, 1, '#00000022')
        if f['key'] == 'lobby':
            R(X + 20, y + 3, 8, 5, '#2b3550'); R(X + 23, y + 3, 2, 5, '#f3c969')  # 정문
            for wx in (X + 4, X + 11, X + 32, X + 39): R(wx, y + 3, 5, 3, '#eaf2ff')
        elif fh >= 5:
            for wx in range(X + 3, X + W - 3, 5): R(wx, y + 2, 3, 2, '#eaf2ff')
        else:
            R(X + 2, y + 1, W - 4, 1, '#ffffffaa')
    top = y
    R(X - 2, top - 2, W + 4, 2, '#5d6278')                  # 옥상 난간
    R(X + 22, top - 12, 2, 10, '#5d6278'); R(X + 21, top - 14, 4, 2, '#d23f2c')  # 안테나
    R(X + 6, top - 9, 14, 7, '#ffffff'); R(X + 6, top - 9, 14, 1, '#3f5fa8')
    r.append(f'<text x="{X + 13}" y="{top - 3.6}" font-size="5" font-family="monospace" font-weight="700" text-anchor="middle" fill="#3f5fa8">C&amp;C</text>')
    # 오른쪽 그림자 기둥(입체감)
    R(X + W, top, 3, 100 - top, '#00000018')
    # 나무 · 사람
    for tx in (50, 60, 130, 140):
        R(tx + 2, 96, 2, 4, '#7a5530'); R(tx, 90, 6, 6, '#3f8f4e'); R(tx + 1, 89, 4, 1, '#56a865')
    for px, c in ((40, '#d0457f'), (152, '#3f5fa8')):
        R(px, 95, 2, 2, '#f1c9a5'); R(px, 97, 2, 3, c)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 108" width="{w}" height="{h}" shape-rendering="crispEdges" '
            f'role="img" aria-label="픽셀 그림: 로비부터 옥상까지 12개 층이 층마다 다른 색으로 쌓인 C&amp;C 마켓 타워">' + ''.join(r) + '</svg>')

def tower_svg_uri():
    return 'data:image/svg+xml;base64,' + base64.b64encode(tower_svg().encode('utf-8')).decode()

# ---------- CSS ----------
CSS = '''
.th-tower{background-image:url(%s);image-rendering:pixelated}
.ihero .byline{font-size:14px;color:var(--muted);margin:0}
.ihero .lead2{color:var(--text);max-width:68ch}
.mosaic .mt.bld{outline:2px solid var(--seq);outline-offset:-2px}
.mosaic .mt.bld span{background:var(--seq);color:#fff}
.bys{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;counter-reset:bys}
.bys>div{position:relative;background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:18px 18px 16px;display:flex;flex-direction:column;gap:6px}
.bys>div b{font-size:17px}
.bys>div .en{font-size:12px;color:var(--muted);letter-spacing:.02em}
.bys>div:nth-child(1){border-top:4px solid var(--seq)}
.bys>div:nth-child(2){border-top:4px solid var(--amber)}
.bys>div:nth-child(3){border-top:4px solid var(--gfp)}
.byfx{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;font-weight:700;font-size:clamp(16px,2.2vw,21px);padding:16px;border:1px dashed var(--rule);border-radius:12px;background:#fff}
.byfx span{padding:6px 12px;border-radius:8px}
.byfx .p{background:rgba(63,95,168,.10);color:var(--seq)}.byfx .l{background:rgba(183,120,0,.12);color:var(--amber)}.byfx .q{background:rgba(19,138,82,.12);color:var(--gfp)}
.byfx i{font-style:normal;color:var(--muted)}
.bylab{background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:18px;display:flex;flex-direction:column;gap:12px}
.bylab .row{display:flex;flex-wrap:wrap;gap:10px 22px;align-items:center}
.bylab label{display:flex;align-items:center;gap:8px;font-size:14px;flex:1 1 220px}
.bylab label input{flex:1}
.bylab output{min-width:42px;font-weight:700;text-align:right}
.bymeter{position:relative;height:30px;border-radius:8px;background:#fff;border:1px solid var(--rule);overflow:hidden}
.bymeter i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,var(--gfp),#2fb37a);transition:width .35s}
.bymeter b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px}
.byhist{display:flex;flex-wrap:wrap;gap:6px;font-size:13px}
.byhist span{padding:3px 8px;border-radius:6px;background:#fff;border:1px solid var(--rule)}
.byhist span.up{border-color:rgba(19,138,82,.5)}.byhist span.dn{border-color:rgba(210,63,44,.5)}
.chapx{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.chapx a{display:flex;flex-direction:column;gap:6px;background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:16px;color:var(--text);text-decoration:none;min-width:0}
.chapx a:hover{border-color:var(--seq);box-shadow:0 4px 12px rgba(30,35,60,.10)}
.chapx a .ct{display:block;aspect-ratio:16/9;margin:-16px -16px 8px;border-radius:11px 11px 0 0;background-size:cover;background-position:center;border-bottom:1px solid var(--rule)}
.chapx a>b{color:var(--seq);font-size:13px}
.chapx a>strong{font-size:16px;line-height:1.35}
.chapx a>small{color:var(--muted)}
.chapx a ol{margin:2px 0 0;padding-left:20px;font-size:14px;color:var(--text)}
.chapx a ol li.duel{list-style:none;margin-left:-20px;color:var(--c-fly)}
.chapx a.review{border-color:rgba(183,120,0,.55);background:rgba(183,120,0,.06)}
.chapx a.review>b{color:var(--amber)}
.bldcard{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:22px;align-items:center;background:linear-gradient(180deg,#eef3fb,#fff);border:1px solid var(--rule);border-radius:14px;padding:18px;color:var(--text);text-decoration:none}
.bldcard:hover{border-color:var(--seq);box-shadow:0 6px 16px rgba(30,35,60,.12)}
.bldcard .pic{border-radius:10px;overflow:hidden;border:1px solid var(--rule);background:#f3f7fd}
.bldcard .pic svg{display:block;width:100%;height:auto;image-rendering:pixelated}
.bldcard h3{margin:0 0 6px}
.bldcard ul{margin:8px 0 12px;padding-left:20px;font-size:15px}
.bldcard .go{display:inline-block;background:var(--seq);color:#fff;font-weight:700;padding:9px 16px;border-radius:9px}
@media (max-width:860px){.bys,.chapx{grid-template-columns:repeat(2,minmax(0,1fr))}.bldcard{grid-template-columns:1fr}}
@media (max-width:520px){.bys,.chapx{grid-template-columns:1fr}}
'''

def css():
    return '<style>' + CSS.replace('url(%s)', 'url(' + tower_svg_uri() + ')', 1) + '</style>'

# ---------- 미시경제학이란 ----------
LAB_JS = ""

def micro_section(say):
    """say(who, mood, text) -> html (캐릭터 대사)."""
    talk = (say('doc', 'front', '미시경제학의 질문은 늘 같아요. "누가, 무엇을 목적으로, 어떤 제약 안에서 고르나? 그 선택들이 만나면 가격은 어디서 멈추나?"')
            + say('fly', 'point', '그러니까 숫자 하나를 들으면 "무엇을 고정했나, 한 단위 더 하면 무엇이 늘고 주나"부터 묻는 거지.')
            + say('robo', 'coin', '난 크고 높은 숫자가 좋은데… 아래 실험부터 돌려 볼게.')
            + say('sia', 'explain', '인턴 시아예요. 아래 대시보드에서 수요·원가·세금 슬라이더를 하나씩만 움직여 보세요. 그림의 면적과 막대가 함께 바뀌어요.')
            + say('x1', 'wow', '방청석 X1이에요. ▶ 재생을 누르니 세금이 오르면서 빨간 삼각형이 점점 커져요!'))
    rows = [('다루는 대상', '한 사람·한 기업·한 시장의 선택과 가격', '나라 전체의 생산·물가·실업·금리'),
            ('대표 질문', '이 가격에 몇 개를 살까·만들까? 세금은 누가 낼까?', '경기는 왜 오르내릴까? 물가는 왜 오를까?'),
            ('핵심 도구', '최적화(목적·제약)와 균형(수요 = 공급)', '총수요·총공급, 국민소득 항등식'),
            ('이 시리즈에서', 'CH0~CH07 전체', 'CH0의 소득결정 예시만 짧게(별도 장 없음)')]
    tb = ''.join(f'<tr><td><b>{a}</b></td><td>{b}</td><td>{c}</td></tr>' for a, b, c in rows)
    return f"""<section class="level" id="micro"><div class="wrap stack">
<div class="lvhead"><h2>미시경제학이란? — 목적 × 제약 → 선택 → 균형</h2><p class="lead">미시경제학은 "고르는 일"을 숫자로 다뤄요. 사람은 예산 안에서 만족을, 기업은 기술 안에서 이윤을 가장 크게 하려고 고르고, 그 선택들이 시장에서 만나 가격과 거래량이 정해져요. 세 가지 재료만 알면 됩니다.</p></div>
<div class="bys">
<div><span class="en">① OBJECTIVE · 목적</span><b>무엇을 크게 할까</b><p>소비자는 만족(효용), 기업은 이윤, 정부는 사회 전체의 잉여를 크게 하려고 해요. 무엇을 기준으로 "좋다"고 하는지부터 밝혀요.</p></div>
<div><span class="en">② CONSTRAINT · 제약</span><b>무엇이 막을까</b><p>예산·기술·시간·정보가 고를 수 있는 범위를 정해요. 한 단위 더 할 때의 편익과 비용(한계)을 비교하고, 0과 최대치 같은 경계도 확인해요.</p></div>
<div><span class="en">③ EQUILIBRIUM · 균형</span><b>어디서 멈출까</b><p>모두가 최선을 고른 결과가 서로 맞아떨어지는 곳이에요. 시장에서는 사려는 양 = 팔려는 양, 게임에서는 누구도 혼자 바꾸고 싶지 않은 상태예요.</p></div>
</div>
<div class="byfx" aria-label="미시경제학을 말로 쓴 식"><span class="p">목적</span><i>×</i><span class="l">제약</span><i>→</i><span class="q">선택</span><i>→</i><span class="p">균형(가격·거래량)</span></div>
<details class="more"><summary>수식으로 보면 (펼쳐 보기)</summary><p style="margin:10px 0 0">선택: max 목적(x) 제약 g(x) ≤ 0 → 내부해면 한계편익 = 한계비용, 아니면 경계(모서리해). 균형: 수요 D(p) = 공급 S(p)를 만족하는 가격 p*. 자세한 풀이는 <a href="00_economic_models.html">CH0 경제모형과 수학적 사고</a>에 있어요.</p></details>
<div class="talk">{talk}</div>
<div class="dash panel" data-dash="mk" id="mclab" aria-label="직접 해 보기: 수요·원가·세금을 바꿔 시장 균형 보기 대시보드"></div>
<h3>거시경제학과 무엇이 다를까</h3>
<div class="tw"><table class="tb"><tr><th></th><th>미시경제학</th><th>거시경제학</th></tr>{tb}</table></div>
<p class="muted" style="font-size:14px">둘은 같은 경제를 다른 배율로 보는 두 렌즈예요. 이 시리즈는 미시경제학을 다루며, 버전2(교과서 27장)와 블로그는 <a href="archive/index.html">보관함</a>에서 그대로 볼 수 있어요.</p>
</div></section>
{LAB_JS}"""

# ---------- 목차 카드 ----------
def chl(n): return 'CH0' if n == '00' else f'CH{n}'
def toc_section(L):
    def card(n):
        Q = L[n]
        topic = Q['short_title']
        lis = ''.join(f'<li>{e(strip(l["title"]))}</li>' for l in Q['levels'])
        lis += f'<li class="duel">⚔ 대결: {e(strip(Q["duel"]["question"]))}</li>'
        return (f'<a href="{Q["file"]}"><span class="ct th-{n}" aria-hidden="true"></span><b>{chl(n)} · {e(topic)}</b>'
                f'<strong>{e(strip(Q["title"]))}</strong><small>{e(strip(Q["question"]))}</small><ol>{lis}</ol></a>')
    def rv(k, f, t, items, label='요약 · 퀴즈'):
        lis = ''.join(f'<li>{x}</li>' for x in items)
        return f'<a class="review" href="{f}"><span class="ct th-{k}" aria-hidden="true"></span><b>{label}</b><strong>{t}</strong><ol>{lis}</ol></a>'
    p1 = ''.join(card(f'{i:02d}') for i in range(0, 4)) + rv('03m', '03m_midterm_review.html', '중간 요약정리 및 퀴즈 (CH0~CH03)', ['장별 요약정리', '원자료 확인 문제 20문항', '업무 계산 문제 4개', '장별 점수'])
    p2 = ''.join(card(f'{i:02d}') for i in range(4, 8)) + rv('07f', '07f_final_review.html', '기말 요약정리 및 퀴즈 (CH04~CH07)', ['장별 요약정리', '원자료 확인 문제 20문항', '업무 계산 문제 4개', '장별 점수'])
    p3 = rv('prac', 'practice/index.html', '마지막 장 · 실전 연습장', ['공장 — 생산·비용 결정', '가게 — 가격·수요 결정', '보험사 — 위험·정보 결정', '거래소 — 균형·자산 결정'], '시뮬레이터')
    steps = ('<div class="steps"><div><b>이런 분께</b><p>"수요·공급·한계비용"을 들어는 봤지만, 그것이 가격 결정·세금·계약에서 어떻게 쓰이는지 숫자로 보고 싶은 분. 수식을 몰라도 됩니다.</p></div>'
             '<div><b>읽는 순서</b><p>CH0 → CH07 순서가 기본이에요. 앞 장의 한계가 다음 장의 이유가 되도록 이어 두었어요. 소비자 선택부터 보고 싶다면 CH01에서 시작해도 됩니다.</p></div>'
             '<div><b>건물로 둘러보기</b><p>장마다 가상의 연구원 C&amp;C 마켓 타워의 한 층이 됩니다. 아래 <a href="#building">건물 보기</a>에서 3D 건물과 층별 안내판으로 장을 골라도 돼요.</p></div></div>')
    return (f'<section class="level" id="map"><div class="wrap stack"><div class="lvhead"><h2>목차</h2><p class="lead">8장과 요약·퀴즈 두 쪽, 그리고 마지막 장 실전 연습장입니다. 카드마다 그 장에서 다루는 세 가지 주제와 대결 질문을 적어 두었어요.</p></div>'
            f'<h3>1부 · 모형 읽기에서 시장지배력까지 (CH0~CH03)</h3><div class="chapx">{p1}</div>'
            f'<h3>2부 · 게임이론에서 정보경제학까지 (CH04~CH07)</h3><div class="chapx">{p2}</div>'
            f'<h3>마지막 장</h3><div class="chapx">{p3}</div>{steps}</div></section>')

def building_section():
    return f"""<section class="level" id="building"><div class="wrap stack">
<div class="lvhead"><h2>건물로 둘러보기 — C&amp;C 마켓 타워</h2><p class="lead">같은 열한 쪽을 건물로도 볼 수 있어요. 가상의 경제연구원 C&amp;C(Choice &amp; Constraint)의 서울 마켓 타워에서 장 하나가 연구실 하나, 연구실 하나가 한 층입니다.</p></div>
<a class="bldcard" href="tower.html"><div class="pic">{tower_svg(384, 216)}</div><div><h3>건물 보기 — 3D 마켓 타워</h3><p class="muted" style="margin:0">로비부터 옥상 실전 연습장까지 12개 층</p><ul><li>건물을 드래그로 돌려 보고, 층을 누르면 연구실(장) 안내 카드가 열려요.</li><li>층별 안내판과 협업 지사 시각(서울·런던·뉴욕·싱가포르)이 함께 나와요.</li><li>각 장 쪽 맨 위에서는 그 층을 꺼내 층 평면과 둘러보는 순서를 보여 줘요.</li></ul><span class="go">건물 보기 →</span></div></a>
</div></section>"""

def mosaic_tile():
    return '<a class="mt th-tower bld" href="tower.html" title="건물 보기 · C&amp;C 마켓 타워"><span>건물</span><i class="sr">건물 보기 · C&amp;C 마켓 타워 3D</i></a>'

def practice_tile():
    return '<a class="mt th-prac" href="practice/index.html" title="마지막 장 · 실전 연습장"><span>실전</span><i class="sr">마지막 장 · 실전 연습장</i></a>'

NAV = [('micro', '미시경제학이란'), ('map', '목차'), ('building', '건물 보기'), ('keys', '한 줄 핵심'), ('dash', '종합 대시보드'), ('path', '개념 흐름'), ('how', '식구·사용법'), ('about', '자료와 원칙')]

def nav_html(label):
    a = ''.join(f'<a href="{"tower.html" if i == "building" else "#" + i}">{e(t)}</a>' for i, t in NAV)
    return f'<nav class="top" aria-label="섹션 바로가기"><div class="wrap"><a class="logo" href="index.html"><i></i>{e(label)}</a><div class="links">{a}</div></div></nav>\n'

# ---------- 건물 보기 쪽(tower.html) ----------
def tower_page(base_css, site):
    blk = tower.tower_html('lobby', standalone=True)
    return f"""<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>건물 보기 — C&amp;C 마켓 타워 · 미시경제학 연구실</title>
<meta name="description" content="미시경제학 연구실 열한 쪽과 실전 연습장을 가상의 경제연구원 C&amp;C 마켓 타워 12개 층으로 둘러보는 3D 건물 안내.">
<meta property="og:title" content="건물 보기 — C&amp;C 마켓 타워">
<meta property="og:image" content="{site}assets/og/cover_idx.jpg">
<meta property="og:url" content="{site}tower.html">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 0l7 4v8l-7 4-7-4V4z' fill='%239ab0d0'/%3E%3C/svg%3E">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap">
<style>
{base_css}
</style>
</head>
<body>
<nav class="top" aria-label="바로가기"><div class="wrap"><a class="logo" href="index.html"><i></i>미시경제학 연구실</a><div class="links"><a href="index.html">← 목차(미시경제학 해설)</a><a href="index.html#map">장 목록</a><a href="00_economic_models.html">CH0부터</a></div></div></nav>
{blk}
<section class="level"><div class="wrap stack">
<div class="lvhead"><h2>이 건물은</h2><p class="lead">{e(tower.COMPANY["motto"])}. 「미시경제학 연구실」 8장이 8개 연구실로, 4층 위 라운지와 9층 라운지가 중간·기말 요약정리 및 퀴즈로, 옥상이 실전 연습장으로 들어 있어요. 층을 누르거나 오른쪽 안내판에서 골라 올라가세요.</p></div>
<p class="muted" style="font-size:14px">{e(tower.COMPANY["note"])} 3D는 three.js(jsdelivr CDN)로 그립니다. 불러오지 못하면 안내판만으로 그대로 이동할 수 있어요.</p>
<p><a href="index.html">← 목차로 돌아가기</a></p>
</div></section>
<footer id="footer"><div class="wrap stack"><p>글 · 안상선 ((주)M-Robo 대표) · <a href="{WHO_PAGE}" target="_blank" rel="noopener">저자 소개</a> · <a href="https://github.com/adminmrobo/micro_economics" target="_blank" rel="noopener">GitHub 저장소</a><br>캐릭터 이름·설정·그림의 저작권은 안상선(개인)에게 있으며 허락 없이 쓸 수 없습니다.</p></div></footer>
</body>
</html>
"""
