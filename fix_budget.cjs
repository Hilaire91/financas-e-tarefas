const fs = require('fs');

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

