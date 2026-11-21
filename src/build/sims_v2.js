/* 미시경제학 2권(교과서판) 전용 실험 — 그래프 검증 모듈과 장별 실험 */
function cf(x){return new Function('x','p','return ('+x+');')}
/* 그래프로 검증: 수식으로 구한 답(analytic)을 그래프 위에서 수치로 다시 찾아 비교
   cfg: {title, xl, yl, xlo, xhi, ylo, yhi, mode:'max'|'min'|'cross', curves:[{f, n, c}], t:곡선 번호(max/min), pair:[i,j](cross),
         ax:'수식 x 답(식, p 사용)', ay(선택), params:[[key,label,min,max,step,val]], unit, xname, digits} */
SIMS.verify=function(el,cfg){var H=cfg.h||250,c=S0(el,cfg,H,cfg.title),row=rows(el),K=kpis(el,4),E=eqline(el),I=insight(el);
  var p={},cs=(cfg.curves||[]).map(function(k){return {f:cf(k.f),n:k.n,c:COL[k.c]||k.c||COL.g,d:k.d}}),ax=cf(cfg.ax),ayf=cfg.ay?cf(cfg.ay):null,dg=cfg.digits==null?2:cfg.digits;
  (cfg.params||[]).forEach(function(q){p[q[0]]=q[5];S(row,q[1],q[2],q[3],q[4],q[5],q[6]?fx(q[6]):null,function(v){p[q[0]]=v;draw()})});
  function lim(k){var v=cfg[k];return typeof v==='string'?cf(v)(0,p):v}
  function solve(lo,hi){var N=1600,best=null,bx=lo;if(cfg.mode==='cross'){var A=cs[cfg.pair[0]].f,Bf=cs[cfg.pair[1]].f,prev=null;for(var i=0;i<=N;i++){var x=lo+(hi-lo)*i/N,d=A(x,p)-Bf(x,p);if(!isFinite(d)){prev=null;continue}if(prev!=null&&prev.d*d<=0){var a=prev.x,b=x;for(var k=0;k<60;k++){var m=(a+b)/2,dm=A(m,p)-Bf(m,p);if((A(a,p)-Bf(a,p))*dm<=0)b=m;else a=m}return (a+b)/2}prev={x:x,d:d}}return NaN}
    var f=cs[cfg.t||0].f,sg=cfg.mode==='min'?-1:1;for(var j=0;j<=N;j++){var x2=lo+(hi-lo)*j/N,v=sg*f(x2,p);if(isFinite(v)&&(best===null||v>best)){best=v;bx=x2}}
    var a2=Math.max(lo,bx-(hi-lo)/N),b2=Math.min(hi,bx+(hi-lo)/N),g=(Math.sqrt(5)-1)/2;for(var t=0;t<80;t++){var x1=b2-g*(b2-a2),x3=a2+g*(b2-a2);if(sg*f(x1,p)>sg*f(x3,p))b2=x3;else a2=x1}return (a2+b2)/2}
  function draw(){if(cfg.pre)runPre(cfg.pre,p);var xlo=lim('xlo'),xhi=lim('xhi'),ylo=lim('ylo'),yhi=lim('yhi');var P=plot(c,H,{xlo:xlo,xhi:xhi,ylo:ylo,yhi:yhi,xl:cfg.xl,yl:cfg.yl,title:cfg.title,T:cfg.curves.length>1?46:30});
    cs.forEach(function(k){P.fn(function(x){return k.f(x,p)},k.c,2.4,k.d?[5,4]:null,xlo,xhi)});if(cs.length>1)P.key(cs.map(function(k){return [k.n,k.c]}));
    var xa=ax(0,p),xg=solve(xlo,xhi),yv=function(x){return cfg.mode==='cross'?cs[cfg.pair[0]].f(x,p):cs[cfg.t||0].f(x,p)},ya=ayf?ayf(0,p):yv(xa),yg=yv(xg),ok=isFinite(xg)&&Math.abs(xa-xg)<=Math.max(1e-3,Math.abs(xa)*0.005)+(xhi-xlo)/1600;
    if(isFinite(xg)){P.seg(xg,ylo,xg,yg,COL.a,1.2,[3,3]);P.dot(xg,yg,COL.a,7,'')}if(isFinite(xa))P.dot(xa,ya,ok?COL.g:COL.r,4,'수식 답',8,-10);
    stamp(P.ctx,P.W,'수치 탐색 1,600점 + 정밀화');
    var nm=cfg.xname||'x*';
    K([[f1(xa,dg),'수식으로 구한 '+nm,'g'],[isFinite(xg)?f1(xg,dg):'—','그래프에서 찾은 '+nm,'a'],[isFinite(xg)?f1(Math.abs(xa-xg),4):'—','두 답의 차이','i'],[ok?'일치 ✓':'불일치 ✗','판정',ok?'g':'r']]);
    E((cfg.eq||'')+(cfg.eq?' · ':'')+'그래프: '+(cfg.mode==='cross'?'두 곡선이 만나는 점':cfg.mode==='min'?'곡선의 가장 낮은 점':'곡선의 가장 높은 점')+'을 1,600개 점으로 훑은 뒤 좁혀 찾음');
    I([[ok?'g':'r',ok?'수식 답(초록 점)과 그래프 답(주황 점)이 겹쳐요. 계산이 맞았다는 그림 증거예요.':'두 답이 달라요. 조건(범위·경계)을 다시 확인하세요. 경계에 걸린 모서리해일 수 있어요.'],['i',cfg.note||'조절기를 바꿔도 두 답이 계속 겹치는지 보세요. 한 숫자에서만이 아니라 공식 자체가 맞는지 확인하는 방법이에요.']])}
  addMod(c,function(dt){if(!dt)draw()});draw()};

