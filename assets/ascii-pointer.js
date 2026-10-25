/* A single raster surface replaces 2,918 animated SVG DOM nodes. */
(() => {
 const panel=document.querySelector('.design-sample'),canvas=panel?.querySelector('.interactive-ascii canvas');if(!canvas)return;
 const ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let glyphs,point=null,visible=false,raf=0,last=0,start=performance.now();
 const frame=document.createElement('canvas');frame.width=1440;frame.height=252;const f=frame.getContext('2d');
 const hot=document.createElement('canvas');hot.width=1440;hot.height=252;const h=hot.getContext('2d');
 canvas.width=1440;canvas.height=252;
 // Cache each glyph once, retaining the original SVG's 4-unit text length.
 const sprites=new Map();function sprite(char){if(sprites.has(char))return sprites.get(char);const c=document.createElement('canvas');c.width=12;c.height=18;const x=c.getContext('2d');x.font='700 10.6px "DejaVu Sans Mono",monospace';x.fillStyle='#ec232c';const width=x.measureText(char).width;x.scale(8/width,1);x.fillText(char,0,13);sprites.set(char,c);return c;}
 function paint(now){raf=0;if(!visible||document.hidden||!glyphs)return;const t=(now-start)/1000;
 if(now-last>=160){f.clearRect(0,0,1440,252);for(const [x,y,char,dur,begin,b] of glyphs){const phase=((t-begin)%dur+dur)%dur/dur;const a=phase<.46||phase>=.94;if((reduced.matches||window.profileLowMotion)?b:a===b)continue;const sp=sprite(char);f.drawImage(sp,0,0,8,18,x*2,y*2-13,8,18);}
 ctx.clearRect(0,0,1440,252);ctx.drawImage(frame,0,0);
 if(point){h.clearRect(0,0,1440,252);h.globalCompositeOperation='source-over';h.drawImage(frame,0,0);h.globalCompositeOperation='source-in';const g=h.createRadialGradient(point.x,point.y,0,point.x,point.y,290);g.addColorStop(0,'#ff0019');g.addColorStop(.62,'#ff0019');g.addColorStop(1,'#c8a9af');h.fillStyle=g;h.fillRect(0,0,1440,252);ctx.drawImage(hot,0,0);}last=now;}
 if(!reduced.matches&&!window.profileLowMotion)raf=requestAnimationFrame(paint);
 }
 function wake(){if(!raf&&visible&&!document.hidden&&glyphs)raf=requestAnimationFrame(paint);}
 panel.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();point={x:(e.clientX-r.left)*1440/r.width,y:(e.clientY-r.top)*252/r.height};if(reduced.matches){last=0;}wake();},{passive:true});panel.addEventListener('pointerleave',()=>{point=null;last=0;wake();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(raf);raf=0;}else wake();},{rootMargin:'80px'}).observe(canvas);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();});reduced.addEventListener('change',()=>{last=0;wake();});
 try{glyphs=JSON.parse(document.getElementById('signature-data').textContent);wake();}catch{canvas.replaceWith(Object.assign(new Image(),{src:'assets/fastboot-ascii.svg',alt:'fastboot'}));}
})();
