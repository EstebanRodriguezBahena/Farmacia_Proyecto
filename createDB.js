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

// Cerrar la conexión a la base de datos
db.close((err) => {
    if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
    } else {
        console.log('Conexión a la base de datos cerrada.');
    }
});
