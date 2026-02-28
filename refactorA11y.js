const fs = require('fs');
let code = fs.readFileSync('app/components/Sidebar.tsx', 'utf8');

// Replace placeholders ending with ... to …
code = code.replace(/placeholder="([^"]+)\.\.\."/g, 'placeholder="$1…"');

// Add aria-labels to buttons wrapping icons
code = code.replace(/<button([^>]*)>\s*<Trash2([^>]*)\/>\s*<\/button>/g, '<button$1 aria-label="Delete">\n                  <Trash2$2/>\n                </button>');

code = code.replace(/<button([^>]*)>\s*<ArrowUp([^>]*)\/>\s*<\/button>/g, '<button$1 aria-label="Move section up">\n                       <ArrowUp$2/>\n                     </button>');

code = code.replace(/<button([^>]*)>\s*<ArrowDown([^>]*)\/>\s*<\/button>/g, '<button$1 aria-label="Move section down">\n                       <ArrowDown$2/>\n                     </button>');

// Fix Phone input type
code = code.replace(/type="text" value=\{data\.personalInfo\.phone\}/g, 'type="tel" name="phone" autoComplete="tel" value={data.personalInfo.phone}');

// Fix Email
code = code.replace(/type="email" value=\{data\.personalInfo\.email\}/g, 'type="email" name="email" autoComplete="email" value={data.personalInfo.email}');

// Fix Full Name
code = code.replace(/type="text" value=\{data\.personalInfo\.fullName\}/g, 'type="text" name="fullName" autoComplete="name" value={data.personalInfo.fullName}');

// Fix Location
code = code.replace(/type="text" value=\{data\.personalInfo\.location\}/g, 'type="text" name="location" autoComplete="address-level2" value={data.personalInfo.location}');

// Fix Website
code = code.replace(/type="text" value=\{data\.personalInfo\.website\}/g, 'type="url" name="website" autoComplete="url" value={data.personalInfo.website}');

fs.writeFileSync('app/components/Sidebar.tsx', code);

// Preview.tsx
let previewCode = fs.readFileSync('app/components/Preview.tsx', 'utf8');
previewCode = previewCode.replace(/Generating\.\.\./g, 'Generating…');
fs.writeFileSync('app/components/Preview.tsx', previewCode);

console.log("A11y Refactor Done");
