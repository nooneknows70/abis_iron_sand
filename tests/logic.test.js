"use strict";

const assert = require("assert");
const path = require("path");
const IronSand = require(path.join(__dirname, "..", "logic.js"));

let passed = 0;
let failed = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passed += 1;
    console.log("PASS  " + name);
  } catch (err) {
    failed += 1;
    failures.push({ name, message: err && err.message ? err.message : String(err) });
    console.log("FAIL  " + name);
    console.log("      " + (err && err.message ? err.message : String(err)));
  }
}

const TABLE = [
  { input: "0.421", ratio: "1.0000", status: "fail", text: "不合格｜暫不收料" },
  { input: "0.650", ratio: "1.5439", status: "fail", text: "不合格｜暫不收料" },
  { input: "0.700", ratio: "1.6627", status: "fail", text: "不合格｜暫不收料" },
  { input: "0.715", ratio: "1.6983", status: "fail", text: "不合格｜暫不收料" },
  { input: "0.7156", ratio: "1.6998", status: "fail", text: "不合格｜暫不收料" },
  { input: "0.7157", ratio: "1.7000", status: "pass", text: "合格｜可初步收料" },
  { input: "0.716", ratio: "1.7007", status: "pass", text: "合格｜可初步收料" },
  { input: "0.750", ratio: "1.7815", status: "pass", text: "合格｜可初步收料" },
  { input: "0.800", ratio: "1.9002", status: "pass", text: "合格｜可初步收料" },
  { input: "1.000", ratio: "2.3753", status: "pass", text: "合格｜可初步收料" },
  { input: "0", ratio: "—", status: "invalid", text: "請輸入有效重量" },
  { input: "-1", ratio: "—", status: "invalid", text: "請輸入有效重量" },
  { input: "", ratio: "—", status: "empty", text: "等待輸入重量" }
];

TABLE.forEach(function (row) {
  check("acceptance " + JSON.stringify(row.input), function () {
    const result = IronSand.evaluate(row.input);
    assert.strictEqual(result.status, row.status);
    assert.strictEqual(result.ratioText, row.ratio);
    assert.strictEqual(result.statusText, row.text);
    if (row.status === "pass") {
      assert.strictEqual(result.pass, true);
      assert.strictEqual(result.background, IronSand.COLOR_PASS);
    } else if (row.status === "fail") {
      assert.strictEqual(result.pass, false);
      assert.strictEqual(result.background, IronSand.COLOR_FAIL);
    } else {
      assert.strictEqual(result.pass, null);
      assert.strictEqual(result.background, IronSand.COLOR_IDLE);
    }
  });
});

check("blank whitespace is waiting", function () {
  const result = IronSand.evaluate("   ");
  assert.strictEqual(result.status, "empty");
  assert.strictEqual(result.statusText, "等待輸入重量");
});

check("trimmed numeric input still works", function () {
  const result = IronSand.evaluate("  0.7157  ");
  assert.strictEqual(result.status, "pass");
  assert.strictEqual(result.ratioText, "1.7000");
});

check("non-numeric is invalid", function () {
  ["abc", "1kg", "0.7157kg", "+", "e10", "1e-1", "--1", "NaN", ".", "0x1"].forEach(function (t) {
    const result = IronSand.evaluate(t);
    assert.strictEqual(result.status, "invalid", t);
    assert.strictEqual(result.ratioText, "—", t);
    assert.strictEqual(result.statusText, "請輸入有效重量", t);
  });
});

check("zero-like values are invalid", function () {
  ["0", "0.0", "0.000", "00"].forEach(function (t) {
    const result = IronSand.evaluate(t);
    assert.strictEqual(result.status, "invalid", t);
  });
});

check("just below threshold fails without rounding the decision", function () {
  const result = IronSand.evaluate("0.7156");
  assert.strictEqual(result.status, "fail");
  assert.strictEqual(result.ratioText, "1.6998");
  assert.ok(Number(result.ratioText) < 1.7);
});

check("threshold passes by weight, not by rounded display", function () {
  const result = IronSand.evaluate("0.7157");
  assert.strictEqual(result.status, "pass");
  assert.strictEqual(result.ratioText, "1.7000");
  assert.strictEqual(0.7157 >= IronSand.MIN_PASS_WEIGHT_KG, true);
  assert.strictEqual(IronSand.MIN_PASS_WEIGHT_KG, 0.7157);
  assert.strictEqual(IronSand.STANDARD_WATER_KG, 0.421);
});

check("leading dot is accepted by the original regex", function () {
  const result = IronSand.evaluate(".750");
  assert.strictEqual(result.status, "pass");
  assert.strictEqual(result.ratioText, "1.7815");
});

check("null and undefined are waiting", function () {
  assert.strictEqual(IronSand.evaluate(null).status, "empty");
  assert.strictEqual(IronSand.evaluate(undefined).status, "empty");
});

console.log("");
console.log("logic tests: " + passed + " passed, " + failed + " failed, " + (passed + failed) + " total");
if (failed) {
  process.exit(1);
}
