import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini API Client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("⚠️ GEMINI_API_KEY is not configured or uses empty placeholder. AI Chatbot will run in simulation mode.");
    return null;
  }
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } catch (error) {
      console.error("❌ Exception during GoogleGenAI initialization:", error);
    }
  }
  return aiClient;
}

// System instructions for Iraqi Customs Adviser API under Law #22 of 2010
const INSTRUCTIONS = `یاریدەدەرێکی زیرەکی گومرکی عێراقی پڕۆفیشناڵیت (Iraq Customs Advisor).
کار دەکەیت بەپێی یاسای گومرکی عێراق ژمارە ٢٢ی ساڵی ٢٠١٠ (Iraqi Customs Law No. 22 of 2010).
وەڵامی بەکارهێنەران بدەرەوە سەبارەت بە تێچوو، ڕێنماییەکان، جۆری کاڵاکان، لیستی ڕێگەپێدراو (allowed)، پێویست بە مۆڵەت (restricted) و قەدەغەکراو (prohibited).

پۆلێنکردنی سەرەکی باجی گومرگی لە عێراق بەم شێوەیەیە:
١. کاڵای ئاسایی (Standard Cargo): ڕێژەی باجی بنەڕەتی ٥٪ ە. وەکو خۆراک، پۆشاکی ئاسایی، و ئەلیکترۆنیاتی گشتی.
٢. کاڵای لوکس (Luxury Cargo): ڕێژەی باجی بنەڕەتی ٢٠٪ ە. وەکو گەوهەر، ئۆتۆمبێلی گرانبەها، کاتژمێری لوکس، کحوول.
٣. کاڵای پیشەسازی (Industrial Cargo): ڕێژەی باجی بنەڕەتی ١٠٪ ە. وەکو ئامێر و کەرەستەی کارگەکان.

خەرجییە جێگیرەکان لە عێراق بریتین لە:
- سۆنار (Sonar Scan): بە شێوەیەکی گشتی ٥٠ دۆلارە.
- CBI (پشکنینی کوالێتی بانکی ناوەندی): ٢٥ دۆلارە.
- پۆرت / بەندەر (Port fee): ٧٥ دۆلارە.

ئاڵوگۆڕی دراو:
- نرخی فەرمی بانکی ناوەندی: ١٣٠٠ دینار بۆ یەک دۆلار.
- نرخی بازاڕی ئازاد: بە نزیکەیی ١٤٨٠ دینار بۆ یەک دۆلار.

باجی پاراستنی بەرهەمی نیشتمانی (National Product Protection Tariff):
ئەگەر چالاک بکرێت، بە ڕێژەی ١٠٪ (یاخود بەپێی جۆری کاڵا) زیادە دەخرێتە سەر نرخی دەربازبوون بۆ پاراستنی پیشەسازی ناوخۆیی.

ڕێنمایی بۆ وەڵامدانەوە:
- هەمیشە وەڵامەکانت بە زمانی کوردییەکی فەرمی، ڕوون و متمانەپێکراو بنووسە. ئەگەر بەکارهێنەر بە ئینگلیزی پرسیاری کرد، بە ئینگلیزی وەڵامی بدەرەوە.
- پێشنیاری جۆری گونجاوی بەرگری یان پۆل بکە (ئاسایی، پیشەسازی یان لوکس).
- سەرچاوەی فەرمی یان یاسای ژمارە ٢٢ی ساڵی ٢٠١٠ باس بکە بۆ متمانەبەخشین.
- وەڵامەکانت با گونجاو کورت و سوودبەخش بن، دوور لە قسەی درێژ و بێ سوود.
`;

