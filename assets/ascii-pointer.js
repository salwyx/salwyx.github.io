(() => {
 const panel=document.querySelector('.design-sample'),svg=panel?.querySelector('.interactive-ascii svg');if(!svg)return;
 const glyphs=[...svg.querySelectorAll('text')].map(el=>({el,x:Number(el.getAttribute('x')),y:Number(el.getAttribute('y')),state:-1}));
 let point=null,scheduled=false;
 function paint(){scheduled=false;for(const g of glyphs){const distance=point?Math.hypot(g.x-point.x,g.y-point.y):Infinity;const state=!point?-1:distance<90?2:distance<145?1:0;if(state===g.state)continue;g.state=state;if(state===-1)g.el.style.removeProperty('fill');else g.el.style.fill=state===2?'#ff0019':state===1?'#ed3543':'#c8a9af';}}
 panel.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const ctm=svg.getScreenCTM();if(!ctm)return;const pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(ctm.inverse());point={x:pt.x,y:pt.y};if(!scheduled){scheduled=true;requestAnimationFrame(paint);}});
 panel.addEventListener('pointerleave',()=>{point=null;paint();});
})();