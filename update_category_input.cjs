const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /<select\n\s*value=\{newExpenseCat\}\n\s*onChange=\{\(e\) => setNewExpenseCat\(e.target.value as any\)\}\n\s*className=\{\`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer \$\{\n\s*isDarkMode \? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"\n\s*\}\`\}\n\s*>\n\s*\{newExpenseType === "gasto" \? \(\n\s*<>\n\s*<option value="Alimentação">Alimentação<\/option>\n\s*<option value="Transporte">Transporte<\/option>\n\s*<option value="Mercado">Mercado<\/option>\n\s*<option value="Saídas">Saídas<\/option>\n\s*<option value="Outros">Outros<\/option>\n\s*<\/>\n\s*\) : \(\n\s*<>\n\s*<option value="Salário">Salário<\/option>\n\s*<option value="Rendimento">Rendimento<\/option>\n\s*<option value="Outros">Outros<\/option>\n\s*<\/>\n\s*\)\}\n\s*<\/select>/,
  `
    <input
      type="text"
      list="category-options"
      value={newExpenseCat}
      onChange={(e) => setNewExpenseCat(e.target.value)}
      placeholder="Digite ou selecione"
      className={\`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 \${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"}\`}
    />
    <datalist id="category-options">
      {Array.from(new Set([
        ...(newExpenseType === "gasto" ? ["Alimentação", "Transporte", "Mercado", "Saídas", "Outros"] : ["Salário", "Rendimento", "Outros"]),
        ...budgets.map(b => b.category)
      ])).map(cat => (
        <option key={cat} value={cat} />
      ))}
    </datalist>
  `
);
fs.writeFileSync('src/App.tsx', code);
