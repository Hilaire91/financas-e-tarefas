const fs = require('fs');
let code = fs.readFileSync('src/components/LoginScreen.tsx', 'utf-8');

code = code.replace('import { Lock', 'import { useTranslation } from "react-i18next";\nimport { Lock');
code = code.replace('export default function LoginScreen({ onSuccess, isDarkMode }: LoginScreenProps) {', 'export default function LoginScreen({ onSuccess, isDarkMode }: LoginScreenProps) {\n  const { t } = useTranslation();');

code = code.replace(/>Serene Finanças</, '>{t("app_name")}<');
code = code.replace(/>Acesse sua conta para continuar</, '>{t("login_subtitle")}<');
code = code.replace(/placeholder="Seu email"/, 'placeholder={t("login_email_placeholder")}');
code = code.replace(/placeholder="Sua senha"/, 'placeholder={t("login_password_placeholder")}');
code = code.replace(/>Entrar</, '>{t("login_button")}<');
code = code.replace(/>Toque no sensor para autenticar</, '>{t("login_scan_idle")}<');
code = code.replace(/>Verificando biometria\.\.\.</, '>{t("login_scanning")}<');
code = code.replace(/>Autenticado com sucesso!</, '>{t("login_scan_success")}<');
code = code.replace(/>Dica: use 1234 para testar</, '>{t("login_pin_hint")}<');
code = code.replace(/>Confirmar PIN</, '>{t("login_pin_button")}<');
code = code.replace(/>Ambiente local seguro simulado</, '>{t("login_secure_env")}<');

fs.writeFileSync('src/components/LoginScreen.tsx', code);
