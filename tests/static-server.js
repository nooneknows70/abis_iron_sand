"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const prefix = "/abis_iron_sand";
const port = Number(process.env.PORT || 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".webmanifest": "application/manifest+json",
  ".md": "text/plain; charset=utf-8",
};

const server = http.createServer(function (req, res) {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (url === "/" || url === prefix) {
    res.writeHead(302, { Location: prefix + "/" });
    res.end();
    return;
  }
  if (!url.startsWith(prefix + "/") && url !== prefix) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  let rel = url.slice(prefix.length);
  if (rel === "/" || rel === "") rel = "/index.html";
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  fs.readFile(file, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    const ext = path.extname(file);
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(port, "127.0.0.1", function () {
  console.log("static server at http://127.0.0.1:" + port + prefix + "/");
});
