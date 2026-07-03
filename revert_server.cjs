const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const toRemove = `  app.post("/api/checkout", async (req, res) => {
    try {
      const { plan, userId } = req.body;
      if (!userId || !plan) return res.status(400).json({ error: "Missing plan or userId" });
      await new Promise(resolve => setTimeout(resolve, 1500));
      res.json({ success: true, message: "Pagamento processado com sucesso (Simulado)", url: "/?payment=success" });
    } catch (error: any) {
      console.error("Erro no checkout:", error);
      res.status(500).json({ error: "Erro ao processar pagamento." });
    }
  });
`;

code = code.replace(toRemove, '');
fs.writeFileSync('server.ts', code);
