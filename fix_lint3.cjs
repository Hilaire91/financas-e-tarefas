const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

appCode = appCode.replace(/const \{ t, i18n \} = useTranslation\(\);\n?/g, '');
appCode = appCode.replace(/import \{.*?\} from "lucide-react";/g, (match) => {
  if (!match.includes('LogOut')) {
    return match.replace('}', ', LogOut }');
  }
  return match;
});

// Since replace with global flag doesn't re-evaluate match, we will just manually add LogOut to App.tsx:
if (!appCode.includes('LogOut,')) {
    appCode = appCode.replace('VolumeX,', 'VolumeX, LogOut,');
}

fs.writeFileSync('src/App.tsx', appCode);

let budgetCode = fs.readFileSync('src/components/BudgetsPanel.tsx', 'utf-8');
budgetCode = budgetCode.replace(
  /const CATEGORY_COLORS: Record<ExpenseCategory, string> = \{[\s\S]*?\};/,
  `const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Alimentação: "#F59E0B",
  Transporte: "#3B82F6",
  Mercado: "#10B981",
  Saídas: "#EC4899",
  Outros: "#8B5CF6",
  Salário: "#22C55E",
  Rendimento: "#14B8A6",
};`
);
fs.writeFileSync('src/components/BudgetsPanel.tsx', budgetCode);

