# HANDOFF_TO_CHATGPT — ABIS Iron Sand Density Checker V1.0

請對本專案做**獨立驗收**。本交接由 Grok Bot 初驗後提供。

## 入口

- Repository：https://github.com/nooneknows70/abis_iron_sand
- Branch：`main`
- 正式網址：https://nooneknows70.github.io/abis_iron_sand/
- UI 來源：Mike 提供的參考 `index.html`（版面、用字、顏色與輸入正則已保留）

- 程式首次推送 commit：`b1e6ffe129e3c21b1024fdb2328286a6ee2f367d`
- 驗收文件、正式網址證據與 live 截圖見後續 commit；請以 tag `ABIS_IRON_SAND_V1_READY_FOR_CHATGPT_QA`（`main`）為準。
- Pages 已啟用，正式網址 HTTPS 200，`manifest.json` 與 `sw.js` 可存取。
- 本機邏輯測試 21/21、本機 Playwright 12/12、正式網址 Playwright 12/12 均通過。

標記：**ABIS_IRON_SAND_V1_READY_FOR_CHATGPT_QA**

詳見 `docs/ACCEPTANCE_REPORT.md`。

## 建議驗收步驟

1. 檢視 `index.html`、`styles.css`、`logic.js`、`app.js`、`manifest.json`、`sw.js`，確認無第三方 CDN、追蹤、後端呼叫或 `localStorage`。
2. 執行 `npm test`（Node 邏輯測試，應對驗收表與邊界條件全數通過）。
3. 選用 `npx playwright test` 重跑瀏覽器測試（可選）。
4. 以正式 HTTPS 網址實際開啟，抽查：
   - 0.7156 → 1.6998 → 不合格｜暫不收料
   - 0.7157 → 1.7000 → 合格｜可初步收料
   - 空白 → 等待輸入重量；0 或 -1 → 請輸入有效重量
   - 清除／下一筆後可連續輸入
   - `manifest.json` 與 `sw.js` 可存取
   - 首次載入後離線仍可計算
5. 判定規則說明：實作以 `X >= 0.7157` 判定，等價於 Y ≥ 1.70，且不用四捨五入後的比重做門檻。請核對 `logic.js` 註解與測試。

## 已知限制（請維持誠實）

- 自動化的 iPhone／LINE 測試是 Playwright Chromium 裝置與 UA 模擬，不是真實 iPhone Safari，也不是真實 LINE 內建 WebView。
- 真實 iPhone Safari 與真實 LINE 內建瀏覽器仍待 Source Owner 以實機手動確認。

## 安全範圍

僅本 repo 允許寫入與 GitHub Pages 部署。不應修改其他 ABIS 專案、正式系統、資料庫或付費設定。
