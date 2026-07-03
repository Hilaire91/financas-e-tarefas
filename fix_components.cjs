const fs = require('fs');

function fixMissingQuotes(file, prop) {
  let code = fs.readFileSync(file, 'utf-8');
  const regex = new RegExp(prop + '=([a-zA-Z0-9_,. \\/\\\\n]+)\\n', 'g');
  code = code.replace(regex, (match, val) => {
    return prop + '="' + val.trim() + '"\n';
  });
  // Also check for unclosed quotes
  code = code.replace(/placeholder="Ex: 01\/07 MERCADO DA ESQUINA 45,90\\n02\/07 UBER 15,20\.\.\./g, 'placeholder={"Ex: 01/07 MERCADO DA ESQUINA 45,90\\n02/07 UBER 15,20..."}');
  fs.writeFileSync(file, code);
}

fixMissingQuotes('src/components/BankSyncPanel.tsx', 'placeholder');
fixMissingQuotes('src/components/BudgetsPanel.tsx', 'placeholder');
fixMissingQuotes('src/components/LoginScreen.tsx', 'placeholder');
fixMissingQuotes('src/components/TaskChecklist.tsx', 'placeholder');

// Let's also check App.tsx for similar placeholder errors
fixMissingQuotes('src/App.tsx', 'placeholder');

