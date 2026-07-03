import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { formatCurrency } from "./utils/format";
import { 
  CheckSquare, 
  DollarSign, 
  TrendingDown, Activity, 
  Calendar, 
  Bell, 
  Sun, 
  Moon, 
  Lock, 
  Download, 
  Plus, 
  Trash2, 
  Clock, 
  FileSpreadsheet, 
  FileText, 
  Zap, 
  Volume2, 
  VolumeX, LogOut,
  CreditCard,
  Target,
  Percent,
  Star
} from "lucide-react";

import { Task, Expense, Budget, Reminder, AppNotification, ExpenseCategory, SubscriptionPlan } from "./types";
import { INITIAL_TASKS, INITIAL_EXPENSES, INITIAL_BUDGETS, INITIAL_REMINDRERS, INITIAL_NOTIFICATIONS } from "./mockData";
import { exportExpensesToCSV, exportTasksToCSV } from "./utils/export";

// Sub-components
import LoginScreen from "./components/LoginScreen";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";
import DashboardCharts from "./components/DashboardCharts";
import AIAssistantPanel from "./components/AIAssistantPanel";
import BankSyncPanel from "./components/BankSyncPanel";
import BudgetsPanel from "./components/BudgetsPanel";
import SubscriptionPanel from "./components/SubscriptionPanel";
import TaskChecklist from "./components/TaskChecklist";

