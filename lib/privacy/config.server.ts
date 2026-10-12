import 'server-only';
import {buildAnalyticsConfig} from './config';
export function getAnalyticsConfig(){return buildAnalyticsConfig(process.env);}
