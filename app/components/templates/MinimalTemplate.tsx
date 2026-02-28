import React from 'react';
import { ResumeData } from '../../types';

export const MinimalTemplate = ({ data }: { data: ResumeData }) => {
  const { typography, spacing, theme } = data;
  
  const sectionGap = spacing?.sectionGap ?? 24;
  const sectionTitleGap = spacing?.sectionTitleGap ?? 16;
  const itemGap = spacing?.itemGap ?? 16;
  const pageMarginTop = spacing?.pageMarginTop ?? 32;
  const pageMarginBottom = spacing?.pageMarginBottom ?? 32;
  const accentColor = theme?.minimal?.accentColor ?? theme?.accentColor ?? '#0f172a';
  
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return data.personalInfo.summary ? (
          <section key="summary" style={{ marginBottom: `${sectionGap}px` }}>
            <div 
              className="leading-relaxed text-gray-700 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
              dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
            />
          </section>
        ) : null;
      case 'experience':
        return data.experience.length > 0 ? (
          <section key="experience" style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider border-b pb-1"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
                borderColor: accentColor
              }}
            >
              Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${itemGap}px` }}>
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900" style={{ fontSize: `${typography?.fontSizeItemHeading ?? 16}px` }}>{exp.position}</h3>
                    <span className="text-[0.9em] text-gray-500">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="font-medium text-gray-700 mb-2 text-[0.95em]">{exp.company}</div>
                  <div 
                    className="text-gray-600 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'education':
        return data.education.length > 0 ? (
          <section key="education" style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider border-b pb-1"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
                borderColor: accentColor
              }}
            >
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${itemGap}px` }}>
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900" style={{ fontSize: `${typography?.fontSizeItemHeading ?? 16}px` }}>{edu.degree}</h3>
                    <span className="text-[0.9em] text-gray-500">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="text-[0.95em] text-gray-700">{edu.institution}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'projects':
        return data.projects.length > 0 ? (
          <section key="projects" style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider border-b pb-1"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
                borderColor: accentColor
              }}
            >
              Projects
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${itemGap}px` }}>
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900" style={{ fontSize: `${typography?.fontSizeItemHeading ?? 16}px` }}>{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-[0.9em] text-blue-600 hover:underline">
                        {proj.link}
                      </a>
                    )}
                  </div>
                  <div 
                    className="text-gray-600 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: proj.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'volunteerWork':
        return data.volunteerWork && data.volunteerWork.length > 0 ? (
          <section key="volunteerWork" style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider border-b pb-1"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
                borderColor: accentColor
              }}
            >
              Volunteer Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${itemGap}px` }}>
              {data.volunteerWork.map((vol) => (
                <div key={vol.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900" style={{ fontSize: `${typography?.fontSizeItemHeading ?? 16}px` }}>{vol.position}</h3>
                    <span className="text-[0.9em] text-gray-500">
                      {vol.startDate} - {vol.endDate}
                    </span>
                  </div>
                  <div className="font-medium text-gray-700 mb-2 text-[0.95em]">{vol.organization}</div>
                  <div 
                    className="text-gray-600 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: vol.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'awards':
        return data.awards && data.awards.length > 0 ? (
          <section key="awards" style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider border-b pb-1"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
                borderColor: accentColor
              }}
            >
              Awards & Certifications
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${itemGap}px` }}>
              {data.awards.map((award) => (
                <div key={award.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900" style={{ fontSize: `${typography?.fontSizeItemHeading ?? 16}px` }}>{award.name}</h3>
                    <span className="text-[0.9em] text-gray-500">{award.date}</span>
                  </div>
                  <div className="text-[0.95em] text-gray-700 font-medium mb-1">{award.issuer}</div>
                  <div 
                    className="text-gray-600 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: award.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'languages':
        return data.languages && data.languages.length > 0 ? (
          <section key="languages" style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider border-b pb-1"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
                borderColor: accentColor
              }}
            >
              Languages
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.95em] text-gray-700 leading-relaxed">
              {data.languages.map(lang => (
                <div key={lang.id}>
                  <span className="font-medium text-gray-900">{lang.name}</span>
                  {lang.proficiency && <span className="text-gray-500"> ({lang.proficiency})</span>}
                </div>
              ))}
            </div>
          </section>
        ) : null;
      case 'interests':
        return data.interests && data.interests.length > 0 ? (
          <section key="interests" style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider border-b pb-1"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
                borderColor: accentColor
              }}
            >
              Interests
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {data.interests.map(i => i.name).join(', ')}
            </p>
          </section>
        ) : null;
      case 'skills':
        return data.skills && data.skills.length > 0 ? (
          <section key="skills" style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider border-b pb-1"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor,
                borderColor: accentColor
              }}
            >
              Skills
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${itemGap}px` }}>
              {data.skills.map((category) => (
                <div key={category.id}>
                  <h3 className="font-semibold text-gray-900 mb-1" style={{ fontSize: `${typography?.fontSizeItemHeading ?? 16}px` }}>{category.name}</h3>
                  <div 
                    className="text-gray-700 leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: category.skills }}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null;
      default:
        return null;
    }
  };

  const defaultOrder = ['summary', 'experience', 'education', 'projects', 'volunteerWork', 'awards', 'skills', 'languages', 'interests'];
  const currentOrder = data.layout?.sectionOrder || defaultOrder;

  return (
    <div 
      className="px-8 bg-white text-gray-900 max-w-4xl mx-auto w-full min-h-[1056px]"
      style={{
        paddingTop: `${pageMarginTop}px`,
        paddingBottom: `${pageMarginBottom}px`,
        fontFamily: typography?.fontFamily || 'var(--font-inter)',
        fontSize: `${typography?.fontSizeBody || 14}px`,
        '--bullet-gap': `${spacing?.bulletItemGap ?? 4}px`,
        '--list-margin': `${spacing?.bulletListMargin ?? 4}px`,
      } as React.CSSProperties}
    >
      <header className="border-b pb-4" style={{ marginBottom: `${sectionGap}px`, borderColor: accentColor }}>
        <h1 
          className="font-bold mb-2 tracking-tight"
          style={{ fontSize: `${typography?.fontSizeHeading || 36}px`, color: accentColor }}
        >
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-[0.95em] text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.website && (
            <a href={data.personalInfo.website.startsWith('http') ? data.personalInfo.website : `https://${data.personalInfo.website}`} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:underline">
              {data.personalInfo.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </a>
          )}
          {data.socialLinks && data.socialLinks.length > 0 && data.socialLinks.map(link => (
            <a key={link.id} href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:underline">
              {link.name}
            </a>
          ))}
        </div>
      </header>

      {currentOrder.map(sectionId => renderSection(sectionId))}
    </div>
  );
};
