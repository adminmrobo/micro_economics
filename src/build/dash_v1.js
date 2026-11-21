/* CH0 — 매몰비용과 한계조건 */
DASHES['00']={tag:'CH0',title:'참여 횟수 결정 대시보드',sub:'이미 낸 돈(매몰비용)과 한 번 더 할 때의 비용 — a=60, b=2 예시',play:'c',playLabel:'한 번 더 할 때 비용을 5→70으로',
  params:[['c','한 번 더 할 때 비용 c',5,70,1,30,F1.bind(null)],['Q','최대 횟수 Q',5,40,1,25,String],['S','매몰비용 S',0,600,10,200,String]],
  f:function(q){var a=60,b=2,N=function(x){return a*x-b*x*x/2-q.c*x},qs=clamp((a-q.c)/b,0,q.Q),xs=seqv(0,q.Q,60);
    return {k:[[F1(qs,1)+'회','최적 횟수 q*','g'],[F1(N(qs),0),'q*의 앞으로 순편익','g'],[F1(N(q.Q),0),'Q까지 채울 때','a'],[F1(N(qs)-q.S,0),'전체 성과(매몰비용 포함)',N(qs)-q.S<0?'r':'i']],
      c:[{t:'line',title:'앞으로 순편익 N(q)와 전체 성과 N(q) − S',xs:xs,ys:[{n:'앞으로',c:COL.g,d:xs.map(N)},{n:'전체',c:COL.r,dash:[5,4],d:xs.map(function(x){return N(x)-q.S})}],mark:{x:qs,y:N(qs),l:'q*'},xl:'참여 횟수',fx:function(v){return v.toFixed(0)}},
        {t:'bar',title:'두 계획의 성과 비교',vals:[N(qs),N(q.Q),N(qs)-q.S,N(q.Q)-q.S].map(function(v){return Math.max(0,+v.toFixed(0))}),labels:['q* 앞으로','Q 앞으로','q* 전체','Q 전체'],cols:[COL.fly,COL.robo,COL.fly,COL.robo],fy:function(v){return v}}],
      note:[['g','S를 움직여도 q*와 두 계획의 차이는 그대로예요. 이미 낸 돈은 비교에서 지워집니다.'],['a','막대가 0으로 보이면 전체 성과가 음수라는 뜻이에요(손실). 그래도 q*가 그만두는 것보다 낫습니다.']]}}};

/* CH01 — 소비자 선택 */
DASHES['01']={tag:'CH01',title:'장바구니와 수요 대시보드',sub:'코브-더글러스 선호에서 가격·소득이 수요와 만족을 어떻게 바꾸나 (pᵧ=2)',play:'px',playLabel:'x 가격을 1→10으로',
  params:[['px','x 가격',1,10,.5,4,String],['m','소득 m',40,200,10,100,String],['al','x 선호 α',.1,.9,.05,.8,function(v){return v.toFixed(2)}]],
  f:function(q){var py=2,u=function(x,y){return Math.pow(x,q.al)*Math.pow(y,1-q.al)},xs_=q.al*q.m/q.px,ys_=(1-q.al)*q.m/py,uh=u(q.m/(2*q.px),q.m/(2*py)),uo=u(xs_,ys_),ps=seqv(1,10,60);
    return {k:[[F1(xs_,1)+' / '+F1(ys_,1),'최적 묶음 x / y','g'],[F1(uo,2),'최적 효용','g'],[F1(uh,2),'반반 지출 효용','a'],[F1((1-uh/uo)*100,1)+'%','반반 규칙이 놓친 만족','r']],
      c:[{t:'line',title:'x의 수요곡선 (가로: 가격, 세로: 수량)',xs:ps,ys:[{n:'x 수요',c:COL.g,d:ps.map(function(p){return q.al*q.m/p})}],ymin:0,mark:{x:q.px,y:xs_,l:'지금'},xl:'x 가격',fx:function(v){return v.toFixed(0)}},
        {t:'bar',title:'지출 나누기: 최적 vs 반반',vals:[q.px*xs_,py*ys_,q.m/2,q.m/2].map(function(v){return +v.toFixed(1)}),labels:['최적 x','최적 y','반반 x','반반 y'],cols:[COL.fly,COL.fly,COL.robo,COL.robo]}],
      note:[['g','최적 묶음은 x에 소득의 α만큼을 써요. 가격이 바뀌어도 그 비율은 그대로라 수량만 달라져요.'],['a','α = 0.5이면 반반 규칙도 최적이에요. 선호가 한쪽으로 치우칠수록 반반 규칙의 손해가 커집니다.']]}}};

