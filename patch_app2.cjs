const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const langSwitcher = `
            {/* Language Switcher */}
            <select
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              value={i18n.language}
              className={\`p-1.5 text-xs font-bold rounded-xl border focus:outline-none cursor-pointer \${
                isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-700"
              }\`}
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
`;

code = code.replace('{/* Dark Mode Toggle */}', langSwitcher + '\n            {/* Dark Mode Toggle */}');
fs.writeFileSync('src/App.tsx', code);
