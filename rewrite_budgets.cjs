const fs = require('fs');

const code = `
import React, { useState } from "react";
import { motion } from "motion/react";
import { Sliders, BellRing, Settings2, ShieldAlert, CheckCircle, Trash2, Plus } from "lucide-react";
import { Budget, ExpenseCategory, Expense } from "../types";
import { formatCurrency } from "../utils/format";

interface BudgetsPanelProps {
  budgets: Budget[];
  expenses: Expense[];
  onUpdateBudget: (category: string, limit: number) => void;
  onAddBudget: (category: string, limit: number) => void;
  onDeleteBudget: (category: string) => void;
  isDarkMode: boolean;
  onSendNotification: (text: string, type: 'alert' | 'success' | 'info') => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  Alimentação: "🍔",
  Transporte: "🚗",
  Mercado: "🛒",
  Saídas: "🍸",
  Outros: "📦",
  Salário: "💰",
  Rendimento: "📈",
};

export default function BudgetsPanel({ budgets, expenses, onUpdateBudget, onAddBudget, onDeleteBudget, isDarkMode, onSendNotification }: BudgetsPanelProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState("");
  const [alertThreshold, setAlertThreshold] = useState(80);
  
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const spentMap = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleEdit = (budget: Budget) => {
    setEditingCategory(budget.category);
    setTempLimit(budget.limit.toString());
  };

  const handleSave = (category: string) => {
    const limitNum = parseFloat(tempLimit);
    if (!isNaN(limitNum) && limitNum >= 0) {
      onUpdateBudget(category, limitNum);
      
      const spent = spentMap[category] || 0;
      const pct = (spent / limitNum) * 100;
      
      onSendNotification(
        \`Orçamento de \${category} redefinido para \${formatCurrency(limitNum)}.\`,
        "info"
      );

      if (pct >= 100) {
        onSendNotification(
          \`Alerta: Gastos com \${category} (\${formatCurrency(spent)}) ultrapassaram o novo limite de \${formatCurrency(limitNum)}!\`,
          "alert"
        );
      } else if (pct >= alertThreshold) {
        onSendNotification(
          \`Atenção: Você atingiu \${pct.toFixed(0)}% do orçamento de \${category}.\`,
          "alert"
        );
      }
      setEditingCategory(null);
    }
  };

  return (
    <div className={\`p-6 rounded-3xl border mb-8 \${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}\`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">Orçamentos & Metas de Limites</h3>
            <p className={\`text-xs \${isDarkMode ? "text-gray-400" : "text-gray-500"}\`}>
              Configure limites mensais por categoria e receba alertas inteligentes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-xl border border-gray-100 dark:border-gray-800">
          <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="font-semibold text-[11px]">Alerta aos:</span>
          <select
            value={alertThreshold}
            onChange={(e) => {
              const val = Number(e.target.value);
              setAlertThreshold(val);
              onSendNotification(\`Limite de alerta por meta redefinido para \${val}% do orçamento.\`, "info");
            }}
            className="bg-transparent font-bold focus:outline-none focus:ring-0 text-violet-400 cursor-pointer text-xs"
          >
            <option value={70}>70%</option>
            <option value={80}>80%</option>
            <option value={90}>90%</option>
            <option value={100}>100%</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {budgets.map((budget) => {
          const spent = spentMap[budget.category] || 0;
          const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
          const isOver = spent > budget.limit;
          const isNear = percentage >= alertThreshold && !isOver;

          return (
            <div
              key={budget.category}
              className={\`p-4 rounded-2xl border transition-all \${
                isOver 
                  ? (isDarkMode ? "bg-rose-500/5 border-rose-500/20" : "bg-rose-50/50 border-rose-200") 
                  : isNear 
                  ? (isDarkMode ? "bg-amber-500/5 border-amber-500/20" : "bg-amber-50/50 border-amber-200")
                  : (isDarkMode ? "bg-gray-800/30 border-gray-800" : "bg-gray-50/50 border-gray-100")
              }\`}
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{CATEGORY_ICONS[budget.category] || "🎯"}</span>
                  <div>
                    <h4 className="font-bold text-sm">{budget.category}</h4>
                    <p className={\`text-[10px] \${isDarkMode ? "text-gray-500" : "text-gray-400"}\`}>
                      Gasto: R$ {spent.toFixed(2).replace(".", ",")} de R$ {budget.limit.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>

                {editingCategory === budget.category ? (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <input
                      type="number"
                      value={tempLimit}
                      onChange={(e) => setTempLimit(e.target.value)}
                      placeholder="R$"
                      className={\`w-20 px-2 py-1 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono text-center \${
                        isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-300"
                      }\`}
                    />
                    <button
                      onClick={() => handleSave(budget.category)}
                      className="px-2.5 py-1 bg-violet-600 text-white text-[11px] font-bold rounded-lg hover:bg-violet-700 cursor-pointer"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="px-2 py-1 text-gray-400 text-[11px] hover:underline cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeleteBudget(budget.category)}
                      className={\`p-1.5 rounded-lg border transition-colors cursor-pointer \${
                        isDarkMode ? "border-gray-700 hover:bg-rose-500/20 text-gray-400 hover:text-rose-500" : "border-gray-200 hover:bg-rose-50 text-gray-600 hover:text-rose-500"
                      }\`}
                      title="Excluir Orçamento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 \${
                      isOver 
                        ? "bg-rose-500/10 text-rose-500" 
                        : isNear 
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-emerald-500/10 text-emerald-500"
                    }\`}>
                      {isOver ? (
                        <>
                          <ShieldAlert className="w-3 h-3" /> Estouro
                        </>
                      ) : isNear ? (
                        <>
                          <BellRing className="w-3 h-3" /> Limite Próximo
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3" /> Sob Controle
                        </>
                      )}
                      <span>{percentage.toFixed(0)}%</span>
                    </span>
                    <button
                      onClick={() => handleEdit(budget)}
                      className={\`p-1.5 rounded-lg border transition-colors cursor-pointer \${
                        isDarkMode ? "border-gray-700 hover:bg-gray-800 text-gray-400" : "border-gray-200 hover:bg-gray-100 text-gray-600"
                      }\`}
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="relative w-full h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: \`\${Math.min(percentage, 100)}%\` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={\`h-full rounded-full \${
                    isOver ? "bg-rose-500" : isNear ? "bg-amber-500" : "bg-emerald-500"
                  }\`}
                />
              </div>
            </div>
          );
        })}

        {/* Add Budget Block */}
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
}
`;

fs.writeFileSync('src/components/BudgetsPanel.tsx', code);
