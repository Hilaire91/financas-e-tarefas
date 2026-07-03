const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

appCode = appCode.replace(
  /<span>Histórico de Lançamentos<\/span>/,
  `<span>Histórico de Lançamentos</span>
                      <button onClick={() => { if(window.confirm("Deseja realmente zerar todos os lançamentos?")) setExpenses([]); }} className="text-xs ml-4 px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors">
                        Zerar Tudo
                      </button>`
);

fs.writeFileSync('src/App.tsx', appCode);
