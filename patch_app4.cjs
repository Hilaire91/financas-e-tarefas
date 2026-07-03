const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/{t\("greeting"\)\.replace\(\/\,\? Usuário\/i, ""\)}\{t\("greeting"\)\.includes\(\","\) \? "" : ","\} \{userName\}!/, '{t("greeting")}, {userName}!');

fs.writeFileSync('src/App.tsx', code);