/* CH02 — 비용최소화 */
DASHES['02']={tag:'CH02',title:'투입 배합과 비용 대시보드',sub:'q = √(L·K)로 산출 10을 만들 때 (자본 사용료 r = 1)',play:'w',playLabel:'임금을 0.5→8로',
  params:[['w','임금 w',.5,8,.5,4,String],['q','목표 산출 q',2,20,1,10,String]],
  f:function(p){var r=1,al=.5,cost=function(w){var t=((1-al)/al)*(w/r),L=p.q*Math.pow(t,-(1-al));return w*L+r*t*L},t=((1-al)/al)*(p.w/r),L=p.q*Math.pow(t,-(1-al)),K=t*L,ws=seqv(.5,8,60);
    return {k:[['('+F1(L,1)+', '+F1(K,1)+')','최소비용 배합 (L, K)','g'],[F1(cost(p.w),1),'최소 총비용','g'],[F1((p.w+r)*p.q,1),'반반 배합 비용','r'],[F1((p.w+r)*p.q-cost(p.w),1),'반반 배합의 낭비','a']],
      c:[{t:'line',title:'임금에 따른 총비용',xs:ws,ys:[{n:'최소비용',c:COL.fly,d:ws.map(cost)},{n:'반반 배합',c:COL.robo,dash:[5,4],d:ws.map(function(w){return (w+r)*p.q})}],ymin:0,mark:{x:p.w,y:cost(p.w),l:'지금'},xl:'임금 w',fx:function(v){return v.toFixed(0)}},
        {t:'bar',title:'투입량 비교',vals:[L,K,p.q,p.q].map(function(v){return +v.toFixed(1)}),labels:['최적 L','최적 K','반반 L','반반 K'],cols:[COL.fly,COL.fly,COL.robo,COL.robo]}],
      note:[['g','임금이 오르면 노동을 줄이고 자본을 늘려요. 그래서 최소비용 곡선은 반반 배합 직선보다 천천히 오릅니다.'],['a','w = r(=1)일 때만 두 곡선이 만나요. 그때가 반반 배합이 최적인 유일한 경우예요.']]}}};

/* CH03 — 독점 */
DASHES['03']={tag:'CH03',title:'독점 가격 대시보드',sub:'수요 P = 100 − q, 비용 c·q + d·q²/2 — 매출 최대와 이윤 최대',play:'c',playLabel:'단위 비용을 0→80으로',
  params:[['c','단위 비용 c',0,80,2,20,String],['d','비용 증가 속도 d',0,3,.25,1,function(v){return v.toFixed(2)}]],
  f:function(p){var a=100,R=function(x){return (a-x)*x},V=function(x){return p.c*x+p.d*x*x/2},qR=50,qP=Math.max(0,(a-p.c)/(2+p.d)),xs=seqv(0,100,80),qc=p.d>0?(a-p.c)/(1+p.d):a-p.c;
    var W=function(x){return a*x-x*x/2-V(x)};
    return {k:[[F1(qP,1)+'개 · '+F1(a-qP,1),'이윤최대 수량 · 가격','g'],[F1(R(qP)-V(qP),0),'이윤최대의 이윤','g'],[F1(R(qR)-V(qR),0),'매출최대의 이윤','r'],[F1(W(qc)-W(qP),0),'경쟁 대비 사중손실','a']],
      c:[{t:'line',title:'매출과 이윤',xs:xs,ys:[{n:'매출',c:COL.s,d:xs.map(R)},{n:'이윤',c:COL.g,d:xs.map(function(x){return R(x)-V(x)})}],mark:{x:qP,y:R(qP)-V(qP),l:'이윤 꼭대기'},xl:'판매량',fx:function(v){return v.toFixed(0)}},
        {t:'bar',title:'이윤 비교',vals:[R(qP)-V(qP),R(qR)-V(qR)].map(function(v){return Math.max(0,+v.toFixed(0))}),labels:['MR = MC','매출 꼭대기'],cols:[COL.fly,COL.robo]}],
      note:[['g','비용이 0이면 두 꼭대기가 같아요. 비용이 커질수록 이윤 꼭대기는 왼쪽(덜 팔고 비싸게)으로 옮겨 갑니다.'],['a','독점은 경쟁보다 덜 팔아요. 그만큼 사라진 거래의 가치가 사중손실이에요.']]}}};

