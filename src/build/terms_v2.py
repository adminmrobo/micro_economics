"""2권 경제학 색인어 목록 쪽(terms.html)과 CSV. 등록부(KG_00_registry)에서 개념·용어만 모아 JEL 분류별로 묶는다."""
import os, html, csv, io
e = html.escape

def rows(REG):
    out = []
    for i, v in REG['ids'].items():
        if not i.startswith(('lab:concept/', 'lab:term/')): continue
        ext = [x for x in v.get('match', []) if x.get('verified')]
        out.append({'id': i, 'ko': v['ko'], 'en': v['en'], 'jel': v.get('jel', ''), 'page': v['page'],
                    'ext': ' '.join(x.get('uri', '') for x in ext)})
    return sorted(out, key=lambda r: (r['jel'], r['ko']))

def write(OUT, REG, B):
    R = rows(REG); codes = REG['schemes']['jel']['codes']; src = REG['schemes']['jel']['source']
    buf = io.StringIO(); w = csv.writer(buf)
    w.writerow(['id', 'label_ko', 'label_en', 'jel', 'jel_label_en', 'jel_label_ko', 'page', 'external_match'])
    for r in R: w.writerow([r['id'], r['ko'], r['en'], r['jel'], codes.get(r['jel'], {}).get('en', ''), codes.get(r['jel'], {}).get('ko', ''), r['page'] + '.html', r['ext']])
    open(os.path.join(OUT, 'KG_terms_index.csv'), 'w', encoding='utf-8-sig', newline='').write(buf.getvalue())
    n_ext = sum(1 for r in R if r['ext'])
    grp = {}
    for r in R: grp.setdefault(r['jel'], []).append(r)
    P = {'num': 'idx', 'ogkey': 'idx', 'short_title': '경제학 색인어', 'sources': [f'JEL 분류: American Economic Association, <a href="{src}">JEL Classification System</a> (2026-11-25 확인). 한국어 분류 이름은 이 시리즈가 옮겼습니다.'],
         'prev': ('index.html', '2권 목차')}
    title = '2권 경제학 색인어 — JEL 분류로 찾아보기'
    o = [B.head(P, title, '미시경제학 연구실 2권의 개념·용어 219개를 미국경제학회 JEL 분류 코드로 묶은 색인어 목록. 한·영 이름, JEL 코드, 설명 쪽 링크.', 'terms.html')]
    o.append(f'<nav class="top" aria-label="섹션 바로가기"><div class="wrap"><a class="logo" href="index.html"><i></i>{e(B.SERIES_SHORT)}</a><div class="links"><a href="index.html">목차</a><a href="#list">색인어</a><a href="KG_terms_index.csv">CSV</a></div></div></nav>')
    o.append('<style>.tq{width:100%;border-collapse:collapse;font-size:15px;table-layout:fixed}.tq td,.tq th{overflow-wrap:anywhere;word-break:keep-all}.tq th:nth-child(3),.tq td:nth-child(3){width:30%}@media(max-width:600px){.tq{font-size:13px}}.tq th,.tq td{border-bottom:1px solid #e3e6ef;padding:7px 8px;text-align:left;vertical-align:top}.tq th{background:#f6f7fb}'
             '.jh{margin:26px 0 6px;font-size:18px}.jh code{background:#eef2ff;border-radius:6px;padding:2px 7px;margin-right:6px}.jsub{color:#5d6278;font-size:14px;margin:0 0 6px}'
             '.jtoc{display:flex;flex-wrap:wrap;gap:6px}.jtoc a{border:1px solid #d9dceb;border-radius:999px;padding:3px 10px;font-size:14px;text-decoration:none}</style>')
    toc = ''.join(f'<a href="#jel-{c}"><b>{c}</b> {e(codes[c]["ko"])} ({len(grp[c])})</a>' for c in sorted(grp) if c)
    o.append(f'<header class="hero" id="hero"><div class="wrap stack"><span class="eyebrow">2권 · 경제학 색인어</span><h1>{e(title)}</h1>'
             f'<p class="lead2">2권의 개념·용어 <b>{len(R)}개</b>를 경제학 표준 분류인 <b>JEL 코드</b>(미국경제학회)로 묶었어요. 개념마다 대표 코드 하나를 붙였고, 각 장의 지식 색인과 온톨로지 꾸러미(JSON-LD·Turtle)에도 같은 코드가 <code>dct:subject</code>로 들어가 있어요. '
             f'외부 시소러스(위키데이터·STW) 연결은 확인된 것만 싣습니다 — 현재 <b>{n_ext}개</b>.</p>'
             f'<div class="jtoc">{toc}</div></div></header>')
    o.append('<section class="level" id="list"><div class="wrap stack">')
    for c in sorted(grp):
        lab = codes.get(c, {'en': '', 'ko': '분류 없음'})
        o.append(f'<h2 class="jh" id="jel-{c}"><code>{c}</code>{e(lab["ko"])}</h2><p class="jsub">{e(lab["en"])}</p>')
        o.append('<table class="tq"><thead><tr><th>색인어</th><th>영문</th><th>설명 쪽</th></tr></thead><tbody>' +
                 ''.join(f'<tr><td><b>{e(r["ko"])}</b></td><td>{e(r["en"])}</td><td><a href="{r["page"]}.html#kg">{e(r["page"])}</a></td></tr>' for r in grp[c]) + '</tbody></table>')
    o.append('</div></section>')
    o.append(B.footer(P, '<p><a href="KG_00_registry.json">등록부(JSON)</a> · <a href="KG_terms_index.csv">색인어 CSV</a></p>'))
    o.append('</body></html>\n')
    open(os.path.join(OUT, 'terms.html'), 'w', encoding='utf-8').write(''.join(o))
