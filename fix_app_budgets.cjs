const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

appCode = appCode.replace(
  /const updateBudgetLimit = \(category: ExpenseCategory, limit: number\) => \{\n\s*setBudgets\(prev => prev.map\(b => b.category === category \? \{ ...b, limit \} : b\)\);\n\s*\};/,
  `const updateBudgetLimit = (category: ExpenseCategory, limit: number) => {
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, limit } : b));
  };
  
  const addBudget = (category: string, limit: number) => {
    if (!budgets.find(b => b.category === category)) {
      setBudgets(prev => [...prev, { category, limit }]);
    }
  };
  
  const deleteBudget = (category: string) => {
    setBudgets(prev => prev.filter(b => b.category !== category));
  };`
);

appCode = appCode.replace(
  /<BudgetsPanel\s*budgets=\{budgets\}\s*expenses=\{expenses\}\s*onUpdateBudget=\{updateBudgetLimit\}\s*isDarkMode=\{isDarkMode\}\s*onSendNotification=\{sendNotification\}\s*\/>/m,
  `<BudgetsPanel
                budgets={budgets}
                expenses={expenses}
                onUpdateBudget={updateBudgetLimit}
                onAddBudget={addBudget}
                onDeleteBudget={deleteBudget}
                isDarkMode={isDarkMode}
                onSendNotification={sendNotification}
              />`
);

fs.writeFileSync('src/App.tsx', appCode);
