const fs = require('fs');
let code = fs.readFileSync('src/i18n.ts', 'utf-8');
code = code.replace("login_email_placeholder: 'Your email',", "login_name_placeholder: 'Your name',\n    login_email_placeholder: 'Your email',");
code = code.replace("login_email_placeholder: 'Seu email',", "login_name_placeholder: 'Seu nome',\n    login_email_placeholder: 'Seu email',");
code = code.replace("login_email_placeholder: 'Su correo',", "login_name_placeholder: 'Su nombre',\n    login_email_placeholder: 'Su correo',");
fs.writeFileSync('src/i18n.ts', code);
