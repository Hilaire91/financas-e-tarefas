const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /<div className="flex items-center gap-3">\s*<div>\s*<span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">\s*Olá, \{userName\}\s*<\/span>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
  `<div className="flex items-center gap-3">
            <div>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Olá, {userName}
              </span>
            </div>
          </div>`
);

fs.writeFileSync('src/App.tsx', code);
