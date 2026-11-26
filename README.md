# ABIS 鐵砂比重檢測 V1.0

供 ABIS 收砂人員使用的手機網頁版鐵砂比重快速檢測工具。無需登入、不傳送也不儲存輸入資料，首次成功載入後可離線使用。

**正式網址：** https://nooneknows70.github.io/abis_iron_sand/

用手機相機掃描 [`qr/abis_iron_sand_qr.png`](qr/abis_iron_sand_qr.png) 即可開啟。亦可在支援的瀏覽器選擇「加入主畫面」。

## 使用方式

1. 以與量水時相同體積的容器盛裝鐵砂，並扣除空罐重量，得到鐵砂淨重（kg）。
2. 在「鐵砂淨重」欄位輸入數字，畫面會立刻計算，不必按計算鈕。
3. 依結果判定：
   - **合格｜可初步收料**（綠色）
   - **不合格｜暫不收料**（紅色）
   - 空白為「等待輸入重量」；零、負數或非數字為「請輸入有效重量」
4. 按「清除／下一筆檢測」後可繼續下一筆。

本工具僅供收料初篩，不取代金屬鐵含量檢驗。

## 計算規則

- 標準水重：0.421 kg
- 輸入淨重為 X（kg），顯示比重 Y = X / 0.421（顯示至小數第四位）
- 合格條件：Y ≥ 1.70，也就是淨重 X ≥ 0.7157 kg（0.421 × 1.70 = 0.7157）
- **合格判定使用淨重與 0.7157 的直接比較，不使用四捨五入後的比重。**
  這與「Y ≥ 1.70」在十進位上等價，並可避開部分環境中 `0.7157 / 0.421` 變成 `1.6999…` 而被誤判不合格的浮點誤差。
- 最低合格重量：0.7157 kg

## 技術說明

- 純前端：HTML、CSS、JavaScript，無後端、資料庫、API 或登入
- 不使用第三方 CDN、追蹤或分析工具
- 不將輸入寫入 `localStorage`，也不傳送到外部
- PWA：`manifest.json`、192／512 圖示，以及 Service Worker 快取應用程式殼層，支援首次成功載入後離線計算
- 所有資源使用相對路徑，可部署於 `https://nooneknows70.github.io/abis_iron_sand/`

主要檔案：`index.html`、`styles.css`、`logic.js`（可測試的純計算模組）、`app.js`、`manifest.json`、`sw.js`。

## 測試

```bash
npm install
npm test          # Node 邏輯測試（含完整驗收表與邊界條件）
npx playwright install chromium
npm run test:e2e  # 瀏覽器自動化（本機靜態伺服器，路徑模擬 /abis_iron_sand/）
```

驗收紀錄見 [`docs/ACCEPTANCE_REPORT.md`](docs/ACCEPTANCE_REPORT.md)。交給 ChatGPT 獨立驗收的入口見 [`HANDOFF_TO_CHATGPT.md`](HANDOFF_TO_CHATGPT.md)。

## 授權範圍

本公開 Repository 僅用於本工具之建置與 GitHub Pages 部署，不涉及其他 ABIS 系統、資料庫或付費服務。
