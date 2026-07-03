const fs = require('fs');
let code = fs.readFileSync('src/components/BudgetsPanel.tsx', 'utf-8');

code = code.replace(
  /interface BudgetsPanelProps \{/,
  `interface BudgetsPanelProps {\n  onAddBudget: (category: string, limit: number) => void;\n  onDeleteBudget: (category: string) => void;`
);

code = code.replace(
  /export default function BudgetsPanel\(\{ budgets, expenses, onUpdateBudget, isDarkMode, onSendNotification \}: BudgetsPanelProps\) \{/,
  `export default function BudgetsPanel({ budgets, expenses, onUpdateBudget, onAddBudget, onDeleteBudget, isDarkMode, onSendNotification }: BudgetsPanelProps) {
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [isAdding, setIsAdding] = useState(false);`
);

// We need to add a generic icon or change how CATEGORY_ICONS handles missing keys.
code = code.replace(
  /const CATEGORY_ICONS: Record<ExpenseCategory, string> = \{/,
  `const CATEGORY_ICONS: Record<string, string> = {`
);

code = code.replace(
  /\{CATEGORY_ICONS\[budget\.category\]\}/,
  `{CATEGORY_ICONS[budget.category] || "🎯"}`
);

// Add the "Excluir" button for existing budgets and "Adicionar" button for new budgets
code = code.replace(
  /<div className="flex items-center gap-2">(\s*)<span className=\{`text-\[10px\] font-bold/,
  `<div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeleteBudget(budget.category)}
                      className={\`p-1.5 rounded-lg border transition-colors cursor-pointer \${
                        isDarkMode ? "border-gray-700 hover:bg-rose-500/20 text-gray-400 hover:text-rose-500" : "border-gray-200 hover:bg-rose-50 text-gray-600 hover:text-rose-500"
                      }\`}
                      title="Excluir Orçamento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className={\`text-[10px] font-bold`
);

// Replace imports to include Trash2 and Plus
code = code.replace(
  /import \{ (.*?) \} from "lucide-react";/,
  `import { $1, Trash2, Plus } from "lucide-react";`
);

// Add the Add Budget form at the bottom of the budgets list
code = code.replace(
  /\{budgets\.map\(\(budget\) => \{/,
  `{budgets.map((budget) => {`
);

// Insert add budget form before closing div
code = code.replace(
  /      <\/div>\n    <\/div>\n  \);\n\}/,
  `        {isAdding ? (
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
}`
);

fs.writeFileSync('src/components/BudgetsPanel.tsx', code);
