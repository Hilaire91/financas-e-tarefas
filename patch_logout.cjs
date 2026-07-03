const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/title="Bloquear aplicativo"/g, 'title="Sair"');
code = code.replace(/<Lock className="w-4\.5 h-4\.5" \/>/g, '<LogOut className="w-4.5 h-4.5" />');

if (!code.includes('LogOut')) {
  code = code.replace(/import \{.*?\} from "lucide-react";/, (match) => {
    return match.replace('}', ', LogOut }');
  });
}

fs.writeFileSync('src/App.tsx', code);
