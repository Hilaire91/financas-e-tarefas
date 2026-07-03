const fs = require('fs');
let code = fs.readFileSync('src/components/LoginScreen.tsx', 'utf-8');

code = code.replace(/>Entrar</g, '>{t("login_button")}<');
code = code.replace(/>Toque no sensor para autenticar</g, '>{t("login_scan_idle")}<');
code = code.replace(/>Verificando biometria\.\.\.</g, '>{t("login_scanning")}<');
code = code.replace(/>Autenticado com sucesso!</g, '>{t("login_scan_success")}<');
code = code.replace(/>Confirmar PIN</g, '>{t("login_pin_button")}<');
code = code.replace(/title="Login com Email"/, 'title="Email"');
code = code.replace(/title="Biometria \(Simulador\)"/, 'title="Biometrics"');
code = code.replace(/title="PIN Rápido"/, 'title="PIN"');

fs.writeFileSync('src/components/LoginScreen.tsx', code);
