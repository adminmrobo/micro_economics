/* 2권 대시보드: 장별 복습 대시보드는 페이지 데이터(PD.dashes)에서 만들어 등록 */
function F1(v,d){return Number(v).toFixed(d==null?1:d)}
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

(function(){try{var o=(typeof PD!=='undefined'&&PD.dashes)||{};for(var k in o)DASHES[k]=specDash(o[k])}catch(e){console.error(e)}})();
