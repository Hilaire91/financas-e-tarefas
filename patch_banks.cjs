const fs = require('fs');
let code = fs.readFileSync('src/components/BankSyncPanel.tsx', 'utf-8');

if (!code.includes('newBankName')) {
  code = code.replace(
    'const [rawText, setRawText] = useState("");',
    `const [rawText, setRawText] = useState("");
  const [newBankName, setNewBankName] = useState("");`
  );

  code = code.replace(
    'const toggleConnect = (id: string) => {',
    `const handleAddBank = (e: React.FormEvent) => {
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

  const toggleConnect = (id: string) => {`
  );

  const addBankForm = `
            ))}
          </div>
          <form onSubmit={handleAddBank} className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={newBankName}
              onChange={(e) => setNewBankName(e.target.value)}
              placeholder="Nome do banco (ex: Bradesco)"
              className={\`flex-1 p-2 text-xs rounded-xl border focus:outline-none focus:ring-1 focus:ring-violet-500 \${
                isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-50 text-gray-900 border-gray-300"
              }\`}
            />
            <button
              type="submit"
              className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              +
            </button>
          </form>
        </div>
`;
  code = code.replace(
    /\}\)\}\n\s*<\/div>\n\s*<\/div>/,
    addBankForm
  );

  fs.writeFileSync('src/components/BankSyncPanel.tsx', code);
}