/* ===== 데이터로 쓰는 실험·대시보드·대결 (페이지 데이터의 식 문자열을 그대로 계산) ===== */
var _CF={};function ex(s){if(typeof s!=='string')return function(){return s};return _CF[s]||(_CF[s]=new Function('x','p','return ('+s+');'))}
function tpl(s,p){return String(s).replace(/\{\{([\s\S]+?)\}\}/g,function(_,e){try{var v=ex(e)(0,p);return typeof v==='number'?(Number.isInteger(v)?String(v):f1(v,Math.abs(v)>=100?0:2)):v}catch(err){return '?'}})}
function runPre(code,p){if(code)new Function('p',code)(p)}
function colr(c){return COL[c]||c||COL.g}
/* 범용 실험: cfg = {title,h,xl,yl,xlo,xhi,ylo,yhi,params,buttons,pre,curves,fills,segs,pts,kpis,eq,ins,stamp} */
SIMS.curves=function(el,cfg){var H=cfg.h||260,c=S0(el,cfg,H,cfg.title),row=rows(el),K=kpis(el,(cfg.kpis||[]).length||4),E=eqline(el),I=insight(el),p={};
  (cfg.params||[]).forEach(function(q){p[q[0]]=q[5];S(row,q[1],q[2],q[3],q[4],q[5],q[6]!=null?fx(q[6]):null,function(v){p[q[0]]=v;draw()})});
  (cfg.buttons||[]).forEach(function(q){p[q[0]]=q[3];buttons(row,q[1],q[2],q[3],function(v){p[q[0]]=v;draw()})});
  function V(s){return ex(s)(0,p)}
  function draw(){runPre(cfg.pre,p);var P=plot(c,H,{xlo:V(cfg.xlo),xhi:V(cfg.xhi),ylo:V(cfg.ylo),yhi:V(cfg.yhi),xl:cfg.xl,yl:cfg.yl,title:cfg.title,T:(cfg.curves||[]).filter(function(k){return k.n}).length>1?46:30,fx:cfg.fx!=null?fx(cfg.fx):null,fy:cfg.fy!=null?fx(cfg.fy):null});
    (cfg.fills||[]).forEach(function(f){var pts=V(f.pts);if(pts&&pts.length)P.poly(pts,colr(f.c),f.a==null?.2:f.a)});
    (cfg.curves||[]).forEach(function(k){if(k.show&&!V(k.show))return;var f=ex(k.f);P.fn(function(x){return f(x,p)},colr(k.c),k.w||2.4,k.d?[5,4]:null,k.lo!=null?V(k.lo):null,k.hi!=null?V(k.hi):null)});
    (cfg.segs||[]).forEach(function(s){if(s.show&&!V(s.show))return;P.seg(V(s.x0),V(s.y0),V(s.x1),V(s.y1),colr(s.c),s.w||1.6,s.d?[4,4]:null)});
    var named=(cfg.curves||[]).filter(function(k){return k.n&&!(k.show&&!V(k.show))});if(named.length>1)P.key(named.map(function(k){return [k.n,colr(k.c)]}));
    (cfg.scatter||[]).forEach(function(sc){if(sc.show&&!V(sc.show))return;(V(sc.pts)||[]).forEach(function(q){if(isFinite(q[0])&&isFinite(q[1]))P.dot(q[0],q[1],colr(sc.c),sc.r||3,'')})});
    (cfg.pts||[]).forEach(function(q){if(q.show&&!V(q.show))return;var x=V(q.x),y=V(q.y);if(isFinite(x)&&isFinite(y))P.dot(x,y,colr(q.c),q.r||6,q.l?tpl(q.l,p):'',q.dx,q.dy)});
    stamp(P.ctx,P.W,cfg.stamp||'가상 단위');
    K((cfg.kpis||[]).map(function(k){return [tpl(k[0],p),tpl(k[1],p),k[2]||'i']}));if(cfg.eq)E(tpl(cfg.eq,p));
    var out=[];(cfg.ins||[]).forEach(function(r){if(out.length<3&&(r[0]===1||r[0]==='1'||V(r[0])))out.push([r[1],tpl(r[2],p)])});I(out)}
  addMod(c,function(dt){if(!dt)draw()});draw()};
