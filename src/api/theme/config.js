// /api/theme/config.js
import OmniConfig from "../index_config.js";

if (typeof global !== 'undefined') {
  global.Lunar = undefined;
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { strategy = "auto", date } = req.query;
    let config;

    // ✨ 核心修复：返回合法的十六进制色值，防止前端 JS 崩溃
    if (strategy === "diy") {
      config = {
        id: "diy",
        name: "DIY Sandbox",
        type: "custom",
        theme: {
          bgBase: "#050a14",     // 给定合法的暗黑假数据
          textMain: "#f4f4f5",
          textMuted: "#52525b",
          accentRgb: "0, 243, 255"
        }
      };
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      
    } else {
      config = OmniConfig.getThemeConfig(strategy, date);
      if (strategy === "random") {
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      } else {
        res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
      }
    }

    res.status(200).json(config);
  } catch (error) {
    console.error("[API/Theme/Config] Full Error:", error);
    res.status(500).json({ error: "Failed to generate theme config", details: error.message });
  }
}