const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /<th className="py-3 px-4">Categoria<\/th>/,
  '<th className="py-3 px-4">Categoria</th>\n                            <th className="py-3 px-4">Método</th>'
);

code = code.replace(
  /<td className="py-3\.5 px-4 text-gray-400 font-mono">\{expense\.date\}<\/td>/,
  `<td className="py-3.5 px-4 text-gray-400 font-mono text-xs uppercase">{expense.paymentMethod || '-'}</td>
                                <td className="py-3.5 px-4 text-gray-400 font-mono">{expense.date}</td>`
);

code = code.replace(
  /<td className="py-3\.5 px-4 text-right font-bold font-mono">[\s\S]*?<\/td>/,
  `<td className={\`py-3.5 px-4 text-right font-bold font-mono \${expense.type === 'rendimento' ? 'text-emerald-500' : ''}\`}>
                                  {expense.type === 'rendimento' ? '+' : '-'}{formatCurrency(expense.amount)}
                                </td>`
);

fs.writeFileSync('src/App.tsx', code);
