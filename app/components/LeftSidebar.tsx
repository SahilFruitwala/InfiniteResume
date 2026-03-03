import React from "react";
import {
  ResumeData,
  PersonalInfo,
  Experience,
  Education,
  Project,
  SocialLink,
  Award,
  Language,
  Volunteer,
  Interest,
  SkillCategory,
  CustomSectionItem,
} from "../types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { SidebarAccordionItem as AccordionItem } from "./shared/SidebarAccordionItem";

import { PersonalInfoSection } from "./sidebar/PersonalInfoSection";
import { ExperienceSection } from "./sidebar/ExperienceSection";
import { EducationSection } from "./sidebar/EducationSection";
import { ProjectSection } from "./sidebar/ProjectSection";
import { SocialLinkSection } from "./sidebar/SocialLinkSection";
import { AwardSection } from "./sidebar/AwardSection";
import { LanguageSection } from "./sidebar/LanguageSection";
import { VolunteerSection } from "./sidebar/VolunteerSection";
import { InterestSection } from "./sidebar/InterestSection";
import { SkillCategorySection } from "./sidebar/SkillCategorySection";
import { CustomSectionEditor } from "./sidebar/CustomSectionEditor";

interface LeftSidebarProps {
  data: ResumeData;
  onChange: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const EMPTY_ARRAY: any[] = [];

export const LeftSidebar = React.memo(
  ({ data, onChange }: LeftSidebarProps) => {
    // --- Handlers ---
    const updatePersonalInfo = React.useCallback(
      (field: keyof PersonalInfo, value: string) => {
        onChange((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, [field]: value },
        }));
      },
      [onChange],
    );

    const addExperience = React.useCallback(() => {
      onChange((prev) => ({
        ...prev,
        experience: [
          ...(prev.experience || []),
          {
            id: crypto.randomUUID(),
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ],
      }));
    }, [onChange]);

    const updateExperience = React.useCallback(
      (id: string, field: keyof Experience, value: string) => {
        onChange((prev) => ({
          ...prev,
          experience: prev.experience.map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
          ),
        }));
      },
      [onChange],
    );

    const removeExperience = React.useCallback(
      (id: string) => {
        onChange((prev) => ({
          ...prev,
          experience: prev.experience.filter((item) => item.id !== id),
        }));
      },
      [onChange],
    );

    const addEducation = React.useCallback(() => {
      onChange((prev) => ({
        ...prev,
        education: [
          ...(prev.education || []),
          {
            id: crypto.randomUUID(),
            institution: "",
            degree: "",
            startDate: "",
            endDate: "",
          },
        ],
      }));
    }, [onChange]);