/* CH04 — 반복게임 */
DASHES['04']={tag:'CH04',title:'협조와 일탈 대시보드',sub:'죄수의 딜레마를 무한히 반복할 때 (P=5, h=5)',play:'d',playLabel:'δ를 0.05→0.95로',
  params:[['d','미래를 중시하는 정도 δ',.05,.95,.05,.4,function(v){return v.toFixed(2)}],['g','일탈의 추가 보수 g',1,10,1,5,String]],
  f:function(p){var P=5,h=5,C=P+h,D=C+p.g,Vc=function(d){return C/(1-d)},Vd=function(d){return D+d*P/(1-d)},ds=seqv(.05,.95,60),dstar=p.g/(p.g+h);
    return {k:[[F1(Vc(p.d),1),'계속 협조','g'],[F1(Vd(p.d),1),'한 번 일탈','a'],[F1(dstar,2),'협조 유지에 필요한 δ','m'],[Vc(p.d)>=Vd(p.d)?'협조':'일탈','이 δ에서 이기는 쪽','i']],
      c:[{t:'line',title:'δ에 따른 현재가치',xs:ds,ys:[{n:'협조',c:COL.fly,d:ds.map(Vc)},{n:'일탈',c:COL.robo,d:ds.map(Vd)}],ymin:0,ymax:Math.max(Vc(.9),Vd(.9))*1.05,mark:{x:p.d,y:Vc(p.d),l:'지금'},band:[dstar,.95],xl:'δ',fx:function(v){return v.toFixed(1)}},
        {t:'bar',title:'이번 기간과 그 뒤',vals:[C,D,C*p.d/(1-p.d),P*p.d/(1-p.d)].map(function(v){return +v.toFixed(1)}),labels:['협조: 오늘','일탈: 오늘','협조: 내일부터','일탈: 내일부터'],cols:[COL.fly,COL.robo,COL.fly,COL.robo]}],
      note:[['g','초록 띠는 협조가 이득인 δ 구간이에요. 일탈 보수 g가 커질수록 띠가 오른쪽으로 좁아져요.'],['a','오늘은 일탈이 늘 더 받아요. 차이는 내일부터 생기며, δ가 클수록 그 차이를 크게 봅니다.']]}}};

/* CH05 — 위험 나누기 */
DASHES['05']={tag:'CH05',title:'두 자산 위험 대시보드',sub:'기대수익률은 같고 흔들림만 다른 가상 자산 (σ₁ = 10, σ₂ = 25)',play:'rho',playLabel:'상관계수를 −0.95→0.95로',
  params:[['rho','함께 움직이는 정도 ρ',-.95,.95,.05,.5,function(v){return v.toFixed(2)}],['w','자산 1 비중 w',0,1,.05,.5,function(v){return v.toFixed(2)}]],
  f:function(p){var s1=10,s2=25,V=function(w){return w*w*s1*s1+(1-w)*(1-w)*s2*s2+2*w*(1-w)*p.rho*s1*s2},den=s1*s1+s2*s2-2*p.rho*s1*s2,ws=clamp((s2*s2-p.rho*s1*s2)/den,0,1),xs=seqv(0,1,60);
    return {k:[[F1(V(p.w),1),'지금 혼합의 분산',V(p.w)<=V(1)?'g':'r'],[F1(V(1),1),'자산 1 집중','m'],[F1(ws,2),'최소분산 비중','g'],[F1(V(ws),1),'최소 분산','g']],
      c:[{t:'line',title:'비중에 따른 분산',xs:xs,ys:[{n:'분산',c:COL.g,d:xs.map(V)}],ymin:0,mark:{x:p.w,y:V(p.w),l:'지금'},xl:'자산 1 비중',fx:function(v){return v.toFixed(1)}},
        {t:'bar',title:'세 선택의 분산',vals:[V(p.w),V(1),V(ws)].map(function(v){return +v.toFixed(1)}),labels:['지금 혼합','자산 1 집중','최소분산'],cols:[COL.fly,COL.robo,COL.g]}],
      note:[['g','최소분산 비중은 집중보다 결코 더 흔들리지 않아요. 하지만 아무 비중이나 섞으면 더 흔들릴 수 있어요.'],['i','교육용 가상 자산이에요. 투자 권유가 아닙니다.']]}}};

