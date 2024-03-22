require('dotenv').config({ path: '../datos.env' }); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const register = async (req, res) => {
    const { nombre, email, direccion_envio, telefono, contrasena, es_admin } = req.body;
    try {
        const contrasena_hash = await bcrypt.hash(contrasena, 10);
        const newUser = await pool.query(
            'INSERT INTO usuarios (nombre, email, direccion_envio, telefono, contrasena_hash, es_admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nombre, email, direccion_envio, telefono, contrasena_hash, es_admin]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

const login = async (req, res) => {
    const { email, contrasena } = req.body;
    try {
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (rows.length > 0) {
            const user = rows[0];
            const isValidPassword = await bcrypt.compare(contrasena, user.contrasena_hash);
            if (isValidPassword) {
                const token = jwt.sign({ id: user.id, email: user.email, es_admin: user.es_admin }, process.env.JWT_SECRET, { expiresIn: '8h' });
                res.json({ token });
            } else {
                res.status(400).json({ error: 'Contraseña incorrecta' });
            }
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

module.exports = { register, login };
