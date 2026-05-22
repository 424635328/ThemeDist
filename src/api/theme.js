// /api/theme.js
import OmniConfig from "./index_config.js"; 

export default function handler(req, res) {
  try {
    const themes = OmniConfig.getAllThemes() || [];

    // ✨ 核心修复：确保 API 返回的主题列表中包含 diy，兼容前台的下拉选择器
    const hasDiy = themes.some(t => t.id === 'diy');
    if (!hasDiy) {
        themes.push({
            id: 'diy',
            name: '🔧 DIY 自定义主题',
            type: 'custom'
        });
    }

    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate=86400");
    res.status(200).json(themes);
  } catch (error) {
    console.error("[API/Theme] Error:", error);
    res.status(500).json({ 
      error: "Failed to load themes", 
      details: error.message 
    });
  }
}