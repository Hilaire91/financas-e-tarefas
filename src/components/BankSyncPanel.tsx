import React from "react";
import { formatCurrency } from "../utils/format";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Landmark, ArrowRight, Check, AlertCircle, FileText, Cpu, Sparkles, PlusCircle } from "lucide-react";
import { Expense, SubscriptionPlan } from "../types";

interface BankSyncPanelProps {
  onAddExpenses: (newExpenses: Expense[]) => void;
  isDarkMode: boolean;
  subscriptionPlan?: SubscriptionPlan;
}

interface BankAccount {
  id: string;
  name: string;
  color: string;
  connected: boolean;
  type: string;
}

const INITIAL_BANKS: BankAccount[] = [
  { id: "nubank", name: "Nubank", color: "bg-purple-600 text-white border-purple-500/20", connected: true, type: "Cartão de Crédito e Conta" },
  { id: "itau", name: "Itaú Unibanco", color: "bg-orange-500 text-white border-orange-400/20", connected: false, type: "Conta Corrente" },
  { id: "bb", name: "Banco do Brasil", color: "bg-yellow-500 text-gray-900 border-yellow-400/20", connected: false, type: "Poupança e Saldo" },
  { id: "bradesco", name: "Bradesco", color: "bg-red-600 text-white border-red-500/20", connected: false, type: "Cartão" }
];

