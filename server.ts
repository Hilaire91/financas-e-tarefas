import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini Client
  const geminiApiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (geminiApiKey) {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } else {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not defined. AI features will be unavailable.");
  }

  // API Route: Analyze expenses and provide suggestions / reports
  app.post("/api/checkout", async (req, res) => { 
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

  app.post("/api/ai/analyze-expenses", async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({
          error: "Serviço de IA temporariamente indisponível. Por favor, adicione a chave GEMINI_API_KEY nas Configurações do AI Studio."
        });
      }

      const { expenses, budgets, reportType } = req.body;

      const prompt = `Analise os seguintes dados do usuário:
Gastos atuais: ${JSON.stringify(expenses)}
Orçamentos definidos por categoria: ${JSON.stringify(budgets)}
Tipo de relatório solicitado: ${reportType}

Com base nestes dados, forneça um relatório detalhado e sugestões práticas de economia.
Retorne um objeto JSON estrito com o resumo, sugestões e pontuação de saúde financeira (aiScore).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Você é o "Finis", um assistente financeiro com IA de extrema empatia, inteligência e objetividade para brasileiros. 
Seu objetivo é analisar os gastos (categorias: Alimentação, Transporte, Mercado, Saídas, Outros) e sugerir economias reais e personalizadas.
Fale de forma amigável, direta, usando termos práticos. 
Você DEVE responder rigorosamente no formato de esquema JSON fornecido. Não use marcações adicionais ou Markdown na sua resposta fora do próprio JSON.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "Um resumo geral e empático da saúde financeira do usuário (1-2 parágrafos)."
              },
              aiScore: {
                type: Type.INTEGER,
                description: "Uma nota de 0 a 100 baseada no controle de gastos versus orçamentos e estabilidade financeira."
              },
              suggestions: {
                type: Type.ARRAY,
                description: "Dicas de economia personalizadas com base nos gastos mais elevados.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING, description: "Categoria do gasto (Alimentação, Transporte, Mercado, Saídas, Outros)" },
                    title: { type: Type.STRING, description: "Título curto da dica de economia." },
                    description: { type: Type.STRING, description: "Explicação prática e detalhada de como economizar nessa categoria." },
                    estimatedSavings: { type: Type.NUMBER, description: "Valor aproximado estimado de economia mensal em R$." }
                  },
                  required: ["category", "title", "description", "estimatedSavings"]
                }
              },
              financialHealthStatus: {
                type: Type.STRING,
                description: "Status curto de saúde financeira (e.g. Excelente, Estável, Alerta, Crítico)."
              }
            },
            required: ["summary", "aiScore", "suggestions", "financialHealthStatus"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Resposta vazia da IA.");
      }

      const analysisResult = JSON.parse(responseText.trim());
      res.json(analysisResult);
    } catch (error: any) {
      console.error("Erro na rota de análise:", error);
      res.status(500).json({ error: "Erro ao processar análise financeira: " + error.message });
    }
  });

  // API Route: Categorize bank transactions automatically from raw statement text
  app.post("/api/ai/categorize-bank-transactions", async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({
          error: "Serviço de IA indisponível. Defina a GEMINI_API_KEY para habilitar a automação."
        });
      }

      const { rawText } = req.body;
      if (!rawText || typeof rawText !== "string") {
        return res.status(400).json({ error: "O texto bruto do extrato é obrigatório." });
      }

      const prompt = `Analise este texto de extrato bancário ou lançamentos de despesas e extraia as transações individuais:
"${rawText}"

Mapeie cada transação encontrada para uma das seguintes categorias permitidas:
- Alimentação
- Transporte
- Mercado
- Saídas
- Outros

Corrija e embeleze os nomes dos estabelecimentos comerciais para termos legíveis (ex: "UBER *TRIP HELP" vira "Uber", "MC DONALDS 12" vira "McDonald's").
Retorne rigorosamente no formato de esquema JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Você é um robô parser financeiro. Seu objetivo é ler extratos e textos confusos e transformá-los em despesas organizadas e categorizadas.
Ignore lançamentos de entrada (créditos, salários). Concentre-se apenas em saídas/débitos/despesas.
Extraia o nome amigável do local, o valor numérico positivo, a data se identificada (formato YYYY-MM-DD), e classifique-o rigorosamente em: Alimentação, Transporte, Mercado, Saídas, Outros.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              transactions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING, description: "Nome comercial limpo e amigável." },
                    amount: { type: Type.NUMBER, description: "Valor numérico positivo da despesa em R$." },
                    category: { 
                      type: Type.STRING, 
                      description: "Categoria estrita: Alimentação, Transporte, Mercado, Saídas, Outros" 
                    },
                    date: { type: Type.STRING, description: "Data no formato YYYY-MM-DD se identificada, ou vazio." }
                  },
                  required: ["description", "amount", "category"]
                }
              }
            },
            required: ["transactions"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Resposta vazia da IA.");
      }

      const result = JSON.parse(responseText.trim());
      res.json(result);
    } catch (error: any) {
      console.error("Erro na rota de categorização:", error);
      res.status(500).json({ error: "Erro ao categorizar transações: " + error.message });
    }
  });

  // Serve static assets and bundle React in development/production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
