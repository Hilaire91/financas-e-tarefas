const fs = require('fs');

let budgetCode = fs.readFileSync('src/components/BudgetsPanel.tsx', 'utf-8');
budgetCode = budgetCode.replace(
  /const CATEGORY_ICONS: Record<ExpenseCategory, string> = \{[\s\S]*?\};/,
  `const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Alimentação: "🍔",
  Transporte: "🚗",
  Mercado: "🛒",
  Saídas: "🍸",
  Outros: "📦",
  Salário: "💰",
  Rendimento: "📈",
};`
);
fs.writeFileSync('src/components/BudgetsPanel.tsx', budgetCode);

