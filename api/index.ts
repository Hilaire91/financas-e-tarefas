import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

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
}

app.post("/api/ai/analyze-expenses", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Serviço de IA temporariamente indisponível. Por favor, adicione a chave GEMINI_API_KEY nas Configurações do Vercel."
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
        systemInstruction: `Você é o "Finis", um assistente financeiro com IA de extrema empatia, inteligência e objetividade para brasileiros. Seu objetivo é analisar os gastos e sugerir economias reais e personalizadas. Responda rigorosamente no formato JSON fornecido.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            aiScore: { type: Type.INTEGER },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedSavings: { type: Type.NUMBER }
                },
                required: ["category", "title", "description", "estimatedSavings"]
              }
            },
            financialHealthStatus: { type: Type.STRING }
          },
          required: ["summary", "aiScore", "suggestions", "financialHealthStatus"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Resposta vazia da IA.");
    res.json(JSON.parse(responseText.trim()));

  } catch (error: any) {
    console.error("Erro na rota de análise:", error);
    res.status(500).json({ error: "Erro ao processar análise financeira: " + error.message });
  }
});

app.post("/api/ai/categorize-bank-transactions", async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: "Serviço de IA indisponível. Defina a GEMINI_API_KEY no Vercel."
      });
    }

    const { rawText } = req.body;
    if (!rawText || typeof rawText !== "string") {
      return res.status(400).json({ error: "O texto bruto do extrato é obrigatório." });
    }

    const prompt = `Analise este texto de extrato bancário ou lançamentos de despesas e extraia as transações individuais:
"${rawText}"

Mapeie cada transação encontrada para uma das seguintes categorias permitidas: Alimentação, Transporte, Mercado, Saídas, Outros.
Corrija e embeleze os nomes dos estabelecimentos comerciais.
Retorne rigorosamente no formato de esquema JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `Você é um robô parser financeiro. Extraia o nome amigável do local, o valor numérico positivo, a data (YYYY-MM-DD), e a categoria. Responda em JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transactions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                  date: { type: Type.STRING }
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
    if (!responseText) throw new Error("Resposta vazia da IA.");
    res.json(JSON.parse(responseText.trim()));

  } catch (error: any) {
    console.error("Erro na rota de categorização:", error);
    res.status(500).json({ error: "Erro ao categorizar transações: " + error.message });
  }
});

export default app;

app.post("/api/checkout", async (req, res) => {
  try {
    const { plan, userId } = req.body;
    // Aqui seria a integração real com a Stripe
    // Como backend specialist, vou simular o processamento para fins de demonstração
    // num cenário real, usaríamos stripe.checkout.sessions.create({...})

    if (!userId || !plan) {
      return res.status(400).json({ error: "Missing plan or userId" });
    }

    // Simulando delay de gateway de pagamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simula a URL de redirecionamento ou sucesso da Stripe
    res.json({ success: true, message: "Pagamento processado com sucesso (Simulado)", url: "/?payment=success" });
  } catch (error: any) {
    console.error("Erro no checkout:", error);
    res.status(500).json({ error: "Erro ao processar pagamento." });
  }
});
