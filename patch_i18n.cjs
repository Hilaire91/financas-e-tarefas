const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf-8');

code = code.replace(/greeting: 'Hello, User'/, "greeting: 'Hello'");
code = code.replace(/greeting: 'Olá, Usuário'/, "greeting: 'Olá'");
code = code.replace(/greeting: 'Hola, Usuario'/, "greeting: 'Hola'");

fs.writeFileSync('src/i18n.ts', code);
