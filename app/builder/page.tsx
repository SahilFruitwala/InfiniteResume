"use client";

import React, { useState, useDeferredValue } from "react";
import { LeftSidebar } from "../components/LeftSidebar";
import { RightSidebar } from "../components/RightSidebar";
import { Preview } from "../components/Preview";
import { ResumeData, TemplateType } from "../types";

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
    accentColor: "#000000", // neutral black
    professional: {
      sectionBorderColor: "#00000040",
    },
    modern: {
      accentColor: "#000000",
    },
    minimal: {
      accentColor: "#000000",
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

import { motion, AnimatePresence } from "motion/react";

export default function Home() {
  const [resumeData, setResumeData] = React.useState<ResumeData>(initialData);
  const deferredResumeData = useDeferredValue(resumeData);
  const [template, setTemplate] = useState<TemplateType>("minimal");
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = React.useCallback(
    (side: "left" | "right") => {
      startTransition(() => {
        if (side === "left") setShowLeftSidebar((prev) => !prev);
        if (side === "right") setShowRightSidebar((prev) => !prev);
      });
    },
    [startTransition],
  );

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full bg-white dark:bg-[#050505] justify-center items-center text-black dark:text-white transition-colors">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-accent/20 rounded-none"></div>
            <div className="absolute inset-0 border-4 border-accent border-t-transparent animate-spin rounded-none"></div>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-black uppercase tracking-tighter animate-pulse">
              Infinite<span className="text-accent">Resume</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40 mt-2">
              Initializing Engine...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#050505] overflow-hidden font-sans print:h-auto print:overflow-visible print:block transition-colors">
      <AnimatePresence initial={false}>
        {showLeftSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="shrink-0 overflow-hidden h-full z-20 shadow-md shadow-slate-200/50 dark:shadow-slate-900/50"
          >
            <div className="w-80 md:w-96">
              <LeftSidebar data={resumeData} onChange={setResumeData} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Preview
        data={deferredResumeData}
        template={template}
        leftSidebarOpen={showLeftSidebar}
        rightSidebarOpen={showRightSidebar}
        onToggleLeftSidebar={() => toggleSidebar("left")}
        onToggleRightSidebar={() => toggleSidebar("right")}
      />

      <AnimatePresence initial={false}>
        {showRightSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="shrink-0 overflow-hidden h-full z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]"
          >
            <div className="w-[320px]">
              <RightSidebar
                data={resumeData}
                onChange={setResumeData}
                template={template}
                onTemplateChange={setTemplate}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
