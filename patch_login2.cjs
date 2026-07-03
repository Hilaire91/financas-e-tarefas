const fs = require('fs');
let code = fs.readFileSync('src/components/LoginScreen.tsx', 'utf-8');

code = code.replace('onSuccess: () => void;', 'onSuccess: (name?: string) => void;');
code = code.replace('const [email, setEmail] = useState("");', 'const [email, setEmail] = useState("");\n  const [name, setName] = useState("");');

code = code.replace(/const handleEmailSubmit = \(e: React.FormEvent\) => \{[\s\S]*?  \};/, `const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSuccess(name);
    }
  };`);

const nameField = `
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 flex items-center justify-center font-bold text-xs">@</div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("login_name_placeholder", "Seu nome")}
                      className={\`w-full py-3 pl-10 pr-4 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500 \${isDarkMode ? "bg-gray-800/80 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}\`}
                    />
                  </div>`;

code = code.replace('<div className="space-y-3">', '<div className="space-y-3">\n' + nameField);

fs.writeFileSync('src/components/LoginScreen.tsx', code);
