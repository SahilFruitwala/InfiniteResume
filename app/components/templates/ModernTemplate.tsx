import React, { memo } from "react";
import Image from "next/image";
import { ResumeData } from "../../types";
import { isColorTooDarkForDarkBg } from "../../utils/colorUtils";

export const ModernTemplate = memo(({ data }: { data: ResumeData }) => {
  const { typography, spacing, theme } = data;

  const sectionGap = spacing?.sectionGap ?? 24;
  const sectionTitleGap = spacing?.sectionTitleGap ?? 16;
  const itemGap = spacing?.itemGap ?? 16;
  const pageMarginTop = spacing?.pageMarginTop ?? 32;
  const pageMarginBottom = spacing?.pageMarginBottom ?? 32;
  const isDark = data.theme?.previewTheme === "dark";
  const defaultAccentColor = isDark ? "#34d399" : "#10b981"; // emerald-400 : emerald-600
  let accentColor =
    theme?.modern?.accentColor ?? theme?.accentColor ?? defaultAccentColor;
  if (isDark && isColorTooDarkForDarkBg(accentColor)) {
    accentColor = defaultAccentColor;
  }

  const defaultOrder = [
    "summary",
    "experience",
    "education",
    "projects",
    "volunteerWork",
    "awards",
    "skills",
    "languages",
    "interests",
  ];
  const currentOrder = data.layout?.sectionOrder || defaultOrder;

  const leftSectionsList = ["education", "skills", "languages", "interests"];
  const rightSectionsList = [
    "summary",
    "experience",
    "projects",
    "volunteerWork",
    "awards",
    ...currentOrder.filter((id) => id.startsWith("custom-")),
  ];

  const sortedLeftSections = [...leftSectionsList].sort((a, b) => {
    const indexA =
      currentOrder.indexOf(a) === -1 ? 999 : currentOrder.indexOf(a);
    const indexB =
      currentOrder.indexOf(b) === -1 ? 999 : currentOrder.indexOf(b);
    return indexA - indexB;
  });

  const sortedRightSections = [...rightSectionsList].sort((a, b) => {
    const indexA =
      currentOrder.indexOf(a) === -1 ? 999 : currentOrder.indexOf(a);
    const indexB =
      currentOrder.indexOf(b) === -1 ? 999 : currentOrder.indexOf(b);
    return indexA - indexB;
  });

  const renderLeftSection = (sectionId: string) => {
    switch (sectionId) {
      case "education":
        return data.education.length > 0 ? (
          <section key="education" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-bold uppercase tracking-wider"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
              }}
            >
              Education
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: `${itemGap}px`,
              }}
            >
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3
                    className="font-semibold text-white"
                    style={{
                      fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                    }}
                  >
                    {edu.degree}
                  </h3>
                  <div className="text-[0.95em] text-slate-400 mb-1">
                    {edu.institution}
                  </div>
                  <span className="text-[0.85em] text-slate-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case "skills":
        return data.skills && data.skills.length > 0 ? (
          <section key="skills" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-bold uppercase tracking-wider"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
              }}
            >
              Skills
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: `${itemGap}px`,
              }}
            >
              {data.skills.map((category) => (
                <div key={category.id}>
                  <h3
                    className="font-semibold text-white mb-1"
                    style={{
                      fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                    }}
                  >
                    {category.name}
                  </h3>
                  <div
                    className="text-slate-300 leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: category.skills }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case "languages":
        return data.languages && data.languages.length > 0 ? (
          <section key="languages" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-bold uppercase tracking-wider"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
              }}
            >
              Languages
            </h2>
            <div className="flex flex-col gap-2 text-[0.95em] text-slate-300">
              {data.languages.map((lang) => (
                <div
                  key={lang.id}
                  className="flex justify-between items-center"
                >
                  <span className="font-medium text-white">{lang.name}</span>
                  {lang.proficiency && (
                    <span className="text-[0.85em] text-slate-400">
                      {lang.proficiency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case "interests":
        return data.interests && data.interests.length > 0 ? (
          <section key="interests" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-bold uppercase tracking-wider"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
              }}
            >
              Interests
            </h2>
            <div className="flex flex-wrap gap-2 text-[0.9em] text-slate-300">
              {data.interests.map((i) => (
                <span
                  key={i.id}
                  className="bg-slate-700/50 px-3 py-1 rounded-full"
                >
                  {i.name}
                </span>
              ))}
            </div>
          </section>
        ) : null;
      default:
        return null;
    }
  };

  const renderRightSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        return data.personalInfo.summary ? (
          <section key="summary" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
              }}
            >
              <span className="w-8 h-px bg-slate-300"></span>
              Profile
            </h2>
            <div
              className="leading-relaxed text-slate-600 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
              dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
            />
          </section>
        ) : null;
      case "experience":
        return data.experience.length > 0 ? (
          <section key="experience" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
              }}
            >
              <span className="w-8 h-px bg-slate-300"></span>
              Experience
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: `${itemGap}px`,
              }}
            >
              {data.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="relative pl-4 border-l-2 border-slate-200"
                >
                  <div
                    className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3
                      className="font-bold text-slate-800"
                      style={{
                        fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                      }}
                    >
                      {exp.position}
                    </h3>
                    <span
                      className="text-[0.85em] font-medium px-2 py-1 rounded-full"
                      style={{
                        color: accentColor,
                        backgroundColor: `${accentColor}15`,
                      }}
                    >
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-500 mb-2 uppercase tracking-wide text-[0.95em]">
                    {exp.company}
                  </div>
                  <div
                    className="text-slate-600 leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case "projects":
        return data.projects.length > 0 ? (
          <section key="projects" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
              }}
            >
              <span className="w-8 h-px bg-slate-300"></span>
              Projects
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: `${itemGap}px`,
              }}
            >
              {data.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="relative pl-4 border-l-2 border-slate-200"
                >
                  <div
                    className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3
                      className="font-bold text-slate-800"
                      style={{
                        fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                      }}
                    >
                      {proj.name}
                    </h3>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[0.85em] font-medium hover:underline"
                        style={{ color: accentColor }}
                      >
                        {proj.link}
                      </a>
                    )}
                  </div>
                  <div
                    className="text-slate-600 leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: proj.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case "volunteerWork":
        return data.volunteerWork && data.volunteerWork.length > 0 ? (
          <section
            key="volunteerWork"
            style={{ marginBottom: `${sectionGap}px` }}
          >
            <h2
              className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
              }}
            >
              <span className="w-8 h-px bg-slate-300"></span>
              Volunteer
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: `${itemGap}px`,
              }}
            >
              {data.volunteerWork.map((vol) => (
                <div
                  key={vol.id}
                  className="relative pl-4 border-l-2 border-slate-200"
                >
                  <div
                    className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3
                      className="font-bold text-slate-800"
                      style={{
                        fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                      }}
                    >
                      {vol.position}
                    </h3>
                    <span
                      className="text-[0.85em] font-medium px-2 py-1 rounded-full"
                      style={{
                        color: accentColor,
                        backgroundColor: `${accentColor}15`,
                      }}
                    >
                      {vol.startDate} - {vol.endDate}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-500 mb-2 uppercase tracking-wide text-[0.95em]">
                    {vol.organization}
                  </div>
                  <div
                    className="text-slate-600 leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: vol.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case "awards":
        return data.awards && data.awards.length > 0 ? (
          <section key="awards" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
              }}
            >
              <span className="w-8 h-px bg-slate-300"></span>
              Awards
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: `${itemGap}px`,
              }}
            >
              {data.awards.map((award) => (
                <div
                  key={award.id}
                  className="relative pl-4 border-l-2 border-slate-200"
                >
                  <div
                    className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3
                      className="font-bold text-slate-800"
                      style={{
                        fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                      }}
                    >
                      {award.name}
                    </h3>
                    <span
                      className="text-[0.85em] font-medium px-2 py-1 rounded-full"
                      style={{
                        color: accentColor,
                        backgroundColor: `${accentColor}15`,
                      }}
                    >
                      {award.date}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-500 mb-1 tracking-wide text-[0.95em]">
                    {award.issuer}
                  </div>
                  <div
                    className="text-slate-600 leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: award.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      default:
        if (sectionId.startsWith("custom-")) {
          const customId = sectionId.replace("custom-", "");
          const section = data.customSections?.find((s) => s.id === customId);
          if (section && section.items.length > 0) {
            return (
              <section
                key={sectionId}
                style={{ marginBottom: `${sectionGap}px` }}
              >
                <h2
                  className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-3"
                  style={{
                    fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                    marginBottom: `${sectionTitleGap}px`,
                  }}
                >
                  <span className="w-8 h-px bg-slate-300"></span>
                  {section.title}
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: `${itemGap}px`,
                  }}
                >
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative pl-4 border-l-2 border-slate-200"
                    >
                      <div
                        className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3
                          className="font-bold text-slate-800"
                          style={{
                            fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                          }}
                        >
                          {item.title}
                        </h3>
                        {item.startDate && (
                          <span
                            className="text-[0.85em] font-medium px-2 py-1 rounded-full"
                            style={{
                              color: accentColor,
                              backgroundColor: `${accentColor}15`,
                            }}
                          >
                            {item.startDate} - {item.endDate || "Present"}
                          </span>
                        )}
                      </div>
                      {(item.subtitle || item.location) && (
                        <div className="font-semibold text-slate-500 mb-2 uppercase tracking-wide text-[0.95em]">
                          {item.subtitle}
                          {item.subtitle && item.location ? ", " : ""}
                          {item.location}
                        </div>
                      )}
                      {item.description && (
                        <div
                          className="text-slate-600 leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }
        }
        return null;
    }
  };

  return (
    <div
      className="flex bg-white text-gray-800 max-w-4xl mx-auto w-full min-h-[1056px] shadow-sm"
      style={
        {
          fontFamily: typography?.fontFamily || "var(--font-roboto)",
          fontSize: `${typography?.fontSizeBody || 14}px`,
          "--bullet-gap": `${spacing?.bulletItemGap ?? 4}px`,
          "--list-margin": `${spacing?.bulletListMargin ?? 4}px`,
        } as React.CSSProperties
      }
    >
      {/* Left Column */}
      <div
        data-print-wrapper
        className="w-1/3 bg-slate-800 text-white px-8 flex flex-col gap-8"
        style={{
          paddingTop: `${pageMarginTop}px`,
          paddingBottom: `${pageMarginBottom}px`,
        }}
      >
        <header style={{ marginBottom: `${sectionGap}px` }}>
          {data.personalInfo.profilePicture && (
            <div className="mb-6 rounded-full overflow-hidden w-32 h-32 border-4 border-slate-700 mx-auto group relative">
              <Image
                src={data.personalInfo.profilePicture}
                alt="Profile"
                width={128}
                height={128}
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1
            className={`font-bold uppercase tracking-wider mb-2 leading-tight ${data.personalInfo.profilePicture ? "text-center" : ""}`}
            style={{ fontSize: `${typography?.fontSizeHeading || 36}px` }}
          >
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <div
            className={`w-12 h-1 mb-6 ${data.personalInfo.profilePicture ? "mx-auto" : ""}`}
            style={{ backgroundColor: accentColor }}
          ></div>

          <div
            className={`flex flex-col gap-3 text-[0.95em] text-slate-300 ${data.personalInfo.profilePicture ? "text-center items-center" : ""}`}
          >
            {data.personalInfo.email && (
              <div>
                <span
                  className={`block text-[0.85em] uppercase tracking-wider text-slate-500 mb-1`}
                >
                  Email
                </span>
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo.phone && (
              <div>
                <span
                  className={`block text-[0.85em] uppercase tracking-wider text-slate-500 mb-1`}
                >
                  Phone
                </span>
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo.location && (
              <div>
                <span
                  className={`block text-[0.85em] uppercase tracking-wider text-slate-500 mb-1`}
                >
                  Location
                </span>
                {data.personalInfo.location}
              </div>
            )}
            {data.personalInfo.website && (
              <div>
                <span
                  className={`block text-[0.85em] uppercase tracking-wider text-slate-500 mb-1`}
                >
                  Website
                </span>
                <a
                  href={
                    data.personalInfo.website.startsWith("http")
                      ? data.personalInfo.website
                      : `https://${data.personalInfo.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:underline break-all"
                >
                  {data.personalInfo.website
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </a>
              </div>
            )}
            {data.socialLinks &&
              data.socialLinks.length > 0 &&
              data.socialLinks.map((link) => (
                <div key={link.id}>
                  <span
                    className={`block text-[0.85em] uppercase tracking-wider text-slate-500 mb-1`}
                  >
                    {link.name}
                  </span>
                  <a
                    href={
                      link.url.startsWith("http")
                        ? link.url
                        : `https://${link.url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white hover:underline break-all"
                  >
                    {link.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </div>
              ))}
          </div>
        </header>

        {sortedLeftSections.map((sectionId) => renderLeftSection(sectionId))}
      </div>

      {/* Right Column */}
      <div
        data-print-wrapper
        className="w-2/3 px-8 bg-slate-50"
        style={{
          paddingTop: `${pageMarginTop}px`,
          paddingBottom: `${pageMarginBottom}px`,
        }}
      >
        {sortedRightSections.map((sectionId) => renderRightSection(sectionId))}
      </div>
    </div>
  );
});

ModernTemplate.displayName = "ModernTemplate";
