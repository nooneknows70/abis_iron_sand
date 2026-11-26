const { test, expect } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const SCREEN_DIR = path.join(__dirname, "..", "screenshots");
fs.mkdirSync(SCREEN_DIR, { recursive: true });

const TABLE = [
  { input: "0.421", ratio: "1.0000", status: "不合格｜暫不收料" },
  { input: "0.650", ratio: "1.5439", status: "不合格｜暫不收料" },
  { input: "0.700", ratio: "1.6627", status: "不合格｜暫不收料" },
  { input: "0.715", ratio: "1.6983", status: "不合格｜暫不收料" },
  { input: "0.7156", ratio: "1.6998", status: "不合格｜暫不收料" },
  { input: "0.7157", ratio: "1.7000", status: "合格｜可初步收料" },
  { input: "0.716", ratio: "1.7007", status: "合格｜可初步收料" },
  { input: "0.750", ratio: "1.7815", status: "合格｜可初步收料" },
  { input: "0.800", ratio: "1.9002", status: "合格｜可初步收料" },
  { input: "1.000", ratio: "2.3753", status: "合格｜可初步收料" },
];

async function fillAndRead(page, value) {
  await page.locator("#weight").fill("");
  if (value !== "") {
    await page.locator("#weight").fill(value);
  } else {
    await page.locator("#weight").evaluate((el) => {
      el.value = "";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }
  return {
    ratio: (await page.locator("#ratio").textContent()).trim(),
    status: (await page.locator("#status").textContent()).trim(),
  };
}

function isSameOrigin(url, origin) {
  try {
    const u = new URL(url);
    if (u.protocol === "data:" || u.protocol === "blob:") return true;
    return u.origin === origin;
  } catch {
    return false;
  }
}

test("acceptance table, clear, consecutive input, no external requests", async ({ page, baseURL }, testInfo) => {
  const requests = [];
  page.on("request", (req) => {
    requests.push(req.url());
  });

  await page.goto("./");
  await expect(page.locator("#status")).toHaveText("等待輸入重量");
  await expect(page.locator("#ratio")).toHaveText("—");

  const project = testInfo.project.name;
  if (project === "iphone-chromium-emulation" || project === "android-chrome-pixel") {
    await page.screenshot({
      path: path.join(SCREEN_DIR, `${project}-empty-grey.png`),
      fullPage: true,
    });
  }

  for (const row of TABLE) {
    const got = await fillAndRead(page, row.input);
    expect(got.ratio, row.input).toBe(row.ratio);
    expect(got.status, row.input).toBe(row.status);
  }

  if (project === "iphone-chromium-emulation" || project === "android-chrome-pixel") {
    await fillAndRead(page, "0.7156");
    await page.screenshot({
      path: path.join(SCREEN_DIR, `${project}-fail-red.png`),
      fullPage: true,
    });
    await fillAndRead(page, "0.7157");
    await page.screenshot({
      path: path.join(SCREEN_DIR, `${project}-pass-green.png`),
      fullPage: true,
    });
  }

  const zero = await fillAndRead(page, "0");
  expect(zero.ratio).toBe("—");
  expect(zero.status).toBe("請輸入有效重量");

  const neg = await fillAndRead(page, "-1");
  expect(neg.ratio).toBe("—");
  expect(neg.status).toBe("請輸入有效重量");

  await page.locator("#reset").click();
  await expect(page.locator("#weight")).toHaveValue("");
  await expect(page.locator("#status")).toHaveText("等待輸入重量");
  await expect(page.locator("#ratio")).toHaveText("—");
  await expect(page.locator("#weight")).toBeFocused();

  const again = await fillAndRead(page, "0.750");
  expect(again).toEqual({ ratio: "1.7815", status: "合格｜可初步收料" });

  const origin = new URL(baseURL).origin;
  const external = requests.filter((url) => !isSameOrigin(url, origin));
  expect(external, "external requests: " + external.join(", ")).toEqual([]);
});

test("offline calculation after first successful load", async ({ page, context, browserName }) => {
  test.skip(browserName === "webkit" && process.env.SKIP_WEBKIT_SW === "1", "WebKit SW not available in this environment");
  await page.goto("./");
  await expect(page.locator("#status")).toHaveText("等待輸入重量");

  await page.waitForFunction(async () => {
    if (!("serviceWorker" in navigator)) return false;
    const reg = await navigator.serviceWorker.getRegistration();
    return Boolean(reg && (reg.active || navigator.serviceWorker.controller));
  }, null, { timeout: 15000 });

  // Give the SW a moment to finish caching the app shell.
  await page.waitForTimeout(500);

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#status")).toHaveText("等待輸入重量");

  await page.locator("#weight").fill("0.7157");
  await expect(page.locator("#ratio")).toHaveText("1.7000");
  await expect(page.locator("#status")).toHaveText("合格｜可初步收料");

  await page.locator("#weight").fill("0.700");
  await expect(page.locator("#ratio")).toHaveText("1.6627");
  await expect(page.locator("#status")).toHaveText("不合格｜暫不收料");

  await context.setOffline(false);
});

test("PWA manifest and service worker are served", async ({ request, baseURL }) => {
  const manifest = await request.get(new URL("manifest.json", baseURL).toString());
  expect(manifest.ok()).toBeTruthy();
  const body = await manifest.json();
  expect(body.start_url).toBe("./");
  expect(body.display).toBe("standalone");

  const sw = await request.get(new URL("sw.js", baseURL).toString());
  expect(sw.ok()).toBeTruthy();
  const text = await sw.text();
  expect(text).toContain("abis-iron-sand-v1");
});
