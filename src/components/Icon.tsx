import type { ReactNode, SVGProps } from 'react';

type IconName = 'dashboard'|'truck'|'file'|'folder'|'chart'|'book'|'bell'|'link'|'search'|'plus'|'filter'|'chevron'|'arrow'|'clock'|'user'|'route'|'wallet'|'check'|'warning'|'more'|'calendar'|'building'|'car'|'package'|'signature'|'receipt'|'fuel'|'back'|'forward'|'expand'|'close'|'wrench'|'pulse'|'shield'|'key'|'users'|'settings';

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<IconName, ReactNode> = {
    dashboard:<><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    truck:<><path d="M3 7h11v10H3z"/><path d="M14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></>,
    file:<><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></>,
    folder:<><path d="M3 7h7l2 2h9v10H3z"/></>,
    chart:<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    book:<><path d="M4 5h7a3 3 0 0 1 3 3v11H7a3 3 0 0 0-3 1z"/><path d="M20 5h-3a3 3 0 0 0-3 3v11h3a3 3 0 0 1 3 1z"/></>,
    bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    link:<><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.5-1.5"/></>,
    search:<><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus:<><path d="M12 5v14M5 12h14"/></>,
    filter:<><path d="M4 6h16M7 12h10M10 18h4"/></>,
    chevron:<path d="m9 18 6-6-6-6"/>,
    arrow:<><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></>,
    user:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    route:<><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h3a4 4 0 0 1 4 4v4a4 4 0 0 0 3 4"/></>,
    wallet:<><path d="M4 6h14a2 2 0 0 1 2 2v10H4z"/><path d="M4 9h16"/><path d="M15 13h5"/></>,
    check:<path d="m5 12 4 4L19 6"/>,
    warning:<><path d="M12 3 2 21h20z"/><path d="M12 9v5M12 18h.01"/></>,
    more:<><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>,
    calendar:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
    building:<><path d="M4 21V8l8-4 8 4v13"/><path d="M8 12h2M14 12h2M8 16h2M14 16h2M10 21v-3h4v3"/></>,
    car:<><path d="M5 17h14l-1-6-2-3H8l-2 3z"/><circle cx="8" cy="18" r="2"/><circle cx="16" cy="18" r="2"/></>,
    package:<><path d="m12 3 8 4-8 4-8-4z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/></>,
    signature:<><path d="M3 18c3-5 5-8 7-8 2 0-1 6 1 6 2 0 3-5 5-5s0 4 2 4c1 0 2-1 3-2"/><path d="M3 21h18"/></>,
    receipt:<><path d="M6 3h12v18l-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    fuel:<><path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16"/><path d="M4 21h13M8 7h5v5H8z"/><path d="M16 8h2l2 2v7a2 2 0 0 1-4 0"/><path d="m19 9 2-2"/></>,
    back:<><path d="M19 12H5"/><path d="m10 17-5-5 5-5"/></>,
    forward:<><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    expand:<><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/><path d="m3 8 5-5M21 8l-5-5M3 16l5 5M21 16l-5 5"/></>,
    close:<><path d="M6 6l12 12M18 6 6 18"/></>,
    wrench:<><path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.4 2.4-3-3z"/></>,
    pulse:<><path d="M3 12h4l2-5 4 10 2-5h6"/><path d="M20 5.5A5 5 0 0 0 12 7 5 5 0 0 0 4 5.5"/></>,
    shield:<><path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/></>,
    key:<><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/></>,
    users:<><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5a3 3 0 0 1 0 6M17 14a5 5 0 0 1 4 5"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-4v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3.1 14H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.5V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" {...common} {...props}>{paths[name]}</svg>;
}
