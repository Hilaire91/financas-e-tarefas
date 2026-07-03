import { Expense, Task } from "../types";

/**
 * Exports expenses list to Excel compatible CSV file with UTF-8 BOM for accents support.
 */
export function exportExpensesToCSV(expenses: Expense[]) {
  const headers = ["ID", "Descrição", "Valor (R$)", "Categoria", "Data"];
  const rows = expenses.map(e => [
    e.id,
    e.description,
    e.amount.toFixed(2).replace(".", ","),
    e.category,
    e.date
  ]);

  const csvContent = [headers, ...rows]
    .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(";"))
    .join("\n");

  // Prepend UTF-8 BOM for Excel to recognize accents
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const dateStr = new Date().toISOString().split("T")[0];
  link.setAttribute("download", `fin_tarefas_despesas_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports tasks list to Excel compatible CSV.
 */
export function exportTasksToCSV(tasks: Task[]) {
  const headers = ["ID", "Título", "Status", "Prioridade", "Data de Vencimento"];
  const rows = tasks.map(t => [
    t.id,
    t.title,
    t.completed ? "Concluída" : "Pendente",
    t.priority,
    t.date
  ]);

  const csvContent = [headers, ...rows]
    .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(";"))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const dateStr = new Date().toISOString().split("T")[0];
  link.setAttribute("download", `fin_tarefas_tarefas_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
