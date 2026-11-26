# ABIS 鐵砂比重檢測 V1.0 驗收報告

日期：2026-11-26（Asia/Taipei）
Repository：https://github.com/nooneknows70/abis_iron_sand
正式網址：https://nooneknows70.github.io/abis_iron_sand/
起始內容：Mike 於 2026-11-26 10:29（Asia/Taipei）建立公開 repo，當時僅有 GitHub 預設 `README.md`（`# abis_iron_sand`）與 initial commit `c9aee9f3c8130cc20e410ae4f529bc6154c0fc9b`。本輪在此基礎上建置，未另開新庫，亦未修改其他 ABIS repo。

UI 以 Mike 提供的參考 `index.html` 為基底，保留版面、用字（合格｜可初步收料／不合格｜暫不收料／等待輸入重量／請輸入有效重量）、顏色、輸入正則，以及頁尾「僅供收料初篩，不取代金屬鐵含量檢驗。」僅補上 PWA、可測試模組與文件。

## 判定規則（已文件化）

規格要求 Y = X / 0.421 ≥ 1.70，且不得以四捨五入後的比重做合格判定。
因 0.421 × 1.70 = 0.7157（十進位恰好），實作以淨重 `X >= 0.7157` 判定，與 Y ≥ 1.70 等價，且不使用除法結果當門檻，以避免 `0.7157 / 0.421` 在浮點中變成 `1.6999…` 的風險。
畫面比重仍以 `(X / 0.421).toFixed(4)` 顯示，僅供閱讀，不參與判定。

## 本機自動化測試

環境：Grok Bot box，Node v24.22.1，Playwright 1.56.1 + Chromium 141。

| 套件 | 結果 |
|---|---|
| `node tests/logic.test.js` | **21 passed, 0 failed**（含完整驗收表 13 列與邊界條件） |
| `npx playwright test`（4 個專案 × 3 項） | **12 passed, 0 failed** |

驗收表（輸入 kg → 顯示比重 → 判定）：

| 輸入 | 比重 | 判定 |
|---|---|---|
| 0.421 | 1.0000 | 不合格｜暫不收料 |
| 0.650 | 1.5439 | 不合格｜暫不收料 |
| 0.700 | 1.6627 | 不合格｜暫不收料 |
| 0.715 | 1.6983 | 不合格｜暫不收料 |
| 0.7156 | 1.6998 | 不合格｜暫不收料 |
| 0.7157 | 1.7000 | 合格｜可初步收料 |
| 0.716 | 1.7007 | 合格｜可初步收料 |
| 0.750 | 1.7815 | 合格｜可初步收料 |
| 0.800 | 1.9002 | 合格｜可初步收料 |
| 1.000 | 2.3753 | 合格｜可初步收料 |
| 0 | — | 請輸入有效重量 |
| -1 | — | 請輸入有效重量 |
| （空白） | — | 等待輸入重量 |

以上列全部通過。另驗證：前後空白、前導小數點（沿用原正則）、非數字、零值變體、清除／下一筆後連續輸入、以及請求紀錄中無站外連線（僅同源）。

離線計算：先成功載入並等待 Service Worker 啟用，再將瀏覽器設為離線後重新載入，仍可正確計算 0.7157（合格）與 0.700（不合格）。四個專案皆通過。

## 瀏覽器覆蓋與誠實聲明

| 項目 | 作法 | 結果 |
|---|---|---|
| 桌面瀏覽器 | Playwright Desktop Chrome（Chromium） | 通過 |
| Android Chrome | Playwright Pixel 7 裝置模擬（Chromium） | 通過 |
| iPhone | Playwright iPhone 14 視窗／觸控模擬，**強制使用 Chromium** | 通過（模擬） |
| LINE 內建瀏覽器 | 同上，並套用 LINE iOS 內建瀏覽器 User-Agent 字串 | 通過（模擬） |
| 真實 iPhone Safari | 未能在本機啟動真實 Safari | **待 Mike 以實機手動確認** |
| 真實 LINE 內建瀏覽器 | 僅 UA 模擬，非 LINE 應用內 WebView | **待 Mike 以實機手動確認** |

本機已下載 Playwright WebKit，但主機缺少 `libwoff2dec`、`libevent-2.1`、`libgstgl` 等函式庫，無法啟動 WebKit。因此 iPhone／LINE 測試是 Chromium 裝置模擬，**不等於** 真實 iPhone Safari 或真實 LINE 內建瀏覽器。

## GitHub Pages 與正式網址

已於 2026-11-26 10:35（Asia/Taipei）將程式推送到 `main`（`b1e6ffe129e3c21b1024fdb2328286a6ee2f367d`），並啟用 GitHub Pages（source：`main`／根目錄）。約於 10:36 正式網址開始回傳 HTTP 200。

驗證時間：2026-11-26 10:36（Asia/Taipei）

| 檢查 | 結果 |
|---|---|
| `https://nooneknows70.github.io/abis_iron_sand/` | HTTPS HTTP/2 **200**，`text/html; charset=utf-8`，HSTS 已啟用 |
| `manifest.json` | **200**，`application/json`，`start_url` 與 `scope` 為 `./`，`display: standalone` |
| `sw.js` | **200**，`application/javascript`，快取名稱 `abis-iron-sand-v1` |
| `icons/icon-192.png`、`logic.js` | **200** |
| 對正式網址重跑 Playwright（4 專案 × 3 項） | **12 passed, 0 failed**（含離線計算與無站外連線） |

QR Code：`qr/abis_iron_sand_qr.png`（內容為上述正式網址）。

## 截圖

本地靜態伺服器模擬（灰／紅／綠）：

- `screenshots/iphone-chromium-emulation-empty-grey.png`
- `screenshots/iphone-chromium-emulation-fail-red.png`
- `screenshots/iphone-chromium-emulation-pass-green.png`
- `screenshots/android-chrome-pixel-empty-grey.png`
- `screenshots/android-chrome-pixel-fail-red.png`
- `screenshots/android-chrome-pixel-pass-green.png`

正式網址截圖（Playwright 開啟 live HTTPS，灰／紅／綠）：

- `screenshots/live-iphone-chromium-emulation-empty-grey.png`
- `screenshots/live-iphone-chromium-emulation-fail-red.png`
- `screenshots/live-iphone-chromium-emulation-pass-green.png`
- `screenshots/live-android-chrome-pixel-empty-grey.png`
- `screenshots/live-android-chrome-pixel-fail-red.png`
- `screenshots/live-android-chrome-pixel-pass-green.png`

## 標記

本機與正式網址自動化測試均已通過。

**ABIS_IRON_SAND_V1_READY_FOR_CHATGPT_QA**

真實 iPhone Safari 與真實 LINE 內建瀏覽器仍待 Source Owner 以實機手動確認；此項不阻擋 ChatGPT 依本包做獨立驗收。最終 commit 與 tag 請以 `main` 上的 `ABIS_IRON_SAND_V1_READY_FOR_CHATGPT_QA` 為準。
