const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add states for type and paymentMethod
if (!code.includes('newExpenseType')) {
  code = code.replace(
    'const [newExpenseCat, setNewExpenseCat] = useState<ExpenseCategory>("Alimentação");',
    `const [newExpenseCat, setNewExpenseCat] = useState<ExpenseCategory>("Alimentação");
  const [newExpenseType, setNewExpenseType] = useState<"gasto" | "rendimento">("gasto");
  const [newExpensePayment, setNewExpensePayment] = useState<"crédito" | "pix" | "débito" | "dinheiro" | "outro">("pix");`
  );
}

// 2. Update handleAddExpense to include these
code = code.replace(
  'const newExpense: Expense = {',
  `const newExpense: Expense = {
      type: newExpenseType,
      paymentMethod: newExpensePayment,`
);

code = code.replace(
  /setNewExpenseAmt\(""\);/,
  `setNewExpenseAmt("");
    setNewExpenseType("gasto");
    setNewExpensePayment("pix");`
);

// 3. Update the form UI
const formReplacement = `
                    <form onSubmit={handleAddExpense} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={\`block text-[10px] font-bold uppercase tracking-wider mb-1.5 \${isDarkMode ? "text-gray-400" : "text-gray-500"}\`}>
                            Tipo de Transação
                          </label>
                          <select
                            value={newExpenseType}
                            onChange={(e) => setNewExpenseType(e.target.value as any)}
                            className={\`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer \${
                              isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                            }\`}
                          >
                            <option value="gasto">Gasto / Despesa</option>
                            <option value="rendimento">Rendimento / Salário</option>
                          </select>
                        </div>
                        <div>
                          <label className={\`block text-[10px] font-bold uppercase tracking-wider mb-1.5 \${isDarkMode ? "text-gray-400" : "text-gray-500"}\`}>
                            Valor (R$)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={newExpenseAmt}
                            onChange={(e) => setNewExpenseAmt(e.target.value)}
                            placeholder="0,00"
                            className={\`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono \${
                              isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                            }\`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={\`block text-[10px] font-bold uppercase tracking-wider mb-1.5 \${isDarkMode ? "text-gray-400" : "text-gray-500"}\`}>
                          Descrição / Origem
                        </label>
                        <input
                          type="text"
                          required
                          value={newExpenseDesc}
                          onChange={(e) => setNewExpenseDesc(e.target.value)}
                          placeholder="Ex: Almoço, Salário..."
                          className={\`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 \${
                            isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                          }\`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={\`block text-[10px] font-bold uppercase tracking-wider mb-1.5 \${isDarkMode ? "text-gray-400" : "text-gray-500"}\`}>
                            Categoria
                          </label>
                          <select
                            value={newExpenseCat}
                            onChange={(e) => setNewExpenseCat(e.target.value as any)}
                            className={\`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer \${
                              isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                            }\`}
                          >
                            {newExpenseType === "gasto" ? (
                              <>
                                <option value="Alimentação">Alimentação</option>
                                <option value="Transporte">Transporte</option>
                                <option value="Mercado">Mercado</option>
                                <option value="Saídas">Saídas</option>
                                <option value="Outros">Outros</option>
                              </>
                            ) : (
                              <>
                                <option value="Salário">Salário</option>
                                <option value="Rendimento">Rendimento</option>
                                <option value="Outros">Outros</option>
                              </>
                            )}
                          </select>
                        </div>
                        <div>
                          <label className={\`block text-[10px] font-bold uppercase tracking-wider mb-1.5 \${isDarkMode ? "text-gray-400" : "text-gray-500"}\`}>
                            Método
                          </label>
                          <select
                            value={newExpensePayment}
                            onChange={(e) => setNewExpensePayment(e.target.value as any)}
                            className={\`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer \${
                              isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                            }\`}
                          >
                            <option value="pix">PIX</option>
                            <option value="crédito">Cartão de Crédito</option>
                            <option value="débito">Cartão de Débito</option>
                            <option value="dinheiro">Dinheiro</option>
                            <option value="outro">Outro</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className={\`block text-[10px] font-bold uppercase tracking-wider mb-1.5 \${isDarkMode ? "text-gray-400" : "text-gray-500"}\`}>
                          Data da Transação
                        </label>
                        <input
                          type="date"
                          value={newExpenseDate}
                          onChange={(e) => setNewExpenseDate(e.target.value)}
                          className={\`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono \${
                            isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                          }\`}
                        />
                      </div>
`;

code = code.replace(/<form onSubmit=\{handleAddExpense\} className="space-y-4">[\s\S]*?<\/div>\s*<button\s*type="submit"/, formReplacement + '\n                      <button type="submit"');

// Header update to keep ONLY customer name
code = code.replace(
  /<div className="flex items-center gap-3">[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  `<div className="flex items-center gap-3">
            <div>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Olá, {userName}
              </span>
            </div>
          </div>`
);

// Remove the greeting section in the main layout
code = code.replace(
  /\{\/\* GREETING SECTION \*\/\}[\s\S]*?<\/div>/,
  ''
);

fs.writeFileSync('src/App.tsx', code);
