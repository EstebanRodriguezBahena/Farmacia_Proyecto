const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Configuración de middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Ruta para mostrar la página principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para insertar producto
app.post('/insertProducto', (req, res) => {
    const { nombre, descripcion, precio, cantidad } = req.body;
    const sql = `INSERT INTO productos (nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)`;

    db.run(sql, [nombre, descripcion, precio, cantidad], function (err) {
        if (err) {
            return res.status(500).send("Error al insertar producto.");
        }
        res.status(200).send("Producto insertado correctamente");
    });
});

// Ruta para consultar todos los productos
app.get('/getAllProductos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error al obtener productos.");
        }
        res.status(200).json(rows);
    });
});

// Ruta para insertar venta
app.post('/insertVenta', (req, res) => {
    const { productoId, cantidadVenta, fechaVenta } = req.body;

    // Primero verificar si el producto existe y tiene suficiente cantidad
    const sqlCheckProduct = 'SELECT * FROM productos WHERE id = ?';
    db.get(sqlCheckProduct, [productoId], (err, row) => {
        if (err || !row) {
            return res.status(404).send("Producto no encontrado.");
        }

        if (row.cantidad < cantidadVenta) {
            return res.status(400).send("Cantidad insuficiente.");
        }

        // Si todo es válido, insertamos la venta y actualizamos el stock
        const sqlVenta = 'INSERT INTO ventas (productoId, cantidadVenta, fechaVenta) VALUES (?, ?, ?)';
        db.run(sqlVenta, [productoId, cantidadVenta, fechaVenta], function (err) {
            if (err) {
                return res.status(500).send("Error al registrar venta.");
            }

            // Actualizar la cantidad del producto
            const sqlUpdateProduct = 'UPDATE productos SET cantidad = cantidad - ? WHERE id = ?';
            db.run(sqlUpdateProduct, [cantidadVenta, productoId], (err) => {
                if (err) {
                    return res.status(500).send("Error al actualizar cantidad del producto.");
                }
                res.status(200).send("Venta registrada correctamente");
            });
        });
    });
});

// Ruta para consultar todas las ventas
app.get('/getAllVentas', (req, res) => {
    const sql = 'SELECT * FROM ventas';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error al obtener ventas.");
        }
        res.status(200).json(rows);
    });
});

// Ruta para consultar ventas por producto
app.get('/getVentasByProducto/:productoId', (req, res) => {
    const productoId = req.params.productoId;
    const sql = 'SELECT * FROM ventas WHERE productoId = ?';
    db.all(sql, [productoId], (err, rows) => {
        if (err) {
            return res.status(500).send("Error al obtener ventas por producto.");
        }
        res.status(200).json(rows);
    });
});

// Ruta para actualizar producto
app.put('/updateProducto/:id', (req, res) => {
    const { nombre, descripcion, precio, cantidad } = req.body;
    const id = req.params.id;

    const sql = `UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, cantidad = ? WHERE id = ?`;
    db.run(sql, [nombre, descripcion, precio, cantidad, id], function (err) {
        if (err) {
            return res.status(500).send("Error al actualizar producto.");
        }
        res.status(200).send("Producto actualizado correctamente");
    });
});

// Ruta para eliminar producto
app.delete('/deleteProducto/:id', (req, res) => {
    const id = req.params.id;

    const sql = `DELETE FROM productos WHERE id = ?`;
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).send("Error al eliminar producto.");
        }
        res.status(200).send("Producto eliminado correctamente");
    });
});

// Ruta para insertar venta
app.post('/insertVenta', (req, res) => {
    const { productoId, cantidadVenta, fechaVenta } = req.body;

    // Verificar si el producto existe
    const sqlCheckProduct = 'SELECT * FROM productos WHERE id = ?';
    db.get(sqlCheckProduct, [productoId], (err, row) => {
        if (err || !row) {
            return res.status(404).send("Producto no encontrado.");
        }

        if (row.cantidad < cantidadVenta) {
            return res.status(400).send("Cantidad insuficiente.");
        }

        // Insertar venta
        const sqlVenta = 'INSERT INTO ventas (productoId, cantidadVenta, fechaVenta) VALUES (?, ?, ?)';
        db.run(sqlVenta, [productoId, cantidadVenta, fechaVenta], function (err) {
            if (err) {
                return res.status(500).send("Error al registrar venta.");
            }

            // Actualizar cantidad del producto
            const sqlUpdateProduct = 'UPDATE productos SET cantidad = cantidad - ? WHERE id = ?';
            db.run(sqlUpdateProduct, [cantidadVenta, productoId], (err) => {
                if (err) {
                    return res.status(500).send("Error al actualizar cantidad del producto.");
                }
                res.status(200).send("Venta registrada correctamente");
            });
        });
    });
});

// Ruta para eliminar producto
app.delete('/deleteProducto/:id', (req, res) => {
    const id = req.params.id;

    const sql = `DELETE FROM productos WHERE id = ?`;
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).send("Error al eliminar producto.");
        }
        res.status(200).send("Producto eliminado correctamente");
    });
});

// Ruta para eliminar venta
app.delete('/deleteVenta/:id', (req, res) => {
    const id = req.params.id;

    const sql = `DELETE FROM ventas WHERE id = ?`;
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).send("Error al eliminar venta.");
        }
        res.status(200).send("Venta eliminada correctamente");
    });
});

// Configuración del puerto
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
