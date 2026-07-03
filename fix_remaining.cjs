const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(/impor"\.\/types"\.ChecklistItem\[\]/g, 'any[]');
fs.writeFileSync('src/App.tsx', appCode);

let budgetsCode = fs.readFileSync('src/components/BudgetsPanel.tsx', 'utf-8');
budgetsCode = budgetsCode.replace(/placeholder=R\$/g, 'placeholder="R$"');
fs.writeFileSync('src/components/BudgetsPanel.tsx', budgetsCode);

