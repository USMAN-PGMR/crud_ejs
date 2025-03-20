const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const userModel = require('./models/user');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/userDB')
    .then(() => console.log("Database connected"))
    .catch(err => console.log(err));

// Home Route
app.get('/', (req, res) => {
    res.render('index');
});

// Read Users
app.get('/read', async (req, res) => {
    let allUsers = await userModel.find();
    res.render('read', { users: allUsers });
});

// Delete User
app.get('/delete/:id', async (req, res) => {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect('/read');
});

// ✅ Update User from Modal
app.post('/updateUser', async (req, res) => {
    const { id, name, email, imageUrl } = req.body;

    await userModel.findByIdAndUpdate(id, { name, email, imageUrl });

    res.redirect('/read');
});

// Create New User
app.post('/create', async (req, res) => {
    let { name, email, imageUrl } = req.body;
    await userModel.create({ name, email, imageUrl });
    res.redirect('/read');
});

app.listen(8000, () => console.log("Server running on port 8000"));
