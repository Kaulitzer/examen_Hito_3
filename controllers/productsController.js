const pool = require('../db'); 

const getProducts = async (req, res) => {
  try {
    console.log(process.env.DB_PASSWORD)
    const { rows } = await pool.query('SELECT * FROM productos');
    res.status(200).json(rows);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const addProduct = async (req, res) => {
  const { nombre, descripcion, precio, imagen } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, imagen) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, descripcion, precio, imagen]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, imagen = $4 WHERE id = $5 RETURNING *',
      [nombre, descripcion, precio, imagen, id]
    );
    if(rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
    if(rowCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
};
