import s from './disclosure.module.css';
// State comes from the native parent details, including without JavaScript.
export function DisclosureIcon(){return <span className={s.icon} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" focusable="false"><path d="M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path className={s.vertical} d="M10 4v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></span>;}
