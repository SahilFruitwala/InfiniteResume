import React, { memo } from "react";
import { ResumeData } from "../../types";
import { isColorTooDarkForDarkBg } from "../../utils/colorUtils";
import { sanitizeRichText } from "@/app/utils/security";
import { SafeExternalLink } from "./SafeExternalLink";

export const ProfessionalTemplate = memo(
  ({ data, isDark }: { data: ResumeData; isDark?: boolean }) => {
    const { typography, spacing, theme } = data;

    const sectionGap = spacing?.sectionGap ?? 24;
    const sectionTitleGap = spacing?.sectionTitleGap ?? 16;
    const itemGap = spacing?.itemGap ?? 16;
    const pageMarginTop = spacing?.pageMarginTop ?? 40;
    const pageMarginBottom = spacing?.pageMarginBottom ?? 40;

    const defaultAccentColor = "#000000";
    /* Commented out for now to simplify design settings
    let accentColor = theme?.accentColor ?? defaultAccentColor;

    if (isDark && isColorTooDarkForDarkBg(accentColor)) {
      accentColor = "#e2e8f0";
    }

    const sectionBorderColor =
      theme?.professional?.sectionBorderColor ?? `${accentColor}40`;
    */

    // New simplified color logic
    let accentColor = defaultAccentColor;
    if (isDark) {
      accentColor = "#e2e8f0"; // light gray for dark backgrounds
    }
    const sectionBorderColor = "#00000040";

    const renderSection = (sectionId: string) => {
      switch (sectionId) {
        case "summary":
          return data.personalInfo.summary ? (
            <section key="summary" style={{ marginBottom: `${sectionGap}px` }}>
              <h2
                className="font-bold uppercase tracking-widest text-center"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  color: accentColor,
                }}
              >
                Professional Summary
              </h2>
              <div
                className="leading-relaxed text-justify whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(data.personalInfo.summary) }}
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
                className="font-bold uppercase tracking-widest text-center border-b pb-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: sectionBorderColor,
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
                          fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                        }}
                      >
                        {exp.position}
                      </h3>
                      <span
                        className={`text-[0.9em] italic ${isDark ? "text-slate-400" : "text-gray-600"}`}
                      >
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <div
                      className={`text-[0.95em] font-semibold ${isDark ? "text-slate-200" : "text-gray-700"} mb-2 uppercase tracking-wide`}
                    >
                      {exp.company}
                    </div>
                    <div
                      className="leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                      dangerouslySetInnerHTML={{ __html: sanitizeRichText(exp.description) }}
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
                className="font-bold uppercase tracking-widest text-center border-b pb-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: sectionBorderColor,
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
                          fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                        }}
                      >
                        {edu.degree}
                      </h3>
                      <span
                        className={`text-[0.9em] italic ${isDark ? "text-slate-400" : "text-gray-600"}`}
                      >
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                    <div
                      className={`text-[0.95em] ${isDark ? "text-slate-300" : "text-gray-700"}`}
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
                className="font-bold uppercase tracking-widest text-center border-b pb-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: sectionBorderColor,
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
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3
                        className={`font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}
                        style={{
                          fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                        }}
                      >
                        {proj.name}
                      </h3>
                      {proj.link && (
                        <SafeExternalLink
                          url={proj.link}
                          display="raw"
                          target="_blank"
                          rel="noreferrer"
                          className={`text-[0.9em] italic hover:underline ${isDark ? "text-slate-400" : "text-gray-600"}`}
                        >
                          {proj.link}
                        </SafeExternalLink>
                      )}
                    </div>
                    <div
                      className="leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                      dangerouslySetInnerHTML={{ __html: sanitizeRichText(proj.description) }}
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
                className="font-bold uppercase tracking-widest text-center border-b pb-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: sectionBorderColor,
                }}
              >
                Volunteer Experience
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
                          fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                        }}
                      >
                        {vol.position}
                      </h3>
                      <span
                        className={`text-[0.9em] italic ${isDark ? "text-slate-400" : "text-gray-600"}`}
                      >
                        {vol.startDate} - {vol.endDate}
                      </span>
                    </div>
                    <div
                      className={`text-[0.95em] font-semibold mb-2 uppercase tracking-wide ${isDark ? "text-slate-200" : "text-gray-700"}`}
                    >
                      {vol.organization}
                    </div>
                    <div
                      className="leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                      dangerouslySetInnerHTML={{ __html: sanitizeRichText(vol.description) }}
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
                className="font-bold uppercase tracking-widest text-center border-b pb-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: sectionBorderColor,
                }}
              >
                Awards & Certifications
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
                          fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                        }}
                      >
                        {award.name}
                      </h3>
                      <span
                        className={`text-[0.9em] italic ${isDark ? "text-slate-400" : "text-gray-600"}`}
                      >
                        {award.date}
                      </span>
                    </div>
                    <div
                      className={`text-[0.95em] font-semibold mb-1 tracking-wide ${isDark ? "text-slate-200" : "text-gray-700"}`}
                    >
                      {award.issuer}
                    </div>
                    <div
                      className="leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                      dangerouslySetInnerHTML={{ __html: sanitizeRichText(award.description) }}
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
                className="font-bold uppercase tracking-widest text-center border-b pb-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: sectionBorderColor,
                }}
              >
                Languages
              </h2>
              <div
                className={`flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.95em] leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}
              >
                {data.languages.map((lang) => (
                  <div key={lang.id}>
                    <span
                      className={`font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}
                    >
                      {lang.name}
                    </span>
                    {lang.proficiency && (
                      <span
                        className={`italic ${isDark ? "text-slate-400" : "text-gray-500"}`}
                      >
                        {" "}
                        - {lang.proficiency}
                      </span>
                    )}
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
                className="font-bold uppercase tracking-widest text-center border-b pb-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: sectionBorderColor,
                }}
              >
                Interests
              </h2>
              <p
                className={`leading-relaxed text-center text-[0.95em] ${isDark ? "text-slate-300" : "text-gray-700"}`}
              >
                {data.interests.map((i) => i.name).join(", ")}
              </p>
            </section>
          ) : null;
        case "skills":
          return data.skills && data.skills.length > 0 ? (
            <section key="skills" style={{ marginBottom: `${sectionGap}px` }}>
              <h2
                className="font-bold uppercase tracking-widest text-center border-b pb-2"
                style={{
                  fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                  marginBottom: `${sectionTitleGap}px`,
                  borderColor: sectionBorderColor,
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
                      className={`font-bold text-center ${isDark ? "text-slate-100" : "text-gray-900"} mb-1`}
                      style={{
                        fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                      }}
                    >
                      {category.name}
                    </h3>
                    <div
                      className="leading-relaxed text-center whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)] [&_ul]:inline-block [&_ul]:text-left"
                      dangerouslySetInnerHTML={{ __html: sanitizeRichText(category.skills) }}
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
                    className="font-bold uppercase tracking-widest text-center border-b pb-2"
                    style={{
                      fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                      marginBottom: `${sectionTitleGap}px`,
                      borderColor: sectionBorderColor,
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
                              fontSize: `${typography?.fontSizeItemHeading ?? 16}px`,
                            }}
                          >
                            {item.title}
                          </h3>
                          {item.startDate && (
                            <span
                              className={`text-[0.9em] italic ${isDark ? "text-slate-400" : "text-gray-600"}`}
                            >
                              {item.startDate} - {item.endDate || "Present"}
                            </span>
                          )}
                        </div>
                        {(item.subtitle || item.location) && (
                          <div
                            className={`text-[0.95em] mb-2 font-medium ${isDark ? "text-slate-300" : "text-gray-700"}`}
                          >
                            {item.subtitle}
                            {item.subtitle && item.location ? ", " : ""}
                            {item.location}
                          </div>
                        )}
                        {item.description && (
                          <div
                            className="leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                            dangerouslySetInnerHTML={{ __html: sanitizeRichText(item.description) }}
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
        data-print-wrapper
        className={`px-10 transition-colors duration-300 max-w-4xl mx-auto w-full min-h-[1056px] print:!bg-white print:!text-gray-900 ${isDark ? "bg-[#111111] text-slate-100" : "bg-white text-gray-800"}`}
        style={
          {
            paddingTop: `${pageMarginTop}px`,
            paddingBottom: `${pageMarginBottom}px`,
            fontFamily: typography?.fontFamily || "var(--font-merriweather)",
            fontSize: `${typography?.fontSizeBody || 14}px`,
            "--bullet-gap": `${spacing?.bulletItemGap ?? 4}px`,
            "--list-margin": `${spacing?.bulletListMargin ?? 4}px`,
          } as React.CSSProperties
        }
      >
        <header
          className="text-center border-b-2 pb-6"
          style={{ marginBottom: `${sectionGap}px`, borderColor: accentColor }}
        >
          <h1
            className="font-bold uppercase tracking-widest mb-3"
            style={{
              fontSize: `${typography?.fontSizeHeading || 36}px`,
            }}
          >
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-[0.95em] font-sans">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && (
              <span>• {data.personalInfo.phone}</span>
            )}
            {data.personalInfo.location && (
              <span>• {data.personalInfo.location}</span>
            )}
            {data.personalInfo.website && (
              <span>
                •{" "}
                <SafeExternalLink
                  url={data.personalInfo.website}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-600 hover:underline"
                />
              </span>
            )}
            {data.socialLinks &&
              data.socialLinks.length > 0 &&
              data.socialLinks.map((link) => (
                <span key={link.id}>
                  •{" "}
                  <SafeExternalLink
                    url={link.url}
                    label={link.name}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-blue-600 hover:underline"
                  />
                </span>
              ))}
          </div>
        </header>

        {currentOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    );
  },
);

ProfessionalTemplate.displayName = "ProfessionalTemplate";
