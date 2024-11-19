const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear la base de datos SQLite
const db = new sqlite3.Database('mydb.sqlite3', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos', err);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

const app = express();
const port = 3000;

// Middleware para procesar las solicitudes JSON
app.use(bodyParser.json());

// Servir archivos estáticos (como index.html, style.css, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Crear la tabla de productos si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL NOT NULL,
        cantidad INTEGER NOT NULL
    );
`);

// Ruta para insertar productos
app.post('/insertProducto', (req, res) => {
    const { nombre, descripcion, precio, cantidad } = req.body;
    const query = `INSERT INTO productos (nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)`;
    
    db.run(query, [nombre, descripcion, precio, cantidad], function(err) {
        if (err) {
            return res.status(500).send('Error al insertar el producto');
        }
        res.send('Producto insertado con éxito');
    });
});

// Ruta para obtener todos los productos
app.get('/getAllProductos', (req, res) => {
    const query = 'SELECT * FROM productos';
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error al consultar productos');
        }
        res.json(rows);
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
