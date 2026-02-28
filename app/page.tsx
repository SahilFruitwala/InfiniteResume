"use client";

import React, { useState } from "react";
import { LeftSidebar } from "./components/LeftSidebar";
import { RightSidebar } from "./components/RightSidebar";
import { Preview } from "./components/Preview";
import { ResumeData, TemplateType } from "./types";

const initialData: ResumeData = {
  personalInfo: {
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "linkedin.com/in/janedoe",
    summary:
      "A highly motivated and results-driven software engineer with <b>5+ years of experience</b> in full-stack development. Proven ability to architect and deliver scalable web applications. Passionate about <i>clean code</i>, user experience, and continuous learning.",
  },
  experience: [
    {
      id: "1",
      company: "Tech Innovators Inc.",
      position: "Senior Software Engineer",
      startDate: "Jan 2021",
      endDate: "Present",
      description:
        "<ul><li>Led a team of 4 developers to rebuild the core customer portal using <b>React</b> and <b>Node.js</b>, resulting in a <i>40% increase</i> in user engagement.</li><li>Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 60%.</li><li>Mentored junior engineers and conducted weekly code reviews.</li></ul>",
    },
    {
      id: "2",
      company: "Web Solutions LLC",
      position: "Software Engineer",
      startDate: "Jun 2018",
      endDate: "Dec 2020",
      description:
        "<ul><li>Developed and maintained multiple client websites using <b>React</b>, <b>Next.js</b>, and Tailwind CSS.</li><li>Integrated third-party APIs including Stripe for payments and SendGrid for email notifications.</li><li>Optimized database queries, improving application performance by <u>25%</u>.</li></ul>",
    },
  ],
  education: [
    {
      id: "1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      startDate: "Aug 2014",
      endDate: "May 2018",
    },
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Dashboard",
      description:
        "A comprehensive dashboard for e-commerce store owners to track sales, inventory, and customer data. Built with React, Redux, and Chart.js.",
      link: "github.com/janedoe/ecommerce-dashboard",
    },
  ],
  awards: [
    {
      id: "1",
      name: "Employee of the Year",
      issuer: "Tech Innovators Inc.",
      date: "Dec 2022",
      description:
        "Recognized for outstanding contributions to the core product.",
    },
  ],
  languages: [
    {
      id: "1",
      name: "English",
      proficiency: "Native",
    },
    {
      id: "2",
      name: "Spanish",
      proficiency: "Fluent",
    },
  ],
  volunteerWork: [
    {
      id: "1",
      organization: "Code for America",
      position: "Volunteer Developer",
      startDate: "Jan 2019",
      endDate: "Dec 2019",
      description: "Mentored local youth in web development basics.",
    },
  ],
  interests: [
    {
      id: "1",
      name: "Photography",
    },
    {
      id: "2",
      name: "Hiking",
    },
  ],
  skills: [
    {
      id: "1",
      name: "Languages",
      skills: "JavaScript, TypeScript, Python, HTML/CSS",
    },
    {
      id: "2",
      name: "Frameworks",
      skills: "React, Next.js, Node.js, Express",
    },
    {
      id: "3",
      name: "Tools",
      skills: "Git, Docker, AWS, Webpack, Figma",
    },
  ],
  socialLinks: [
    {
      id: "1",
      name: "LinkedIn",
      url: "https://linkedin.com/in/janedoe",
    },
    {
      id: "2",
      name: "GitHub",
      url: "https://github.com/janedoe",
    },
  ],
  typography: {
    fontFamily: "var(--font-inter)",
    fontSizeBody: 14,
    fontSizeHeading: 36,
    fontSizeSectionHeading: 18,
  },
  spacing: {
    sectionGap: 24,
    sectionTitleGap: 16,
    itemGap: 16,
    pageMarginTop: 32,
    pageMarginBottom: 32,
    bulletItemGap: 4,
    bulletListMargin: 4,
  },
  theme: {
    accentColor: "#0f172a", // slate-900
    professional: {
      sectionBorderColor: "#0f172a40",
    },
    modern: {
      accentColor: "#34d399",
    },
    minimal: {
      accentColor: "#0f172a",
    },
  },
  layout: {
    sectionOrder: [
      "summary",
      "experience",
      "education",
      "projects",
      "volunteerWork",
      "awards",
      "skills",
      "languages",
      "interests",
    ],
  },
};

import { useHistory } from "./hooks/useHistory";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const {
    state: resumeData,
    set: setResumeData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<ResumeData>("infinite-resume-data", initialData);
  const [template, setTemplate] = useState<TemplateType>("minimal");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full bg-slate-100 justify-center items-center">
        Loading resume builder...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans print:h-auto print:overflow-visible print:block">
      <LeftSidebar
        data={resumeData}
        onChange={setResumeData}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <Preview data={resumeData} template={template} />
      <RightSidebar
        data={resumeData}
        onChange={setResumeData}
        template={template}
        onTemplateChange={setTemplate}
      />
    </div>
  );
}
