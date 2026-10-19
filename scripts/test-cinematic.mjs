import { chromium, webkit, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const base=process.env.BASE_URL || 'http://localhost:3000';
const report={checks:[],errors:[]};
const frames=p=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const at=async(p,y)=>{await p.evaluate(top=>scrollTo({top,behavior:'instant'}),y);await frames(p);};
const bounds=l=>l.evaluate(e=>({top:e.getBoundingClientRect().top+scrollY,height:e.offsetHeight}));
const signature=l=>l.evaluate(e=>[...e.querySelectorAll('.journey-plane,.closing-type span,.scene-macro')].map(x=>({transform:getComputedStyle(x).transform.replace(/-?\d+\.\d+/g,n=>Number(n).toFixed(3)),clip:getComputedStyle(x).clipPath})));
for(const engine of [chromium,webkit]){
 const browser=await engine.launch();
 try {
  for(const [width,height] of [[320,844],[390,844],[768,900],[1440,900],[844,390]]){
   const p=await browser.newPage({viewport:{width,height},hasTouch:width<800});
   p.on('pageerror',e=>report.errors.push(e.message));
   await p.goto(base,{waitUntil:'networkidle'});
   const header=await p.locator('.site-header').boundingBox();
   for(const selector of ['.gateway-runway','.chapter-runway-wolf','.chapter-runway-music','.chapter-runway-receipt','.feedback-cta']){
    const scene=p.locator(selector), b=await bounds(scene);
    const begin=Math.max(0,b.top-height*.8), end=Math.min(b.top+b.height-height*.5,await p.evaluate(()=>document.documentElement.scrollHeight-innerHeight));
    await at(p,begin); const first=await signature(scene);
    await at(p,end); const last=await signature(scene);
    if(selector === '.gateway-runway' && height <= 740) expect(last).toEqual(first);
    else expect(last,`${engine.name()} ${width} ${selector} scroll linked`).not.toEqual(first);
    await at(p,begin);expect(await signature(scene)).toEqual(first);
    await at(p,end);const expected=await signature(scene);
    const savedY=await p.evaluate(()=>scrollY);
    // Allow native history to store the position before reloading the document.
    await p.waitForTimeout(150);
    await p.reload({waitUntil:'networkidle'});await frames(p);
    // Reload can legally restore to top when initiated from an instant scroll in automation;
    // re-enter the same scene and verify its scrubbed state is rebuilt without stale transforms.
    await at(p, savedY);
    const restored=await signature(p.locator(selector));
    expect(restored).toEqual(expected);
    expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
   }
   if(height>740){
    const b=await bounds(p.locator('.chapter-runway-music'));await at(p,b.top+120);
    const card=await p.locator('.app-card-music').boundingBox();
    expect(card.y, 'sticky chapter clears header').toBeGreaterThanOrEqual(header.height-1);
    const stage=await bounds(p.locator('.gateway-runway'));await at(p,stage.top+20);
    expect((await p.locator('.gateway-stage').boundingBox()).y).toBeGreaterThanOrEqual(header.height-1);
   }
   await p.emulateMedia({reducedMotion:'reduce'});
   await expect(p.locator('.gateway-stage')).toHaveCSS('position','relative');
   await expect(p.locator('.journey-plane').first()).not.toHaveAttribute('style',/translate3d/);
   await expect(p.locator('.app-card').first()).toHaveCSS('transform','none');
   await p.setViewportSize({width:width===1440?390:1440,height:900});
   await p.emulateMedia({reducedMotion:'no-preference'});
   await expect(p.locator('.gateway-stage')).toHaveCSS('position','sticky');
   report.checks.push({engine:engine.name(),width,height,reverse:true,midpageRefresh:true,reducedMotion:true,resize:true});
   await p.close();
  }
 } finally {await browser.close();}
}
expect(report.errors).toEqual([]);
if(process.env.QA_OUT){await mkdir(process.env.QA_OUT,{recursive:true});await writeFile(`${process.env.QA_OUT}/cinematic-regression.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify(report,null,2));