export default function App() {
    // Biometrics Lock state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  
  // Sync state to Supabase
  const syncToSupabase = async (state: any) => {
    if (!session?.user?.id) return;
    try {
      await supabase.from('user_data').upsert({
        user_id: session.user.id,
        app_state: state
      });
    } catch (e) {
      console.error('Error syncing to Supabase:', e);
    }
  };

  // Fetch state from Supabase
  const fetchFromSupabase = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('user_data').select('app_state').eq('user_id', userId).single();
      if (data?.app_state) {
        if (data.app_state.tasks) setTasks(data.app_state.tasks);
        if (data.app_state.expenses) setExpenses(data.app_state.expenses);
        if (data.app_state.budgets) setBudgets(data.app_state.budgets);
        if (data.app_state.reminders) setReminders(data.app_state.reminders);
      }
    } catch (e) {
      console.error('Error fetching from Supabase:', e);
    }
  };
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchFromSupabase(session.user.id);
        setIsAuthenticated(true);
        setUserName(session.user?.user_metadata?.full_name || session.user?.email?.split('@')[0] || "Usuário");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchFromSupabase(session.user.id);
        setIsAuthenticated(true);
        setUserName(session.user?.user_metadata?.full_name || session.user?.email?.split('@')[0] || "Usuário");
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Theme state
  
  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem("fin_tarefas_username");
    return saved || "";
  });

  useEffect(() => {
    localStorage.setItem("fin_tarefas_username", userName);
  }, [userName]);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("fin_tarefas_theme");
    return saved ? saved === "true" : true; // Defaults to dark mode
  });

  // Core Data states
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("fin_tarefas_tasks");
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("fin_tarefas_expenses");
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem("fin_tarefas_budgets");
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem("fin_tarefas_reminders");
    return saved ? JSON.parse(saved) : INITIAL_REMINDRERS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem("fin_tarefas_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // UI state managers
  const [activeTab, setActiveTab] = useState<"dashboard" | "expenses" | "tasks" | "budgets" | "subscription">("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Subscription state
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>(() => {
    const saved = localStorage.getItem("fin_tarefas_plan");
    return (saved as SubscriptionPlan) || "free";
  });

  // Forms state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"baixa" | "media" | "alta">("media");
  const [newTaskDate, setNewTaskDate] = useState("");

  const [newExpenseDesc, setNewExpenseDesc] = useState("");
  const [newExpenseAmt, setNewExpenseAmt] = useState("");
  const [newExpenseCat, setNewExpenseCat] = useState<ExpenseCategory>("Alimentação");
  const [newExpenseType, setNewExpenseType] = useState<"gasto" | "rendimento">("gasto");
  const [newExpensePayment, setNewExpensePayment] = useState<"crédito" | "pix" | "débito" | "dinheiro" | "outro">("pix");
  const [newExpenseDate, setNewExpenseDate] = useState("");

  const [newReminderText, setNewReminderText] = useState("");
  const [newReminderDate, setNewReminderDate] = useState("");
  const [newReminderTime, setNewReminderTime] = useState("");

  

  // Sync to local storage
  useEffect(() => {
    // localStorage.setItem("fin_tarefas_auth", String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("fin_tarefas_theme", String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("fin_tarefas_tasks", JSON.stringify(tasks));
    if (session) syncToSupabase({ tasks, expenses, budgets, reminders });
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("fin_tarefas_expenses", JSON.stringify(expenses));
    if (session) syncToSupabase({ tasks, expenses, budgets, reminders });
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("fin_tarefas_budgets", JSON.stringify(budgets));
    if (session) syncToSupabase({ tasks, expenses, budgets, reminders });
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("fin_tarefas_reminders", JSON.stringify(reminders));
    if (session) syncToSupabase({ tasks, expenses, budgets, reminders });
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("fin_tarefas_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("fin_tarefas_plan", subscriptionPlan);
  }, [subscriptionPlan]);

  // App notification alert sound simulation
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio context blocked by browser policy.");
    }
  };

  // Push notification helper
  const sendNotification = (text: string, type: 'alert' | 'success' | 'info') => {
    const newNotif: AppNotification = {
      id: "notif-" + Date.now(),
      text,
      date: new Date().toLocaleDateString("pt-BR"),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
    playAlertSound();
  };

  // Lock session back
  
  // Add imported bank statement items state-sync
  const handleAddImportedExpenses = (imported: Expense[]) => {
    setExpenses(prev => [...imported, ...prev]);
    sendNotification(`Importados ${imported.length} lançamentos do extrato via IA!`, "success");

    // Recalculate if category limit exceeded
    imported.forEach(item => {
      const categoryBudget = budgets.find(b => b.category === item.category);
      if (categoryBudget) {
        const spent = expenses.filter(e => e.category === item.category).reduce((sum, e) => sum + e.amount, 0) + item.amount;
        if (spent > categoryBudget.limit) {
          sendNotification(
            `Estouro de Orçamento! Gastos em ${item.category} superaram o limite de R$ ${categoryBudget.limit}`,
            "alert"
          );
        }
      }
    });
  };

  // Manual Adders
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    if (subscriptionPlan === 'free' && tasks.length >= 30) {
      sendNotification("Limite de 30 tarefas atingido no plano Básico. Mude para PRO para tarefas ilimitadas!", "alert");
      return;
    }

    const newTask: Task = {
      id: "task-" + Date.now(),
      title: newTaskTitle,
      completed: false,
      date: newTaskDate || new Date().toISOString().split("T")[0],
      priority: newTaskPriority
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle("");
    setNewTaskDate("");
    sendNotification(`Nova tarefa "${newTask.title}" cadastrada!`, "info");
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpenseAmt);
    if (!newExpenseDesc.trim() || isNaN(amt) || amt <= 0) return;

    if (subscriptionPlan === 'free' && expenses.length >= 30) {
      sendNotification("Limite mensal de 30 despesas atingido no plano Básico. Assine o PRO para lançamentos ilimitados!", "alert");
      return;
    }

    const newExpense: Expense = {
      type: newExpenseType,
      paymentMethod: newExpensePayment,
      id: "expense-" + Date.now(),
      description: newExpenseDesc,
      amount: amt,
      category: newExpenseCat,
      date: newExpenseDate || new Date().toISOString().split("T")[0]
    };

    setExpenses(prev => [newExpense, ...prev]);
    setNewExpenseDesc("");
    setNewExpenseAmt("");
    setNewExpenseType("gasto");
    setNewExpensePayment("pix");
    
    sendNotification("notif_expense_added", "success");

    // Check budget limit alert
    const budget = budgets.find(b => b.category === newExpenseCat);
    if (budget) {
      const currentSpent = expenses.filter(e => e.category === newExpenseCat).reduce((sum, e) => sum + e.amount, 0) + amt;
      const percentage = (currentSpent / budget.limit) * 100;
      if (currentSpent > budget.limit) {
        sendNotification("notif_budget_alert", "alert");
      } else if (percentage >= 80) {
        sendNotification(`Atenção: Limite de gastos de ${newExpenseCat} atingiu ${percentage.toFixed(0)}%!`, "alert");
      }
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderText.trim()) return;

    const newRem: Reminder = {
      id: "reminder-" + Date.now(),
      text: newReminderText,
      date: newReminderDate || new Date().toISOString().split("T")[0],
      time: newReminderTime || "12:00",
      notified: false
    };

    setReminders(prev => [newRem, ...prev]);
    setNewReminderText("");
    setNewReminderDate("");
    setNewReminderTime("");
    sendNotification(`Novo lembrete agendado: "${newRem.text}"`, "info");
  };

  // Simulates a push notification for a specific reminder
  const triggerReminderAlert = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      sendNotification(`Lembrete Ativo: ${reminder.text} (${reminder.time})`, "alert");
      setReminders(prev => prev.map(r => r.id === id ? { ...r, notified: true } : r));
    }
  };

  // Deletion and check togglers
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      sendNotification(`Parabéns! Tarefa "${task.title}" concluída.`, "success");
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTaskChecklist = (taskId: string, checklist: any[]) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, checklist } : t));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const updateBudgetLimit = (category: ExpenseCategory, limit: number) => {
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, limit } : b));
  };
  
  const addBudget = (category: string, limit: number) => {
    if (!budgets.find(b => b.category === category)) {
      setBudgets(prev => [...prev, { category, limit }]);
    }
  };
  
  const deleteBudget = (category: string) => {
    setBudgets(prev => prev.filter(b => b.category !== category));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Computed dashboard summaries
  const totalSpentMonth = expenses.filter(e => e.type !== 'rendimento').reduce((sum, e) => sum + e.amount, 0);
  const totalIncomeMonth = expenses.filter(e => e.type === 'rendimento').reduce((sum, e) => sum + e.amount, 0);
  const currentBalance = totalIncomeMonth - totalSpentMonth;
  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);
  const averageBudgetPercent = totalBudgeted > 0 ? (totalSpentMonth / totalBudgeted) * 100 : 0;
  const completedTasksCount = tasks.filter(t => t.completed).length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  // Authentication Gate
  if (!isAuthenticated) {
    return <LoginScreen onSuccess={(name) => { setUserName(name || "Usuário"); setIsAuthenticated(true); }} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#0B0F19] text-gray-100" : "bg-gray-50/70 text-gray-900"}`}>
      
      {/* HEADER SECTION */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        isDarkMode ? "bg-[#0B0F19]/80 border-gray-800" : "bg-white/80 border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Status Indicator */}
          <div className="flex items-center gap-3">
            <div>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Olá, {userName}
              </span>
            </div>
          </div>

          {/* Controls Tray */}
          <div className="flex items-center gap-3">
            
            
            

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                isDarkMode ? "border-gray-800 hover:bg-gray-800 text-amber-400" : "border-gray-200 hover:bg-gray-100 text-gray-600"
              }`}
              title="Alternar tema"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Sound Effects Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                sendNotification(soundEnabled ? "Efeitos sonoros desativados." : "Efeitos sonoros ativados!", "info");
              }}
              className={`p-2 rounded-xl border hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                isDarkMode ? "border-gray-800 hover:bg-gray-800 text-gray-400" : "border-gray-200 hover:bg-gray-100 text-gray-600"
              }`}
              title={soundEnabled ? "Mudar para mudo" : "Ativar áudio"}
            >
              {soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
            </button>

            {/* Biometric Logout */}
            <button
              onClick={async () => {
  await supabase.auth.signOut();
  setIsAuthenticated(false);
}}
              className={`p-2 rounded-xl border hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                isDarkMode ? "border-gray-800 hover:bg-gray-800 text-gray-400" : "border-gray-200 hover:bg-gray-100 text-gray-600"
              }`}
              title="Sair"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>

            {/* Notification Center Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) markAllNotificationsRead();
                }}
                className={`p-2 rounded-xl border hover:scale-105 active:scale-95 transition-all relative cursor-pointer ${
                  isDarkMode ? "border-gray-800 hover:bg-gray-800 text-gray-300" : "border-gray-200 hover:bg-gray-100 text-gray-600"
                }`}
              >
                <Bell className="w-4.5 h-4.5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] text-white font-bold flex items-center justify-center animate-bounce">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              {/* Notification Slide Panel */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-3 w-80 rounded-2xl border p-4 shadow-2xl ${
                      isDarkMode ? "bg-[#161D30] border-gray-800 text-white" : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-gray-800/10 dark:border-gray-800 pb-2.5 mb-2.5">
                      <h4 className="font-bold text-xs uppercase tracking-wide">Notificações Push</h4>
                      <button
                        onClick={clearNotifications}
                        className="text-[10px] font-semibold text-rose-500 hover:underline"
                      >
                        Limpar tudo
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-center text-xs text-gray-400 py-6">Nenhum alerta recente.</p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-2.5 rounded-xl border text-xs leading-relaxed ${
                              notif.type === "alert" 
                                ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                                : notif.type === "success"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            }`}
                          >
                            <p className="font-semibold">{notif.text}</p>
                            <span className="text-[9px] text-gray-500 block mt-1 font-mono">{notif.date}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        
        

        {/* TAB CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-gray-200/50 dark:bg-gray-800/50 border border-transparent dark:border-gray-800/40">
            {[
              { id: "dashboard", label: "Página Inicial", icon: Zap },
              { id: "expenses", label: "Metas e Gastos", icon: CreditCard },
              { id: "tasks", label: "Tarefas e Lembretes", icon: CheckSquare },
              { id: "budgets", label: "Orçamentos IA", icon: Target },
              { id: "subscription", label: "Assinatura PRO", icon: Star }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick CSV Export Tray */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportExpensesToCSV(expenses)}
              className={`px-3.5 py-1.8 text-xs font-bold rounded-xl border flex items-center gap-1.5 cursor-pointer transition-all ${
                isDarkMode ? "border-gray-800 bg-[#161D30] hover:bg-gray-800" : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
              title="Exportar despesas em formato Planilha/Excel"
            >
              <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-500" />
              <span>Exportar Planilha despesas</span>
            </button>
            <button
              onClick={() => exportTasksToCSV(tasks)}
              className={`px-3.5 py-1.8 text-xs font-bold rounded-xl border flex items-center gap-1.5 cursor-pointer transition-all ${
                isDarkMode ? "border-gray-800 bg-[#161D30] hover:bg-gray-800" : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
              title="Exportar checklist de tarefas"
            >
              <FileText className="w-4.5 h-4.5 text-blue-500" />
              <span>Tarefas CSV</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW BENTO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className={`p-5 rounded-3xl border flex items-center gap-4 transition-all ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Gastos Totais</p>
              <p className="font-display text-lg font-extrabold font-mono text-amber-500">{formatCurrency(totalSpentMonth)}</p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border flex items-center gap-4 transition-all ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
            <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-500">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Consumo de Limites</p>
              <p className="font-display text-lg font-extrabold font-mono text-violet-400">{averageBudgetPercent.toFixed(0)}%</p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border flex items-center gap-4 transition-all ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Checklist Tarefas</p>
              <p className="font-display text-lg font-extrabold font-mono text-blue-400">{completedTasksCount} de {tasks.length}</p>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border flex items-center gap-4 transition-all ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Lembretes Ativos</p>
              <p className="font-display text-lg font-extrabold font-mono text-emerald-400">
                {reminders.filter(r => !r.notified).length} Agendados
              </p>
            </div>
          </div>

        </div>

        {/* CONDITIONAL TAB RENDERER */}
        <div className="space-y-8">
          
          {/* TAB 1: DASHBOARD PAINEL GERAL */}
          {activeTab === "dashboard" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Dynamic Consumption Graphics */}
              <DashboardCharts expenses={expenses} isDarkMode={isDarkMode} />

              {/* AI Finis Intelligent Panel */}
              <AIAssistantPanel expenses={expenses} budgets={budgets} isDarkMode={isDarkMode} subscriptionPlan={subscriptionPlan} />
            </motion.div>
          )}

          {/* TAB 2: EXPENSES AND BANK INTEGRATION */}
          {activeTab === "expenses" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Simulated Bank Statement Sincronizador */}
              <BankSyncPanel onAddExpenses={handleAddImportedExpenses} isDarkMode={isDarkMode} subscriptionPlan={subscriptionPlan} />

              {/* Expense logger row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Manual Add Form */}
                <div className="lg:col-span-4">
                  <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
                    <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-violet-500" />
                      <span>Adicionar Despesa Manual</span>
                    </h3>

                    
                    <form onSubmit={handleAddExpense} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Tipo de Transação
                          </label>
                          <select
                            value={newExpenseType}
                            onChange={(e) => setNewExpenseType(e.target.value as any)}
                            className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer ${
                              isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                            }`}
                          >
                            <option value="gasto">Gasto / Despesa</option>
                            <option value="rendimento">Rendimento / Salário</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Valor (R$)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={newExpenseAmt}
                            onChange={(e) => setNewExpenseAmt(e.target.value)}
                            placeholder="0,00"
                            className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono ${
                              isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Descrição / Origem
                        </label>
                        <input
                          type="text"
                          required
                          value={newExpenseDesc}
                          onChange={(e) => setNewExpenseDesc(e.target.value)}
                          placeholder="Ex: Almoço, Salário..."
                          className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 ${
                            isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Categoria
                          </label>
                          
    <input
      type="text"
      list="category-options"
      value={newExpenseCat}
      onChange={(e) => setNewExpenseCat(e.target.value)}
      placeholder="Digite ou selecione"
      className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 ${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"}`}
    />
    <datalist id="category-options">
      {Array.from(new Set([
        ...(newExpenseType === "gasto" ? ["Alimentação", "Transporte", "Mercado", "Saídas", "Outros"] : ["Salário", "Rendimento", "Outros"]),
        ...budgets.map(b => b.category)
      ])).map(cat => (
        <option key={cat} value={cat} />
      ))}
    </datalist>
  
                        </div>
                        <div>
                          <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Método
                          </label>
                          <select
                            value={newExpensePayment}
                            onChange={(e) => setNewExpensePayment(e.target.value as any)}
                            className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer ${
                              isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                            }`}
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
                        <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Data da Transação
                        </label>
                        <input
                          type="date"
                          value={newExpenseDate}
                          onChange={(e) => setNewExpenseDate(e.target.value)}
                          className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono ${
                            isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                          }`}
                        />
                      </div>

                      <button type="submit"
                        className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Registrar Lançamento
                      </button>
                    </form>
                  </div>
                </div>

                {/* Live Expense Register Table */}
                <div className="lg:col-span-8">
                  <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
                    <h3 className="font-display text-base font-bold mb-4 flex items-center justify-between">
                      <span>Histórico de Lançamentos</span>
                      <button onClick={() => { if(window.confirm("Deseja realmente zerar todos os lançamentos?")) setExpenses([]); }} className="text-xs ml-4 px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors">
                        Zerar Tudo
                      </button>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                        {expenses.length} Transações
                      </span>
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "border-gray-800 text-gray-400" : "border-gray-100 text-gray-500"}`}>
                            <th className="py-3 px-4">Descrição</th>
                            <th className="py-3 px-4">Categoria</th>
                            <th className="py-3 px-4">Método</th>
                            <th className="py-3 px-4">Data</th>
                            <th className="py-3 px-4 text-right">Valor</th>
                            <th className="py-3 px-4 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                          {expenses.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-xs text-gray-400">
                                Nenhuma despesa lançada ainda.
                              </td>
                            </tr>
                          ) : (
                            expenses.map((expense) => (
                              <tr key={expense.id} className="text-xs hover:bg-gray-50/50 dark:hover:bg-gray-800/10">
                                <td className="py-3.5 px-4 font-bold">{expense.description}</td>
                                <td className="py-3.5 px-4">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                                    expense.category === "Mercado" ? "bg-emerald-500/10 text-emerald-400" :
                                    expense.category === "Alimentação" ? "bg-amber-500/10 text-amber-400" :
                                    expense.category === "Transporte" ? "bg-blue-500/10 text-blue-400" :
                                    expense.category === "Saídas" ? "bg-pink-500/10 text-pink-400" :
                                    "bg-violet-500/10 text-violet-400"
                                  }`}>
                                    {expense.category}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-gray-400 font-mono text-xs uppercase">{expense.paymentMethod || '-'}</td>
                                <td className="py-3.5 px-4 text-gray-400 font-mono">{expense.date}</td>
                                <td className={`py-3.5 px-4 text-right font-bold font-mono ${expense.type === 'rendimento' ? 'text-emerald-500' : ''}`}>
                                  {expense.type === 'rendimento' ? '+' : '-'}{formatCurrency(expense.amount)}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <button
                                    onClick={() => deleteExpense(expense.id)}
                                    className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: TASKS AND REMINDERS */}
          {activeTab === "tasks" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              
              {/* Checklist Section */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Tasks Register Form */}
                <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
                  <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-blue-500" />
                    <span>Adicionar Nova Tarefa Cotidiana</span>
                  </h3>

                  <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      required
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Ex: Pagar mensalidade da academia"
                      className={`flex-1 p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 ${
                        isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                      }`}
                    />

                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                      className={`p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer ${
                        isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                      }`}
                    >
                      <option value="baixa">Prioridade Baixa</option>
                      <option value="media">Prioridade Média</option>
                      <option value="alta">Prioridade Alta</option>
                    </select>

                    <button
                      type="submit"
                      className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Criar
                    </button>
                  </form>
                </div>

                {/* Tasks List */}
                <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
                  <h3 className="font-display text-base font-bold mb-4 flex items-center justify-between">
                    <span>Lista de Tarefas</span>
                    <span className="text-xs text-gray-400 font-mono">
                      {completedTasksCount} de {tasks.length} Concluídas
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {tasks.length === 0 ? (
                      <p className="text-center py-8 text-xs text-gray-400">Nenhuma tarefa agendada.</p>
                    ) : (
                      tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-3.5 rounded-2xl border flex flex-col transition-all ${
                            task.completed 
                              ? "opacity-60 bg-gray-500/5 border-transparent" 
                              : (isDarkMode ? "bg-gray-800/30 border-gray-800" : "bg-gray-50/50 border-gray-200")
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                className="w-4 h-4 text-violet-600 focus:ring-violet-500 rounded border-gray-300 dark:border-gray-700 cursor-pointer"
                              />
                              <div>
                                <p className={`text-xs font-bold ${task.completed ? "line-through text-gray-500" : ""}`}>
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400">
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    task.priority === "alta" ? "bg-rose-500" : task.priority === "media" ? "bg-amber-500" : "bg-blue-500"
                                  }`} />
                                  <span className="uppercase font-mono tracking-wider">{task.priority}</span>
                                  <span>•</span>
                                  <span className="font-mono">{task.date}</span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {!task.completed && (
                            <TaskChecklist 
                              items={task.checklist || []} 
                              onUpdate={(newItems) => updateTaskChecklist(task.id, newItems)}
                              isDarkMode={isDarkMode}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Reminders / Alarm Notifications Section */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Reminders Setup Form */}
                <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
                  <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-500" />
                    <span>Configurar Lembrete / Alerta</span>
                  </h3>

                  <form onSubmit={handleAddReminder} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-400">
                        Texto do Lembrete
                      </label>
                      <input
                        type="text"
                        required
                        value={newReminderText}
                        onChange={(e) => setNewReminderText(e.target.value)}
                        placeholder="Ex: Pagar fatura do cartão Nubank"
                        className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 ${
                          isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-400">
                          Data
                        </label>
                        <input
                          type="date"
                          value={newReminderDate}
                          onChange={(e) => setNewReminderDate(e.target.value)}
                          className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono ${
                            isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-400">
                          Hora de Notificação
                        </label>
                        <input
                          type="time"
                          value={newReminderTime}
                          onChange={(e) => setNewReminderTime(e.target.value)}
                          className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono ${
                            isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
                          }`}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Agendar Lembrete
                    </button>
                  </form>
                </div>

                {/* Reminders List & Simulator */}
                <div className={`p-6 rounded-3xl border ${isDarkMode ? "bg-[#161D30] border-gray-800" : "bg-white border-gray-200"}`}>
                  <h3 className="font-display text-base font-bold mb-4 flex items-center justify-between">
                    <span>Lembretes Ativos</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Simulador de Notificação Push</span>
                  </h3>

                  <div className="space-y-3">
                    {reminders.length === 0 ? (
                      <p className="text-center py-8 text-xs text-gray-400">Nenhum lembrete cadastrado.</p>
                    ) : (
                      reminders.map((rem) => (
                        <div
                          key={rem.id}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            rem.notified 
                              ? "opacity-50 bg-gray-500/5 border-transparent" 
                              : (isDarkMode ? "bg-gray-800/20 border-gray-800" : "bg-gray-50/50 border-gray-200")
                          }`}
                        >
                          <div className="space-y-1">
                            <p className="text-xs font-bold">{rem.text}</p>
                            <div className="flex items-center gap-1 text-[9px] text-gray-500">
                              <Calendar className="w-3 h-3" /> <span>{rem.date}</span>
                              <Clock className="w-3 h-3 ml-1" /> <span>{rem.time}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {!rem.notified && (
                              <button
                                onClick={() => triggerReminderAlert(rem.id)}
                                className="px-2 py-1 text-[10px] bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-500 font-bold rounded-lg cursor-pointer transition-colors"
                                title="Simular disparo de notificação push imediata"
                              >
                                Disparar Notificação
                              </button>
                            )}
                            <button
                              onClick={() => deleteReminder(rem.id)}
                              className="p-1 text-gray-400 hover:text-rose-500 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 4: PLANNING AND AI BUDGETS */}
          {activeTab === "budgets" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Category Budgets controls */}
              <BudgetsPanel
                budgets={budgets}
                expenses={expenses}
                onUpdateBudget={updateBudgetLimit}
                onAddBudget={addBudget}
                onDeleteBudget={deleteBudget}
                isDarkMode={isDarkMode}
                onSendNotification={sendNotification}
              />

              {/* Comprehensive AI Finis Panel */}
              <AIAssistantPanel expenses={expenses} budgets={budgets} isDarkMode={isDarkMode} subscriptionPlan={subscriptionPlan} />
            </motion.div>
          )}

          {/* TAB 5: SUBSCRIPTION PLANS */}
          {activeTab === "subscription" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SubscriptionPanel 
                currentPlan={subscriptionPlan}
                onUpgrade={(plan) => {
                  setSubscriptionPlan(plan);
                  sendNotification(`Plano alterado para ${plan === 'premium' ? 'PRO Inteligente' : 'Básico Grátis'} com sucesso!`, 'success');
                }}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}

        </div>

      </main>

      {/* FOOTER */}
      <footer className={`border-t py-8 mt-16 transition-colors ${
        isDarkMode ? "bg-[#090C15] border-gray-800 text-gray-500" : "bg-gray-100 border-gray-200 text-gray-600"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-2">
          <p className="font-semibold text-violet-400">Finanças&Tarefas — SaaS de Controle Financeiro Inteligente</p>
          <p>© 2026. Todos os direitos reservados. Protegido com simulação biométrica local e inteligência artificial do Gemini 3.5-Flash.</p>
        </div>
      </footer>

    </div>
  );
}
