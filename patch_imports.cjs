const fs = require('fs');
const files = [
  'src/components/AIAssistantPanel.tsx',
  'src/components/BankSyncPanel.tsx',
  'src/components/BudgetsPanel.tsx',
  'src/components/DashboardCharts.tsx',
  'src/components/SubscriptionPanel.tsx',
  'src/components/TaskChecklist.tsx'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  let hasChanges = false;

  if (!code.includes('import { useTranslation }')) {
    code = 'import { useTranslation } from "react-i18next";\n' + code;
    hasChanges = true;
  }
  
  if (!code.includes('import { formatCurrency }') && code.includes('formatCurrency')) {
    code = 'import { formatCurrency } from "../utils/format";\n' + code;
    hasChanges = true;
  }

  if (hasChanges) {
    fs.writeFileSync(file, code);
  }
}