    const updateEducation = React.useCallback(
      (id: string, field: keyof Education, value: string) => {
        onChange((prev) => ({
          ...prev,
          education: prev.education.map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
          ),
        }));
      },
      [onChange],
    );

    const removeEducation = React.useCallback(
      (id: string) => {
        onChange((prev) => ({
          ...prev,
          education: prev.education.filter((item) => item.id !== id),
        }));
      },
      [onChange],
    );

    const addProject = React.useCallback(() => {
      onChange((prev) => ({
        ...prev,
        projects: [
          ...(prev.projects || []),
          { id: crypto.randomUUID(), name: "", description: "", link: "" },
        ],
      }));
    }, [onChange]);

    const updateProject = React.useCallback(
      (id: string, field: keyof Project, value: string) => {
        onChange((prev) => ({
          ...prev,
          projects: prev.projects.map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
          ),
        }));
      },
      [onChange],
    );

    const removeProject = React.useCallback(
      (id: string) => {
        onChange((prev) => ({
          ...prev,
          projects: prev.projects.filter((item) => item.id !== id),
        }));
      },
      [onChange],
    );

    const addSocialLink = React.useCallback(() => {
      onChange((prev) => ({
        ...prev,
        socialLinks: [
          ...(prev.socialLinks || []),
          { id: crypto.randomUUID(), name: "", url: "" },
        ],
      }));
    }, [onChange]);

    const updateSocialLink = React.useCallback(
      (id: string, field: keyof SocialLink, value: string) => {
        onChange((prev) => ({
          ...prev,
          socialLinks: (prev.socialLinks || []).map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
          ),
        }));
      },
      [onChange],
    );

    const removeSocialLink = React.useCallback(
      (id: string) => {
        onChange((prev) => ({
          ...prev,
          socialLinks: (prev.socialLinks || []).filter(
            (item) => item.id !== id,
          ),
        }));
      },
      [onChange],
    );

    const addAward = React.useCallback(() => {
      onChange((prev) => ({
        ...prev,
        awards: [
          ...(prev.awards || []),
          {
            id: crypto.randomUUID(),
            name: "",
            issuer: "",
            date: "",
            description: "",
          },
        ],
      }));
    }, [onChange]);

    const updateAward = React.useCallback(
      (id: string, field: keyof Award, value: string) => {
        onChange((prev) => ({
          ...prev,
          awards: (prev.awards || []).map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
          ),
        }));
      },
      [onChange],
    );

    const removeAward = React.useCallback(
      (id: string) => {
        onChange((prev) => ({
          ...prev,
          awards: (prev.awards || []).filter((item) => item.id !== id),
        }));
      },
      [onChange],
    );

    const addLanguage = React.useCallback(() => {
      onChange((prev) => ({
        ...prev,
        languages: [
          ...(prev.languages || []),
          { id: crypto.randomUUID(), name: "", proficiency: "" },
        ],
      }));
    }, [onChange]);

    const updateLanguage = React.useCallback(
      (id: string, field: keyof Language, value: string) => {
        onChange((prev) => ({
          ...prev,
          languages: (prev.languages || []).map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
          ),
        }));
      },
      [onChange],
    );

    const removeLanguage = React.useCallback(
      (id: string) => {
        onChange((prev) => ({
          ...prev,
          languages: (prev.languages || []).filter((item) => item.id !== id),
        }));
      },
      [onChange],
    );

    const addVolunteer = React.useCallback(() => {
      onChange((prev) => ({
        ...prev,
        volunteerWork: [
          ...(prev.volunteerWork || []),
          {
            id: crypto.randomUUID(),
            organization: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ],
      }));
    }, [onChange]);

    const updateVolunteer = React.useCallback(
      (id: string, field: keyof Volunteer, value: string) => {
        onChange((prev) => ({
          ...prev,
          volunteerWork: (prev.volunteerWork || []).map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
          ),
        }));
      },
      [onChange],
    );

    const removeVolunteer = React.useCallback(
      (id: string) => {
        onChange((prev) => ({
          ...prev,
          volunteerWork: (prev.volunteerWork || []).filter(
            (item) => item.id !== id,
          ),
        }));
      },
      [onChange],
    );

    const addInterest = React.useCallback(() => {
      onChange((prev) => ({
        ...prev,
        interests: [
          ...(prev.interests || []),
          { id: crypto.randomUUID(), name: "" },
        ],
      }));
    }, [onChange]);

    const updateInterest = React.useCallback(
      (id: string, field: keyof Interest, value: string) => {
        onChange((prev) => ({
          ...prev,
          interests: (prev.interests || []).map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
          ),
        }));
      },
      [onChange],
    );

    const removeInterest = React.useCallback(
      (id: string) => {
        onChange((prev) => ({
          ...prev,
          interests: (prev.interests || []).filter((item) => item.id !== id),
        }));
      },
      [onChange],
    );

    const addSkillCategory = React.useCallback(() => {
      onChange((prev) => ({
        ...prev,
        skills: [
          ...(prev.skills || []),
          { id: crypto.randomUUID(), name: "", skills: "" },
        ],
      }));
    }, [onChange]);

    const updateSkillCategory = React.useCallback(
      (id: string, field: keyof SkillCategory, value: string) => {
        onChange((prev) => ({
          ...prev,
          skills: (prev.skills || []).map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
          ),
        }));
      },
      [onChange],
    );

    const removeSkillCategory = React.useCallback(
      (id: string) => {
        onChange((prev) => ({
          ...prev,
          skills: (prev.skills || []).filter((item) => item.id !== id),
        }));
      },
      [onChange],
    );

    return (
      <div className="w-full bg-white dark:bg-card border-r-2 border-black/10 dark:border-white/10 h-screen flex flex-col shadow-none transition-colors z-10 print:hidden shrink-0">
        <div className="p-6 border-b-2 border-black/10 dark:border-white/10 bg-white dark:bg-card text-black dark:text-white flex justify-between items-center shrink-0 transition-colors">
          <div>
            <h2 className="font-display text-2xl font-black uppercase tracking-tighter">
              Resume <span className="text-accent">Editor</span>
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40 mt-1">
              Build your professional identity.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-10">
          <Accordion type="multiple" className="w-full">
            <AccordionItem title="Personal Information">
              <PersonalInfoSection
                data={data.personalInfo}
                onChange={updatePersonalInfo}
              />
            </AccordionItem>

            <AccordionItem title="Social Links">
              <SocialLinkSection
                items={data.socialLinks || EMPTY_ARRAY}
                onAdd={addSocialLink}
                onUpdate={updateSocialLink}
                onRemove={removeSocialLink}
              />
            </AccordionItem>

            <AccordionItem title="Experience">
              <ExperienceSection
                items={data.experience || EMPTY_ARRAY}
                onAdd={addExperience}
                onUpdate={updateExperience}
                onRemove={removeExperience}
              />
            </AccordionItem>

            <AccordionItem title="Education">
              <EducationSection
                items={data.education || EMPTY_ARRAY}
                onAdd={addEducation}
                onUpdate={updateEducation}
                onRemove={removeEducation}
              />
            </AccordionItem>

            <AccordionItem title="Projects">
              <ProjectSection
                items={data.projects || EMPTY_ARRAY}
                onAdd={addProject}
                onUpdate={updateProject}
                onRemove={removeProject}
              />
            </AccordionItem>

            <AccordionItem title="Awards & Certifications">
              <AwardSection
                items={data.awards || EMPTY_ARRAY}
                onAdd={addAward}
                onUpdate={updateAward}
                onRemove={removeAward}
              />
            </AccordionItem>

            <AccordionItem title="Languages">
              <LanguageSection
                items={data.languages || EMPTY_ARRAY}
                onAdd={addLanguage}
                onUpdate={updateLanguage}
                onRemove={removeLanguage}
              />
            </AccordionItem>

            <AccordionItem title="Volunteer Work">
              <VolunteerSection
                items={data.volunteerWork || EMPTY_ARRAY}
                onAdd={addVolunteer}
                onUpdate={updateVolunteer}
                onRemove={removeVolunteer}
              />
            </AccordionItem>

            <AccordionItem title="Interests">
              <InterestSection
                items={data.interests || EMPTY_ARRAY}
                onAdd={addInterest}
                onUpdate={updateInterest}
                onRemove={removeInterest}
              />
            </AccordionItem>

            <AccordionItem title="Skills">
              <SkillCategorySection
                items={data.skills || EMPTY_ARRAY}
                onAdd={addSkillCategory}
                onUpdate={updateSkillCategory}
                onRemove={removeSkillCategory}
              />
            </AccordionItem>

            {data.customSections?.map((section) => (
              <AccordionItem
                key={section.id}
                title={section.title || "Custom Section"}
                value={`custom-${section.id}`}
              >
                <CustomSectionEditor
                  section={section}
                  onUpdateTitle={(title) => {
                    onChange((prev) => ({
                      ...prev,
                      customSections: (prev.customSections || []).map((s) =>
                        s.id === section.id ? { ...s, title } : s,
                      ),
                    }));
                  }}
                  onAddItem={() => {
                    onChange((prev) => ({
                      ...prev,
                      customSections: (prev.customSections || []).map((s) =>
                        s.id === section.id
                          ? {
                              ...s,
                              items: [
                                ...s.items,
                                { id: crypto.randomUUID(), title: "" },
                              ],
                            }
                          : s,
                      ),
                    }));
                  }}
                  onUpdateItem={(itemId, field, value) => {
                    onChange((prev) => ({
                      ...prev,
                      customSections: (prev.customSections || []).map((s) =>
                        s.id === section.id
                          ? {
                              ...s,
                              items: s.items.map((item) =>
                                item.id === itemId
                                  ? { ...item, [field]: value }
                                  : item,
                              ),
                            }
                          : s,
                      ),
                    }));
                  }}
                  onRemoveItem={(itemId) => {
                    onChange((prev) => ({
                      ...prev,
                      customSections: (prev.customSections || []).map((s) =>
                        s.id === section.id
                          ? {
                              ...s,
                              items: s.items.filter(
                                (item) => item.id !== itemId,
                              ),
                            }
                          : s,
                      ),
                    }));
                  }}
                  onRemoveSection={() => {
                    onChange((prev) => ({
                      ...prev,
                      customSections: (prev.customSections || [])
                        .map((s) =>
                          s.id === section.id ? { ...s, title: "DELETED" } : s,
                        )
                        .filter((s) => s.title !== "DELETED"),
                      layout: {
                        ...prev.layout,
                        sectionOrder: (prev.layout?.sectionOrder || []).filter(
                          (id) => id !== `custom-${section.id}`,
                        ),
                      },
                    }));
                  }}
                />
              </AccordionItem>
            ))}

            <div className="px-6 py-4">
              <Button
                onClick={() => {
                  const newId = crypto.randomUUID();
                  onChange((prev) => ({
                    ...prev,
                    customSections: [
                      ...(prev.customSections || []),
                      { id: newId, title: "New Section", items: [] },
                    ],
                    layout: {
                      ...prev.layout,
                      sectionOrder: [
                        ...(prev.layout?.sectionOrder || [
                          "summary",
                          "experience",
                          "education",
                          "projects",
                          "volunteerWork",
                          "awards",
                          "skills",
                          "languages",
                          "interests",
                        ]),
                        `custom-${newId}`,
                      ],
                    },
                  }));
                }}
                variant="outline"
                className="w-full border-2 border-dashed border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-accent hover:text-accent hover:bg-accent/10 flex items-center justify-center gap-2 font-bold transition-colors rounded-none"
              >
                <Plus className="w-4 h-4" /> Add Custom Section
              </Button>
            </div>
          </Accordion>
        </div>
      </div>
    );
  },
);
