/**
 * Optional helper for Codex's installed Playwright. No dependency installation.
 * This module DOES NOT execute site tests by itself.
 * Call after the requested scene is scrolled below the actual header and settled.
 * Numeric metrics must be marked data-numeric-role="metric|input|result|legal".
 * Findings require review; this does not rate aesthetics or prove WCAG compliance.
 */
export function classifyCopy(text, { numericRole = '' } = {}) {
  const value = String(text).trim();
  const out = [];
  if (/[\u2190-\u2199\u279c\u279d\u27f6]/u.test(value)) out.push('decorative-arrow');
  if (!['metric', 'input', 'result', 'legal'].includes(numericRole) &&
      /^(?:0?[1-9]|(?:шаг|этап)\s*0?[1-9])[.)]?$/iu.test(value)) out.push('possible-decorative-ordinal');
  return out;
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {{rootSelector:string,headerSelector?:string,nextHeadingSelector?:string|null,requireInitialViewportFit?:boolean,tolerance?:number}} options
 */
export async function auditScene(page, {
  rootSelector,
  headerSelector = 'header',
  nextHeadingSelector = null,
  requireInitialViewportFit = false,
  tolerance = 2,
}) {
  if (!rootSelector || !page?.evaluate) throw new TypeError('page and explicit rootSelector are required');
  return page.evaluate(({ rootSelector, headerSelector, nextHeadingSelector, requireInitialViewportFit, tolerance }) => {
    const root = document.querySelector(rootSelector);
    if (!root) throw new Error(`Missing scene root: ${rootSelector}`);
    const header = document.querySelector(headerSelector);
    const safeTop = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
    const safeBottom = window.visualViewport?.height ?? window.innerHeight;
    const findings = [];
    const shown = (e) => {
      if (!e?.getClientRects().length) return false;
      let current = e;
      while (current && current.nodeType === 1) {
        if(current.matches('details:not([open])')&&!current.querySelector(':scope > summary')?.contains(e))return false;
        const s = getComputedStyle(current);
        if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) === 0 || current.hidden) return false;
        current = current.parentElement;
      }
      return true;
    };
    const textNodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const e = n.parentElement;
      const text = n.textContent.trim();
      if (!text || !shown(e) || e.closest('script,style,template')) continue;
      const numericRole = e.closest('[data-numeric-role]')?.getAttribute('data-numeric-role') || '';
      if (/[\u2190-\u2199\u279c\u279d\u27f6]/u.test(text)) findings.push({ type: 'unicode-arrow', text });
      if (!['metric','input','result','legal'].includes(numericRole) && /^(?:0?[1-9]|(?:шаг|этап)\s*0?[1-9])[.)]?$/iu.test(text)) {
        findings.push({ type: 'possible-decorative-ordinal', text });
      }
      const range = document.createRange(); range.selectNodeContents(n);
      const rects = [...range.getClientRects()].map(r => ({top:r.top,bottom:r.bottom,left:r.left,right:r.right}));
      textNodes.push({text,rects});
      if (requireInitialViewportFit && !e.closest('[data-fit-exempt="decoration"]')) {
        for (const r of rects) if (r.top < safeTop-tolerance || r.bottom > safeBottom+tolerance) {
          findings.push({type:'important-text-outside-initial-viewport',text,rect:r}); break;
        }
      }
      // Detect common clipping by text ancestors. A local modal scroller must be tested separately.
      for (let p=e; p && p!==root.parentElement; p=p.parentElement) {
        const s=getComputedStyle(p), r=p.getBoundingClientRect();
        if (['hidden','clip'].includes(s.overflowY) && rects.some(t => t.top<r.top-tolerance || t.bottom>r.bottom+tolerance)) {
          findings.push({type:'possible-text-clipping-y',text,ancestor:p.className}); break;
        }
        if (['hidden','clip'].includes(s.overflowX) && rects.some(t => t.left<r.left-tolerance || t.right>r.right+tolerance)) {
          findings.push({type:'possible-text-clipping-x',text,ancestor:p.className}); break;
        }
      }
    }
    for (const e of [root,...root.querySelectorAll('*')]) {
      if (!shown(e)) continue;
      for (const pseudo of ['::before','::after','::marker']) {
        const content=getComputedStyle(e,pseudo).content;
        if (!content || ['none','normal','""'].includes(content)) continue;
        const value=content.replace(/^["']|["']$/g,'').trim();
        if (/[\u2190-\u2199\u279c\u279d\u27f6]/u.test(value) || /^(?:0?[1-9])[.)]?$/.test(value) || /counter\(/.test(value)) {
          findings.push({type:'pseudo-content-review',pseudo,content,element:e.className});
        }
      }
    }
    if (document.documentElement.scrollWidth > window.innerWidth+tolerance) findings.push({type:'page-horizontal-overflow'});
    if (requireInitialViewportFit && nextHeadingSelector) {
      const next=document.querySelector(nextHeadingSelector);
      if (shown(next)) {
        const r=next.getBoundingClientRect();
        if (r.top < safeBottom-tolerance && r.bottom > safeTop+tolerance) findings.push({type:'next-heading-peeks-into-initial-scene',text:next.textContent.trim()});
      }
    }
    return { rootSelector,viewport:{width:innerWidth,height:innerHeight},safeTop,safeBottom,
      requireInitialViewportFit,findings,textNodes,requiresHumanVisualReview:true,
      note:'Run separately for all active states. Initial-fit check is not a claim that arbitrary manual scroll must show one section.' };
  }, {rootSelector,headerSelector,nextHeadingSelector,requireInitialViewportFit,tolerance});
}
