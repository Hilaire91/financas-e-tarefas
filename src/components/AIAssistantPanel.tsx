import { formatCurrency } from "../utils/format";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Brain, AlertCircle, RefreshCw, Printer, TrendingUp, CheckCircle, ShieldCheck } from "lucide-react";
import { Expense, Budget, AIReport, SubscriptionPlan } from "../types";

interface AIAssistantPanelProps {
  expenses: Expense[];
  budgets: Budget[];
  isDarkMode: boolean;
  subscriptionPlan?: SubscriptionPlan;
}

const TIPS = [
  "Pesquisando comportamentos de consumo...",
  "Avaliando metas de categoria por categoria...",
  "Identificando oportunidades ocultas de corte...",
  "Preparando sugestões de investimento e economia...",
  "Quase lá, lapidando as recomendações do Finis..."
];

export default function AIAssistantPanel({ expenses, budgets, isDarkMode, subscriptionPlan = 'premium' }: AIAssistantPanelProps) {
    const [loading, setLoading] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [report, setReport] = useState<AIReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateAIReport = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    // Tip cycling interval
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 2500);

    try {
      const response = await fetch("/api/ai/analyze-expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expenses,
          budgets,
          reportType: "comprehensive"
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro de rede ao conectar à IA.");
      }

      const data = await response.json();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro desconhecido. Por favor, tente novamente.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    // Elegant native print styling
    window.print();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500 border-emerald-500/20 bg-emerald-500/10";
    if (score >= 50) return "text-amber-500 stroke-amber-500 border-amber-500/20 bg-amber-500/10";
    return "text-rose-500 stroke-rose-500 border-rose-500/20 bg-rose-500/10";
  };

  const getHealthBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("excelente") || s.includes("ótimo") || s.includes("bom")) {
      return "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
    }
    if (s.includes("alerta") || s.includes("atenção") || s.includes("moderado")) {
      return "bg-amber-500/15 text-amber-500 border-amber-500/30";
    }
    return "bg-rose-500/15 text-rose-500 border-rose-500/30";
  };

  return (
    <div className={`p-6 rounded-3xl border mb-8 relative ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
      
      {/* Printable Report Header Container (Hidden on Screen, visible on print) */}
      <div className="hidden print:block mb-8 text-black bg-white p-6 rounded-2xl border border-gray-300">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Relatório Oficial de Saúde Financeira</h1>
            <p className="text-xs text-gray-500">Gerado pelo SaaS Finanças & Tarefas por IA</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono">Data: {new Date().toLocaleDateString("pt-BR")}</p>
            <p className="text-xs font-mono">Status: {report?.financialHealthStatus}</p>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-bold text-gray-800">Pontuação de Saúde Financeira: {report?.aiScore}/100</h3>
            <p className="text-gray-600 mt-1">{report?.summary}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Dicas de Economia Recomendadas:</h3>
            <ul className="list-disc list-inside space-y-2">
              {report?.suggestions.map((s, idx) => (
                <li key={idx} className="text-gray-700">
                  <strong>[{s.category}] {s.title}</strong> - {s.description} (Economia est.: {formatCurrency(s.estimatedSavings)})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">Finis — Consultor IA</h3>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Sua Inteligência Artificial para sugestões reais de economia doméstica
            </p>
          </div>
        </div>

        {!loading && (
          <button
            onClick={generateAIReport}
            disabled={subscriptionPlan === 'free'}
            className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-md transition-all ${
              subscriptionPlan === 'free'
                ? isDarkMode ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 active:scale-95 text-white cursor-pointer"
            }`}
            title={subscriptionPlan === 'free' ? "Disponível apenas no plano PRO" : ""}
          >
            <Sparkles className="w-4 h-4" />
            {subscriptionPlan === 'free' ? "Exclusivo PRO" : (report ? "Recalcular Análise" : "Gerar Análise de IA")}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center print:hidden"
          >
            <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
              <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 border-t-transparent animate-ping" />
            </div>
            <h4 className="font-bold text-sm mb-1.5 text-violet-400">Análise Financeira Ativa</h4>
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {TIPS[tipIndex]}
            </motion.p>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-2xl border flex items-start gap-3 mt-4 print:hidden ${
              isDarkMode ? "bg-rose-950/20 border-rose-900/40 text-rose-200" : "bg-rose-50 border-rose-100 text-rose-800"
            }`}
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
            <div>
              <h4 className="font-bold text-sm">Falha ao Consultar IA</h4>
              <p className="text-xs mt-1">{error}</p>
              <button
                onClick={generateAIReport}
                className="mt-2 text-xs font-semibold underline flex items-center gap-1 hover:brightness-110"
              >
                Tentar novamente
              </button>
            </div>
          </motion.div>
        )}

        {!loading && !error && !report && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 print:hidden"
          >
            <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
              <Sparkles className="w-6 h-6 text-violet-400" />
            </div>
            <h4 className="font-bold text-sm mb-1">Como você está economizando hoje?</h4>
            <p className={`text-xs max-w-sm mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Clique em "Gerar Análise de IA" para analisar seus gastos, comparar com suas metas e receber insights de inteligência financeira personalizada do Finis.
              {subscriptionPlan === 'free' && (
                <span className="block mt-2 text-rose-500 font-semibold">
                  (Disponível apenas no plano PRO Inteligente)
                </span>
              )}
            </p>
          </motion.div>
        )}

        {!loading && report && (
          <motion.div
            key="report"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 print:hidden"
          >
            {/* Top Analysis Header */}
            <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center gap-5 ${
              isDarkMode ? "bg-[#1F293D] border-gray-800" : "bg-gray-50 border-gray-200"
            }`}>
              
              {/* Financial Score Circle */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={isDarkMode ? "#2D3748" : "#E2E8F0"}
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={251.2}
                    initial={{ strokeDashoffset: 251.2 }}
                    animate={{ strokeDashoffset: 251.2 - (251.2 * report.aiScore) / 100 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={getScoreColor(report.aiScore)}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-display font-extrabold">{report.aiScore}</span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-mono">Score</span>
                </div>
              </div>

              {/* Text Summary */}
              <div className="text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-bold font-mono tracking-wide">Saúde Financeira:</span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getHealthBadge(report.financialHealthStatus)}`}>
                    {report.financialHealthStatus}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {report.summary}
                </p>
              </div>
            </div>

            {/* Savings Suggestions Title */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold tracking-wider uppercase text-gray-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-violet-500" /> Recomendações de Corte de Gastos
                </h4>
                <button
                  onClick={handlePrintReport}
                  className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg border hover:brightness-110 cursor-pointer ${
                    isDarkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir Relatório PDF
                </button>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border transition-all hover:scale-[1.01] ${
                      isDarkMode ? "bg-[#1E2538] border-gray-800" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono ${
                        suggestion.category === "Mercado" ? "bg-emerald-500/10 text-emerald-400" :
                        suggestion.category === "Alimentação" ? "bg-amber-500/10 text-amber-400" :
                        suggestion.category === "Transporte" ? "bg-blue-500/10 text-blue-400" :
                        suggestion.category === "Saídas" ? "bg-pink-500/10 text-pink-400" :
                        "bg-violet-500/10 text-violet-400"
                      }`}>
                        {suggestion.category}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Econ. {formatCurrency(suggestion.estimatedSavings)}/mês
                      </span>
                    </div>
                    <h5 className="font-bold text-sm mb-1">{suggestion.title}</h5>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {suggestion.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro IA Stamp */}
            <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 border-t border-gray-800/20 pt-4">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-500" /> Analisado de forma privada com tecnologia Gemini 3.5-Flash
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
