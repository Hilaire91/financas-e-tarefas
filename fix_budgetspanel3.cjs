const fs = require('fs');
let code = fs.readFileSync('src/components/BudgetsPanel.tsx', 'utf-8');
const badEnding = `        )}
      </div>
    </div>
  );
}
)}
      </div>
    </div>
  );}`;

if (code.includes(badEnding)) {
  code = code.replace(badEnding, `        )}
      </div>
    </div>
  );
}`);
} else {
  // Use regex
  code = code.replace(/\}\n\)\}\n\s*<\/div>\n\s*<\/div>\n\s*\);\}/g, '');
}
fs.writeFileSync('src/components/BudgetsPanel.tsx', code);
