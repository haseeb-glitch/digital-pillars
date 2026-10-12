'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Heart, MoreHorizontal, Pause, Play, ShieldCheck, Sparkles } from 'lucide-react';

// The source video contains distorted lettering. Keep this preview copy editable.
const testimonials = [
  {kind:'review',name:'Sarah M.',role:'Creative Director',initial:'S',quote:'A thoughtful team with a clear vision. Every detail feels considered, from our first conversation to the final experience.',brand:'Modern brands. Meaningful results.'},
  {kind:'quote',name:'Jane R.',role:'Founder, Creative Studio',initial:'J',quote:'The team gave our brand a fresh perspective and a clearer direction, tailored to our goals from the very beginning.',brand:''},
  {kind:'review',name:'Anna D.',role:'Brand Director',initial:'P',quote:'Understanding what we needed, then creating something that felt entirely our own. A brilliant experience from start to finish.',brand:'Made for what comes next.'},
  {kind:'metric',name:'Mark S.',role:'Growth Partner',initial:'',quote:'A partnership built on clarity.',brand:'Digital foundations',metric:'1M',metricLabel:'Reach',secondMetric:'9,938',secondLabel:'Connections'},
  {kind:'review',name:'Priya K.',role:'Business Owner',initial:'P',quote:'Our vision, brought to life with care. The process was collaborative, the thinking was clear, and the result speaks for itself.',brand:'A stronger digital presence.'},
  {kind:'quote',name:'James T.',role:'Project Director',initial:'J',quote:'Beautifully designed and easy to use. We finally have a digital experience that reflects the quality of our work.',brand:''}
];
const ease=[.22,1,.36,1] as const;

export default function Testimonials(){
 const [index,setIndex]=useState(1);const [paused,setPaused]=useState(false);const [hovered,setHovered]=useState(false);const [focused,setFocused]=useState(false);const [mobile,setMobile]=useState(false);
 const root=useRef<HTMLElement>(null);const drag=useRef<{x:number,y:number}|null>(null);const inView=useInView(root,{amount:.35});const reduce=useReducedMotion();
 useEffect(()=>{const q=window.matchMedia('(max-width: 767px)');const update=()=>setMobile(q.matches);update();q.addEventListener('change',update);return()=>q.removeEventListener('change',update)},[]);
 useEffect(()=>{if(!inView||paused||hovered||focused||reduce)return;const timer=window.setInterval(()=>setIndex(n=>(n+1)%testimonials.length),5200);return()=>window.clearInterval(timer)},[inView,paused,hovered,focused,reduce]);
 function move(step:number){setIndex(n=>(n+step+testimonials.length)%testimonials.length)}
 function offset(i:number){let n=(i-index+testimonials.length)%testimonials.length;if(n>testimonials.length/2)n-=testimonials.length;return n}
 return <section id="reviews" className="testimonials-section" ref={root} aria-labelledby="testimonials-title">
  <div className="testimonial-atmosphere" aria-hidden="true"/>
  <div className="testimonials-heading"><span>Premium Pillars</span><h2 id="testimonials-title">Testimonials</h2></div>
  <div className="testimonials-carousel" role="region" aria-roledescription="carousel" aria-label="Client testimonials" tabIndex={0}
   onPointerEnter={()=>setHovered(true)} onPointerLeave={()=>{setHovered(false);drag.current=null}}
   onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setFocused(false)}}
   onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1)}else if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}}}
   onPointerDown={e=>{if((e.target as Element).closest('button'))return;drag.current={x:e.clientX,y:e.clientY}}}
   onPointerUp={e=>{if(!drag.current)return;const x=e.clientX-drag.current.x,y=e.clientY-drag.current.y;drag.current=null;if(Math.abs(x)>40&&Math.abs(x)>Math.abs(y))move(x<0?1:-1)}}>
   <div className="testimonials-stage">
    {testimonials.map((t,i)=>{const position=offset(i);const center=position===0;const visible=Math.abs(position)<=2;
     return <motion.article key={t.name} className={'glass testimonial-card testimonial-'+t.kind+(center?' is-current':'')} aria-label={`${i+1} of ${testimonials.length}: ${t.name}`} aria-hidden={!visible}
       animate={{x:`${position*(mobile?92:102)}%`,y:center?0:mobile?14:23,rotateY:position===0?0:position<0?17:-17,rotateZ:position===0?0:position<0?1.2:-1.2,scale:center?1:mobile?.83:.86,opacity:visible?(Math.abs(position)===2?.53:1):0,zIndex:10-Math.abs(position)}}
       transition={{duration:reduce?0:.85,ease}} onClick={()=>{if(!center)setIndex(i)}}>
       <span className="glass-rim-glint glint-top" aria-hidden="true"/><span className="glass-rim-glint glint-bottom" aria-hidden="true"/>
       <div className="testimonial-content">
        {t.kind==='quote'?<span className="quote-opening" aria-hidden="true">“</span>:t.kind==='metric'?<span className="testimonial-symbol"><Sparkles size={22}/></span>:i===0||i===4?<img className="testimonial-top-avatar" src="/images/project-portrait.webp" alt="" loading="lazy"/>:<span className="testimonial-monogram">{t.initial}</span>}
        {t.kind!=='quote'&&<span className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</span>}
        {t.kind==='metric'?<div className="testimonial-metric-copy"><small>Client</small><h3>{t.name}</h3><p>{t.quote}</p><ArrowRight size={31}/></div>:<><blockquote>{t.quote}</blockquote>{t.brand&&<p className="testimonial-caption">{t.brand}</p>}<span className="quote-closing" aria-hidden="true">”</span></>}
       </div>
       <footer className="testimonial-footer">
        {t.kind==='metric'?<><div className="testimonial-client"><small>Powered by</small><b>Digital Pillars</b></div><div className="testimonial-small-stat"><small>{t.metricLabel}</small><b>{t.metric}</b></div><div className="testimonial-small-stat"><small>{t.secondLabel}</small><b>{t.secondMetric}</b></div></>:<><img className="testimonial-avatar" src="/images/project-portrait.webp" alt="" loading="lazy"/><div className="testimonial-author"><h3>{t.name}</h3><p>{t.role}</p></div>{t.kind==='quote'?<span className="testimonial-trust" aria-label="Trusted partnership"><Heart size={15} fill="currentColor"/><ShieldCheck size={15}/></span>:<MoreHorizontal className="testimonial-more" size={23}/>}</>}
       </footer>
      </motion.article>
    })}
   </div>
   <button className="testimonial-nav testimonial-prev" aria-label="Previous testimonial" onClick={()=>move(-1)}><ChevronLeft/></button><button className="testimonial-nav testimonial-next" aria-label="Next testimonial" onClick={()=>move(1)}><ChevronRight/></button>
  </div>
  <div className="testimonials-controls"><div className="testimonial-pagination" aria-label="Choose testimonial">{testimonials.map((t,i)=><button key={t.name} aria-label={`Show testimonial ${i+1}: ${t.name}`} aria-pressed={i===index} onClick={()=>setIndex(i)} className={i===index?'is-active':''}/>)}</div><button className="testimonial-pause" aria-label={paused?'Play testimonials':'Pause testimonials'} aria-pressed={paused} onClick={()=>setPaused(v=>!v)}>{paused?<Play size={13}/>:<Pause size={13}/>}</button></div>
 </section>
}
