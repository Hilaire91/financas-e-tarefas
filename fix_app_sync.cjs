const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

appCode = appCode.replace(
  /const \[session, setSession\] = useState<Session \| null>\(null\);/,
  `const [session, setSession] = useState<Session | null>(null);
  
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
  };`
);

appCode = appCode.replace(
  /setSession\(session\);\n\s*if \(session\) \{/,
  `setSession(session);\n      if (session) {\n        fetchFromSupabase(session.user.id);`
);

appCode = appCode.replace(
  /setSession\(session\);\n\s*if \(session\) \{/g,
  `setSession(session);\n      if (session) {\n        fetchFromSupabase(session.user.id);`
);

appCode = appCode.replace(
  /useEffect\(\(\) => \{\n\s*localStorage.setItem\("fin_tarefas_tasks", JSON.stringify\(tasks\)\);\n\s*\}, \[tasks\]\);/,
  `useEffect(() => {
    localStorage.setItem("fin_tarefas_tasks", JSON.stringify(tasks));
    if (session) syncToSupabase({ tasks, expenses, budgets, reminders });
  }, [tasks]);`
);

appCode = appCode.replace(
  /useEffect\(\(\) => \{\n\s*localStorage.setItem\("fin_tarefas_expenses", JSON.stringify\(expenses\)\);\n\s*\}, \[expenses\]\);/,
  `useEffect(() => {
    localStorage.setItem("fin_tarefas_expenses", JSON.stringify(expenses));
    if (session) syncToSupabase({ tasks, expenses, budgets, reminders });
  }, [expenses]);`
);

appCode = appCode.replace(
  /useEffect\(\(\) => \{\n\s*localStorage.setItem\("fin_tarefas_budgets", JSON.stringify\(budgets\)\);\n\s*\}, \[budgets\]\);/,
  `useEffect(() => {
    localStorage.setItem("fin_tarefas_budgets", JSON.stringify(budgets));
    if (session) syncToSupabase({ tasks, expenses, budgets, reminders });
  }, [budgets]);`
);

appCode = appCode.replace(
  /useEffect\(\(\) => \{\n\s*localStorage.setItem\("fin_tarefas_reminders", JSON.stringify\(reminders\)\);\n\s*\}, \[reminders\]\);/,
  `useEffect(() => {
    localStorage.setItem("fin_tarefas_reminders", JSON.stringify(reminders));
    if (session) syncToSupabase({ tasks, expenses, budgets, reminders });
  }, [reminders]);`
);

fs.writeFileSync('src/App.tsx', appCode);

