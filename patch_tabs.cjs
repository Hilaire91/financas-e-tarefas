const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/\{ id: "dashboard", label: t\("tab_dashboard"\), icon: Zap \}/g, '{ id: "dashboard", label: "Página Inicial", icon: Zap }');
code = code.replace(/\{ id: "expenses", label: t\("tab_expenses"\), icon: CreditCard \}/g, '{ id: "expenses", label: "Lançamentos", icon: CreditCard }');
code = code.replace(/\{ id: "tasks", label: t\("tab_tasks"\), icon: CheckSquare \}/g, '{ id: "tasks", label: "Tarefas & Lembretes", icon: CheckSquare }');
code = code.replace(/\{ id: "budgets", label: t\("tab_budgets"\), icon: Target \}/g, '{ id: "budgets", label: "Orçamentos IA", icon: Target }');
code = code.replace(/\{ id: "subscription", label: t\("tab_subscription"\), icon: Star \}/g, '{ id: "subscription", label: "Assinatura PRO", icon: Star }');

// Change app name
code = code.replace(/\{t\("app_name"\)\}/g, 'Finanças&Tarefas');

fs.writeFileSync('src/App.tsx', code);
