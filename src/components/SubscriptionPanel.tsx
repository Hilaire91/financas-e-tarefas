import React from "react";
import { motion } from "motion/react";
import { formatCurrency } from "../utils/format";
import { Check, Crown, Star, Zap, X } from "lucide-react";
import { SubscriptionPlan } from "../types";

interface SubscriptionPanelProps {
  currentPlan: SubscriptionPlan;
  onUpgrade: (plan: SubscriptionPlan) => void;
  isDarkMode: boolean;
}

export default function SubscriptionPanel({ currentPlan, onUpgrade, isDarkMode }: SubscriptionPanelProps) {
    return (
    <div className={`p-6 md:p-10 rounded-3xl border mb-8 ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
          <Crown className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Escolha o plano ideal para suas finanças</h2>
        <p className={`text-sm md:text-base ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          Desbloqueie o poder total da Inteligência Artificial e da automação para revolucionar o controle do seu dinheiro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Free Plan */}
        <div className={`relative p-8 rounded-3xl border flex flex-col ${
          currentPlan === "free"
            ? isDarkMode ? "border-violet-500/50 bg-violet-500/5" : "border-violet-400 bg-violet-50"
            : isDarkMode ? "border-gray-800 bg-[#1E2538]" : "border-gray-200 bg-gray-50"
        }`}>
          {currentPlan === "free" && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="bg-gray-800 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-gray-700 shadow-sm">
                Plano Atual
              </span>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-xl font-bold font-display mb-2">Básico Grátis</h3>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Estratégia limitada para organização essencial.
            </p>
          </div>
          <div className="mb-6">
            <span className="text-3xl font-display font-extrabold">{formatCurrency(0)}</span>
            <span className={`text-sm font-mono ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>/mês</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {[
              "Lançamento manual de despesas (até 30/mês)",
              "Gerenciamento de tarefas simples",
              "Gráficos básicos de consumo",
              "Alertas de orçamento limitados"
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{feature}</span>
              </li>
            ))}
            <li className="flex items-start gap-3 text-sm opacity-50">
              <X className="w-5 h-5 text-rose-500 shrink-0" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Importação automática de banco (IA)</span>
            </li>
            <li className="flex items-start gap-3 text-sm opacity-50">
              <X className="w-5 h-5 text-rose-500 shrink-0" />
              <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Consultor de economia Finis (IA)</span>
            </li>
          </ul>
          <button
            disabled={currentPlan === "free"}
            onClick={() => onUpgrade("free")}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              currentPlan === "free"
                ? isDarkMode ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-300 hover:bg-gray-400 text-gray-900"
            }`}
          >
            {currentPlan === "free" ? "Seu Plano Atual" : "Mudar para Grátis"}
          </button>
        </div>

        {/* Premium Plan */}
        <div className={`relative p-8 rounded-3xl border flex flex-col shadow-2xl transform md:-translate-y-4 ${
          currentPlan === "premium"
            ? isDarkMode ? "border-amber-500/50 bg-amber-500/5" : "border-amber-400 bg-amber-50"
            : isDarkMode ? "border-violet-500/30 bg-[#161D30]" : "border-violet-200 bg-white"
        }`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3" /> Recomendado
            </span>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold font-display mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              PRO Inteligente
            </h3>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Automação completa e insights IA ilimitados.
            </p>
          </div>
          <div className="mb-6">
            <span className="text-3xl font-display font-extrabold">{formatCurrency(9.90)}</span>
            <span className={`text-sm font-mono ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>/mês</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {[
              "Lançamentos e tarefas ilimitados",
              "Relatórios detalhados e gráficos avançados",
              "Importação de extratos bancários com IA",
              "Consultor IA Finis com sugestões de economia",
              "Notificações e lembretes push inteligentes",
              "Suporte prioritário"
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-amber-500 shrink-0" />
                <span className={isDarkMode ? "text-gray-200" : "text-gray-700 font-medium"}>{feature}</span>
              </li>
            ))}
          </ul>
          <button
            disabled={currentPlan === "premium"}
            onClick={() => onUpgrade("premium")}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              currentPlan === "premium"
                ? "bg-amber-500/20 text-amber-500 border border-amber-500/30 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-white cursor-pointer"
            }`}
          >
            {currentPlan === "premium" ? (
              <>Plano Ativo <Check className="w-4 h-4" /></>
            ) : (
              <>Assinar PRO <Zap className="w-4 h-4" /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
