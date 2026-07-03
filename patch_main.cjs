const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf-8');

if (!code.includes('import "./i18n";')) {
  code = code.replace('import App from "./App.tsx";', 'import "./i18n";\nimport App from "./App.tsx";');
  fs.writeFileSync('src/main.tsx', code);
}
