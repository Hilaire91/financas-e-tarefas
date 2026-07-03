const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf-8');
code = code.replace(/<title>.*?<\/title>/, '<title>Finanças&amp;Tarefas</title>');
fs.writeFileSync('index.html', code);