/* CH06 — 조세 */
DASHES['06']={tag:'CH06',title:'세금과 후생 대시보드',sub:'수요 P = 100 − b·Q, 공급 P = 20 + Q — 세수·부담·사중손실',play:'t',playLabel:'세금을 0→80으로',
  params:[['t','단위당 세금 τ',0,80,2,20,String],['b','수요 기울기 b',.25,4,.25,1,function(v){return v.toFixed(2)}]],
  f:function(p){var s=1,b=p.b,Q0=80/(b+s),P0=100-b*Q0,Qf=function(t){return Math.max(0,(80-t)/(b+s))},R=function(t){return t*Qf(t)},D=function(t){var Q=Qf(t);return 40*Q0-(b*Q*Q/2+s*Q*Q/2+t*Q)},Q=Qf(p.t),Bc=Q>0?(100-b*Q-P0)*Q:0,Bs=Q>0?(P0-20-s*Q)*Q:0,ts=seqv(0,80,60);
    return {k:[[F1(Q,1),'거래량','i'],[F1(R(p.t),0),'세수','g'],[F1(D(p.t),0),'사중손실','r'],[Math.round(b/(b+s)*100)+'%','구매자 부담 비율','m']],
      c:[{t:'line',title:'세율에 따른 세수와 사중손실',xs:ts,ys:[{n:'세수',c:COL.g,d:ts.map(R)},{n:'사중손실',c:COL.r,d:ts.map(D)}],ymin:0,mark:{x:p.t,y:R(p.t),l:'지금'},xl:'τ',fx:function(v){return v.toFixed(0)}},
        {t:'bar',title:'세금이 만든 숫자',vals:[Bc,Bs,R(p.t),D(p.t)].map(function(v){return +v.toFixed(0)}),labels:['구매자 부담','판매자 부담','세수','사중손실'],cols:[COL.s,COL.r,COL.g,COL.a]}],
      note:[['g','세수는 세율 40 근처에서 가장 커요(b=1일 때). 더 올리면 거래가 줄어 세수가 오히려 줄어요.'],['a','구매자 부담 + 판매자 부담 = 세수예요. 사중손실은 누구에게도 가지 않고 사라진 몫입니다.']]}}};

/* CH07 — 정보의 가치 */
DASHES['07']={tag:'CH07',title:'정보의 가치 대시보드',sub:'장비 보호 결정 — 위험 확률 0.4, 손실 50, 보호비 15',play:'t',playLabel:'신호 정확도를 0.5→1로',
  params:[['t','신호 정확도 t',.5,1,.01,.8,function(v){return v.toFixed(2)}],['f','정보료 f',0,12,.5,2,String]],
  f:function(p){var pr=.4,L=50,c=15,C0=Math.min(c,pr*L),Cs=function(t){var a=pr*t+(1-pr)*(1-t),b=1-a,qa=a>0?pr*t/a:0,qb=b>0?pr*(1-t)/b:0;return a*Math.min(c,L*qa)+b*Math.min(c,L*qb)},ev=function(t){return C0-Cs(t)},ts=seqv(.5,1,60);
    return {k:[[F1(C0,1),'정보 없이 기대비용','a'],[F1(Cs(p.t)+p.f,1),'신호 사서 쓴 기대비용','m'],[F1(ev(p.t),2),'신호의 총가치','g'],[ev(p.t)>p.f?'산다':'안 산다','정보료 '+p.f+'에서','i']],
      c:[{t:'line',title:'정확도에 따른 신호의 가치',xs:ts,ys:[{n:'총가치',c:COL.g,d:ts.map(ev)}],ymin:0,hline:p.f,hlabel:'정보료 '+p.f,mark:{x:p.t,y:ev(p.t),l:'지금'},xl:'정확도 t',fx:function(v){return v.toFixed(1)}},
        {t:'bar',title:'기대비용 비교 (낮을수록 좋음)',vals:[C0,Cs(p.t),Cs(p.t)+p.f,pr*Math.min(c,L)].map(function(v){return +v.toFixed(2)}),labels:['정보 없이','무료 신호','신호+정보료','완전정보'],cols:[COL.fly,COL.s,COL.robo,COL.g]}],
      note:[['g','정확도가 낮으면 신호를 봐도 행동이 바뀌지 않아 가치가 0이에요. 행동이 바뀌는 지점부터 가치가 생깁니다.'],['a','총가치가 정보료 선보다 위에 있을 때만 사는 것이 이득이에요.']]}}};

