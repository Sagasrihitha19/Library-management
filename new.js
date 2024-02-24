const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'S2019@abcd#',
    database: 'employee_management',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.post('/addEmployee', (req, res) => {
    const { title, author, publishdate, subject, availablebooks } = req.body;

    const sql = 'INSERT INTO employees (title, author, publishdate, subject,availablebooks ) VALUES (?, ?, ?, ?, ?)';
    const values = [title, author, publishdate, subject, availablebooks];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding book:', err);
            return res.status(500).json({ error: 'An error occurred while adding the book' });
        }
        console.log('book added successfully');
        res.status(200).json({ message: 'book added successfully' });
    });
});


app.get('/addEmployee', (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const perPage = 5;

    const sortBy = req.query.sortby || '';

    const search = req.query.search || '';

    const offset = (page - 1) * perPage;

    let orderBy = '';
    if (sortBy === 'author') {
        orderBy = 'ORDER BY author';
    } else if (sortBy === 'subject') {
        orderBy = 'ORDER BY subject';
    } else if (sortBy === 'title') {
        orderBy = 'ORDER BY title';
    }

    let whereClause = '';
    if (search) {
        whereClause = `WHERE title LIKE '%${search}%' OR author LIKE '%${search}%' OR subject LIKE '%${search}%'`;
    }

    const sql = `SELECT * FROM employees ${whereClause} ${orderBy} LIMIT ?, ?`;
    connection.query(sql, [offset, perPage], (err, limitedResults) => {
        if (err) {
            console.error('Error fetching limited books:', err);
            return res.status(500).json({ error: 'An error occurred while fetching limited books' });
        }

        const countSql = `SELECT COUNT(*) AS totalCount FROM employees ${whereClause}`;
        connection.query(countSql, (err, countResults) => {
            if (err) {
                console.error('Error fetching total count:', err);
                return res.status(500).json({ error: 'An error occurred while fetching total count' });
            }

            const totalCount = countResults[0].totalCount;

            res.status(200).json({ totalResults: totalCount, limitedResults: limitedResults });
        });
    });
});



app.delete('/deleteEmployee/:id', (req, res) => {
    const bookId = req.params.id;

    const sql = 'DELETE FROM employees WHERE id = ?';

    connection.query(sql, [bookId], (err, result) => {
        if (err) {
            console.error('Error deleting book:', err);
            return res.status(500).json({ error: 'An error occurred while deleting the book' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        console.log('Book deleted successfully');
        res.status(200).json({ message: 'Book deleted successfully' });
    });
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});