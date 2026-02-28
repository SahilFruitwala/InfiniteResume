const fs = require('fs');
let code = fs.readFileSync('app/components/Sidebar.tsx', 'utf8');

// Replace add
code = code.replace(/const (add[A-Za-z]+) = \(\) => \{\n\s*onChange\(\{\n\s*\.\.\.data,\n\s*([a-zA-Z]+): \[\n\s*(?:\.\.\.\(data\.\2 \|\| \[\]\)|\.\.\.data\.\2),\n\s*(\{.*?\})\n\s*\]\n\s*\}\);\n\s*\};/g, 
  "const $1 = React.useCallback(() => {\n    onChange(prev => ({\n      ...prev,\n      $2: [\n        ...(prev.$2 || []),\n        $3\n      ]\n    }));\n  }, [onChange]);");

// Replace update
code = code.replace(/const (update[A-Za-z]+) = \(id: string, field: keyof (.*?)\, value: string\) => \{\n\s*onChange\(\{\n\s*\.\.\.data,\n\s*([a-zA-Z]+): (?:\(data\.\3 \|\| \[\]\)|data\.\3)\.map\(([a-zA-Z]+) => \4\.id === id \? \{ \.\.\.\4\, \[field\]: value \} : \4\)\n\s*\}\);\n\s*\};/g,
  "const $1 = React.useCallback((id: string, field: keyof $2, value: string) => {\n    onChange(prev => ({\n      ...prev,\n      $3: (prev.$3 || []).map($4 => $4.id === id ? { ...$4, [field]: value } : $4)\n    }));\n  }, [onChange]);");

// Replace remove
code = code.replace(/const (remove[A-Za-z]+) = \(id: string\) => \{\n\s*onChange\(\{\n\s*\.\.\.data,\n\s*([a-zA-Z]+): (?:\(data\.\2 \|\| \[\]\)|data\.\2)\.filter\(([a-zA-Z]+) => \3\.id !== id\)\n\s*\}\);\n\s*\};/g,
  "const $1 = React.useCallback((id: string) => {\n    onChange(prev => ({\n      ...prev,\n      $2: (prev.$2 || []).filter($3 => $3.id !== id)\n    }));\n  }, [onChange]);");

fs.writeFileSync('app/components/Sidebar.tsx', code);
console.log("Done");
