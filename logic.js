/**
 * ABIS 鐵砂比重檢測 — 純計算模組（瀏覽器與 Node 測試共用）
 *
 * 判定規則：
 *   合格條件在規格上是 Y = X / 0.421 ≥ 1.70。
 *   因 0.421 × 1.70 = 0.7157（十進位恰好），故改以淨重 X ≥ 0.7157 kg 判定。
 *   這樣不使用除法結果做門檻比較，可避開 0.7157 / 0.421
 *   在 IEEE 浮點中可能變成 1.6999… 而被誤判不合格的風險。
 *   比重顯示仍用 (X / 0.421).toFixed(4)，僅供畫面呈現，不參與合格判定。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.IronSand = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var STANDARD_WATER_KG = 0.421;
  var MIN_PASS_WEIGHT_KG = 0.7157;
  var INPUT_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;
  var COLOR_IDLE = "#64748b";
  var COLOR_PASS = "#15803d";
  var COLOR_FAIL = "#b91c1c";

  function evaluate(raw) {
    var t = String(raw == null ? "" : raw).trim();
    if (t === "") {
      return {
        status: "empty",
        ratioText: "—",
        statusText: "等待輸入重量",
        background: COLOR_IDLE,
        pass: null
      };
    }
    var n = Number(t);
    var ok = INPUT_RE.test(t) && Number.isFinite(n) && n > 0;
    if (!ok) {
      return {
        status: "invalid",
        ratioText: "—",
        statusText: "請輸入有效重量",
        background: COLOR_IDLE,
        pass: null
      };
    }
    var pass = n >= MIN_PASS_WEIGHT_KG;
    return {
      status: pass ? "pass" : "fail",
      ratioText: (n / STANDARD_WATER_KG).toFixed(4),
      statusText: pass ? "合格｜可初步收料" : "不合格｜暫不收料",
      background: pass ? COLOR_PASS : COLOR_FAIL,
      pass: pass
    };
  }

  return {
    STANDARD_WATER_KG: STANDARD_WATER_KG,
    MIN_PASS_WEIGHT_KG: MIN_PASS_WEIGHT_KG,
    INPUT_RE: INPUT_RE,
    COLOR_IDLE: COLOR_IDLE,
    COLOR_PASS: COLOR_PASS,
    COLOR_FAIL: COLOR_FAIL,
    evaluate: evaluate
  };
});
