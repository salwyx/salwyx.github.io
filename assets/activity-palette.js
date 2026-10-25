/* Keep the daily GitHub snake as an isolated SVG image, with page colours. */
(() => {
 const image=document.querySelector('.activity img');
 if(!image)return;
 let source='',last='',frame=0;
 function paint(){
  frame=0;if(!source)return;
  const css=getComputedStyle(document.documentElement);
  const accent=css.getPropertyValue('--accent').trim();
  const rawSurface=css.getPropertyValue('--surface').trim();
  const surface=rawSurface.length===4?'#'+[...rawSurface.slice(1)].map(c=>c+c).join(''):rawSurface;
  const dark=document.documentElement.dataset.theme==='dark';
  const key=accent+surface+dark;if(key===last)return;last=key;
  const mix=(a,b,n)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*n+parseInt(b.slice(i,i+2),16)*(1-n)).toString(16).padStart(2,'0')).join('');
  const empty=dark?'#56606d':'#c4c9d0';
  const colours={cb:dark?'#ffffff12':'#1b1f230a',cs:accent,ce:empty,c0:empty,c1:mix(accent,surface,.32),c2:mix(accent,surface,.55),c3:mix(accent,surface,.78),c4:accent};
  const svg=source.replace(/--(cb|cs|ce|c[0-4]):[^;}]+/g,(_,name)=>'--'+name+':'+colours[name]);
  image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 }
 window.addEventListener('appearancechange',()=>{if(!frame)frame=requestAnimationFrame(paint);});
 fetch(image.src).then(r=>{if(!r.ok)throw Error('Activity unavailable');return r.text();}).then(svg=>{
  if(!svg.trim().startsWith('<svg')||!svg.includes('--cs:'))return;
  source=svg;paint();
 }).catch(()=>{/* The original daily image remains available as a fallback. */});
})();
