// setupBackend.js
const fs = require('fs');
const path = require('path');

const folders = [
  'config',
  'controllers',
  'models',
  'routes'
];

const files = [
  {
    path: 'server.js',
    content: `const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Example route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import routes
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server running on port \${PORT}\`));
`
  },
  {
    path: 'config/db.js',
    content: `const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'your_database_name'
});

connection.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

module.exports = connection;
`
  },
  {
    path: '.gitignore',
    content: `node_modules
.env
`
  },
  {
    path: 'package.json',
    content: `{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "mysql2": "^3.6.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
`
  }
];

folders.forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    console.log(`Created folder: ${folder}`);
  }
});

files.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, file.content, 'utf8');
  console.log(`Created file: ${file.path}`);
});

console.log('✅ Project structure created successfully!');
