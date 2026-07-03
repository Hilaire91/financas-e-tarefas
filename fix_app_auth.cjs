const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

appCode = appCode.replace(
  /import LoginScreen from "\.\/components\/LoginScreen";/,
  `import LoginScreen from "./components/LoginScreen";\nimport { supabase } from "./lib/supabase";\nimport type { Session } from "@supabase/supabase-js";`
);

appCode = appCode.replace(
  /const \[isAuthenticated, setIsAuthenticated\] = useState<boolean>\(\(\) => \{[\s\S]*?\}\);\n/,
  `const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setIsAuthenticated(true);
        setUserName(session.user?.user_metadata?.full_name || session.user?.email?.split('@')[0] || "Usuário");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setIsAuthenticated(true);
        setUserName(session.user?.user_metadata?.full_name || session.user?.email?.split('@')[0] || "Usuário");
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);\n`
);

appCode = appCode.replace(
  /localStorage\.setItem\("fin_tarefas_auth", String\(isAuthenticated\)\);/,
  `// localStorage.setItem("fin_tarefas_auth", String(isAuthenticated));`
);

appCode = appCode.replace(
  /<button\s+onClick=\{handleLogout\}[\s\S]*?Sair\s+<\/button>/,
  `<button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setIsAuthenticated(false);
                  }}
                  className="px-3 py-1.5 flex items-center gap-1.5 rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Sair</span>
                </button>`
);

appCode = appCode.replace(
  /const handleLogout = \(\) => \{[\s\S]*?\};\n/,
  ``
);

fs.writeFileSync('src/App.tsx', appCode);

