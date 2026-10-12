'use client';
import type {ReactNode,CSSProperties} from 'react';
import s from '../review-v6/review.module.css';
import reflow from './reflow.module.css';
import {PrivacyProvider} from './privacy/PrivacyProvider';
import {analyticsOff,type AnalyticsConfig} from '@/lib/privacy/profile';
import {Header,Footer} from './ApprovedViews';
import {CaseExplorerProvider} from './CaseExplorer';
import {CookieNotice} from './CookieNotice';
import {ConsultationProvider} from './Consultation';
export function SiteShell({children,analyticsConfig=analyticsOff}:{children:ReactNode;analyticsConfig?:AnalyticsConfig}){return <div className={`${s.review} ${reflow.publicPage}`} id="v6-top" style={{'--review-header':'88px'} as CSSProperties} data-v6-review data-public-site><noscript><style>{'[data-v6-review] button{display:none!important}'}</style></noscript><PrivacyProvider config={analyticsConfig}><ConsultationProvider><CaseExplorerProvider><Header/>{children}<Footer/><CookieNotice/></CaseExplorerProvider></ConsultationProvider></PrivacyProvider></div>;}
