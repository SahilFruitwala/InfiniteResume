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

      {data.personalInfo.summary && (
        <section style={{ marginBottom: `${sectionGap}px` }}>
          <div 
            className="leading-relaxed text-gray-700 whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
            dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
          />
        </section>
      )}

      {data.experience.length > 0 && (
        <section style={{ marginBottom: `${sectionGap}px` }}>
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
                  <h3 className="font-semibold text-gray-900 text-[1.15em]">{exp.position}</h3>
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
      )}

      {data.education.length > 0 && (
        <section style={{ marginBottom: `${sectionGap}px` }}>
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
                  <h3 className="font-semibold text-gray-900 text-[1.15em]">{edu.degree}</h3>
                  <span className="text-[0.9em] text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="text-[0.95em] text-gray-700">{edu.institution}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects.length > 0 && (
        <section style={{ marginBottom: `${sectionGap}px` }}>
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
                  <h3 className="font-semibold text-gray-900 text-[1.15em]">{proj.name}</h3>
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
      )}

      {data.skills && (
        <section style={{ marginBottom: `${sectionGap}px` }}>
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
          <p className="text-gray-700 leading-relaxed">{data.skills}</p>
        </section>
      )}
    </div>
  );
};
