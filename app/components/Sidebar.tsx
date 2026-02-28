import React, { useState } from 'react';
// Sidebar component for editing resume data
import { ResumeData, Experience, Education, Project, SocialLink, Award, Language, Volunteer, Interest, TemplateType, SkillCategory } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Undo2, Redo2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface SidebarProps {
  data: ResumeData;
  onChange: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  template: TemplateType;
  undo?: () => void;
  redo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        className="w-full flex justify-between items-center py-4 px-6 bg-white hover:bg-slate-50 transition-colors text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-slate-800">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {isOpen && <div className="p-6 bg-slate-50/50">{children}</div>}
    </div>
  );
};


const ExperienceSection = React.memo(({ items, onAdd, onUpdate, onRemove }: { items: Experience[], onAdd: () => void, onUpdate: (id: string, field: keyof Experience, value: string) => void, onRemove: (id: string) => void }) => {
  return (
    <>

          <div className="space-y-6">
            {items.map((exp, index) => (
              <div key={exp.id} className="relative p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
                <button onClick={() => onRemove(exp.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 pr-8">Experience {index + 1}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Company</label>
                    <input type="text" value={exp.company} onChange={e => onUpdate(exp.id, 'company', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Acme Corp" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Position</label>
                    <input type="text" value={exp.position} onChange={e => onUpdate(exp.id, 'position', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Software Engineer" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                      <input type="text" value={exp.startDate} onChange={e => onUpdate(exp.id, 'startDate', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Jan 2020" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                      <input type="text" value={exp.endDate} onChange={e => onUpdate(exp.id, 'endDate', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Present" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                    <RichTextEditor 
                      value={exp.description} 
                      onChange={val => onUpdate(exp.id, 'description', val)} 
                      placeholder="Describe your responsibilities and achievements…" 
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAdd} className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>
        
    </>
  );
});

const EducationSection = React.memo(({ items, onAdd, onUpdate, onRemove }: { items: Education[], onAdd: () => void, onUpdate: (id: string, field: keyof Education, value: string) => void, onRemove: (id: string) => void }) => {
  return (
    <>

          <div className="space-y-6">
            {items.map((edu, index) => (
              <div key={edu.id} className="relative p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
                <button onClick={() => onRemove(edu.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 pr-8">Education {index + 1}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Institution</label>
                    <input type="text" value={edu.institution} onChange={e => onUpdate(edu.id, 'institution', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="University of Technology" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Degree</label>
                    <input type="text" value={edu.degree} onChange={e => onUpdate(edu.id, 'degree', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="B.S. Computer Science" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                      <input type="text" value={edu.startDate} onChange={e => onUpdate(edu.id, 'startDate', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Aug 2016" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                      <input type="text" value={edu.endDate} onChange={e => onUpdate(edu.id, 'endDate', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="May 2020" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAdd} className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>
        
    </>
  );
});

const ProjectSection = React.memo(({ items, onAdd, onUpdate, onRemove }: { items: Project[], onAdd: () => void, onUpdate: (id: string, field: keyof Project, value: string) => void, onRemove: (id: string) => void }) => {
  return (
    <>

          <div className="space-y-6">
            {items.map((proj, index) => (
              <div key={proj.id} className="relative p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
                <button onClick={() => onRemove(proj.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 pr-8">Project {index + 1}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Project Name</label>
                    <input type="text" value={proj.name} onChange={e => onUpdate(proj.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="E-commerce Platform" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Link</label>
                    <input type="text" value={proj.link} onChange={e => onUpdate(proj.id, 'link', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="github.com/johndoe/project" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                    <RichTextEditor 
                      value={proj.description} 
                      onChange={val => onUpdate(proj.id, 'description', val)} 
                      placeholder="Describe the project and your role…" 
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAdd} className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>
        
    </>
  );
});

const SocialLinkSection = React.memo(({ items, onAdd, onUpdate, onRemove }: { items: SocialLink[], onAdd: () => void, onUpdate: (id: string, field: keyof SocialLink, value: string) => void, onRemove: (id: string) => void }) => {
  return (
    <>

          <div className="space-y-6">
            {items.map((link, index) => (
              <div key={link.id} className="relative p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
                <button onClick={() => onRemove(link.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 pr-8">Link {index + 1}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Platform / Title</label>
                    <input type="text" value={link.name} onChange={e => onUpdate(link.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="LinkedIn, GitHub, Portfolio…" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">URL</label>
                    <input type="text" value={link.url} onChange={e => onUpdate(link.id, 'url', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="https://…" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAdd} className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </div>
        
    </>
  );
});

const LanguageSection = React.memo(({ items, onAdd, onUpdate, onRemove }: { items: Language[], onAdd: () => void, onUpdate: (id: string, field: keyof Language, value: string) => void, onRemove: (id: string) => void }) => {
  return (
    <>

          <div className="space-y-6">
            {items.map((lang, index) => (
              <div key={lang.id} className="relative p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
                <button onClick={() => onRemove(lang.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 pr-8">Language {index + 1}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Language</label>
                    <input type="text" value={lang.name} onChange={e => onUpdate(lang.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="English" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Proficiency</label>
                    <input type="text" value={lang.proficiency} onChange={e => onUpdate(lang.id, 'proficiency', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Native, Fluent, Beginner…" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAdd} className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Language
            </button>
          </div>
        
    </>
  );
});

const VolunteerSection = React.memo(({ items, onAdd, onUpdate, onRemove }: { items: Volunteer[], onAdd: () => void, onUpdate: (id: string, field: keyof Volunteer, value: string) => void, onRemove: (id: string) => void }) => {
  return (
    <>

          <div className="space-y-6">
            {items.map((vol, index) => (
              <div key={vol.id} className="relative p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
                <button onClick={() => onRemove(vol.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 pr-8">Volunteer {index + 1}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Organization</label>
                    <input type="text" value={vol.organization} onChange={e => onUpdate(vol.id, 'organization', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Red Cross" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Position</label>
                    <input type="text" value={vol.position} onChange={e => onUpdate(vol.id, 'position', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Volunteer Coordinator" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                      <input type="text" value={vol.startDate} onChange={e => onUpdate(vol.id, 'startDate', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Jan 2018" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                      <input type="text" value={vol.endDate} onChange={e => onUpdate(vol.id, 'endDate', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Present" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                    <RichTextEditor 
                      value={vol.description} 
                      onChange={val => onUpdate(vol.id, 'description', val)} 
                      placeholder="Describe your volunteer work…" 
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAdd} className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Volunteer Work
            </button>
          </div>
        
    </>
  );
});

const InterestSection = React.memo(({ items, onAdd, onUpdate, onRemove }: { items: Interest[], onAdd: () => void, onUpdate: (id: string, field: keyof Interest, value: string) => void, onRemove: (id: string) => void }) => {
  return (
    <>

          <div className="space-y-6">
            {items.map((interest, index) => (
              <div key={interest.id} className="relative p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
                <button onClick={() => onRemove(interest.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Interest Name</label>
                    <input type="text" value={interest.name} onChange={e => onUpdate(interest.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Photography, Hiking…" />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAdd} className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Interest
            </button>
          </div>
        
    </>
  );
});

const SkillCategorySection = React.memo(({ items, onAdd, onUpdate, onRemove }: { items: SkillCategory[], onAdd: () => void, onUpdate: (id: string, field: keyof SkillCategory, value: string) => void, onRemove: (id: string) => void }) => {
  return (
    <>

          <div className="space-y-6">
            {items.map((category, index) => (
              <div key={category.id} className="relative p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
                <button onClick={() => onRemove(category.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 pr-8">Category {index + 1}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Category Name</label>
                    <input type="text" value={category.name} onChange={e => onUpdate(category.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Frontend, Backend, Tools…" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Skills</label>
                    <RichTextEditor 
                      value={category.skills} 
                      onChange={val => onUpdate(category.id, 'skills', val)} 
                      placeholder="React, Next.js, Node.js…" 
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={onAdd} className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Skill Category
            </button>
          </div>
        
    </>
  );
});

export const Sidebar = ({ data, onChange, template, undo, redo, canUndo, canRedo }: SidebarProps) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo?.();
        } else {
          e.preventDefault();
          undo?.();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const updatePersonalInfo = React.useCallback((field: keyof ResumeData['personalInfo'], value: string) => {
    onChange(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  }, [onChange]);

  const addExperience = React.useCallback(() => {
    onChange(prev => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        { id: crypto.randomUUID(), company: '', position: '', startDate: '', endDate: '', description: '' }
      ]
    }));
  }, [onChange]);

  const updateExperience = React.useCallback((id: string, field: keyof Experience, value: string) => {
    onChange(prev => ({
      ...prev,
      experience: (prev.experience || []).map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  }, [onChange]);

  const removeExperience = React.useCallback((id: string) => {
    onChange(prev => ({
      ...prev,
      experience: (prev.experience || []).filter(exp => exp.id !== id)
    }));
  }, [onChange]);

  const addEducation = React.useCallback(() => {
    onChange(prev => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { id: crypto.randomUUID(), institution: '', degree: '', startDate: '', endDate: '' }
      ]
    }));
  }, [onChange]);

  const updateEducation = React.useCallback((id: string, field: keyof Education, value: string) => {
    onChange(prev => ({
      ...prev,
      education: (prev.education || []).map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  }, [onChange]);

  const removeEducation = React.useCallback((id: string) => {
    onChange(prev => ({
      ...prev,
      education: (prev.education || []).filter(edu => edu.id !== id)
    }));
  }, [onChange]);

  const addProject = React.useCallback(() => {
    onChange(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { id: crypto.randomUUID(), name: '', description: '', link: '' }
      ]
    }));
  }, [onChange]);

  const updateProject = React.useCallback((id: string, field: keyof Project, value: string) => {
    onChange(prev => ({
      ...prev,
      projects: (prev.projects || []).map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
    }));
  }, [onChange]);

  const removeProject = React.useCallback((id: string) => {
    onChange(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(proj => proj.id !== id)
    }));
  }, [onChange]);

  const addSocialLink = React.useCallback(() => {
    onChange(prev => ({
      ...prev,
      socialLinks: [
        ...(prev.socialLinks || []),
        { id: crypto.randomUUID(), name: '', url: '' }
      ]
    }));
  }, [onChange]);

  const updateSocialLink = React.useCallback((id: string, field: keyof SocialLink, value: string) => {
    onChange(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).map(link => link.id === id ? { ...link, [field]: value } : link)
    }));
  }, [onChange]);

  const removeSocialLink = React.useCallback((id: string) => {
    onChange(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter(link => link.id !== id)
    }));
  }, [onChange]);

  const addAward = React.useCallback(() => {
    onChange(prev => ({
      ...prev,
      awards: [
        ...(prev.awards || []),
        { id: crypto.randomUUID(), name: '', issuer: '', date: '', description: '' }
      ]
    }));
  }, [onChange]);

  const updateAward = React.useCallback((id: string, field: keyof Award, value: string) => {
    onChange(prev => ({
      ...prev,
      awards: (prev.awards || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  }, [onChange]);

  const removeAward = React.useCallback((id: string) => {
    onChange(prev => ({
      ...prev,
      awards: (prev.awards || []).filter(item => item.id !== id)
    }));
  }, [onChange]);

  const addLanguage = React.useCallback(() => {
    onChange(prev => ({
      ...prev,
      languages: [
        ...(prev.languages || []),
        { id: crypto.randomUUID(), name: '', proficiency: '' }
      ]
    }));
  }, [onChange]);

  const updateLanguage = React.useCallback((id: string, field: keyof Language, value: string) => {
    onChange(prev => ({
      ...prev,
      languages: (prev.languages || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  }, [onChange]);

  const removeLanguage = React.useCallback((id: string) => {
    onChange(prev => ({
      ...prev,
      languages: (prev.languages || []).filter(item => item.id !== id)
    }));
  }, [onChange]);

  const addVolunteer = React.useCallback(() => {
    onChange(prev => ({
      ...prev,
      volunteerWork: [
        ...(prev.volunteerWork || []),
        { id: crypto.randomUUID(), organization: '', position: '', startDate: '', endDate: '', description: '' }
      ]
    }));
  }, [onChange]);

  const updateVolunteer = React.useCallback((id: string, field: keyof Volunteer, value: string) => {
    onChange(prev => ({
      ...prev,
      volunteerWork: (prev.volunteerWork || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  }, [onChange]);

  const removeVolunteer = React.useCallback((id: string) => {
    onChange(prev => ({
      ...prev,
      volunteerWork: (prev.volunteerWork || []).filter(item => item.id !== id)
    }));
  }, [onChange]);

  const addInterest = React.useCallback(() => {
    onChange(prev => ({
      ...prev,
      interests: [
        ...(prev.interests || []),
        { id: crypto.randomUUID(), name: '' }
      ]
    }));
  }, [onChange]);

  const updateInterest = React.useCallback((id: string, field: keyof Interest, value: string) => {
    onChange(prev => ({
      ...prev,
      interests: (prev.interests || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  }, [onChange]);

  const removeInterest = React.useCallback((id: string) => {
    onChange(prev => ({
      ...prev,
      interests: (prev.interests || []).filter(item => item.id !== id)
    }));
  }, [onChange]);

  const addSkillCategory = React.useCallback(() => {
    onChange(prev => ({
      ...prev,
      skills: [
        ...(prev.skills || []),
        { id: crypto.randomUUID(), name: '', skills: '' }
      ]
    }));
  }, [onChange]);

  const updateSkillCategory = React.useCallback((id: string, field: keyof SkillCategory, value: string) => {
    onChange(prev => ({
      ...prev,
      skills: (prev.skills || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  }, [onChange]);

  const removeSkillCategory = React.useCallback((id: string) => {
    onChange(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(item => item.id !== id)
    }));
  }, [onChange]);


  return (
    <div className="w-full max-w-md bg-white border-r border-slate-200 h-screen overflow-y-auto flex flex-col shadow-sm z-10 print:hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-800 text-white sticky top-0 z-20 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Resume Editor</h2>
          <p className="text-sm text-slate-400 mt-1">Fill in your details to generate your resume.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={undo}
            disabled={!canUndo}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button 
            onClick={redo}
            disabled={!canRedo}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded transition-colors"
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <AccordionItem title="Theme & Colors">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Global Accent Color</label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={data.theme?.accentColor ?? '#0f172a'} 
                  onChange={e => onChange({ ...data, theme: { ...data.theme, accentColor: e.target.value } })}
                  className="w-10 h-10 p-1 border border-slate-300 rounded-md cursor-pointer" 
                />
                <input 
                  type="text" 
                  value={data.theme?.accentColor ?? '#0f172a'} 
                  onChange={e => onChange({ ...data, theme: { ...data.theme, accentColor: e.target.value } })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all font-mono" 
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Used for headings, borders, and decorative elements depending on the template.</p>
            </div>

            {template === 'professional' && (
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-medium text-slate-700 mb-2">Section Border Color (Professional)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={data.theme?.professional?.sectionBorderColor?.slice(0, 7) ?? '#0f172a'} 
                    onChange={e => {
                      // Keep opacity if it was there, or default to 40 (25%)
                      const current = data.theme?.professional?.sectionBorderColor ?? '#0f172a40';
                      const opacity = current.length === 9 ? current.slice(7) : '40';
                      onChange({ ...data, theme: { ...data.theme, professional: { ...data.theme?.professional, sectionBorderColor: e.target.value + opacity } } });
                    }}
                    className="w-10 h-10 p-1 border border-slate-300 rounded-md cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={data.theme?.professional?.sectionBorderColor ?? '#0f172a40'} 
                    onChange={e => onChange({ ...data, theme: { ...data.theme, professional: { ...data.theme?.professional, sectionBorderColor: e.target.value } } })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all font-mono" 
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Supports hex with opacity (e.g. #0f172a40).</p>
              </div>
            )}

            {template === 'modern' && (
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-medium text-slate-700 mb-2">Primary Accent Color (Modern)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={data.theme?.modern?.accentColor ?? '#34d399'} 
                    onChange={e => onChange({ ...data, theme: { ...data.theme, modern: { ...data.theme?.modern, accentColor: e.target.value } } })}
                    className="w-10 h-10 p-1 border border-slate-300 rounded-md cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={data.theme?.modern?.accentColor ?? '#34d399'} 
                    onChange={e => onChange({ ...data, theme: { ...data.theme, modern: { ...data.theme?.modern, accentColor: e.target.value } } })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all font-mono" 
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Used for icons, links, and decorative elements in the Modern template.</p>
              </div>
            )}

            {template === 'minimal' && (
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-medium text-slate-700 mb-2">Accent Color (Minimal)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={data.theme?.minimal?.accentColor ?? '#0f172a'} 
                    onChange={e => onChange({ ...data, theme: { ...data.theme, minimal: { ...data.theme?.minimal, accentColor: e.target.value } } })}
                    className="w-10 h-10 p-1 border border-slate-300 rounded-md cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={data.theme?.minimal?.accentColor ?? '#0f172a'} 
                    onChange={e => onChange({ ...data, theme: { ...data.theme, minimal: { ...data.theme?.minimal, accentColor: e.target.value } } })}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all font-mono" 
                  />
                </div>
              </div>
            )}
          </div>
        </AccordionItem>

        <AccordionItem title="Typography">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Font Family</label>
              <select 
                value={data.typography.fontFamily} 
                onChange={e => onChange({ ...data, typography: { ...data.typography, fontFamily: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all bg-white"
              >
                <option value="var(--font-inter)">Inter (Sans-serif)</option>
                <option value="var(--font-roboto)">Roboto (Sans-serif)</option>
                <option value="var(--font-open-sans)">Open Sans (Sans-serif)</option>
                <option value="var(--font-merriweather)">Merriweather (Serif)</option>
                <option value="var(--font-playfair)">Playfair Display (Serif)</option>
                <option value="var(--font-lora)">Lora (Serif)</option>
                <option value="var(--font-montserrat)">Montserrat (Sans-serif)</option>
                <option value="var(--font-poppins)">Poppins (Sans-serif)</option>
                <option value="var(--font-raleway)">Raleway (Sans-serif)</option>
                <option value="var(--font-lato)">Lato (Sans-serif)</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Body (px)</label>
                <input 
                  type="number" 
                  min="10" 
                  max="20" 
                  value={data.typography.fontSizeBody} 
                  onChange={e => onChange({ ...data, typography: { ...data.typography, fontSizeBody: parseInt(e.target.value) || 14 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Name (px)</label>
                <input 
                  type="number" 
                  min="16" 
                  max="64" 
                  value={data.typography.fontSizeHeading} 
                  onChange={e => onChange({ ...data, typography: { ...data.typography, fontSizeHeading: parseInt(e.target.value) || 36 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Section (px)</label>
                <input 
                  type="number" 
                  min="12" 
                  max="32" 
                  value={data.typography.fontSizeSectionHeading} 
                  onChange={e => onChange({ ...data, typography: { ...data.typography, fontSizeSectionHeading: parseInt(e.target.value) || 18 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Item Title (px)</label>
                <input 
                  type="number" 
                  min="10" 
                  max="32" 
                  value={data.typography.fontSizeItemHeading ?? 16} 
                  onChange={e => onChange({ ...data, typography: { ...data.typography, fontSizeItemHeading: parseInt(e.target.value) || 16 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" 
                />
              </div>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title="Spacing">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Section Gap (px)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="64" 
                  value={data.spacing?.sectionGap ?? 24} 
                  onChange={e => onChange({ ...data, spacing: { ...data.spacing, sectionGap: parseInt(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Title Gap (px)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="48" 
                  value={data.spacing?.sectionTitleGap ?? 16} 
                  onChange={e => onChange({ ...data, spacing: { ...data.spacing, sectionTitleGap: parseInt(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Item Gap (px)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="48" 
                  value={data.spacing?.itemGap ?? 16} 
                  onChange={e => onChange({ ...data, spacing: { ...data.spacing, itemGap: parseInt(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Top Margin (px)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="120" 
                  value={data.spacing?.pageMarginTop ?? 32} 
                  onChange={e => onChange({ ...data, spacing: { ...data.spacing, pageMarginTop: parseInt(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bottom Margin (px)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="120" 
                  value={data.spacing?.pageMarginBottom ?? 32} 
                  onChange={e => onChange({ ...data, spacing: { ...data.spacing, pageMarginBottom: parseInt(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bullet Gap (px)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="32" 
                  value={data.spacing?.bulletItemGap ?? 4} 
                  onChange={e => onChange({ ...data, spacing: { ...data.spacing, bulletItemGap: parseInt(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">List Margin (px)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="32" 
                  value={data.spacing?.bulletListMargin ?? 4} 
                  onChange={e => onChange({ ...data, spacing: { ...data.spacing, bulletListMargin: parseInt(e.target.value) || 0 } })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" 
                />
              </div>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title="Layout & Structure">
          <div className="space-y-2">
             <p className="text-xs text-slate-500 mb-3">Drag or use arrows to reorder resume sections.</p>
             {(data.layout?.sectionOrder || ['summary', 'experience', 'education', 'projects', 'volunteerWork', 'awards', 'skills', 'languages', 'interests']).map((sectionId, index, array) => {
               const sectionNames: Record<string, string> = {
                 summary: 'Professional Summary',
                 experience: 'Experience',
                 education: 'Education',
                 projects: 'Projects',
                 volunteerWork: 'Volunteer Work',
                 awards: 'Awards & Certifications',
                 skills: 'Skills',
                 languages: 'Languages',
                 interests: 'Interests',
               };
               
               return (
                 <div key={sectionId} className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-md shadow-sm">
                   <span className="text-sm font-medium text-slate-700">{sectionNames[sectionId] || sectionId}</span>
                   <div className="flex gap-1">
                     <button 
                       onClick={() => {
                         if (index === 0) return;
                         const newOrder = [...array];
                         [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
                         onChange({ ...data, layout: { ...data.layout, sectionOrder: newOrder }});
                       }}
                       disabled={index === 0}
                       className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-colors bg-slate-50 rounded"
                     >
                       <ArrowUp className="w-4 h-4" />
                     </button>
                     <button 
                       onClick={() => {
                         if (index === array.length - 1) return;
                         const newOrder = [...array];
                         [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
                         onChange({ ...data, layout: { ...data.layout, sectionOrder: newOrder }});
                       }}
                       disabled={index === array.length - 1}
                       className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 transition-colors bg-slate-50 rounded"
                     >
                       <ArrowDown className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
               );
             })}
          </div>
        </AccordionItem>

        <AccordionItem title="Personal Information" defaultOpen>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Profile Picture (Optional)</label>
              <div className="flex items-center gap-4">
                {data.personalInfo.profilePicture && (
                  <img src={data.personalInfo.profilePicture} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        updatePersonalInfo('profilePicture', reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                  className="flex-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100 transition-all cursor-pointer" 
                />
                {data.personalInfo.profilePicture && (
                  <button 
                    onClick={() => updatePersonalInfo('profilePicture', '')}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" name="fullName" autoComplete="name" value={data.personalInfo.fullName} onChange={e => updatePersonalInfo('fullName', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input type="email" name="email" autoComplete="email" value={data.personalInfo.email} onChange={e => updatePersonalInfo('email', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" name="phone" autoComplete="tel" value={data.personalInfo.phone} onChange={e => updatePersonalInfo('phone', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="+1 234 567 890" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
              <input type="text" name="location" autoComplete="address-level2" value={data.personalInfo.location} onChange={e => updatePersonalInfo('location', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="New York, NY" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Website (Optional)</label>
              <input type="url" name="website" autoComplete="url" value={data.personalInfo.website} onChange={e => updatePersonalInfo('website', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="johndoe.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Professional Summary</label>
              <RichTextEditor 
                value={data.personalInfo.summary} 
                onChange={val => updatePersonalInfo('summary', val)} 
                placeholder="A brief summary of your professional background…" 
              />
            </div>
          </div>
        </AccordionItem>

        <AccordionItem title="Social Links">
          <SocialLinkSection 
            items={(data.socialLinks || [])}
            onAdd={addSocialLink}
            onUpdate={updateSocialLink}
            onRemove={removeSocialLink}
          />
        </AccordionItem>

        <AccordionItem title="Experience">
          <ExperienceSection 
            items={data.experience}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onRemove={removeExperience}
          />
        </AccordionItem>

        <AccordionItem title="Education">
          <EducationSection 
            items={data.education}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onRemove={removeEducation}
          />
        </AccordionItem>

        <AccordionItem title="Projects">
          <ProjectSection 
            items={data.projects}
            onAdd={addProject}
            onUpdate={updateProject}
            onRemove={removeProject}
          />
        </AccordionItem>

        <AccordionItem title="Awards & Certifications">
          <div className="space-y-6">
            {(data.awards || []).map((award, index) => (
              <div key={award.id} className="relative p-4 border border-slate-200 rounded-lg bg-white shadow-sm">
                <button onClick={() => removeAward(award.id)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 pr-8">Award {index + 1}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Award Name</label>
                    <input type="text" value={award.name} onChange={e => updateAward(award.id, 'name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Employee of the Year" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Issuer</label>
                    <input type="text" value={award.issuer} onChange={e => updateAward(award.id, 'issuer', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Tech Innovators Inc." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
                    <input type="text" value={award.date} onChange={e => updateAward(award.id, 'date', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all" placeholder="Dec 2022" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                    <RichTextEditor 
                      value={award.description} 
                      onChange={val => updateAward(award.id, 'description', val)} 
                      placeholder="Recognized for outstanding contributions…" 
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addAward} className="w-full py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Award
            </button>
          </div>
        </AccordionItem>

        <AccordionItem title="Languages">
          <LanguageSection 
            items={(data.languages || [])}
            onAdd={addLanguage}
            onUpdate={updateLanguage}
            onRemove={removeLanguage}
          />
        </AccordionItem>

        <AccordionItem title="Volunteer Work">
          <VolunteerSection 
            items={(data.volunteerWork || [])}
            onAdd={addVolunteer}
            onUpdate={updateVolunteer}
            onRemove={removeVolunteer}
          />
        </AccordionItem>

        <AccordionItem title="Interests">
          <InterestSection 
            items={(data.interests || [])}
            onAdd={addInterest}
            onUpdate={updateInterest}
            onRemove={removeInterest}
          />
        </AccordionItem>

        <AccordionItem title="Skills">
          <SkillCategorySection 
            items={(data.skills || [])}
            onAdd={addSkillCategory}
            onUpdate={updateSkillCategory}
            onRemove={removeSkillCategory}
          />
        </AccordionItem>
      </div>
    </div>
  );
};