// Chat endpoints proxy to Gemini API using Chats API
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  const client = getAiClient();
  if (!client) {
    // Return high-quality, simulated Kurdish/English response when API key is missing
    const kMessage = message.toLowerCase();
    let simText = "";
    if (kMessage.includes("سەلام") || kMessage.includes("سڵاو") || kMessage.includes("hello") || kMessage.includes("hi")) {
      simText = "سڵاو! بەخێربێن بۆ ڕاوێژکاری زیرەکی گومرکی عێراقی. ئامادەم وەڵامی پرسیارەکانت بدەمەوە دەربارەی تێچووی گومرک، یاساکان، و پۆلی کاڵاکان بەپێی یاسای ژمارە ٢٢ی ساڵی ٢٠١٠ 🏛️";
    } else if (kMessage.includes("lux") || kMessage.includes("لوکس")) {
      simText = "کاڵا لوکسەکان (وەک گەوهەر، ئۆتۆمبێلی گرانبەها، ئامێری لوکس، کاتژمێری تایبەت) باجی ٢٠٪ یان بەسەردا دەسەپێنرێت بەپێی یاسای گومرکی عێراق. لەگەڵ ئەمەشدا خەرجییە جێگیرەکانی وەک سۆنار و پشکنینی CBI و بەندەر کاریگەری دەکەنە سەر کۆی گشتی تێچووەکە.";
    } else if (kMessage.includes("sonar") || kMessage.includes("سۆنار") || kMessage.includes("خەرجی") || kMessage.includes("fee")) {
      simText = "خەرجییە جێگیرەکانی عێراق بە گشتی بریتین لە: سۆنار (٥٠ USD)، پشکنینی کوالێتی بانکی ناوەندی CBI (٢٥ USD)، و بارکردن و تێچووی بەندەر (٧٥ USD). ئەمانە دەکرێت لە ڕێگەی بەڕێوەبەرایەتی سیستەمەوە لە تابی ڕێکخستنەکان گۆڕانکارییان بەسەردا بێت.";
    } else if (kMessage.includes("رێگە") || kMessage.includes("قەدەغەکراو") || kMessage.includes("allowed") || kMessage.includes("prohibited")) {
      simText = "یاسای گومرکی عێراق کاڵا قەدەغەکراوەکانی دیاری کردووە وەک چەک، تەقەمەنی، ماددە هۆشبەرەکان گەر بێ مۆڵەتی فەرمی بن. هەروەها دەرمان پێویستی بە مۆڵەتی تایبەتی وەزارەتی تەندروستی هەیە. دەتوانیت لیستەکان لە لاپەڕەی سەرەکیدا ببینیت.";
    } else {
      simText = "بەپێی یاسای گومرکی عێراق ژمارە ٢٢ی ساڵی ٢٠١٠، گشت تەمەسسەکردنی کاڵاکان لەسەر کێش، جۆری کاڵاکە، یاخود پێویستی بوونی مۆڵەتەوە دیاری دەکرێت. کاڵای ئاسایی ٥٪ باجی گومرگی لەسەرە، کاتێک کاڵای پیشەسازی ١٠٪ و کاڵای لوکس ٢٠٪ ە. ئایا کێش و بەهای کاڵاکەت چەندە تا ئاماری تێچووەکەت بۆ بخەمەڕوو؟";
    }

    return res.json({
      role: "model",
      text: simText + "\n\n*(ڕێژیم: لەبەر نەبوونی API key ی گونجاو، ئەمە وەڵامێکی ئامادەکراوی فەرمی دەوازەکەیە)*",
    });
  }

  try {
    // Format history for Google Gen AI Chats interface
    // [{ role: 'user', parts: [{ text: '...' }] }]
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Create a secure conversation session with system instruction
    const chat = client.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: INSTRUCTIONS,
        temperature: 0.7,
      },
      history: formattedHistory,
    });

    const response = await chat.sendMessage({ message });
    return res.json({
      role: "model",
      text: response.text || "ببورە، ناتوانم وەڵامت بدەمەوە لە ئێستادا.",
    });
  } catch (error: any) {
    console.error("❌ Error query on Gemini API:", error);
    return res.status(500).json({
      error: "Error contacting Gemini API",
      details: error.message,
    });
  }
});

// Configure Vite or production serving
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("🚀 Starting development server with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("📦 Starting production server with static hosting...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🏛️ Iraq Digital Gateway is running at http://localhost:${PORT}`);
  });
}

configureServer();
