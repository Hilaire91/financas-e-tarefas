const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  'const totalSpentMonth = expenses.reduce((sum, e) => sum + e.amount, 0);',
  `const totalSpentMonth = expenses.filter(e => e.type !== 'rendimento').reduce((sum, e) => sum + e.amount, 0);
  const totalIncomeMonth = expenses.filter(e => e.type === 'rendimento').reduce((sum, e) => sum + e.amount, 0);
  const currentBalance = totalIncomeMonth - totalSpentMonth;`
);

const metricReplacement = `
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={\`p-5 rounded-3xl border flex items-center gap-4 transition-all \${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}\`}>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Saldo Atual</p>
              <p className={\`font-display text-lg font-extrabold font-mono \${currentBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'}\`}>
                {formatCurrency(currentBalance)}
              </p>
            </div>
          </div>

          <div className={\`p-5 rounded-3xl border flex items-center gap-4 transition-all \${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}\`}>
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Gastos Totais</p>
              <p className="font-display text-lg font-extrabold font-mono text-amber-500">{formatCurrency(totalSpentMonth)}</p>
            </div>
          </div>

          <div className={\`p-5 rounded-3xl border flex items-center gap-4 transition-all \${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}\`}>
            <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Orçamento Consumido</p>
              <p className="font-display text-lg font-extrabold font-mono text-violet-500">
                {averageBudgetPercent.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
`;

code = code.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">[\s\S]*?<\/div>\s*<\/div>/,
  metricReplacement
);

// We need to make sure Activity is imported
if (!code.includes('Activity,')) {
  code = code.replace('TrendingDown,', 'TrendingDown, Activity,');
}

fs.writeFileSync('src/App.tsx', code);
