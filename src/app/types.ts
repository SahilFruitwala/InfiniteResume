export type PersonalInfo = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  profilePicture?: string;
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

export type Award = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
};

export type Language = {
  id: string;
  name: string;
  proficiency: string;
};

export type Volunteer = {
  id: string;
  organization: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Interest = {
  id: string;
  name: string;
};

export type CustomSectionItem = {
  id: string;
  title: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  location?: string;
};

export type CustomSection = {
  id: string;
  title: string;
  items: CustomSectionItem[];
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
  previewTheme?: 'light' | 'dark';
  professional?: {
    sectionBorderColor?: string;
  };
  modern?: {
    accentColor?: string;
  };
  minimal?: {
    accentColor?: string;
  };
  academic?: {
    accentColor?: string;
  };
  creative?: {
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
  pageSize?: 'A4' | 'LETTER';
};

export type SkillCategory = {
  id: string;
  name: string;
  skills: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  awards: Award[];
  languages: Language[];
  volunteerWork: Volunteer[];
  interests: Interest[];
  socialLinks: SocialLink[];
  customSections?: CustomSection[];
  typography: TypographySettings;
  spacing: SpacingSettings;
  theme: ThemeSettings;
  layout?: {
    sectionOrder: string[];
  };
};

export type TemplateType = 'minimal' | 'professional' | 'modern' | 'academic' | 'creative';