/* 목차 — 시장 균형 대시보드: 수요 P = a − Q, 공급 P = c + Q, 단위세 τ */
DASHES['mk']={tag:'목차 · 직접 해 보기',title:'수요·원가·세금을 바꾸면 시장은 어디서 멈출까',sub:'수요 P = (수요 크기) − Q, 공급 P = (원가) + Q인 설명용 시장 · 가상 단위',play:'t',playLabel:'세금을 0→60으로',
  params:[['a','수요 크기(최대 지불의사)',60,140,1,100,String],['c','원가(공급 시작 가격)',0,60,1,20,String],['t','단위당 세금 τ',0,60,1,0,String]],
  f:function(p){var a=p.a,c=p.c,t=p.t,Q0=Math.max(0,(a-c)/2),Q=Math.max(0,(a-c-t)/2),Pb=a-Q,Ps=c+Q,CS=Q*Q/2,PS=Q*Q/2,R=t*Q,W0=Q0*Q0,DWL=Math.max(0,W0-CS-PS-R);
    var m=[];if(a>100)m.push(['g','수요가 늘면(곡선 이동) 가격과 거래량이 함께 올라요.']);if(a<100)m.push(['a','수요가 줄면 가격과 거래량이 함께 내려가요.']);if(c>20)m.push(['a','원가가 오르면(공급 감소) 가격은 오르고 거래량은 줄어요.']);if(c<20)m.push(['g','원가가 내리면 가격은 내리고 거래량은 늘어요.']);
    if(t>0)m.push(['r','세금은 사는 사람 가격과 파는 사람 몫 사이에 쐐기(빨간 점선 사이)를 박아요. 부담은 둘이 나누고, 사라진 거래의 가치가 빨간 삼각형(사중손실)이에요 — CH06.']);
    if(!m.length)m.push(['i','처음 상태: 수요와 공급이 만나는 거래량 40, 가격 60이에요. 슬라이더를 하나씩만 움직여 보세요.']);
    var draw=function(cv,H){var P=plot(cv,H,{xlo:0,xhi:80,ylo:0,yhi:150,T:46,xl:'수량 Q',yl:'가격',title:'시장 그림 (면적 = 잉여)'});
      if(Q>0){P.poly([[0,a],[0,Pb],[Q,Pb]],COL.g,.22);P.poly([[0,Ps],[0,c],[Q,Ps]],COL.s,.22);if(t>0)P.poly([[0,Pb],[Q,Pb],[Q,Ps],[0,Ps]],COL.a,.28)}
      if(t>0&&Q0>Q)P.poly([[Q,Pb],[Q,Ps],[Q0,a-Q0]],COL.r,.35);
      P.fn(function(q){return a-q},COL.s,2.4,null,0,80);P.fn(function(q){return c+q},COL.r,2.4,null,0,80);
      if(t>0){P.fn(function(q){return c+q+t},COL.r,1.4,[5,4],0,80)}
      P.dot(Q0,a-Q0,COL.muted,4,t>0?'세전':'균형');if(t>0&&Q>0){P.dot(Q,Pb,COL.s,5,'사는 가격 '+Math.round(Pb));P.dot(Q,Ps,COL.r,5,'파는 몫 '+Math.round(Ps),8,16)}
      P.key([['소비자',COL.g],['생산자',COL.s],['세수',COL.a],['사중손실',COL.r]]);stamp(P.ctx,P.W,'가상 단위')};
    return {k:[[F1(Q,1),'거래량'+(t>0?' (세전 '+F1(Q0,1)+')':''),'i'],[Q>0?Math.round(Pb)+' / '+Math.round(Ps):'—','사는 사람 가격 / 파는 사람 몫','m'],[F1(CS+PS+R,0),'총잉여(세수 포함)','g'],[F1(DWL,0),'세금 때문에 사라진 잉여','r']],
      c:[{t:'fn',draw:draw},{t:'bar',title:'잉여는 어디로 갔나',vals:[CS,PS,R,DWL].map(function(v){return +v.toFixed(0)}),labels:['소비자잉여','생산자잉여','세수','사중손실'],cols:[COL.g,COL.s,COL.a,COL.r],ymax:Math.max(W0,1)*.75,hline:W0/2,hlabel:'세금 없을 때 각 잉여 '+F1(W0/2,0)}],
      note:m}}};
