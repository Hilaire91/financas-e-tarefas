const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes('import { formatCurrency } from "./utils/format"')) {
  code = code.replace('import { useTranslation } from "react-i18next";', 'import { useTranslation } from "react-i18next";\nimport { formatCurrency } from "./utils/format";');
}

// Fix notifications to use translations
code = code.replace(
  /sendNotification\(\`Estouro de Orçamento! Gastos em \$\{item\.category\} superaram o limite de R\$ \$\{categoryBudget\.limit\}\`, "alert"\);/g,
  'sendNotification(t("notif_budget_exceeded", { category: item.category, limit: formatCurrency(categoryBudget.limit) }), "alert");'
);

code = code.replace(
  /sendNotification\(\`Despesa de R\$ \$\{amt.toFixed\(2\)\} em \$\{newExpenseCat\} registrada!\`, "success"\);/g,
  'sendNotification(t("notif_expense_added", { amount: formatCurrency(amt), category: newExpenseCat }), "success");'
);

code = code.replace(
  /sendNotification\(\`Alerta de Gasto: Orçamento de \$\{newExpenseCat\} estourado! Limite: R\$ \$\{budget.limit.toFixed\(2\)\}\`, "alert"\);/g,
  'sendNotification(t("notif_budget_alert", { category: newExpenseCat, limit: formatCurrency(budget.limit) }), "alert");'
);

code = code.replace(
  />R\$ \{amt\.toFixed\(2\)\}<\/span>/g,
  '>{formatCurrency(amt)}</span>'
);

code = code.replace(
  />Valor \(R\$\)<\/span>/g,
  '>{t("value")}</span>'
);

code = code.replace(
  /placeholder="R\$ 0,00"/g,
  'placeholder={t("amount_placeholder")}'
);

fs.writeFileSync('src/App.tsx', code);
