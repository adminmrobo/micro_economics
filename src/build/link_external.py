"""2권 개념·용어를 위키데이터 항목과 잇는 도구 — 위키데이터에 접속되는 컴퓨터에서 실행한다.

1) 후보 찾기:  python3 build/link_external.py find
   → src/pages_v2/ext_match_candidates.csv (개념마다 위키데이터 후보 3개: QID·이름·설명)
2) 사람이 CSV의 ok 열에 맞는 후보 번호(1~3)와 관계(exact/close)를 적는다. 확실하지 않으면 비워 둔다.
3) 반영:  python3 build/link_external.py apply
   → src/pages_v2/ext_match.json (확인된 것만 verified: true). 다시 빌드하면 꾸러미에 skos:exactMatch/closeMatch로 들어간다.

어림짐작으로 자동 확정하지 않는다: 이름이 같아도 다른 분야 항목일 수 있다.
"""
import csv, json, os, sys, time, urllib.parse, urllib.request
B = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(B))
REG = os.path.join(ROOT, 'v2', 'KG_00_registry.json')
CAND = os.path.join(ROOT, 'src', 'pages_v2', 'ext_match_candidates.csv')
OUT = os.path.join(ROOT, 'src', 'pages_v2', 'ext_match.json')
API = 'https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=en&type=item&limit=3&search='

def concepts():
    d = json.load(open(REG, encoding='utf-8'))['ids']
    return [(i, v['ko'], v['en'], v.get('jel', '')) for i, v in d.items() if i.startswith(('lab:concept/', 'lab:term/'))]

def find():
    rows = []
    for i, ko, en, jel in concepts():
        q = en.split(' (')[0]
        req = urllib.request.Request(API + urllib.parse.quote(q), headers={'User-Agent': 'micro-economics-lab/2.0 (adminmrobo.github.io)'})
        hits = json.load(urllib.request.urlopen(req, timeout=20)).get('search', [])
        r = [i, ko, en, jel]
        for h in hits[:3]: r += [h['id'], h.get('label', ''), h.get('description', '')]
        r += [''] * (13 - len(r)); r += ['', '']
        rows.append(r); time.sleep(0.2)
    with open(CAND, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f); w.writerow(['id', 'ko', 'en', 'jel', 'q1', 'label1', 'desc1', 'q2', 'label2', 'desc2', 'q3', 'label3', 'desc3', 'ok', 'rel']); w.writerows(rows)
    print('후보', len(rows), '→', CAND)

def apply():
    out = {}
    for r in csv.DictReader(open(CAND, encoding='utf-8-sig')):
        k = (r.get('ok') or '').strip()
        if k not in ('1', '2', '3') or not r.get('q' + k): continue
        rel = 'exactMatch' if (r.get('rel') or 'close').strip().startswith('exact') else 'closeMatch'
        out[r['id']] = [{'scheme': 'wikidata', 'id': r['q' + k], 'uri': 'http://www.wikidata.org/entity/' + r['q' + k], 'rel': rel, 'verified': True}]
    json.dump(out, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('확정', len(out), '→', OUT)

if __name__ == '__main__':
    {'find': find, 'apply': apply}[sys.argv[1] if len(sys.argv) > 1 else 'find']()
