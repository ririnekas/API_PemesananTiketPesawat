const express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');
const client = require('./connection'); // Pastikan koneksi ke database sudah benar

const app = express();
const path =require('path')
app.use(express.static(path.join(__dirname, 'view')));
app.use(BodyParser.json());
app.use(cors());

app.listen(3100, () => {
    console.log('Server running on port 3100');
});
// Koneksi ke database
client.connect(err => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

// Mendapatkan semua maskapai
app.get('/maskapai', (req, res) => {
    client.query('SELECT * FROM maskapai', (err, result) => {
        if (!err) {
            res.json(result.rows);
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});

// Mendapatkan maskapai berdasarkan id
app.get('/maskapai/:id_maskapai', (req, res) => {
    const { id_maskapai } = req.params;
    const query = 'SELECT * FROM maskapai WHERE id_maskapai = $1';
    
    client.query(query, [id_maskapai], (err, result) => {
        if (!err) {
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ message: 'Maskapai not found' });
            }
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});

// Menambahkan maskapai baru
app.post('/maskapai', (req, res) => {
    const { nama_maskapai, kode_maskapai } = req.body;
    const query = 'INSERT INTO maskapai (nama_maskapai, kode_maskapai) VALUES ($1, $2) RETURNING *';
    
    client.query(query, [nama_maskapai, kode_maskapai], (err, result) => {
        if (!err) {
            res.status(201).json({ message: 'Insert Success', data: result.rows[0] });
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});

// Memperbarui maskapai berdasarkan id
app.put('/maskapai/:id_maskapai', (req, res) => {
    const { id_maskapai } = req.params;
    const { nama_maskapai, kode_maskapai } = req.body;
    const query = 'UPDATE maskapai SET nama_maskapai = $1, kode_maskapai = $2 WHERE id_maskapai = $3 RETURNING *';
    
    client.query(query, [nama_maskapai, kode_maskapai, id_maskapai], (err, result) => {
        if (!err) {
            if (result.rows.length > 0) {
                res.json({ message: 'Update Success', data: result.rows[0] });
            } else {
                res.status(404).json({ message: 'Maskapai not found' });
            }
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});

// Menghapus maskapai berdasarkan id
app.delete('/maskapai/:id_maskapai', (req, res) => {
    const { id_maskapai } = req.params;
    const query = 'DELETE FROM maskapai WHERE id_maskapai = $1 RETURNING *';
    
    client.query(query, [id_maskapai], (err, result) => {
        if (!err) {
            if (result.rows.length > 0) {
                res.json({ message: 'Delete Success', data: result.rows[0] });
            } else {
                res.status(404).json({ message: 'Maskapai not found' });
            }
        } else {
            res.status(500).json({ error: err.message });
        }
    });
});
