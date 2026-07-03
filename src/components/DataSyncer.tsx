import { useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { Task, Expense, Budget, Reminder, AppNotification, SubscriptionPlan } from "../types";
import { INITIAL_TASKS, INITIAL_EXPENSES, INITIAL_BUDGETS, INITIAL_REMINDRERS, INITIAL_NOTIFICATIONS } from "../mockData";

export default function useDataSyncer(
  isAuthenticated: boolean,
  tasks: Task[], setTasks: (v: Task[]) => void,
  expenses: Expense[], setExpenses: (v: Expense[]) => void,
  budgets: Budget[], setBudgets: (v: Budget[]) => void,
  reminders: Reminder[], setReminders: (v: Reminder[]) => void,
  notifications: AppNotification[], setNotifications: (v: AppNotification[]) => void,
  subscriptionPlan: SubscriptionPlan, setSubscriptionPlan: (v: SubscriptionPlan) => void
) {
  useEffect(() => {
    if (!isAuthenticated || !auth.currentUser) return;
    const userRef = doc(db, "users", auth.currentUser.uid);
    
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.tasks) setTasks(data.tasks);
        if (data.expenses) setExpenses(data.expenses);
        if (data.budgets) setBudgets(data.budgets);
        if (data.reminders) setReminders(data.reminders);
        if (data.notifications) setNotifications(data.notifications);
        if (data.subscriptionPlan) setSubscriptionPlan(data.subscriptionPlan);
      } else {
        // Initialize user document
        setDoc(userRef, {
          tasks: INITIAL_TASKS,
          expenses: INITIAL_EXPENSES,
          budgets: INITIAL_BUDGETS,
          reminders: INITIAL_REMINDRERS,
          notifications: INITIAL_NOTIFICATIONS,
          subscriptionPlan: "free"
        });
      }
    });
    return () => unsubscribe();
  }, [isAuthenticated]);

  // Sync back to firestore on changes (debounced or explicit is better, but this is simple)
  // For safety, we will just use a simple function to persist data that we can call
}
