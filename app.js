import express from "express";
import * as db from './util/database.js';

import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API végek

// Blog posztok lekérése
app.get("/posts", (req, res) => {
  try {
    const posts = db.getAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Egy blog poszt lekérése ID alapján
app.get("/posts/:id", (req, res) => {
  try {
    const post = db.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Új blog poszt létrehozása
app.post("/posts", (req, res) => {
  const { name, title, category, content } = req.body;
  if (!name || !title || !category || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const result = db.createPost(name, title, category, content);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Blog poszt szerkesztése
app.put("/posts/:id", (req, res) => {
  const { name, title, category, content } = req.body;
  const id = req.params.id;
  if (!name || !title || !category || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const result = db.updatePost(id, name, title, category, content);
    if (result.changes === 0) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Blog poszt törlése
app.delete("/posts/:id", (req, res) => {
  try {
    const result = db.deletePost(req.params.id);
    if (result.changes === 0) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Frontend kiszolgálása
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
