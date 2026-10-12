import source from './cases.public.json';
// Selected anonymized project accounts, not an assertion of client publication consent.
export const cases = source.cases;
export const publishedCases = cases;
export type CaseStudy = typeof cases[number];
