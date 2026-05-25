/**
 * GET /api/v1/today/weather.js
 *
 * 天气粒子渲染脚本 — 通过 <script src> 引入即可获得天气视觉特效。
 *
 * 用法:
 *   <script src="/api/v1/today/weather.js" defer></script>
 *
 * 自动检测地理位置 → 调用 /api/v1/weather-theme.json → 渲染云/雨/雪/太阳/闪电等粒子。
 * 支持 prefers-reduced-motion，移动端自适应减少粒子密度。
 * 30 分钟 sessionStorage 缓存天气数据，减少 API 请求。
 */
export const prerender = false;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const CACHE = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600',
};

const SCRIPT = String.raw`(function(){"use strict";
var CACHE_KEY='td_weather_v2';
var CACHE_TTL=30*60*1000;
var prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var isMobile=window.innerWidth<768;
var W={
  clear:{icon:'☀️',label:'晴'},
  clouds:{icon:'☁️',label:'多云'},
  fog:{icon:'🌫️',label:'雾'},
  rain:{icon:'🌧️',label:'雨'},
  drizzle:{icon:'🌦️',label:'毛毛雨'},
  snow:{icon:'❄️',label:'雪'},
  thunderstorm:{icon:'⛈️',label:'雷暴'}
};

function mkel(tag,cls,text){var e=document.createElement(tag);e.className=cls;e.style.cssText='position:absolute;pointer-events:none;z-index:-1;';if(text)e.textContent=text;return e;}

function getAnimClass(){return prefersReducedMotion?'':'wa-anim';}

function cacheGet(){try{var r=sessionStorage.getItem(CACHE_KEY);if(!r)return null;var e=JSON.parse(r);if(Date.now()-e.ts>CACHE_TTL){sessionStorage.removeItem(CACHE_KEY);return null}return e.data}catch(e){return null}}

function cacheSet(d){try{sessionStorage.setItem(CACHE_KEY,JSON.stringify({ts:Date.now(),data:d}))}catch(e){}}

function clearParticles(){
  var old=document.querySelectorAll('.wa-particle,.wa-sun-el,.wa-flash-el');
  for(var i=0;i<old.length;i++)old[i].remove();
}

function getContainer(){
  var c=document.getElementById('td-extensions');
  if(!c){c=document.createElement('div');c.id='td-extensions';c.style.cssText='position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden';document.body.appendChild(c);}
  return c;
}

function renderParticles(type){
  clearParticles();
  var container=getContainer();
  var frag=document.createDocumentFragment();
  var anim=getAnimClass();

  if(type==='clear'||type==='sunny'){
    var sun=mkel('div','wa-sun-el','☀️');sun.style.cssText='position:fixed;top:80px;right:5%;font-size:3rem;opacity:0.45;pointer-events:none;z-index:0;filter:drop-shadow(0 0 40px rgba(255,200,60,0.35))';if(anim)sun.classList.add(anim);sun.setAttribute('aria-hidden','true');document.body.appendChild(sun);
  }

  else if(type==='clouds'){
    var defs=[{w:160,h:70,s:0.45,d:85,o:0.028,b:3},{w:200,h:85,s:0.55,d:75,o:0.032,b:2},{w:130,h:55,s:0.70,d:60,o:0.040,b:1},{w:180,h:75,s:0.85,d:50,o:0.048,b:0},{w:220,h:90,s:1.05,d:38,o:0.058,b:0}];
    for(var ci=0;ci<defs.length;ci++){
      var cd=defs[ci];
      var c=mkel('div','wa-cloud wa-particle');
      var topPct=8+(ci/(defs.length-1))*34+(Math.random()-0.5)*8;
      c.style.top=Math.max(6,Math.min(45,topPct))+'%';
      c.style.width=cd.w+'px';c.style.height=cd.h+'px';
      c.style.opacity=String(cd.o);c.style.transform='scale('+cd.s+')';
      if(cd.b>0)c.style.filter='blur('+cd.b+'px)';
      if(anim)c.classList.add(anim);
      c.style.animationDuration=cd.d+'s';
      c.style.animationDelay=(-(Math.random()*cd.d)).toFixed(1)+'s';
      var svg=buildCloudSvg(cd.w,cd.h);
      c.appendChild(svg);frag.appendChild(c);
    }
  }

  else if(type==='fog'||type==='mist'||type==='haze'){
    for(var fi=0;fi<4;fi++){
      var f=mkel('div','wa-cloud wa-particle');
      f.style.top=(8+fi*22)+'%';f.style.width=(280+fi*80)+'px';f.style.height='28px';
      f.style.opacity=String(0.03+fi*0.006);f.style.filter='blur('+(6+fi*3)+'px)';
      if(anim)f.classList.add(anim);
      f.style.animationDuration=(90+fi*15)+'s';
      f.style.animationDelay=(-(Math.random()*90)).toFixed(1)+'s';
      var svgF=document.createElementNS('http://www.w3.org/2000/svg','svg');
      svgF.setAttribute('width','400');svgF.setAttribute('height','28');svgF.setAttribute('viewBox','0 0 400 28');
      svgF.style.color='var(--color-text-muted)';
      var rect=document.createElementNS('http://www.w3.org/2000/svg','rect');
      rect.setAttribute('width','400');rect.setAttribute('height','28');rect.setAttribute('rx','14');rect.setAttribute('fill','currentColor');
      svgF.appendChild(rect);f.appendChild(svgF);frag.appendChild(f);
    }
  }

  else if(type==='rain'||type==='drizzle'){
    var rc=Math.round((isMobile?22:40));
    for(var ri=0;ri<rc;ri++){
      var d=mkel('div','wa-raindrop wa-particle','|');
      d.style.left=(Math.random()*98)+'%';d.style.top=(-(Math.random()*15))+'%';
      d.style.animationDuration=(0.55+Math.random()*0.7)+'s';
      d.style.animationDelay=(-(Math.random()*2)).toFixed(2)+'s';
      d.style.fontSize=(10+Math.random()*10)+'px';
      d.style.opacity=String(0.10+Math.random()*0.18);
      d.style.color='var(--color-text-muted)';
      if(anim)d.classList.add(anim);frag.appendChild(d);
    }
  }

  else if(type==='snow'){
    var sc=Math.round((isMobile?18:32));
    for(var si=0;si<sc;si++){
      var fl=mkel('div','wa-snowflake wa-particle');fl.textContent=Math.random()>0.5?'❄':'❅';
      fl.style.left=(Math.random()*98)+'%';fl.style.top=(-(Math.random()*20))+'%';
      fl.style.animationDuration=(5+Math.random()*6)+'s';
      fl.style.animationDelay=(-(Math.random()*6)).toFixed(2)+'s';
      fl.style.fontSize=(7+Math.random()*14)+'px';
      fl.style.opacity=String(0.10+Math.random()*0.20);fl.style.color='var(--color-text-muted)';
      if(anim)fl.classList.add(anim);frag.appendChild(fl);
    }
  }

  else if(type==='thunderstorm'){
    var tc=Math.round((isMobile?22:40));
    for(var ti=0;ti<tc;ti++){
      var td=mkel('div','wa-raindrop wa-particle','|');
      td.style.left=(Math.random()*98)+'%';td.style.top=(-(Math.random()*15))+'%';
      td.style.animationDuration=(0.5+Math.random()*0.6)+'s';
      td.style.animationDelay=(-(Math.random()*1.5)).toFixed(2)+'s';
      td.style.fontSize=(11+Math.random()*12)+'px';
      td.style.opacity=String(0.14+Math.random()*0.20);td.style.color='var(--color-text-muted)';
      if(anim)td.classList.add(anim);frag.appendChild(td);
    }
    var flash=document.createElement('div');flash.className='wa-flash-el';flash.style.cssText='position:fixed;inset:0;background:rgba(255,255,255,0.04);pointer-events:none;z-index:0';if(anim)flash.classList.add(anim);flash.setAttribute('aria-hidden','true');document.body.appendChild(flash);
  }

  if(frag.childNodes.length>0)container.appendChild(frag);
}

function buildCloudSvg(w,h){
  var ns='http://www.w3.org/2000/svg';
  var svg=document.createElementNS(ns,'svg');
  svg.setAttribute('width',String(w));svg.setAttribute('height',String(h));
  svg.setAttribute('viewBox','0 0 '+w+' '+h);svg.style.color='var(--color-text-muted)';
  var els=[['ellipse',{cx:String(Math.round(w*0.22)),cy:String(Math.round(h*0.68)),rx:String(Math.round(w*0.22)),ry:String(Math.round(h*0.28))},{fill:'currentColor'}],
    ['ellipse',{cx:String(Math.round(w*0.48)),cy:String(Math.round(h*0.45)),rx:String(Math.round(w*0.28)),ry:String(Math.round(h*0.38))},{fill:'currentColor'}],
    ['ellipse',{cx:String(Math.round(w*0.74)),cy:String(Math.round(h*0.62)),rx:String(Math.round(w*0.20)),ry:String(Math.round(h*0.26))},{fill:'currentColor'}]];
  for(var i=0;i<els.length;i++){
    var e=document.createElementNS(ns,els[i][0]);
    var attrs=els[i][1];var keys=Object.keys(attrs);
    for(var j=0;j<keys.length;j++)e.setAttribute(keys[j],attrs[keys[j]]);
    svg.appendChild(e);
  }
  return svg;
}

function applyAmbient(type){
  var solidBg=document.querySelector('.keep-solid-bg');
  if(solidBg&&(type==='rain'||type==='drizzle'||type==='snow'||type==='thunderstorm'||type==='fog')){
    solidBg.style.backdropFilter='none';solidBg.style.webkitBackdropFilter='none';
  }
}

function loadAmbiance(lat,lon){
  var url=lat&&lon?'/api/v1/weather-theme.json?lat='+encodeURIComponent(lat)+'&lon='+encodeURIComponent(lon):'/api/v1/weather-theme.json';
  fetch(url).then(function(res){if(!res.ok)throw new Error('HTTP '+res.status);return res.json()}).then(function(data){
    var w=data.weather;cacheSet({type:w.type,city:w.city,temp:w.temperature,desc:w.description});
    applyAmbient(w.type);renderParticles(w.type);
  })['catch'](function(err){console.warn('ThemeDist weather: skipped ('+(err.message||'unknown')+')');});
}

function init(){
  var cached=cacheGet();
  if(cached){applyAmbient(cached.type);renderParticles(cached.type);return;}
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      function(pos){loadAmbiance(String(pos.coords.latitude),String(pos.coords.longitude));},
      function(){loadAmbiance();},
      {enableHighAccuracy:false,timeout:8000,maximumAge:600000}
    );
  }else{loadAmbiance();}
}

if(typeof requestIdleCallback==='function'){requestIdleCallback(init,{timeout:3000});}
else{setTimeout(init,1200);}
})();`;