export default function BankSyncPanel({ onAddExpenses, isDarkMode, subscriptionPlan = 'premium' }: BankSyncPanelProps) {
    const [banks, setBanks] = useState<BankAccount[]>(INITIAL_BANKS);
  const [rawText, setRawText] = useState("");
  const [newBankName, setNewBankName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<any[]>([]);

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankName.trim()) return;
    setBanks(prev => [...prev, {
      id: "bank-" + Date.now(),
      name: newBankName,
      type: "Instituição Financeira",
      connected: true,
      color: "bg-gray-500/10 text-gray-500"
    }]);
    setNewBankName("");
  };

  const toggleConnect = (id: string) => {
    setBanks(prev => prev.map(b => b.id === id ? { ...b, connected: !b.connected } : b));
  };

  const handleParseTransactions = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    setError(null);
    setParsedItems([]);

    try {
      const response = await fetch("/api/ai/categorize-bank-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Falha na sincronização automatizada.");
      }

      const data = await response.json();
      if (data.transactions && data.transactions.length > 0) {
        setParsedItems(data.transactions);
      } else {
        throw new Error("Nenhuma despesa válida encontrada no texto fornecido.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro desconhecido ao ler o extrato.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyImport = () => {
    if (parsedItems.length === 0) return;

    const formattedExpenses: Expense[] = parsedItems.map((item, index) => ({
      id: "imported-" + Date.now() + "-" + index,
      description: item.description,
      amount: item.amount,
      category: item.category,
      date: item.date || new Date().toISOString().split("T")[0]
    }));

    onAddExpenses(formattedExpenses);
    setParsedItems([]);
    setRawText("");
  };

  const handleLoadSampleStatement = () => {
    setRawText(
      `01/07 COMPRA COMPLETA NO PÃO DE AÇÚCAR R$ 189,40\n` +
      `01/07 UBER *TRIP HELP BR R$ 22,50\n` +
      `02/07 RESTAURANTE JAPONÊS TOKYO R$ 130,00\n` +
      `02/07 PADARIA DO BAIRRO - DEB R$ 15,90\n` +
      `02/07 POSTO DE GASOLINA IPIRANGA R$ 100,00`
    );
  };

  return (
    <div className={`p-6 rounded-3xl border mb-8 ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
      
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-500">
          <Landmark className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold">Integração Bancária Inteligente</h3>
          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Conecte suas contas ou importe lançamentos via inteligência artificial
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Bank Connection Section */}
        <div className="md:col-span-5 space-y-4">
          <h4 className="text-xs font-bold tracking-wider uppercase text-gray-400">Suas Contas Vinculadas</h4>
          
          <div className="space-y-3">
            {banks.map((bank) => (
              <div
                key={bank.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  bank.connected 
                    ? (isDarkMode ? "bg-indigo-500/5 border-indigo-500/20" : "bg-indigo-50/20 border-indigo-200") 
                    : (isDarkMode ? "bg-gray-800/20 border-gray-800" : "bg-gray-50/50 border-gray-200")
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${bank.color}`}>
                    {bank.name.substring(0, 2)}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{bank.name}</h5>
                    <p className={`text-[11px] ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{bank.type}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleConnect(bank.id)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1 transition-all cursor-pointer ${
                    bank.connected
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/15"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {bank.connected ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Ativo
                    </>
                  ) : (
                    "Conectar"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Statement Import Section */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold tracking-wider uppercase text-gray-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-violet-500" /> Conciliação e Lançamento Automático por IA
              </h4>
              <button
                onClick={handleLoadSampleStatement}
                className={`text-[10px] font-semibold hover:underline cursor-pointer ${isDarkMode ? "text-violet-400" : "text-violet-600"}`}
              >
                Carregar Exemplo
              </button>
            </div>

            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Copie o texto das transações do app do seu banco ou fatura do cartão de crédito, cole abaixo e nossa IA irá estruturar, embelezer e categorizar tudo de forma instantânea.
              {subscriptionPlan === 'free' && (
                <span className="block mt-1 text-rose-500 font-semibold">
                  (Recurso bloqueado no plano Básico)
                </span>
              )}
            </p>

            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={"Ex: 01/07 MERCADO DA ESQUINA 45,90\n02/07 UBER 15,20..."}
              rows={4}
              className={`w-full p-4.5 rounded-2xl border text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono ${
                isDarkMode ? "bg-gray-800/50 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className={`text-[10px] ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
              * Suporta extratos copiados em PDF, SMS ou e-mail de transação.
            </span>
            <button
              onClick={handleParseTransactions}
              disabled={loading || !rawText.trim() || subscriptionPlan === 'free'}
              className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-md transition-all ${
                subscriptionPlan === 'free'
                  ? isDarkMode ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:brightness-110 disabled:opacity-40 cursor-pointer"
              }`}
              title={subscriptionPlan === 'free' ? "Disponível apenas no plano PRO" : ""}
            >
              <Sparkles className="w-4 h-4" />
              {subscriptionPlan === 'free' ? "Importação Exclusiva PRO" : (loading ? "Processando Extrato..." : "Sincronizar Lançamentos")}
            </button>
          </div>

          {/* Parsed Output */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4.5 h-4.5" /> {error}
              </motion.div>
            )}

            {parsedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`mt-4 p-4 rounded-2xl border space-y-3 ${
                  isDarkMode ? "bg-gray-800/40 border-gray-700" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h5 className="font-bold text-xs flex items-center gap-1.5 uppercase tracking-wide">
                    <FileText className="w-4 h-4 text-violet-400" /> Despesas Identificadas pela IA ({parsedItems.length})
                  </h5>
                  <button
                    onClick={handleApplyImport}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Lançar na Conta
                  </button>
                </div>

                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {parsedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                        isDarkMode ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                          item.category === "Mercado" ? "bg-emerald-500/15 text-emerald-400" :
                          item.category === "Alimentação" ? "bg-amber-500/15 text-amber-400" :
                          item.category === "Transporte" ? "bg-blue-500/15 text-blue-400" :
                          item.category === "Saídas" ? "bg-pink-500/15 text-pink-400" :
                          "bg-violet-500/15 text-violet-400"
                        }`}>
                          {item.category}
                        </span>
                        <div>
                          <p className="font-bold">{item.description}</p>
                          <p className={`text-[10px] ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{item.date || "Hoje"}</p>
                        </div>
                      </div>
                      <span className="font-bold font-mono text-violet-400">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
