// app/print/page.tsx
import React from 'react';
import fs from 'fs';
import path from 'path';
import { MinimalTemplate } from '../components/templates/MinimalTemplate';
import { ProfessionalTemplate } from '../components/templates/ProfessionalTemplate';
import { ModernTemplate } from '../components/templates/ModernTemplate';
import { AcademicTemplate } from '../components/templates/AcademicTemplate';
import { CreativeTemplate } from '../components/templates/CreativeTemplate';
import { ResumeData } from '../types';

export default async function PrintPage({ searchParams }: { searchParams: Promise<{ id?: string, template?: string }> }) {
  const { id, template } = await searchParams;
  
  if (!id) return <div className="p-8">No printable ID provided. generating PDF failed.</div>;

  let data: ResumeData;
  try {
    const filePath = path.join('/tmp', `resume-${id}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(fileContent) as ResumeData;
  } catch (error) {
    console.error(error);
    return <div className="p-8">Error loading resume data. Temporary file may have expired.</div>;
  }

  const renderTemplate = () => {
    switch (template) {
      case 'professional':
        return <ProfessionalTemplate data={data} />;
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'academic':
        return <AcademicTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'minimal':
      default:
        return <MinimalTemplate data={data} />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {renderTemplate()}
    </div>
  );
}
