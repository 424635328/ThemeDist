// api/index_config.js


import { Lunar } from 'lunar-javascript'; 
const lightModeCSS = `
    /* 顶部图标与文字反转 */
    .icon:hover { stroke: var(--text-main); }
    header a:not(.avatar-link):not(#theme-toggle):not(.app-icon)::after { background-color: var(--text-main); }
    
    /* 主题切换面板优化 */
    .theme-panel { background: rgba(255, 255, 255, 0.85); box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05); }
    .theme-item { color: var(--text-main); }
    .theme-item:hover, .theme-item.active { background: rgba(0,0,0,0.05); color: var(--text-main); }
    .theme-group-title { color: var(--text-muted); }
    .theme-divider { background: rgba(0,0,0,0.05); }
    
    /* 搜索下拉结果面板优化 */
    .search-results-dropdown { background: rgba(255,255,255,0.95); border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 15px 40px rgba(0,0,0,0.15); }
    .result-item { background: transparent; border-color: transparent; }
    .result-item:hover, .result-item.active { background: rgba(0,0,0,0.03); border-color: rgba(var(--accent-rgb), 0.3); box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .result-title { color: var(--text-main); }
    .result-desc { color: var(--text-muted); }
    .tag { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.08); color: var(--text-muted); }
    .result-item:hover .tag { background: rgba(0,0,0,0.08); border-color: rgba(0,0,0,0.15); color: var(--text-main); }
    .result-icon { background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.05); color: var(--text-main); }
    .result-arrow { color: var(--text-muted); }
    
    /* 搜索框交互优化 */
    .search-box.has-results { background: rgba(255,255,255,0.95); box-shadow: 0 8px 32px rgba(0,0,0,0.1); border-color: rgba(var(--accent-rgb), 0.4); }
    .search-input::placeholder { color: rgba(0,0,0,0.3); }
`;

const OmniConfig = {
    default: {
        logo: { type: 'text', text: 'OMNI-MATRIX', colors:['#38bdf8', '#a78bfa', '#c084fc', '#e879f9', '#22d3ee', '#38bdf8'] },
        theme: {
            bgBase: '#06060d', textMain: '#f1f1f7', textMuted: '#7a7a90', accentRgb: '56, 189, 248',
            avatarGrad1: '#6366f1', avatarGrad2: '#38bdf8', ambient1: 'rgba(99, 102, 241, 0.12)', ambient2: 'rgba(56, 189, 248, 0.08)',
            customCss: ``
        },
        extensions:[]
    },

    holidays: {
        // --- 原有节日保留 ---
        '01-01': { logo: { type: 'text', text: 'HELLO YEAR', colors:['#fef08a', '#eab308', '#fef9c3', '#ffffff'] }, theme: { bgBase: '#0a0a0c', textMain: '#fefce8', textMuted: '#caa951', accentRgb: '255, 215, 0', avatarGrad1: '#d4af37', avatarGrad2: '#ffea00', ambient1: 'rgba(255, 215, 0, 0.15)', ambient2: 'rgba(255, 255, 255, 0.1)' } },
        '02-14': { logo: { type: 'text', text: 'OMNI-ROMANCE', colors:['#ff4b82', '#ff8ea9', '#ff1453', '#ff4b82'] }, theme: { bgBase: '#14050a', textMain: '#fce7f0', textMuted: '#d4a0b4', accentRgb: '255, 20, 83', avatarGrad1: '#e11d48', avatarGrad2: '#fda4af', ambient1: 'rgba(255, 20, 83, 0.2)', ambient2: 'rgba(255, 142, 169, 0.15)' } },
        '03-14': { logo: { type: 'text', text: 'MATRIX 3.1415', colors:['#4285F4', '#EA4335', '#FBBC05', '#34A853'] }, theme: { bgBase: '#f8f9fa', textMain: '#202124', textMuted: '#5f6368', accentRgb: '66, 133, 244', avatarGrad1: '#4285F4', avatarGrad2: '#34A853', customCss: lightModeCSS + `.ambient-bg { background-image: radial-gradient(circle at center, #e8eaed 2px, transparent 2.5px); background-size: 30px 30px; filter: none; }` } },
        '03-17': { logo: { type: 'text', text: 'LUCKY MATRIX', colors:['#00ff00', '#32cd32', '#008000', '#adff2f'] }, theme: { bgBase: '#021005', textMain: '#e6ffe6', textMuted: '#8fbc8f', accentRgb: '50, 205, 50', avatarGrad1: '#006400', avatarGrad2: '#00ff00', ambient1: 'rgba(0, 255, 0, 0.2)', ambient2: 'rgba(50, 205, 50, 0.15)', customCss: `.search-box { box-shadow: 0 0 20px rgba(50,205,50,0.2); border-color: rgba(50,205,50,0.5); }` }, extensions:[{ type: 'html', content: '<div style="position:fixed; top:20%; left:5%; font-size:30px; opacity:0.3; animation: spin 10s linear infinite;">🍀</div><style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>' }, { type: 'html', content: '<div style="position:fixed; bottom:20%; right:8%; font-size:40px; opacity:0.2; transform: rotate(-15deg);">☘️</div>' }] },
        '04-01': { logo: { type: 'text', text: 'what is the real', colors:['#ff00ff', '#00ffff', '#ffff00', '#ff0000'] }, theme: { bgBase: '#1a1a24', accentRgb: '255, 0, 255', avatarGrad1: '#00ffff', avatarGrad2: '#ff00ff', customCss: `body:hover { transform: rotate(1deg); } .avatar { transform: rotate(180deg); } .search-input { direction: rtl; }` } },

        // 【第一类：中国核心农历传统节日·L开头 全系列】
        // ==============================================
        'L01-02': { // 正月初二 拜财神日
            logo: { type: 'text', text: 'CAISHEN DAY', colors:['#ffd700', '#ff8c00', '#ffffff', '#ffb347'] }, 
            theme: { 
                bgBase: '#1a0a00', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 215, 0', 
                avatarGrad1: '#ff8c00', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 215, 0, 0.25)', ambient2: 'rgba(255, 140, 0, 0.2)',
                customCss: `
                    @keyframes coinFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(180deg); } }
                    .search-box { border: 1px solid rgba(255,215,0,0.4); box-shadow: 0 0 20px rgba(255,215,0,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: coinFloat 4s infinite;">🪙</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: coinFloat 3.5s infinite 0.5s;">💰</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🧧</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🏮</div>' }
            ]
        },
        'L01-05': { // 正月初五 破五节
            logo: { type: 'text', text: 'PO WU FESTIVAL', colors:['#ff4500', '#ffd700', '#ffffff', '#ffa500'] }, 
            theme: { 
                bgBase: '#140500', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 69, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 69, 0, 0.2)', ambient2: 'rgba(255, 215, 0, 0.15)',
                customCss: `
                    @keyframes firecrackerPop { 0% { transform: scale(1); opacity:1; } 100% { transform: scale(1.5); opacity:0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0; animation: firecrackerPop 1.5s infinite 0s;">🧨</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0; animation: firecrackerPop 1.5s infinite 0.5s;">🧨</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🥟</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🧹</div>' }
            ]
        },
        'L01-15': { // 正月十五 元宵节/上元节
            logo: { type: 'text', text: 'LANTERN FESTIVAL', colors:['#ff0000', '#ffd700', '#ffffff', '#ffa500'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.25)', ambient2: 'rgba(255, 215, 0, 0.2)',
                customCss: `
                    @keyframes lanternSway { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
                    .search-box { border: 2px solid #ffd700; border-radius: 50px; box-shadow: 0 0 30px rgba(255,215,0,0.4); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:10%; left:12%; font-size:50px; opacity:0.3; transform-origin: top center; animation: lanternSway 4s infinite;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:10%; left:25%; font-size:45px; opacity:0.25; transform-origin: top center; animation: lanternSway 4.5s infinite 0.5s;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:10%; right:12%; font-size:50px; opacity:0.3; transform-origin: top center; animation: lanternSway 4s infinite 0.3s;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:10%; right:25%; font-size:45px; opacity:0.25; transform-origin: top center; animation: lanternSway 4.5s infinite 0.8s;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🥣</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🎆</div>' }
            ]
        },
        'L02-02': { // 二月初二 龙抬头/春龙节
            logo: { type: 'text', text: 'DRAGON HEAD RAISING', colors:['#ffd700', '#ff8c00', '#00bfff', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a0500', textMain: '#fffce8', textMuted: '#ffb347', accentRgb: '255, 215, 0', 
                avatarGrad1: '#b8860b', avatarGrad2: '#00bfff', ambient1: 'rgba(255, 215, 0, 0.25)', ambient2: 'rgba(0, 191, 255, 0.15)',
                customCss: `
                    @keyframes dragonFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:10%; font-size:60px; opacity:0.3; animation: dragonFloat 5s infinite;">🐉</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:10%; font-size:55px; opacity:0.25; animation: dragonFloat 5.5s infinite 0.5s;">🐲</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">💈</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🥟</div>' }
            ]
        },
        'L03-03': { // 三月初三 上巳节/壮族三月三
            logo: { type: 'text', text: 'SHANG SI FESTIVAL', colors:['#ff69b4', '#ffb6c1', '#98fb98', '#ffffff'] }, 
            theme: { 
                bgBase: '#10050a', textMain: '#fff0f5', textMuted: '#ffb6c1', accentRgb: '255, 105, 180', 
                avatarGrad1: '#c71585', avatarGrad2: '#98fb98', ambient1: 'rgba(255, 105, 180, 0.2)', ambient2: 'rgba(152, 251, 152, 0.15)',
                customCss: `
                    @keyframes flowerFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: flowerFloat 3s infinite;">🌸</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: flowerFloat 3.5s infinite 0.5s;">🌺</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🎶</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🪁</div>' }
            ]
        },
        'L05-05': { // 五月初五 端午节
            logo: { type: 'text', text: 'DRAGON BOAT FESTIVAL', colors:['#22c55e', '#4ade80', '#fbbf24', '#f0fdf4'] }, 
            theme: { 
                bgBase: '#051005', textMain: '#f0fff0', textMuted: '#90ee90', accentRgb: '34, 139, 34', 
                avatarGrad1: '#006400', avatarGrad2: '#ffd700', ambient1: 'rgba(34, 139, 34, 0.2)', ambient2: 'rgba(255, 215, 0, 0.15)',
                customCss: `
                    @keyframes boatRow { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(10px); } }
                    @keyframes leafSway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:10%; font-size:55px; opacity:0.3; animation: boatRow 4s infinite;">🚣</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: leafSway 3s infinite;">🌿</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:50px; opacity:0.25;">🫔</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🍶</div>' }
            ]
        },
        'L06-06': { // 六月初六 天贶节/晒秋节/姑姑节
            logo: { type: 'text', text: 'TIAN KUANG FESTIVAL', colors:['#ffd700', '#d4af37', '#87ceeb', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a0f14', textMain: '#fff8e6', textMuted: '#d4af37', accentRgb: '212, 175, 55', 
                avatarGrad1: '#b8860b', avatarGrad2: '#87ceeb', ambient1: 'rgba(212, 175, 55, 0.2)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    @keyframes sunShine { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.4; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:60px; opacity:0.3; animation: sunShine 4s infinite;">☀️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25;">📖</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">👚</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🍜</div>' }
            ]
        },
        'L07-07': { // 七月初七 七夕节/乞巧节
            logo: { type: 'text', text: 'QIXI FESTIVAL', colors:['#ff69b4', '#c71585', '#87ceeb', '#ffffff'] }, 
            theme: { 
                bgBase: '#050214', textMain: '#fff0f5', textMuted: '#ffb6c1', accentRgb: '255, 105, 180', 
                avatarGrad1: '#800080', avatarGrad2: '#ff69b4', ambient1: 'rgba(255, 105, 180, 0.25)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    @keyframes starTwinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.6; } }
                    @keyframes magpieFly { 0% { transform: translateX(-10vw); } 100% { transform: translateX(110vw); } }
                    .search-box { border: 1px solid rgba(255,105,180,0.4); box-shadow: 0 0 20px rgba(255,105,180,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:10%; left:10%; font-size:14px; opacity:0.2; animation: starTwinkle 2s infinite 0s;">✨</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:30%; font-size:18px; opacity:0.2; animation: starTwinkle 2.5s infinite 0.5s;">✨</div>' },
                { type: 'html', content: '<div style="position:fixed; top:10%; left:60%; font-size:16px; opacity:0.2; animation: starTwinkle 3s infinite 1s;">✨</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:85%; font-size:20px; opacity:0.2; animation: starTwinkle 2.2s infinite 0.3s;">✨</div>' },
                { type: 'html', content: '<div style="position:fixed; top:40%; left:-10%; font-size:35px; opacity:0.25; animation: magpieFly 15s linear infinite;">🐦</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🎋</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">❤️</div>' }
            ]
        },
        'L07-15': { // 七月十五 中元节/盂兰盆节
            logo: { type: 'text', text: 'ZHONG YUAN FESTIVAL', colors:['#ffd700', '#d4af37', '#ffffff', '#b0c4de'] }, 
            theme: { 
                bgBase: '#05050a', textMain: '#fffce8', textMuted: '#d2b48c', accentRgb: '255, 215, 0', 
                avatarGrad1: '#8b4513', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 215, 0, 0.15)', ambient2: 'rgba(176, 196, 222, 0.1)',
                customCss: `
                    @keyframes lampFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:15%; font-size:45px; opacity:0.25; animation: lampFloat 4s infinite;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:25%; font-size:40px; opacity:0.2; animation: lampFloat 4.5s infinite 0.5s;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; right:15%; font-size:45px; opacity:0.25; animation: lampFloat 4s infinite 0.3s;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; right:25%; font-size:40px; opacity:0.2; animation: lampFloat 4.5s infinite 0.8s;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:35px; opacity:0.15;">🪷</div>' }
            ]
        },
        'L08-15': { // 八月十五 中秋节
            logo: { type: 'text', text: 'MID-AUTUMN FESTIVAL', colors:['#fef3c7', '#f59e0b', '#fef9c3', '#fbbf24'] }, 
            theme: { 
                bgBase: '#050a14', textMain: '#fffce8', textMuted: '#ffd700', accentRgb: '255, 215, 0', 
                avatarGrad1: '#ff8c00', avatarGrad2: '#fffacd', ambient1: 'rgba(255, 215, 0, 0.3)', ambient2: 'rgba(255, 255, 255, 0.1)',
                customCss: `
                    @keyframes moonGlow { 0%, 100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.05); filter: brightness(1.2); } }
                    @keyframes rabbitHop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                    .search-box { border: 1px solid rgba(255,215,0,0.4); border-radius: 50px; box-shadow: 0 0 25px rgba(255,215,0,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:10%; right:10%; font-size:120px; opacity:0.2; animation: moonGlow 5s infinite;">🌕</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25; animation: rabbitHop 3s infinite;">🐇</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:50px; opacity:0.25;">🥮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:40px; opacity:0.2;">🏮</div>' }
            ]
        },
        'L09-09': { // 九月初九 重阳节/敬老节
            logo: { type: 'text', text: 'CHONG YANG FESTIVAL', colors:['#ff8c00', '#d2691e', '#ffffff', '#98fb98'] }, 
            theme: { 
                bgBase: '#0f0500', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 140, 0', 
                avatarGrad1: '#8b4513', avatarGrad2: '#98fb98', ambient1: 'rgba(255, 140, 0, 0.2)', ambient2: 'rgba(152, 251, 152, 0.15)',
                customCss: `
                    @keyframes chrysanthemumFloat { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: chrysanthemumFloat 4s infinite;">🌼</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: chrysanthemumFloat 4.5s infinite 0.5s;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🏔️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🍶</div>' }
            ]
        },
        'L10-15': { // 十月十五 下元节
            logo: { type: 'text', text: 'XIA YUAN FESTIVAL', colors:['#87ceeb', '#4682b4', '#ffffff', '#ffd700'] }, 
            theme: { 
                bgBase: '#020514', textMain: '#e6f2ff', textMuted: '#add8e6', accentRgb: '135, 206, 235', 
                avatarGrad1: '#191970', avatarGrad2: '#ffd700', ambient1: 'rgba(135, 206, 235, 0.15)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes waterWave { 0%, 100% { transform: scaleY(1); opacity: 0.1; } 50% { transform: scaleY(1.2); opacity: 0.2; } }
                    body::before { content:''; position:fixed; bottom:0; left:0; width:100vw; height:20vh; background: linear-gradient(to top, rgba(135,206,235,0.2), transparent); animation: waterWave 4s infinite; pointer-events: none; z-index: -1; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:15%; font-size:45px; opacity:0.25;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; right:15%; font-size:45px; opacity:0.25;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:35px; opacity:0.15;">🌊</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🥟</div>' }
            ]
        },
        'L12-08': { // 腊月初八 腊八节
            logo: { type: 'text', text: 'LA BA FESTIVAL', colors:['#d2691e', '#8b4513', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a0500', textMain: '#f5deb3', textMuted: '#d2b48c', accentRgb: '139, 69, 19', 
                avatarGrad1: '#3e1f00', avatarGrad2: '#ffd700', ambient1: 'rgba(139, 69, 19, 0.15)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes steamRise { 0% { transform: translateY(0) scale(1); opacity: 0.6; } 100% { transform: translateY(-20px) scale(1.2); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🥣</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:18%; font-size:20px; opacity:0; animation: steamRise 2s infinite 0s;">💨</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:22%; font-size:20px; opacity:0; animation: steamRise 2s infinite 0.5s;">💨</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🧄</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:35px; opacity:0.15;">🏮</div>' }
            ]
        },
        'L12-23': { // 腊月廿三 北方小年
            logo: { type: 'text', text: 'NORTHERN XIAO NIAN', colors:['#ff0000', '#ffd700', '#ffffff', '#ffa500'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(255, 215, 0, 0.15)',
                customCss: `
                    @keyframes firecrackerBlink { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.5; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.3; animation: firecrackerBlink 1s infinite;">🧨</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0.3; animation: firecrackerBlink 1s infinite 0.5s;">🧨</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🧹</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🍬</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; left:50%; transform: translateX(-50%); font-size:35px; opacity:0.15;">🏮</div>' }
            ]
        },
        'L12-24': { // 腊月廿四 南方小年
            logo: { type: 'text', text: 'SOUTHERN XIAO NIAN', colors:['#ffd700', '#ff8c00', '#ffffff', '#ff0000'] }, 
            theme: { 
                bgBase: '#140a00', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 215, 0', 
                avatarGrad1: '#ff8c00', avatarGrad2: '#ff0000', ambient1: 'rgba(255, 215, 0, 0.2)', ambient2: 'rgba(255, 0, 0, 0.15)',
                customCss: `
                    @keyframes lanternGlow { 0%, 100% { transform: scale(1); opacity: 0.25; } 50% { transform: scale(1.05); opacity: 0.35; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:50px; opacity:0.3; animation: lanternGlow 3s infinite;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:50px; opacity:0.3; animation: lanternGlow 3s infinite 0.5s;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🧹</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🥮</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:50%; transform: translateX(-50%); font-size:45px; opacity:0.25;">🧨</div>' }
            ]
        },
        'L12-30': { // 腊月三十 除夕
            logo: { type: 'text', text: 'CHU XI NEW YEAR EVE', colors:['#ff0000', '#ffd700', '#ffffff', '#ffa500'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#ffffff', textMuted: '#ffb347', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.3)', ambient2: 'rgba(255, 215, 0, 0.25)',
                customCss: `
                    @keyframes fireworkBurst { 0% { transform: scale(0); opacity:1; } 100% { transform: scale(2); opacity:0; } }
                    @keyframes lanternSway { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
                    .search-box { border: 2px solid #ffd700; box-shadow: 0 0 30px rgba(255,0,0,0.4); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:10%; left:15%; font-size:10px; opacity:0; animation: fireworkBurst 2s infinite 0s;">🎆</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:20%; font-size:10px; opacity:0; animation: fireworkBurst 2.5s infinite 0.5s;">🎆</div>' },
                { type: 'html', content: '<div style="position:fixed; top:5%; left:50%; transform: translateX(-50%); font-size:10px; opacity:0; animation: fireworkBurst 1.8s infinite 0.3s;">🎆</div>' },
                { type: 'html', content: '<div style="position:fixed; top:10%; left:12%; font-size:50px; opacity:0.3; transform-origin: top center; animation: lanternSway 4s infinite;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:10%; right:12%; font-size:50px; opacity:0.3; transform-origin: top center; animation: lanternSway 4s infinite 0.3s;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🧧</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.25;">🥟</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:50%; transform: translateX(-50%); font-size:60px; opacity:0.3;">🧨</div>' }
            ]
        },

        // ==============================================
        // 【第二类：国内法定/特色公历节日 全系列】
        // ==============================================
        '01-01': { // 元旦
            logo: { type: 'text', text: 'NEW YEAR\'S DAY', colors:['#ff0000', '#ffd700', '#ffffff', '#00bfff'] }, 
            theme: { 
                bgBase: '#050514', textMain: '#ffffff', textMuted: '#b0c4de', accentRgb: '255, 0, 0', 
                avatarGrad1: '#800080', avatarGrad2: '#00bfff', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(0, 191, 255, 0.15)',
                customCss: `
                    @keyframes fireworkPop { 0% { transform: scale(0); opacity:1; } 100% { transform: scale(1.5); opacity:0; } }
                    .search-box { border: 2px solid #ffffff; box-shadow: 0 0 20px rgba(255,255,255,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:15%; font-size:45px; opacity:0; animation: fireworkPop 2s infinite 0s;">🎉</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:45px; opacity:0; animation: fireworkPop 2s infinite 0.5s;">🎊</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🍾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🎇</div>' }
            ]
        },
        '03-08': { // 国际妇女节
            logo: { type: 'text', text: 'WOMEN\'S DAY', colors:['#ff69b4', '#c71585', '#ffffff', '#ffb6c1'] }, 
            theme: { 
                bgBase: '#10050a', textMain: '#fff0f5', textMuted: '#ffb6c1', accentRgb: '255, 105, 180', 
                avatarGrad1: '#800080', avatarGrad2: '#ff69b4', ambient1: 'rgba(255, 105, 180, 0.25)', ambient2: 'rgba(255, 182, 193, 0.2)',
                customCss: `
                    @keyframes flowerBloom { 0%, 100% { transform: scale(1); opacity: 0.25; } 50% { transform: scale(1.1); opacity: 0.35; } }
                    .search-box { border: 1px solid rgba(255,105,180,0.4); box-shadow: 0 0 20px rgba(255,105,180,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: flowerBloom 3s infinite;">🌸</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:45px; opacity:0.25; animation: flowerBloom 3s infinite 0.5s;">🌹</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">💐</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">❤️</div>' }
            ]
        },
        '03-12': { // 中国植树节
            logo: { type: 'text', text: 'ARBOR DAY', colors:['#228b22', '#32cd32', '#98fb98', '#ffffff'] }, 
            theme: { 
                bgBase: '#051005', textMain: '#f0fff0', textMuted: '#90ee90', accentRgb: '34, 139, 34', 
                avatarGrad1: '#006400', avatarGrad2: '#32cd32', ambient1: 'rgba(34, 139, 34, 0.2)', ambient2: 'rgba(50, 205, 50, 0.15)',
                customCss: `
                    @keyframes treeGrow { 0% { transform: scaleY(0.5); opacity: 0.2; } 100% { transform: scaleY(1); opacity: 0.3; } }
                    @keyframes leafSway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:15%; font-size:60px; transform-origin: bottom center; opacity:0.3; animation: treeGrow 5s ease-out alternate infinite;">🌳</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:75%; font-size:60px; transform-origin: bottom center; opacity:0.3; animation: treeGrow 5s ease-out alternate infinite 0.5s;">🌴</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:40px; opacity:0.2; animation: leafSway 3s infinite;">🍃</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🪓</div>' }
            ]
        },
        '05-01': { // 国际劳动节 × 夏日主题增强版（冰与火之歌）
    logo: { 
        type: 'text', 
        text: 'MAY DAY 🍹', // 修改表情，更好地过渡到夏日主题
        // 渐变色：从劳动的红黄过渡到夏日的青蓝
        colors:['#ff4b1f', '#ff9068', '#00c6ff', '#0072ff'] 
    }, 

    theme: { 
        // 将纯黑改为深邃的暗蓝/紫底色，更适合夏日夜晚或日落，避免过于压抑
        bgBase: '#121526', 
        textMain: '#ffffff', 
        textMuted: '#a0aec0', 
        accentRgb: '0, 198, 255', // 以夏日清凉青色为主强调色

        avatarGrad1: '#ff4b1f', // 劳动的火热
        avatarGrad2: '#00c6ff', // 夏日的清凉

        ambient1: 'rgba(255, 75, 31, 0.2)',  // 左上角暖色氛围
        ambient2: 'rgba(0, 198, 255, 0.2)',  // 右下角冷色氛围

        customCss: `
            /* ===== 优化后的基础动效 ===== */
            /* 1. 锤子敲击动画（比原地360度旋转更真实） */
            @keyframes hammerStrike { 
                0%, 100% { transform: rotate(0deg); } 
                10% { transform: rotate(-25deg); } 
                20% { transform: rotate(45deg); } /* 敲击 */
                30% { transform: rotate(0deg); }
            }

            /* 2. 齿轮匀速旋转 */
            @keyframes gearSpin {
                100% { transform: rotate(360deg); }
            }

            /* 3. 太阳发光脉冲 */
            @keyframes sunGlow {
                0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px #ffd700); }
                50% { transform: scale(1.05); filter: drop-shadow(0 0 30px #ff8c00); }
            }

            /* 4. 气泡S型上升（增加水平位移，更自然） */
            @keyframes bubbleRiseS {
                0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
                20% { opacity: 0.7; }
                50% { transform: translate(-20px, -150px) scale(1.1); }
                80% { opacity: 0.6; }
                100% { transform: translate(20px, -300px) scale(1.3); opacity: 0; }
            }

            /* 5. 饮料浮动 */
            @keyframes drinkFloat {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-15px) rotate(5deg); }
            }

            /* 6. 点击产生的冰块掉落 */
            @keyframes iceDrop {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
                100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.2); opacity: 0; }
            }

            /* ===== UI增强 (拟态与发光) ===== */
            .search-box { 
                border: 1px solid rgba(0, 198, 255, 0.4); 
                background: rgba(18, 21, 38, 0.6) !important;
                backdrop-filter: blur(10px);
                box-shadow: 0 0 20px rgba(0, 198, 255, 0.15), inset 0 0 10px rgba(255, 75, 31, 0.1);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            .search-box:hover {
                border-color: rgba(255, 75, 31, 0.6);
                box-shadow: 0 0 30px rgba(255, 75, 31, 0.3), inset 0 0 15px rgba(0, 198, 255, 0.2);
                transform: translateY(-2px) scale(1.01);
            }

            /* ===== 统一管理扩展元素类名，去除冗余内联样式 ===== */
            .dec-icon { position: fixed; z-index: -1; user-select: none; pointer-events: none; }
            
            .labor-hammer { top: 18%; left: 8%; font-size: 55px; opacity: 0.3; transform-origin: bottom right; animation: hammerStrike 3s ease-in-out infinite; }
            .labor-gear { top: 25%; right: 8%; font-size: 50px; opacity: 0.2; animation: gearSpin 8s linear infinite; }
            .labor-factory { bottom: 10%; left: 5%; font-size: 60px; opacity: 0.2; filter: grayscale(50%); }

            .summer-sun { top: 8%; right: 15%; font-size: 65px; opacity: 0.85; animation: sunGlow 4s infinite; }
            .summer-beach { bottom: 8%; right: 5%; font-size: 55px; opacity: 0.6; }
            .summer-melon { bottom: 18%; left: 25%; font-size: 45px; opacity: 0.5; transform: rotate(-15deg); }

            .summer-bubble { position: fixed; bottom: -20px; font-size: 24px; opacity: 0; pointer-events: none; animation: bubbleRiseS linear infinite; z-index: 0; }

            /* 交互式饮料杯 */
            .interactive-drink {
                position: fixed; bottom: 15%; right: 15%; font-size: 50px; cursor: pointer;
                animation: drinkFloat 3s ease-in-out infinite; transition: filter 0.3s;
                user-select: none; z-index: 10; filter: drop-shadow(0 5px 15px rgba(0, 198, 255, 0.4));
            }
            .interactive-drink:hover { filter: drop-shadow(0 0 25px rgba(0, 198, 255, 0.8)) brightness(1.1); animation-play-state: paused; }
            .interactive-drink:active { transform: scale(0.9); }

            /* 动态生成的冰块 */
            .ice-particle {
                position: fixed; font-size: 20px; pointer-events: none; z-index: 9999;
                animation: iceDrop 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
        `
    },

    extensions:[
        /* ===== 劳动节元素 (硬核力量) ===== */
        { type: 'html', content: '<div class="dec-icon labor-hammer">🔨</div>' },
        { type: 'html', content: '<div class="dec-icon labor-gear">⚙️</div>' },
        { type: 'html', content: '<div class="dec-icon labor-factory">🏭</div>' },

        /* ===== 夏日元素 (阳光沙滩) ===== */
        { type: 'html', content: '<div class="dec-icon summer-sun">🌞</div>' },
        { type: 'html', content: '<div class="dec-icon summer-beach">🏖️</div>' },
        { type: 'html', content: '<div class="dec-icon summer-melon">🍉</div>' },

        /* ===== 漂浮气泡 (S型轨迹上升) ===== */
        { type: 'html', content: '<div class="summer-bubble" style="left: 15%; animation-duration: 7s; animation-delay: 0s;">🫧</div>' },
        { type: 'html', content: '<div class="summer-bubble" style="left: 35%; animation-duration: 9s; animation-delay: 2s; font-size: 18px;">🫧</div>' },
        { type: 'html', content: '<div class="summer-bubble" style="left: 65%; animation-duration: 6s; animation-delay: 1s; font-size: 28px;">🫧</div>' },
        { type: 'html', content: '<div class="summer-bubble" style="left: 85%; animation-duration: 8s; animation-delay: 3s;">🫧</div>' },

        /* ===== 可点击交互：夏日冷饮 (移除alert，改为点击爆出冰块) ===== */
        { 
            type: 'html', 
            content: `
                <div class="interactive-drink" title="点击清凉一下！" onclick="
                    const num = 5;
                    for(let i=0; i<num; i++) {
                        const ice = document.createElement('div');
                        ice.innerText = ['🧊', '💦', '❄️'][Math.floor(Math.random()*3)];
                        ice.className = 'ice-particle';
                        ice.style.left = event.clientX + 'px';
                        ice.style.top = event.clientY + 'px';
                        // 随机散开的角度和距离
                        const angle = (Math.random() * 360) * (Math.PI / 180);
                        const distance = 50 + Math.random() * 80;
                        ice.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
                        ice.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
                        document.body.appendChild(ice);
                        setTimeout(() => ice.remove(), 800);
                    }
                ">
                    🥤
                </div>
            `
        }
    ]
},
        '05-04': { // 中国青年节
            logo: { type: 'text', text: 'YOUTH DAY', colors:['#4169e1', '#00bfff', '#ffffff', '#ffd700'] }, 
            theme: { 
                bgBase: '#020514', textMain: '#e6f2ff', textMuted: '#add8e6', accentRgb: '65, 105, 225', 
                avatarGrad1: '#000080', avatarGrad2: '#ffd700', ambient1: 'rgba(65, 105, 225, 0.2)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes starFly { 0% { transform: translateX(-10vw) translateY(0); } 100% { transform: translateX(110vw) translateY(-20px); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:-10%; font-size:35px; opacity:0.25; animation: starFly 15s linear infinite;">✨</div>' },
                { type: 'html', content: '<div style="position:fixed; top:30%; left:-10%; font-size:30px; opacity:0.2; animation: starFly 18s linear infinite 2s;">✨</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🎓</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🎤</div>' }
            ]
        },
        '05-12': { // 国际护士节
            logo: { type: 'text', text: 'NURSES DAY', colors:['#ffffff', '#add8e6', '#4169e1', '#ff69b4'] }, 
            theme: { 
                bgBase: '#020514', textMain: '#ffffff', textMuted: '#add8e6', accentRgb: '255, 255, 255', 
                avatarGrad1: '#4682b4', avatarGrad2: '#ff69b4', ambient1: 'rgba(255, 255, 255, 0.15)', ambient2: 'rgba(255, 105, 180, 0.1)',
                customCss: `
                    @keyframes heartbeat { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.3); } 30% { transform: scale(1); } 45% { transform: scale(1.15); } 60% { transform: scale(1); } }
                    .search-box { border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 0 15px rgba(65,105,225,0.2); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25; animation: heartbeat 1.5s infinite;">❤️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🩺</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🏥</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">💊</div>' }
            ]
        },
        '06-01': { // 国际儿童节
            logo: { type: 'text', text: 'CHILDREN\'S DAY', colors:['#ff0000', '#ffd700', '#00ff00', '#00bfff', '#ffffff'] }, 
            theme: { 
                bgBase: '#050514', textMain: '#ffffff', textMuted: '#b0c4de', accentRgb: '255, 215, 0', 
                avatarGrad1: '#ff0000', avatarGrad2: '#00bfff', ambient1: 'rgba(255, 215, 0, 0.2)', ambient2: 'rgba(0, 191, 255, 0.15)',
                customCss: `
                    @keyframes balloonFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
                    .search-box { border-radius: 50px; border: 2px solid #ffd700; box-shadow: 0 0 20px rgba(255,215,0,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:10%; left:12%; font-size:50px; opacity:0.3; animation: balloonFloat 4s infinite;">🎈</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:25%; font-size:45px; opacity:0.25; animation: balloonFloat 4.5s infinite 0.5s;">🎈</div>' },
                { type: 'html', content: '<div style="position:fixed; top:10%; right:12%; font-size:50px; opacity:0.3; animation: balloonFloat 4s infinite 0.3s;">🎈</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:25%; font-size:45px; opacity:0.25; animation: balloonFloat 4.5s infinite 0.8s;">🎈</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🍭</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🎮</div>' }
            ]
        },
        '07-01': { // 中国共产党建党节
            logo: { type: 'text', text: 'PARTY FOUNDING DAY', colors:['#ff0000', '#ffd700', '#ffffff', '#ffff00'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#ffffff', textMuted: '#ff9999', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.25)', ambient2: 'rgba(255, 215, 0, 0.2)',
                customCss: `
                    @keyframes flagWave { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                    .search-box { border: 2px solid #ffd700; box-shadow: 0 0 20px rgba(255,0,0,0.4); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:50px; opacity:0.3; transform-origin: left center; animation: flagWave 3s infinite;">🚩</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:50px; opacity:0.3; transform-origin: left center; animation: flagWave 3s infinite 0.5s;">🚩</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🎖️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">⭐</div>' }
            ]
        },
        '08-01': { // 中国人民解放军建军节
            logo: { type: 'text', text: 'ARMY DAY', colors:['#ff0000', '#006400', '#ffffff', '#ffd700'] }, 
            theme: { 
                bgBase: '#050a05', textMain: '#ffffff', textMuted: '#90ee90', accentRgb: '255, 0, 0', 
                avatarGrad1: '#004d00', avatarGrad2: '#ff0000', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(0, 100, 0, 0.15)',
                customCss: `
                    @keyframes starTwinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
                    .search-box { border: 2px solid #ffd700; box-shadow: 0 0 20px rgba(255,0,0,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.3; animation: starTwinkle 2s infinite;">⭐</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:45px; opacity:0.3; animation: starTwinkle 2s infinite 0.5s;">⭐</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🎖️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🪖</div>' }
            ]
        },
        '09-10': { // 中国教师节
            logo: { type: 'text', text: 'TEACHERS\' DAY', colors:['#ffd700', '#d4af37', '#ffffff', '#87ceeb'] }, 
            theme: { 
                bgBase: '#0a0500', textMain: '#fffce8', textMuted: '#d2b48c', accentRgb: '255, 215, 0', 
                avatarGrad1: '#b8860b', avatarGrad2: '#87ceeb', ambient1: 'rgba(255, 215, 0, 0.2)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    @keyframes bookFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: bookFloat 3s infinite;">📖</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: bookFloat 3.5s infinite 0.5s;">📚</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">✍️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🍎</div>' }
            ]
        },
        '10-01': { // 中华人民共和国国庆节
    logo: { 
        type: 'text', 
        text: '国庆快乐', 
        colors: [ '#eb0505', '#ff0000','#fff700', '#ffcc00'] 
    }, 
    theme: { 
        bgBase: '#1a0303', // 奢华暗红色背景，能更好地衬托前景发光效果
        textMain: '#ffffff', 
        textMuted: '#ffb3b3', 
        accentRgb: '238, 28, 37', // 严格使用标准国旗红 (China Red)
        avatarGrad1: '#EE1C25', 
        avatarGrad2: '#FFD700', // 国旗黄
        ambient1: 'rgba(238, 28, 37, 0.4)', 
        ambient2: 'rgba(255, 215, 0, 0.3)',
        customCss: `
            @keyframes flagWave { 
                0%, 100% { transform: rotate(-3deg) scale(1) translateY(0); } 
                50% { transform: rotate(3deg) scale(1.02) translateY(-5px); } 
            }
            @keyframes floatUp { 
                0% { transform: translateY(0) scale(0.8); opacity: 0; } 
                50% { opacity: 0.8; }
                100% { transform: translateY(-120px) scale(1.2); opacity: 0; } 
            }
            @keyframes pulseGlow {
                0%, 100% { box-shadow: 0 0 20px rgba(238,28,37,0.5), inset 0 0 10px rgba(255,215,0,0.1); }
                50% { box-shadow: 0 0 40px rgba(238,28,37,0.8), inset 0 0 20px rgba(255,215,0,0.3); }
            }
            .search-box { 
                border: 2px solid rgba(255, 215, 0, 0.6) !important; 
                animation: pulseGlow 3s infinite ease-in-out;
                background: rgba(40, 0, 0, 0.6) !important;
                backdrop-filter: blur(10px);
            }
            .search-box:hover {
                border-color: #FFDE00 !important;
            }
        `
    },
    extensions:[
        // 左上角：高精度 SVG 五星红旗 + 阴影与飘动动画
        { type: 'html', content: '<div style="position:fixed; top:8%; left:8%; z-index:-1; pointer-events:none; transform-origin: top left; animation: flagWave 4s ease-in-out infinite;"><svg width="150" height="100" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" style="box-shadow: 0 8px 25px rgba(238,28,37,0.7); border-radius: 4px;"><rect width="30" height="20" fill="#EE1C25"/><polygon fill="#FFDE00" points="5,2 5.9,4.8 8.8,4.8 6.5,6.5 7.4,9.4 5,7.6 2.6,9.4 3.5,6.5 1.2,4.8 4.1,4.8"/><polygon fill="#FFDE00" points="10,2 10.3,2.9 11.2,2.9 10.5,3.4 10.8,4.3 10,3.8 9.2,4.3 9.5,3.4 8.8,2.9 9.7,2.9" transform="rotate(23 10 3)"/><polygon fill="#FFDE00" points="12,4.5 12.3,5.4 13.2,5.4 12.5,5.9 12.8,6.8 12,6.3 11.2,6.8 11.5,5.9 10.8,5.4 11.7,5.4" transform="rotate(45 12 5.5)"/><polygon fill="#FFDE00" points="12,7.5 12.3,8.4 13.2,8.4 12.5,8.9 12.8,9.8 12,9.3 11.2,9.8 11.5,8.9 10.8,8.4 11.7,8.4" transform="rotate(68 12 8.5)"/><polygon fill="#FFDE00" points="10,10 10.3,10.9 11.2,10.9 10.5,11.4 10.8,12.3 10,11.8 9.2,12.3 9.5,11.4 8.8,10.9 9.7,10.9" transform="rotate(20 10 11)"/></svg></div>' },
        
        // 右上角：对称的 SVG 五星红旗，通过 0.5s 的延迟实现错落飘动
        // { type: 'html', content: '<div style="position:fixed; top:8%; right:8%; z-index:-1; pointer-events:none; transform-origin: top right; animation: flagWave 4s ease-in-out infinite 0.5s;"><svg width="150" height="100" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" style="box-shadow: 0 8px 25px rgba(238,28,37,0.7); border-radius: 4px;"><rect width="30" height="20" fill="#EE1C25"/><polygon fill="#FFDE00" points="5,2 5.9,4.8 8.8,4.8 6.5,6.5 7.4,9.4 5,7.6 2.6,9.4 3.5,6.5 1.2,4.8 4.1,4.8"/><polygon fill="#FFDE00" points="10,2 10.3,2.9 11.2,2.9 10.5,3.4 10.8,4.3 10,3.8 9.2,4.3 9.5,3.4 8.8,2.9 9.7,2.9" transform="rotate(23 10 3)"/><polygon fill="#FFDE00" points="12,4.5 12.3,5.4 13.2,5.4 12.5,5.9 12.8,6.8 12,6.3 11.2,6.8 11.5,5.9 10.8,5.4 11.7,5.4" transform="rotate(45 12 5.5)"/><polygon fill="#FFDE00" points="12,7.5 12.3,8.4 13.2,8.4 12.5,8.9 12.8,9.8 12,9.3 11.2,9.8 11.5,8.9 10.8,8.4 11.7,8.4" transform="rotate(68 12 8.5)"/><polygon fill="#FFDE00" points="10,10 10.3,10.9 11.2,10.9 10.5,11.4 10.8,12.3 10,11.8 9.2,12.3 9.5,11.4 8.8,10.9 9.7,10.9" transform="rotate(20 10 11)"/></svg></div>' },
        
        // 传统红灯笼与发光点缀
        { type: 'html', content: '<div style="position:fixed; top:28%; left:4%; font-size:45px; opacity:0.8; pointer-events:none; animation: flagWave 3s infinite 1s; filter: drop-shadow(0 0 10px red);">🏮</div>' },
        { type: 'html', content: '<div style="position:fixed; top:28%; right:4%; font-size:45px; opacity:0.8; pointer-events:none; animation: flagWave 3s infinite 1.5s; filter: drop-shadow(0 0 10px red);">🏮</div>' },
        
        // 底部升起的星光与烟花特效
        { type: 'html', content: '<div style="position:fixed; bottom:10%; left:20%; font-size:30px; opacity:0; pointer-events:none; animation: floatUp 4s ease-in infinite 0s;">✨</div>' },
        { type: 'html', content: '<div style="position:fixed; bottom:15%; right:25%; font-size:35px; opacity:0; pointer-events:none; animation: floatUp 5s ease-in infinite 2s;">🎆</div>' },
        
        // 背景中央超大低透明度国旗水印（增强页面纵深的国庆氛围）
        { type: 'html', content: '<div style="position:fixed; top:50%; left:50%; transform: translate(-50%, -50%); font-size:400px; opacity:0.02; pointer-events:none; filter: drop-shadow(0 0 50px red);">🇨🇳</div>' }
    ]
},
        '11-08': { // 中国记者节
            logo: { type: 'text', text: 'JOURNALISTS\' DAY', colors:['#4169e1', '#000000', '#ffffff', '#ffd700'] }, 
            theme: { 
                bgBase: '#05050a', textMain: '#ffffff', textMuted: '#b0c4de', accentRgb: '65, 105, 225', 
                avatarGrad1: '#000080', avatarGrad2: '#ffd700', ambient1: 'rgba(65, 105, 225, 0.2)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes micFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: micFloat 3s infinite;">🎤</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: micFloat 3.5s infinite 0.5s;">📷</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">📰</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">✍️</div>' }
            ]
        },
        '11-09': { // 中国消防宣传日
            logo: { type: 'text', text: 'FIRE CONTROL DAY', colors:['#ff0000', '#ff4500', '#ffffff', '#ffd700'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#ffffff', textMuted: '#ff9999', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ff4500', ambient1: 'rgba(255, 0, 0, 0.25)', ambient2: 'rgba(255, 69, 0, 0.2)',
                customCss: `
                    @keyframes fireFlicker { 0%, 100% { filter: brightness(1) drop-shadow(0 0 10px #ff4500); } 50% { filter: brightness(1.3) drop-shadow(0 0 25px #ff0000); } }
                    .search-box { border: 2px solid #ff0000; box-shadow: 0 0 20px rgba(255,0,0,0.4); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.3; animation: fireFlicker 0.8s infinite;">🔥</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:45px; opacity:0.3; animation: fireFlicker 1s infinite 0.2s;">🔥</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🚒</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🚨</div>' }
            ]
        },
        '12-13': { // 南京大屠杀死难者国家公祭日
            logo: { type: 'text', text: 'NATIONAL MEMORIAL DAY', colors:['#ffffff', '#b0c4de', '#000000', '#808080'] }, 
            theme: { 
                bgBase: '#000000', textMain: '#ffffff', textMuted: '#808080', accentRgb: '255, 255, 255', 
                avatarGrad1: '#000000', avatarGrad2: '#808080', ambient1: 'rgba(255, 255, 255, 0.1)', ambient2: 'rgba(128, 128, 128, 0.05)',
                customCss: `
                    .search-box { border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.03); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:50%; transform: translateX(-50%); font-size:50px; opacity:0.2;">🕊️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.15;">🕯️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.15;">🕯️</div>' }
            ]
        },

        // ==============================================
        // 【第三类：国际官方纪念日 补充大全】
        // ==============================================
        '02-02': { // 世界湿地日
            logo: { type: 'text', text: 'WORLD WETLANDS DAY', colors:['#2e8b57', '#32cd32', '#87ceeb', '#ffffff'] }, 
            theme: { 
                bgBase: '#05100a', textMain: '#e6ffe6', textMuted: '#90ee90', accentRgb: '46, 139, 87', 
                avatarGrad1: '#006400', avatarGrad2: '#87ceeb', ambient1: 'rgba(46, 139, 87, 0.2)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    @keyframes reedSway { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:15%; font-size:50px; transform-origin: bottom center; opacity:0.25; animation: reedSway 4s infinite;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:75%; font-size:50px; transform-origin: bottom center; opacity:0.25; animation: reedSway 4.5s infinite 0.5s;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:40px; opacity:0.2;">🦆</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🌊</div>' }
            ]
        },
        '02-04': { // 世界癌症日
            logo: { type: 'text', text: 'WORLD CANCER DAY', colors:['#ff0000', '#ffffff', '#ffb3ba', '#ffd700'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#ffffff', textMuted: '#ffb3ba', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes ribbonFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25; animation: ribbonFloat 3s infinite;">🎗️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">❤️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🤍</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🏥</div>' }
            ]
        },
        '04-07': { // 世界卫生日
            logo: { type: 'text', text: 'WORLD HEALTH DAY', colors:['#00bfff', '#4169e1', '#ffffff', '#98fb98'] }, 
            theme: { 
                bgBase: '#020a14', textMain: '#e6f2ff', textMuted: '#add8e6', accentRgb: '0, 191, 255', 
                avatarGrad1: '#000080', avatarGrad2: '#98fb98', ambient1: 'rgba(0, 191, 255, 0.2)', ambient2: 'rgba(152, 251, 152, 0.15)',
                customCss: `
                    @keyframes heartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25; animation: heartbeat 1.5s infinite;">❤️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🩺</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🧼</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">💊</div>' }
            ]
        },
        '04-22': { // 世界地球日
            logo: { type: 'text', text: 'WORLD EARTH DAY', colors:['#228b22', '#32cd32', '#00bfff', '#ffffff'] }, 
            theme: { 
                bgBase: '#05100a', textMain: '#e6ffe6', textMuted: '#90ee90', accentRgb: '34, 139, 34', 
                avatarGrad1: '#006400', avatarGrad2: '#00bfff', ambient1: 'rgba(34, 139, 34, 0.2)', ambient2: 'rgba(0, 191, 255, 0.15)',
                customCss: `
                    @keyframes earthSpin { 100% { transform: rotate(360deg); } }
                    @keyframes leafSway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:50%; transform: translateX(-50%); font-size:80px; opacity:0.2; animation: earthSpin 20s linear infinite;">🌍</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:40px; opacity:0.2; animation: leafSway 3s infinite;">🌳</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">♻️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:40px; opacity:0.2;">🌊</div>' }
            ]
        },
        
        '06-05': { // 世界环境日
            logo: { type: 'text', text: 'WORLD ENVIRONMENT DAY', colors:['#00ff00', '#32cd32', '#00bfff', '#ffffff'] }, 
            theme: { 
                bgBase: '#051005', textMain: '#f0fff0', textMuted: '#90ee90', accentRgb: '0, 255, 0', 
                avatarGrad1: '#006400', avatarGrad2: '#00bfff', ambient1: 'rgba(0, 255, 0, 0.2)', ambient2: 'rgba(0, 191, 255, 0.15)',
                customCss: `
                    @keyframes leafFloat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: leafFloat 4s infinite;">🍃</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: leafFloat 4.5s infinite 0.5s;">🌿</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:50%; transform: translateX(-50%); font-size:80px; opacity:0.2;">🌍</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">♻️</div>' }
            ]
        },
        '06-08': { // 世界海洋日
            logo: { type: 'text', text: 'WORLD OCEANS DAY', colors:['#00bfff', '#1e90ff', '#ffffff', '#4682b4'] }, 
            theme: { 
                bgBase: '#000b1a', textMain: '#e6f2ff', textMuted: '#87cefa', accentRgb: '0, 191, 255', 
                avatarGrad1: '#000080', avatarGrad2: '#00bfff', ambient1: 'rgba(0, 191, 255, 0.2)', ambient2: 'rgba(30, 144, 255, 0.15)',
                customCss: `
                    @keyframes waveMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                    .omni-wave { position: fixed; bottom: 0; left: 0; width: 200%; height: 80px; background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C342.1,32.17,407.79,44.38,475.49,46.29c69.35,2,138.7-11.93,209.4-30.86,70.1-18.79,141.5-28.85,212.1-28.85,70.6,0,142,10.06,212.1,28.85,70.7,18.93,140,32.86,209.4,30.86,67.7-1.91,133.39-14.12,200-20.58,54.41-5.37,110.21-15.34,158-37.5V0Z" fill="rgba(0,191,255,0.1)"/></svg>'); background-size: 50% 100%; animation: waveMove 10s linear infinite; opacity: 0.5; pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: '<div class="omni-wave"></div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.2;">🌊</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🐬</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🐳</div>' }
            ]
        },
        '06-26': { // 国际禁毒日
            logo: { type: 'text', text: 'INTERNATIONAL DAY AGAINST DRUG ABUSE', colors:['#ff0000', '#ffffff', '#000000', '#ffd700'] }, 
            theme: { 
                bgBase: '#000000', textMain: '#ffffff', textMuted: '#ff9999', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes noSign { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.4; } }
                    .search-box { border: 2px solid #ff0000; box-shadow: 0 0 20px rgba(255,0,0,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:50%; transform: translateX(-50%); font-size:50px; opacity:0.3; animation: noSign 3s infinite;">🚫</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">❤️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">👮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🏥</div>' }
            ]
        },
        '09-27': { // 世界旅游日
            logo: { type: 'text', text: 'WORLD TOURISM DAY', colors:['#ff8c00', '#ffd700', '#00bfff', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a0f14', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 140, 0', 
                avatarGrad1: '#ff4500', avatarGrad2: '#00bfff', ambient1: 'rgba(255, 140, 0, 0.2)', ambient2: 'rgba(0, 191, 255, 0.15)',
                customCss: `
                    @keyframes planeFly { 0% { transform: translateX(-10vw) translateY(0); } 100% { transform: translateX(110vw) translateY(-20px); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:-10%; font-size:45px; opacity:0.25; animation: planeFly 20s linear infinite;">✈️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:30%; left:-10%; font-size:40px; opacity:0.2; animation: planeFly 25s linear infinite 5s;">✈️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🧳</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🗺️</div>' }
            ]
        },
        '10-04': { // 世界动物日
            logo: { type: 'text', text: 'WORLD ANIMAL DAY', colors:['#8b4513', '#d2691e', '#98fb98', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a0500', textMain: '#f5deb3', textMuted: '#d2b48c', accentRgb: '139, 69, 19', 
                avatarGrad1: '#3e1f00', avatarGrad2: '#98fb98', ambient1: 'rgba(139, 69, 19, 0.15)', ambient2: 'rgba(152, 251, 152, 0.15)',
                customCss: `
                    @keyframes animalHop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: animalHop 3s infinite;">🐘</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: animalHop 3.5s infinite 0.5s;">🦁</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🐯</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🐼</div>' }
            ]
        },
        '12-10': { // 世界人权日
            logo: { type: 'text', text: 'HUMAN RIGHTS DAY', colors:['#4169e1', '#ffffff', '#ffd700', '#000000'] }, 
            theme: { 
                bgBase: '#020514', textMain: '#ffffff', textMuted: '#b0c4de', accentRgb: '65, 105, 225', 
                avatarGrad1: '#000080', avatarGrad2: '#ffd700', ambient1: 'rgba(65, 105, 225, 0.2)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes scalePulse { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.4; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:50%; transform: translateX(-50%); font-size:50px; opacity:0.3; animation: scalePulse 3s infinite;">⚖️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🤍</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🕊️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">✊</div>' }
            ]
        },

        // ==============================================
        // 【第四类：行业/职业/网络潮流节日】
        // ==============================================
        '03-07': { // 女生节
            logo: { type: 'text', text: 'GIRLS\' DAY', colors:['#ff69b4', '#ffb6c1', '#ffffff', '#ffd700'] }, 
            theme: { 
                bgBase: '#10050a', textMain: '#fff0f5', textMuted: '#ffb6c1', accentRgb: '255, 105, 180', 
                avatarGrad1: '#c71585', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 105, 180, 0.25)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes flowerBloom { 0%, 100% { transform: scale(1); opacity: 0.25; } 50% { transform: scale(1.1); opacity: 0.35; } }
                    .search-box { border: 1px solid rgba(255,105,180,0.4); box-shadow: 0 0 20px rgba(255,105,180,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: flowerBloom 3s infinite;">🌸</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:45px; opacity:0.25; animation: flowerBloom 3s infinite 0.5s;">💐</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">✨</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">❤️</div>' }
            ]
        },
        // '03-14': { // 白色情人节
        //     logo: { type: 'text', text: 'WHITE DAY', colors:['#ffffff', '#ffb6c1', '#ff69b4', '#ffd700'] }, 
        //     theme: { 
        //         bgBase: '#050214', textMain: '#ffffff', textMuted: '#ffb6c1', accentRgb: '255, 255, 255', 
        //         avatarGrad1: '#800080', avatarGrad2: '#ff69b4', ambient1: 'rgba(255, 255, 255, 0.2)', ambient2: 'rgba(255, 105, 180, 0.15)',
        //         customCss: `
        //             @keyframes heartFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        //             .search-box { border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 0 20px rgba(255,105,180,0.3); }
        //         `
        //     },
        //     extensions:[
        //         { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: heartFloat 3s infinite;">❤️</div>' },
        //         { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: heartFloat 3.5s infinite 0.5s;">🤍</div>' },
        //         { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🍫</div>' },
        //         { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">💐</div>' }
        //     ]
        // },
        '05-20': { // 520表白日
            logo: { type: 'text', text: '520 LOVE DAY', colors:['#ff0000', '#ff69b4', '#ffffff', '#ffd700'] }, 
            theme: { 
                bgBase: '#0a0005', textMain: '#fff0f5', textMuted: '#ffb6c1', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ff69b4', ambient1: 'rgba(255, 0, 0, 0.25)', ambient2: 'rgba(255, 105, 180, 0.2)',
                customCss: `
                    @keyframes heartbeat { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.3); } 30% { transform: scale(1); } 45% { transform: scale(1.15); } 60% { transform: scale(1); } }
                    .search-box { border: 2px solid #ff69b4; border-radius: 50px; box-shadow: 0 0 30px rgba(255,0,0,0.4); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: heartbeat 1.5s infinite;">❤️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:45px; opacity:0.25; animation: heartbeat 1.5s infinite 0.5s;">❤️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">💐</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">💍</div>' }
            ]
        },
        '10-24': { // 1024程序员节
            logo: { type: 'text', text: '1024 PROGRAMMERS DAY', colors:['#00ff00', '#000000', '#ffffff', '#4169e1'] }, 
            theme: { 
                bgBase: '#000000', textMain: '#00ff00', textMuted: '#808080', accentRgb: '0, 255, 0', 
                avatarGrad1: '#000000', avatarGrad2: '#00ff00', ambient1: 'rgba(0, 255, 0, 0.2)', ambient2: 'rgba(65, 105, 225, 0.1)',
                customCss: `
                    @keyframes codeBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                    .search-box { border: 1px solid #00ff00; background: rgba(0,255,0,0.03); box-shadow: 0 0 20px rgba(0,255,0,0.3); }
                    .search-input { color: #00ff00; font-family: monospace; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; font-family: monospace; animation: codeBlink 1s infinite;">01</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:45px; opacity:0.25; font-family: monospace; animation: codeBlink 1s infinite 0.5s;">10</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">💻</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">☕</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🐛</div>' }
            ]
        },
        // '11-11': { // 双11购物节
        //     logo: { type: 'text', text: '11.11 SHOPPING FESTIVAL', colors:['#ff0000', '#ffd700', '#ffffff', '#ffa500'] }, 
        //     theme: { 
        //         bgBase: '#0a0000', textMain: '#ffffff', textMuted: '#ffb347', accentRgb: '255, 0, 0', 
        //         avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.25)', ambient2: 'rgba(255, 215, 0, 0.2)',
        //         customCss: `
        //             @keyframes giftFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        //             .search-box { border: 2px solid #ffd700; box-shadow: 0 0 30px rgba(255,0,0,0.4); }
        //         `
        //     },
        //     extensions:[
        //         { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: giftFloat 3s infinite;">🎁</div>' },
        //         { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:45px; opacity:0.25; animation: giftFloat 3s infinite 0.5s;">🛍️</div>' },
        //         { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">💰</div>' },
        //         { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🚚</div>' }
        //     ]
        // },
        '10-31': { // 万圣节
            logo: { type: 'text', text: 'HALLOWEEN', colors:['#ea580c', '#7c3aed', '#1e1b4b', '#f97316'] }, 
            theme: { 
                bgBase: '#000000', textMain: '#ffa500', textMuted: '#ffb347', accentRgb: '255, 140, 0', 
                avatarGrad1: '#000000', avatarGrad2: '#ff8c00', ambient1: 'rgba(255, 140, 0, 0.25)', ambient2: 'rgba(255, 69, 0, 0.2)',
                customCss: `
                    @keyframes pumpkinBlink { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
                    @keyframes ghostFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                    .search-box { border: 2px solid #ff8c00; box-shadow: 0 0 20px rgba(255,140,0,0.4); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:50px; opacity:0.3; animation: pumpkinBlink 2s infinite;">🎃</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:50px; opacity:0.3; animation: pumpkinBlink 2s infinite 0.5s;">🎃</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25; animation: ghostFloat 3s infinite;">👻</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🦇</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🕷️</div>' }
            ]
        },
        // '12-24': { // 平安夜
        //     logo: { type: 'text', text: 'CHRISTMAS EVE', colors:['#ff0000', '#008000', '#ffffff', '#ffd700'] }, 
        //     theme: { 
        //         bgBase: '#051005', textMain: '#ffffff', textMuted: '#90ee90', accentRgb: '255, 0, 0', 
        //         avatarGrad1: '#006400', avatarGrad2: '#ff0000', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(0, 128, 0, 0.15)',
        //         customCss: `
        //             @keyframes snowFall { 0% { transform: translateY(-10vh); opacity: 0; } 10% { opacity: 0.7; } 100% { transform: translateY(110vh); opacity: 0; } }
        //             .search-box { border: 2px solid #ffd700; border-radius: 50px; box-shadow: 0 0 20px rgba(255,0,0,0.3); }
        //         `
        //     },
        //     extensions:[
        //         { type: 'html', content: '<div style="position:fixed; left:15%; font-size:18px; opacity:0; animation: snowFall 12s linear infinite 0s;">❄️</div>' },
        //         { type: 'html', content: '<div style="position:fixed; left:35%; font-size:22px; opacity:0; animation: snowFall 15s linear infinite 2s;">❄️</div>' },
        //         { type: 'html', content: '<div style="position:fixed; left:55%; font-size:16px; opacity:0; animation: snowFall 13s linear infinite 1s;">❄️</div>' },
        //         { type: 'html', content: '<div style="position:fixed; left:75%; font-size:20px; opacity:0; animation: snowFall 14s linear infinite 3s;">❄️</div>' },
        //         { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🎄</div>' },
        //         { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.25;">🔔</div>' }
        //     ]
        // },
        '12-25': { // 圣诞节
            logo: { type: 'text', text: 'CHRISTMAS', colors:['#b91c1c', '#166534', '#f8fafc', '#ca8a04'] }, 
            theme: { 
                bgBase: '#051005', textMain: '#ffffff', textMuted: '#90ee90', accentRgb: '255, 0, 0', 
                avatarGrad1: '#006400', avatarGrad2: '#ff0000', ambient1: 'rgba(255, 0, 0, 0.25)', ambient2: 'rgba(0, 128, 0, 0.2)',
                customCss: `
                    @keyframes snowFallHeavy { 0% { transform: translateY(-10vh) translateX(0); opacity: 0; } 10% { opacity: 0.8; } 100% { transform: translateY(110vh) translateX(20px); opacity: 0; } }
                    .search-box { border: 2px solid #ffd700; box-shadow: 0 0 30px rgba(255,0,0,0.4); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; left:10%; font-size:20px; opacity:0; animation: snowFallHeavy 10s linear infinite 0s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:30%; font-size:24px; opacity:0; animation: snowFallHeavy 12s linear infinite 2s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:50%; font-size:18px; opacity:0; animation: snowFallHeavy 9s linear infinite 1s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:70%; font-size:22px; opacity:0; animation: snowFallHeavy 11s linear infinite 0.5s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:90%; font-size:26px; opacity:0; animation: snowFallHeavy 13s linear infinite 3s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:50%; transform: translateX(-50%); font-size:80px; opacity:0.2;">🎄</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🎁</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.25;">🎅</div>' }
            ]
        },

        // --- 新增节日主题 ---
        'L01-01': { 
            logo: { type: 'text', text: 'GONG XI FA CAI', colors:['#dc2626', '#fbbf24', '#ea580c', '#fef3c7'] }, 
            theme: { 
                bgBase: '#1a0000', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.25)', ambient2: 'rgba(255, 215, 0, 0.2)',
                customCss: `
                    @keyframes firework { 0% { transform: scale(0); opacity: 1; } 50% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
                    .omni-firework { position: fixed; width: 4px; height: 4px; background: #ffd700; border-radius: 50%; box-shadow: 0 0 10px #ffd700; pointer-events: none; z-index: 0; }
                    .search-box { border: 2px solid #ffd700; box-shadow: 0 0 25px rgba(255, 215, 0, 0.3); }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-firework" style="top: 20%; left: 20%; animation: firework 2s ease-out infinite 0s;"></div>
                    <div class="omni-firework" style="top: 15%; left: 50%; animation: firework 2.5s ease-out infinite 0.5s;"></div>
                    <div class="omni-firework" style="top: 25%; left: 80%; animation: firework 2s ease-out infinite 1s;"></div>
                    <div class="omni-firework" style="top: 10%; left: 35%; animation: firework 2.5s ease-out infinite 1.5s;"></div>
                    <div class="omni-firework" style="top: 18%; left: 65%; animation: firework 2s ease-out infinite 0.8s;"></div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:10%; font-size:40px; opacity:0.2;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:35px; opacity:0.15;">🧧</div>' }
            ]
        },
        'L01-15': { 
            logo: { type: 'text', text: 'LANTERN FESTIVAL', colors:['#ff4500', '#ffd700', '#ff6347', '#ffff00'] }, 
            theme: { 
                bgBase: '#1a0500', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 69, 0', 
                avatarGrad1: '#ff4500', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 69, 0, 0.2)', ambient2: 'rgba(255, 215, 0, 0.15)',
                customCss: `
                    @keyframes lanternFloat { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-10px) rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:10%; left:15%; font-size:45px; opacity:0.25; animation: lanternFloat 3s ease-in-out infinite;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:20%; font-size:40px; opacity:0.2; animation: lanternFloat 3.5s ease-in-out infinite 0.5s;">🎐</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:25%; font-size:35px; opacity:0.18;">🥮</div>' }
            ]
        },
        '03-08': { 
            logo: { type: 'text', text: 'WOMEN POWER', colors:['#ff69b4', '#ff1493', '#db7093', '#ffc0cb'] }, 
            theme: { 
                bgBase: '#1a0a10', textMain: '#ffe6f0', textMuted: '#ffb6c1', accentRgb: '255, 105, 180', 
                avatarGrad1: '#c71585', avatarGrad2: '#ff69b4', ambient1: 'rgba(255, 105, 180, 0.2)', ambient2: 'rgba(255, 182, 193, 0.15)',
                customCss: `
                    @keyframes floatFlower { 0% { transform: translateY(-10vh) rotate(0deg) scale(var(--s, 1)); opacity: 0; } 10% { opacity: var(--o, 0.8); } 90% { opacity: var(--o, 0.8); } 100% { transform: translateY(110vh) rotate(var(--r, 360deg)) scale(var(--s, 1)); opacity: 0; } }
                    .omni-flower { position: fixed; top: -10vh; width: 20px; height: 20px; background: radial-gradient(circle, #ffc0cb 30%, #ff69b4 100%); border-radius: 50% 0 50% 50%; box-shadow: 0 0 10px rgba(255, 105, 180, 0.4); pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-flower" style="left: 8%; --s: 0.8; --r: 180deg; --o: 0.7; animation: floatFlower 13s linear infinite 0s;"></div>
                    <div class="omni-flower" style="left: 22%; --s: 1.2; --r: -180deg; --o: 0.9; animation: floatFlower 15s linear infinite 2s;"></div>
                    <div class="omni-flower" style="left: 40%; --s: 0.9; --r: 360deg; --o: 0.6; animation: floatFlower 11s linear infinite 1s;"></div>
                    <div class="omni-flower" style="left: 58%; --s: 1.5; --r: -360deg; --o: 0.8; animation: floatFlower 16s linear infinite 4s;"></div>
                    <div class="omni-flower" style="left: 75%; --s: 0.7; --r: 180deg; --o: 0.5; animation: floatFlower 12s linear infinite 3s;"></div>
                    <div class="omni-flower" style="left: 92%; --s: 1.1; --r: -180deg; --o: 0.9; animation: floatFlower 14s linear infinite 5s;"></div>
                `}
            ]
        },
        '04-04': { 
            logo: { type: 'text', text: 'MEMORY & HOPE', colors:['#2e8b57', '#3cb371', '#90ee90', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a1510', textMain: '#e6f5e6', textMuted: '#98fb98', accentRgb: '46, 139, 87', 
                avatarGrad1: '#2e8b57', avatarGrad2: '#90ee90', ambient1: 'rgba(46, 139, 87, 0.15)', ambient2: 'rgba(144, 238, 144, 0.1)',
                customCss: `
                    @keyframes rainDrop { 0% { transform: translateY(-10vh) scale(var(--s, 1)); opacity: 0; } 10% { opacity: var(--o, 0.6); } 100% { transform: translateY(110vh) scale(var(--s, 1)); opacity: 0; } }
                    .omni-raindrop { position: fixed; top: -10vh; width: 2px; height: 15px; background: linear-gradient(to bottom, transparent, #90ee90); border-radius: 0 0 50% 50%; box-shadow: 0 0 5px rgba(144, 238, 144, 0.5); pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-raindrop" style="left: 10%; --s: 1; --o: 0.5; animation: rainDrop 8s linear infinite 0s;"></div>
                    <div class="omni-raindrop" style="left: 25%; --s: 0.8; --o: 0.4; animation: rainDrop 10s linear infinite 1s;"></div>
                    <div class="omni-raindrop" style="left: 40%; --s: 1.2; --o: 0.6; animation: rainDrop 9s linear infinite 2s;"></div>
                    <div class="omni-raindrop" style="left: 55%; --s: 0.9; --o: 0.3; animation: rainDrop 11s linear infinite 0.5s;"></div>
                    <div class="omni-raindrop" style="left: 70%; --s: 1.1; --o: 0.5; animation: rainDrop 8.5s linear infinite 1.5s;"></div>
                    <div class="omni-raindrop" style="left: 85%; --s: 1; --o: 0.4; animation: rainDrop 10.5s linear infinite 3s;"></div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:5%; font-size:35px; opacity:0.2; transform: rotate(10deg);">🌿</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:8%; font-size:30px; opacity:0.15;">🍃</div>' }
            ]
        },
        '04-22': { 
            logo: { type: 'text', text: 'EARTH DAY', colors:['#228b22', '#00bfff', '#32cd32', '#87ceeb'] }, 
            theme: { 
                bgBase: '#051005', textMain: '#e6ffe6', textMuted: '#90ee90', accentRgb: '34, 139, 34', 
                avatarGrad1: '#228b22', avatarGrad2: '#00bfff', ambient1: 'rgba(34, 139, 34, 0.2)', ambient2: 'rgba(0, 191, 255, 0.15)',
                customCss: `
                    @keyframes earthSpin { 100% { transform: rotate(360deg); } }
                    .search-box { border: 1px solid rgba(34, 139, 34, 0.3); box-shadow: 0 0 15px rgba(34, 139, 34, 0.1); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:10%; font-size:45px; opacity:0.2; animation: earthSpin 20s linear infinite;">🌍</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; right:12%; font-size:35px; opacity:0.15;">🌱</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:8%; font-size:30px; opacity:0.1;">🌿</div>' }
            ]
        },
        
        '05-12': { 
            logo: { type: 'text', text: 'MOM’S LOVE', colors:['#ffb6c1', '#ff69b4', '#fff0f5', '#ffc0cb'] }, 
            theme: { 
                bgBase: '#1a0a0f', textMain: '#ffe6f0', textMuted: '#ffb6c1', accentRgb: '255, 182, 193', 
                avatarGrad1: '#ff69b4', avatarGrad2: '#ffc0cb', ambient1: 'rgba(255, 182, 193, 0.2)', ambient2: 'rgba(255, 105, 180, 0.15)',
                customCss: `
                    @keyframes floatHeart { 0% { transform: translateY(-10vh) scale(var(--s, 1)); opacity: 0; } 10% { opacity: var(--o, 0.8); } 90% { opacity: var(--o, 0.8); } 100% { transform: translateY(110vh) scale(var(--s, 1)); opacity: 0; } }
                    .omni-heart { position: fixed; top: -10vh; width: 18px; height: 18px; background: #ff69b4; transform: rotate(-45deg); box-shadow: 0 0 10px rgba(255, 105, 180, 0.4); pointer-events: none; z-index: 0; }
                    .omni-heart::before, .omni-heart::after { content: ''; position: absolute; width: 18px; height: 18px; background: #ff69b4; border-radius: 50%; }
                    .omni-heart::before { top: -9px; left: 0; }
                    .omni-heart::after { left: 9px; top: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-heart" style="left: 12%; --s: 0.8; --o: 0.7; animation: floatHeart 14s linear infinite 0s;"></div>
                    <div class="omni-heart" style="left: 28%; --s: 1.2; --o: 0.9; animation: floatHeart 16s linear infinite 2s;"></div>
                    <div class="omni-heart" style="left: 45%; --s: 0.9; --o: 0.6; animation: floatHeart 12s linear infinite 1s;"></div>
                    <div class="omni-heart" style="left: 62%; --s: 1.5; --o: 0.8; animation: floatHeart 17s linear infinite 4s;"></div>
                    <div class="omni-heart" style="left: 78%; --s: 0.7; --o: 0.5; animation: floatHeart 13s linear infinite 3s;"></div>
                    <div class="omni-heart" style="left: 92%; --s: 1.1; --o: 0.9; animation: floatHeart 15s linear infinite 5s;"></div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:10%; font-size:35px; opacity:0.2;">💐</div>' }
            ]
        },
        'L05-05': { 
            logo: { type: 'text', text: 'DRAGON BOAT', colors:['#22c55e', '#4ade80', '#f0fdf4', '#fbbf24'] }, 
            theme: { 
                bgBase: '#051015', textMain: '#e0f7fa', textMuted: '#80deea', accentRgb: '0, 206, 209', 
                avatarGrad1: '#008b8b', avatarGrad2: '#00ced1', ambient1: 'rgba(0, 206, 209, 0.2)', ambient2: 'rgba(32, 178, 170, 0.15)',
                customCss: `
                    @keyframes waveMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                    .omni-wave { position: fixed; bottom: 0; left: 0; width: 200%; height: 80px; background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C342.1,32.17,407.79,44.38,475.49,46.29c69.35,2,138.7-11.93,209.4-30.86,70.1-18.79,141.5-28.85,212.1-28.85,70.6,0,142,10.06,212.1,28.85,70.7,18.93,140,32.86,209.4,30.86,67.7-1.91,133.39-14.12,200-20.58,54.41-5.37,110.21-15.34,158-37.5V0Z" fill="rgba(0,206,209,0.1)"/></svg>'); background-size: 50% 100%; animation: waveMove 10s linear infinite; opacity: 0.5; pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: '<div class="omni-wave"></div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:8%; font-size:40px; opacity:0.2;">🛶</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:10%; font-size:35px; opacity:0.15;">🍙</div>' }
            ]
        },
        'L07-07': { 
            logo: { type: 'text', text: 'QIXI LOVE', colors:['#9370db', '#ba55d3', '#da70d6', '#ffb6c1'] }, 
            theme: { 
                bgBase: '#0a0515', textMain: '#f0e6fa', textMuted: '#c9a0dc', accentRgb: '147, 112, 219', 
                avatarGrad1: '#8a2be2', avatarGrad2: '#da70d6', ambient1: 'rgba(147, 112, 219, 0.2)', ambient2: 'rgba(186, 85, 211, 0.15)',
                customCss: `
                    .ambient-bg { background: radial-gradient(ellipse at top, rgba(138, 43, 226, 0.2) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(218, 112, 214, 0.15) 0%, transparent 50%); filter: none; }
                    @keyframes twinkle { 0%, 100% { opacity: var(--o, 0.5); } 50% { opacity: 1; } }
                    .omni-star { position: fixed; width: 4px; height: 4px; background: #fff; border-radius: 50%; box-shadow: 0 0 10px #fff; pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-star" style="top: 10%; left: 15%; --o: 0.6; animation: twinkle 3s ease-in-out infinite 0s;"></div>
                    <div class="omni-star" style="top: 20%; left: 40%; --o: 0.8; animation: twinkle 4s ease-in-out infinite 1s;"></div>
                    <div class="omni-star" style="top: 15%; left: 65%; --o: 0.5; animation: twinkle 3.5s ease-in-out infinite 0.5s;"></div>
                    <div class="omni-star" style="top: 25%; left: 85%; --o: 0.7; animation: twinkle 4.5s ease-in-out infinite 1.5s;"></div>
                    <div class="omni-star" style="top: 8%; left: 55%; --o: 0.6; animation: twinkle 3s ease-in-out infinite 2s;"></div>
                `},
                { type: 'html', content: '<div style="position:fixed; top:30%; left:50%; transform: translateX(-50%); font-size:50px; opacity:0.1;">🌉</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:12%; font-size:35px; opacity:0.15;">⭐</div>' }
            ]
        },
        '09-10': { 
            logo: { type: 'text', text: 'THANK YOU TEACHER', colors:['#4169e1', '#2e8b57', '#87ceeb', '#90ee90'] }, 
            theme: { 
                bgBase: '#050a15', textMain: '#e6f0ff', textMuted: '#87ceeb', accentRgb: '65, 105, 225', 
                avatarGrad1: '#4169e1', avatarGrad2: '#90ee90', ambient1: 'rgba(65, 105, 225, 0.15)', ambient2: 'rgba(144, 238, 144, 0.1)',
                customCss: `
                    .search-box { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(65, 105, 225, 0.3); box-shadow: 0 0 15px rgba(65, 105, 225, 0.1); }
                    .text-logo { text-shadow: 0 0 10px rgba(65, 105, 225, 0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:10%; font-size:40px; opacity:0.2;">📚</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:8%; font-size:35px; opacity:0.15;">✏️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:10%; right:15%; font-size:30px; opacity:0.1;">🕯️</div>' }
            ]
        },
        'L08-15': { 
            logo: { type: 'text', text: 'MOCAKE FESTIVAL', colors:['#ffd700', '#daa520', '#b8860b', '#ffffff'] }, 
            theme: { 
                bgBase: '#050515', textMain: '#fffce8', textMuted: '#daa520', accentRgb: '255, 215, 0', 
                avatarGrad1: '#b8860b', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 215, 0, 0.2)', ambient2: 'rgba(218, 165, 32, 0.15)',
                customCss: `
                    .ambient-bg { background: radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.3) 0%, transparent 40%); filter: none; }
                    @keyframes moonGlow { 0%, 100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); } 50% { box-shadow: 0 0 50px rgba(255, 215, 0, 0.8); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:10%; right:15%; width:80px; height:80px; background: radial-gradient(circle, #fffce8 0%, #ffd700 100%); border-radius:50%; animation: moonGlow 4s ease-in-out infinite; opacity:0.6;"></div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:12%; font-size:40px; opacity:0.2;">🥮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; left:8%; font-size:35px; opacity:0.15;">🐰</div>' }
            ]
        },
        // --- 补充的中国传统节日/节气 ---
        
        'L02-02': { 
            logo: { type: 'text', text: 'DRAGON RISES', colors:['#00ffff', '#00bfff', '#1e90ff', '#87cefa'] }, 
            theme: { 
                bgBase: '#020b14', textMain: '#e6f7ff', textMuted: '#87cefa', accentRgb: '0, 191, 255', 
                avatarGrad1: '#00008b', avatarGrad2: '#00bfff', ambient1: 'rgba(0, 191, 255, 0.2)', ambient2: 'rgba(30, 144, 255, 0.15)',
                customCss: `
                    @keyframes cloudFloat { 0% { transform: translateX(110vw); } 100% { transform: translateX(-10vw); } }
                    .search-box { box-shadow: 0 0 20px rgba(0, 191, 255, 0.2); border-color: rgba(0, 191, 255, 0.4); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; right:-10%; font-size:55px; opacity:0.15; animation: cloudFloat 20s linear infinite;">🐉</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; left:-10%; font-size:45px; opacity:0.1; animation: cloudFloat 25s linear infinite 5s;">☁️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:-10%; font-size:35px; opacity:0.15; animation: cloudFloat 22s linear infinite 10s;">🌧️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:10%; font-size:35px; opacity:0.2;">💇‍♂️</div>' } // 剃龙头
            ]
        },
        'L03-03': { 
            logo: { type: 'text', text: 'SHANGSI FESTIVAL', colors:['#ffb7c5', '#ff9eaa', '#98fb98', '#ffffff'] }, 
            theme: { 
                bgBase: '#0d1a12', textMain: '#f0fdf4', textMuted: '#bbf7d0', accentRgb: '134, 239, 172', 
                avatarGrad1: '#22c55e', avatarGrad2: '#ff9eaa', ambient1: 'rgba(34, 197, 94, 0.15)', ambient2: 'rgba(255, 158, 170, 0.15)',
                customCss: `
                    @keyframes kiteSway { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-15px) rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:15%; font-size:40px; opacity:0.25; animation: kiteSway 4s ease-in-out infinite;">🪁</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:10%; font-size:45px; opacity:0.2;">🌸</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:35px; opacity:0.15;">🦋</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:20%; font-size:40px; opacity:0.15;">🌿</div>' } // 踏青
            ]
        },
        'L07-15': { 
            logo: { type: 'text', text: 'SPIRIT FESTIVAL', colors:['#9370db', '#8a2be2', '#4b0082', '#ff8c00'] }, 
            theme: { 
                bgBase: '#05020a', textMain: '#e6e6fa', textMuted: '#9370db', accentRgb: '147, 112, 219', 
                avatarGrad1: '#4b0082', avatarGrad2: '#ff8c00', ambient1: 'rgba(75, 0, 130, 0.25)', ambient2: 'rgba(255, 140, 0, 0.1)',
                customCss: `
                    @keyframes floatLantern { 0% { transform: translateY(0) scale(1) translateX(0); opacity: 0; } 20% { opacity: 0.7; } 80% { opacity: 0.7; } 100% { transform: translateY(-50vh) scale(0.8) translateX(20px); opacity: 0; } }
                    .omni-lotus { position: fixed; bottom: 5vh; filter: drop-shadow(0 0 10px rgba(255, 140, 0, 0.8)); pointer-events: none; z-index: 0; font-size: 28px; }
                `
            },
            extensions:[
                { type: 'html', content: '<div class="omni-lotus" style="left: 20%; animation: floatLantern 14s ease-in infinite 0s;">🪷</div>' },
                { type: 'html', content: '<div class="omni-lotus" style="left: 50%; font-size: 35px; animation: floatLantern 18s ease-in infinite 4s;">🪷</div>' },
                { type: 'html', content: '<div class="omni-lotus" style="left: 80%; animation: floatLantern 12s ease-in infinite 2s;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; top:10%; right:15%; font-size:50px; opacity:0.08;">🌕</div>' }
            ]
        },
        'L12-08': { 
            logo: { type: 'text', text: 'LABA FESTIVAL', colors:['#8b4513', '#a0522d', '#cd853f', '#deb887'] }, 
            theme: { 
                bgBase: '#140a05', textMain: '#faebd7', textMuted: '#cd853f', accentRgb: '205, 133, 63', 
                avatarGrad1: '#8b0000', avatarGrad2: '#deb887', ambient1: 'rgba(139, 69, 19, 0.2)', ambient2: 'rgba(205, 133, 63, 0.15)',
                customCss: `
                    @keyframes steamRise { 0% { transform: translateY(0) scale(1); opacity: 0.6; filter: blur(2px); } 100% { transform: translateY(-40px) scale(1.5); opacity: 0; filter: blur(6px); } }
                    .omni-steam { position: fixed; bottom: 15%; font-size: 24px; color: rgba(255,255,255,0.4); pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:12%; font-size:50px; opacity:0.3;">🥣</div><div class="omni-steam" style="left: 13.5%; animation: steamRise 3s infinite 0s;">〰️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:35px; opacity:0.15;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:20%; font-size:35px; opacity:0.15;">🥜</div>' } // 腊八粥材料
            ]
        },
        'L12-23': { 
            logo: { type: 'text', text: 'LITTLE NEW YEAR', colors:['#ff4500', '#ff6347', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#1a0500', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 69, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ff8c00', ambient1: 'rgba(255, 69, 0, 0.2)', ambient2: 'rgba(255, 215, 0, 0.15)',
                customCss: `
                    .search-box { border: 1px dashed rgba(255, 165, 0, 0.6); }
                    @keyframes sweeping { 0%, 100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:10%; font-size:45px; opacity:0.2; transform-origin: bottom center; animation: sweeping 2s infinite;">🧹</div>' }, // 扫尘
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:40px; opacity:0.2;">🍬</div>' }, // 灶糖
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:12%; font-size:35px; opacity:0.2;">🔥</div>' } // 祭灶
            ]
        },
        'L12-30': { 
            logo: { type: 'text', text: 'NEW YEAR EVE', colors:['#ff0000', '#ffd700', '#ff8c00', '#ffffff'] }, 
            theme: { 
                bgBase: '#120000', textMain: '#fff5e6', textMuted: '#ffd700', accentRgb: '255, 0, 0', 
                avatarGrad1: '#8b0000', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.25)', ambient2: 'rgba(255, 215, 0, 0.2)',
                customCss: `
                    @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 15px rgba(255,0,0,0.3); } 50% { box-shadow: 0 0 30px rgba(255,0,0,0.6); } }
                    .search-box { border: 2px solid rgba(255,0,0,0.8); animation: pulseGlow 3s infinite; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25;">🥟</div>' }, // 年夜饭
                { type: 'html', content: '<div style="position:fixed; top:10%; right:15%; font-size:40px; opacity:0.25;">🏮</div>' }, 
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:20%; font-size:35px; opacity:0.2;">📺</div>' }, // 春晚
                { type: 'html', content: '<div style="position:fixed; bottom:10%; right:12%; font-size:45px; opacity:0.25;">🧨</div>' } // 爆竹守岁
            ]
        },
        // --- 更多地区（含大马专属）及全球性趣味节日补充 ---
        
        '06-05': { 
            logo: { type: 'text', text: 'ECO MATRIX', colors:['#00fa9a', '#3cb371', '#2e8b57', '#00ff7f'] }, 
            theme: { 
                bgBase: '#021207', textMain: '#e8fce8', textMuted: '#98fb98', accentRgb: '60, 179, 113', 
                avatarGrad1: '#228b22', avatarGrad2: '#00fa9a', ambient1: 'rgba(60, 179, 113, 0.15)', ambient2: 'rgba(0, 250, 154, 0.1)',
                customCss: `
                    @keyframes growPlant { 0% { transform: scaleY(0.5); opacity: 0.2; } 100% { transform: scaleY(1); opacity: 0.8; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:15%; font-size:50px; transform-origin: bottom center; opacity:0.15; animation: growPlant 4s ease-out alternate infinite;">🌿</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:40px; opacity:0.15;">♻️</div>' }
            ]
        },
        '06-08': { 
            logo: { type: 'text', text: 'OCEAN DAY', colors:['#00bfff', '#1e90ff', '#4169e1', '#00ffff'] }, 
            theme: { 
                bgBase: '#000b1a', textMain: '#e6f2ff', textMuted: '#87cefa', accentRgb: '30, 144, 255', 
                avatarGrad1: '#000080', avatarGrad2: '#00bfff', ambient1: 'rgba(30, 144, 255, 0.2)', ambient2: 'rgba(0, 255, 255, 0.1)',
                customCss: `
                    @keyframes swim { 0% { transform: translateX(100vw) translateY(0); } 50% { transform: translateX(40vw) translateY(-20px); } 100% { transform: translateX(-20vw) translateY(0); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:25%; right:-10%; font-size:40px; opacity:0.2; animation: swim 18s linear infinite;">🐋</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:-10%; font-size:35px; opacity:0.15; animation: swim 22s linear infinite 8s;">🐠</div>' }
            ]
        },
        '08-08': { 
            logo: { type: 'text', text: 'MEOW MATRIX', colors:['#ffb3ba', '#ffdfba', '#ffb3ba', '#ffffff'] }, 
            theme: { 
                bgBase: '#1a1014', textMain: '#ffe6ed', textMuted: '#ffb3c6', accentRgb: '255, 179, 186', 
                avatarGrad1: '#ff9eaa', avatarGrad2: '#ffb3ba', ambient1: 'rgba(255, 179, 186, 0.15)', ambient2: 'rgba(255, 223, 186, 0.15)',
                customCss: `
                    @keyframes pawWalk { 0% { opacity: 0; transform: scale(0.5) rotate(-10deg); } 50% { opacity: 0.3; transform: scale(1) rotate(0deg); } 100% { opacity: 0; transform: scale(1.2) rotate(10deg); } }
                    .omni-paw { position: fixed; font-size: 24px; opacity: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-paw" style="bottom: 10%; left: 10%; animation: pawWalk 4s infinite 0s;">🐾</div>
                    <div class="omni-paw" style="bottom: 20%; left: 15%; animation: pawWalk 4s infinite 1s;">🐾</div>
                    <div class="omni-paw" style="bottom: 30%; left: 20%; animation: pawWalk 4s infinite 2s;">🐾</div>
                `},
                { type: 'html', content: '<div style="position:fixed; top:15%; right:10%; font-size:45px; opacity:0.2;">🐱</div>' }
            ]
        },
        // --- 极客文化、节气与全球趣味节日补充 ---
        
        '03-10': { // MAR10 Day (马里奥日)
            logo: { type: 'text', text: 'SUPER MATRIX', colors:['#e52521', '#43b047', '#fbd000', '#049cd8'] }, 
            theme: { 
                bgBase: '#5c94fc', textMain: '#ffffff', textMuted: '#fbd000', accentRgb: '229, 37, 33', 
                avatarGrad1: '#e52521', avatarGrad2: '#049cd8', ambient1: 'rgba(255, 255, 255, 0.2)', ambient2: 'rgba(229, 37, 33, 0.15)',
                customCss: `
                    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
                    .text-logo { font-family: 'Press Start 2P', cursive !important; font-size: 1.2rem; text-shadow: 2px 2px 0px #000; }
                    .search-box { border: 4px solid #000; border-radius: 0; background: #fff; box-shadow: 4px 4px 0px #000; }
                    .search-input { color: #000; font-weight: bold; }
                    .search-input::placeholder { color: #ccc; }
                    @keyframes blockBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:15%; font-size:40px; image-rendering: pixelated; animation: blockBounce 1s infinite;">🧱</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:15%; font-size:40px; animation: blockBounce 1.5s infinite 0.5s;">🍄</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:40px; opacity:0.8;">☁️</div>' }
            ]
        },
        // --- 新增中国趣味节日及现代网络文化纪念日 ---
        
        'L01-05': { // 正月初五 - 迎财神 (破五)
            logo: { type: 'text', text: 'CAISHEN DAO', colors:['#ffd700', '#ff8c00', '#ff0000', '#ffff00'] }, 
            theme: { 
                bgBase: '#1a0500', textMain: '#fffce8', textMuted: '#ffd700', accentRgb: '255, 215, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 215, 0, 0.25)', ambient2: 'rgba(255, 0, 0, 0.15)',
                customCss: `
                    @keyframes coinFlip { 0% { transform: translateY(-10vh) rotateY(0deg); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(110vh) rotateY(720deg); opacity: 0; } }
                    .omni-coin { position: fixed; width: 22px; height: 22px; background: radial-gradient(circle, #ffd700 40%, #daa520 100%); border-radius: 50%; box-shadow: inset 0 0 5px #b8860b, 0 5px 10px rgba(255, 215, 0, 0.4); pointer-events: none; z-index: 0; }
                    .omni-coin::after { content: '財'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; color: #b8860b; font-weight: bold; }
                    .search-box { border: 2px solid #ffd700; background: rgba(255, 215, 0, 0.05); }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-coin" style="left: 15%; animation: coinFlip 6s linear infinite 0s;"></div>
                    <div class="omni-coin" style="left: 35%; animation: coinFlip 8s linear infinite 2s;"></div>
                    <div class="omni-coin" style="left: 55%; animation: coinFlip 5s linear infinite 1s;"></div>
                    <div class="omni-coin" style="left: 75%; animation: coinFlip 7s linear infinite 3s;"></div>
                    <div class="omni-coin" style="left: 85%; animation: coinFlip 9s linear infinite 0.5s;"></div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:12%; font-size:55px; opacity:0.25;">🥟</div>' }, // 破五吃饺子
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:50px; opacity:0.3;">💰</div>' }
            ]
        },
        'L02-15': { // 花朝节 - 百花生日
            logo: { type: 'text', text: 'FLOWER BIRTHDAY', colors:['#ffb6c1', '#ff69b4', '#ffc0cb', '#db7093'] }, 
            theme: { 
                bgBase: '#1a0a10', textMain: '#fff0f5', textMuted: '#ffb6c1', accentRgb: '255, 105, 180', 
                avatarGrad1: '#c71585', avatarGrad2: '#ffb6c1', ambient1: 'rgba(255, 105, 180, 0.2)', ambient2: 'rgba(255, 182, 193, 0.15)',
                customCss: `
                    @keyframes floatBlossom { 0% { transform: translate(0, -10vh) rotate(0deg); opacity: 0; } 20% { opacity: 0.8; } 80% { opacity: 0.8; } 100% { transform: translate(calc(var(--dir) * 20vw), 110vh) rotate(360deg); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div style="position:fixed; left: 10%; font-size: 20px; --dir: 1; animation: floatBlossom 12s ease-in-out infinite 0s;">🌸</div>
                    <div style="position:fixed; left: 30%; font-size: 24px; --dir: -1; animation: floatBlossom 15s ease-in-out infinite 2s;">🌺</div>
                    <div style="position:fixed; left: 60%; font-size: 18px; --dir: 1; animation: floatBlossom 10s ease-in-out infinite 1s;">💮</div>
                    <div style="position:fixed; left: 80%; font-size: 22px; --dir: -1; animation: floatBlossom 14s ease-in-out infinite 4s;">🌸</div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:50px; opacity:0.2;">🦋</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:40px; opacity:0.15;">🌿</div>' }
            ]
        },
                // --- 新增节日补充 ---
        '04-07': { // 世界卫生日
            logo: { type: 'text', text: 'HEALTH FIRST', colors:['#00ff00', '#32cd32', '#90ee90', '#ffffff'] }, 
            theme: { 
                bgBase: '#051005', textMain: '#e6ffe6', textMuted: '#90ee90', accentRgb: '50, 205, 50', 
                avatarGrad1: '#228b22', avatarGrad2: '#32cd32', ambient1: 'rgba(50, 205, 50, 0.15)', ambient2: 'rgba(144, 238, 144, 0.1)',
                customCss: `
                    @keyframes pulseHeart { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                    .search-box { border-color: rgba(50, 205, 50, 0.4); box-shadow: 0 0 15px rgba(50, 205, 50, 0.2); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.2; animation: pulseHeart 1.5s infinite;">❤️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.15;">🏥</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🩺</div>' }
            ]
        },
        
        '05-25': { // 毛巾日 (Towel Day - 纪念道格拉斯·亚当斯)
            logo: { type: 'text', text: 'DONT PANIC', colors:['#4285F4', '#34A853', '#FBBC05', '#EA4335'] }, 
            theme: { 
                bgBase: '#00001a', textMain: '#e6e6fa', textMuted: '#87ceeb', accentRgb: '66, 133, 244', 
                avatarGrad1: '#000080', avatarGrad2: '#4285F4', ambient1: 'rgba(66, 133, 244, 0.2)', ambient2: 'rgba(234, 67, 53, 0.1)',
                customCss: `
                    .text-logo { font-weight: 900; letter-spacing: 5px; text-transform: uppercase; }
                    @keyframes floatGalaxy { 0% { transform: rotate(0deg) scale(0.8); } 50% { transform: rotate(180deg) scale(1.2); } 100% { transform: rotate(360deg) scale(0.8); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:50px; opacity:0.2; transform: rotate(-15deg);">🧻</div>' }, // 假装是毛巾
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:50px; opacity:0.15; animation: floatGalaxy 20s linear infinite;">🌌</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:40px; opacity:0.15;">👍</div>' }
            ]
        },
        '06-05': { // 世界环境日
            logo: { type: 'text', text: 'ECO MATRIX', colors:['#00fa9a', '#3cb371', '#2e8b57', '#00ff7f'] }, 
            theme: { 
                bgBase: '#021207', textMain: '#e8fce8', textMuted: '#98fb98', accentRgb: '60, 179, 113', 
                avatarGrad1: '#228b22', avatarGrad2: '#00fa9a', ambient1: 'rgba(60, 179, 113, 0.15)', ambient2: 'rgba(0, 250, 154, 0.1)',
                customCss: `
                    @keyframes growPlant { 0% { transform: scaleY(0.5); opacity: 0.2; } 100% { transform: scaleY(1); opacity: 0.8; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:15%; font-size:50px; transform-origin: bottom center; opacity:0.15; animation: growPlant 4s ease-out alternate infinite;">🌿</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:40px; opacity:0.15;">♻️</div>' }
            ]
        },
        '06-08': { // 世界海洋日
            logo: { type: 'text', text: 'OCEAN DAY', colors:['#00bfff', '#1e90ff', '#4169e1', '#00ffff'] }, 
            theme: { 
                bgBase: '#000b1a', textMain: '#e6f2ff', textMuted: '#87cefa', accentRgb: '30, 144, 255', 
                avatarGrad1: '#000080', avatarGrad2: '#00bfff', ambient1: 'rgba(30, 144, 255, 0.2)', ambient2: 'rgba(0, 255, 255, 0.1)',
                customCss: `
                    @keyframes swim { 0% { transform: translateX(100vw) translateY(0); } 50% { transform: translateX(40vw) translateY(-20px); } 100% { transform: translateX(-20vw) translateY(0); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:25%; right:-10%; font-size:40px; opacity:0.2; animation: swim 18s linear infinite;">🐋</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:-10%; font-size:35px; opacity:0.15; animation: swim 22s linear infinite 8s;">🐠</div>' }
            ]
        },
        '06-16': { // 父亲节 (Father's Day)
            logo: { type: 'text', text: 'DAD YOU ROCK', colors:['#4169e1', '#2e8b57', '#87ceeb', '#90ee90'] }, 
            theme: { 
                bgBase: '#050a15', textMain: '#e6f0ff', textMuted: '#87ceeb', accentRgb: '65, 105, 225', 
                avatarGrad1: '#4169e1', avatarGrad2: '#90ee90', ambient1: 'rgba(65, 105, 225, 0.15)', ambient2: 'rgba(144, 238, 144, 0.1)',
                customCss: `
                    .search-box { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(65, 105, 225, 0.3); box-shadow: 0 0 15px rgba(65, 105, 225, 0.1); }
                    .text-logo { text-shadow: 0 0 10px rgba(65, 105, 225, 0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:10%; font-size:40px; opacity:0.2;">👔</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:8%; font-size:35px; opacity:0.15;">🔧</div>' },
                { type: 'html', content: '<div style="position:fixed; top:10%; right:15%; font-size:30px; opacity:0.1;">🏆</div>' }
            ]
        },
        '08-08': { // 国际猫咪日
            logo: { type: 'text', text: 'MEOW MATRIX', colors:['#ffb3ba', '#ffdfba', '#ffb3ba', '#ffffff'] }, 
            theme: { 
                bgBase: '#1a1014', textMain: '#ffe6ed', textMuted: '#ffb3c6', accentRgb: '255, 179, 186', 
                avatarGrad1: '#ff9eaa', avatarGrad2: '#ffb3ba', ambient1: 'rgba(255, 179, 186, 0.15)', ambient2: 'rgba(255, 223, 186, 0.15)',
                customCss: `
                    @keyframes pawWalk { 0% { opacity: 0; transform: scale(0.5) rotate(-10deg); } 50% { opacity: 0.3; transform: scale(1) rotate(0deg); } 100% { opacity: 0; transform: scale(1.2) rotate(10deg); } }
                    .omni-paw { position: fixed; font-size: 24px; opacity: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-paw" style="bottom: 10%; left: 10%; animation: pawWalk 4s infinite 0s;">🐾</div>
                    <div class="omni-paw" style="bottom: 20%; left: 15%; animation: pawWalk 4s infinite 1s;">🐾</div>
                    <div class="omni-paw" style="bottom: 30%; left: 20%; animation: pawWalk 4s infinite 2s;">🐾</div>
                `},
                { type: 'html', content: '<div style="position:fixed; top:15%; right:10%; font-size:45px; opacity:0.2;">🐱</div>' }
            ]
        },
        // 【农历传统小众节日补充】
        // ==============================================
        'L01-07': { // 正月初七 人日节（人类诞辰日）
            logo: { type: 'text', text: 'REN RI FESTIVAL', colors:['#ffd700', '#ff8c00', '#ffffff', '#ffb347'] }, 
            theme: { 
                bgBase: '#1a0a00', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 215, 0', 
                avatarGrad1: '#ff8c00', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 215, 0, 0.2)', ambient2: 'rgba(255, 140, 0, 0.15)',
                customCss: `
                    @keyframes floatRibbon { 0%, 100% { transform: rotate(-8deg) translateY(0); } 50% { transform: rotate(8deg) translateY(-10px); } }
                    .search-box { border: 1px solid rgba(255,215,0,0.4); box-shadow: 0 0 15px rgba(255,215,0,0.2); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: floatRibbon 3s infinite;">🎗️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🍜</div>' }, // 人日吃七宝羹/面条
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">👨‍👩‍👧‍👦</div>' }
            ]
        },
        'L01-25': { // 正月廿五 填仓节（五谷丰登祈愿）
            logo: { type: 'text', text: 'GRANARY FILLING', colors:['#d4af37', '#b8860b', '#ffd700', '#f5deb3'] }, 
            theme: { 
                bgBase: '#140c00', textMain: '#fff8e6', textMuted: '#d4af37', accentRgb: '212, 175, 55', 
                avatarGrad1: '#b8860b', avatarGrad2: '#ffd700', ambient1: 'rgba(212, 175, 55, 0.2)', ambient2: 'rgba(255, 215, 0, 0.15)',
                customCss: `
                    @keyframes swayGrain { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:15%; font-size:60px; opacity:0.3; transform-origin: bottom center; animation: swayGrain 4s infinite;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:22%; font-size:50px; opacity:0.25; transform-origin: bottom center; animation: swayGrain 3.5s infinite 0.5s;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0.2;">🌽</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:20%; font-size:40px; opacity:0.2;">🥣</div>' }
            ]
        },
        'L02-03': { // 二月初三 文昌诞（学业祈福日）
            logo: { type: 'text', text: 'WENCHANG BIRTH', colors:['#4169e1', '#2e8b57', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#050a15', textMain: '#e6f0ff', textMuted: '#87ceeb', accentRgb: '65, 105, 225', 
                avatarGrad1: '#4169e1', avatarGrad2: '#ffd700', ambient1: 'rgba(65, 105, 225, 0.15)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes floatScroll { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(5deg); } }
                    .search-box { border: 1px solid rgba(65,105,225,0.4); background: rgba(255,255,255,0.03); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: floatScroll 4s infinite;">📜</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">✍️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🎓</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">📚</div>' }
            ]
        },
        'L04-08': { // 四月初八 浴佛节（佛诞日）
            logo: { type: 'text', text: 'BUDDHA BIRTHDAY', colors:['#ffd700', '#d4af37', '#ffffff', '#e6e6fa'] }, 
            theme: { 
                bgBase: '#0a0500', textMain: '#fffce8', textMuted: '#d4af37', accentRgb: '255, 215, 0', 
                avatarGrad1: '#b8860b', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 215, 0, 0.25)', ambient2: 'rgba(255, 255, 255, 0.1)',
                customCss: `
                    @keyframes lotusFloat { 0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; } 50% { transform: translateY(-10px) rotate(5deg); opacity: 0.3; } }
                    .search-box { border-radius: 50px; border: 1px solid rgba(255,215,0,0.5); box-shadow: 0 0 20px rgba(255,215,0,0.2); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:15%; font-size:55px; opacity:0.25; animation: lotusFloat 4s infinite;">🪷</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:25%; font-size:45px; opacity:0.2; animation: lotusFloat 4.5s infinite 0.5s;">🪷</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:50px; opacity:0.2;">🕯️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; left:20%; font-size:35px; opacity:0.15;">🔔</div>' }
            ]
        },
        'L06-24': { // 六月廿四 火把节（彝族传统节日）
            logo: { type: 'text', text: 'TORCH FESTIVAL', colors:['#ff4500', '#ff0000', '#ffd700', '#ffa500'] }, 
            theme: { 
                bgBase: '#0a0200', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 69, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ff4500', ambient1: 'rgba(255, 69, 0, 0.3)', ambient2: 'rgba(255, 0, 0, 0.2)',
                customCss: `
                    @keyframes torchFlicker { 0%, 100% { filter: brightness(1) drop-shadow(0 0 10px #ff4500); } 50% { filter: brightness(1.3) drop-shadow(0 0 25px #ff0000); } }
                    @keyframes sparkFly { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-50px) scale(0); opacity: 0; } }
                    .search-box { border: 2px solid #ff4500; box-shadow: 0 0 30px rgba(255,69,0,0.4); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:15%; font-size:55px; opacity:0.3; animation: torchFlicker 0.8s infinite;">🔥</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; right:15%; font-size:55px; opacity:0.3; animation: torchFlicker 1s infinite 0.2s;">🔥</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:50%; transform: translateX(-50%); font-size:60px; opacity:0.35; animation: torchFlicker 0.9s infinite 0.1s;">🔥</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:40px; opacity:0.2;">🎶</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:25%; font-size:35px; opacity:0; animation: sparkFly 1.5s infinite;">✨</div>' }
            ]
        },
        'L10-01': { // 十月初一 寒衣节（祭祖送寒衣）
            logo: { type: 'text', text: 'HAN YI FESTIVAL', colors:['#8b4513', '#a0522d', '#d2b48c', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a0502', textMain: '#f5deb3', textMuted: '#d2b48c', accentRgb: '139, 69, 19', 
                avatarGrad1: '#3e1f00', avatarGrad2: '#8b4513', ambient1: 'rgba(139, 69, 19, 0.15)', ambient2: 'rgba(210, 180, 140, 0.1)',
                customCss: `
                    @keyframes leafFallSlow { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:15%; font-size:20px; opacity:0; animation: leafFallSlow 15s linear infinite 0s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:35%; font-size:24px; opacity:0; animation: leafFallSlow 18s linear infinite 3s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:65%; font-size:18px; opacity:0; animation: leafFallSlow 16s linear infinite 1s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:85%; font-size:22px; opacity:0; animation: leafFallSlow 17s linear infinite 2s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🧣</div>' }
            ]
        },
        'L12-16': { // 腊月十六 尾牙节（闽南/台湾年终祭典）
            logo: { type: 'text', text: 'WEI YA FESTIVAL', colors:['#ff4500', '#ffd700', '#ffa500', '#ffffff'] }, 
            theme: { 
                bgBase: '#1a0500', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 69, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 69, 0, 0.2)', ambient2: 'rgba(255, 215, 0, 0.15)',
                customCss: `
                    @keyframes floatFeast { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                    .search-box { border: 1px dashed #ffd700; background: rgba(255,69,0,0.05); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:15%; font-size:50px; opacity:0.25; animation: floatFeast 3s infinite;">🍗</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:25%; font-size:45px; opacity:0.2; animation: floatFeast 3.5s infinite 0.5s;">🍲</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:40px; opacity:0.2;">🧧</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:20%; font-size:40px; opacity:0.2;">🍻</div>' }
            ]
        },
                // ==============================================
        // 【二十四节气·农历L开头全系列】
        // ==============================================
        'L12-08': { // 小寒 (农历腊月初八左右)
            logo: { type: 'text', text: 'MINOR COLD', colors:['#add8e6', '#87ceeb', '#ffffff', '#e0ffff'] }, 
            theme: { 
                bgBase: '#020a14', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '173, 216, 230', 
                avatarGrad1: '#4682b4', avatarGrad2: '#87ceeb', ambient1: 'rgba(135, 206, 235, 0.15)', ambient2: 'rgba(255, 255, 255, 0.1)',
                customCss: `
                    @keyframes snowFallLight { 0% { transform: translateY(-10vh); opacity: 0; } 10% { opacity: 0.7; } 100% { transform: translateY(110vh); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; left:10%; font-size:14px; opacity:0; animation: snowFallLight 12s linear infinite 0s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:30%; font-size:18px; opacity:0; animation: snowFallLight 15s linear infinite 2s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:60%; font-size:16px; opacity:0; animation: snowFallLight 13s linear infinite 1s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:85%; font-size:20px; opacity:0; animation: snowFallLight 14s linear infinite 3s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🥟</div>' }
            ]
        },
        'L12-23': { // 大寒 (农历腊月廿三左右)
            logo: { type: 'text', text: 'MAJOR COLD', colors:['#e0ffff', '#ffffff', '#b0c4de', '#87cefa'] }, 
            theme: { 
                bgBase: '#000510', textMain: '#ffffff', textMuted: '#b0c4de', accentRgb: '176, 196, 222', 
                avatarGrad1: '#191970', avatarGrad2: '#87cefa', ambient1: 'rgba(176, 196, 222, 0.2)', ambient2: 'rgba(135, 206, 250, 0.15)',
                customCss: `
                    @keyframes snowFallHeavy { 0% { transform: translateY(-10vh) translateX(0); opacity: 0; } 10% { opacity: 0.8; } 100% { transform: translateY(110vh) translateX(20px); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; left:15%; font-size:20px; opacity:0; animation: snowFallHeavy 10s linear infinite 0s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:35%; font-size:24px; opacity:0; animation: snowFallHeavy 12s linear infinite 2s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:55%; font-size:18px; opacity:0; animation: snowFallHeavy 9s linear infinite 1s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:75%; font-size:22px; opacity:0; animation: snowFallHeavy 11s linear infinite 3s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:50px; opacity:0.25;">🧣</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.2;">🏮</div>' }
            ]
        },
        // 'L01-01': { // 立春 (农历正月初一左右)
        //     logo: { type: 'text', text: 'SPRING BEGINS', colors:['#98fb98', '#32cd32', '#ffb6c1', '#ffffff'] }, 
        //     theme: { 
        //         bgBase: '#051005', textMain: '#f0fff0', textMuted: '#98fb98', accentRgb: '50, 205, 50', 
        //         avatarGrad1: '#228b22', avatarGrad2: '#ffb6c1', ambient1: 'rgba(50, 205, 50, 0.15)', ambient2: 'rgba(255, 182, 193, 0.15)',
        //         customCss: `
        //             @keyframes sproutGrow { 0% { transform: scaleY(0.3); opacity: 0.2; } 100% { transform: scaleY(1); opacity: 0.8; } }
        //             @keyframes windSway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
        //         `
        //     },
        //     extensions:[
        //         { type: 'html', content: '<div style="position:fixed; bottom:0; left:15%; font-size:50px; transform-origin: bottom center; opacity:0.25; animation: sproutGrow 4s ease-out alternate infinite;">🌱</div>' },
        //         { type: 'html', content: '<div style="position:fixed; bottom:0; left:25%; font-size:40px; transform-origin: bottom center; opacity:0.2; animation: sproutGrow 5s ease-out alternate infinite 0.5s;">🌱</div>' },
        //         { type: 'html', content: '<div style="position:fixed; bottom:0; left:70%; font-size:45px; transform-origin: bottom center; opacity:0.22; animation: sproutGrow 4.5s ease-out alternate infinite 1s;">🌱</div>' },
        //         { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:40px; opacity:0.2; animation: windSway 3s infinite;">🍃</div>' },
        //         { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🥢</div>' }
        //     ]
        // },
        'L01-15': { // 雨水 (农历正月十五左右)
            logo: { type: 'text', text: 'RAIN WATER', colors:['#87ceeb', '#add8e6', '#98fb98', '#ffffff'] }, 
            theme: { 
                bgBase: '#050a14', textMain: '#e6f2ff', textMuted: '#add8e6', accentRgb: '135, 206, 235', 
                avatarGrad1: '#4682b4', avatarGrad2: '#98fb98', ambient1: 'rgba(135, 206, 235, 0.15)', ambient2: 'rgba(152, 251, 152, 0.1)',
                customCss: `
                    @keyframes drizzleFall { 0% { transform: translateY(-10vh); opacity: 0; } 10% { opacity: 0.6; } 100% { transform: translateY(110vh); opacity: 0; } }
                    .omni-drizzle { position: fixed; top: -10vh; width: 1px; height: 10px; background: linear-gradient(to bottom, transparent, #add8e6); border-radius: 0 0 50% 50%; pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-drizzle" style="left: 10%; animation: drizzleFall 8s linear infinite 0s;"></div>
                    <div class="omni-drizzle" style="left: 25%; animation: drizzleFall 10s linear infinite 1s;"></div>
                    <div class="omni-drizzle" style="left: 40%; animation: drizzleFall 9s linear infinite 2s;"></div>
                    <div class="omni-drizzle" style="left: 55%; animation: drizzleFall 11s linear infinite 0.5s;"></div>
                    <div class="omni-drizzle" style="left: 70%; animation: drizzleFall 8.5s linear infinite 1.5s;"></div>
                    <div class="omni-drizzle" style="left: 85%; animation: drizzleFall 10.5s linear infinite 3s;"></div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.2;">☔</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:35px; opacity:0.15;">🌿</div>' }
            ]
        },
        'L02-01': { // 惊蛰 (农历二月初一左右)
            logo: { type: 'text', text: 'AWAKENING OF INSECTS', colors:['#ffd700', '#ff8c00', '#32cd32', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a1005', textMain: '#fffce8', textMuted: '#98fb98', accentRgb: '255, 140, 0', 
                avatarGrad1: '#ff8c00', avatarGrad2: '#32cd32', ambient1: 'rgba(255, 140, 0, 0.15)', ambient2: 'rgba(50, 205, 50, 0.15)',
                customCss: `
                    @keyframes thunderFlash { 0%, 95%, 100% { opacity: 0; } 96% { opacity: 0.8; } 98% { opacity: 0.3; } }
                    @keyframes insectHop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                    body::before { content:''; position:fixed; top:0; left:0; width:100vw; height:100vh; background: #fff; pointer-events:none; z-index:9999; animation: thunderFlash 7s infinite; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:40px; opacity:0.2; animation: insectHop 2s infinite;">🐝</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:35px; opacity:0.2; animation: insectHop 2.5s infinite 0.5s;">🐞</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:45px; opacity:0.15;">⚡</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:50%; transform: translateX(-50%); font-size:50px; opacity:0.25;">🌱</div>' }
            ]
        },
        'L02-15': { // 春分 (农历二月十五左右)
            logo: { type: 'text', text: 'SPRING EQUINOX', colors:['#ffa500', '#ff8c00', '#87ceeb', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a0f14', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 165, 0', 
                avatarGrad1: '#d2691e', avatarGrad2: '#87ceeb', ambient1: 'rgba(255, 165, 0, 0.15)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    body { background: linear-gradient(to right, #0a0f14 50%, #050a14 50%); }
                    @keyframes leafSpin { 0% { transform: rotate(0deg) scale(1); opacity: 0; } 10% { opacity: 0.7; } 100% { transform: rotate(720deg) scale(0.8); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; left:10%; font-size:20px; opacity:0; animation: leafSpin 10s linear infinite 0s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; left:30%; font-size:24px; opacity:0; animation: leafSpin 12s linear infinite 2s;">🍁</div>' },
                { type: 'html', content: '<div style="position:fixed; left:60%; font-size:18px; opacity:0; animation: leafSpin 11s linear infinite 1s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; left:85%; font-size:22px; opacity:0; animation: leafSpin 13s linear infinite 3s;">🍁</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:20%; font-size:45px; opacity:0.2;">☀️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:40px; opacity:0.2;">🌙</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🥚</div>' }
            ]
        },
        'L03-01': { // 清明 (农历三月初一左右)
            logo: { type: 'text', text: 'PURE BRIGHTNESS', colors:['#98fb98', '#32cd32', '#87ceeb', '#ffffff'] }, 
            theme: { 
                bgBase: '#05100a', textMain: '#e6ffe6', textMuted: '#90ee90', accentRgb: '50, 205, 50', 
                avatarGrad1: '#228b22', avatarGrad2: '#87ceeb', ambient1: 'rgba(50, 205, 50, 0.15)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    @keyframes willowSway { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: willowSway 4s infinite;">🌿</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🍵</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🌧️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🌸</div>' }
            ]
        },
        
        'L04-01': { // 立夏 (农历四月初一左右)
            logo: { type: 'text', text: 'SUMMER BEGINS', colors:['#ffd700', '#ff8c00', '#32cd32', '#ffffff'] }, 
            theme: { 
                bgBase: '#140a00', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 140, 0', 
                avatarGrad1: '#ff8c00', avatarGrad2: '#32cd32', ambient1: 'rgba(255, 140, 0, 0.2)', ambient2: 'rgba(50, 205, 50, 0.15)',
                customCss: `
                    @keyframes sunGlow { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.1); opacity: 0.4; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:60px; opacity:0.3; animation: sunGlow 4s infinite;">☀️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🍉</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🥤</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:40px; opacity:0.2;">🌿</div>' }
            ]
        },
        'L04-15': { // 小满 (农历四月十五左右)
            logo: { type: 'text', text: 'GRAIN BUDS', colors:['#98fb98', '#32cd32', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#051002', textMain: '#f0fff0', textMuted: '#98fb98', accentRgb: '50, 205, 50', 
                avatarGrad1: '#228b22', avatarGrad2: '#ffd700', ambient1: 'rgba(50, 205, 50, 0.2)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes wheatSway { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:15%; font-size:60px; opacity:0.3; transform-origin: bottom center; animation: wheatSway 4s infinite;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:25%; font-size:50px; opacity:0.25; transform-origin: bottom center; animation: wheatSway 3.5s infinite 0.5s;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:70%; font-size:55px; opacity:0.28; transform-origin: bottom center; animation: wheatSway 4.2s infinite 1s;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:40px; opacity:0.2;">☀️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🍒</div>' }
            ]
        },
        
        'L05-15': { // 夏至 (农历五月十五左右)
            logo: { type: 'text', text: 'SUMMER SOLSTICE', colors:['#ffd700', '#ff8c00', '#ff4500', '#ffffff'] }, 
            theme: { 
                bgBase: '#1a0500', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 215, 0', 
                avatarGrad1: '#ff4500', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 215, 0, 0.3)', ambient2: 'rgba(255, 69, 0, 0.2)',
                customCss: `
                    @keyframes sunPulse { 0%, 100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.1); filter: brightness(1.2); } }
                    body::before { content:''; position:fixed; top:0; left:0; width:100vw; height:100vh; background: radial-gradient(circle at 80% 20%, rgba(255,215,0,0.15), transparent 50%); pointer-events: none; z-index: -1; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:60px; opacity:0.35; animation: sunPulse 3s infinite;">☀️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🍜</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🍉</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:40px; opacity:0.2;">🌿</div>' }
            ]
        },
        'L06-01': { // 小暑 (农历六月初一左右)
            logo: { type: 'text', text: 'MINOR HEAT', colors:['#ff8c00', '#ff4500', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#1a0500', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 140, 0', 
                avatarGrad1: '#ff4500', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 140, 0, 0.25)', ambient2: 'rgba(255, 69, 0, 0.2)',
                customCss: `
                    @keyframes heatWave { 0%, 100% { transform: scaleY(1); opacity: 0.1; } 50% { transform: scaleY(1.2); opacity: 0.2; } }
                    body::before { content:''; position:fixed; bottom:0; left:0; width:100vw; height:30vh; background: linear-gradient(to top, rgba(255,69,0,0.3), transparent); filter: blur(10px); animation: heatWave 3s infinite; pointer-events: none; z-index: -1; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:60px; opacity:0.3; animation: heatWave 4s infinite;">☀️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🍉</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🧊</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:40px; opacity:0.2;">蝉</div>' }
            ]
        },
        'L06-15': { // 大暑 (农历六月十五左右)
            logo: { type: 'text', text: 'MAJOR HEAT', colors:['#ff4500', '#ff0000', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#1a0000', textMain: '#fff5e6', textMuted: '#ff9999', accentRgb: '255, 69, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ff4500', ambient1: 'rgba(255, 69, 0, 0.3)', ambient2: 'rgba(255, 0, 0, 0.2)',
                customCss: `
                    @keyframes intenseHeat { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.25; } }
                    body::before { content:''; position:fixed; top:0; left:0; width:100vw; height:100vh; background: radial-gradient(circle at 50% 50%, rgba(255,0,0,0.1), transparent 70%); animation: intenseHeat 2s infinite; pointer-events: none; z-index: -1; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:60px; opacity:0.35;">🔥</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🍨</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🥤</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:40px; opacity:0.2;">💦</div>' }
            ]
        },
        'L07-01': { // 立秋 (农历七月初一左右)
            logo: { type: 'text', text: 'AUTUMN BEGINS', colors:['#ff8c00', '#ffa500', '#d2691e', '#ffffff'] }, 
            theme: { 
                bgBase: '#140a00', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 140, 0', 
                avatarGrad1: '#d2691e', avatarGrad2: '#ff8c00', ambient1: 'rgba(255, 140, 0, 0.2)', ambient2: 'rgba(210, 105, 30, 0.15)',
                customCss: `
                    @keyframes leafFall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; } 10% { opacity: 0.7; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; left:10%; font-size:20px; opacity:0; animation: leafFall 12s linear infinite 0s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; left:30%; font-size:24px; opacity:0; animation: leafFall 15s linear infinite 2s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; left:55%; font-size:18px; opacity:0; animation: leafFall 10s linear infinite 1s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; left:80%; font-size:22px; opacity:0; animation: leafFall 13s linear infinite 3s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🍑</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🍉</div>' }
            ]
        },
        'L07-15': { // 处暑 (农历七月十五左右)
            logo: { type: 'text', text: 'END OF HEAT', colors:['#ffa500', '#ff8c00', '#87ceeb', '#ffffff'] }, 
            theme: { 
                bgBase: '#0f0a05', textMain: '#fff8e6', textMuted: '#ffb347', accentRgb: '255, 165, 0', 
                avatarGrad1: '#ff4500', avatarGrad2: '#87ceeb', ambient1: 'rgba(255, 165, 0, 0.15)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    @keyframes coolWind { 0%, 100% { transform: translateX(0); opacity: 0.2; } 50% { transform: translateX(20px); opacity: 0.3; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.2; animation: coolWind 3s infinite;">💨</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:40px; opacity:0.2; animation: coolWind 3.5s infinite 0.5s;">💨</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🦆</div>' }
            ]
        },
        'L08-01': { // 白露 (农历八月初一左右)
            logo: { type: 'text', text: 'WHITE DEW', colors:['#ffffff', '#e0ffff', '#add8e6', '#87ceeb'] }, 
            theme: { 
                bgBase: '#050a14', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '255, 255, 255', 
                avatarGrad1: '#4682b4', avatarGrad2: '#ffffff', ambient1: 'rgba(255, 255, 255, 0.15)', ambient2: 'rgba(173, 216, 230, 0.1)',
                customCss: `
                    @keyframes dewDrop { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.1); opacity: 0.9; } }
                    .omni-dew { position: fixed; width: 8px; height: 8px; background: radial-gradient(circle, #ffffff, #add8e6); border-radius: 50%; box-shadow: 0 0 5px rgba(255,255,255,0.8); pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-dew" style="top: 20%; left: 15%; animation: dewDrop 2s infinite 0s;"></div>
                    <div class="omni-dew" style="top: 25%; left: 35%; animation: dewDrop 2.5s infinite 0.5s;"></div>
                    <div class="omni-dew" style="top: 18%; left: 65%; animation: dewDrop 2.2s infinite 1s;"></div>
                    <div class="omni-dew" style="top: 30%; left: 85%; animation: dewDrop 2.8s infinite 1.5s;"></div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🍵</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🌾</div>' }
            ]
        },
        'L08-15': { // 秋分 (农历八月十五左右)
            logo: { type: 'text', text: 'AUTUMN EQUINOX', colors:['#ffa500', '#ff8c00', '#87ceeb', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a0f14', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 165, 0', 
                avatarGrad1: '#d2691e', avatarGrad2: '#87ceeb', ambient1: 'rgba(255, 165, 0, 0.15)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    body { background: linear-gradient(to right, #0a0f14 50%, #050a14 50%); }
                    @keyframes leafSpin { 0% { transform: rotate(0deg) scale(1); opacity: 0; } 10% { opacity: 0.7; } 100% { transform: rotate(720deg) scale(0.8); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; left:10%; font-size:20px; opacity:0; animation: leafSpin 10s linear infinite 0s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; left:30%; font-size:24px; opacity:0; animation: leafSpin 12s linear infinite 2s;">🍁</div>' },
                { type: 'html', content: '<div style="position:fixed; left:60%; font-size:18px; opacity:0; animation: leafSpin 11s linear infinite 1s;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; left:85%; font-size:22px; opacity:0; animation: leafSpin 13s linear infinite 3s;">🍁</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:20%; font-size:45px; opacity:0.2;">☀️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:40px; opacity:0.2;">🌙</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🥮</div>' }
            ]
        },
        'L09-01': { // 寒露 (农历九月初一左右)
            logo: { type: 'text', text: 'COLD DEW', colors:['#87ceeb', '#4682b4', '#ffffff', '#e0ffff'] }, 
            theme: { 
                bgBase: '#020a14', textMain: '#e6f2ff', textMuted: '#add8e6', accentRgb: '135, 206, 235', 
                avatarGrad1: '#191970', avatarGrad2: '#87ceeb', ambient1: 'rgba(135, 206, 235, 0.15)', ambient2: 'rgba(255, 255, 255, 0.1)',
                customCss: `
                    @keyframes frostGrow { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 0.2; transform: scale(1); } }
                    body::after { content: ''; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; box-shadow: inset 0 0 100px rgba(135,206,235,0.1); pointer-events: none; animation: frostGrow 5s forwards; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.2;">💧</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">☕</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🌾</div>' }
            ]
        },
        'L09-15': { // 霜降 (农历九月十五左右)
            logo: { type: 'text', text: 'FROST\'S DESCENT', colors:['#ffffff', '#e0ffff', '#b0c4de', '#87cefa'] }, 
            theme: { 
                bgBase: '#000510', textMain: '#f8fafc', textMuted: '#b0c4de', accentRgb: '255, 255, 255', 
                avatarGrad1: '#4682b4', avatarGrad2: '#ffffff', ambient1: 'rgba(255, 255, 255, 0.15)', ambient2: 'rgba(176, 196, 222, 0.1)',
                customCss: `
                    @keyframes frostFall { 0% { transform: translateY(-10vh); opacity: 0; } 10% { opacity: 0.6; } 100% { transform: translateY(110vh); opacity: 0; } }
                    .omni-frost { position: fixed; top: -10vh; font-size: 14px; color: #fff; opacity: 0; pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-frost" style="left: 10%; animation: frostFall 15s linear infinite 0s;">❄️</div>
                    <div class="omni-frost" style="left: 30%; animation: frostFall 18s linear infinite 2s;">❄️</div>
                    <div class="omni-frost" style="left: 55%; animation: frostFall 16s linear infinite 1s;">❄️</div>
                    <div class="omni-frost" style="left: 80%; animation: frostFall 17s linear infinite 3s;">❄️</div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🍎</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🍠</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:35px; opacity:0.15;">🏮</div>' }
            ]
        },
        'L10-01': { // 立冬 (农历十月初一左右)
            logo: { type: 'text', text: 'WINTER BEGINS', colors:['#87ceeb', '#4682b4', '#ffffff', '#e0ffff'] }, 
            theme: { 
                bgBase: '#020a14', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '135, 206, 235', 
                avatarGrad1: '#191970', avatarGrad2: '#87ceeb', ambient1: 'rgba(135, 206, 235, 0.15)', ambient2: 'rgba(255, 255, 255, 0.1)',
                customCss: `
                    @keyframes firstSnow { 0% { transform: translateY(-10vh); opacity: 0; } 10% { opacity: 0.6; } 100% { transform: translateY(110vh); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; left:20%; font-size:16px; opacity:0; animation: firstSnow 14s linear infinite 0s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:50%; font-size:20px; opacity:0; animation: firstSnow 16s linear infinite 2s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; left:75%; font-size:18px; opacity:0; animation: firstSnow 15s linear infinite 1s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🥟</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🧣</div>' }
            ]
        },
        'L10-15': { // 小雪 (农历十月十五左右)
            logo: { type: 'text', text: 'LIGHT SNOW', colors:['#ffffff', '#e0ffff', '#add8e6', '#87ceeb'] }, 
            theme: { 
                bgBase: '#020510', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '255, 255, 255', 
                avatarGrad1: '#4682b4', avatarGrad2: '#ffffff', ambient1: 'rgba(255, 255, 255, 0.15)', ambient2: 'rgba(173, 216, 230, 0.1)',
                customCss: `
                    @keyframes snowFall { 0% { transform: translateY(-10vh); opacity: 0; } 10% { opacity: 0.7; } 100% { transform: translateY(110vh); opacity: 0; } }
                    .omni-snow { position: fixed; top: -10vh; color: #fff; pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-snow" style="left: 15%; font-size: 14px; animation: snowFall 12s linear infinite 0s;">❄️</div>
                    <div class="omni-snow" style="left: 35%; font-size: 18px; animation: snowFall 15s linear infinite 2s;">❄️</div>
                    <div class="omni-snow" style="left: 55%; font-size: 16px; animation: snowFall 13s linear infinite 1s;">❄️</div>
                    <div class="omni-snow" style="left: 75%; font-size: 20px; animation: snowFall 14s linear infinite 3s;">❄️</div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🥟</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🔥</div>' }
            ]
        },
        'L11-01': { // 大雪 (农历十一月初一左右)
            logo: { type: 'text', text: 'HEAVY SNOW', colors:['#ffffff', '#f0f8ff', '#e0ffff', '#b0c4de'] }, 
            theme: { 
                bgBase: '#000208', textMain: '#ffffff', textMuted: '#b0c4de', accentRgb: '255, 255, 255', 
                avatarGrad1: '#191970', avatarGrad2: '#ffffff', ambient1: 'rgba(255, 255, 255, 0.2)', ambient2: 'rgba(176, 196, 222, 0.15)',
                customCss: `
                    @keyframes snowFallHeavy { 0% { transform: translateY(-10vh) translateX(0); opacity: 0; } 10% { opacity: 0.8; } 100% { transform: translateY(110vh) translateX(20px); opacity: 0; } }
                    .omni-snow { position: fixed; top: -10vh; color: #fff; pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-snow" style="left: 10%; font-size: 18px; animation: snowFallHeavy 10s linear infinite 0s;">❄️</div>
                    <div class="omni-snow" style="left: 25%; font-size: 24px; animation: snowFallHeavy 12s linear infinite 2s;">❄️</div>
                    <div class="omni-snow" style="left: 45%; font-size: 20px; animation: snowFallHeavy 9s linear infinite 1s;">❄️</div>
                    <div class="omni-snow" style="left: 65%; font-size: 22px; animation: snowFallHeavy 11s linear infinite 0.5s;">❄️</div>
                    <div class="omni-snow" style="left: 85%; font-size: 26px; animation: snowFallHeavy 13s linear infinite 3s;">❄️</div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🥘</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:40px; opacity:0.2;">⛄</div>' }
            ]
        },
        'L11-15': { // 冬至 (农历十一月十五左右)
            logo: { type: 'text', text: 'WINTER SOLSTICE', colors:['#ff0000', '#ffffff', '#ffd700', '#87ceeb'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#ffffff', textMuted: '#ff9999', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes dumplingSteam { 0% { transform: translateY(0) scale(1); opacity: 0.6; } 100% { transform: translateY(-20px) scale(1.2); opacity: 0; } }
                    .search-box { border: 2px solid #ff0000; box-shadow: 0 0 20px rgba(255,0,0,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🥟</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:18%; font-size:20px; opacity:0; animation: dumplingSteam 2s infinite 0s;">💨</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:22%; font-size:20px; opacity:0; animation: dumplingSteam 2s infinite 0.5s;">💨</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:40px; opacity:0.2;">🏮</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🧣</div>' }
            ]
        },
        // ==============================================
        // 【国际纪念日/趣味节日补充】
        // ==============================================
        '01-26': { // 国际漫画日
            logo: { type: 'text', text: 'COMIC DAY', colors:['#ff0000', '#0000ff', '#ffff00', '#ffffff'] }, 
            theme: { 
                bgBase: '#ffffff', textMain: '#000000', textMuted: '#666666', accentRgb: '255, 0, 0', 
                avatarGrad1: '#0000ff', avatarGrad2: '#ff0000', ambient1: 'rgba(255, 0, 0, 0.1)', ambient2: 'rgba(0, 0, 255, 0.1)',
                customCss: lightModeCSS + `
                    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
                    .text-logo { font-family: 'Press Start 2P', cursive !important; font-weight: 900; text-shadow: 2px 2px 0px #000; }
                    .search-box { border: 3px solid #000; border-radius: 0; background: #fff; box-shadow: 4px 4px 0px #000; }
                    .search-input { color: #000; font-weight: bold; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.2;">🎨</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">📖</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">✏️</div>' }
            ]
        },
        '02-10': { // 世界气象日
            logo: { type: 'text', text: 'WEATHER DAY', colors:['#87ceeb', '#4682b4', '#ffffff', '#ffd700'] }, 
            theme: { 
                bgBase: '#020a14', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '135, 206, 235', 
                avatarGrad1: '#4682b4', avatarGrad2: '#ffd700', ambient1: 'rgba(135, 206, 235, 0.2)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes cloudFloat { 0% { transform: translateX(110vw); } 100% { transform: translateX(-10vw); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; right:-10%; font-size:55px; opacity:0.2; animation: cloudFloat 25s linear infinite;">☁️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; left:-10%; font-size:45px; opacity:0.15; animation: cloudFloat 30s linear infinite 5s;">☁️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:40px; opacity:0.2;">🌤️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.25;">🌪️</div>' }
            ]
        },
        '03-15': { // 315国际消费者权益日
            logo: { type: 'text', text: '315 CONSUMER RIGHTS', colors:['#ff0000', '#ffffff', '#ffd700'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#ffffff', textMuted: '#ff9999', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes shieldPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
                    .search-box { border: 2px solid #ff0000; box-shadow: 0 0 20px rgba(255,0,0,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25; animation: shieldPulse 2s infinite;">🛡️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">⚖️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">📢</div>' }
            ]
        },
        '03-22': { // 世界水日
            logo: { type: 'text', text: 'WORLD WATER DAY', colors:['#00bfff', '#1e90ff', '#ffffff', '#87ceeb'] }, 
            theme: { 
                bgBase: '#000b1a', textMain: '#e6f2ff', textMuted: '#87cefa', accentRgb: '0, 191, 255', 
                avatarGrad1: '#000080', avatarGrad2: '#00bfff', ambient1: 'rgba(0, 191, 255, 0.2)', ambient2: 'rgba(30, 144, 255, 0.15)',
                customCss: `
                    @keyframes waveMove { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                    .omni-wave { position: fixed; bottom: 0; left: 0; width: 200%; height: 80px; background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C342.1,32.17,407.79,44.38,475.49,46.29c69.35,2,138.7-11.93,209.4-30.86,70.1-18.79,141.5-28.85,212.1-28.85,70.6,0,142,10.06,212.1,28.85,70.7,18.93,140,32.86,209.4,30.86,67.7-1.91,133.39-14.12,200-20.58,54.41-5.37,110.21-15.34,158-37.5V0Z" fill="rgba(0,191,255,0.1)"/></svg>'); background-size: 50% 100%; animation: waveMove 10s linear infinite; opacity: 0.5; pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: '<div class="omni-wave"></div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.2;">💧</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🌊</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🚰</div>' }
            ]
        },
        '04-02': { // 世界自闭症日
            logo: { type: 'text', text: 'AUTISM AWARENESS', colors:['#0000ff', '#4169e1', '#87ceeb', '#ffffff'] }, 
            theme: { 
                bgBase: '#020514', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '65, 105, 225', 
                avatarGrad1: '#000080', avatarGrad2: '#4169e1', ambient1: 'rgba(65, 105, 225, 0.2)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    @keyframes puzzleFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                    .search-box { border: 1px solid rgba(65,105,225,0.4); box-shadow: 0 0 15px rgba(65,105,225,0.2); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: puzzleFloat 3s infinite;">🧩</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: puzzleFloat 3.5s infinite 0.5s;">🧩</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">💙</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🤍</div>' }
            ]
        },
        '04-26': { // 世界知识产权日
            logo: { type: 'text', text: 'IP DAY', colors:['#4169e1', '#2e8b57', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#050a15', textMain: '#e6f0ff', textMuted: '#87ceeb', accentRgb: '65, 105, 225', 
                avatarGrad1: '#4169e1', avatarGrad2: '#ffd700', ambient1: 'rgba(65, 105, 225, 0.15)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes lockSpin { 100% { transform: rotate(360deg); } }
                    .search-box { border: 1px solid rgba(65,105,225,0.4); background: rgba(255,255,255,0.03); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25; animation: lockSpin 10s linear infinite;">🔒</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">©️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">📝</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">💡</div>' }
            ]
        },
        '05-18': { // 国际博物馆日
            logo: { type: 'text', text: 'MUSEUM DAY', colors:['#8b4513', '#d2b48c', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a0500', textMain: '#f5deb3', textMuted: '#d2b48c', accentRgb: '139, 69, 19', 
                avatarGrad1: '#3e1f00', avatarGrad2: '#8b4513', ambient1: 'rgba(139, 69, 19, 0.15)', ambient2: 'rgba(210, 180, 140, 0.1)',
                customCss: `
                    @keyframes artifactFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                    .search-box { border: 1px solid rgba(139,69,19,0.4); background: rgba(255,255,255,0.03); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25; animation: artifactFloat 3s infinite;">🏺</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: artifactFloat 3.5s infinite 0.5s;">🗿</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">📜</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🏛️</div>' }
            ]
        },
        '05-22': { // 国际生物多样性日
            logo: { type: 'text', text: 'BIODIVERSITY DAY', colors:['#228b22', '#32cd32', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#051005', textMain: '#e6ffe6', textMuted: '#90ee90', accentRgb: '34, 139, 34', 
                avatarGrad1: '#006400', avatarGrad2: '#32cd32', ambient1: 'rgba(34, 139, 34, 0.2)', ambient2: 'rgba(50, 205, 50, 0.15)',
                customCss: `
                    @keyframes leafSway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:15%; font-size:50px; transform-origin: bottom center; opacity:0.25; animation: leafSway 4s infinite;">🌳</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:75%; font-size:50px; transform-origin: bottom center; opacity:0.25; animation: leafSway 4.5s infinite 0.5s;">🌴</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:40px; opacity:0.2;">🐦</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🐠</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🦋</div>' }
            ]
        },
        '05-31': { // 世界无烟日
            logo: { type: 'text', text: 'NO TOBACCO DAY', colors:['#ff0000', '#ffffff', '#00ff00', '#8b4513'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#ffffff', textMuted: '#ff9999', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#00ff00', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(0, 255, 0, 0.1)',
                customCss: `
                    @keyframes noSmoke { 0% { transform: translateY(0) scale(1); opacity: 0.6; } 100% { transform: translateY(-40px) scale(1.5); opacity: 0; } }
                    .search-box { border: 2px solid #ff0000; box-shadow: 0 0 20px rgba(255,0,0,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25;">🚭</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: noSmoke 3s infinite;">💨</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">❤️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🌿</div>' }
            ]
        },
        '06-14': { // 世界献血者日
            logo: { type: 'text', text: 'BLOOD DONOR DAY', colors:['#ff0000', '#ffffff', '#ffb3ba', '#ffd700'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#ffffff', textMuted: '#ffb3ba', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes heartbeat { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.3); } 30% { transform: scale(1); } 45% { transform: scale(1.15); } 60% { transform: scale(1); } }
                    .search-box { border: 2px solid #ff0000; box-shadow: 0 0 20px rgba(255,0,0,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25; animation: heartbeat 1.5s infinite;">❤️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🩸</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🏥</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🤍</div>' }
            ]
        },
        '07-02': { // 世界UFO日
            logo: { type: 'text', text: 'UFO DAY', colors:['#00ff00', '#00ffff', '#ffffff', '#800080'] }, 
            theme: { 
                bgBase: '#00001a', textMain: '#e6e6fa', textMuted: '#9370db', accentRgb: '0, 255, 0', 
                avatarGrad1: '#4b0082', avatarGrad2: '#00ff00', ambient1: 'rgba(0, 255, 0, 0.15)', ambient2: 'rgba(147, 112, 219, 0.15)',
                customCss: `
                    @keyframes ufoFly { 0% { transform: translateX(110vw) translateY(0); } 50% { transform: translateX(40vw) translateY(-20px); } 100% { transform: translateX(-20vw) translateY(0); } }
                    @keyframes beamGlow { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.3; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; right:-10%; font-size:50px; opacity:0.3; animation: ufoFly 20s linear infinite;">🛸</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:15%; width: 100px; height: 200px; background: linear-gradient(to bottom, rgba(0,255,0,0.3), transparent); opacity:0; animation: beamGlow 20s linear infinite; pointer-events: none;"></div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:15%; font-size:45px; opacity:0.2;">🌌</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">👽</div>' }
            ]
        },
        '07-17': { // 世界表情包日
            logo: { type: 'text', text: 'EMOJI DAY', colors:['#ffd700', '#ffaa00', '#ffeb3b', '#ffffff'] }, 
            theme: { 
                bgBase: '#141400', textMain: '#fffae6', textMuted: '#ffe066', accentRgb: '255, 215, 0', 
                avatarGrad1: '#ffaa00', avatarGrad2: '#ffeb3b', ambient1: 'rgba(255, 215, 0, 0.15)', ambient2: 'rgba(255, 170, 0, 0.15)',
                customCss: `
                    @keyframes popEmoji { 0% { transform: scale(0); opacity:0; } 50% { transform: scale(1.2); opacity:0.6; } 100% { transform: scale(1); opacity:0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:20%; font-size:40px; opacity:0; animation: popEmoji 4s infinite 0s;">😂</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; right:15%; font-size:45px; opacity:0; animation: popEmoji 5s infinite 1.5s;">😎</div>' },
                { type: 'html', content: '<div style="position:fixed; top:35%; right:25%; font-size:35px; opacity:0; animation: popEmoji 4.5s infinite 3s;">🤔</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:30%; font-size:50px; opacity:0; animation: popEmoji 6s infinite 2s;">🎉</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:50%; font-size:45px; opacity:0; animation: popEmoji 5.5s infinite 4s;">🥳</div>' }
            ]
        },
        '08-13': { // 国际左撇子日
            logo: { type: 'text', text: 'LEFT HANDERS DAY', colors:['#4169e1', '#87ceeb', '#ffffff', '#ffd700'] }, 
            theme: { 
                bgBase: '#050a15', textMain: '#e6f0ff', textMuted: '#add8e6', accentRgb: '65, 105, 225', 
                avatarGrad1: '#000080', avatarGrad2: '#4169e1', ambient1: 'rgba(65, 105, 225, 0.2)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    .search-input { direction: rtl; }
                    @keyframes leftWave { 0%, 100% { transform: rotate(10deg); } 50% { transform: rotate(-10deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25; animation: leftWave 3s infinite;">👈</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">✍️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🤛</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">♻️</div>' }
            ]
        },
        '08-26': { // 国际狗狗日
            logo: { type: 'text', text: 'DOG DAY', colors:['#8b4513', '#d2b48c', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#140c08', textMain: '#f5deb3', textMuted: '#d2b48c', accentRgb: '139, 69, 19', 
                avatarGrad1: '#3e1f00', avatarGrad2: '#8b4513', ambient1: 'rgba(139, 69, 19, 0.15)', ambient2: 'rgba(210, 180, 140, 0.1)',
                customCss: `
                    @keyframes tailWag { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
                    @keyframes pawPrint { 0% { opacity: 0; transform: scale(0.5); } 50% { opacity: 0.3; transform: scale(1); } 100% { opacity: 0; transform: scale(1.2); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:50px; opacity:0.25; animation: tailWag 0.5s infinite;">🐕</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🐶</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:20%; font-size:24px; opacity:0; animation: pawPrint 4s infinite 0s;">🐾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:25%; font-size:24px; opacity:0; animation: pawPrint 4s infinite 1s;">🐾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:30%; left:30%; font-size:24px; opacity:0; animation: pawPrint 4s infinite 2s;">🐾</div>' }
            ]
        },
        '09-21': { // 国际和平日
            logo: { type: 'text', text: 'WORLD PEACE DAY', colors:['#ffffff', '#87ceeb', '#98fb98', '#ffd700'] }, 
            theme: { 
                bgBase: '#020a14', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '255, 255, 255', 
                avatarGrad1: '#4682b4', avatarGrad2: '#98fb98', ambient1: 'rgba(135, 206, 235, 0.15)', ambient2: 'rgba(152, 251, 152, 0.15)',
                customCss: `
                    @keyframes doveFly { 0% { transform: translateX(-10vw) translateY(0); } 100% { transform: translateX(110vw) translateY(-20px); } }
                    .search-box { border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 0 15px rgba(135,206,235,0.2); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:-10%; font-size:45px; opacity:0.25; animation: doveFly 25s linear infinite;">🕊️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:30%; left:-10%; font-size:40px; opacity:0.2; animation: doveFly 30s linear infinite 5s;">🕊️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:20%; font-size:45px; opacity:0.2;">☮️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:40px; opacity:0.2;">🤍</div>' }
            ]
        },
        '10-16': { // 世界粮食日
            logo: { type: 'text', text: 'WORLD FOOD DAY', colors:['#ffd700', '#d4af37', '#228b22', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a0f05', textMain: '#fff8e6', textMuted: '#d4af37', accentRgb: '212, 175, 55', 
                avatarGrad1: '#b8860b', avatarGrad2: '#228b22', ambient1: 'rgba(212, 175, 55, 0.2)', ambient2: 'rgba(34, 139, 34, 0.15)',
                customCss: `
                    @keyframes wheatSway { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:15%; font-size:60px; opacity:0.3; transform-origin: bottom center; animation: wheatSway 4s infinite;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:0; left:75%; font-size:60px; opacity:0.3; transform-origin: bottom center; animation: wheatSway 4.5s infinite 0.5s;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.2;">🍞</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🍚</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🌽</div>' }
            ]
        },
        '11-19': { // 世界厕所日
            logo: { type: 'text', text: 'TOILET DAY', colors:['#4169e1', '#87ceeb', '#ffffff', '#98fb98'] }, 
            theme: { 
                bgBase: '#020a14', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '65, 105, 225', 
                avatarGrad1: '#000080', avatarGrad2: '#4169e1', ambient1: 'rgba(65, 105, 225, 0.15)', ambient2: 'rgba(152, 251, 152, 0.1)',
                customCss: `
                    @keyframes bubbleRise { 0% { transform: translateY(0) scale(1); opacity: 0.6; } 100% { transform: translateY(-30px) scale(1.2); opacity: 0; } }
                    .search-box { border: 1px solid rgba(65,105,225,0.4); border-radius: 50px; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25;">🚽</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2; animation: bubbleRise 3s infinite;">💧</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🧼</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🚰</div>' }
            ]
        },
        '12-01': { // 世界艾滋病日
            logo: { type: 'text', text: 'AIDS AWARENESS', colors:['#ff0000', '#ffffff', '#ffb3ba', '#ffd700'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#ffffff', textMuted: '#ffb3ba', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    @keyframes ribbonFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                    .search-box { border: 2px solid #ff0000; box-shadow: 0 0 20px rgba(255,0,0,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25; animation: ribbonFloat 3s infinite;">🎗️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">❤️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🤍</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🏥</div>' }
            ]
        },
        '12-03': { // 国际残疾人日
            logo: { type: 'text', text: 'INTERNATIONAL DAY OF PERSONS WITH DISABILITIES', colors:['#4169e1', '#87ceeb', '#ffffff', '#ffd700'] }, 
            theme: { 
                bgBase: '#020514', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '65, 105, 225', 
                avatarGrad1: '#000080', avatarGrad2: '#4169e1', ambient1: 'rgba(65, 105, 225, 0.2)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    @keyframes wheelSpin { 100% { transform: rotate(360deg); } }
                    .search-box { border: 1px solid rgba(65,105,225,0.4); box-shadow: 0 0 15px rgba(65,105,225,0.2); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25; animation: wheelSpin 10s linear infinite;">♿</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🤍</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">💙</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">👐</div>' }
            ]
        },
        '12-05': { // 国际志愿者日
            logo: { type: 'text', text: 'VOLUNTEER DAY', colors:['#ff0000', '#ffffff', '#ffd700', '#00ff00'] }, 
            theme: { 
                bgBase: '#0a0000', textMain: '#ffffff', textMuted: '#ff9999', accentRgb: '255, 0, 0', 
                avatarGrad1: '#b22222', avatarGrad2: '#00ff00', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(0, 255, 0, 0.1)',
                customCss: `
                    @keyframes heartBeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                    .search-box { border: 2px solid #ff0000; box-shadow: 0 0 20px rgba(255,0,0,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.25; animation: heartBeat 1.5s infinite;">❤️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🤝</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🤲</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🌍</div>' }
            ]
        },

        // ==============================================
        // 【地域特色/少数民族节日补充】
        // ==============================================
        '04-13': { // 傣族泼水节
            logo: { type: 'text', text: 'WATER SPLASHING FESTIVAL', colors:['#00bfff', '#1e90ff', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#000b1a', textMain: '#e6f2ff', textMuted: '#87cefa', accentRgb: '0, 191, 255', 
                avatarGrad1: '#000080', avatarGrad2: '#00bfff', ambient1: 'rgba(0, 191, 255, 0.3)', ambient2: 'rgba(255, 215, 0, 0.15)',
                customCss: `
                    @keyframes waterSplash { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
                    .omni-water { position: fixed; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,191,255,0.6); box-shadow: 0 0 10px rgba(0,191,255,0.8); pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-water" style="top: 20%; left: 15%; animation: waterSplash 2s ease-out infinite 0s;"></div>
                    <div class="omni-water" style="top: 25%; left: 35%; animation: waterSplash 2.5s ease-out infinite 0.5s;"></div>
                    <div class="omni-water" style="top: 18%; left: 65%; animation: waterSplash 2s ease-out infinite 1s;"></div>
                    <div class="omni-water" style="top: 30%; left: 85%; animation: waterSplash 2.5s ease-out infinite 1.5s;"></div>
                `},
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.25;">💦</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🎭</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🎶</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:40px; opacity:0.15;">🌸</div>' }
            ]
        },
        '07-15': { // 蒙古族那达慕大会
            logo: { type: 'text', text: 'NADAM FAIR', colors:['#0000ff', '#ff0000', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#050a14', textMain: '#ffffff', textMuted: '#add8e6', accentRgb: '0, 0, 255', 
                avatarGrad1: '#000080', avatarGrad2: '#ff0000', ambient1: 'rgba(0, 0, 255, 0.2)', ambient2: 'rgba(255, 0, 0, 0.15)',
                customCss: `
                    @keyframes horseRun { 0% { transform: translateX(110vw); } 100% { transform: translateX(-20vw); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; right:-10%; font-size:55px; opacity:0.3; animation: horseRun 15s linear infinite;">🐎</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:-10%; font-size:45px; opacity:0.25; animation: horseRun 18s linear infinite 2s;">🐎</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.2;">🎯</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:40px; opacity:0.2;">🤼</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🎶</div>' }
            ]
        },
        '11-28': { // 感恩节 (2024年日期)
            logo: { type: 'text', text: 'GIVE THANKS', colors:['#ff6347', '#ffa500', '#8b4513', '#ffff00'] }, 
            theme: { 
                bgBase: '#1a0f05', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 99, 71', 
                avatarGrad1: '#8b4513', avatarGrad2: '#ff6347', ambient1: 'rgba(255, 99, 71, 0.2)', ambient2: 'rgba(255, 165, 0, 0.15)',
                customCss: `
                    @keyframes leafSway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:12%; font-size:40px; opacity:0.2;">🦃</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:10%; font-size:35px; opacity:0.15; animation: leafSway 3s ease-in-out infinite;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:35px; opacity:0.18;">🎃</div>' }
            ]
        },
        'L06-06': { // 天贶节 / 姑姑节 (民间俗语：六月六，晒红绿 / 晒书晒衣)
            logo: { type: 'text', text: 'SUNNING BOOKS', colors:['#ffd700', '#ff8c00', '#d2b48c', '#ffffff'] }, 
            theme: { 
                bgBase: '#140c00', textMain: '#fffce6', textMuted: '#d2b48c', accentRgb: '255, 215, 0', 
                avatarGrad1: '#b8860b', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 215, 0, 0.2)', ambient2: 'rgba(210, 180, 140, 0.15)',
                customCss: `
                    @keyframes sunBake { 0%, 100% { filter: brightness(1) drop-shadow(0 0 10px rgba(255,215,0,0.3)); } 50% { filter: brightness(1.2) drop-shadow(0 0 25px rgba(255,215,0,0.6)); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:10%; right:15%; font-size:60px; opacity:0.4; animation: sunBake 5s infinite;">☀️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">📚</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; left:25%; font-size:40px; opacity:0.2;">👘</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:25%; font-size:35px; opacity:0.2;">📜</div>' }
            ]
        },
        '04-24': { // 中国航天日
            logo: { type: 'text', text: 'CHINA SPACE', colors:['#ff0000', '#ffd700', '#ffffff', '#87ceeb'] }, 
            theme: { 
                bgBase: '#020410', textMain: '#f0f4f8', textMuted: '#87ceeb', accentRgb: '255, 0, 0', 
                avatarGrad1: '#000080', avatarGrad2: '#ff0000', ambient1: 'rgba(0, 0, 128, 0.3)', ambient2: 'rgba(255, 0, 0, 0.15)',
                customCss: `
                    @keyframes orbit { 0% { transform: rotate(0deg) translateX(40vw) rotate(0deg); } 100% { transform: rotate(360deg) translateX(40vw) rotate(-360deg); } }
                    .search-box { box-shadow: 0 0 20px rgba(255, 0, 0, 0.15); border: 1px solid rgba(255, 215, 0, 0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:50%; left:50%; width:1px; height:1px; opacity:0.2; animation: orbit 20s linear infinite;"><div style="font-size:40px; transform: translate(-50%, -50%);">🛰️</div></div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:10%; font-size:50px; opacity:0.3; transform: rotate(45deg);">🚀</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:45px; opacity:0.2;">👨‍🚀</div>' },
                { type: 'html', content: '<div style="position:fixed; top:35%; left:15%; font-size:35px; opacity:0.15;">🌌</div>' }
            ]
        },
        '05-17': { // 517 吃货节 (网络谐音节日)
            logo: { type: 'text', text: 'FOODIE FESTIVAL', colors:['#ff6347', '#ffa500', '#ffd700', '#ff8c00'] }, 
            theme: { 
                bgBase: '#1a0d00', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 140, 0', 
                avatarGrad1: '#ff4500', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 140, 0, 0.2)', ambient2: 'rgba(255, 99, 71, 0.15)',
                customCss: `
                    @keyframes bounceFood { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                    .search-box { border-bottom: 3px solid #ff8c00; background: rgba(255, 140, 0, 0.05); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:12%; font-size:50px; opacity:0.25; animation: bounceFood 2s infinite 0s;">🍔</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0.25; animation: bounceFood 2.5s infinite 0.5s;">🍜</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; right:20%; font-size:40px; opacity:0.2; animation: bounceFood 2.2s infinite 1s;">🍡</div>' },
                { type: 'html', content: '<div style="position:fixed; top:30%; left:20%; font-size:35px; opacity:0.2; animation: bounceFood 2.8s infinite 1.5s;">🥤</div>' }
            ]
        },
        '06-18': { // 618 年中大促
            logo: { type: 'text', text: '618 CARNIVAL', colors:['#ff0055', '#ff4500', '#ff00ff', '#ffffff'] }, 
            theme: { 
                bgBase: '#140005', textMain: '#fff0f5', textMuted: '#ff6699', accentRgb: '255, 0, 85', 
                avatarGrad1: '#cc0044', avatarGrad2: '#ff3388', ambient1: 'rgba(255, 0, 85, 0.25)', ambient2: 'rgba(255, 69, 0, 0.15)',
                customCss: `
                    @keyframes floatCoupon { 0% { transform: translateY(0) rotate(-5deg); opacity: 0.1; } 50% { transform: translateY(-30px) rotate(5deg); opacity: 0.3; } 100% { transform: translateY(0) rotate(-5deg); opacity: 0.1; } }
                    .search-box { border: 2px solid #ff0055; box-shadow: 0 0 20px rgba(255, 0, 85, 0.3); }
                    .action-btn { background: linear-gradient(90deg, #ff0055, #ff4500); color: white; border: none; font-weight: bold; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:10%; font-size:55px; opacity:0.2; transform-origin: center; animation: floatCoupon 3s infinite 0s;">🛍️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:10%; font-size:50px; opacity:0.2; animation: floatCoupon 4s infinite 1s;">💰</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:40px; font-weight:900; color:#ff0055; opacity:0.2; animation: floatCoupon 3.5s infinite 0.5s;">%</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:45px; opacity:0.15; animation: floatCoupon 2.5s infinite 1.5s;">🛒</div>' }
            ]
        },
        '12-12': { // 双十二购物狂欢
            logo: { type: 'text', text: '12.12 FIESTA', colors:['#00e5ff', '#0077ff', '#ff00ff', '#ffffff'] }, 
            theme: { 
                bgBase: '#020512', textMain: '#f0f8ff', textMuted: '#00e5ff', accentRgb: '0, 229, 255', 
                avatarGrad1: '#0044cc', avatarGrad2: '#00e5ff', ambient1: 'rgba(0, 229, 255, 0.2)', ambient2: 'rgba(255, 0, 255, 0.15)',
                customCss: `
                    @keyframes parachuteDrop { 0% { transform: translateY(-15vh) translateX(0); opacity: 0; } 20% { opacity: 0.8; } 80% { opacity: 0.8; } 100% { transform: translateY(110vh) translateX(20px); opacity: 0; } }
                    .search-box { border: 2px dashed #00e5ff; background: rgba(0, 229, 255, 0.05); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; left:15%; font-size:45px; animation: parachuteDrop 10s linear infinite 0s;">🪂</div>' },
                { type: 'html', content: '<div style="position:fixed; left:50%; font-size:40px; animation: parachuteDrop 12s linear infinite 4s;">📦</div>' },
                { type: 'html', content: '<div style="position:fixed; left:80%; font-size:50px; animation: parachuteDrop 14s linear infinite 2s;">🪂</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">🎁</div>' }
            ]
        },
        '07-23': { // 夏日大暑 / 雪碧特饮主题
    logo: { 
        type: 'text', 
        text: 'SUMMER SPRITE', 
        // 采用雪碧经典的：纯白、柠檬黄、青柠绿渐变
        colors:['#ffffff', '#e5ff00', '#00ff66', '#ffffff'] 
    }, 
    theme: { 
        // 极深的清凉薄荷绿作为底色，突出气泡和高光
        bgBase: '#001a0e', 
        textMain: '#ffffff', 
        textMuted: '#ccff00', 
        accentRgb: '0, 255, 100', 
        avatarGrad1: '#008a3d', 
        avatarGrad2: '#e5ff00', 
        ambient1: 'rgba(0, 255, 100, 0.25)', // 青绿光晕
        ambient2: 'rgba(229, 255, 0, 0.15)',  // 柠檬黄光晕
        customCss: `
            /* 气泡上升动画 */
            @keyframes bubbleRise {
                0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
                20% { opacity: 0.8; }
                100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
            }
            /* 气泡左右摇摆，模拟真实碳酸气泡 */
            @keyframes sway {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(25px); }
            }
            /* 冰块和柠檬的清凉悬浮动画 */
            @keyframes iceFloat {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-15px) rotate(8deg); }
            }
            
            /* 搜索框：磨砂玻璃与发光青柠边框 */
            .search-box { 
                border: 2px solid rgba(0, 255, 100, 0.5); 
                background: rgba(0, 30, 15, 0.4);
                backdrop-filter: blur(8px);
                box-shadow: 0 0 20px rgba(0, 255, 100, 0.2), inset 0 0 15px rgba(229, 255, 0, 0.1); 
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            /* 搜索框交互：鼠标悬浮时高亮且微微放大 */
            .search-box:hover {
                border-color: #e5ff00;
                box-shadow: 0 0 30px rgba(229, 255, 0, 0.4), inset 0 0 20px rgba(0, 255, 100, 0.3);
                transform: scale(1.02);
            }

            /* 雪碧气泡样式与交互：鼠标滑过气泡时会“啵”地破裂消失 */
            .sprite-bubble {
                position: fixed;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.2) 50%, transparent 80%);
                box-shadow: inset -2px -2px 8px rgba(0,255,100,0.4);
                pointer-events: auto;
                cursor: crosshair;
                transition: transform 0.1s, opacity 0.1s;
                z-index: 0;
            }
            .sprite-bubble:hover {
                transform: scale(1.8) !important;
                opacity: 0 !important;
            }

            /* 夏日元素交互：鼠标放上去会弹动 */
            .summer-element {
                position: fixed;
                pointer-events: auto;
                cursor: pointer;
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
            }
            .summer-element:hover {
                transform: scale(1.4) rotate(15deg) !important;
            }
        `
    },
    extensions:[
        // --- 🧊🍋 夏日实体元素 (带悬浮动画和交互) ---
        { type: 'html', content: '<div class="summer-element" style="top:15%; left:12%; font-size:55px; animation: iceFloat 6s infinite ease-in-out;">🧊</div>' },
        { type: 'html', content: '<div class="summer-element" style="top:25%; right:15%; font-size:60px; animation: iceFloat 5s infinite ease-in-out 1s;">🍋</div>' },
        { type: 'html', content: '<div class="summer-element" style="bottom:20%; left:16%; font-size:50px; animation: iceFloat 7s infinite ease-in-out 2s;">💦</div>' },
        { type: 'html', content: '<div class="summer-element" style="bottom:15%; right:12%; font-size:55px; animation: iceFloat 4s infinite ease-in-out 0.5s;">🧊</div>' },

        // --- 🫧 动态碳酸气泡 (不同大小、速度、延迟错开) ---
        { type: 'html', content: '<div class="sprite-bubble" style="left:10%; width:20px; height:20px; animation: bubbleRise 4s infinite ease-in, sway 2s infinite ease-in-out;"></div>' },
        { type: 'html', content: '<div class="sprite-bubble" style="left:25%; width:35px; height:35px; animation: bubbleRise 6s infinite ease-in 1s, sway 3s infinite ease-in-out 0.5s;"></div>' },
        { type: 'html', content: '<div class="sprite-bubble" style="left:45%; width:15px; height:15px; animation: bubbleRise 3.5s infinite ease-in 2s, sway 1.5s infinite ease-in-out 1s;"></div>' },
        { type: 'html', content: '<div class="sprite-bubble" style="left:65%; width:28px; height:28px; animation: bubbleRise 5s infinite ease-in 0.3s, sway 2.5s infinite ease-in-out 1.5s;"></div>' },
        { type: 'html', content: '<div class="sprite-bubble" style="left:85%; width:45px; height:45px; animation: bubbleRise 7s infinite ease-in 0.8s, sway 4s infinite ease-in-out 0.2s;"></div>' }
    ]
},
        '03-21': { // 世界睡眠日 (中国广泛关注的“特困生”自嘲日)
            logo: { type: 'text', text: 'DEEP SLEEP', colors:['#9370db', '#8a2be2', '#4b0082', '#ffffff'] }, 
            theme: { 
                bgBase: '#02020a', textMain: '#e6e6fa', textMuted: '#9370db', accentRgb: '147, 112, 219', 
                avatarGrad1: '#191970', avatarGrad2: '#8a2be2', ambient1: 'rgba(147, 112, 219, 0.15)', ambient2: 'rgba(75, 0, 130, 0.2)',
                customCss: `
                    @keyframes floatZzz { 0% { transform: translate(0, 0) scale(0.8); opacity: 0; } 50% { opacity: 0.6; } 100% { transform: translate(20px, -40px) scale(1.5); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:55px; opacity:0.2;">🌙</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.2;">🛌</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:18%; font-size:24px; color:#9370db; font-weight:bold; animation: floatZzz 3s ease-in infinite 0s;">z</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:23%; left:20%; font-size:28px; color:#9370db; font-weight:bold; animation: floatZzz 3s ease-in infinite 1s;">Z</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:27%; left:23%; font-size:32px; color:#9370db; font-weight:bold; animation: floatZzz 3s ease-in infinite 2s;">Z</div>' }
            ]
        },
        '10-24': { // 中国 1024 程序员节专属定制版 (覆盖原通用版或直接替代)
            logo: { type: 'text', text: '1024 GEEK DAY', colors:['#00ff00', '#00ffff', '#008000', '#ffffff'] }, 
            theme: { 
                bgBase: '#000500', textMain: '#00ff00', textMuted: '#00aa00', accentRgb: '0, 255, 0', 
                avatarGrad1: '#003300', avatarGrad2: '#00ff00', ambient1: 'rgba(0, 255, 0, 0.1)', ambient2: 'rgba(0, 255, 255, 0.1)',
                customCss: `
                    * { font-family: 'Consolas', 'Courier New', monospace !important; } 
                    .search-box { border-radius: 0; border: 1px solid #00ff00; background: rgba(0,255,0,0.05); box-shadow: 0 0 10px rgba(0,255,0,0.2); } 
                    @keyframes blinkCursor { 50% { opacity: 0; } }
                    .text-logo::after { content: ' _'; animation: blinkCursor 1s step-end infinite; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.2;">💻</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.2;">⌨️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; left:20%; font-size:30px; color:#00ff00; opacity:0.3; font-weight:bold;">1GB = 1024MB</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.2;">🐛</div>' } // Debug
            ]
        },
        '04-23': { // 世界读书日 (World Book Day)
            logo: { type: 'text', text: 'WORLD BOOK DAY', colors:['#d2b48c', '#8b4513', '#a0522d', '#f5deb3'] }, 
            theme: { 
                bgBase: '#1a1410', textMain: '#fdf5e6', textMuted: '#d2b48c', accentRgb: '210, 180, 140', 
                avatarGrad1: '#8b4513', avatarGrad2: '#d2b48c', ambient1: 'rgba(139, 69, 19, 0.2)', ambient2: 'rgba(210, 180, 140, 0.1)',
                customCss: `
                    @keyframes floatPage { 0% { transform: translateY(0) rotate(-5deg); opacity:0; } 50% { opacity:0.5; } 100% { transform: translateY(-50vh) rotate(15deg); opacity:0; } }
                    .search-box { background: rgba(253, 245, 230, 0.05); border: 1px solid rgba(210, 180, 140, 0.4); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; right:15%; font-size:50px; opacity:0.2;">📖</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:35px; opacity:0; animation: floatPage 8s linear infinite 0s;">📄</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:30%; font-size:40px; opacity:0; animation: floatPage 10s linear infinite 4s;">📜</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.15;">☕</div>' }
            ]
        },
        '05-25': { // 毛巾日 (Towel Day - 纪念道格拉斯·亚当斯)
            logo: { type: 'text', text: 'DONT PANIC', colors:['#4285F4', '#34A853', '#FBBC05', '#EA4335'] }, 
            theme: { 
                bgBase: '#00001a', textMain: '#e6e6fa', textMuted: '#87ceeb', accentRgb: '66, 133, 244', 
                avatarGrad1: '#000080', avatarGrad2: '#4285F4', ambient1: 'rgba(66, 133, 244, 0.2)', ambient2: 'rgba(234, 67, 53, 0.1)',
                customCss: `
                    .text-logo { font-weight: 900; letter-spacing: 5px; text-transform: uppercase; }
                    @keyframes floatGalaxy { 0% { transform: rotate(0deg) scale(0.8); } 50% { transform: rotate(180deg) scale(1.2); } 100% { transform: rotate(360deg) scale(0.8); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:50px; opacity:0.2; transform: rotate(-15deg);">🧻</div>' }, // 假装是毛巾
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:50px; opacity:0.15; animation: floatGalaxy 20s linear infinite;">🌌</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:40px; opacity:0.15;">👍</div>' }
            ]
        },
        // --- 极客节日、全球趣味纪念日与东南亚流行文化补充 ---

        '01-28': { // 数据隐私日 (Data Privacy Day)
            logo: { type: 'text', text: 'PRIVACY MATRIX', colors:['#4b5563', '#9ca3af', '#e5e7eb', '#ffffff'] }, 
            theme: { 
                bgBase: '#030712', textMain: '#f3f4f6', textMuted: '#9ca3af', accentRgb: '156, 163, 175', 
                avatarGrad1: '#1f2937', avatarGrad2: '#4b5563', ambient1: 'rgba(75, 85, 99, 0.2)', ambient2: 'rgba(31, 41, 55, 0.1)',
                customCss: `
                    @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
                    body::before { content:''; position:fixed; top:0; left:0; width:100vw; height:5px; background:rgba(255,255,255,0.1); box-shadow:0 0 10px rgba(255,255,255,0.2); animation: scanline 4s linear infinite; z-index:999; pointer-events:none; }
                    .search-input { filter: blur(0.5px); transition: filter 0.3s; }
                    .search-input:focus { filter: blur(0); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:15%; font-size:45px; opacity:0.15;">🛡️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:15%; font-size:40px; opacity:0.15;">👁️‍🗨️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:20%; font-size:35px; opacity:0.15;">🔒</div>' }
            ]
        },
        '02-29': { // 闰年专属日 (Leap Day)
            logo: { type: 'text', text: 'LEAP MATRIX', colors:['#32cd32', '#00fa9a', '#7cfc00', '#adff2f'] }, 
            theme: { 
                bgBase: '#051205', textMain: '#f0fff0', textMuted: '#98fb98', accentRgb: '50, 205, 50', 
                avatarGrad1: '#006400', avatarGrad2: '#32cd32', ambient1: 'rgba(50, 205, 50, 0.15)', ambient2: 'rgba(0, 250, 154, 0.1)',
                customCss: `
                    @keyframes leapJump { 0%, 100% { transform: translateY(0) scale(1, 1); } 40% { transform: translateY(-30px) scale(0.9, 1.1); } 50% { transform: translateY(-40px) scale(1, 1); } 60% { transform: translateY(-30px) scale(1.1, 0.9); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:20%; font-size:45px; opacity:0.25; animation: leapJump 2s infinite 0s;">🐸</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; right:20%; font-size:40px; opacity:0.2; animation: leapJump 2.5s infinite 1s;">🦘</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:35px; opacity:0.15;">📅</div>' }
            ]
        },
        '04-12': { // 载人空间飞行国际日 / 尤里之夜 (Yuri's Night)
            logo: { type: 'text', text: 'ORBITAL MATRIX', colors:['#ff8c00', '#ffd700', '#ffffff', '#87ceeb'] }, 
            theme: { 
                bgBase: '#000008', textMain: '#e6f2ff', textMuted: '#87ceeb', accentRgb: '255, 140, 0', 
                avatarGrad1: '#4b0082', avatarGrad2: '#ff8c00', ambient1: 'rgba(255, 140, 0, 0.15)', ambient2: 'rgba(135, 206, 235, 0.1)',
                customCss: `
                    @keyframes rocketLaunch { 0% { transform: translateY(110vh) scale(0.5); opacity:0; } 10% { opacity:1; } 100% { transform: translateY(-20vh) scale(1.5); opacity:0; } }
                    .search-box { box-shadow: 0 5px 20px rgba(255,140,0,0.2); border-bottom: 2px solid #ff8c00; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:-10%; left:15%; font-size:50px; opacity:0.3; animation: rocketLaunch 8s ease-in infinite 0s;">🚀</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0.2;">🌍</div>' },
                { type: 'html', content: '<div style="position:fixed; top:35%; right:25%; font-size:35px; opacity:0.15;">🛰️</div>' }
            ]
        },
        '04-25': { // 世界企鹅日 (World Penguin Day)
            logo: { type: 'text', text: 'PENGUIN MATRIX', colors:['#00ffff', '#ffffff', '#ffa500', '#0000FF'] }, 
            theme: { 
                bgBase: '#00101a', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '0, 255, 255', 
                avatarGrad1: '#000080', avatarGrad2: '#00ffff', ambient1: 'rgba(0, 255, 255, 0.18)', ambient2: 'rgba(255, 255, 255, 0.1)',
                customCss: `
                    @keyframes waddle { 0%, 100% { transform: rotate(-10deg) translateY(0); } 50% { transform: rotate(10deg) translateY(-5px); } }
                    .search-box { border-radius: 20px; border: 2px solid rgba(255,255,255,0.4); background: rgba(0,0,0,0.4); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:20%; font-size:50px; opacity:0.25; transform-origin: bottom center; animation: waddle 1s infinite;">🐧</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:26%; font-size:40px; opacity:0.2; transform-origin: bottom center; animation: waddle 1s infinite 0.5s;">🐧</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0.15;">🧊</div>' }
            ]
        },
        '05-16': { // 马来西亚教师节 (Hari Guru)
            logo: { type: 'text', text: 'TERIMA KASIH CIKGU', colors:['#ff6347', '#ffd700', '#8fbc8f', '#ffffff'] }, 
            theme: { 
                bgBase: '#1a0d00', textMain: '#fff8f0', textMuted: '#ffb380', accentRgb: '255, 99, 71', 
                avatarGrad1: '#8b4513', avatarGrad2: '#ff6347', ambient1: 'rgba(255, 99, 71, 0.15)', ambient2: 'rgba(255, 215, 0, 0.1)',
                customCss: `
                    .search-box { background: rgba(255, 255, 255, 0.05); border: 1px dashed rgba(255, 215, 0, 0.5); }
                    @keyframes floatBook { 0% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(5deg); } 100% { transform: translateY(0) rotate(0deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.2; animation: floatBook 4s infinite;">📚</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">👩‍🏫</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; left:20%; font-size:35px; opacity:0.15;">🍎</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:40px; opacity:0.15;">🏆</div>' }
            ]
        },
        '07-07': { // 世界巧克力日 (World Chocolate Day)
            logo: { type: 'text', text: 'CHOCO MATRIX', colors:['#8b4513', '#d2691e', '#a0522d', '#cd853f'] }, 
            theme: { 
                bgBase: '#140a00', textMain: '#fff3e6', textMuted: '#d2691e', accentRgb: '139, 69, 19', 
                avatarGrad1: '#3e1f00', avatarGrad2: '#8b4513', ambient1: 'rgba(139, 69, 19, 0.2)', ambient2: 'rgba(210, 105, 30, 0.1)',
                customCss: `
                    .search-box { background: #2b1400; border: 2px solid #8b4513; border-radius: 8px 8px 15px 15px; box-shadow: 0 10px 0px #3e1f00; transition: all 0.3s; }
                    .search-box:focus-within { transform: translateY(2px); box-shadow: 0 8px 0px #3e1f00; }
                    .text-logo { text-shadow: 0 3px 0 #3e1f00; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:15%; font-size:50px; opacity:0.2;">🍫</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:15%; font-size:45px; opacity:0.2;">🍩</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:20%; font-size:40px; opacity:0.15;">🍪</div>' }
            ]
        },
        '07-20': { // 人类月球日 / 阿波罗登月纪念 (Moon Landing Day)
            logo: { type: 'text', text: 'APOLLO MATRIX', colors:['#e0e0e0', '#ffffff', '#ffd700', '#aaaaaa'] }, 
            theme: { 
                bgBase: '#050505', textMain: '#f0f0f0', textMuted: '#aaaaaa', accentRgb: '224, 224, 224', 
                avatarGrad1: '#333333', avatarGrad2: '#cccccc', ambient1: 'rgba(255, 255, 255, 0.05)', ambient2: 'rgba(255, 215, 0, 0.05)',
                customCss: `
                    body { background-image: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 20%); }
                    @keyframes floatGravity { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
                    .search-box { background: rgba(255, 255, 255, 0.03); border: 1px solid #555; box-shadow: inset 0 0 10px rgba(0,0,0,0.8); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:80px; opacity:0.4; filter: drop-shadow(0 0 15px #fff);">🌕</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:15%; font-size:50px; opacity:0.25; animation: floatGravity 6s ease-in-out infinite;">🧑‍🚀</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; left:25%; font-size:35px; opacity:0.15; animation: floatGravity 8s ease-in-out infinite 2s;">🚀</div>' }
            ]
        },
        '09-09': { // 9.9 东南亚购物节 (9.9 Super Shopping Day)
            logo: { type: 'text', text: '9.9 SUPER SALE', colors:['#ff4500', '#ff8c00', '#ffff00', '#ffffff'] }, 
            theme: { 
                bgBase: '#1a0500', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 69, 0', 
                avatarGrad1: '#ff0000', avatarGrad2: '#ff8c00', ambient1: 'rgba(255, 69, 0, 0.25)', ambient2: 'rgba(255, 215, 0, 0.15)',
                customCss: `
                    @keyframes shakeCart { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
                    .search-box { border: 2px solid #ff4500; background: rgba(255,69,0,0.05); box-shadow: 0 0 20px rgba(255,69,0,0.3); }
                    .action-btn { background: linear-gradient(90deg, #ff4500, #ff8c00); color: white; border: none; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:55px; opacity:0.2; animation: shakeCart 2s infinite;">🛒</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:50px; opacity:0.2;">🎟️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; left:20%; font-size:40px; opacity:0.15;">🛍️</div>' }
            ]
        },
        '09-19': { // 国际海盗语言日 (Talk Like a Pirate Day)
            logo: { type: 'text', text: 'AHOY MATRIX', colors:['#ffd700', '#8b4513', '#ffffff', '#ff0000'] }, 
            theme: { 
                bgBase: '#0a0a0a', textMain: '#f5deb3', textMuted: '#cd853f', accentRgb: '218, 165, 32', 
                avatarGrad1: '#000000', avatarGrad2: '#8b4513', ambient1: 'rgba(139, 69, 19, 0.2)', ambient2: 'rgba(218, 165, 32, 0.1)',
                customCss: `
                    @keyframes shipRock { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
                    .search-box { border: 2px solid #8b4513; background: #1a1005; background-image: repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.2) 11px); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:55px; opacity:0.2; transform-origin: bottom center; animation: shipRock 4s ease-in-out infinite;">🏴‍☠️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:15%; font-size:45px; opacity:0.2;">⚓</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:40px; opacity:0.15;">🦜</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:20%; font-size:40px; opacity:0.15;">💰</div>' }
            ]
        },
        '10-04': { // 世界动物日 (World Animal Day)
            logo: { type: 'text', text: 'FAUNA MATRIX', colors:['#228b22', '#32cd32', '#8b4513', '#d2b48c'] }, 
            theme: { 
                bgBase: '#051005', textMain: '#e6ffe6', textMuted: '#90ee90', accentRgb: '34, 139, 34', 
                avatarGrad1: '#006400', avatarGrad2: '#8b4513', ambient1: 'rgba(34, 139, 34, 0.15)', ambient2: 'rgba(139, 69, 19, 0.1)',
                customCss: `
                    .search-box { border-bottom: 3px solid #8b4513; border-radius: 10px 10px 5px 5px; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:10%; font-size:45px; opacity:0.2;">🦁</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:50px; opacity:0.2;">🐘</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:40px; opacity:0.15;">🦒</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:25%; font-size:35px; opacity:0.15;">🐼</div>' }
            ]
        },
        '10-10': { // 10.10 / 世界精神卫生日 (World Mental Health Day)
            logo: { type: 'text', text: 'MINDFUL MATRIX', colors:['#98fb98', '#87cefa', '#dda0dd', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a1014', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '135, 206, 250', 
                avatarGrad1: '#8a2be2', avatarGrad2: '#87cefa', ambient1: 'rgba(135, 206, 250, 0.15)', ambient2: 'rgba(152, 251, 152, 0.1)',
                customCss: `
                    @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.5); opacity: 0.25; } }
                    body::after { content:''; position:fixed; top:50%; left:50%; width:40vw; height:40vw; background: radial-gradient(circle, rgba(135,206,250,0.5) 0%, transparent 70%); transform: translate(-50%, -50%); border-radius: 50%; pointer-events: none; z-index: -2; animation: breathe 8s ease-in-out infinite; }
                    .search-box { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(135, 206, 250, 0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:15%; font-size:45px; opacity:0.2;">🧠</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:15%; font-size:45px; opacity:0.2;">🧘‍♀️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🌿</div>' }
            ]
        },
        '12-26': { // 节礼日 (Boxing Day)
            logo: { type: 'text', text: 'BOXING DAY', colors:['#ff0000', '#00ff00', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#100000', textMain: '#ffffff', textMuted: '#ff9999', accentRgb: '255, 0, 0', 
                avatarGrad1: '#8b0000', avatarGrad2: '#006400', ambient1: 'rgba(255, 0, 0, 0.2)', ambient2: 'rgba(0, 255, 0, 0.1)',
                customCss: `
                    @keyframes boxBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
                    .search-box { border: 2px dashed #00ff00; background: rgba(255,0,0,0.1); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:55px; opacity:0.3; animation: boxBounce 2s ease-in-out infinite;">🎁</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0.2; animation: boxBounce 2.5s ease-in-out infinite 0.5s;">🛍️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; right:25%; font-size:40px; opacity:0.2; animation: boxBounce 2.2s ease-in-out infinite 1s;">🎀</div>' }
            ]
        },
        '06-21': { // 夏至 (Summer Solstice)
            logo: { type: 'text', text: 'SUMMER SOLSTICE', colors:['#ff4500', '#ff8c00', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#1a0800', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 140, 0', 
                avatarGrad1: '#ff0000', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 69, 0, 0.3)', ambient2: 'rgba(255, 215, 0, 0.2)',
                customCss: `
                    @keyframes sunRays { 0%, 100% { filter: drop-shadow(0 0 20px #ff8c00) brightness(1); } 50% { filter: drop-shadow(0 0 40px #ffd700) brightness(1.2); } }
                    .search-box { box-shadow: 0 0 30px rgba(255, 140, 0, 0.2); border-color: rgba(255, 140, 0, 0.5); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:10%; right:10%; font-size:80px; opacity:0.4; animation: sunRays 4s infinite;">☀️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:45px; opacity:0.2;">🍉</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; right:25%; font-size:35px; opacity:0.2;">蝉</div>' }
            ]
        },
        '07-17': { // 世界 Emoji 日 (World Emoji Day)
            logo: { type: 'text', text: 'EMOJI MATRIX', colors:['#ffd700', '#ffaa00', '#ffeb3b', '#fff59d'] }, 
            theme: { 
                bgBase: '#141400', textMain: '#fffae6', textMuted: '#ffe066', accentRgb: '255, 215, 0', 
                avatarGrad1: '#ffaa00', avatarGrad2: '#ffeb3b', ambient1: 'rgba(255, 215, 0, 0.15)', ambient2: 'rgba(255, 170, 0, 0.15)',
                customCss: `
                    @keyframes popEmoji { 0% { transform: scale(0); opacity:0; } 50% { transform: scale(1.2); opacity:0.6; } 100% { transform: scale(1); opacity:0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:20%; font-size:40px; opacity:0; animation: popEmoji 4s infinite 0s;">😂</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; right:15%; font-size:45px; opacity:0; animation: popEmoji 5s infinite 1.5s;">😎</div>' },
                { type: 'html', content: '<div style="position:fixed; top:35%; right:25%; font-size:35px; opacity:0; animation: popEmoji 4.5s infinite 3s;">🤔</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:30%; font-size:50px; opacity:0; animation: popEmoji 6s infinite 2s;">🎉</div>' }
            ]
        },
        '08-19': { // 世界摄影日 (World Photography Day)
            logo: { type: 'text', text: 'CAPTURE MATRIX', colors:['#ffffff', '#cccccc', '#999999', '#ffffff'] }, 
            theme: { 
                bgBase: '#080808', textMain: '#f0f0f0', textMuted: '#888888', accentRgb: '200, 200, 200', 
                avatarGrad1: '#333333', avatarGrad2: '#aaaaaa', ambient1: 'rgba(16, 185, 129, 0.06)', ambient2: 'rgba(6, 182, 212, 0.04)',
                customCss: `
                    @keyframes cameraFlash { 0%, 95%, 100% { background: transparent; } 96% { background: rgba(255,255,255,0.8); } 98% { background: rgba(255,255,255,0.4); } }
                    body::before { content:''; position:fixed; top:0; left:0; width:100vw; height:100vh; pointer-events:none; z-index:9999; animation: cameraFlash 7s infinite; }
                    .search-box { border-radius: 4px; border: 2px solid #444; background: #111; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:45px; opacity:0.3;">📷</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🎞️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:50%; left:50%; transform: translate(-50%, -50%); width: 300px; height: 300px; border: 1px solid rgba(255,255,255,0.05); border-radius: 50%; pointer-events: none; z-index: -1;"></div><div style="position:fixed; top:50%; left:50%; transform: translate(-50%, -50%); width: 10px; height: 10px; border: 1px solid rgba(255,255,255,0.1); pointer-events: none; z-index: -1;">+</div>' }
            ]
        },
        '09-29': { // 国家咖啡日 (National Coffee Day)
            logo: { type: 'text', text: 'COFFEE TIME', colors:['#d2b48c', '#a0522d', '#8b4513', '#6f4e37'] }, 
            theme: { 
                bgBase: '#140c08', textMain: '#f5deb3', textMuted: '#d2b48c', accentRgb: '160, 82, 45', 
                avatarGrad1: '#4a2511', avatarGrad2: '#a0522d', ambient1: 'rgba(139, 69, 19, 0.2)', ambient2: 'rgba(210, 180, 140, 0.1)',
                customCss: `
                    @keyframes steamWiggle { 0% { transform: translateY(0) translateX(0) scale(1); opacity:0.6; } 50% { transform: translateY(-20px) translateX(5px) scale(1.2); opacity:0.3; } 100% { transform: translateY(-40px) translateX(-5px) scale(1.5); opacity:0; } }
                    .search-box { border-color: rgba(160, 82, 45, 0.5); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.3;">☕</div><div style="position:fixed; bottom:25%; left:16%; font-size:20px; opacity:0.4; animation: steamWiggle 3s infinite 0s;">〰️</div><div style="position:fixed; bottom:25%; left:17.5%; font-size:20px; opacity:0.4; animation: steamWiggle 3.5s infinite 1s;">〰️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:40px; opacity:0.2;">🤎</div>' }
            ]
        },
        '11-07': { // 立冬 (Start of Winter)
            logo: { type: 'text', text: 'WINTER BEGINS', colors:['#87ceeb', '#add8e6', '#ffffff', '#e0ffff'] }, 
            theme: { 
                bgBase: '#050a12', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '135, 206, 235', 
                avatarGrad1: '#4682b4', avatarGrad2: '#87ceeb', ambient1: 'rgba(135, 206, 235, 0.15)', ambient2: 'rgba(255, 255, 255, 0.1)',
                customCss: `
                    @keyframes frostGrow { 0% { opacity: 0; transform: scale(0.9); } 100% { opacity: 0.2; transform: scale(1); } }
                    body::after { content: ''; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; box-shadow: inset 0 0 100px rgba(255,255,255,0.1); pointer-events: none; animation: frostGrow 5s forwards; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:45px; opacity:0.2;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.2;">🥟</div>' }, // 迎冬吃水饺
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.15;">🧣</div>' }
            ]
        },
        '12-24': { // 平安夜 (Silent Night)
            logo: { type: 'text', text: 'SILENT NIGHT', colors:['#ffd700', '#ffffff', '#87ceeb', '#000080'] }, 
            theme: { 
                bgBase: '#020510', textMain: '#f8f9fa', textMuted: '#87ceeb', accentRgb: '255, 215, 0', 
                avatarGrad1: '#000080', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 215, 0, 0.15)', ambient2: 'rgba(135, 206, 235, 0.1)',
                customCss: `
                    @keyframes slowSnow { 0% { transform: translateY(-5vh); opacity: 0; } 50% { opacity: 0.8; } 100% { transform: translateY(105vh); opacity: 0; } }
                    .search-box { border-color: rgba(255, 215, 0, 0.3); box-shadow: 0 0 20px rgba(255, 215, 0, 0.1); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; right:15%; font-size:60px; opacity:0.25;">🦌</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:15%; font-size:50px; opacity:0.2; filter: drop-shadow(0 0 10px #ffd700);">⭐</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; left:25%; font-size:20px; opacity:0; animation: slowSnow 15s linear infinite 0s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; left:65%; font-size:16px; opacity:0; animation: slowSnow 20s linear infinite 5s;">❄️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:30%; left:85%; font-size:24px; opacity:0; animation: slowSnow 18s linear infinite 2s;">❄️</div>' }
            ]
        },
        '08-31': { // 马来西亚国庆日 Hari Merdeka
            logo: { type: 'text', text: 'MERDEKA', colors:['#000080', '#ff0000', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#050a14', textMain: '#f0f4f8', textMuted: '#ffd700', accentRgb: '255, 215, 0', 
                avatarGrad1: '#000080', avatarGrad2: '#ff0000', ambient1: 'rgba(0, 0, 128, 0.2)', ambient2: 'rgba(255, 0, 0, 0.15)',
                customCss: `
                    @keyframes flagWave { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                    .search-box { box-shadow: 0 0 15px rgba(255, 215, 0, 0.2); border-color: rgba(0, 0, 128, 0.5); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:10%; font-size:45px; opacity:0.25; animation: flagWave 3s ease-in-out infinite;">🇲🇾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:12%; font-size:40px; opacity:0.2;">🌺</div>' }, // 大红花 (Hibiscus)
                { type: 'html', content: '<div style="position:fixed; top:20%; right:20%; font-size:35px; opacity:0.15;">🎆</div>' }
            ]
        },
        '09-13': { // 程序员节 (通常为平年9月13日, 闰年9月12日)
            logo: { type: 'text', text: 'DAY 256', colors:['#00ff00', '#ffffff', '#00ff00', '#32cd32'] }, 
            theme: { 
                bgBase: '#050a05', textMain: '#e6ffe6', textMuted: '#00fa9a', accentRgb: '0, 255, 0', 
                avatarGrad1: '#006400', avatarGrad2: '#00ff00', ambient1: 'rgba(0, 255, 0, 0.1)', ambient2: 'rgba(50, 205, 50, 0.1)',
                customCss: `
                    .text-logo::before { content: '< '; color: #00ff00; opacity: 0.7; }
                    .text-logo::after { content: ' />'; color: #00ff00; opacity: 0.7; }
                    .search-box { border-radius: 4px; border: 1px dotted #00ff00; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:10%; font-size:35px; opacity:0.15; font-family:monospace;">{...}</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:40px; opacity:0.15;">☕</div>' }
            ]
        },
        '09-16': { // 马来西亚日 Hari Malaysia
            logo: { type: 'text', text: 'MALAYSIA DAY', colors:['#ffd700', '#000080', '#ff0000', '#ffffff'] }, 
            theme: { 
                bgBase: '#0a0510', textMain: '#f8f4f0', textMuted: '#ff0000', accentRgb: '0, 0, 128', 
                avatarGrad1: '#ffd700', avatarGrad2: '#000080', ambient1: 'rgba(255, 0, 0, 0.15)', ambient2: 'rgba(255, 215, 0, 0.15)',
                customCss: `
                    .search-box { border-bottom: 2px solid #ff0000; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0.2;">🇲🇾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:40px; opacity:0.2;">🌙</div>' }
            ]
        },
        '11-11': { // 双十一购物狂欢
            logo: { type: 'text', text: '11.11SHOPPING!!!', colors:['#ff0055', '#ff00ff', '#00ffff', '#ff0055'] }, 
            theme: { 
                bgBase: '#0a0010', textMain: '#ffffff', textMuted: '#ff88ff', accentRgb: '255, 0, 85', 
                avatarGrad1: '#ff0055', avatarGrad2: '#00ffff', ambient1: 'rgba(255, 0, 85, 0.2)', ambient2: 'rgba(0, 255, 255, 0.15)',
                customCss: `
                    .search-box { box-shadow: 0 0 20px rgba(255,0,85,0.3); border: 1px solid rgba(255,0,85,0.6); }
                    @keyframes barcodeScan { 0% { transform: translateY(0); } 100% { transform: translateY(60px); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:10%; font-size:45px; opacity:0.15;">🛒</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:45px; opacity:0.15;">📦</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:8%; width:100px; height:2px; background:#00ffff; opacity:0.6; box-shadow:0 0 10px #00ffff; animation: barcodeScan 1.5s ease-in-out infinite alternate;"></div>' }
            ]
        },
        '12-31': { // 跨年夜
            logo: { type: 'text', text: 'COUNTDOWN', colors:['#c0c0c0', '#ffffff', '#ffd700', '#c0c0c0'] }, 
            theme: { 
                bgBase: '#000005', textMain: '#ffffff', textMuted: '#c0c0c0', accentRgb: '192, 192, 192', 
                avatarGrad1: '#ffd700', avatarGrad2: '#c0c0c0', ambient1: 'rgba(255, 215, 0, 0.15)', ambient2: 'rgba(192, 192, 192, 0.15)',
                customCss: `
                    @keyframes pulseClock { 0% { transform: scale(0.95); opacity: 0.5; } 50% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.5; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:50px; opacity:0.15; animation: pulseClock 1s infinite;">⏱️</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:12%; font-size:45px; opacity:0.2;">🥂</div>' },
                { type: 'html', content: '<div style="position:fixed; top:10%; left:20%; font-size:40px; opacity:0.2;">🪩</div>' }
            ]
        },
        'L01-09': { // 正月初九拜天公 (大马/闽南盛大节日)
            logo: { type: 'text', text: 'JADE EMPEROR', colors:['#ffd700', '#ff8c00', '#ff0000', '#ffff00'] }, 
            theme: { 
                bgBase: '#1a0800', textMain: '#fffce8', textMuted: '#ffd700', accentRgb: '255, 215, 0', 
                avatarGrad1: '#ff0000', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 215, 0, 0.2)', ambient2: 'rgba(255, 0, 0, 0.15)',
                customCss: `
                    @keyframes floatGold { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 50% { opacity: 0.6; } 100% { transform: translateY(-30vh) rotate(360deg); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:12%; font-size:45px; opacity:0.25; animation: floatGold 6s linear infinite 0s;">🍍</div>' }, // 旺来 (Pineapple)
                { type: 'html', content: '<div style="position:fixed; bottom:5%; right:15%; font-size:55px; opacity:0.25;">🎋</div>' }, // 甘蔗 (Sugarcane)
                { type: 'html', content: '<div style="position:fixed; top:20%; left:20%; font-size:35px; opacity:0.2; animation: floatGold 5s linear infinite 2s;">🧧</div>' }
            ]
        },
        'L10-15': { // 下元节 / 水灯节
            logo: { type: 'text', text: 'XIAYUAN FESTIVAL', colors:['#1e90ff', '#00bfff', '#add8e6', '#ffffff'] }, 
            theme: { 
                bgBase: '#020b1a', textMain: '#e6f2ff', textMuted: '#87cefa', accentRgb: '30, 144, 255', 
                avatarGrad1: '#000080', avatarGrad2: '#1e90ff', ambient1: 'rgba(30, 144, 255, 0.2)', ambient2: 'rgba(135, 206, 250, 0.1)',
                customCss: `
                    @keyframes floatWaterLantern { 0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; } 20% { opacity: 0.8; } 80% { opacity: 0.8; } 100% { transform: translateY(-10vh) translateX(5vw) scale(0.8); opacity: 0; } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:25%; font-size:40px; opacity:0; animation: floatWaterLantern 8s ease-in-out infinite 0s;">🪷</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:5%; left:60%; font-size:35px; opacity:0; animation: floatWaterLantern 10s ease-in-out infinite 2s;">🕯️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:15%; font-size:45px; opacity:0.15;">🌊</div>' }
            ]
        },
        '12-22': { // 冬至 (公历节气通常在12月21-22日，这里以22日为例配置)
            logo: { type: 'text', text: 'WINTER SOLSTICE', colors:['#87cefa', '#e0ffff', '#ffffff', '#4682b4'] }, 
            theme: { 
                bgBase: '#020a14', textMain: '#f0f8ff', textMuted: '#add8e6', accentRgb: '135, 206, 250', 
                avatarGrad1: '#4682b4', avatarGrad2: '#e0ffff', ambient1: 'rgba(135, 206, 250, 0.15)', ambient2: 'rgba(255, 255, 255, 0.1)',
                customCss: `
                    @keyframes snowFall { 0% { transform: translateY(-10vh); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateY(110vh); opacity: 0; } }
                    .omni-snow { position: fixed; color: #fff; text-shadow: 0 0 5px rgba(255,255,255,0.8); pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-snow" style="left: 15%; font-size: 14px; animation: snowFall 10s linear infinite 0s;">❄️</div>
                    <div class="omni-snow" style="left: 35%; font-size: 20px; animation: snowFall 15s linear infinite 2s;">❄️</div>
                    <div class="omni-snow" style="left: 65%; font-size: 16px; animation: snowFall 12s linear infinite 1s;">❄️</div>
                    <div class="omni-snow" style="left: 85%; font-size: 24px; animation: snowFall 18s linear infinite 4s;">❄️</div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:12%; font-size:45px; opacity:0.25;">🥟</div>' }, // 北方吃饺子
                { type: 'html', content: '<div style="position:fixed; bottom:10%; right:15%; font-size:45px; opacity:0.25;">🥣</div>' } // 南方吃汤圆
            ]
        },
        // '10-01': { 
        //     logo: { type: 'text', text: 'NATIONAL DAY', colors:['#ff0000', '#ffd700', '#ff4500', '#ffff00'] }, 
        //     theme: { 
        //         bgBase: '#1a0000', textMain: '#fff5e6', textMuted: '#ffa500', accentRgb: '255, 0, 0', 
        //         avatarGrad1: '#b22222', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 0, 0, 0.25)', ambient2: 'rgba(255, 215, 0, 0.2)',
        //         customCss: `
        //             @keyframes firework { 0% { transform: scale(0); opacity: 1; } 50% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
        //             .omni-firework { position: fixed; width: 4px; height: 4px; background: #ffd700; border-radius: 50%; box-shadow: 0 0 10px #ffd700; pointer-events: none; z-index: 0; }
        //         `
        //     },
        //     extensions:[
        //         { type: 'html', content: `
        //             <div class="omni-firework" style="top: 20%; left: 20%; animation: firework 2s ease-out infinite 0s;"></div>
        //             <div class="omni-firework" style="top: 15%; left: 50%; animation: firework 2.5s ease-out infinite 0.5s;"></div>
        //             <div class="omni-firework" style="top: 25%; left: 80%; animation: firework 2s ease-out infinite 1s;"></div>
        //             <div class="omni-firework" style="top: 10%; left: 35%; animation: firework 2.5s ease-out infinite 1.5s;"></div>
        //             <div class="omni-firework" style="top: 18%; left: 65%; animation: firework 2s ease-out infinite 0.8s;"></div>
        //         `},
        //         { type: 'html', content: '<div style="position:fixed; bottom:10%; left:10%; font-size:40px; opacity:0.2;">🏮</div>' },
        //         { type: 'html', content: '<div style="position:fixed; top:15%; right:12%; font-size:35px; opacity:0.15;">🇨🇳</div>' }
        //     ]
        // },
        'L09-09': { 
            logo: { type: 'text', text: 'CHONGYANG', colors:['#ff8c00', '#ffa500', '#ffd700', '#ffffff'] }, 
            theme: { 
                bgBase: '#1a0f00', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 140, 0', 
                avatarGrad1: '#ff8c00', avatarGrad2: '#ffd700', ambient1: 'rgba(255, 140, 0, 0.2)', ambient2: 'rgba(255, 165, 0, 0.15)',
                customCss: `
                    @keyframes leafFall { 0% { transform: translateY(-10vh) translateX(0) rotate(0deg) scale(var(--s, 1)); opacity: 0; } 10% { opacity: var(--o, 0.8); } 90% { opacity: var(--o, 0.8); } 100% { transform: translateY(110vh) translateX(calc(var(--dir, 1) * 15vw)) rotate(var(--r, 360deg)) scale(var(--s, 1)); opacity: 0; } }
                    .omni-autumn-leaf { position: fixed; top: -10vh; width: 18px; height: 14px; background: linear-gradient(135deg, #ffa500, #ff8c00); border-radius: 50% 0 50% 0; box-shadow: 0 2px 5px rgba(255, 140, 0, 0.3); pointer-events: none; z-index: 0; }
                `
            },
            extensions:[
                { type: 'html', content: `
                    <div class="omni-autumn-leaf" style="left: 10%; --s: 0.8; --r: 180deg; --dir: 1; --o: 0.7; animation: leafFall 16s ease-in-out infinite 0s;"></div>
                    <div class="omni-autumn-leaf" style="left: 25%; --s: 1.2; --r: -180deg; --dir: -1; --o: 0.9; animation: leafFall 18s ease-in-out infinite 3s;"></div>
                    <div class="omni-autumn-leaf" style="left: 45%; --s: 0.9; --r: 360deg; --dir: 1; --o: 0.6; animation: leafFall 15s ease-in-out infinite 1s;"></div>
                    <div class="omni-autumn-leaf" style="left: 65%; --s: 1.5; --r: -360deg; --dir: -1; --o: 0.8; animation: leafFall 20s ease-in-out infinite 5s;"></div>
                    <div class="omni-autumn-leaf" style="left: 85%; --s: 1; --r: 270deg; --dir: 1; --o: 0.5; animation: leafFall 17s ease-in-out infinite 2s;"></div>
                `},
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:8%; font-size:40px; opacity:0.2;">⛰️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:10%; font-size:35px; opacity:0.15;">🌼</div>' }
            ]
        },
        // --- 本土风情 (马来西亚特色) 与全球趣味极客纪念日补充 ---

        '02-01': { // 联邦直辖区日 (Hari Wilayah - 吉隆坡/布城/纳闽)
            logo: { type: 'text', text: 'WILAYAH DAY', colors:['#ffd700', '#0000ff', '#ff0000', '#ffffff'] }, 
            theme: { 
                bgBase: '#020514', textMain: '#f0f4ff', textMuted: '#ffd700', accentRgb: '255, 215, 0', 
                avatarGrad1: '#0000ff', avatarGrad2: '#ff0000', ambient1: 'rgba(0, 0, 255, 0.2)', ambient2: 'rgba(255, 0, 0, 0.15)',
                customCss: `
                    @keyframes pulseCity { 0%, 100% { filter: drop-shadow(0 0 10px rgba(255,215,0,0.3)); } 50% { filter: drop-shadow(0 0 25px rgba(255,215,0,0.7)); } }
                    .search-box { border-bottom: 2px solid #ffd700; box-shadow: 0 10px 20px rgba(0,0,255,0.1); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:55px; opacity:0.25; animation: pulseCity 4s infinite;">🏙️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0.2;">🇲🇾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; right:20%; font-size:40px; opacity:0.15;">🎆</div>' }
            ]
        },
        '05-09': { // 悟空日 (Goku Day - 龙珠文化)
            logo: { type: 'text', text: 'KAMEHAMEHA', colors:['#ff8c00', '#ffd700', '#0000ff', '#ff4500'] }, 
            theme: { 
                bgBase: '#120500', textMain: '#fff5e6', textMuted: '#ff8c00', accentRgb: '255, 140, 0', 
                avatarGrad1: '#ff4500', avatarGrad2: '#0000ff', ambient1: 'rgba(255, 140, 0, 0.3)', ambient2: 'rgba(255, 215, 0, 0.2)',
                customCss: `
                    @keyframes saiyanAura { 0%, 100% { box-shadow: 0 0 20px #ff8c00, inset 0 0 15px #ffd700; } 50% { box-shadow: 0 0 40px #ff4500, inset 0 0 25px #ff8c00; transform: scale(1.01); } }
                    .search-box { animation: saiyanAura 1.5s infinite; border: 2px solid #ffd700; background: rgba(255, 140, 0, 0.05); }
                    .text-logo { font-style: italic; font-weight: 900; letter-spacing: 2px; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:12%; font-size:50px; opacity:0.3; filter: drop-shadow(0 0 10px #ff4500);">🔥</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:55px; opacity:0.25; filter: drop-shadow(0 0 15px #ffd700);">⭐</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:20%; left:20%; font-size:45px; opacity:0.2;">🐉</div>' }
            ]
        },
        '05-31': { // 东马丰收节前夕 (Kaamatan / Gawai Dayak 庆祝期)
            logo: { type: 'text', text: 'HARVEST FESTIVAL', colors:['#000000', '#ffd700', '#ff0000', '#ffffff'] }, 
            theme: { 
                bgBase: '#14120a', textMain: '#fdf7e6', textMuted: '#d4af37', accentRgb: '212, 175, 55', 
                avatarGrad1: '#8b0000', avatarGrad2: '#d4af37', ambient1: 'rgba(212, 175, 55, 0.15)', ambient2: 'rgba(255, 0, 0, 0.1)',
                customCss: `
                    @keyframes swayPaddy { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
                    .search-box { border-bottom: 3px solid #d4af37; border-top: 1px solid rgba(212,175,55,0.3); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:15%; font-size:60px; opacity:0.3; transform-origin: bottom center; animation: swayPaddy 4s ease-in-out infinite;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:22%; font-size:50px; opacity:0.2; transform-origin: bottom center; animation: swayPaddy 3.5s ease-in-out infinite 0.5s;">🌾</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0.2;">🦅</div>' }, // 犀鸟象征
                { type: 'html', content: '<div style="position:fixed; bottom:25%; right:20%; font-size:40px; opacity:0.2;">🥁</div>' }
            ]
        },
        '06-15': { // 大马榴莲季盛会 (Durian Season - 象征性日期)
            logo: { type: 'text', text: 'KING OF FRUITS', colors:['#ffd700', '#32cd32', '#ff8c00', '#228b22'] }, 
            theme: { 
                bgBase: '#0a1205', textMain: '#fffce6', textMuted: '#98fb98', accentRgb: '50, 205, 50', 
                avatarGrad1: '#228b22', avatarGrad2: '#ffd700', ambient1: 'rgba(50, 205, 50, 0.2)', ambient2: 'rgba(255, 215, 0, 0.15)',
                customCss: `
                    @keyframes dropSpike { 0% { transform: translateY(-50px) scale(0.8); opacity:0; } 50% { opacity:1; } 100% { transform: translateY(20px) scale(1.1); opacity:0; } }
                    .search-box { border: 2px dashed #32cd32; background: rgba(50,205,50,0.05); }
                    .text-logo { filter: drop-shadow(0 2px 2px #228b22); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:12%; font-size:55px; opacity:0.25;">👑</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:50px; opacity:0.3;">🍈</div>' }, // 使用蜜瓜近似榴莲果肉
                { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:35px; opacity:0.2;">🌳</div>' }
            ]
        },
        // '08-01': { // 万维网日 (World Wide Web Day)
        //     logo: { type: 'text', text: 'WWW.MATRIX', colors:['#0000ff', '#800080', '#0000ee', '#551a8b'] }, 
        //     theme: { 
        //         bgBase: '#c0c0c0', textMain: '#000000', textMuted: '#555555', accentRgb: '0, 0, 255', 
        //         avatarGrad1: '#000080', avatarGrad2: '#0000ff', ambient1: 'transparent', ambient2: 'transparent',
        //         customCss: lightModeCSS + `
        //             body { font-family: 'Times New Roman', serif !important; background-image: repeating-linear-gradient(45deg, #dfdfdf 25%, transparent 25%, transparent 75%, #dfdfdf 75%, #dfdfdf), repeating-linear-gradient(45deg, #dfdfdf 25%, #c0c0c0 25%, #c0c0c0 75%, #dfdfdf 75%, #dfdfdf); background-position: 0 0, 10px 10px; background-size: 20px 20px; }
        //             .search-box { border: 2px inset #ffffff; background: #ffffff; border-radius: 0; box-shadow: 2px 2px 0px #000; }
        //             .search-input { font-family: 'Times New Roman', serif !important; color: #000; }
        //             .text-logo { text-decoration: underline; color: #0000ff !important; cursor: pointer; text-shadow: none; }
        //             .action-btn { border: 2px outset #ffffff; border-radius: 0; background: #c0c0c0; color: #000; font-family: 'Times New Roman', serif !important; }
        //             .action-btn:active { border: 2px inset #ffffff; }
        //         `
        //     },
        //     extensions:[
        //         { type: 'html', content: '<div style="position:fixed; top:15%; left:10%; font-size:40px; opacity:0.4;">🌐</div>' },
        //         { type: 'html', content: '<div style="position:fixed; bottom:20%; right:15%; font-size:45px; opacity:0.4;">🖱️</div>' },
        //         { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:30px; opacity:0.5; color:#0000ff; text-decoration:underline; font-family:monospace;">&lt;html&gt;</div>' }
        //     ]
        // },
        '09-02': { // 世界椰子日 (World Coconut Day - 热带风情)
            logo: { type: 'text', text: 'COCO VIBES', colors:['#2e8b57', '#8b4513', '#f5deb3', '#3cb371'] }, 
            theme: { 
                bgBase: '#0a1410', textMain: '#f5deb3', textMuted: '#98fb98', accentRgb: '46, 139, 87', 
                avatarGrad1: '#8b4513', avatarGrad2: '#2e8b57', ambient1: 'rgba(46, 139, 87, 0.2)', ambient2: 'rgba(139, 69, 19, 0.15)',
                customCss: `
                    @keyframes coconutDrop { 0% { transform: translateY(-50px); opacity:0; } 20% { opacity:1; } 80% { transform: translateY(300px); opacity:1; } 100% { transform: translateY(350px); opacity:0; } }
                    .search-box { background: rgba(139, 69, 19, 0.1); border: 1px solid #8b4513; border-radius: 20px; box-shadow: 0 5px 15px rgba(46, 139, 87, 0.2); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:15%; left:15%; font-size:55px; opacity:0.25;">🥥</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:50px; opacity:0.2;">🌴</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:25%; font-size:35px; opacity:0.2;">🍹</div>' }
            ]
        },
        '09-22': { // 霍比特人日 (Hobbit Day - 托尔金诞辰/中土世界)
            logo: { type: 'text', text: 'SHIRE MATRIX', colors:['#228b22', '#ffd700', '#8b4513', '#32cd32'] }, 
            theme: { 
                bgBase: '#0d140a', textMain: '#f5f5dc', textMuted: '#d2b48c', accentRgb: '34, 139, 34', 
                avatarGrad1: '#006400', avatarGrad2: '#ffd700', ambient1: 'rgba(34, 139, 34, 0.15)', ambient2: 'rgba(218, 165, 32, 0.1)',
                customCss: `
                    @keyframes ringGlow { 0%, 100% { filter: drop-shadow(0 0 5px #ffd700); } 50% { filter: drop-shadow(0 0 20px #ff8c00); } }
                    .search-box { border-radius: 50px; border: 2px solid #8b4513; background: rgba(34,139,34,0.1); }
                    .text-logo { font-family: 'Georgia', serif; letter-spacing: 3px; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.3; animation: ringGlow 3s infinite;">💍</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0.2;">🌿</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; right:20%; font-size:40px; opacity:0.2;">🧝‍♂️</div>' },
                { type: 'html', content: '<div style="position:fixed; top:30%; left:25%; font-size:35px; opacity:0.15;">🚪</div>' } // 象征圆形小门
            ]
        },
        '11-23': { // TARDIS Day / 神秘博士纪念日
            logo: { type: 'text', text: 'WIBBLY WOBBLY', colors:['#003b6f', '#ffffff', '#87ceeb', '#0000ff'] }, 
            theme: { 
                bgBase: '#020512', textMain: '#e6f2ff', textMuted: '#87ceeb', accentRgb: '0, 59, 111', 
                avatarGrad1: '#001f3f', avatarGrad2: '#0074d9', ambient1: 'rgba(0, 59, 111, 0.3)', ambient2: 'rgba(135, 206, 235, 0.15)',
                customCss: `
                    @keyframes timeVortex { 0% { transform: rotate(0deg) scale(1); opacity:0.1; } 50% { transform: rotate(180deg) scale(1.2); opacity:0.3; } 100% { transform: rotate(360deg) scale(1); opacity:0.1; } }
                    body::after { content: ''; position: fixed; top: -50%; left: -50%; width: 200vw; height: 200vh; background: conic-gradient(from 0deg, transparent, rgba(0,59,111,0.2), transparent, rgba(135,206,235,0.2), transparent); animation: timeVortex 15s linear infinite; pointer-events: none; z-index: -2; }
                    .search-box { border: 2px solid #003b6f; box-shadow: 0 0 15px rgba(0, 59, 111, 0.5); border-radius: 4px; }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:15%; left:15%; font-size:50px; opacity:0.25;">🌌</div>' },
                { type: 'html', content: '<div style="position:fixed; top:20%; right:15%; font-size:45px; opacity:0.25;">⏳</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; right:20%; font-size:40px; opacity:0.2;">🛸</div>' }
            ]
        },
        '12-15': { // 国际茶日 (大马国民饮料 Teh Tarik 风情)
            logo: { type: 'text', text: 'TEH TARIK BOSS', colors:['#d2b48c', '#cd853f', '#a0522d', '#f5deb3'] }, 
            theme: { 
                bgBase: '#120a05', textMain: '#fff3e6', textMuted: '#d2b48c', accentRgb: '210, 180, 140', 
                avatarGrad1: '#8b4513', avatarGrad2: '#d2b48c', ambient1: 'rgba(139, 69, 19, 0.2)', ambient2: 'rgba(210, 180, 140, 0.15)',
                customCss: `
                    @keyframes pullTea { 0% { height: 0; opacity: 0; } 20% { opacity: 0.8; } 80% { opacity: 0.8; } 100% { height: 100px; opacity: 0; transform: translateY(20px); } }
                    @keyframes bubbleFloat { 0% { transform: translateY(0); opacity: 0.6; } 100% { transform: translateY(-20px); opacity: 0; } }
                    .search-box { border-bottom: 3px solid #d2b48c; background: rgba(210, 180, 140, 0.05); }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; top:20%; left:15%; font-size:50px; opacity:0.25;">🫖</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:55px; opacity:0.25;">☕</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:25%; right:17%; font-size:16px; color:#d2b48c; opacity:0.6; animation: bubbleFloat 2s ease-out infinite;">⚪</div>' },
                { type: 'html', content: '<div style="position:fixed; top:25%; right:25%; font-size:35px; opacity:0.15;">🧊</div>' } // 冰块象征 Teh Ais
            ]
        },
        '11-28': { 
            logo: { type: 'text', text: 'GIVE THANKS', colors:['#ff6347', '#ffa500', '#8b4513', '#ffff00'] }, 
            theme: { 
                bgBase: '#1a0f05', textMain: '#fff5e6', textMuted: '#ffb347', accentRgb: '255, 99, 71', 
                avatarGrad1: '#8b4513', avatarGrad2: '#ff6347', ambient1: 'rgba(255, 99, 71, 0.2)', ambient2: 'rgba(255, 165, 0, 0.15)',
                customCss: `
                    @keyframes leafSway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
                `
            },
            extensions:[
                { type: 'html', content: '<div style="position:fixed; bottom:10%; left:12%; font-size:40px; opacity:0.2;">🦃</div>' },
                { type: 'html', content: '<div style="position:fixed; top:15%; right:10%; font-size:35px; opacity:0.15; animation: leafSway 3s ease-in-out infinite;">🍂</div>' },
                { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:35px; opacity:0.18;">🎃</div>' }
            ]
        }
    },
     // 疯狂星期四专属主题配置 (红黄配色 KFC 风格)
    'crazyThursday': {
  id: 'crazy-thursday',
  name: '疯狂星期四',
  logo: { 
    type: 'text', 
    text: 'kfc·vivo50', 
    colors: ['#e60012', '#ffc107', '#ff9800', '#e60012'] 
  },
  theme: {
    bgBase: '#120505', // 暗红色基底
    textMain: '#ffffff',
    textMuted: '#ffc107',
    accentRgb: '230, 0, 18',
    avatarGrad1: '#e60012', // 肯德基红
    avatarGrad2: '#ffc107', // 炸鸡黄
    ambient1: 'rgba(230, 0, 18, 0.25)', // 加强一点红色光晕
    ambient2: 'rgba(255, 193, 7, 0.2)',  // 加强一点黄色光晕
    customCss: `@keyframes crazyBounce { 0%, 100% { transform: translateY(0) rotate(-10deg) scale(1); } 50% { transform: translateY(-15px) rotate(10deg) scale(1.1); } } @keyframes fastPulse { 0%, 100% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.2); opacity: 0.4; } } .search-box { border: 2px dashed rgba(255,193,7,0.6); box-shadow: 0 0 20px rgba(230,0,18,0.3), inset 0 0 10px rgba(255,193,7,0.1); border-radius: 12px; }`
  },
  extensions: [
    // 漂浮的炸鸡腿，带弹跳旋转动画
    { type: 'html', content: '<div style="position:fixed; top:18%; left:12%; font-size:45px; opacity:0.3; animation: crazyBounce 3s infinite;">🍗</div>' },
    // 漂浮的薯条，错开动画时间
    { type: 'html', content: '<div style="position:fixed; bottom:15%; right:15%; font-size:42px; opacity:0.25; animation: crazyBounce 2.5s infinite 0.3s reverse;">🍟</div>' },
    // 汉堡，带放大缩小的脉冲动画
    { type: 'html', content: '<div style="position:fixed; top:25%; right:20%; font-size:38px; opacity:0.2; animation: fastPulse 2s infinite;">🍔</div>' },
    // 疯狂的表情，契合“Crazy”主题
    { type: 'html', content: '<div style="position:fixed; bottom:22%; left:18%; font-size:40px; opacity:0.25; animation: fastPulse 3s infinite 0.5s;">🤪</div>' },
    // 钱袋，暗指“V我50”的经典网络热梗
    { type: 'html', content: '<div style="position:fixed; top:50%; right:8%; font-size:35px; opacity:0.15; animation: crazyBounce 4s infinite;">💰</div>' }
  ]
},
    dailyPool:[
        
        {   
    id: 'yozakura-reverie', 
    name: '🌸 Yozakura',
    logo: { 
        type: 'text', 
        text: 'YOZAKURA', 
        // 提取：初雪白、樱花粉、绯红、星夜紫
        colors:['#ffffff', '#ffd1dc', '#ff7b99', '#b388ff'] 
    },
    theme: { 
        // 【色彩美学】
        bgBase: '#030108', // 深渊墨染：比原来更深邃的深渊紫黑，让光晕绝对聚焦
        textMain: '#fdf0f5', // 晨露：带点粉调的冷白
        textMuted: '#9a8696', // 暮樱：带灰调的暗紫粉，提升阅读对比度
        accentRgb: '255, 143, 163', // 核心绯樱色
        avatarGrad1: '#ff8fa3', 
        avatarGrad2: '#ffc2d1', 
        ambient1: 'rgba(255, 143, 163, 0.18)', // 增强一丝主色调环境光
        ambient2: 'rgba(147, 112, 219, 0.08)', // 融入冷艳的星夜蓝紫
        
        customCss: `
            /* 1. 3D 翻滚与飘落复合动画（核心物理升级） */
            @keyframes sakuraTumble {
                0% { 
                    transform: translate3d(0, -10vh, 0) rotateZ(0deg) rotateX(0deg) rotateY(0deg) scale(var(--s, 1)); 
                    opacity: 0; 
                }
                10% { 
                    opacity: var(--o, 0.85); 
                }
                50% { 
                    /* 随风横向摇曳 + 3D翻滚 */
                    transform: translate3d(var(--sway, 5vw), 45vh, 0) 
                               rotateZ(var(--r, 180deg)) 
                               rotateX(calc(var(--r) * 0.8)) 
                               rotateY(calc(var(--r) * 1.2)) 
                               scale(var(--s, 1)); 
                }
                85% { 
                    opacity: var(--o, 0.85); 
                }
                100% { 
                    /* 飘落至底 */
                    transform: translate3d(calc(var(--sway, 5vw) * -0.5), 110vh, 0) 
                               rotateZ(calc(var(--r, 360deg) * 1.5)) 
                               rotateX(calc(var(--r) * 1.6)) 
                               rotateY(calc(var(--r) * 2.4)) 
                               scale(var(--s, 1)); 
                    opacity: 0; 
                }
            }
            
            /* 2. 幻夜月光与云雾呼吸 */
            @keyframes sakuraMoonlight {
                0%   { opacity: 0.25; transform: scale(1) translate(0, 0); }
                50%  { opacity: 0.45; transform: scale(1.08) translate(2%, 2%); filter: hue-rotate(5deg); }
                100% { opacity: 0.25; transform: scale(1) translate(0, 0); }
            }

            /* 3. 星尘/流萤闪烁动画 */
            @keyframes stardustTwinkle {
                0%, 100% { opacity: 0; transform: scale(0.5); }
                50% { opacity: var(--o, 0.6); transform: scale(1); box-shadow: 0 0 6px 1px rgba(255, 183, 197, 0.6); }
            }

            /* --- 元素样式 --- */

            /* 基础花瓣：优化材质、增加通透感与高光 */
            .omni-petal { 
                position: fixed; 
                top: -10vh; 
                width: 16px; 
                height: 16px; 
                background: linear-gradient(135deg, 
                    rgba(255,255,255,0.95) 0%, 
                    rgba(255,183,197,0.85) 30%, 
                    rgba(255,143,163,0.9) 100%); 
                border-radius: 50% 0 50% 50%; 
                /* 内发光与高光边缘 */
                box-shadow: inset 2px 2px 4px rgba(255,255,255,0.6), 
                            inset -1px -1px 3px rgba(0,0,0,0.1),
                            0 0 8px rgba(255, 143, 163, 0.3); 
                pointer-events: none; 
                z-index: 0; 
                transform-origin: 50% 50%;
                will-change: transform, opacity; /* 性能优化 */
                animation: sakuraTumble var(--dur, 12s) cubic-bezier(0.35, 0.05, 0.65, 0.95) infinite var(--d, 0s); 
            }

            /* 远景花瓣：超强模糊、暗淡、小巧 */
            .omni-petal.bg-blur {
                filter: blur(5px) brightness(0.7);
                z-index: -1;
            }

            /* 前景花瓣：巨大、清晰、强烈的赛博霓虹发光 */
            .omni-petal.fg-sharp {
                z-index: 10;
                filter: drop-shadow(0 0 16px rgba(255,143,163,0.7)) brightness(1.1);
            }

            /* 唯美夜樱背景光晕 (双色交织) */
            .yozakura-glow {
                position: fixed;
                top: -20vh;
                right: -10vw;
                width: 70vw;
                height: 70vw;
                background: radial-gradient(circle, 
                    rgba(255, 194, 209, 0.07) 0%, 
                    rgba(164, 118, 219, 0.05) 30%, 
                    transparent 65%);
                border-radius: 50%;
                pointer-events: none;
                z-index: -2;
                mix-blend-mode: screen;
                animation: sakuraMoonlight 12s ease-in-out infinite alternate;
            }

            /* 电影级晕影 — 视线引导至中心 */
            .cinematic-vignette {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: radial-gradient(ellipse at center, transparent 55%, rgba(3, 1, 8, 0.55) 100%);
                pointer-events: none;
                z-index: 5;
            }

            /* 微光星尘点缀 */
            .omni-stardust {
                position: fixed;
                width: 2px;
                height: 2px;
                background: #fff;
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
                animation: stardustTwinkle var(--dur, 4s) ease-in-out infinite var(--d, 0s);
            }
        ` 
    },
    extensions:[
        { type: 'html', content: `
            <!-- 电影级晕影层 -->
            <div class="cinematic-vignette"></div>
            <!-- 意境层：夜樱光晕 -->
            <div class="yozakura-glow"></div>
            <!-- 添加一个位于左下角的冷色辅光源，增加色彩层次 -->
            <div class="yozakura-glow" style="top: 50vh; right: auto; left: -20vw; background: radial-gradient(circle, rgba(164, 118, 219, 0.04) 0%, transparent 50%); animation-delay: -5s; transform: scale(0.8);"></div>

            <!-- 环境层：流萤 / 星尘 (随机散布) -->
            <div class="omni-stardust" style="top: 20%; left: 15%; --dur: 5s; --d: 1s; --o: 0.8;"></div>
            <div class="omni-stardust" style="top: 45%; left: 80%; --dur: 7s; --d: 3s; --o: 0.6;"></div>
            <div class="omni-stardust" style="top: 70%; left: 30%; --dur: 6s; --d: 2s; --o: 0.9;"></div>
            <div class="omni-stardust" style="top: 85%; left: 65%; --dur: 8s; --d: 0s; --o: 0.5;"></div>

            <!-- 背景层：远景模糊花瓣 (空间景深感，轨迹平缓) -->
            <div class="omni-petal bg-blur" style="left: 8%;  --s: 0.5; --r: 280deg; --sway: 4vw;  --o: 0.4; --dur: 20s; --d: -2s;"></div>
            <div class="omni-petal bg-blur" style="left: 35%; --s: 0.4; --r: -320deg; --sway: -3vw; --o: 0.3; --dur: 24s; --d: 4s;"></div>
            <div class="omni-petal bg-blur" style="left: 75%; --s: 0.6; --r: 420deg; --sway: 6vw;  --o: 0.5; --dur: 18s; --d: 1s;"></div>
            <div class="omni-petal bg-blur" style="left: 95%; --s: 0.4; --r: -200deg; --sway: -5vw; --o: 0.3; --dur: 22s; --d: 6s;"></div>

            <!-- 中景层：标准花瓣 (丰富画面，轨迹交错) -->
            <div class="omni-petal" style="left: 12%; --s: 0.8; --r: -450deg; --sway: -4vw; --o: 0.8; --dur: 14s; --d: 0s;"></div>
            <div class="omni-petal" style="left: 28%; --s: 1.0; --r: 540deg;  --sway: 7vw;  --o: 0.9; --dur: 12s; --d: 3.5s;"></div>
            <div class="omni-petal" style="left: 48%; --s: 0.7; --r: -360deg; --sway: -5vw; --o: 0.7; --dur: 16s; --d: 7s;"></div>
            <div class="omni-petal" style="left: 62%; --s: 0.9; --r: 600deg;  --sway: 6vw;  --o: 0.8; --dur: 13s; --d: 1.5s;"></div>
            <div class="omni-petal" style="left: 82%; --s: 1.0; --r: -540deg; --sway: -6vw; --o: 0.9; --dur: 15s; --d: 5s;"></div>

            <!-- 前景层：特大花瓣 (贴脸坠落，极速，带光学柔光) -->
            <div class="omni-petal fg-sharp" style="left: 18%; --s: 1.7; --r: 720deg;  --sway: 10vw; --o: 0.95; --dur: 9s;  --d: 2s;"></div>
            <div class="omni-petal fg-sharp" style="left: 55%; --s: 1.5; --r: -600deg; --sway: -8vw; --o: 0.9;  --dur: 11s; --d: 6.5s;"></div>
            <div class="omni-petal fg-sharp" style="left: 88%; --s: 1.9; --r: 800deg;  --sway: 7vw;  --o: 0.95; --dur: 8.5s;--d: 0.5s;"></div>
        `}
    ]
},
{
    id: 'arknights-babel-epic',
    name: 'ARKNIGHTS',
    logo: {
        type: 'text',
        text: 'ARKNIGHTS',
        colors: ['#1a1f26', '#7a6c5d', '#b34747', '#8b0000', '#1a1f26'], 
    },
    theme: {
        bgBase: '#f4f1eb',
        textMain: '#2c3540',
        textMuted: '#7a6c5d',
        accentRgb: '179, 71, 71', // 巴别塔红/源石血红色
        avatarGrad1: '#2c3540',
        avatarGrad2: '#7a6c5d',
        ambient1: 'rgba(44, 53, 64, 0.12)',
        ambient2: 'rgba(179, 71, 71, 0.07)', 

        customCss: `
            /* --- 1. 全局设计系统与变量 --- */
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Noto+Serif+SC:wght@300;400;600&family=Space+Mono&display=swap');

            :root {
                --ark-bg: #f4f1eb;
                --ark-dark: #2c3540;
                --ark-muted: #7a6c5d;
                --ark-red: #b34747;
                --ark-red-rgb: 179, 71, 71;
                --ark-font-serif: 'Noto Serif SC', 'Songti SC', 'Cinzel', serif;
                --ark-font-sys: 'Space Mono', monospace;
                --ark-curve: cubic-bezier(0.19, 1, 0.22, 1); /* 方舟经典的阻尼动效曲线 */
            }

            body, html, #app, #root, .main-container, .layout, * {
                font-family: var(--ark-font-serif) !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }

            ::selection { 
                background: rgba(var(--ark-red-rgb), 0.15); 
                color: #731e1e; 
            }

            body, html, #app, #root, .main-container, .layout { 
                background-color: transparent !important; 
            }

            /* --- 2. 底层环境与背景（硬件加速优化） --- */
            .ark-base-canvas {
                position: fixed; inset: 0; background: var(--ark-bg); z-index: -30;
            }

            #ark-poster-bg {
                position: fixed; inset: 0; 
                background-image: url('/assets/Archive.png'); /* 注意替换本地地址 */
                background-size: cover; background-position: center; background-repeat: no-repeat;
                z-index: -20;
                box-shadow: inset 0 0 200px 120px var(--ark-bg), inset 0 0 50px 20px rgba(244, 241, 235, 0.8);
                opacity: 0.92;
                will-change: filter, transform; /* 性能优化：启用 GPU 渲染 */
                transform: translateZ(0) scale(1);
                transition: transform 0.8s var(--ark-curve), filter 0.8s ease;
                animation: breathGlow 10s ease-in-out infinite alternate;
            }

            @keyframes breathGlow {
                0% { filter: brightness(0.95) contrast(1.05); }
                100% { filter: brightness(1.02) contrast(0.98); }
            }

            /* --- 3. 核心主观交互 1：记忆过载/剧痛快门 (Active State) --- */
            body:active #ark-poster-bg {
                transform: translateZ(0) scale(1.02);
                /* 加入轻微的色相偏移模拟神经痛觉 */
                filter: brightness(1.15) contrast(1.2) sepia(0.3) hue-rotate(-15deg);
                transition: transform 0.05s ease-out, filter 0.05s ease-out; 
            }
            body:active #paper-grain-overlay {
                opacity: 0.8; 
                mix-blend-mode: color-burn; 
            }

            /* --- 4. 视觉滤镜层：噪点与取景器 --- */
            // #paper-grain-overlay {
            //     position: fixed; inset: 0; pointer-events: none; z-index: 9998; opacity: 0.45;
            //     background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            //     mix-blend-mode: multiply; transition: opacity 0.3s var(--ark-curve);
            //     will-change: opacity;
            // }  // 不好看，不喜欢，不要取消注释
            

            #cinematic-frame {
                position: fixed; inset: 3vw; pointer-events: none; z-index: 9990;
                border: 1px solid rgba(44, 53, 64, 0.12);
                transition: all 0.6s var(--ark-curve);
                will-change: inset, border-color;
            }
            #cinematic-frame::before, #cinematic-frame::after {
                content: ''; position: absolute; width: 12px; height: 12px; 
                border: 1.5px solid rgba(44, 53, 64, 0.4); transition: all 0.4s var(--ark-curve);
            }
            #cinematic-frame::before { top: -6px; left: -6px; border-right: none; border-bottom: none; }
            #cinematic-frame::after { bottom: -6px; right: -6px; border-left: none; border-top: none; }

            body:hover #cinematic-frame { 
                border-color: rgba(44, 53, 64, 0.2); inset: 3.2vw; 
            }
            body:hover #cinematic-frame::before { 
                transform: translate(-4px, -4px) scale(1.1); border-color: rgba(var(--ark-red-rgb), 0.7); 
            }
            body:hover #cinematic-frame::after { 
                transform: translate(4px, 4px) scale(1.1); border-color: rgba(var(--ark-red-rgb), 0.7); 
            }

            /* --- 5. UI 控件适配 --- */
            button, input, textarea, .card, .panel {
                border-radius: 2px !important; 
                background: rgba(244, 241, 235, 0.6) !important;
                backdrop-filter: blur(12px) !important; 
                border: 1px solid rgba(122, 108, 93, 0.2) !important;
                transition: all 0.4s var(--ark-curve) !important; 
                box-shadow: 0 4px 20px rgba(0,0,0, 0.03) !important;
            }
            button:hover, .card:hover {
                background: rgba(244, 241, 235, 0.95) !important; 
                border-color: rgba(var(--ark-red-rgb), 0.4) !important;
                box-shadow: 0 8px 30px rgba(var(--ark-red-rgb), 0.08), inset 3px 0 0px var(--ark-red) !important; 
                transform: translateX(3px) !important; 
            }

            /* --- 6. 核心主观交互 2：档案解密 (Hover Text Reveal) --- */
            .decrypt-layer-container {
                position: fixed; top: calc(3vw + 40px); left: calc(3vw + 40px); z-index: 9991;
                pointer-events: auto; cursor: crosshair; 
            }
            .vertical-poetry {
                writing-mode: vertical-rl; font-family: var(--ark-font-serif);
                font-size: 13px; font-weight: 400; color: var(--ark-dark); 
                letter-spacing: 8px; line-height: 2; opacity: 0.85;
                transition: all 0.5s var(--ark-curve);
            }
            .vertical-poetry span { 
                font-size: 10px; color: var(--ark-muted); margin-top: 24px; letter-spacing: 2px; 
            }

            .hidden-decode-truth {
                position: absolute; top: 0; left: 0; writing-mode: vertical-rl; line-height: 2.2;
                font-family: var(--ark-font-sys); font-size: 10px; font-weight: 600;
                letter-spacing: 2px; color: var(--ark-red); text-transform: uppercase;
                opacity: 0; pointer-events: none; filter: blur(6px);
                transition: all 0.4s var(--ark-curve); white-space: nowrap;
            }

            .decrypt-layer-container:hover .vertical-poetry {
                opacity: 0; transform: translateX(-10px); filter: blur(4px) grayscale(1);
            }
            .decrypt-layer-container:hover .hidden-decode-truth {
                opacity: 0.95; transform: translateX(0); filter: blur(0);
                text-shadow: 0 0 12px rgba(var(--ark-red-rgb), 0.5);
            }

            /* --- 7. 电影大字排版区 (Epic Credits) --- */
            .epic-movie-credits {
                position: fixed; bottom: calc(3vw + 30px); left: 50%; transform: translateX(-50%); 
                font-family: 'Cinzel', serif; font-size: 9px; color: rgba(44, 53, 64, 0.6); 
                text-align: center; letter-spacing: 2px; pointer-events: auto; 
                cursor: crosshair; z-index: 9991; line-height: 1.8; text-transform: uppercase;
            }
            .epic-movie-credits .title-large {
                font-size: 20px; letter-spacing: 14px; color: var(--ark-dark); font-weight: 500;
                transition: all 0.8s var(--ark-curve); position: relative;
            }
            .epic-movie-credits .sub-crews {
                transition: opacity 0.5s var(--ark-curve);
            }
            .epic-movie-credits .tale-desc {
                font-size: 7px; opacity: 0.5; margin-top: 6px; font-weight: 600;
            }
            
            .epic-movie-credits:hover .title-large {
                letter-spacing: 26px; color: transparent; text-shadow: 0 0 10px rgba(44,53,64, 0.3);
            }
            .epic-movie-credits .title-large::after {
                content: '[ PROJECT : PRTS ]'; position: absolute; left: 50%; transform: translateX(-50%); 
                top: 50%; margin-top: -8px; opacity: 0; letter-spacing: 8px; font-size: 13px; 
                color: var(--ark-red); font-family: var(--ark-font-sys); 
                text-shadow: 0 0 5px rgba(var(--ark-red-rgb), 0.4); 
                transition: all 0.6s 0.1s var(--ark-curve);
            }
            .epic-movie-credits:hover .title-large::after { opacity: 1; }

            /* --- 8. 核心主观交互 3：终端签名 (System Terminal) --- */
            .interactive-voxcat-terminal {
                position: fixed; bottom: calc(3vw + 20px); right: calc(3vw + 30px); 
                pointer-events: auto; z-index: 9995; display: flex; flex-direction: column; 
                align-items: flex-end; gap: 6px; cursor: pointer;
            }
            .sys-indicator {
                display: flex; align-items: center; gap: 8px; font-family: var(--ark-font-sys); 
                font-size: 10px; color: rgba(122,108,93,0.8);
            }
            .blink-dot {
                display: block; width: 6px; height: 6px; background-color: rgba(44,53,64,0.4);
                animation: sysBlink 2s var(--ark-curve) infinite; transition: all 0.3s;
            }
            @keyframes sysBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.15; } }

            .sys-sig-text { 
                font-family: 'Cinzel', serif; font-size: 11px; font-weight: 600; 
                letter-spacing: 3px; color: var(--ark-dark); transition: color 0.3s; 
            }
            .sys-hide-coords { 
                max-width: 0; overflow: hidden; white-space: nowrap; 
                transition: max-width 0.6s var(--ark-curve), opacity 0.4s; 
                opacity: 0; border-right: 2px solid var(--ark-red);
            }
            .interactive-voxcat-terminal .secure-port {
                font-family: var(--ark-font-sys); font-size: 8px; opacity: 0.6; letter-spacing: 2px;
            }

            .interactive-voxcat-terminal:hover .blink-dot { 
                background-color: var(--ark-red); animation: sysBlink 0.4s steps(2, end) infinite; 
                box-shadow: 0 0 6px var(--ark-red);
            }
            .interactive-voxcat-terminal:hover .sys-sig-text { color: var(--ark-red); }
            .interactive-voxcat-terminal:hover .sys-hide-coords { 
                max-width: 250px; opacity: 1; margin-left: 8px; padding-right: 6px;
            }
        ` 
    },
    extensions: [
        { 
            type: 'html', 
            content: `
            <div class="ark-base-canvas"></div>
            
            <div id="ark-poster-bg"></div>
            <div id="paper-grain-overlay"></div>
            <div id="cinematic-frame"></div>

            <div class="decrypt-layer-container">
                <div class="vertical-poetry">
                    那是一场未能终结的远征，<br>也是一座必须倾倒的高塔。
                    <span>THE TOWER OF BABEL</span>
                </div>
                <div class="hidden-decode-truth">
                    > ARCHIVE FATAL ERROR <br><br>
                    # REDACTED SECRETS_ <br>
                    "Sacrifice... The Sarkaz King..."
                </div>
            </div>

            <div class="epic-movie-credits">
                <div class="title-large">BABEL</div>
                <div class="sub-crews">THERESA · KAL'TSIT · DOCTOR · AMIYA</div>
                <div class="tale-desc">
                    A TALE OF DESTINY AND SACRIFICE / THE ECHOES OF RHODES ISLAND
                </div>
            </div>

            <div class="interactive-voxcat-terminal">
                <div class="sys-indicator">
                    <span class="sys-hide-coords" id="sys-time-inject">COORD. 1098/Terra.14::AUTH: Doctor</span>
                    <span class="sys-sig-text">VOXCAT LAB</span>
                    <span class="blink-dot"></span>
                </div>
                <div class="secure-port">[ RECORDING... ] // SECURE ACCESS PORT</div>
            </div>
        `
        }
    ]
},
{
    id: 'crimson-abyss',
    name: '🩸 Crimson Abyss',
    logo: {
        type: 'text',
        text: 'CRIMSON',
        colors: [
            '#ffffff',
            '#ff7b89',
            '#ff2a4b',
            '#8b0015'
        ]
    },
    theme: {
        bgBase: '#030001',
        textMain: '#f5e6e8',
        textMuted: '#8a6b70',
        bgImage: `url('https://cdn.nlark.com/yuque/0/2026/png/63108644/1779106097665-3fd87885-cbed-4c09-8c22-d31c20d30079.png')`,
        accentRgb: '255, 42, 75',
        bgSize: '100% 100%',
        bgOpacity: '0.75',
        avatarGrad1: '#ff2a4b',
        avatarGrad2: '#5a000d',
        ambient1: 'rgba(255, 42, 75, 0.25)',
        ambient2: 'rgba(139, 0, 21, 0.18)',
        customCss: `
            /* 1. 锋利晶体坠落 (修复动画轴距，极速割裂感) */
            @keyframes shardDrop {
                0% { 
                    transform: translate3d(0, -10vh, 0) rotateZ(var(--r, 0deg)) scale(var(--s, 1)); 
                    opacity: 0; 
                }
                15% { opacity: var(--o, 0.8); }
                85% { opacity: var(--o, 0.8); }
                100% { 
                    /* 向下坠落，同时带有轻微的横向漂移和自转 */
                    transform: translate3d(var(--sway, 5vw), 110vh, 0) rotateZ(calc(var(--r, 0deg) + 90deg)) scale(var(--s, 1)); 
                    opacity: 0; 
                }
            }
            
            /* 2. 猩红余烬升腾 (完全修复坐标，确保从底部向上充满屏幕) */
            @keyframes emberRise {
                0% { 
                    transform: translate3d(0, 0, 0) scale(var(--s, 1)); 
                    opacity: 0; 
                }
                20% { 
                    opacity: var(--o, 1); 
                    box-shadow: 0 0 12px 3px rgba(255, 42, 75, 0.9);
                }
                80% { 
                    opacity: var(--o, 0.8); 
                }
                100% { 
                    /* 向上升腾 120vh 穿过整个屏幕 */
                    transform: translate3d(var(--sway, -8vw), -120vh, 0) scale(calc(var(--s, 1) * 0.3)); 
                    opacity: 0; 
                }
            }

            /* 3. 深渊呼吸全局光晕 (打破死黑背景) */
            @keyframes abyssPulse {
                0%   { opacity: 0.5; transform: scale(1); }
                50%  { opacity: 0.8; transform: scale(1.05); }
                100% { opacity: 0.5; transform: scale(1); }
            }

            /* --- 元素样式重构 --- */

            /* 全局氛围基底光晕 */
            .abyss-ambient {
                position: fixed;
                top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: radial-gradient(circle at 15% 20%, rgba(255, 42, 75, 0.08) 0%, transparent 40%),
                            radial-gradient(circle at 85% 80%, rgba(139, 0, 21, 0.08) 0%, transparent 50%),
                            radial-gradient(circle at 50% 50%, rgba(255, 42, 75, 0.03) 0%, transparent 60%);
                z-index: -3;
                pointer-events: none;
                animation: abyssPulse 10s ease-in-out infinite alternate;
            }

            /* 锋利的玻璃/晶体碎片：使用 clip-path 切割出真实的锐利形状 */
            .abyss-shard { 
                position: fixed; 
                top: -15vh; 
                width: 8px; 
                height: 50px; 
                background: linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,42,75,0.8) 25%, transparent 100%); 
                /* 核心：切割成菱形尖刺状 */
                clip-path: polygon(50% 0%, 100% 15%, 50% 100%, 0% 15%);
                filter: drop-shadow(0 0 8px rgba(255, 42, 75, 0.6)); 
                pointer-events: none; 
                z-index: -1; 
                will-change: transform, opacity; 
                animation: shardDrop var(--dur, 8s) ease-in infinite var(--d, 0s); 
            }

            /* 远景碎片：小、模糊、慢 */
            .abyss-shard.bg {
                width: 5px; height: 30px;
                filter: blur(3px) brightness(0.5);
                z-index: -2;
            }

            /* 前景碎片：巨大、极速掠过屏幕、强发光 (压迫感来源) */
            .abyss-shard.fg {
                z-index: 10;
                width: 16px; height: 120px;
                background: linear-gradient(180deg, #ffffff 0%, #ff2a4b 20%, rgba(10,0,0,0.5) 100%);
                filter: drop-shadow(0 0 15px rgba(255, 42, 75, 1)) brightness(1.2);
            }

            /* 强光火星/余烬 */
            .abyss-ember {
                position: fixed;
                bottom: -5vh; /* 确保从屏幕正下方起飞 */
                width: 4px; 
                height: 4px; 
                background: #fff;
                border-radius: 50%;
                pointer-events: none;
                z-index: 5;
                mix-blend-mode: plus-lighter; /* 发光叠加效果 */
                animation: emberRise var(--dur, 5s) ease-in infinite var(--d, 0s);
            }
        `
    },
    extensions: [
        {
            type: 'html',
            content: `
            <!-- 1. 全局呼吸光晕 (拯救死黑背景) -->
            <div class="abyss-ambient"></div>

            <!-- 2. 猩红余烬/火星 (数量翻倍，制造热对流升腾的氛围) -->
            <div class="abyss-ember" style="left: 10%; --dur: 6s; --d: 0s;   --o: 0.9; --s: 1.2; --sway: 5vw;"></div>
            <div class="abyss-ember" style="left: 25%; --dur: 4s; --d: 1.5s; --o: 0.7; --s: 0.8; --sway: -3vw;"></div>
            <div class="abyss-ember" style="left: 45%; --dur: 5s; --d: 3s;   --o: 1.0; --s: 1.5; --sway: 4vw;"></div>
            <div class="abyss-ember" style="left: 60%; --dur: 7s; --d: 0.5s; --o: 0.6; --s: 0.9; --sway: -5vw;"></div>
            <div class="abyss-ember" style="left: 80%; --dur: 4.5s;--d: 2s; --o: 0.9; --s: 1.1; --sway: 6vw;"></div>
            <div class="abyss-ember" style="left: 90%; --dur: 6.5s;--d: 4s; --o: 0.5; --s: 0.7; --sway: -2vw;"></div>
            <div class="abyss-ember" style="left: 35%; --dur: 5.5s;--d: 5s; --o: 0.8; --s: 1.3; --sway: 2vw;"></div>

            <!-- 3. 背景层：远景模糊晶体 (营造空间纵深) -->
            <div class="abyss-shard bg" style="left: 5%;  --r: -15deg; --sway: 2vw;  --o: 0.6; --dur: 12s; --d: 0s;"></div>
            <div class="abyss-shard bg" style="left: 30%; --r: 25deg;  --sway: -3vw; --o: 0.5; --dur: 15s; --d: 4s;"></div>
            <div class="abyss-shard bg" style="left: 70%; --r: -10deg; --sway: 4vw;  --o: 0.7; --dur: 14s; --d: 2s;"></div>
            <div class="abyss-shard bg" style="left: 95%; --r: 30deg;  --sway: -2vw; --o: 0.4; --dur: 16s; --d: 6s;"></div>

            <!-- 4. 中景层：标准晶体碎片 (主要视觉元素) -->
            <div class="abyss-shard" style="left: 15%; --r: -25deg; --sway: -4vw; --o: 0.8; --dur: 8s;  --d: 1s;"></div>
            <div class="abyss-shard" style="left: 40%; --r: 15deg;  --sway: 3vw;  --o: 0.9; --dur: 9s;  --d: 4s;"></div>
            <div class="abyss-shard" style="left: 65%; --r: -35deg; --sway: -2vw; --o: 0.7; --dur: 10s; --d: 2.5s;"></div>
            <div class="abyss-shard" style="left: 85%; --r: 20deg;  --sway: 5vw;  --o: 0.8; --dur: 7s;  --d: 6s;"></div>
            <div class="abyss-shard" style="left: 55%; --r: 0deg;   --sway: -1vw; --o: 0.9; --dur: 8.5s;--d: 0.5s;"></div>

            <!-- 5. 前景层：特大锐利碎片 (贴着屏幕极速划落，强光污染) -->
            <div class="abyss-shard fg" style="left: 20%; --r: -10deg; --sway: -6vw; --o: 0.95; --dur: 4s; --d: 3s; --s: 1.2;"></div>
            <div class="abyss-shard fg" style="left: 75%; --r: 15deg;  --sway: 7vw;  --o: 0.9;  --dur: 5s; --d: 0.5s; --s: 1.5;"></div>
            `
        }
    ]
},
{   
    id: 'abyss', 
    name: '🌊 DEEPSEA',
    logo: { type: 'text', text: 'OMNI-ABYSS', colors:['#00f2fe', '#4facfe', '#8fd3f4', '#ffffff'] },
    theme: { 
        bgBase: '#010712', 
        textMain: '#e0f2fe', 
        textMuted: '#6b9dbb', 
        accentRgb: '0, 242, 254', 
        avatarGrad1: '#005c97', 
        avatarGrad2: '#363795', 
        ambient1: 'rgba(0, 242, 254, 0.15)', 
        ambient2: 'rgba(54, 55, 149, 0.18)', 
        customCss: `
            /* --- 原有核心动画 --- */
            @keyframes floatDeep { 
                0% { transform: translateY(110vh) scale(var(--s, 1)) translateX(0); opacity: 0; } 
                20% { opacity: var(--o, 0.6); }
                50% { transform: translateY(50vh) scale(calc(var(--s, 1) * 1.1)) translateX(calc(var(--dir, 1) * 30px)); } 
                80% { opacity: var(--o, 0.6); }
                100% { transform: translateY(-10vh) scale(calc(var(--s, 1) * 1.3)) translateX(calc(var(--dir, 1) * -20px)); opacity: 0; } 
            }
            @keyframes bioluminescence {
                0%, 100% { opacity: 0.2; transform: scale(0.8); box-shadow: 0 0 2px rgba(0, 242, 254, 0.2); }
                50% { opacity: 1; transform: scale(1.5); box-shadow: 0 0 10px rgba(0, 242, 254, 0.8); }
            }
            @keyframes godRays {
                /* 引入 --sy 接收 JS 滚动变量 */
                0% { transform: translateY(var(--sy, 0px)) translateX(-5%) skewX(-15deg); opacity: 0.3; }
                100% { transform: translateY(var(--sy, 0px)) translateX(5%) skewX(-10deg); opacity: 0.6; }
            }

            /* --- 原有样式 --- */
            .omni-bubble { 
                position: fixed; bottom: -10vh; border-radius: 50%; 
                border: 1px solid rgba(0, 242, 254, 0.2); 
                box-shadow: inset 2px 2px 8px rgba(255, 255, 255, 0.2), inset -2px -2px 12px rgba(0, 242, 254, 0.3); 
                backdrop-filter: blur(2px);
                -webkit-backdrop-filter: blur(2px);
                pointer-events: none; z-index: 1; 
            }
            .omni-plankton {
                position: fixed; border-radius: 50%; background: #00f2fe;
                pointer-events: none; z-index: 0;
                animation: floatDeep var(--dur) ease-in-out infinite var(--del);
                will-change: transform;
                /* 采用 margin 偏移配合过渡动画，避免和 CSS transform 冲突 */
                transition: margin 0.3s ease-out;
            }
            /* 将发光分离到伪元素，防止与主元素的 floatDeep 动画相互覆盖 */
            .omni-plankton::after {
                content: '';
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                border-radius: 50%;
                background: inherit;
                animation: bioluminescence var(--pulse) ease-in-out infinite alternate;
            }
            .omni-abyss-light {
                position: fixed; top: 0; left: -20%; width: 140%; height: 60vh;
                background: linear-gradient(180deg, rgba(0, 242, 254, 0.04) 0%, transparent 100%);
                pointer-events: none; z-index: 0;
                animation: godRays 12s ease-in-out infinite alternate;
                will-change: transform;
            }

            /* --- 新增：交互特效 CSS --- */
            
            /* 1. 点击产生的爆炸气泡 */
            .omni-click-pop {
                position: fixed;
                border-radius: 50%;
                border: 1px solid rgba(0, 242, 254, 0.5);
                box-shadow: inset 0 0 10px rgba(0, 242, 254, 0.6);
                pointer-events: none;
                z-index: 50;
                animation: popRise 1.2s ease-out forwards;
            }
            @keyframes popRise {
                0% { transform: scale(0.5) translateY(0); opacity: 1; }
                100% { transform: scale(2) translateY(-100px); opacity: 0; }
            }

            /* 2. 水波纹涟漪 */
            .omni-ripple {
                position: fixed;
                border-radius: 50%;
                border: 2px solid rgba(143, 211, 244, 0.4);
                pointer-events: none;
                z-index: 40;
                transform: translate(-50%, -50%);
                animation: rippleSpread 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            }
            @keyframes rippleSpread {
                0% { width: 0; height: 0; opacity: 1; }
                100% { width: 200px; height: 200px; opacity: 0; }
            }

            /* 3. 鼠标跟随探照灯 */
            .omni-cursor-light {
                position: fixed;
                width: 250px;
                height: 250px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(0, 242, 254, 0.05) 30%, transparent 70%);
                pointer-events: none;
                z-index: 0;
                transform: translate(-50%, -50%);
                transition: opacity 0.5s ease;
                mix-blend-mode: screen;
            }

            /* 深海体积光与焦散波纹 (模拟水下光线折射) */
            @keyframes causticsDrift {
                0%   { background-position: 0% 0%, 0% 0%; opacity: 0.15; }
                50%  { background-position: 3% 1%, -2% -1%; opacity: 0.22; }
                100% { background-position: 0% 0%, 0% 0%; opacity: 0.15; }
            }
            .caustics-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background:
                    radial-gradient(circle at 20% 30%, rgba(0,242,254,0.04) 0%, transparent 50%),
                    radial-gradient(circle at 70% 60%, rgba(0,242,254,0.03) 0%, transparent 50%);
                pointer-events: none; z-index: 0;
                animation: causticsDrift 12s ease-in-out infinite alternate;
            }
            /* 深海深度雾 — 模拟水下能见度衰减 */
            .depth-fog {
                position: fixed; bottom: 0; left: 0; width: 100vw; height: 40vh;
                background: linear-gradient(to top, rgba(2,9,20,0.5) 0%, transparent 100%);
                pointer-events: none; z-index: 2;
            }

            /* 4. UI元素发光悬停 (收敛了 transition 属性以防破坏按钮原有样式) */
            .omni-glow-hover {
                transition: box-shadow 0.3s, transform 0.3s, border-color 0.3s !important;
            }
            .omni-glow-hover:hover {
                box-shadow: 0 0 15px rgba(0, 242, 254, 0.4), 0 0 30px rgba(79, 172, 254, 0.2);
                transform: translateY(-1px);
                border-color: rgba(0, 242, 254, 0.6);
            }
        ` 
    },
    extensions:[
        { type: 'html', content: `
                        <!-- 焦散光层 — 水下光线折射波纹 -->
            <div class="caustics-overlay"></div>
            <!-- 深度雾层 — 海底能见度衰减 -->
            <div class="depth-fog"></div>
<!-- 环境层 -->
            <div class="omni-abyss-light"></div>
            <div class="omni-abyss-light" style="left: -10%; animation-delay: -5s; animation-duration: 15s; background: linear-gradient(180deg, rgba(79, 172, 254, 0.03) 0%, transparent 100%);"></div>

            <!-- 装饰层 -->
            <div class="omni-bubble" style="left: 12%; width: 18px; height: 18px; --s: 1; --o: 0.4; --dir: 1; animation: floatDeep 14s ease-in-out infinite 0s;"></div>
            <div class="omni-bubble" style="left: 38%; width: 32px; height: 32px; --s: 0.8; --o: 0.3; --dir: -1; animation: floatDeep 18s ease-in-out infinite 2s;"></div>
            <div class="omni-bubble" style="left: 72%; width: 22px; height: 22px; --s: 1.1; --o: 0.4; --dir: 1; animation: floatDeep 16s ease-in-out infinite 5s;"></div>
            <div class="omni-bubble" style="left: 88%; width: 45px; height: 45px; --s: 0.6; --o: 0.2; --dir: -1; animation: floatDeep 22s ease-in-out infinite 1s;"></div>
            <div class="omni-bubble" style="left: 55%; width: 14px; height: 14px; --s: 1.4; --o: 0.5; --dir: 1; animation: floatDeep 12s ease-in-out infinite 7s;"></div>

            <div class="omni-plankton" style="left: 25%; width: 3px; height: 3px; --dur: 20s; --del: 1s; --pulse: 3s; --dir: -1;"></div>
            <div class="omni-plankton" style="left: 65%; width: 4px; height: 4px; --dur: 25s; --del: 4s; --pulse: 4s; --dir: 1;"></div>
            <div class="omni-plankton" style="left: 80%; width: 2px; height: 2px; --dur: 18s; --del: 8s; --pulse: 2s; --dir: -1;"></div>
            <div class="omni-plankton" style="left: 45%; width: 3px; height: 3px; --dur: 22s; --del: 3s; --pulse: 3.5s; --dir: 1;"></div>
            <div class="omni-plankton" style="left: 10%; width: 2px; height: 2px; --dur: 19s; --del: 6s; --pulse: 2.5s; --dir: 1;"></div>

            <!-- 交互层：鼠标光晕 (CSS变量驱动，随鼠标平滑跟随) -->
            <div class="omni-cursor-light" style="left: calc(var(--mx) * 100vw); top: calc(var(--my) * 100vh);"></div>
	        `}
	    ]
	},
{
    id: 'hyperspace-cinema', 
    name: '🚀 HYPERSPACE',
    logo: { 
        type: 'text', 
        text: 'WARP. OS', 
        colors: ['#00ffff', '#ffffff', '#8a2be2', '#ffffff'] 
    },
    theme: { 
        bgBase: '#020205', 
        textMain: '#e0f7fa', 
        textMuted: '#4dd0e1', 
        accentRgb: '0, 255, 255', 
        avatarGrad1: '#00ffff', 
        avatarGrad2: '#8a2be2', 
        ambient1: 'rgba(0, 255, 255, 0.15)', 
        ambient2: 'rgba(138, 43, 226, 0.18)', 
        
        customCss: `
            /* --- 科幻风格UI --- */
            body, html, #app, #root, .main-container, .layout {
                background: transparent !important;
                background-color: transparent !important;
                color: #e0f7fa;
            }
            input, textarea, .search-bar, .mock-input {
                background: rgba(2, 5, 15, 0.6) !important;
                border: 1px solid rgba(0, 255, 255, 0.4) !important;
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.1), inset 0 0 10px rgba(0, 255, 255, 0.1) !important;
                color: #ffffff !important;
                border-radius: 8px !important;
                backdrop-filter: blur(5px);
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
            }
            input:focus, textarea:focus, .search-bar:focus-within {
                border-color: #00ffff !important;
                box-shadow: 0 0 25px rgba(0, 255, 255, 0.6), inset 0 0 15px rgba(0, 255, 255, 0.3) !important;
                outline: none !important;
            }
            button {
                background: linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(138, 43, 226, 0.2)) !important;
                border: 1px solid #8a2be2 !important;
                color: #00ffff !important;
                box-shadow: 0 0 10px rgba(138, 43, 226, 0.4) !important;
                text-shadow: 0 0 5px rgba(0, 255, 255, 0.8);
                transition: all 0.2s ease !important;
            }
            button:hover {
                background: linear-gradient(45deg, rgba(0, 255, 255, 0.3), rgba(138, 43, 226, 0.5)) !important;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.6) !important;
                transform: translateY(-1px);
            }
            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
            ::-webkit-scrollbar-thumb { background: #00ffff; border-radius: 3px; box-shadow: 0 0 10px #00ffff; }

            /* --- 纯CSS星空层 (radial-gradient 模拟粒子, GPU加速, 三层视差) --- */
            .hs-layer {
                position: fixed; inset: 0; pointer-events: none; z-index: -2;
                background-image:
                    radial-gradient(2px 2px at 40px 60px, #fff, transparent),
                    radial-gradient(2px 2px at 150px 30px, #e0f7fa, transparent),
                    radial-gradient(1px 1px at 90px 140px, #fff, transparent),
                    radial-gradient(2px 2px at 220px 210px, #4dd0e1, transparent),
                    radial-gradient(1px 1px at 350px 80px, #fff, transparent),
                    radial-gradient(2px 2px at 60px 250px, #b388ff, transparent),
                    radial-gradient(1px 1px at 300px 180px, #e0f7fa, transparent),
                    radial-gradient(2px 2px at 180px 300px, #fff, transparent),
                    radial-gradient(1px 1px at 30px 190px, #4dd0e1, transparent),
                    radial-gradient(2px 2px at 250px 40px, #fff, transparent),
                    radial-gradient(1px 1px at 380px 260px, #b388ff, transparent),
                    radial-gradient(2px 2px at 120px 350px, #e0f7fa, transparent);
                background-repeat: repeat;
                background-size: 400px 400px;
                opacity: 0;
            }
            .hs-1 {
                animation: warp-zoom 3s linear 0s infinite;
                transform: translate(calc((var(--mx) - 0.5) * -10px), calc((var(--my) - 0.5) * -10px));
            }
            .hs-2 {
                animation: warp-zoom 4.5s linear -2s infinite;
                transform: translate(calc((var(--mx) - 0.5) * -22px), calc((var(--my) - 0.5) * -22px));
            }
            .hs-3 {
                animation: warp-zoom 6s linear -4s infinite;
                transform: translate(calc((var(--mx) - 0.5) * -40px), calc((var(--my) - 0.5) * -40px));
            }
            .hs-layer::after {
                content: '';
                position: absolute; inset: 0;
                background: inherit;
                background-size: inherit;
                animation: inherit;
            }
            @keyframes warp-zoom {
                0% { transform: scale(1); opacity: 0; }
                15% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: scale(8); opacity: 0; }
            }
            /* 宇宙深空暗角 */
            .hs-vignette {
                position: fixed; inset: 0; pointer-events: none; z-index: -1;
                background: radial-gradient(circle at center, transparent 25%, #010104 100%);
            }
            /* HUD 瞄准准星装饰 */
            .hud-corners {
                position: fixed; width: 100vw; height: 100vh; top:0; left:0;
                pointer-events: none; z-index: -90; opacity: 0.3;
            }
            .hud-corner { position: absolute; width: 40px; height: 40px; border: 2px solid #00ffff; }
            .hud-tl { top: 30px; left: 30px; border-right: none; border-bottom: none; }
            .hud-tr { top: 30px; right: 30px; border-left: none; border-bottom: none; }
            .hud-bl { bottom: 30px; left: 30px; border-right: none; border-top: none; }
            .hud-br { bottom: 30px; right: 30px; border-left: none; border-top: none; }
            /* 跃迁闪烁 — 输入框聚焦时纯CSS自动触发 */
            #warp-flash-overlay {
                position: fixed; inset: 0; background: #ffffff;
                z-index: 99999; pointer-events: none; opacity: 0;
            }
            body:has(input:focus) #warp-flash-overlay,
            body:has(textarea:focus) #warp-flash-overlay,
            body:has(.search-bar:focus-within) #warp-flash-overlay {
                animation: warp-flash-seq 2.5s ease-out 1;
            }
            @keyframes warp-flash-seq {
                0% { opacity: 0; } 4% { opacity: 1; } 8% { opacity: 0; }
                12% { opacity: 0.5; } 16% { opacity: 0; } 100% { opacity: 0; }
            }
            #warp-warning {
                position: fixed; top: 20vh; left: 50%; transform: translateX(-50%);
                font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold;
                color: #ff0055; text-shadow: 0 0 10px #ff0055; letter-spacing: 10px;
                z-index: 9998; opacity: 0; pointer-events: none;
            }
            body:has(input:focus) #warp-warning,
            body:has(textarea:focus) #warp-warning,
            body:has(.search-bar:focus-within) #warp-warning {
                animation: warp-warn 2.5s ease-out 1;
            }
            @keyframes warp-warn {
                0% { opacity: 0; } 10% { opacity: 1; } 80% { opacity: 0.5; } 100% { opacity: 0; }
            }
        ` 
    },
    extensions:[
        { type: 'html', content: `
            <div class="hs-layer hs-1"></div>
            <div class="hs-layer hs-2"></div>
            <div class="hs-layer hs-3"></div>
            <div class="hs-vignette"></div>
            <div id="warp-flash-overlay"></div>
            <div id="warp-warning">HYPERDRIVE ENGAGED</div>
            <div class="hud-corners">
                <div class="hud-corner hud-tl"></div>
                <div class="hud-corner hud-tr"></div>
                <div class="hud-corner hud-bl"></div>
                <div class="hud-corner hud-br"></div>
            </div>
        `}
    ]
},
{   
    id: 'retro-os-1995-ultimate', 
    name: '💾 RETRO OS 1995',
    logo: { 
        type: 'text', 
        text: 'Windoze 95', 
        colors:['#c0c0c0', '#000080', '#c0c0c0', '#ffffff'] 
    },
    theme: { 
        bgBase: '#008080', 
        textMain: '#ffffff', 
        textMuted: '#c0c0c0', 
        accentRgb: '0, 0, 128', 
        avatarGrad1: '#c0c0c0', 
        avatarGrad2: '#808080', 
        ambient1: 'rgba(0, 128, 128, 0.03)', 
        ambient2: 'rgba(0, 128, 128, 0.02)', 
        
        customCss: `
            /* ========================================================= */
            /* 核心修复：破解系统底层挂载层的 z-index 隔离，让子元素突破天花板 */
            /* ========================================================= */
            #omni-extensions {
                display: contents !important;
            }

            /* 全局像素化抗锯齿，极大提升复古高分辨率画质 */
            body, html, #app, #root, .main-container, .layout, * {
                -webkit-font-smoothing: none !important;
                -moz-osx-font-smoothing: grayscale !important;
                font-smooth: never !important;
                image-rendering: pixelated !important;
                image-rendering: crisp-edges !important;
                cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='18' viewBox='0 0 12 18'%3E%3Cpath fill='%23fff' stroke='%23000' stroke-width='1' d='M1 1v14l3-3 2 5 2-1-2-5 4-1z'/%3E%3C/svg%3E"), auto !important;
            }
            a, button, .desktop-icon, #win95-start, .win95-btn, .ms-cell, #retro-clippy-svg {
                cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='21' viewBox='0 0 16 21'%3E%3Cpath fill='%23fff' stroke='%23000' stroke-width='1' d='M5 1v6h-4v2h2v2h2v2h2v2h2v-2h2v2h2v-2h2v-2h-2v-2h-2v-2h2v-2h-4v-6z'/%3E%3C/svg%3E") 6 0, pointer !important;
            }

            ::selection { background: #000080; color: #ffffff; }

            body, html, #app, #root, .main-container, .layout {
                background: transparent !important;
                background-color: transparent !important;
            }

            input, textarea, button {
                font-family: 'Tahoma', 'MS Sans Serif', 'Segoe UI', sans-serif !important;
            }

            /* 高级复古抖动网格背景，提升画面质感 */
            #retro-bg {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: #008080;
                background-image: 
                    linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.05)), 
                    linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.05));
                background-size: 4px 4px;
                background-position: 0 0, 2px 2px;
                z-index: -10; pointer-events: none;
            }

            /* 像素级完美 CRT 扫描线，清晰不模糊 */
            #crt-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: repeating-linear-gradient(0deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px),
                            linear-gradient(90deg, rgba(255,0,0,0.02), rgba(0,255,0,0.01), rgba(0,0,255,0.02));
                background-size: 100% 2px, 3px 100%;
                z-index: 99999; pointer-events: none;
                box-shadow: inset 0 0 60px rgba(0,0,0,0.3);
                animation: crtFlicker 0.15s infinite;
            }
            @keyframes crtFlicker {
                0% { opacity: 0.97; } 50% { opacity: 1; } 100% { opacity: 0.98; }
            }

            /* --- 全局故障效果动画 --- */
            .glitch-anim {
                animation: glitch-skew 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
            }
            @keyframes glitch-skew {
                0% { transform: translate(0) } 20% { transform: translate(-3px, 2px) }
                40% { transform: translate(-3px, -2px) } 60% { transform: translate(3px, 2px) }
                80% { transform: translate(3px, -2px) } 100% { transform: translate(0) }
            }

            #retro-ui-layer {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 9998; pointer-events: none; 
            }

            #retro-trail-container, #retro-windows-container {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;
            }

            /* --- 桌面图标 --- */
            .win95-desktop-icons {
                position: absolute; top: 40px; left: 20px;
                display: flex; flex-direction: column; gap: 24px; pointer-events: auto; 
            }

            .desktop-icon {
                display: flex; flex-direction: column; align-items: center; width: 75px; cursor: pointer;
            }
            .desktop-icon .icon-img { font-size: 36px; filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.6)); margin-bottom: 6px; }
            .desktop-icon span {
                color: #ffffff; font-size: 12px; font-family: 'Tahoma', sans-serif;
                text-align: center; padding: 2px 4px; line-height: 1.1; border: 1px dotted transparent;
            }
            .desktop-icon:active span, .desktop-icon.selected span { background: #000080; border-color: #ffffff; }

            /* --- 任务栏 --- */
            #win95-taskbar {
                position: fixed; bottom: 56px; left: 50%; transform: translateX(-50%);
                width: 90vw; max-width: 1200px; height: 34px; background: #c0c0c0;
                border-top: 2px solid #ffffff; border-left: 2px solid #ffffff;
                border-right: 2px solid #404040; border-bottom: 2px solid #404040;
                box-shadow: 4px 4px 0 rgba(0,0,0,0.3), inset -1px -1px #808080, inset 1px 1px #dfdfdf;
                display: flex; justify-content: space-between; align-items: center;
                padding: 0 4px; z-index: 9999; pointer-events: auto; font-family: 'Tahoma', sans-serif;
            }

            .win95-start-btn {
                height: 24px; display: flex; align-items: center; gap: 6px;
                font-weight: bold; padding: 0 8px 0 6px; background: #c0c0c0;
                border-top: 2px solid #ffffff; border-left: 2px solid #ffffff;
                border-right: 2px solid #404040; border-bottom: 2px solid #404040;
                box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf;
                font-size: 13px; font-style: italic; letter-spacing: 0.5px; outline: none;
            }
            .win95-start-btn:active, .win95-start-btn.active {
                border-top: 2px solid #404040; border-left: 2px solid #404040;
                border-right: 2px solid #ffffff; border-bottom: 2px solid #ffffff;
                box-shadow: inset 1px 1px #808080, inset -1px -1px #dfdfdf;
                padding-top: 2px; padding-left: 7px; padding-right: 7px;
            }

            .win95-tray {
                height: 24px; padding: 0 10px; display: flex; align-items: center;
                border-top: 2px solid #808080; border-left: 2px solid #808080;
                border-right: 2px solid #ffffff; border-bottom: 2px solid #ffffff;
                font-size: 11px; color: #000; margin-right: 2px;
            }

            /* --- 开始菜单 --- */
            #win95-start-menu {
                position: fixed; bottom: 92px; 
                /* 修复超宽屏导致开始菜单与任务栏脱离的自适应对齐问题 */
                left: calc(max(5vw, 50vw - 600px) + 4px);
                width: 200px; background: #c0c0c0;
                border-top: 2px solid #ffffff; border-left: 2px solid #ffffff;
                border-right: 2px solid #404040; border-bottom: 2px solid #404040;
                box-shadow: 4px 4px 0 rgba(0,0,0,0.3); z-index: 10000;
                display: flex; pointer-events: auto; transform: scaleY(0); transform-origin: bottom left;
                transition: transform 0.1s ease-out; font-family: 'Tahoma', sans-serif;
            }
            #win95-start-menu.open { transform: scaleY(1); }
            
            .start-sidebar {
                width: 30px; background: linear-gradient(180deg, #000080, #1084d0);
                display: flex; align-items: flex-end; padding-bottom: 10px;
            }
            .start-sidebar span {
                color: #fff; font-weight: bold; font-size: 18px; transform: rotate(-90deg);
                white-space: nowrap; margin-bottom: 30px; margin-left: 4px;
            }
            .start-sidebar span b { font-weight: 900; }
            .start-items { flex-grow: 1; padding: 4px; display: flex; flex-direction: column; }
            .start-item {
                display: flex; align-items: center; gap: 10px; padding: 6px 10px;
                color: #000; font-size: 12px; cursor: pointer;
            }
            .start-item:hover { background: #000080; color: #fff; }
            .start-divider { height: 2px; border-top: 1px solid #808080; border-bottom: 1px solid #ffffff; margin: 4px 0; }

            /* --- 弹窗硬核样式 --- */
            .win95-dialog {
                position: absolute; width: 320px; background: #c0c0c0;
                border-top: 2px solid #ffffff; border-left: 2px solid #ffffff;
                border-right: 2px solid #404040; border-bottom: 2px solid #404040;
                box-shadow: inset -1px -1px #808080, inset 1px 1px #dfdfdf, 3px 3px 0 rgba(0,0,0,0.3);
                color: #000; font-family: 'Tahoma', sans-serif; pointer-events: auto; 
            }
            .win95-titlebar {
                background: linear-gradient(90deg, #000080, #1084d0); color: #ffffff; padding: 3px 4px 3px 6px; 
                font-weight: bold; font-size: 12px; display: flex; justify-content: space-between; align-items: center; user-select: none;
            }
            .win95-titlebar.inactive { background: #808080; }
            .win95-btn {
                background: #c0c0c0; border-top: 2px solid #ffffff; border-left: 2px solid #ffffff;
                border-right: 2px solid #404040; border-bottom: 2px solid #404040; outline: none; color: #000;
            }
            .win95-btn:active {
                border-top: 2px solid #404040; border-left: 2px solid #404040;
                border-right: 2px solid #ffffff; border-bottom: 2px solid #ffffff;
                padding-top: 1px; padding-left: 1px;
            }
            .win95-close { width: 18px; height: 16px; font-size: 10px; font-weight: bold; line-height: 12px; padding: 0; }
            .win95-content { padding: 18px; display: flex; align-items: flex-start; gap: 16px; font-size: 12px; }
            
            .win95-icon-error {
                width: 32px; height: 32px; border-radius: 50%; background: #ff0000; color: white;
                display: flex; justify-content: center; align-items: center; font-size: 24px; font-weight: bold;
                border: 2px solid #ff0000; flex-shrink: 0; box-shadow: inset -2px -2px 0 rgba(0,0,0,0.5);
            }
            .win95-footer { display: flex; justify-content: center; padding-bottom: 16px; gap: 10px; }
            .win95-footer .win95-btn { padding: 4px 20px; font-size: 12px; }

            /* 扫雷样式 */
            .ms-grid { display: grid; grid-template-columns: repeat(8, 24px); border: 3px solid; border-color: #808080 #ffffff #ffffff #808080; background: #c0c0c0; }
            .ms-cell { width: 24px; height: 24px; background: #c0c0c0; border: 2px solid; border-color: #ffffff #808080 #808080 #ffffff; display: flex; justify-content: center; align-items: center; font-size: 14px; font-weight: bold; box-sizing: border-box; }
            .ms-cell:active { border: 1px solid #808080; border-right-color:#c0c0c0; border-bottom-color:#c0c0c0; }
            .ms-cell.revealed { border: 1px solid #808080; border-right-color:#c0c0c0; border-bottom-color:#c0c0c0; background: #c0c0c0; }

            /* 碎片整理样式 */
            .defrag-grid { display: flex; flex-wrap: wrap; gap: 1px; background: #fff; padding: 4px; border: 2px solid #808080; border-right-color: #dfdfdf; border-bottom-color: #dfdfdf; height: 160px; align-content: flex-start; }
            .defrag-block { width: 8px; height: 12px; border: 1px solid rgba(0,0,0,0.1); }

            /* 记事本 */
            .notepad-content { padding: 2px; height: 220px; display: flex; flex-direction: column; }
            .notepad-toolbar { padding: 2px 4px; font-size: 12px; color: #000; border-bottom: 1px solid #808080; display: flex; gap: 10px; }
            .notepad-toolbar span:first-letter { text-decoration: underline; }
            .notepad-textarea {
                flex-grow: 1; width: 100%; resize: none; border: 2px solid #808080; border-right-color: #fff; border-bottom-color: #fff;
                font-family: 'Fixedsys', 'Courier New', monospace; font-size: 15px; padding: 6px; outline: none; background: #fff; color: #000;
            }

            /* --- 蓝屏死机 BSOD --- */
            #bsod {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background-color: #0000aa; color: #aaaaaa; font-family: 'Consolas', 'Courier New', monospace;
                font-size: 18px; padding: 50px; z-index: 100000; display: none; pointer-events: auto; flex-direction: column; align-items: center;
            }
            .bsod-bg-text { background: #aaaaaa; color: #0000aa; padding: 0 8px; font-weight: bold; margin-bottom: 30px; }
            .bsod-text { text-align: left; max-width: 800px; line-height: 1.5; margin-bottom: 20px;}

            /* --- 大眼夹 --- */
            #retro-clippy-wrapper {
                position: fixed; bottom: 120px; right: 50px; z-index: 9999; pointer-events: auto;
                display: flex; flex-direction: column; align-items: flex-end;
                animation: clippyFloat 4s ease-in-out infinite;
            }
            @keyframes clippyFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
            
            .clippy-bubble {
                background: #ffffe1; border: 1px solid #000000; padding: 10px 14px; border-radius: 8px;
                font-family: 'Tahoma', sans-serif; font-size: 13px; color: #000000; box-shadow: 2px 2px 0 rgba(0,0,0,0.4);
                width: 180px; opacity: 0; transform: translateY(10px); transition: all 0.3s ease; margin-bottom: 12px; position: relative; font-weight: bold;
            }
            .clippy-bubble::after {
                content: ''; position: absolute; bottom: -8px; right: 24px;
                border-width: 8px 8px 0 0; border-style: solid; 
                border-color: #ffffe1 transparent transparent transparent; /* 修复黑色下三角问题 */
                filter: drop-shadow(1px 1px 0 #000);
            }
            .clippy-bubble.active { opacity: 1; transform: translateY(0); }
            .clippy-bubble.angry { background: #ff0000 !important; color: #ffffff !important; border-color: #ffffff; }
            .clippy-bubble.angry::after { border-color: #ff0000 transparent transparent transparent; filter: drop-shadow(1px 1px 0 #fff); }
            
            #retro-clippy-svg { filter: drop-shadow(3px 3px 0 rgba(0,0,0,0.4)); transition: transform 0.2s; }
            #retro-clippy-svg:active { transform: scale(0.9); }
            
            .clippy-eye-group { transform-origin: 48px 31px; animation: clippyBlink 5s infinite; }
            @keyframes clippyBlink { 0%, 94%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }
        ` 
    },
    extensions:[
        { type: 'html', content: `
            <div id="retro-bg"></div>
            <div id="crt-overlay"></div>

            <div id="bsod">
                <div class="bsod-bg-text">Windows</div>
                <div class="bsod-text">
                    A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated.<br><br>
                    *  Press any key to terminate the current application.<br>
                    *  Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.
                </div>
                <div class="bsod-text" style="text-align: center; margin-top: 40px;">Press any key to continue _</div>
            </div>

            <div id="retro-ui-layer">
                
                <div class="win95-desktop-icons">
                    <div class="desktop-icon" id="icon-computer">
                        <div class="icon-img">💻</div>
                        <span>My Matrix</span>
                    </div>
                    <div class="desktop-icon" id="icon-notepad">
                        <div class="icon-img">📝</div>
                        <span>Notepad</span>
                    </div>
                    <div class="desktop-icon" id="icon-internet">
                        <div class="icon-img">🌍</div>
                        <span>Internet<br>Exploder</span>
                    </div>
                    <div class="desktop-icon" id="icon-defrag">
                        <div class="icon-img">🗄️</div>
                        <span>Disk Defrag</span>
                    </div>
                    <div class="desktop-icon" id="icon-minesweeper">
                        <div class="icon-img">💣</div>
                        <span>Minesweeper</span>
                    </div>
                    <div class="desktop-icon" id="icon-trash">
                        <div class="icon-img">🗑️</div>
                        <span>Recycle Bin</span>
                    </div>
                </div>

                <div id="retro-trail-container"></div>
                <div id="retro-windows-container"></div>
                
                <!-- 开始菜单 -->
                <div id="win95-start-menu">
                    <div class="start-sidebar">
                        
                    </div>
                    <div class="start-items">
                        <div class="start-item" id="menu-prog">📁 Programs</div>
                        <div class="start-item" id="menu-doc">📄 Documents</div>
                        <div class="start-item" id="menu-set">⚙️ Settings</div>
                        <div class="start-divider"></div>
                        <div class="start-item" id="menu-find">🔍 Find</div>
                        <div class="start-item" id="menu-help">❓ Help</div>
                        <div class="start-item" id="menu-run">🏃 Run...</div>
                        <div class="start-divider"></div>
                        <div class="start-item" id="menu-shutdown">🔌 Shut Down...</div>
                    </div>
                </div>

                <!-- 任务栏 -->
                <div id="win95-taskbar">
                    <button class="win95-start-btn" id="win95-start">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" fill="#000"/></svg>
                        Start
                    </button>
                    <div class="win95-tray">
                        <span id="win95-clock">12:00 PM</span>
                    </div>
                </div>

            </div>

            <!-- 弹窗模板：报错 -->
            <div id="win95-error-template" class="win95-dialog" style="display: none;">
                <div class="win95-titlebar">
                    <span class="win-title-text">Error</span>
                    <button class="win95-btn win95-close">X</button>
                </div>
                <div class="win95-content">
                    <div class="win95-icon-error">×</div>
                    <div class="win-msg-text">Error message.</div>
                </div>
                <div class="win95-footer">
                    <button class="win95-btn win95-ok">OK</button>
                </div>
            </div>

            <!-- 弹窗模板：记事本 -->
            <div id="win95-notepad-template" class="win95-dialog" style="display: none; width: 400px;">
                <div class="win95-titlebar">
                    <span class="win-title-text">Untitled - Notepad</span>
                    <button class="win95-btn win95-close">X</button>
                </div>
                <div class="notepad-content">
                    <div class="notepad-toolbar">
                        <span>File</span><span>Edit</span><span>Search</span><span>Help</span>
                    </div>
                    <textarea class="notepad-textarea" spellcheck="false"></textarea>
                </div>
            </div>

            <!-- 弹窗模板：扫雷 -->
            <div id="win95-minesweeper-template" class="win95-dialog" style="display: none; width: auto; background: #c0c0c0;">
                <div class="win95-titlebar">
                    <span class="win-title-text">Minesweeper</span>
                    <button class="win95-btn win95-close">X</button>
                </div>
                <div class="win95-content" style="flex-direction: column; align-items: center; padding: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; border: 2px solid; border-color: #808080 #fff #fff #808080; padding: 4px; margin-bottom: 8px; background: #c0c0c0;">
                        <span style="background:#000; color:red; font-family:'Courier New', monospace; font-size:18px; font-weight:bold; padding: 0 4px; border:1px solid #808080;">010</span>
                        <div class="ms-face win95-btn" style="width:26px; height:26px; font-size:16px; display:flex; justify-content:center; align-items:center; cursor:pointer;">🙂</div>
                        <span style="background:#000; color:red; font-family:'Courier New', monospace; font-size:18px; font-weight:bold; padding: 0 4px; border:1px solid #808080;">000</span>
                    </div>
                    <div class="ms-grid"></div>
                </div>
            </div>

            <!-- 弹窗模板：碎片整理 -->
            <div id="win95-defrag-template" class="win95-dialog" style="display: none; width: 380px;">
                <div class="win95-titlebar">
                    <span class="win-title-text">Disk Defragmenter</span>
                    <button class="win95-btn win95-close">X</button>
                </div>
                <div class="win95-content" style="flex-direction: column; padding: 12px;">
                    <div class="defrag-status" style="font-size: 12px; margin-bottom: 8px; font-weight: bold;">Drive C: 1% complete</div>
                    <div class="defrag-grid"></div>
                    <div style="display: flex; gap: 10px; margin-top: 10px; font-size: 11px;">
                        <div style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:10px; height:10px; background:#ff0000; border:1px solid #000;"></span> Unoptimized</div>
                        <div style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:10px; height:10px; background:#ffffff; border:1px solid #000;"></span> Free</div>
                        <div style="display:flex; align-items:center; gap:4px;"><span style="display:inline-block; width:10px; height:10px; background:#0000ff; border:1px solid #000;"></span> Optimized</div>
                    </div>
                </div>
            </div>

            <div id="retro-clippy-wrapper">
                <div class="clippy-bubble" id="clippy-bubble">It looks like you're trying to exist. Need help?</div>
                <svg id="retro-clippy-svg" viewBox="0 0 100 100" width="90" height="90">
                    <path d="M 35 75 L 35 30 C 35 15, 65 15, 65 30 L 65 65 C 65 85, 20 85, 20 65 L 20 20 C 20 5, 45 5, 45 20 L 45 55" fill="none" stroke="#505050" stroke-width="12" stroke-linecap="round"/>
                    <path d="M 35 75 L 35 30 C 35 15, 65 15, 65 30 L 65 65 C 65 85, 20 85, 20 65 L 20 20 C 20 5, 45 5, 45 20 L 45 55" fill="none" stroke="#e0e0e0" stroke-width="8" stroke-linecap="round"/>
                    <path d="M 32 20 Q 38 23 44 20" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"/>
                    <path d="M 52 18 Q 58 23 64 20" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"/>
                    <g class="clippy-eye-group">
                        <circle cx="38" cy="32" r="9" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
                        <circle cx="58" cy="30" r="9" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
                        <g id="clip-eye-1"><circle cx="38" cy="32" r="3.5" fill="#000" class="eye-pupil"/><circle cx="37" cy="31" r="1" fill="#fff"/></g>
                        <g id="clip-eye-2"><circle cx="58" cy="30" r="3.5" fill="#000" class="eye-pupil"/><circle cx="57" cy="29" r="1" fill="#fff"/></g>
                    </g>
                </svg>
            </div>

            <!-- 修复安全与单页框架挂载Bug：使用 textContent 解析，并保障重入安全 -->
            

            
        `}
    ]
},
        {   
    id: 'retro-mirage', 
    name: '🌇 Retro-Matrix',
    logo: { 
        type: 'text', 
        text: 'RETRO::MATRIX', 
        colors:['#ff2a85', '#00e5ff', '#ffdf00', '#00e5ff'] 
    },
    theme: { 
        bgBase: '#070210', // 压暗背景，打造午夜虚空感
        textMain: '#e0eaff', // 带有微弱冷蓝色的白，增加科技感
        textMuted: '#9e7b9b', // 尘埃感的暗紫粉色
        accentRgb: '255, 42, 133', // 更具冲击力的霓虹粉
        avatarGrad1: '#ff2a85', 
        avatarGrad2: '#00e5ff', 
        ambient1: 'rgba(255, 42, 133, 0.28)', 
        ambient2: 'rgba(0, 229, 255, 0.28)', 
        customCss: `
            /* 全局背景：从深紫到极暗的午夜渐变 */
            body { 
                background: radial-gradient(circle at 50% 30%, #1a082b 0%, #070210 80%); 
            } 
            
            /* 赛博网格：增加发光、透视放大，并让远处自然隐入黑暗(地平线效果) */
            .ambient-bg { 
                background-image: 
                    repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(255, 42, 133, 0.5) 40px), 
                    repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(0, 229, 255, 0.25) 40px); 
                opacity: 0.8; 
                transform: perspective(600px) rotateX(65deg) translateY(20px) scale(2.5); 
                transform-origin: bottom center; 
                animation: gridMove 3s linear infinite; 
                -webkit-mask-image: linear-gradient(to top, black 10%, transparent 70%);
                mask-image: linear-gradient(to top, black 10%, transparent 70%);
            } 
            @keyframes gridMove { 
                from { background-position: 0 0; } 
                to { background-position: 0 40px; } 
            }

            /* 色散边缘伪元素 — 模拟CRT RGB子像素偏移 */
            .text-logo { position: relative; }
            .text-logo::before {
                content: attr(data-text);
                position: absolute;
                left: -2px;
                color: rgba(255,42,133,0.4);
                z-index: -1;
                animation: chromaShift 3s infinite;
            }
            @keyframes chromaShift {
                0%, 100% { transform: translate(0, 0); }
                25% { transform: translate(2px, 0); }
                75% { transform: translate(-1px, 0); }
            }

            /* Logo：增加霓虹发光与周期性故障(Glitch)抖动效果 */
            .text-logo { 
                font-style: italic; 
                font-weight: 900;
                letter-spacing: 2px;
                color: #ffffff;
                text-shadow: 
                    3px 3px 0px rgba(0, 229, 255, 0.8), 
                    -3px -3px 0px rgba(255, 42, 133, 0.8),
                    0 0 15px rgba(255, 255, 255, 0.4); 
                animation: glitchLogo 5s infinite;
            }
            @keyframes glitchLogo {
                0%, 94%, 100% { transform: translate(0); text-shadow: 3px 3px 0px rgba(0,229,255,0.8), -3px -3px 0px rgba(255,42,133,0.8), 0 0 15px rgba(255,255,255,0.4); }
                95% { transform: translate(-2px, 1px); text-shadow: -3px 3px 0px rgba(0,229,255,0.8), 3px -3px 0px rgba(255,42,133,0.8), 0 0 15px rgba(255,255,255,0.4); }
                97% { transform: translate(2px, -1px); text-shadow: 3px -3px 0px rgba(0,229,255,0.8), -3px 3px 0px rgba(255,42,133,0.8), 0 0 15px rgba(255,255,255,0.4); }
            }

            /* 全局复古 CRT 扫描线滤镜 (不阻挡鼠标点击) */
            body::after {
                content: "";
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%);
                background-size: 100% 4px;
                z-index: 9999;
                pointer-events: none;
                opacity: 0.6;
            }
        ` 
    },
    extensions:[
        { 
            type: 'html', 
            content: `
            <!-- 远方星辰微光背景层 -->
            <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; background: radial-gradient(circle at 50% 50%, rgba(255, 42, 133, 0.03) 0%, transparent 60%); z-index:-3;"></div>
            
            <!-- 赛博复古落日：更细腻的渐变与呼吸光晕效果 -->
            <div style="
                position:fixed; bottom:0; left:50%; transform:translateX(-50%); 
                width: 700px; height: 350px; 
                background: linear-gradient(to bottom, #ffdf00 0%, #ff4d00 45%, #ff0055 100%); 
                border-radius: 350px 350px 0 0; 
                box-shadow: 0 0 80px rgba(255, 0, 85, 0.4), inset 0 0 40px rgba(255, 223, 0, 0.3); 
                z-index:-2; 
                opacity: 0.95; 
                -webkit-mask-image: repeating-linear-gradient(to bottom, black 0%, black 6px, transparent 6px, transparent 12px); 
                mask-image: repeating-linear-gradient(to bottom, black 0%, black 6px, transparent 6px, transparent 12px);
                animation: sunBreathe 4s ease-in-out infinite alternate;
            "></div>

            <style>
                /* 落日呼吸发光动画 */
                @keyframes sunBreathe {
                    0% { filter: drop-shadow(0 0 10px rgba(255,0,85,0.3)) brightness(1); }
                    100% { filter: drop-shadow(0 0 30px rgba(255,77,0,0.6)) brightness(1.15); }
                }
            </style>
            ` 
        }
    ]
},
        {   
    id: 'cosmos-pro', 
    name: '🌌 幽邃深空', // 加上后缀提升史诗感
    logo: { 
        type: 'text', 
        text: 'OMNI-COSMOS', 
        // 提取了极光青、超新星紫、恒星金、冷星白，形成更具层次的流光
        colors:['#38bdf8', '#c084fc', '#fcd34d', '#ffffff', '#e0e7ff'] 
    },
    theme: {
        // 极深的宇宙黑洞底色，带一丝不易察觉的暗紫
        bgBase: '#000003', 
        textMain: '#f1f5f9', 
        textMuted: '#64748b', 
        accentRgb: '192, 132, 252', 
        avatarGrad1: '#3b0764', // 更深的暗物质紫
        avatarGrad2: '#0284c7', // 纯粹的深空蓝
        ambient1: 'rgba(192, 132, 252, 0.12)', 
        ambient2: 'rgba(14, 165, 233, 0.1)',
        customCss: `
            /* 底层深渊微光：加入极其微弱的星尘噪点感 */
            .ambient-bg { 
                background: radial-gradient(ellipse at bottom, #0a0b1e 0%, #010005 100%); 
                opacity: 1; filter: none; animation: none; 
            }

            /* --- 史诗级星云动画（呼吸 + 缓慢自转） --- */
            @keyframes nebulaSwirl {
                0% { opacity: 0.3; transform: scale(1) rotate(0deg); filter: blur(90px) hue-rotate(0deg); }
                50% { opacity: 0.6; transform: scale(1.1) rotate(5deg); filter: blur(120px) hue-rotate(10deg); }
                100% { opacity: 0.3; transform: scale(1) rotate(0deg); filter: blur(90px) hue-rotate(0deg); }
            }

            /* 视差星空无缝斜向漂移 */
            @keyframes starPanLayer1 { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-400px, -400px, 0); } }
            @keyframes starPanLayer2 { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-300px, -300px, 0); } }
            @keyframes starPanLayer3 { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-200px, -200px, 0); } }

            /* 流星划过动画（加入坠入大气层的燃烧加速感） */
            @keyframes meteorFall {
                0% { transform: rotate(215deg) translateX(100vw) scaleX(0.5); opacity: 0; }
                5% { opacity: 1; transform: rotate(215deg) translateX(50vw) scaleX(1.2); }
                10% { opacity: 1; filter: drop-shadow(0 0 10px #fff); } /* 爆燃高光 */
                15% { transform: rotate(215deg) translateX(-50vw) scaleX(0.2); opacity: 0; }
                100% { opacity: 0; }
            }

            /* 基础星空层扩展 */
            .star-layer {
                position: fixed;
                top: -150px; 
                left: -150px;
                width: calc(100vw + 600px); 
                height: calc(100vh + 600px);
                pointer-events: none;
                z-index: -1;
            }

            /* 巨型星云（引入 screen 混合模式，打造真实的宇宙发光气体） */
            .nebula {
                position: fixed;
                border-radius: 50%;
                pointer-events: none;
                z-index: -2;
                mix-blend-mode: screen; /* 核心：让星云交叠处变得异常璀璨 */
                animation: nebulaSwirl 25s ease-in-out infinite alternate;
            }
            .nebula.purple {
                top: -25%; left: -15%;
                width: 80vw; height: 80vw;
                background: radial-gradient(circle, rgba(147, 51, 234, 0.18) 0%, rgba(88, 28, 135, 0.05) 40%, transparent 70%);
            }
            .nebula.cyan {
                bottom: -20%; right: -25%;
                width: 90vw; height: 90vw;
                background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(3, 105, 161, 0.05) 40%, transparent 70%);
                animation-delay: -12s;
            }
            .nebula.magenta {
                top: 30%; left: 40%;
                width: 60vw; height: 60vw;
                background: radial-gradient(circle, rgba(217, 70, 239, 0.08) 0%, transparent 60%);
                animation-delay: -5s;
                animation-duration: 30s;
            }

            /* 极光/流星本体及发光彗尾 */
            .meteor {
                position: absolute;
                width: 200px;
                height: 2px;
                background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.8) 80%, #ffffff 100%);
                border-radius: 50%;
                animation: meteorFall var(--dur) cubic-bezier(0.4, 0, 0.2, 1) infinite var(--del);
                opacity: 0;
            }
            .meteor::after {
                content: '';
                position: absolute;
                right: -2px;
                top: -3px;
                width: 8px;
                height: 8px;
                background: #fff;
                border-radius: 50%;
                box-shadow: 0 0 20px 4px #0ea5e9, 0 0 40px 8px #c084fc;
            }

            /* 太空舱琉璃态交互 UI */
            .search-box { 
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(3, 1, 8, 0.7) 100%) !important; 
                backdrop-filter: blur(16px) saturate(150%) !important; 
                border: 1px solid rgba(192, 132, 252, 0.15) !important; 
                border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(14, 165, 233, 0.05) !important; 
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            .search-box:hover {
                border-color: rgba(14, 165, 233, 0.4) !important;
                box-shadow: 0 8px 40px rgba(14, 165, 233, 0.15), inset 0 0 30px rgba(192, 132, 252, 0.1) !important;
                transform: translateY(-2px);
            }
        `
    },
    extensions:[
        { type: 'html', content: `
            <!-- 动态巨型星云层 (交叠混色) -->
            <div class="nebula purple"></div>
            <div class="nebula cyan"></div>
            <div class="nebula magenta"></div> <!-- 新增洋红星云作为过渡色 -->

            <!-- 
              星空层 1：远景，极暗极细密，移动最慢 (视差底) 
              升级：加入了自带的 SVG animate 标签，实现性能零负担的群星独立闪烁
            -->
            <div class="star-layer" style="
                background: transparent url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><circle cx='40' cy='40' r='1' fill='%23ffffff' opacity='0.4'><animate attributeName='opacity' values='0.2;0.8;0.2' dur='4s' repeatCount='indefinite'/></circle><circle cx='180' cy='120' r='0.8' fill='%23ffffff' opacity='0.2'/><circle cx='320' cy='80' r='1.2' fill='%23c084fc' opacity='0.3'/><circle cx='90' cy='250' r='1' fill='%2338bdf8' opacity='0.4'><animate attributeName='opacity' values='0.1;0.6;0.1' dur='6s' repeatCount='indefinite'/></circle><circle cx='260' cy='310' r='1.5' fill='%23ffffff' opacity='0.2'/><circle cx='360' cy='220' r='0.8' fill='%23ffffff' opacity='0.5'/></svg>\") repeat; 
                animation: starPanLayer1 240s linear infinite;"></div>

            <!-- 
              星空层 2：中景，带冷暖色调（金+紫），中等速度
            -->
            <div class="star-layer" style="
                background: transparent url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><circle cx='50' cy='150' r='1.5' fill='%23c084fc' opacity='0.6'><animate attributeName='opacity' values='0.3;0.9;0.3' dur='5s' repeatCount='indefinite'/></circle><circle cx='200' cy='50' r='2' fill='%23fcd34d' opacity='0.5'/><circle cx='120' cy='240' r='1.2' fill='%23ffffff' opacity='0.7'/><circle cx='260' cy='200' r='1.8' fill='%230ea5e9' opacity='0.4'><animate attributeName='opacity' values='0.2;0.8;0.2' dur='3s' repeatCount='indefinite'/></circle><circle cx='80' cy='70' r='1' fill='%23ffffff' opacity='0.8'/></svg>\") repeat; 
                animation: starPanLayer2 150s linear infinite; opacity: 0.85;"></div>

            <!-- 
              星空层 3：近景，明亮，包含耀星（十字星芒），移动最快 
            -->
            <div class="star-layer" style="
                background: transparent url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250'><circle cx='30' cy='80' r='2' fill='%23ffffff' opacity='0.9'/><circle cx='150' cy='160' r='2.5' fill='%23e0e7ff' opacity='0.8'><animate attributeName='r' values='2;3;2' dur='2s' repeatCount='indefinite'/></circle><path d='M100 35 L100 45 M95 40 L105 40' stroke='%23ffffff' stroke-width='0.5' opacity='0.8'/><circle cx='100' cy='40' r='1.5' fill='%23ffffff'/></svg>\") repeat; 
                animation: starPanLayer3 90s linear infinite; opacity: 0.95;"></div>

            <!-- 史诗流星雨特效 (利用 cubic-bezier 曲线模拟引力加速) -->
            <div style="position:fixed; top:0; left:0; width:100vw; height:100vh; pointer-events:none; z-index:10;">
                <div class="meteor" style="top: 15vh; left: 30vw; --dur: 10s; --del: 1s;"></div>
                <div class="meteor" style="top: -5vh; left: 80vw; --dur: 16s; --del: 6s;"></div>
                <div class="meteor" style="top: 35vh; left: 95vw; --dur: 14s; --del: 12s;"></div>
                <div class="meteor" style="top: 10vh; left: 55vw; --dur: 20s; --del: 4s;"></div>
                <!-- 巨大且罕见的火流星 -->
                <div class="meteor" style="top: -10vh; left: 40vw; --dur: 35s; --del: 18s; transform-origin: left; scale: 1.5; filter: hue-rotate(45deg);"></div>
            </div>
        `}
    ]
},
        {   
    id: 'aurora-ethereal-pro', 
    name: '✨ 幻空',
    logo: { 
        type: 'text', 
        text: 'AURORA', 
        colors:['#6ee7b7', '#06b6d4', '#a855f7', '#6ee7b7'] 
    },
    theme: { 
        bgBase: '#000106', 
        textMain: '#f1f5f9', 
        textMuted: '#64748b', 
        accentRgb: '16, 185, 129', 
        avatarGrad1: '#06b6d4', 
        avatarGrad2: '#a855f7', 
        ambient1: 'transparent', 
        ambient2: 'transparent', 
        customCss: `
            /* 1. 冰原极夜底色与雪地微弱反射光 */
            body {
                background-color: #010208;
                background-image: radial-gradient(ellipse 150% 100% at 50% 110%, rgba(8, 47, 73, 0.6) 0%, rgba(2, 6, 23, 0.8) 50%, #010208 100%);
            }
            
            /* 2. 极致通透的流光玻璃 UI */
            .search-box {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%) !important;
                backdrop-filter: blur(28px) saturate(140%) !important;
                -webkit-backdrop-filter: blur(28px) saturate(140%) !important;
                
                border: 1px solid rgba(255, 255, 255, 0.04) !important;
                border-top: 1px solid rgba(110, 231, 183, 0.4) !important; 
                border-left: 1px solid rgba(6, 182, 212, 0.25) !important;
                
                box-shadow: 
                    0 25px 50px -12px rgba(0, 0, 0, 0.8),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15),
                    0 0 40px rgba(16, 185, 129, 0.05) !important;
                border-radius: 20px !important;
                transition: all 0.5s cubic-bezier(0.25, 1, 0.3, 1) !important;
            }
            
            .search-box:hover, .search-box:focus-within {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 100%) !important;
                border-top-color: rgba(110, 231, 183, 0.7) !important;
                border-left-color: rgba(6, 182, 212, 0.5) !important;
                box-shadow: 
                    0 30px 60px -15px rgba(0, 0, 0, 0.9),
                    inset 0 1px 1px rgba(255, 255, 255, 0.3),
                    0 0 50px rgba(6, 182, 212, 0.2),
                    inset 0 20px 40px -20px rgba(110, 231, 183, 0.2) !important;
                transform: translateY(-3px) scale(1.005);
            }

            .search-input { color: #f8fafc !important; text-shadow: 0 0 12px rgba(255, 255, 255, 0.3); font-weight: 400; }
            .search-input::placeholder { color: #64748b !important; font-weight: 300; }

            .action-btn {
                background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
                backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-top-color: rgba(110, 231, 183, 0.3);
                border-radius: 12px !important;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            }
            .action-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                border-top-color: rgba(6, 182, 212, 0.6);
                box-shadow: 0 10px 20px rgba(0,0,0,0.5), 0 0 20px rgba(16, 185, 129, 0.25);
                transform: translateY(-2px);
                color: #fff;
            }

            /* 3. Logo 极光流体文字特效 */
            .text-logo {
                font-weight: 900 !important;
                letter-spacing: 3px;
                background: linear-gradient(90deg, #6ee7b7 0%, #06b6d4 33%, #a855f7 66%, #6ee7b7 100%);
                background-size: 300% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: auroraTextFlow 6s linear infinite;
                filter: drop-shadow(0 0 15px rgba(6, 182, 212, 0.4));
            }
            @keyframes auroraTextFlow {
                to { background-position: -300% center; }
            }
        ` 
    },
    extensions:[
        { 
            type: 'html', 
            content: `
            <style>
                /* =========================================
                   极地光场引擎 (Polar Aurora Engine Pro)
                   ========================================= */
                .aurora-container {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    z-index: -2; overflow: hidden; pointer-events: none;
                }

                /* 1. 高清北极星星轨 */
                .polar-stars {
                    position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><circle cx='50' cy='50' r='1' fill='%23fff' opacity='0.8'/><circle cx='250' cy='120' r='1.5' fill='%236ee7b7' opacity='0.6'/><circle cx='150' cy='300' r='1' fill='%23fff' opacity='0.5'/><circle cx='350' cy='200' r='1.2' fill='%2306b6d4' opacity='0.7'/><circle cx='80' cy='280' r='0.8' fill='%23fff' opacity='0.4'/><circle cx='300' cy='350' r='1' fill='%23a855f7' opacity='0.5'/></svg>");
                    background-size: 400px 400px;
                    transform-origin: 50% 35%;
                    animation: starRotate 240s linear infinite;
                    opacity: 0.6;
                }
                .polar-stars::after {
                    content: ''; position: absolute; inset: 0;
                    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><circle cx='100' cy='80' r='1' fill='%23fff' opacity='0.9'/><circle cx='220' cy='220' r='1.5' fill='%23fff' opacity='0.4'/><circle cx='50' cy='250' r='0.8' fill='%23fff' opacity='0.7'/></svg>");
                    background-size: 300px 300px;
                    transform-origin: 50% 35%;
                    animation: starRotate 360s linear infinite reverse;
                    opacity: 0.5;
                }
                @keyframes starRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* 冰晶闪烁 — 极地钻石尘微光 */
                @keyframes iceSparkle {
                    0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
                    30% { opacity: 0.7; transform: scale(1) rotate(180deg); }
                    60% { opacity: 0.1; transform: scale(0.5) rotate(360deg); }
                }
                .ice-crystal {
                    position: absolute;
                    width: 3px; height: 3px;
                    background: rgba(255,255,255,0.9);
                    clip-path: polygon(50% 0%, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0% 50%, 39% 35%);
                    animation: iceSparkle var(--dur, 4s) ease-in-out infinite var(--del, 0s);
                    z-index: 3;
                }

                /* 2. 极光射线底纹 (更宽广柔和的条带，首尾增加褪色蒙版，消除生硬感) */
                .aurora-rays {
                    position: absolute; width: 200%; height: 100%; top: -10%; left: -50%;
                    background: repeating-linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(110, 231, 183, 0.05) 8%,
                        transparent 16%,
                        rgba(6, 182, 212, 0.04) 24%,
                        transparent 32%
                    );
                    /* 双向透明褪色：顶部无痕融入夜空，底部渐渐消散 */
                    mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.5) 70%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.5) 70%, transparent 100%);
                    mix-blend-mode: color-dodge;
                    animation: waveRays 30s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
                    z-index: 1;
                }
                @keyframes waveRays { 
                    0% { transform: translateX(0) skewX(-10deg) scaleY(1); opacity: 0.6;} 
                    100% { transform: translateX(10%) skewX(-2deg) scaleY(1.05); opacity: 1;} 
                }

                /* 3. 史诗级流体极光彩带 (增加 blur 半径并放缓动画，提升平滑与空灵感) */
                .ribbon {
                    position: absolute; 
                    filter: blur(80px); /* 提升至80px，彻底消除色块感 */
                    mix-blend-mode: screen; 
                    will-change: transform, opacity;
                }
                .ribbon.green {
                    top: -15vh; left: -10vw; width: 120vw; height: 60vh;
                    background: linear-gradient(to bottom, transparent, rgba(16, 185, 129, 0.35) 50%, transparent);
                    border-radius: 50%;
                    animation: flowGreen 22s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
                }
                .ribbon.cyan {
                    top: 5vh; right: -20vw; width: 110vw; height: 50vh;
                    background: linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.3) 50%, transparent);
                    border-radius: 50%;
                    animation: flowCyan 26s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate-reverse;
                }
                .ribbon.purple {
                    top: -10vh; left: 10vw; width: 90vw; height: 60vh;
                    background: linear-gradient(to bottom, transparent, rgba(167, 139, 250, 0.25) 50%, transparent);
                    border-radius: 50%;
                    animation: flowPurple 24s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
                }

                /* 更微幅、舒缓的形变动画 */
                @keyframes flowGreen { 
                    0% { transform: translate(0, 0) scale(1) skewX(-5deg); opacity: 0.6; } 
                    100% { transform: translate(8vw, -5vh) scale(1.1) skewX(5deg); opacity: 0.9; } 
                }
                @keyframes flowCyan { 
                    0% { transform: translate(0, 0) scale(1) skewX(5deg) rotate(2deg); opacity: 0.5; } 
                    100% { transform: translate(-10vw, 8vh) scale(1.15) skewX(-10deg) rotate(-2deg); opacity: 0.8; } 
                }
                @keyframes flowPurple { 
                    0% { transform: translate(0, 0) scaleX(1) skewX(-10deg); opacity: 0.4; } 
                    100% { transform: translate(5vw, -8vh) scaleX(1.2) skewX(10deg); opacity: 0.8; } 
                }

                /* 4. 极地流星 (彻底修正了形态与轨迹系逻辑) */
                .shooting-star {
                    position: absolute; 
                    width: 150px; /* 拉长拖尾 */
                    height: 2px;
                    /* 渐变从左(透明拖尾)到右(高亮白头) */
                    background: linear-gradient(to right, transparent 0%, rgba(110, 231, 183, 0.3) 50%, rgba(255, 255, 255, 1) 100%);
                    opacity: 0;
                    top: var(--top, 0); 
                    left: var(--left, 0);
                    transform-origin: right center; /* 确保旋转轴在星头上 */
                    animation: shooting var(--dur) linear infinite var(--del);
                    z-index: 2;
                }
                
                /* 流星核心高亮头 */
                .shooting-star::after {
                    content: ''; 
                    position: absolute; 
                    right: 0; 
                    top: 50%; 
                    transform: translateY(-50%);
                    width: 3px; 
                    height: 3px; 
                    background: #fff; 
                    border-radius: 50%; 
                    box-shadow: 0 0 15px 3px rgba(110, 231, 183, 0.8), 0 0 5px 1px #fff;
                }
                
                /* 修复后的轨迹动画：利用局部坐标系的 translateX 永远确保头朝前移动 */
                @keyframes shooting {
                    0% { transform: rotate(var(--angle, 145deg)) translateX(0); opacity: 0; }
                    5% { opacity: 1; }
                    15% { transform: rotate(var(--angle, 145deg)) translateX(100vw); opacity: 0; }
                    100% { transform: rotate(var(--angle, 145deg)) translateX(100vw); opacity: 0; }
                }
            </style>
            
            <div class="aurora-container">
                <div class="polar-stars"></div>
                <div class="aurora-rays"></div>
                
                <div class="ribbon green"></div>
                <div class="ribbon cyan"></div>
                <div class="ribbon purple"></div>

                <!-- 冰晶钻石尘 -->
                <div class="ice-crystal" style="top: 15%; left: 25%; --dur: 6s; --del: 0s;"></div>
                <div class="ice-crystal" style="top: 28%; left: 70%; --dur: 5s; --del: 2s;"></div>
                <div class="ice-crystal" style="top: 10%; left: 55%; --dur: 7s; --del: 4s;"></div>
                <div class="ice-crystal" style="top: 35%; left: 40%; --dur: 4.5s; --del: 1s;"></div>
                <div class="ice-crystal" style="top: 8%; left: 85%; --dur: 6.5s; --del: 3s;"></div>
                <div class="ice-crystal" style="top: 22%; left: 12%; --dur: 5.5s; --del: 5s;"></div>
                
                <!-- 通过角度(--angle)和相对坐标精准控制流星雨。145deg表示向左下方划落 -->
                <div class="shooting-star" style="--top: -10%; --left: 70%; --dur: 15s; --del: 2s; --angle: 145deg;"></div>
                <div class="shooting-star" style="--top: 10%; --left: 90%; --dur: 22s; --del: 7s; --angle: 155deg; scale: 0.7; filter: hue-rotate(45deg);"></div>
                <div class="shooting-star" style="--top: -5%; --left: 50%; --dur: 28s; --del: 14s; --angle: 135deg; scale: 0.8;"></div>
            </div>
            ` 
        }
    ]
},

       
        {   
    id: 'flare', 
    name: '🔥 日珥爆发',
    // 渐变调整为极其耀眼的等离子体颜色：从极高温的黄白到冷却的暗红
    logo: { type: 'text', text: 'OMNI-FLARE', colors:['#fef08a', '#f59e0b', '#ef4444', '#7f1d1d'] },
    theme: { 
        // 极深的宇宙暗红黑（非纯黑，带有温度感）
        bgBase: '#080101', 
        textMain: '#fffbeb', 
        textMuted: '#fca5a5', 
        accentRgb: '249, 115, 22', 
        avatarGrad1: '#991b1b', 
        avatarGrad2: '#ea580c', 
        // 氛围光：如岩浆般浓烈的底层辐射光
        ambient1: 'rgba(239, 68, 68, 0.3)', 
        ambient2: 'rgba(245, 158, 11, 0.2)', 
        customCss: `
            /* Logo 极高温度的发光效果 */
            .text-logo { filter: drop-shadow(0 0 12px rgba(249, 115, 22, 0.8)) drop-shadow(0 0 25px rgba(239, 68, 68, 0.4)); }
            
            /* 余烬升空：真实的温度冷却与轨迹飘散 */
            @keyframes emberRise { 
                /* 刚喷射：白热化，极亮，体积最大 */
                0% { transform: translateY(110vh) translateX(0) scale(var(--s, 1)); opacity: 1; background: #fef08a; box-shadow: 0 0 10px #fef08a, 0 0 20px #f59e0b; } 
                /* 中段：降温为橘红色，开始左右摇摆 */
                40% { background: #ea580c; box-shadow: 0 0 15px #ea580c; opacity: var(--o, 0.9); }
                /* 高空：冷却为暗红色，体积缩小 */
                70% { background: #991b1b; box-shadow: 0 0 8px #991b1b; opacity: calc(var(--o, 0.9) * 0.6); transform: translateY(40vh) translateX(calc(var(--dir, 1) * 6vw)) scale(calc(var(--s, 1) * 0.7)); }
                /* 消失：化为灰烬散去 */
                100% { transform: translateY(-10vh) translateX(calc(var(--dir, 1) * 12vw)) scale(calc(var(--s, 1) * 0.3)); opacity: 0; background: #450a0a; box-shadow: none; } 
            }

            /* 底层日冕热浪脉冲 */
            @keyframes coronaPulse {
                0% { opacity: 0.4; transform: scaleY(1) translateY(0); filter: blur(40px) brightness(1); }
                50% { opacity: 0.7; transform: scaleY(1.2) translateY(-3vh); filter: blur(50px) brightness(1.3); }
                100% { opacity: 0.4; transform: scaleY(1) translateY(0); filter: blur(40px) brightness(1); }
            }

            /* 余烬粒子样式 */
            .omni-ember { 
                position: fixed; bottom: -10vh; width: 4px; height: 4px; 
                border-radius: 50%; pointer-events: none; z-index: 1; 
                /* 增加轻微的垂直拉伸，模拟高速上升的拖影 */
                border-radius: 50% 50% 30% 30% / 60% 60% 40% 40%;
            }

            /* 底部恒星地表辐射层 */
            .omni-corona {
                position: fixed; bottom: -25vh; left: -20vw; width: 140vw; height: 50vh;
                background: radial-gradient(ellipse at bottom, rgba(249, 115, 22, 0.4) 0%, rgba(220, 38, 38, 0.15) 40%, transparent 70%);
                pointer-events: none; z-index: 0;
                animation: coronaPulse 6s ease-in-out infinite alternate;
            }

            /* 日冕环 — 磁力线弧形等离子体拱桥 */
            @keyframes prominenceArc {
                0%, 100% { opacity: 0.25; transform: scaleX(1) translateY(0); }
                50% { opacity: 0.45; transform: scaleX(1.08) translateY(-4vh); }
            }
            .prominence {
                position: fixed; bottom: -8vh; left: 50%; transform: translateX(-50%);
                width: 200vw; height: 40vh;
                background: radial-gradient(ellipse at center, rgba(254,240,138,0.12) 0%, rgba(245,158,11,0.06) 30%, transparent 70%);
                border-radius: 50%;
                pointer-events: none; z-index: -1;
                animation: prominenceArc 8s ease-in-out infinite alternate;
            }
            /* 热浪微光 — 高温辐射导致UI边缘微微波动 */
            @keyframes heatShimmer {
                0%, 100% { filter: brightness(1) saturate(1); }
                50% { filter: brightness(1.05) saturate(1.1); }
            }

            /* 搜索框：耐高温黑曜石质感 + 底部烧红金属边 */
            .search-box { 
                background: rgba(20, 5, 5, 0.65) !important; 
                border: 1px solid rgba(239, 68, 68, 0.2) !important; 
                border-bottom: 2px solid rgba(249, 115, 22, 0.6) !important; /* 烧红的底边 */
                box-shadow: 0 15px 35px rgba(220, 38, 38, 0.1), inset 0 -4px 15px rgba(249, 115, 22, 0.08) !important; 
                backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            } 
            .search-input { color: #fffbeb !important; } 
            .search-input::placeholder { color: #f87171 !important; opacity: 0.6; } 
            .action-btn { color: #fca5a5 !important; border-color: rgba(239, 68, 68, 0.4) !important; } 
            .action-btn:hover { background: rgba(239, 68, 68, 0.15) !important; color: #fffbeb !important; border-color: #f97316 !important; box-shadow: 0 0 10px rgba(249, 115, 22, 0.3); }
            a:hover { color: #f97316; text-shadow: 0 0 8px rgba(249, 115, 22, 0.5); }
        ` 
    },
    extensions:[
        { type: 'html', content: `
            <!-- 日冕环弧光 -->
            <div class="prominence"></div>
            <div class="prominence" style="animation-delay: -4s; width: 180vw; opacity: 0.7;"></div>
            <!-- 恒星地表的巨大热浪光晕 -->
            <div class="omni-corona"></div>
            <div class="omni-corona" style="animation-duration: 9s; animation-delay: -3s; background: radial-gradient(ellipse at bottom, rgba(239, 68, 68, 0.3) 0%, transparent 60%);"></div>

            <!-- 飞溅的高温余烬 (包含前中后景不同大小) -->
            <div class="omni-ember" style="left: 15%; --s: 1.2; --o: 0.9; --dir: 1; animation: emberRise 5s cubic-bezier(0.25, 1, 0.5, 1) infinite 0s;"></div>
            <div class="omni-ember" style="left: 38%; --s: 0.7; --o: 0.7; --dir: -1; animation: emberRise 7s cubic-bezier(0.25, 1, 0.5, 1) infinite 2s;"></div>
            <div class="omni-ember" style="left: 55%; --s: 1.5; --o: 1;   --dir: 1; animation: emberRise 4s cubic-bezier(0.25, 1, 0.5, 1) infinite 1s;"></div>
            <div class="omni-ember" style="left: 78%; --s: 0.9; --o: 0.8; --dir: -1; animation: emberRise 6s cubic-bezier(0.25, 1, 0.5, 1) infinite 3.5s;"></div>
            <div class="omni-ember" style="left: 88%; --s: 0.5; --o: 0.6; --dir: 1; animation: emberRise 8s cubic-bezier(0.25, 1, 0.5, 1) infinite 0.5s;"></div>
            <div class="omni-ember" style="left: 25%; --s: 0.6; --o: 0.5; --dir: -1; animation: emberRise 6.5s cubic-bezier(0.25, 1, 0.5, 1) infinite 4s;"></div>
            <div class="omni-ember" style="left: 65%; --s: 1.1; --o: 0.85;--dir: 1; animation: emberRise 5.5s cubic-bezier(0.25, 1, 0.5, 1) infinite 5.5s;"></div>
        `}
    ]
}
    ],

    getAllThemes: function() {
        return this.dailyPool.map(t => ({ id: t.id, name: t.name, color1: t.theme.avatarGrad1, color2: t.theme.avatarGrad2 }));
    },

    getThemeConfig: function(strategy = 'auto', dateStr = null) {
    let targetDate;
    if (dateStr) {
        const attemptedDate = new Date(new Date().getFullYear() + '-' + dateStr);
        if (!isNaN(attemptedDate.getTime())) {
            targetDate = attemptedDate;
        } else {
            targetDate = new Date(); 
        }
    } else {
        targetDate = new Date();
    }
    const mmdd = String(targetDate.getMonth() + 1).padStart(2, '0') + '-' + String(targetDate.getDate()).padStart(2, '0');
    
    let activeHolidayTheme = null;

    if (strategy === 'auto') {
        if (typeof Lunar !== 'undefined') {
            const lunar = Lunar.fromDate(targetDate);
            const lMonth = String(Math.abs(lunar.getMonth())).padStart(2, '0');
            const lDay = String(lunar.getDay()).padStart(2, '0');
            const lunarKey = `L${lMonth}-${lDay}`; 

            if (this.holidays[lunarKey]) {
                activeHolidayTheme = this.holidays[lunarKey];
            }
        }

        if (!activeHolidayTheme && this.holidays[mmdd]) {
            activeHolidayTheme = this.holidays[mmdd];
        }

        if (activeHolidayTheme) {
            return this._mergeConfig(activeHolidayTheme);
        }

        if (targetDate.getDay() === 4 && this.crazyThursday) {
            return this._mergeConfig(this.crazyThursday);
        }
    }

    let selectedTheme;
    if (strategy === 'random') {
        selectedTheme = this.dailyPool[Math.floor(Math.random() * this.dailyPool.length)];
    } else if (strategy !== 'auto') {
        selectedTheme = this.dailyPool.find(t => t.id === strategy);
    }

    if (!selectedTheme) {
        const start = new Date(targetDate.getFullYear(), 0, 0);
        const diff = targetDate - start + (start.getTimezoneOffset() - targetDate.getTimezoneOffset()) * 60 * 1000;
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        selectedTheme = this.dailyPool[dayOfYear % this.dailyPool.length];
    }

    let finalConfig = this._mergeConfig(selectedTheme);

    // ==========================================
    // 🌟 史诗级优化版：惊喜盲盒 (带稀有度、物理特效、合成音效)
    // ==========================================
    const surpriseBoxContent = `
    <div id="omni-surprise-box" class="omni-surprise-wrapper" 
         role="button" tabindex="0" aria-label="开启今日惊喜盲盒"
         style="opacity: 0; pointer-events: none;" 
         onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); window.OmniBoxV2.open(this); }"
         onclick="window.OmniBoxV2.open(this);">
        
        <div class="omni-surprise-glow"></div>
        <div class="omni-surprise-tooltip">✨ 测测今日运势</div>
        <div class="omni-surprise-icon">🎁</div>
    </div>

    <script>
        (function() {
            if(!window.OmniBoxV2) {
                window.OmniBoxV2 = {
                    init: function(box) {
                        if (!box || box.dataset.init) return;
                        box.dataset.init = 'true';

                        document.querySelectorAll('.omni-surprise-wrapper').forEach(function(el) {
                            if (el !== box) el.remove();
                        });
                        document.body.appendChild(box);

                        try {
                            var todayStr = new Date().toLocaleDateString('en-CA');
                            var lastOpened = localStorage.getItem('omni_surprise_opened_date');
                            if (lastOpened === todayStr) {
                                box.remove();
                            } else {
                                box.style.opacity = '1';
                                box.style.pointerEvents = 'auto';
                                box.style.animation = 'boxEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, floatSurpriseBox 3.5s ease-in-out infinite 0.8s';
                            }
                        } catch(e) {
                            box.style.opacity = '1';
                            box.style.pointerEvents = 'auto';
                        }
                    },

                    playMagicChime: function(baseFreq, isHighTier) {
                        try {
                            var ctx = new (window.AudioContext || window.webkitAudioContext)();
                            var filter = ctx.createBiquadFilter();
                            filter.type = 'lowpass';
                            filter.frequency.value = 3500;

                            var delay = ctx.createDelay();
                            delay.delayTime.value = 0.25;
                            var feedback = ctx.createGain();
                            feedback.gain.value = 0.3;
                            delay.connect(feedback);
                            feedback.connect(delay);
                            delay.connect(ctx.destination);

                            filter.connect(ctx.destination);
                            filter.connect(delay);

                            var notes = isHighTier ? [baseFreq, baseFreq*1.25, baseFreq*1.5, baseFreq*2] : [baseFreq, baseFreq*1.25, baseFreq*1.5];

                            notes.forEach(function(freq, i) {
                                var osc = ctx.createOscillator();
                                var gain = ctx.createGain();
                                osc.type = 'sine';
                                osc.detune.value = (Math.random() - 0.5) * 15;
                                osc.frequency.setValueAtTime(freq, ctx.currentTime);

                                gain.gain.setValueAtTime(0, ctx.currentTime);
                                gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
                                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5 + i * 0.3);

                                osc.connect(gain);
                                gain.connect(filter);
                                osc.start();
                                osc.stop(ctx.currentTime + 3);
                            });
                        } catch(e) {}
                    },

                    open: function(box) {
                        if(box.dataset.clicked) return;
                        box.dataset.clicked = 'true';

                        var tooltip = box.querySelector('.omni-surprise-tooltip');
                        if(tooltip) tooltip.style.opacity = '0';
                        box.style.animation = 'boxCharge 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both';
                        if(navigator.vibrate) navigator.vibrate(30);

                        try { localStorage.setItem('omni_surprise_opened_date', new Date().toLocaleDateString('en-CA')); } catch(e) {}

                        setTimeout(function() {
                            if(navigator.vibrate) navigator.vibrate([60, 40, 80]);

                            var pity = parseInt(localStorage.getItem('omni_box_pity') || '0');
                            var rawRoll = Math.random();
                            var finalRoll = rawRoll + (pity * 0.015);

                            var rarity;
                            if (finalRoll > 0.99) { rarity = 'mythic'; pity = 0; }
                            else if (finalRoll > 0.88) { rarity = 'legendary'; pity = 0; }
                            else if (finalRoll > 0.65) { rarity = 'epic'; pity = Math.max(0, pity - 3); }
                            else if (finalRoll > 0.30) { rarity = 'rare'; pity += 1; }
                            else { rarity = 'common'; pity += 2; }

                            localStorage.setItem('omni_box_pity', pity.toString());

                            var pools = {
                                common: { color: '#4ade80', bg: 'rgba(255, 255, 255, 0.95)', textColor: '#14532d', emojis:['🍀', '☀️', '☕', '🍬', '🍃', '🌸', '🍵', '🍉'], msgs:['今日好运 +1 🍀', '代码无 BUG 🛡️', '喝杯水休息一下 ☕', '祝你今天开心 ☀️', '宜：摸鱼、发呆 🐟'], count: 20, baseSound: 523.25 },
                                rare: { color: '#60a5fa', bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', textColor: '#1e3a8a', emojis:['✨', '🚀', '🎁', '🎉', '🌟', '🔮', '🌊', '💎'], msgs:['发现稀有彩蛋！🎁', '灵感爆棚的一天 🚀', '性能优化 +100% ✨', '编译一次通过！🎉'], count: 30, baseSound: 659.25 },
                                epic: { color: '#c084fc', bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)', textColor: '#581c87', emojis:['👾', '🦄', '🎸', '⚡', '🌌', '🦋', '🎆', '🌠'], msgs:['💜 史诗级掉落！紫气东来！', '⚡ 状态绝佳，键盘冒火星了！', '🌌 代码闪耀着宇宙的光芒！'], count: 50, baseSound: 783.99 },
                                legendary: { color: '#fbbf24', bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #fde68a 100%)', textColor: '#92400e', emojis:['👑', '🔥', '🏆', '🐲', '💰', '🦁', '🥇'], msgs:['🌟 传说级运气！万事胜意！', '👑 SSR！今天你最全能！', '🔥 终极彩蛋：运气爆表了！'], count: 75, baseSound: 1046.50 },
                                mythic: { color: '#f43f5e', bg: 'linear-gradient(135deg, #111827 0%, #4c1d95 50%, #9f1239 100%)', textColor: '#fecdd3', emojis:['☄️', '🧿', '💮', '🪐', '🖤', '🩸', '👁️‍🗨️', '🎇'], msgs:['☄️【神话级】奇迹降临！究极彩蛋！', '🌌 宇宙级别的幸运儿诞生了！', '❤️‍🔥 愿望成真，你就是天命之子！'], count: 100, baseSound: 1318.51 }
                            };
                            var config = pools[rarity];

                            window.OmniBoxV2.playMagicChime(config.baseSound, (rarity === 'legendary' || rarity === 'mythic'));

                            box.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s';
                            box.style.transform = 'scale(2.2) rotate(' + (Math.random() > 0.5 ? 30 : -30) + 'deg)';
                            box.style.opacity = '0';
                            box.style.filter = 'brightness(3) drop-shadow(0 0 60px ' + config.color + ')';

                            document.body.classList.add('omni-screen-shake');
                            setTimeout(function() { document.body.classList.remove('omni-screen-shake'); }, 400);

                            if(rarity === 'legendary' || rarity === 'mythic') {
                                var flashColor = rarity === 'mythic' ? 'radial-gradient(circle, rgba(244,63,94,0.4) 0%, transparent 80%)' : 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 80%)';
                                var flash = document.createElement('div');
                                flash.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:' + flashColor + ';z-index:99997;pointer-events:none;transition:opacity 0.8s ease-out; mix-blend-mode: screen;';
                                document.body.appendChild(flash);
                                setTimeout(function() { flash.style.opacity = '0'; }, 50);
                                setTimeout(function() { flash.remove(); }, 850);
                            }

                            var rect = box.getBoundingClientRect();
                            var centerX = rect.left + rect.width / 2;
                            var centerY = rect.top + rect.height / 2;
                            var fragment = document.createDocumentFragment();

                            for(var i = 0; i < config.count; i++) {
                                var el = document.createElement('div');
                                var isDot = Math.random() > 0.4;

                                if(isDot) {
                                    var size = 4 + Math.random() * 10;
                                    el.style.width = el.style.height = size + 'px';
                                    el.style.background = config.color;
                                    el.style.borderRadius = (Math.random() > 0.5 ? '50%' : '3px');
                                    el.style.boxShadow = '0 0 15px ' + config.color;
                                } else {
                                    el.innerText = config.emojis[Math.floor(Math.random() * config.emojis.length)];
                                    el.style.fontSize = (16 + Math.random() * 20) + 'px';
                                    if(Math.random() > 0.75) el.style.filter = 'blur(1.5px)';
                                }

                                el.style.position = 'fixed';
                                el.style.left = centerX + 'px';
                                el.style.top = centerY + 'px';
                                el.style.pointerEvents = 'none';
                                el.style.zIndex = '99998';
                                el.style.willChange = 'transform, opacity';
                                el.style.transform = 'translate(-50%, -50%) scale(0)';
                                fragment.appendChild(el);

                                var angle = Math.random() * Math.PI * 2;
                                var velocity = 80 + Math.random() * (rarity === 'mythic' ? 350 : (rarity === 'legendary' ? 280 : 180));
                                var endX = Math.cos(angle) * velocity;
                                var endY = Math.sin(angle) * velocity - (60 + Math.random() * 120);
                                var rot = Math.random() * 1080 - 540;
                                var duration = 0.8 + Math.random() * 1.2;

                                (function(el, endX, endY, rot, duration) {
                                    setTimeout(function() {
                                        el.style.transition = 'transform ' + (duration*0.4) + 's cubic-bezier(0.25, 1, 0.5, 1), opacity ' + duration + 's ease-out';
                                        el.style.transform = 'translate(calc(-50% + ' + endX + 'px), calc(-50% + ' + endY + 'px)) rotate(' + rot + 'deg) scale(' + (0.5 + Math.random()) + ')';
                                    }, 10);

                                    setTimeout(function() {
                                        el.style.transition = 'transform ' + (duration*0.6) + 's cubic-bezier(0.5, 0, 1, 1), opacity ' + (duration*0.5) + 's';
                                        el.style.transform = 'translate(calc(-50% + ' + endX + 'px), calc(-50% + ' + (endY + 250 + Math.random()*200) + 'px)) rotate(' + (rot+180) + 'deg) scale(0.1)';
                                        el.style.opacity = '0';
                                    }, duration * 400);

                                    setTimeout(function() { el.remove(); }, duration * 1000 + 500);
                                })(el, endX, endY, rot, duration);
                            }
                            document.body.appendChild(fragment);

                            var msgWrap = document.createElement('div');
                            msgWrap.setAttribute('role', 'alert');
                            msgWrap.setAttribute('aria-live', 'assertive');
                            msgWrap.style.cssText = 'position:fixed; left:' + centerX + 'px; top:' + centerY + 'px; transform:translate(-50%, -50%) scale(0.5); z-index:99999; opacity:0; pointer-events:none; transition:all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); will-change:transform, opacity;';

                            var msgEl = document.createElement('div');
                            msgEl.innerText = config.msgs[Math.floor(Math.random() * config.msgs.length)];
                            msgEl.style.cssText = 'padding:16px 32px; border-radius:50px; font-size:17px; font-weight:900; letter-spacing:1px; white-space:nowrap; text-align:center; backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,0.5); box-shadow:0 15px 40px rgba(0,0,0,0.15), 0 0 25px ' + config.color + '50;';
                            msgEl.style.background = config.bg;
                            msgEl.style.color = config.textColor;

                            if (rarity === 'epic') {
                                msgEl.style.border = '2px solid #c084fc';
                                msgWrap.style.animation = 'legendaryFloat 2.5s ease-in-out infinite';
                            } else if(rarity === 'legendary') {
                                msgEl.style.border = '2px solid #fbbf24';
                                msgEl.style.boxShadow = '0 15px 50px rgba(251,191,36,0.4), inset 0 0 20px rgba(255,255,255,0.9)';
                                msgWrap.style.animation = 'legendaryFloat 2s ease-in-out infinite';
                            } else if(rarity === 'mythic') {
                                msgEl.style.border = '2px solid #f43f5e';
                                msgEl.style.boxShadow = '0 15px 60px rgba(244,63,94,0.6), inset 0 0 25px rgba(255,255,255,0.4)';
                                msgWrap.style.animation = 'legendaryFloat 1.5s ease-in-out infinite';
                            }

                            msgWrap.appendChild(msgEl);
                            document.body.appendChild(msgWrap);

                            setTimeout(function() {
                                msgWrap.style.opacity = '1';
                                msgWrap.style.transform = 'translate(-50%, -190px) scale(1)';
                            }, 50);

                            setTimeout(function() {
                                msgWrap.style.transition = 'all 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
                                msgWrap.style.opacity = '0';
                                msgWrap.style.transform = 'translate(-50%, -240px) scale(0.8)';
                                setTimeout(function() { msgWrap.remove(); }, 500);
                            }, 4000);

                            setTimeout(function() { box.remove(); }, 600);

                        }, 400);
                    }
                };
            }
            var box = document.getElementById('omni-surprise-box');
            if (box) window.OmniBoxV2.init(box);
        })();
    </script>

    <style>
        .omni-surprise-wrapper { 
            position: fixed; bottom: 125px; right: 145px; 
            width: 60px; height: 60px; 
            display: flex; align-items: center; justify-content: center; 
            z-index: 9999; cursor: pointer; user-select: none; 
            -webkit-tap-highlight-color: transparent;
            outline: none;
        }

        .omni-surprise-wrapper:focus-visible .omni-surprise-glow {
            transform: scale(1.8); opacity: 1;
            background: radial-gradient(circle, rgba(96, 165, 250, 0.8) 0%, rgba(96, 165, 250, 0) 70%);
        }

        @keyframes boxEntrance {
            0% { transform: scale(0) translateY(80px); opacity: 0; filter: blur(10px); }
            60% { transform: scale(1.15) translateY(-15px); opacity: 1; filter: blur(0); }
            100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes boxCharge {
            0% { transform: scale(1); filter: brightness(1); }
            10% { transform: scale(0.8) rotate(-10deg); filter: brightness(1.2); }
            20% { transform: scale(0.85) rotate(10deg); }
            30% { transform: scale(0.8) rotate(-12deg); }
            40% { transform: scale(0.85) rotate(12deg); }
            50% { transform: scale(0.8) rotate(-15deg); filter: brightness(1.5); }
            60% { transform: scale(0.85) rotate(15deg); }
            70% { transform: scale(0.8) rotate(-10deg); }
            80% { transform: scale(0.85) rotate(10deg); }
            90% { transform: scale(0.7) rotate(-5deg); filter: brightness(1.8); }
            100% { transform: scale(0.65) rotate(0deg); filter: brightness(2.5); }
        }

        .omni-surprise-glow {
            position: absolute; width: 100%; height: 100%;
            background: radial-gradient(circle, rgba(255, 105, 180, 0.6) 0%, rgba(255, 105, 180, 0) 70%);
            border-radius: 50%; z-index: 1; opacity: 0.6;
            transition: all 0.3s ease;
            animation: pulseGlow 2.5s ease-in-out infinite alternate;
            will-change: transform, opacity;
        }

        .omni-surprise-icon { 
            font-size: 46px; z-index: 2;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); 
            filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25));
            will-change: transform;
        }

        .omni-surprise-wrapper:hover .omni-surprise-glow {
            transform: scale(1.6); opacity: 1;
            background: radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, rgba(251, 191, 36, 0) 70%);
        }
        .omni-surprise-wrapper:hover .omni-surprise-icon { 
            transform: scale(1.15) rotate(-5deg); 
        }
        .omni-surprise-wrapper:active .omni-surprise-icon {
            transform: scale(0.9) rotate(0deg); transition: transform 0.1s;
        }

        .omni-surprise-tooltip { 
            position: absolute; top: -50px; left: 50%; 
            transform: translateX(-50%) translateY(10px) scale(0.9); 
            font-size: 14px; font-weight: bold; letter-spacing: 0.5px; white-space: nowrap; 
            background: rgba(255, 255, 255, 0.9); 
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); 
            color: #111; padding: 10px 16px; border-radius: 14px; 
            opacity: 0; pointer-events: none; 
            border: 1px solid rgba(255, 255, 255, 0.6);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
            box-shadow: 0 10px 20px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05); 
            z-index: 3; will-change: transform, opacity;
        }
        .omni-surprise-tooltip::after { 
            content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); 
            border-width: 6px 6px 0; border-style: solid; 
            border-color: rgba(255, 255, 255, 0.9) transparent transparent transparent; 
        }
        .omni-surprise-wrapper:hover .omni-surprise-tooltip { 
            opacity: 1; transform: translateX(-50%) translateY(0) scale(1); 
        }

        @keyframes floatSurpriseBox { 
            0%, 100% { transform: translateY(0); } 
            50% { transform: translateY(-12px); } 
        }
        @keyframes pulseGlow {
            0% { transform: scale(1); opacity: 0.5; }
            100% { transform: scale(1.35); opacity: 0.85; }
        }
        @keyframes legendaryFloat {
            0%, 100% { transform: translate(-50%, -190px); }
            50% { transform: translate(-50%, -200px); }
        }
        
        /* 屏幕震动特效类 */
        @keyframes omniScreenShake {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            20% { transform: translate(-2px, 2px) rotate(-0.5deg); }
            40% { transform: translate(2px, -2px) rotate(0.5deg); }
            60% { transform: translate(-2px, -2px) rotate(-0.5deg); }
            80% { transform: translate(2px, 2px) rotate(0.5deg); }
        }
        body.omni-screen-shake {
            animation: omniScreenShake 0.15s ease-in-out 2;
        }

        @media (prefers-reduced-motion: reduce) {
            .omni-surprise-wrapper, .omni-surprise-glow, .omni-surprise-tooltip, body.omni-screen-shake {
                animation: none !important; transition: none !important;
            }
        }

        @media (max-width: 768px) { 
            .omni-surprise-wrapper { bottom: 100px; right: 20px; width: 50px; height: 50px; } 
            .omni-surprise-icon { font-size: 40px; }
            .omni-surprise-tooltip { display: none; } 
        }
    </style>
`;

    if (!finalConfig.extensions) finalConfig.extensions = [];
    finalConfig.extensions.push({ type: 'html', content: surpriseBoxContent });

    return finalConfig;
},
    _mergeConfig: function(customConfig) {
        return {
            logo: customConfig.logo || this.default.logo,
            theme: { ...this.default.theme, ...customConfig.theme },
            extensions: customConfig.extensions || []
        };
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OmniConfig;
}

export default OmniConfig;