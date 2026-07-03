const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(/onClick=\{handleLogout\}/g, `onClick={async () => {\n  await supabase.auth.signOut();\n  setIsAuthenticated(false);\n}}`);
fs.writeFileSync('src/App.tsx', appCode);

let sbCode = fs.readFileSync('src/lib/supabase.ts', 'utf-8');
sbCode = sbCode.replace(
  /const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY \|\| 'sb_publishable_V3qOIGtHtN60dPpiXfB2hQ_qgmi_m8M'/,
  `// @ts-ignore\nconst supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_V3qOIGtHtN60dPpiXfB2hQ_qgmi_m8M'`
);
fs.writeFileSync('src/lib/supabase.ts', sbCode);

