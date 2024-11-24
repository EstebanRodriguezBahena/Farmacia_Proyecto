const sqlite3 = require('sqlite3').verbose();

// Crear (o abrir) la base de datos SQLite
const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

// Crear la tabla 'clientes' si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT(30),
            last_name TEXT(30),
            sexo TEXT(1),
            edad INTEGER
        )
    `);

    // Crear la tabla 'productos' para la gestión de productos en la farmacia
    db.run(`
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT(100),
            descripcion TEXT,
            precio REAL,
            cantidad INTEGER
        )
    `);
    console.log("Tabla 'clientes' y 'productos' creadas o ya existen.");
});

// Crear tabla de ventas (si no existe)
db.run(`
    CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productoId INTEGER,
        cantidad INTEGER,
        fechaVenta TEXT,
        totalVenta REAL,
        FOREIGN KEY (productoId) REFERENCES productos(id)
    )
`, (err) => {
    if (err) {
        console.error("Error al crear la tabla ventas:", err.message);
    } else {
        console.log("Tabla de ventas creada o ya existe");
    }
});

// Cerrar la conexión a la base de datos
db.close((err) => {
    if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
    } else {
        console.log('Conexión a la base de datos cerrada.');
    }
});