const CSS = String.raw`/* ═══════════════════════════════════════════════
   ThemeDist Weather Paticle Animations
   ═══════════════════════════════════════════════ */
.wa-cloud { will-change: transform; }
.wa-cloud.wa-anim { animation: wa-drift linear infinite; }
@keyframes wa-drift {
  0%   { transform: translateX(-120px); }
  100% { transform: translateX(calc(100vw + 200px)); }
}
.wa-raindrop { will-change: transform; }
.wa-raindrop.wa-anim { animation: wa-fall linear infinite; }
@keyframes wa-fall {
  0%   { transform: translateY(-8vh); opacity: 0; }
  8%   { opacity: 0.25; }
  92%  { opacity: 0.25; }
  100% { transform: translateY(108vh); opacity: 0; }
}
.wa-snowflake { will-change: transform; }
.wa-snowflake.wa-anim { animation: wa-snowfall linear infinite, wa-sway 4s ease-in-out infinite; }
@keyframes wa-snowfall {
  0%   { transform: translateY(-5vh); }
  100% { transform: translateY(108vh); }
}
@keyframes wa-sway {
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(16px); }
}
.wa-sun-el.wa-anim { animation: wa-rotate 24s linear infinite; }
@keyframes wa-rotate {
  0%   { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(180deg) scale(1.06); }
  100% { transform: rotate(360deg) scale(1); }
}
.wa-flash-el.wa-anim { animation: wa-flash 7s ease-out infinite; }
@keyframes wa-flash {
  0%, 91%, 100% { opacity: 0; }
  92% { opacity: 1; }
  94% { opacity: 0; }
  96% { opacity: 0.4; }
  98% { opacity: 0; }
}
#td-extensions { position: fixed !important; inset: 0 !important; z-index: 0 !important; pointer-events: none !important; overflow: hidden !important; }
@media (max-width: 768px) {
  .wa-sun-el { font-size: 2.5rem !important; top: 4% !important; right: 4% !important; }
}`;

export async function GET() {
  const body = `/*!
 * ThemeDist Weather Particles v1.0
 * License: GPL-3.0
 * Auto-generated — do not edit directly.
 * Source: GET /api/v1/today/weather.js
 */
${CSS}

${SCRIPT}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      ...CORS_HEADERS,
      ...CACHE,
    },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
