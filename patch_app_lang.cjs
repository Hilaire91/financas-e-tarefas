const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const newSelect = `
            {/* Language Switcher */}
            <select
              onChange={(e) => {
                i18n.changeLanguage(e.target.value);
                localStorage.setItem('fin_tarefas_lang', e.target.value);
              }}
              value={i18n.language}
              className={\`p-1.5 text-xs font-bold rounded-xl border focus:outline-none cursor-pointer \${
                isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-700"
              }\`}
            >
              <option value="pt">PT</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="it">IT</option>
            </select>
`;

code = code.replace(/\{\/\* Language Switcher \*\/\}[\s\S]*?<\/select>/, newSelect.trim());

// also change the tabs to use t()
code = code.replace(/\{ id: "dashboard", label: "Painel Geral", icon: Zap \}/, '{ id: "dashboard", label: t("tab_dashboard"), icon: Zap }');
code = code.replace(/\{ id: "expenses", label: "Gastos & Banco", icon: CreditCard \}/, '{ id: "expenses", label: t("tab_expenses"), icon: CreditCard }');
code = code.replace(/\{ id: "tasks", label: "Tarefas & Lembretes", icon: CheckSquare \}/, '{ id: "tasks", label: t("tab_tasks"), icon: CheckSquare }');
code = code.replace(/\{ id: "budgets", label: "Orçamentos IA", icon: Target \}/, '{ id: "budgets", label: t("tab_budgets"), icon: Target }');
code = code.replace(/\{ id: "subscription", label: "Assinatura PRO", icon: Star \}/, '{ id: "subscription", label: t("tab_subscription"), icon: Star }');

fs.writeFileSync('src/App.tsx', code);
