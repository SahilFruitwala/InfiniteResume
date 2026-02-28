import React from 'react';
import { ResumeData } from '../../types';

export const ModernTemplate = ({ data }: { data: ResumeData }) => {
  const { typography, spacing, theme } = data;
  
  const sectionGap = spacing?.sectionGap ?? 24;
  const sectionTitleGap = spacing?.sectionTitleGap ?? 16;
  const itemGap = spacing?.itemGap ?? 16;
  const pageMarginTop = spacing?.pageMarginTop ?? 32;
  const pageMarginBottom = spacing?.pageMarginBottom ?? 32;
  const accentColor = theme?.modern?.accentColor ?? theme?.accentColor ?? '#34d399'; // emerald-400
  
  return (
    <div 
      className="flex bg-white text-gray-800 max-w-4xl mx-auto w-full min-h-[1056px] shadow-sm"
      style={{
        fontFamily: typography?.fontFamily || 'var(--font-roboto)',
        fontSize: `${typography?.fontSizeBody || 14}px`,
        '--bullet-gap': `${spacing?.bulletItemGap ?? 4}px`,
        '--list-margin': `${spacing?.bulletListMargin ?? 4}px`,
      } as React.CSSProperties}
    >
      {/* Left Column */}
      <div 
        className="w-1/3 bg-slate-800 text-white px-8 flex flex-col gap-8"
        style={{ paddingTop: `${pageMarginTop}px`, paddingBottom: `${pageMarginBottom}px` }}
      >
        <header style={{ marginBottom: `${sectionGap}px` }}>
          <h1 
            className="font-bold uppercase tracking-wider mb-2 leading-tight"
            style={{ fontSize: `${typography?.fontSizeHeading || 36}px` }}
          >
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="w-12 h-1 mb-6" style={{ backgroundColor: accentColor }}></div>
          
          <div className="flex flex-col gap-3 text-[0.95em] text-slate-300">
            {data.personalInfo.email && (
              <div>
                <span className="block text-[0.85em] uppercase tracking-wider text-slate-500 mb-1">Email</span>
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo.phone && (
              <div>
                <span className="block text-[0.85em] uppercase tracking-wider text-slate-500 mb-1">Phone</span>
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo.location && (
              <div>
                <span className="block text-[0.85em] uppercase tracking-wider text-slate-500 mb-1">Location</span>
                {data.personalInfo.location}
              </div>
            )}
            {data.personalInfo.website && (
              <div>
                <span className="block text-[0.85em] uppercase tracking-wider text-slate-500 mb-1">Website</span>
                <a href={data.personalInfo.website.startsWith('http') ? data.personalInfo.website : `https://${data.personalInfo.website}`} target="_blank" rel="noreferrer" className="hover:text-white hover:underline break-all">
                  {data.personalInfo.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </div>
            )}
            {data.socialLinks && data.socialLinks.length > 0 && data.socialLinks.map(link => (
              <div key={link.id}>
                <span className="block text-[0.85em] uppercase tracking-wider text-slate-500 mb-1">{link.name}</span>
                <a href={link.url.startsWith('http') ? link.url : `https://${link.url}`} target="_blank" rel="noreferrer" className="hover:text-white hover:underline break-all">
                  {link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              </div>
            ))}
          </div>
        </header>

        {data.education.length > 0 && (
          <section style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor
              }}
            >
              Education
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${itemGap}px` }}>
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-semibold text-white" style={{ fontSize: `${typography?.fontSizeItemHeading ?? 16}px` }}>{edu.degree}</h3>
                  <div className="text-[0.95em] text-slate-400 mb-1">{edu.institution}</div>
                  <span className="text-[0.85em] text-slate-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills && (
          <section style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`,
                color: accentColor
              }}
            >
              Skills
            </h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{data.skills}</p>
          </section>
        )}
      </div>

      {/* Right Column */}
      <div 
        className="w-2/3 px-8 bg-slate-50"
        style={{ paddingTop: `${pageMarginTop}px`, paddingBottom: `${pageMarginBottom}px` }}
      >
        {data.personalInfo.summary && (
          <section style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-3"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`
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
        )}

        {data.experience.length > 0 && (
          <section style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-3"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`
              }}
            >
              <span className="w-8 h-px bg-slate-300"></span>
              Experience
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${itemGap}px` }}>
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                  <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white" style={{ backgroundColor: accentColor }}></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-800" style={{ fontSize: `${typography?.fontSizeItemHeading ?? 16}px` }}>{exp.position}</h3>
                    <span 
                      className="text-[0.85em] font-medium px-2 py-1 rounded-full"
                      style={{ color: accentColor, backgroundColor: `${accentColor}15` }}
                    >
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-500 mb-2 uppercase tracking-wide text-[0.95em]">{exp.company}</div>
                  <div 
                    className="text-slate-600 leading-relaxed whitespace-pre-line [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-[var(--bullet-gap)] [&_ul]:my-[var(--list-margin)]"
                    dangerouslySetInnerHTML={{ __html: exp.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section style={{ marginBottom: `${sectionGap}px` }}>
            <h2 
              className="font-bold uppercase tracking-wider text-slate-800 flex items-center gap-3"
              style={{ 
                fontSize: `${typography?.fontSizeSectionHeading || 18}px`,
                marginBottom: `${sectionTitleGap}px`
              }}
            >
              <span className="w-8 h-px bg-slate-300"></span>
              Projects
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: `${itemGap}px` }}>
              {data.projects.map((proj) => (
                <div key={proj.id} className="relative pl-4 border-l-2 border-slate-200">
                  <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1.5 border-2 border-white" style={{ backgroundColor: accentColor }}></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-800" style={{ fontSize: `${typography?.fontSizeItemHeading ?? 16}px` }}>{proj.name}</h3>
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
        )}
      </div>
    </div>
  );
};
