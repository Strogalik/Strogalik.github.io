export interface Service {
  id: string;
  title: string;
  category: "gas" | "engineering";
  summary: string;
  scope: string[];
  image?: string;
}
export interface ServiceCategory {
  id: string;
  title: string;
}
export interface Project {
  id: string;
  title: string;
  image: string;
  caption: string;
}
export interface FAQ {
  question: string;
  answer: string;
}
export interface Document {
  title: string;
  url: string;
}
export interface Partner {
  name: string;
  source: string;
}
export interface ContactDetails {
  phones: string[];
  address: string;
  entity: string;
  inn: string;
}
export interface SiteSettings {
  name: string;
  description: string;
  contacts: ContactDetails;
  documents: Document[];
}
export interface ContentProvider {
  settings(): SiteSettings;
  services(): Service[];
  faqs(): FAQ[];
  projects(): Project[];
}
