const fs = require('fs');

let code = fs.readFileSync('src/components/TaskChecklist.tsx', 'utf-8');
if (!code.includes('useTranslation')) {
  code = code.replace('import { Check', 'import { useTranslation } from "react-i18next";\nimport { Check');
  code = code.replace(/export default function TaskChecklist.*\{/, (match) => match + '\n  const { t } = useTranslation();');
  code = code.replace(/placeholder="Item da lista\.\.\."/, 'placeholder={t("task_checklist_placeholder", "Item da lista...")}');
  code = code.replace(/> Adicionar item à lista \(ex: compras\)/, '> {t("task_checklist_add", "Adicionar item à lista (ex: compras)")}');
  fs.writeFileSync('src/components/TaskChecklist.tsx', code);
}

let codeApp = fs.readFileSync('src/App.tsx', 'utf-8');
codeApp = codeApp.replace(/placeholder="Adicionar nova tarefa\.\.\."/, 'placeholder={t("add_task_placeholder")}');
codeApp = codeApp.replace(/>Adicionar</g, '>{t("add_task_button")}<');
codeApp = codeApp.replace(/>Nenhuma tarefa\. Tudo certo!</g, '>{t("task_no_tasks")}<');
codeApp = codeApp.replace(/placeholder="Novo lembrete de pagamento\.\.\."/, 'placeholder={t("add_reminder_placeholder")}');
fs.writeFileSync('src/App.tsx', codeApp);

let codeI18n = fs.readFileSync('src/i18n.ts', 'utf-8');
codeI18n = codeI18n.replace(/task_no_tasks: 'No tasks. You are all set!',/, "task_no_tasks: 'No tasks. You are all set!',\n      task_checklist_placeholder: 'List item...',\n      task_checklist_add: 'Add list item (e.g. groceries)',");
codeI18n = codeI18n.replace(/task_no_tasks: 'Nenhuma tarefa. Tudo certo!',/, "task_no_tasks: 'Nenhuma tarefa. Tudo certo!',\n      task_checklist_placeholder: 'Item da lista...',\n      task_checklist_add: 'Adicionar item à lista (ex: compras)',");
codeI18n = codeI18n.replace(/task_no_tasks: 'Sin tareas. ¡Todo listo!',/, "task_no_tasks: 'Sin tareas. ¡Todo listo!',\n      task_checklist_placeholder: 'Elemento de lista...',\n      task_checklist_add: 'Añadir a la lista (ej: compras)',");
codeI18n = codeI18n.replace(/task_no_tasks: 'Aucune tâche. Tout est prêt !',/, "task_no_tasks: 'Aucune tâche. Tout est prêt !',\n      task_checklist_placeholder: 'Élément de la liste...',\n      task_checklist_add: 'Ajouter à la liste (ex: courses)',");
codeI18n = codeI18n.replace(/task_no_tasks: 'Keine Aufgaben. Alles erledigt!',/, "task_no_tasks: 'Keine Aufgaben. Alles erledigt!',\n      task_checklist_placeholder: 'Listenelement...',\n      task_checklist_add: 'Zuliste hinzufügen (z.B. Einkäufe)',");
codeI18n = codeI18n.replace(/task_no_tasks: 'Nessuna attività. Tutto pronto!',/, "task_no_tasks: 'Nessuna attività. Tutto pronto!',\n      task_checklist_placeholder: 'Elemento della lista...',\n      task_checklist_add: 'Aggiungi alla lista (es: spesa)',");
fs.writeFileSync('src/i18n.ts', codeI18n);

