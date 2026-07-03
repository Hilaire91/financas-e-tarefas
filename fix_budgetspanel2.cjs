const fs = require('fs');
let code = fs.readFileSync('src/components/BudgetsPanel.tsx', 'utf-8');

const replacement = `
        {isAdding ? (
          <div className={\`p-4 rounded-2xl border transition-all \${isDarkMode ? "bg-gray-800/30 border-gray-700" : "bg-gray-50/50 border-gray-200"}\`}>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Nome da Categoria (Ex: Viagem)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className={\`w-full p-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-violet-500 \${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"}\`}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Limite (R$)"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className={\`w-full p-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-violet-500 \${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"}\`}
                />
                <button
                  onClick={() => {
                    if (newCategory && newLimit) {
                      onAddBudget(newCategory, parseFloat(newLimit));
                      setNewCategory("");
                      setNewLimit("");
                      setIsAdding(false);
                      onSendNotification(\`Orçamento para \${newCategory} criado!\`, "success");
                    }
                  }}
                  className="px-4 py-2 bg-violet-600 text-white text-[11px] font-bold rounded-lg hover:bg-violet-700 cursor-pointer"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-gray-400 text-[11px] hover:underline cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className={\`w-full p-4 rounded-2xl border border-dashed flex items-center justify-center gap-2 transition-colors cursor-pointer \${
              isDarkMode ? "border-gray-700 hover:border-violet-500 text-gray-400 hover:text-violet-400" : "border-gray-300 hover:border-violet-500 text-gray-500 hover:text-violet-600"
            }\`}
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold text-sm">Criar Novo Orçamento</span>
          </button>
        )}
      </div>
    </div>
  );
}`;

const target = `      </div>\n    </div>\n  );\n}`;
const target2 = `      </div>\r\n    </div>\r\n  );\r\n}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
} else if (code.includes(target2)) {
  code = code.replace(target2, replacement);
} else {
  // Try regex
  code = code.replace(/<\/div>\s*<\/div>\s*\);\s*\}/, replacement);
}

fs.writeFileSync('src/components/BudgetsPanel.tsx', code);
