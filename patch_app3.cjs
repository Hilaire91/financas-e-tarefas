const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const userNameState = `
  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem("fin_tarefas_username");
    return saved || "";
  });

  useEffect(() => {
    localStorage.setItem("fin_tarefas_username", userName);
  }, [userName]);
`;

code = code.replace('const [isDarkMode', userNameState + '\n  const [isDarkMode');

code = code.replace('<LoginScreen onSuccess={() => setIsAuthenticated(true)} isDarkMode={isDarkMode} />', 
  '<LoginScreen onSuccess={(name) => { setUserName(name || "Usuário"); setIsAuthenticated(true); }} isDarkMode={isDarkMode} />');

const greetingHtml = `
        {/* GREETING SECTION */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">
            {t("greeting").replace(/,? Usuário/i, "")}{t("greeting").includes(",") ? "" : ","} {userName}!
          </h2>
        </div>
`;

code = code.replace('{/* TAB CONTROLS */}', greetingHtml + '\n        {/* TAB CONTROLS */}');

fs.writeFileSync('src/App.tsx', code);
