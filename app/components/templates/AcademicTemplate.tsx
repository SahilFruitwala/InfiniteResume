import React, { memo } from "react";
import Image from "next/image";
import { ResumeData } from "../../types";
import { isColorTooDarkForDarkBg } from "../../utils/colorUtils";

export const AcademicTemplate = memo(
  ({ data, isDark }: { data: ResumeData; isDark?: boolean }) => {
    const { typography, spacing, theme } = data;

    const sectionGap = spacing?.sectionGap ?? 28;
    const sectionTitleGap = spacing?.sectionTitleGap ?? 12;
    const itemGap = spacing?.itemGap ?? 16;
    const pageMarginTop = spacing?.pageMarginTop ?? 48;
    const pageMarginBottom = spacing?.pageMarginBottom ?? 48;

    const defaultAccentColor = "#000000";

    let accentColor =
      theme?.academic?.accentColor ?? theme?.accentColor ?? defaultAccentColor;

    // Ensure accent color is readable in dark mode
    if (isDark && isColorTooDarkForDarkBg(accentColor)) {
      accentColor = "#e2e8f0"; // light gray for dark backgrounds
    }

    const renderSection = (sectionId: string) => {
      switch (sectionId) {
        case "summary":
          return data.personalInfo.summary ? (
            <section key="summary" style={{ marginBottom: `${sectionGap}px` }}>
              <h2
                className="font-bold uppercase tracking-wider border-b-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 16}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: accentColor,
                }}
              >
                Professional Summary
              </h2>
              <div
                className="leading-relaxed text-justify whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                style={{
                  fontFamily: typography?.fontFamily || "var(--font-lora)",
                }}
                dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
              />
            </section>
          ) : null;
        case "experience":
          return data.experience.length > 0 ? (
            <section
              key="experience"
              style={{ marginBottom: `${sectionGap}px` }}
            >
              <h2
                className="font-bold uppercase tracking-wider border-b-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 16}px`,
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
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3
                        className={`font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}
                        style={{
                          fontSize: `${typography?.fontSizeItemHeading ?? 15}px`,
                          fontFamily:
                            typography?.fontFamily || "var(--font-lora)",
                        }}
                      >
                        {exp.position}
                      </h3>
                      <span
                        className={`text-[0.9em] whitespace-nowrap ml-4 ${isDark ? "text-slate-400" : "text-gray-700"}`}
                      >
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    <div
                      className={`font-semibold ${isDark ? "text-slate-200" : "text-gray-800"} mb-2`}
                      style={{
                        fontFamily:
                          typography?.fontFamily || "var(--font-lora)",
                      }}
                    >
                      {exp.company}
                    </div>
                    <div
                      className="leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                      style={{
                        fontFamily:
                          typography?.fontFamily || "var(--font-lora)",
                      }}
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null;
        case "education":
          return data.education.length > 0 ? (
            <section
              key="education"
              style={{ marginBottom: `${sectionGap}px` }}
            >
              <h2
                className="font-bold uppercase tracking-wider border-b-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 16}px`,
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
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3
                        className={`font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}
                        style={{
                          fontSize: `${typography?.fontSizeItemHeading ?? 15}px`,
                          fontFamily:
                            typography?.fontFamily || "var(--font-lora)",
                        }}
                      >
                        {edu.degree}
                      </h3>
                      <span
                        className={`text-[0.9em] whitespace-nowrap ml-4 ${isDark ? "text-slate-400" : "text-gray-700"}`}
                      >
                        {edu.startDate} – {edu.endDate}
                      </span>
                    </div>
                    <div
                      className={`text-[0.95em] font-semibold ${isDark ? "text-slate-200" : "text-gray-800"}`}
                      style={{
                        fontFamily:
                          typography?.fontFamily || "var(--font-lora)",
                      }}
                    >
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
                className="font-bold uppercase tracking-wider border-b-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 16}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: accentColor,
                }}
              >
                Projects & Research
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${itemGap}px`,
                }}
              >
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3
                        className={`font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}
                        style={{
                          fontSize: `${typography?.fontSizeItemHeading ?? 15}px`,
                          fontFamily:
                            typography?.fontFamily || "var(--font-lora)",
                        }}
                      >
                        {proj.name}
                      </h3>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: accentColor }}
                          className="text-[0.9em] hover:underline ml-4 whitespace-nowrap"
                        >
                          {proj.link
                            .replace(/^https?:\/\//, "")
                            .replace(/\/$/, "")}
                        </a>
                      )}
                    </div>
                    <div
                      className="leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                      style={{
                        fontFamily:
                          typography?.fontFamily || "var(--font-lora)",
                      }}
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
                className="font-bold uppercase tracking-wider border-b-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 16}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: accentColor,
                }}
              >
                Service & Leadership
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${itemGap}px`,
                }}
              >
                {data.volunteerWork.map((vol) => (
                  <div key={vol.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3
                        className={`font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}
                        style={{
                          fontSize: `${typography?.fontSizeItemHeading ?? 15}px`,
                          fontFamily:
                            typography?.fontFamily || "var(--font-lora)",
                        }}
                      >
                        {vol.position}
                      </h3>
                      <span
                        className={`text-[0.9em] whitespace-nowrap ml-4 ${isDark ? "text-slate-400" : "text-gray-700"}`}
                      >
                        {vol.startDate} – {vol.endDate}
                      </span>
                    </div>
                    <div
                      className={`font-semibold mb-2 ${isDark ? "text-slate-200" : "text-gray-800"}`}
                      style={{
                        fontFamily:
                          typography?.fontFamily || "var(--font-lora)",
                      }}
                    >
                      {vol.organization}
                    </div>
                    <div
                      className="leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                      style={{
                        fontFamily:
                          typography?.fontFamily || "var(--font-lora)",
                      }}
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
                className="font-bold uppercase tracking-wider border-b-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 16}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: accentColor,
                }}
              >
                Honors & Awards
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${itemGap}px`,
                }}
              >
                {data.awards.map((award) => (
                  <div key={award.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3
                        className={`font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}
                        style={{
                          fontSize: `${typography?.fontSizeItemHeading ?? 15}px`,
                          fontFamily:
                            typography?.fontFamily || "var(--font-lora)",
                        }}
                      >
                        {award.name}
                      </h3>
                      <span
                        className={`text-[0.9em] whitespace-nowrap ml-4 ${isDark ? "text-slate-400" : "text-gray-700"}`}
                      >
                        {award.date}
                      </span>
                    </div>
                    <div
                      className={`font-semibold mb-1 ${isDark ? "text-slate-200" : "text-gray-800"}`}
                      style={{
                        fontFamily:
                          typography?.fontFamily || "var(--font-lora)",
                      }}
                    >
                      {award.issuer}
                    </div>
                    <div
                      className="leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                      style={{
                        fontFamily:
                          typography?.fontFamily || "var(--font-lora)",
                      }}
                      dangerouslySetInnerHTML={{ __html: award.description }}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null;
        case "languages":
          return data.languages && data.languages.length > 0 ? (
            <section
              key="languages"
              style={{ marginBottom: `${sectionGap}px` }}
            >
              <h2
                className="font-bold uppercase tracking-wider border-b-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 16}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: accentColor,
                }}
              >
                Languages
              </h2>
              <div
                className={`flex flex-wrap gap-x-8 gap-y-2 text-[0.95em] leading-relaxed ${isDark ? "text-slate-300" : "text-gray-800"}`}
                style={{
                  fontFamily: typography?.fontFamily || "var(--font-lora)",
                }}
              >
                {data.languages.map((lang) => (
                  <div key={lang.id}>
                    <span className="font-bold">{lang.name}</span>
                    {lang.proficiency && <span> ({lang.proficiency})</span>}
                  </div>
                ))}
              </div>
            </section>
          ) : null;
        case "interests":
          return data.interests && data.interests.length > 0 ? (
            <section
              key="interests"
              style={{ marginBottom: `${sectionGap}px` }}
            >
              <h2
                className="font-bold uppercase tracking-wider border-b-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 16}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: accentColor,
                }}
              >
                Interests
              </h2>
              <p
                className={`leading-relaxed text-[0.95em] ${isDark ? "text-slate-300" : "text-gray-800"}`}
                style={{
                  fontFamily: typography?.fontFamily || "var(--font-lora)",
                }}
              >
                {data.interests.map((i) => i.name).join(", ")}
              </p>
            </section>
          ) : null;
        case "skills":
          return data.skills && data.skills.length > 0 ? (
            <section key="skills" style={{ marginBottom: `${sectionGap}px` }}>
              <h2
                className="font-bold uppercase tracking-wider border-b-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 16}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: accentColor,
                }}
              >
                Technical Skills
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
                      className={`font-bold mb-1 ${isDark ? "text-slate-100" : "text-gray-900"}`}
                      style={{
                        fontSize: `${typography?.fontSizeItemHeading ?? 15}px`,
                        fontFamily:
                          typography?.fontFamily || "var(--font-lora)",
                      }}
                    >
                      {category.name}
                    </h3>
                    <div
                      className={`leading-relaxed text-[0.95em] whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)] ${isDark ? "text-slate-300" : "text-gray-800"}`}
                      style={{
                        fontFamily:
                          typography?.fontFamily || "var(--font-lora)",
                      }}
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
                    className="font-bold uppercase tracking-wider border-b-2"
                    style={{
                      fontSize: `${typography?.fontSizeSectionHeading || 16}px`,
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
                      <div key={item.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3
                            className={`font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}
                            style={{
                              fontSize: `${typography?.fontSizeItemHeading ?? 15}px`,
                              fontFamily:
                                typography?.fontFamily || "var(--font-lora)",
                            }}
                          >
                            {item.title}
                          </h3>
                          {item.startDate && (
                            <span
                              className={`text-[0.9em] whitespace-nowrap ml-4 ${isDark ? "text-slate-400" : "text-gray-700"}`}
                            >
                              {item.startDate} – {item.endDate || "Present"}
                            </span>
                          )}
                        </div>
                        {(item.subtitle || item.location) && (
                          <div
                            className={`font-semibold mb-2 ${isDark ? "text-slate-200" : "text-gray-800"}`}
                            style={{
                              fontFamily:
                                typography?.fontFamily || "var(--font-lora)",
                            }}
                          >
                            {item.subtitle}
                            {item.subtitle && item.location ? ", " : ""}
                            {item.location}
                          </div>
                        )}
                        {item.description && (
                          <div
                            className="leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                            style={{
                              fontFamily:
                                typography?.fontFamily || "var(--font-lora)",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
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
      "education",
      "experience",
      "projects",
      "volunteerWork",
      "awards",
      "skills",
      "languages",
      "interests",
    ];
    // Note: Academic places education before experience usually, but respects layout.sectionOrder if set
    const currentOrder = data.layout?.sectionOrder || defaultOrder;

    return (
      <div
        data-print-wrapper
        className={`px-12 transition-colors duration-300 max-w-4xl mx-auto w-full min-h-[1056px] print:!bg-white print:!text-gray-900 ${isDark ? "bg-[#050505] text-slate-100" : "bg-white text-gray-900"}`}
        style={
          {
            paddingTop: `${pageMarginTop}px`,
            paddingBottom: `${pageMarginBottom}px`,
            fontFamily: typography?.fontFamily || "var(--font-lora)",
            fontSize: `${typography?.fontSizeBody || 14}px`,
            "--bullet-gap": `${spacing?.bulletItemGap ?? 4}px`,
            "--list-margin": `${spacing?.bulletListMargin ?? 4}px`,
          } as React.CSSProperties
        }
      >
        <header
          className="text-center pb-6"
          style={{ marginBottom: `${sectionGap}px` }}
        >
          {data.personalInfo.profilePicture && (
            <div className="mb-4 rounded-md overflow-hidden w-28 h-28 border border-gray-300 mx-auto group relative inline-block">
              <Image
                src={data.personalInfo.profilePicture}
                alt="Profile"
                width={112}
                height={112}
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1
            className="font-bold uppercase tracking-wider mb-2"
            style={{
              fontSize: `${typography?.fontSizeHeading || 32}px`,
            }}
          >
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[0.9em] text-gray-700 dark:text-slate-400">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && (
              <span>| {data.personalInfo.phone}</span>
            )}
            {data.personalInfo.location && (
              <span>| {data.personalInfo.location}</span>
            )}
            {data.personalInfo.website && (
              <span>
                |{" "}
                <a
                  href={
                    data.personalInfo.website.startsWith("http")
                      ? data.personalInfo.website
                      : `https://${data.personalInfo.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: accentColor }}
                  className="hover:underline"
                >
                  {data.personalInfo.website
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </a>
              </span>
            )}
            {data.socialLinks &&
              data.socialLinks.length > 0 &&
              data.socialLinks.map((link) => (
                <span key={link.id}>
                  |{" "}
                  <a
                    href={
                      link.url.startsWith("http")
                        ? link.url
                        : `https://${link.url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: accentColor }}
                    className="hover:underline"
                  >
                    {link.name}
                  </a>
                </span>
              ))}
          </div>
        </header>

        {currentOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    );
  },
);

AcademicTemplate.displayName = "AcademicTemplate";
