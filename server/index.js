const express = require('express');
const { Pool } = require('pg');
const { execSync } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');
const path = require('path');

const UPLOADS_DIR = "uploads";
const PUBLIC_DIR = "public";
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}
// fs.mkdirSync(PUBLIC_DIR);

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(`/${PUBLIC_DIR}`, express.static(PUBLIC_DIR));

app.use(session({
  secret: 'clAiwj*6@8nNgddJIiajif!e',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false // for the sake of demonstrating session stealing
  }
}));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${UPLOADS_DIR}/`);
  },
  filename: function (req, file, cb) {
    // cb(null, `${Date.now()}${path.extname(file.originalname)}`); //- FIX HERE
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

app.get('/', async (req, res) => {
  try {
    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/home', async (req, res) => {
  try {
    res.render('home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/top-books', async (req, res) => {
  try {
    const query = 'SELECT * FROM books LIMIT 10';
    const { rows } = await pool.query(query);

    res.render('top-books', { books: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/search-books', async (req, res) => {
  try {
    const { searchTerm } = req.query;
    // const query = 'SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1'; //- FIX HERE
    // const { rows } = await pool.query(query, [`%${searchTerm}%`]); //- FIX HERE
    const { rows } = await pool.query(`SELECT * FROM books WHERE title ILIKE '%${searchTerm}%' OR author ILIKE '%${searchTerm}%'`);

    res.render('search-books', { results: rows, searchTerm });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/stories', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM stories`);

    res.render('stories', { stories: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const { title, author, description } = req.body;

    const { filename } = req.file;

    const pdfPath = `${PUBLIC_DIR}/${filename.substring(0, filename.lastIndexOf('.'))}.pdf`;
    const command = `pandoc --pdf-engine tectonic -o ${pdfPath} -f docx ${UPLOADS_DIR}/${filename}`;

    const stdout = execSync(command);

    await pool.query(`INSERT INTO stories (title, author, description, pdf_path) VALUES ($1, $2, $3, $4)`, [title, author, description, pdfPath]);

    res.redirect('/stories');

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // if ((await pool.query(`SELECT id FROM users WHERE username=$1 AND password=$2`, [username, password])).count !== 0) { // FIX HERE
    if ((await pool.query(`SELECT id FROM users WHERE username='${username}' AND password='${password}'`)).rowCount !== 0) {
      req.session.authenticated = true;
      res.redirect('/admin');
    } else {
      res.redirect('/login?error=Invalid login.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/login', (req, res) => {
  try {
    if (req.session.authenticated) {
      res.redirect('/admin');
      return;
    }

    const { error } = req.query;
    res.render('login', { error });

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/admin', (req, res) => {
  if (req.session.authenticated) {
    res.render('admin');
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
