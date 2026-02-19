const path = require("path");
const express = require("express");
const Database = require("better-sqlite3");
const { nanoid } = require("nanoid");
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const { marked } = require("marked");

const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "data", "share.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS shares (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/share", (req, res) => {
  const content = typeof req.body?.content === "string" ? req.body.content : "";
  if (!content.trim()) {
    return res.status(400).json({ error: "Content required" });
  }

  const id = nanoid(10);
  const now = Date.now();
  const stmt = db.prepare(
    "INSERT INTO shares (id, content, created_at, updated_at) VALUES (?, ?, ?, ?)"
  );
  stmt.run(id, content, now, now);

  const url = `/s/${id}`;
  res.json({ id, url });
});

app.post("/api/preview", (req, res) => {
  const content = typeof req.body?.content === "string" ? req.body.content : "";
  const raw = marked.parse(content);
  const clean = DOMPurify.sanitize(raw);
  res.json({ html: clean });
});

app.get("/api/share/:id", (req, res) => {
  const id = req.params.id;
  const row = db.prepare("SELECT content, created_at FROM shares WHERE id = ?").get(id);
  if (!row) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json({ content: row.content, createdAt: row.created_at });
});

app.get("/s/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "share.html"));
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`markdown-share listening on port ${port}`);
});
