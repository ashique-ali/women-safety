const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/blogApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB error:', err));

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    password: { type: String, required: true },
    emergencyNo: String,
    emergencyEmail: String,
    pincode: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const loginSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true })

// user rRegister 
app.post('/api/register', async (req, res) => {
    try {
        console.log("Hello Register");
        const { fullName, email, phone, password, emergencyNo, emergencyEmail, pincode } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Full Name, Email, and Password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            phone,
            password: hashedPassword,
            emergencyNo,
            emergencyEmail,
            pincode
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

// userLogin
app.post('/api/login', async (req, res) => {
    try {
        console.log("Hello Login");
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and Password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Send only email and password (hashed)
        res.status(200).json({
            message: 'Login successful',
            user: {
                email: user.email,
                password: user.password
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
