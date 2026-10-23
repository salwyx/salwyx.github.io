(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),narrow=()=>matchMedia('(max-width:600px)').matches;
 const sections=[...document.querySelectorAll('.intro-grid,.terminal-stage,.brian-corner,.stack-panel,.social-grid,.activity,.hackathon-invite')];
 if(!reduced.matches&&'IntersectionObserver'in window){sections.forEach(el=>el.classList.add('motion-reveal'));document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{rootMargin:'0px 0px 50px 0px',threshold:.04});sections.forEach(el=>observer.observe(el));}
 const panels=[...document.querySelectorAll('.about-copy,.personal-notes,.terminal-stage,.brian-corner,.stack-panel,.social-grid,.activity,.hackathon-invite')];
 panels.forEach((el,i)=>{el.classList.add('scroll-panel');el.dataset.parallaxDirection=i%2?'1':'-1'});
 const typeLayers=[...document.querySelectorAll('[data-type-depth]')],layers=[...document.querySelectorAll('.art-divider canvas,.portrait-frame canvas')],geometry=new Map();let pending=false;
 // Offset geometry is independent of transforms: no feedback from the previous frame.
 function box(el){let top=0,node=el;while(node){top+=node.offsetTop;node=node.offsetParent;}return {top,height:el.offsetHeight};}
 function measure(){[...panels,...typeLayers,...layers.map(el=>el.parentElement)].forEach(el=>geometry.set(el,box(el)));schedule();}
 function phase(el){const r=geometry.get(el)||box(el);return Math.max(-1,Math.min(1,(r.top+r.height/2-scrollY-innerHeight/2)/innerHeight));}
 function update(){pending=false;const small=narrow();
  typeLayers.forEach(el=>{const depth=Number(el.dataset.typeDepth),amount=el.classList.contains('role-line')?(small?3:5):(small?5:8);el.style.transform=reduced.matches?'none':`translate3d(0,${phase(el)*depth*amount}px,0)`;});
  panels.forEach(el=>el.style.setProperty('--panel-shift',`${reduced.matches?0:phase(el)*(small?6:10)*Number(el.dataset.parallaxDirection)}px`));
  layers.forEach(el=>{if(reduced.matches){el.style.transform='none';return;}const adam=el.parentElement.classList.contains('art-divider'),amount=adam?(small?8:12):(small?14:20);el.style.transform=`translate3d(0,${phase(el.parentElement)*amount}px,0) scale(${adam?1.07:1.1})`;});
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);addEventListener('load',measure);document.fonts?.ready.then(measure);reduced.addEventListener('change',measure);if('ResizeObserver'in window)new ResizeObserver(measure).observe(document.querySelector('main'));measure();
 if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.querySelectorAll('.about-copy,.guitar-card,.design-sample,.brian-corner,.hackathon-invite,.terminal-stage').forEach(el=>{el.addEventListener('pointermove',e=>{if(reduced.matches)return;if(e.target.closest('a,button')){el.style.transform='';return;}const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(1200px) rotateX(${-y*1.2}deg) rotateY(${x*1.2}deg)`;});el.addEventListener('pointerleave',()=>el.style.transform='');});}
})();
