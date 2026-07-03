export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  priority: 'baixa' | 'media' | 'alta';
  checklist?: ChecklistItem[];
}

export type TransactionType = 'gasto' | 'rendimento';
export type PaymentMethod = 'crédito' | 'pix' | 'débito' | 'dinheiro' | 'outro';
export type ExpenseCategory = string;

export type SubscriptionPlan = 'free' | 'premium';

export interface Expense {
  type?: TransactionType;
  paymentMethod?: PaymentMethod;
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface Reminder {
  id: string;
  text: string;
  date: string;
  time: string;
  notified: boolean;
}

export interface Budget {
  category: ExpenseCategory;
  limit: number;
}

export interface AppNotification {
  id: string;
  text: string;
  date: string;
  read: boolean;
  type: 'alert' | 'success' | 'info';
}

export interface AISuggestion {
  category: string;
  title: string;
  description: string;
  estimatedSavings: number;
}

export interface AIReport {
  summary: string;
  aiScore: number;
  suggestions: AISuggestion[];
  financialHealthStatus: string;
}
