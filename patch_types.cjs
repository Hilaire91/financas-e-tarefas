const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');

code = code.replace(
  /export type ExpenseCategory = 'Alimentação' \| 'Transporte' \| 'Mercado' \| 'Saídas' \| 'Outros';/,
  `export type TransactionType = 'gasto' | 'rendimento';
export type PaymentMethod = 'crédito' | 'pix' | 'débito' | 'dinheiro' | 'outro';
export type ExpenseCategory = 'Alimentação' | 'Transporte' | 'Mercado' | 'Saídas' | 'Salário' | 'Rendimento' | 'Outros';`
);

code = code.replace(
  /export interface Expense \{/,
  `export interface Expense {
  type?: TransactionType;
  paymentMethod?: PaymentMethod;`
);

fs.writeFileSync('src/types.ts', code);