/* 범용 대결: cfg = {pre, fly, robo, say, cond:{la, lb, preA, preB}} */
DUELS.expr=function(cfg){var p=Object.assign({},cfg.p||{});runPre(cfg.pre,p);var V=function(s){return ex(s)(0,p)};
  if(cfg.cond){var pa=Object.assign({},p,cfg.cond.a),pb=Object.assign({},p,cfg.cond.b);runPre(cfg.pre,pa);runPre(cfg.pre,pb);
    return {cond:true,condA:{label:cfg.cond.la,fly:ex(cfg.fly)(0,pa),robo:ex(cfg.robo)(0,pa)},condB:{label:cfg.cond.lb,fly:ex(cfg.fly)(0,pb),robo:ex(cfg.robo)(0,pb)},fly:ex(cfg.fly)(0,pa),robo:ex(cfg.robo)(0,pa),say:tpl(cfg.say,{a:pa,b:pb})}}
  return {fly:V(cfg.fly),robo:V(cfg.robo),say:tpl(cfg.say,p)}};
/* 데이터 대시보드: spec = {tag,title,sub,play,playLabel,params,pre,kpis,charts,notes} */
function specDash(S){return {tag:S.tag,title:S.title,sub:S.sub,play:S.play,playLabel:S.playLabel,
  params:S.params.map(function(q){return [q[0],q[1],q[2],q[3],q[4],q[5],q[6]!=null?fx(q[6]):String]}),
  f:function(p0){var p=Object.assign({},p0);runPre(S.pre,p);var V=function(s){return ex(s)(0,p)};
    var cs=S.charts.map(function(c){if(c.t==='bar')return {t:'bar',title:tpl(c.title,p),labels:c.labels,vals:c.vals.map(function(v){return +(+V(v)).toFixed(c.dec==null?2:c.dec)}),cols:c.cols.map(colr),hline:c.hline!=null?V(c.hline):null,hlabel:c.hlabel?tpl(c.hlabel,p):'',ymax:c.ymax!=null?V(c.ymax):null};
      var xs=seqv(V(c.x[0]),V(c.x[1]),80);return {t:'line',title:tpl(c.title,p),xs:xs,ys:c.ys.map(function(y){var f=ex(y.f);return {n:y.n,c:colr(y.c),dash:y.d?[5,4]:null,d:xs.map(function(x){return f(x,p)})}}),ymin:c.ymin!=null?V(c.ymin):null,ymax:c.ymax!=null?V(c.ymax):null,mark:c.mark?{x:V(c.mark.x),y:c.mark.y!=null?V(c.mark.y):null,l:c.mark.l}:null,xl:c.xl,hline:c.hline!=null?V(c.hline):null,hlabel:c.hlabel?tpl(c.hlabel,p):'',fx:function(v){return Math.abs(v)<10?(+v.toFixed(2)).toString():v.toFixed(0)}}});
    var nt=[];(S.notes||[]).forEach(function(r){if(nt.length<3&&(r[0]===1||V(r[0])))nt.push([r[1],tpl(r[2],p)])});
    return {k:S.kpis.map(function(k){return [tpl(k[0],p),tpl(k[1],p),k[2]||'i']}),c:cs,note:nt}}}}
