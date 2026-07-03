
import { Task, Expense, Budget, Reminder, AppNotification } from "./types";

export const INITIAL_TASKS: Task[] = [];
export const INITIAL_EXPENSES: Expense[] = [];
export const INITIAL_BUDGETS: Budget[] = [
  { category: "Alimentação", limit: 1000 },
  { category: "Transporte", limit: 500 },
  { category: "Mercado", limit: 800 },
  { category: "Saídas", limit: 300 }
];
export const INITIAL_REMINDRERS: Reminder[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
