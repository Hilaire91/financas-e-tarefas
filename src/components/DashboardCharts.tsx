import { formatCurrency } from "../utils/format";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Expense, ExpenseCategory } from "../types";

interface DashboardChartsProps {
  expenses: Expense[];
  isDarkMode: boolean;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Salário: "#22C55E",
  Rendimento: "#14B8A6",
  Alimentação: "#F59E0B", // Orange/Amber
  Transporte: "#3B82F6",  // Blue
  Mercado: "#10B981",     // Emerald
  Saídas: "#EC4899",      // Pink
  Outros: "#8B5CF6",      // Violet
};

export default function DashboardCharts({ expenses, isDarkMode }: DashboardChartsProps) {
    // Process data for category pie chart
  const categoryData = Object.entries(
    expenses.filter(e => e.type !== 'rendimento').reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>)
  ).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  // Process data for daily trend chart (last 7 days of items)
  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const dailyTotals = sortedExpenses.reduce((acc, curr) => {
    const formattedDate = new Date(curr.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    acc[formattedDate] = (acc[formattedDate] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const trendData = Object.entries(dailyTotals).map(([date, total]) => ({
    date,
    total: parseFloat(total.toFixed(2)),
  })).slice(-7); // Keep last 7 days

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* Category Consumption Chart */}
      <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <span>Distribuição de Gastos</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
            Por Categoria
          </span>
        </h3>
        
        <div className="h-64 relative flex items-center justify-center">
          {categoryData.length === 0 ? (
            <div className="text-sm text-gray-400">Nenhum gasto registrado.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as ExpenseCategory]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Total"]}
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                    borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                    color: isDarkMode ? "#FFFFFF" : "#111827",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          {Object.keys(CATEGORY_COLORS).map((cat) => {
            const hasData = categoryData.find((d) => d.name === cat);
            const amt = hasData ? hasData.value : 0;
            return (
              <div key={cat} className="flex items-center gap-1.5 text-xs font-medium">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat as ExpenseCategory] }} />
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{cat}</span>
                <span className="text-gray-400 font-mono">({formatCurrency(amt)})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Evolution Trend Chart */}
      <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <span>Evolução Diária</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
            Últimos Gastos
          </span>
        </h3>

        <div className="h-64">
          {trendData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              Registre gastos para visualizar a tendência diária.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1F2937" : "#E5E7EB"} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: isDarkMode ? "#9CA3AF" : "#4B5563", fontSize: 10 }}
                  axisLine={{ stroke: isDarkMode ? "#374151" : "#D1D5DB" }}
                />
                <YAxis 
                  tick={{ fill: isDarkMode ? "#9CA3AF" : "#4B5563", fontSize: 10 }}
                  axisLine={{ stroke: isDarkMode ? "#374151" : "#D1D5DB" }}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Consumo"]}
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
                    borderColor: isDarkMode ? "#374151" : "#E5E7EB",
                    color: isDarkMode ? "#FFFFFF" : "#111827",
                    borderRadius: "12px",
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}
