import Database from "better-sqlite3";

const db = new Database('./data/database.sqlite')

db.prepare(`CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    title TEXT,
    category TEXT,
    content TEXT,
    date TEXT,
    modify TEXT
)`).run()

const now = () => new Date().toISOString()

const usersCount = db.prepare(`SELECT COUNT(DISTINCT name) as count FROM blogs`).get().count
if (usersCount === 0) {
  const insert = db.prepare(`
    INSERT INTO blogs (name, title, category, content, date, modify)
    VALUES (?, ?, ?, ?, ?, ?)
  `)


  const users = [
    {
      name: 'Anna',
      posts: [
        { title: "Első poszt", category: "Élet", content: "Ez az első blogbejegyzésem." },
        { title: "Második poszt", category: "Utazás", content: "Tegnap elmentem kirándulni." }
      ]
    },
    {
      name: 'Béla',
      posts: [
        { title: "Recept megosztás", category: "Gasztronómia", content: "Nagyon finom palacsintát készítettem." },
        { title: "Filmélmény", category: "Szórakozás", content: "A legutóbbi film, amit láttam fantasztikus volt." }
      ]
    },
    {
      name: 'Csilla',
      posts: [
        { title: "Tech újdonságok", category: "Technológia", content: "Bemutatták az új okostelefont." },
        { title: "Könyvajánló", category: "Kultúra", content: "Az új könyv, amit olvasok, nagyon izgalmas." }
      ]
    }
  ]

  for (const user of users) {
    for (const post of user.posts) {
      const nowStr = now()
      insert.run(user.name, post.title, post.category, post.content, nowStr, nowStr)
    }
  }
}

export const getAllPosts = () => 
  db.prepare(`SELECT * FROM blogs ORDER BY date DESC`).all();

export const getPostById = (id) => 
  db.prepare(`SELECT * FROM blogs WHERE id = ?`).get(id);

export const createPost = (name, title, category, content) => {
  const nowStr = now();
  return db.prepare(`
    INSERT INTO blogs (name, title, category, content, date, modify)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name, title, category, content, nowStr, nowStr);
};

export const updatePost = (id, name, title, category, content) => {
  const nowStr = now();
  return db.prepare(`
    UPDATE blogs
    SET name = ?, title = ?, category = ?, content = ?, modify = ?
    WHERE id = ?
  `).run(name, title, category, content, nowStr, id);
};

export const deletePost = (id) => 
  db.prepare(`DELETE FROM blogs WHERE id = ?`).run(id);

