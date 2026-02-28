export type PersonalInfo = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  link: string;
};

export type SocialLink = {
  id: string;
  name: string;
  url: string;
};

export type TypographySettings = {
  fontFamily: string;
  fontSizeBody: number;
  fontSizeHeading: number;
  fontSizeSectionHeading: number;
  fontSizeItemHeading?: number;
};

export type ThemeSettings = {
  accentColor: string;
  professional?: {
    sectionBorderColor?: string;
  };
  modern?: {
    accentColor?: string;
  };
  minimal?: {
    accentColor?: string;
  };
};

export type SpacingSettings = {
  sectionGap: number;
  sectionTitleGap: number;
  itemGap: number;
  pageMarginTop: number;
  pageMarginBottom: number;
  bulletItemGap?: number;
  bulletListMargin?: number;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string;
  projects: Project[];
  socialLinks: SocialLink[];
  typography: TypographySettings;
  spacing: SpacingSettings;
  theme: ThemeSettings;
};

export type TemplateType = 'minimal' | 'professional' | 'modern';
