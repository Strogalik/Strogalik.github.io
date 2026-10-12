import {useId} from 'react';

// The only wash fills the outer shell. Its alpha reaches zero before OMS;
// the same bounded SVG is the explicit content for diagnostic SDK sampling.
export function StoryBackdrop() {
 const id=useId();
 return <svg viewBox="0 0 640 650" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true" focusable="false">
  <defs><linearGradient id={`${id}-wash`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#1F356E" stopOpacity=".08"/><stop offset=".3" stopColor="#1F356E" stopOpacity=".035"/><stop offset=".68" stopColor="#1F356E" stopOpacity="0"/></linearGradient></defs>
  <path fill={`url(#${id}-wash)`} d="M0 0h640v650H0z"/>
 </svg>;
}
