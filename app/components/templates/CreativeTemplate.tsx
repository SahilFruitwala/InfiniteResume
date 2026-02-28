import React, { memo } from "react";
import Image from "next/image";
import { ResumeData } from "../../types";
import { isColorTooDarkForDarkBg } from "../../utils/colorUtils";

export const CreativeTemplate = memo(({ data }: { data: ResumeData }) => {
  const { typography, spacing, theme } = data;

  const sectionGap = spacing?.sectionGap ?? 28;
  const sectionTitleGap = spacing?.sectionTitleGap ?? 16;
  const itemGap = spacing?.itemGap ?? 20;
  const pageMarginTop = spacing?.pageMarginTop ?? 40;
  const pageMarginBottom = spacing?.pageMarginBottom ?? 40;
  const isDark = data.theme?.previewTheme === "dark";
  const defaultAccentColor = isDark ? "#f472b6" : "#ec4899"; // pink-400 : pink-500

  let accentColor =
    theme?.creative?.accentColor ?? theme?.accentColor ?? defaultAccentColor;
  if (isDark && isColorTooDarkForDarkBg(accentColor)) {
    accentColor = defaultAccentColor;
  }

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "summary":
        return data.personalInfo.summary ? (
          <section key="summary" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-black uppercase tracking-widest text-gray-900 border-l-4 pl-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 20}px`,
                marginBottom: `${sectionTitleGap}px`,
                borderColor: accentColor,
              }}
            >
              Profile
            </h2>
            <div
              className="leading-relaxed text-gray-700 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
              dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
            />
          </section>
        ) : null;
      case "experience":
        return data.experience.length > 0 ? (
          <section key="experience" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-black uppercase tracking-widest text-gray-900 border-l-4 pl-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 20}px`,
                marginBottom: `${sectionTitleGap}px`,
                borderColor: accentColor,
              }}
            >
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
                  className="relative z-10 pl-6 border-l-2 border-gray-100 pb-2"
                >
                  <div
                    className="absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3
                      className="font-extrabold text-gray-900"
                      style={{
                        fontSize: `${typography?.fontSizeItemHeading ?? 18}px`,
                      }}
                    >
                      {exp.position}
                    </h3>
                    <span
                      className="text-[0.85em] font-bold px-3 py-1 rounded-sm uppercase tracking-wider mt-1 sm:mt-0"
                      style={{
                        color: accentColor,
                        backgroundColor: `${accentColor}15`,
                      }}
                    >
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <div className="text-[1.05em] font-medium text-gray-800 mb-2">
                    {exp.company}
                  </div>
                  <div
                    className="leading-relaxed text-gray-600 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case "education":
        return data.education.length > 0 ? (
          <section key="education" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-black uppercase tracking-widest text-gray-900 border-l-4 pl-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 20}px`,
                marginBottom: `${sectionTitleGap}px`,
                borderColor: accentColor,
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
                <div
                  key={edu.id}
                  className="relative z-10 pl-6 border-l-2 border-gray-100 pb-2"
                >
                  <div
                    className="absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3
                      className="font-extrabold text-gray-900"
                      style={{
                        fontSize: `${typography?.fontSizeItemHeading ?? 18}px`,
                      }}
                    >
                      {edu.degree}
                    </h3>
                    <span
                      className="text-[0.85em] font-bold px-3 py-1 rounded-sm uppercase tracking-wider mt-1 sm:mt-0"
                      style={{
                        color: accentColor,
                        backgroundColor: `${accentColor}15`,
                      }}
                    >
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="text-[1.05em] font-medium text-gray-800">
                    {edu.institution}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case "projects":
        return data.projects.length > 0 ? (
          <section key="projects" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-black uppercase tracking-widest text-gray-900 border-l-4 pl-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 20}px`,
                marginBottom: `${sectionTitleGap}px`,
                borderColor: accentColor,
              }}
            >
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
                  className="relative z-10 pl-6 border-l-2 border-gray-100 pb-2"
                >
                  <div
                    className="absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3
                      className="font-extrabold text-gray-900"
                      style={{
                        fontSize: `${typography?.fontSizeItemHeading ?? 18}px`,
                      }}
                    >
                      {proj.name}
                    </h3>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[0.9em] font-bold underline mt-1 sm:mt-0"
                        style={{ color: accentColor }}
                      >
                        {proj.link
                          .replace(/^https?:\/\//, "")
                          .replace(/\/$/, "")}
                      </a>
                    )}
                  </div>
                  <div
                    className="leading-relaxed text-gray-600 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
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
              className="font-bold uppercase tracking-widest text-gray-900 border-l-4 pl-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 20}px`,
                marginBottom: `${sectionTitleGap}px`,
                borderColor: accentColor,
              }}
            >
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
                  className="relative z-10 pl-6 border-l-2 border-gray-100 pb-2"
                >
                  <div
                    className="absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3
                      className="font-extrabold text-gray-900"
                      style={{
                        fontSize: `${typography?.fontSizeItemHeading ?? 18}px`,
                      }}
                    >
                      {vol.position}
                    </h3>
                    <span
                      className="text-[0.85em] font-bold px-3 py-1 rounded-sm uppercase tracking-wider mt-1 sm:mt-0"
                      style={{
                        color: accentColor,
                        backgroundColor: `${accentColor}15`,
                      }}
                    >
                      {vol.startDate} – {vol.endDate}
                    </span>
                  </div>
                  <div className="text-[1.05em] font-medium text-gray-800 mb-2">
                    {vol.organization}
                  </div>
                  <div
                    className="leading-relaxed text-gray-600 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
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
              className="font-black uppercase tracking-widest text-gray-900 border-l-4 pl-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 20}px`,
                marginBottom: `${sectionTitleGap}px`,
                borderColor: accentColor,
              }}
            >
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
                  className="relative z-10 pl-6 border-l-2 border-gray-100 pb-2"
                >
                  <div
                    className="absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-white"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                    <h3
                      className="font-extrabold text-gray-900"
                      style={{
                        fontSize: `${typography?.fontSizeItemHeading ?? 18}px`,
                      }}
                    >
                      {award.name}
                    </h3>
                    <span
                      className="text-[0.85em] font-bold px-3 py-1 rounded-sm uppercase tracking-wider mt-1 sm:mt-0"
                      style={{
                        color: accentColor,
                        backgroundColor: `${accentColor}15`,
                      }}
                    >
                      {award.date}
                    </span>
                  </div>
                  <div className="text-[1.05em] font-medium text-gray-800 mb-1">
                    {award.issuer}
                  </div>
                  <div
                    className="leading-relaxed text-gray-600 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: award.description }}
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
              className="font-black uppercase tracking-widest text-gray-900 border-l-4 pl-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 20}px`,
                marginBottom: `${sectionTitleGap}px`,
                borderColor: accentColor,
              }}
            >
              Languages
            </h2>
            <div className="flex flex-wrap gap-4 text-gray-800 leading-relaxed">
              {data.languages.map((lang) => (
                <div
                  key={lang.id}
                  className="bg-gray-100 px-4 py-2 rounded-lg font-medium"
                >
                  <span className="font-bold text-gray-900">{lang.name}</span>
                  {lang.proficiency && (
                    <span className="text-gray-600"> - {lang.proficiency}</span>
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
              className="font-black uppercase tracking-widest text-gray-900 border-l-4 pl-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 20}px`,
                marginBottom: `${sectionTitleGap}px`,
                borderColor: accentColor,
              }}
            >
              Interests
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.interests.map((i) => (
                <span
                  key={i.id}
                  className="font-bold tracking-wide text-white px-4 py-1.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                >
                  {i.name}
                </span>
              ))}
            </div>
          </section>
        ) : null;
      case "skills":
        return data.skills && data.skills.length > 0 ? (
          <section key="skills" style={{ marginBottom: `${sectionGap}px` }}>
            <h2
              className="font-black uppercase tracking-widest text-gray-900 border-l-4 pl-3"
              style={{
                fontSize: `${typography?.fontSizeSectionHeading || 20}px`,
                marginBottom: `${sectionTitleGap}px`,
                borderColor: accentColor,
              }}
            >
              Skills
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col gap-4">
              {data.skills.map((category) => (
                <div key={category.id}>
                  <h3
                    className="font-extrabold text-gray-900 mb-1"
                    style={{
                      fontSize: `${typography?.fontSizeItemHeading ?? 18}px`,
                    }}
                  >
                    {category.name}
                  </h3>
                  <div
                    className="leading-relaxed text-gray-700 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: category.skills }}
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
                  className="font-black uppercase tracking-widest text-gray-900 border-l-4 pl-3"
                  style={{
                    fontSize: `${typography?.fontSizeSectionHeading || 20}px`,
                    marginBottom: `${sectionTitleGap}px`,
                    borderColor: accentColor,
                  }}
                >
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
                      className="relative z-10 pl-6 border-l-2 border-gray-100 pb-2"
                    >
                      <div
                        className="absolute w-4 h-4 rounded-full -left-[9px] top-1 border-4 border-white"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                        <h3
                          className="font-extrabold text-gray-900"
                          style={{
                            fontSize: `${typography?.fontSizeItemHeading ?? 18}px`,
                          }}
                        >
                          {item.title}
                        </h3>
                        {item.startDate && (
                          <span
                            className="text-[0.85em] font-bold px-3 py-1 rounded-sm uppercase tracking-wider mt-1 sm:mt-0"
                            style={{
                              color: accentColor,
                              backgroundColor: `${accentColor}15`,
                            }}
                          >
                            {item.startDate} – {item.endDate || "Present"}
                          </span>
                        )}
                      </div>
                      {(item.subtitle || item.location) && (
                        <div className="text-[1.05em] font-medium text-gray-800 mb-2">
                          {item.subtitle}
                          {item.subtitle && item.location ? ", " : ""}
                          {item.location}
                        </div>
                      )}
                      {item.description && (
                        <div
                          className="leading-relaxed text-gray-600 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
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

  return (
    <div
      className="bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100 max-w-4xl mx-auto w-full min-h-[1056px] overflow-hidden relative shadow-md"
      style={
        {
          fontFamily: typography?.fontFamily || "var(--font-poppins)",
          fontSize: `${typography?.fontSizeBody || 14}px`,
          "--bullet-gap": `${spacing?.bulletItemGap ?? 4}px`,
          "--list-margin": `${spacing?.bulletListMargin ?? 4}px`,
        } as React.CSSProperties
      }
    >
      {/* Decorative background shape */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      ></div>

      <div
        data-print-wrapper
        style={{
          paddingTop: `${pageMarginTop}px`,
          paddingBottom: `${pageMarginBottom}px`,
        }}
        className="px-12 relative z-10"
      >
        <header
          className="mb-12 flex flex-col md:flex-row gap-8 items-center md:items-start pb-8 border-b-2 border-gray-100"
          style={{ marginBottom: `${sectionGap}px` }}
        >
          {data.personalInfo.profilePicture && (
            <div className="shrink-0 relative">
              <div
                className="absolute inset-0 rounded-2xl transform rotate-6 scale-105 opacity-20"
                style={{ backgroundColor: accentColor }}
              ></div>
              <Image
                src={data.personalInfo.profilePicture}
                alt="Profile"
                width={144}
                height={144}
                unoptimized
                className="w-36 h-36 rounded-2xl object-cover relative z-10 border-4 border-white shadow-lg"
              />
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <h1
              className="font-black tracking-tight mb-3 text-gray-900 leading-none"
              style={{ fontSize: `${typography?.fontSizeHeading || 42}px` }}
            >
              {data.personalInfo.fullName || "Your Name"}
            </h1>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-4 text-[0.95em] font-medium text-gray-600 dark:text-slate-400">
              {data.personalInfo.email && (
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  ></span>
                  {data.personalInfo.email}
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  ></span>
                  {data.personalInfo.phone}
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  ></span>
                  {data.personalInfo.location}
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  ></span>
                  <a
                    href={
                      data.personalInfo.website.startsWith("http")
                        ? data.personalInfo.website
                        : `https://${data.personalInfo.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                    style={{ color: accentColor }}
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
                  <div key={link.id} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    ></span>
                    <a
                      href={
                        link.url.startsWith("http")
                          ? link.url
                          : `https://${link.url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                      style={{ color: accentColor }}
                    >
                      {link.name}
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </header>

        {currentOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    </div>
  );
});

CreativeTemplate.displayName = "CreativeTemplate";
