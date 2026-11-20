(function(g){'use strict';
function exchange(s){const {a,b,ex,ey}=s,X=10,Y=10,bx=X-ex,by=Y-ey;const p=(a*ey+b*by)/((1-a)*ex+(1-b)*bx);const ma=p*ex+ey,mb=p*bx+by,ax=a*ma/p,ay=(1-a)*ma,cx=b*mb/p,cy=(1-b)*mb;const demand=q=>{let ia=q*ex+ey,ib=q*bx+by;return {zx:a*ia/q+b*ib/q-X,zy:(1-a)*ia+(1-b)*ib-Y}};const uA=(x,y)=>x**a*y**(1-a),uB=(x,y)=>x**b*y**(1-b);return{...s,X,Y,p,ax,ay,bx:cx,by:cy,ma,mb,uA,uB,ua:uA(ax,ay),ub:uB(cx,cy),oldA:uA(ex,ey),oldB:uB(bx,by),demand,contract:x=>{if(x===0)return 0;if(x===X)return Y;const A=a/(1-a),B=b/(1-b);return B*x*Y/(A*(X-x)+B*x)}}}
function production(s){const {l,k}=s,L=10,K=10;const x=Math.sqrt(l*k),y=Math.sqrt((L-l)*(K-k));return{...s,x,y,mrtsx:l>0?k/l:null,mrtsy:l<L?(K-k)/(L-l):null,efficient:Math.abs(l-k)<1e-8,loss:10-x-y}}
const models={exchange,production};if(typeof module!=='undefined')module.exports=models;g.GE=models;
})(typeof window==='undefined'?globalThis:window);
