const fs = require('fs');
let code = fs.readFileSync('app/components/Sidebar.tsx', 'utf8');

const sections = [
  { name: 'Experience', type: 'Experience', listVar: 'experience', singular: 'exp' },
  { name: 'Education', type: 'Education', listVar: 'education', singular: 'edu' },
  { name: 'Project', type: 'Project', listVar: 'projects', singular: 'proj' },
  { name: 'SocialLink', type: 'SocialLink', listVar: 'socialLinks', singular: 'link' },
  { name: 'Award', type: 'Award', listVar: 'awards', singular: 'item' },
  { name: 'Language', type: 'Language', listVar: 'languages', singular: 'item' },
  { name: 'Volunteer', type: 'Volunteer', listVar: 'volunteerWork', singular: 'item' },
  { name: 'Interest', type: 'Interest', listVar: 'interests', singular: 'item' },
  { name: 'SkillCategory', type: 'SkillCategory', listVar: 'skills', singular: 'item' }
];

let componentsText = '';

for (const sec of sections) {
  // Find the content inside the AccordionItem for this section
  // It starts with <div className="space-y-6"> and ends right before </AccordionItem>
  // Actually, wait, it's easier to find 
  // <AccordionItem title="X"> (\s* <div className="space-y-6"> ... </button>\s*</div>\s*)
  // But wait, the title for SocialLink is "Social Links", Project is "Projects".
  
  let titleMap = {
    Experience: 'Experience',
    Education: 'Education',
    Project: 'Projects',
    SocialLink: 'Social Links',
    Award: 'Awards',
    Language: 'Languages',
    Volunteer: 'Volunteer Work',
    Interest: 'Interests',
    SkillCategory: 'Skills'
  };
  
  let regexStr = `<AccordionItem title="${titleMap[sec.name]}">([\\s\\S]*?)<\\/AccordionItem>`;
  let regex = new RegExp(regexStr);
  let match = code.match(regex);
  if (match) {
    let content = match[1];
    
    // Replace data.X with items and function calls with onAdd, onUpdate, onRemove
    let compContent = content
      .replace(new RegExp(`data\\.${sec.listVar}\\.map`, 'g'), `items.map`)
      .replace(new RegExp(`\\(data\\.${sec.listVar} \\|\\| \\[\\]\\)\\.map`, 'g'), `items.map`)
      .replace(new RegExp(`remove${sec.name}\\(`, 'g'), `onRemove(`)
      .replace(new RegExp(`update${sec.name}\\(`, 'g'), `onUpdate(`)
      .replace(new RegExp(`add${sec.name}`, 'g'), `onAdd`);
      
    componentsText += `\nconst ${sec.name}Section = React.memo(({ items, onAdd, onUpdate, onRemove }: { items: ${sec.type}[], onAdd: () => void, onUpdate: (id: string, field: keyof ${sec.type}, value: string) => void, onRemove: (id: string) => void }) => {\n  return (\n    <>\n${compContent}\n    </>\n  );\n});\n`;
    
    // Replace the content inside AccordionItem with the new component usage
    let fallback = sec.listVar === 'experience' || sec.listVar === 'education' || sec.listVar === 'projects' ? `data.${sec.listVar}` : `(data.${sec.listVar} || [])`;
    let newUsage = `\n          <${sec.name}Section \n            items={${fallback}}\n            onAdd={add${sec.name}}\n            onUpdate={update${sec.name}}\n            onRemove={remove${sec.name}}\n          />\n        `;
    
    code = code.replace(match[0], `<AccordionItem title="${titleMap[sec.name]}">${newUsage}</AccordionItem>`);
  }
}

// Write the components to the top of the file just before Sidebar component
let sidebarIndex = code.indexOf('export const Sidebar = ');
code = code.substring(0, sidebarIndex) + componentsText + '\n' + code.substring(sidebarIndex);

fs.writeFileSync('app/components/Sidebar.tsx', code);
console.log("Refactor Components Done");
