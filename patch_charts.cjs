const fs = require('fs');

let code = fs.readFileSync('src/components/DashboardCharts.tsx', 'utf-8');

code = code.replace(
  /const CATEGORY_COLORS: Record<ExpenseCategory, string> = \{/,
  `const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Salário: "#22C55E",
  Rendimento: "#14B8A6",`
);

code = code.replace(
  /expenses\.reduce\(\(acc, curr\) => \{/,
  `expenses.filter(e => e.type !== 'rendimento').reduce((acc, curr) => {`
);

fs.writeFileSync('src/components/DashboardCharts.tsx', code);
