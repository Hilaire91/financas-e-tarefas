const fs = require('fs');
let typesCode = fs.readFileSync('src/types.ts', 'utf-8');
typesCode = typesCode.replace(
  /export type ExpenseCategory = 'Alimentação' \| 'Transporte' \| 'Mercado' \| 'Saídas' \| 'Salário' \| 'Rendimento' \| 'Outros';/,
  `export type ExpenseCategory = string;`
);
fs.writeFileSync('src/types.ts', typesCode);
