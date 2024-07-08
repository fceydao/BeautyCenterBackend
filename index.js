import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDb, getDb } from './db.js';

const app = express();
dotenv.config();

let db;

connectToDb((err) => {
    if (!err) {
        app.listen(5002, () => {
            console.log(`Server is running on port: ${5002}`);
        });
        db = getDb();
        console.log('Database connection established.');
    } else {
        console.log('Failed to connect to the database:', err);
    }
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!db) {
        return res.status(500).json({ error: 'Failed to connect to the database' });
    }
    
    try {
        const user = await db.collection('users').findOne({ username, password });
        if (user) {
            res.status(200).json({ user: { id: user._id, username: user.username } });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get("/users", async (req, res) => {
    if (!db) {
        res.status(500).json({ error: 'Failed to connect to the database' });
        return;
    }

    try {
        const users = await db.collection('users').find().sort({ username: 1 }).toArray();
        console.log('Users:', users); // Sorgu sonucunu loglama
        res.status(200).json(users);
    } catch (err) {
        console.log('Error fetching users:', err);
        res.status(500).json({ error: 'Could not fetch the documents' });
    }
});

app.post('/api/checkSession', async (req, res) => {
    const { userId } = req.body;
    if (userId) {
        res.status(200).json({ success: true, message: 'Session is valid' });
    } else {
        res.status(401).json({ success: false, message: 'Session is invalid' });
    }
});

app.post('/api/appointment', async (req, res) => {
    const { userId, date, service } = req.body;
    
    // Kullanıcının oturum durumunu kontrol etme
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!db) {
        return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    try {
        const appointment = { userId, date, service };
        const result = await db.collection('appointments').insertOne(appointment);
        res.status(200).json({ appointmentId: result.insertedId });
    } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/logout', async (req, res) => {
    // Oturum kimliğini temizleme veya geçersizleştirme işlemi
    // Örneğin, oturum kimliğiyle ilişkili veritabanı girişini temizleme
    // Kullanıcının oturumunu sonlandırma
    // Gerekirse diğer temizleme işlemleri yapılabilir
    // Örneğin, JWT kullanılıyorsa, token'ı geçersiz hale getirme işlemi
    // Son olarak, başarılı bir yanıt gönderme
    res.status(200).json({ success: true, message: 'Logout successful' });
});

app.post('/api/addFavorite', async (req, res) => {
    const { userId, productId } = req.body;
    if (!db) {
        return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    try {
        // Önce favorinin zaten var olup olmadığını kontrol edin
        const existingFavorite = await db.collection('favorites').findOne({ userId, productId });
        if (existingFavorite) {
            return res.status(400).json({ error: 'Product already added to favorites' });
        }

        // Favoriyi ekleme
        const result = await db.collection('favorites').insertOne({ userId, productId });
        res.status(200).json({ message: 'Product added to favorites successfully' });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/addComment', async (req, res) => {
    const { userId, comment } = req.body;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!comment) {
        return res.status(400).json({ error: 'Comment cannot be empty' });
    }

    if (!db) {
        return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    try {
        // Kullanıcı bilgilerini almak için kullanıcı ID'sini kullanarak veritabanından sorgulama yapılabilir
        // Örneğin, comments koleksiyonuna kullanıcı ID'si, kullanıcı adı ve yorum eklenmesi
        const result = await db.collection('comments').insertOne({ userId, comment });
        res.status(200).json({ success: true, message: 'Comment added successfully' });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/comments', async (req, res) => {
    if (!db) {
        return res.status(500).json({ error: 'Failed to connect to the database' });
    }

    try {
        const comments = await db.collection('comments').find().toArray();
        res.status(200).json(comments);
    } catch (err) {
        console.error('Error fetching comments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/appointments/:userId', async (req, res) => {
    const { userId } = req.params;
    
    try {
      const appointments = await db.collection('appointments').find({ userId }).toArray();
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  app.delete('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db.collection('appointments').deleteOne({ _id: ObjectId(id) });
        if (response.deletedCount === 1) {
            res.status(200).json({ message: 'Appointment deleted successfully' });
        } else {
            res.status(404).json({ error: 'Appointment not found' });
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});







