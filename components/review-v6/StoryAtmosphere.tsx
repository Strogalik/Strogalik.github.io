import s from './content.module.css';

// One static brand motif, shared by every topic. It carries no product data.
export function StoryAtmosphere() {
 return <div className={s.atmosphere} aria-hidden="true" data-story-atmosphere>
  <svg viewBox="0 0 480 860" fill="none" focusable="false">
   <defs>
    <linearGradient id="tms-ribbon-light" x1="140" y1="100" x2="450" y2="800" gradientUnits="userSpaceOnUse">
     <stop stopColor="#A6C5D7" stopOpacity=".06"/>
     <stop offset=".5" stopColor="#0F52BA" stopOpacity=".07"/>
     <stop offset="1" stopColor="#D6E6F3" stopOpacity="0"/>
    </linearGradient>
   </defs>
   <path d="M450-60C120 110 80 270 280 430S530 650 390 860L420 885C567 665 518 593 318 433S170 135 480-60Z" fill="url(#tms-ribbon-light)"/>
   <path d="M450-60C120 110 80 270 280 430S530 650 390 860" stroke="#A6C5D7" strokeOpacity=".24" strokeWidth="1.5"/>
   <path d="M480-60C170 135 128 282 318 433S567 665 420 885" stroke="#A6C5D7" strokeOpacity=".18" strokeWidth="1"/>
  </svg>
 </div>;
}
