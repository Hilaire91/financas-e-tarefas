const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf-8');
  
  // Fix spli"T"
  code = code.replace(/spli"T"/g, 'split("T")');

  // Fix Int.NumberForma"pt-BR"
  code = code.replace(/Intl\.NumberForma"pt-BR"\.format/g, 'Intl.NumberFormat("pt-BR").format');

  // Fix placeholder=0,00 -> placeholder="0,00"
  code = code.replace(/placeholder=0,00/g, 'placeholder="0,00"');
  code = code.replace(/placeholder=Ex:/g, 'placeholder="Ex:');

  // Fix syntax in form replacement
  code = code.replace(/placeholder="Ex: 01\/07 MERCADO DA ESQUINA 45,90\\n02\/07 UBER 15,20\.\.\."/, 'placeholder={"Ex: 01/07 MERCADO DA ESQUINA 45,90\\n02/07 UBER 15,20..."}');

  fs.writeFileSync(file, code);
}

['src/App.tsx', 'src/components/BankSyncPanel.tsx', 'src/components/DashboardCharts.tsx', 'src/components/LoginScreen.tsx', 'src/components/BudgetsPanel.tsx', 'src/components/TaskChecklist.tsx'].forEach(file => {
  if (fs.existsSync(file)) {
    fixFile(file);
  }
});
