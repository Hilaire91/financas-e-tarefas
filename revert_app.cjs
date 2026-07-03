const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace('import { auth, db } from "./firebase";\nimport { doc, setDoc, getDoc } from "firebase/firestore";\nimport { onAuthStateChanged } from "firebase/auth";\nimport { INITIAL_TASKS', 'import { INITIAL_TASKS');

code = code.replace(/  useEffect\(\(\) => \{\n    const unsubscribe = onAuthStateChanged\(auth, async \(user\) => \{[\s\S]*?  const saveToFirebase = async \(data: any\) => \{\n    if \(auth\.currentUser\) \{\n      const docRef = doc\(db, "users", auth\.currentUser\.uid\);\n      await setDoc\(docRef, data, \{ merge: true \}\);\n    \}\n  \};\n/m, '');

code = code.replace(/\n    saveToFirebase\(\{ tasks \}\);/g, '');
code = code.replace(/\n    saveToFirebase\(\{ expenses \}\);/g, '');
code = code.replace(/\n    saveToFirebase\(\{ budgets \}\);/g, '');
code = code.replace(/\n    saveToFirebase\(\{ reminders \}\);/g, '');
code = code.replace(/\n    saveToFirebase\(\{ notifications \}\);/g, '');
code = code.replace(/\n    saveToFirebase\(\{ subscriptionPlan \}\);/g, '');

fs.writeFileSync('src/App.tsx', code);
