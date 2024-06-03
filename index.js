const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
// const session = require('express-session');

// Initialize Express app
const app = express();

// Connect to MongoDB databases
// mongoose.connect('mongodb://0.0.0.0:27017/pranavi', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected '))
//     .catch(err => console.error('MongoDB connection error:', err));

const loginDb = mongoose.createConnection('mongodb://0.0.0.0:27017/pranavi', { useNewUrlParser: true, useUnifiedTopology: true });
loginDb.on('connected', () => console.log('MongoDB connected '));
loginDb.on('error', (err) => console.error('MongoDB connection error:', err));

// // Connect to GoTrip database for bookings
// const bookingDb = mongoose.createConnection('mongodb://0.0.0.0:27017/GoTrip', { useNewUrlParser: true, useUnifiedTopology: true });
// bookingDb.on('connected', () => console.log('MongoDB connected to GoTrip'));
// bookingDb.on('error', (err) => console.error('MongoDB connection error:', err));

// Define MongoDB schemas
// const FormDataSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     message: { type: String, required: true }
// });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// const indexbookingSchema = new mongoose.Schema({
//     destination: { type: String, required: true },
//     date: { type: Date, required: true }
// });


// Create MongoDB models
// const FormData = mongoose.model('FormData', FormDataSchema);
const User = loginDb.model('User', UserSchema, 'form');
//const Booking = bookingDb.model('Booking', BookingSchema, 'BookYourTrip');
// const indexBook = bookingDb.model('indexBook', indexbookingSchema, 'indexBook');

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use sessions to track logins
// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 18 * 60 * 60 * 1000 // 18 hours in milliseconds
//     }
// }));

// Serve static files
app.use(express.static(path.join(__dirname, 'components')));

// Routes to serve HTML pages



app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'components', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'components', 'signup.html'));
});

// Middleware to check if user is logged in
// function isLoggedIn(req, res, next) {
//     if (req.session.userId) {
//         return next();
//     }
//     res.redirect('/login');
// }

// Route to handle form submissions for the "About Us" form
// app.post('/submit', async (req, res) => {
//     try {
//         const formData = new FormData(req.body);
//         await formData.save();
//         res.status(201).send('Form data saved successfully');
//     } catch (err) {
//         console.error('Error saving form data:', err);
//         res.status(500).send('Internal server error');
//     }
// });

// Route to handle registration form submissions
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;

        if (password !== confirm_password) {
            return res.status(400).send('Passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.redirect('/'); // Redirect to the home page after successful registration
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Internal server error');
    }
});

// Route to handle login form submissions
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        req.session.userId = user._id; // Set the session userId
        res.redirect('/'); // Redirect to the home page after successful login
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Internal server error');
    }
});

// Route to handle booking submissions



// // Route to handle logout
// app.post('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             return res.status(500).send('Failed to log out');
//         }
//         res.redirect('/login');
//     });
// });

// Start the server
const PORT = process.env.PORT || 3090;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const app = express();
// const port = 3090;

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // MongoDB connection
// mongoose.connect('mongodb://0.0.0.0:27017/GoTrip', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch(err => {
//     console.error('Could not connect to MongoDB', err);
// });

// // Define schemas and models
// const contactSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     message: String
// });

// const bookingSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     phone: String,
//     passengers: Number,
//     seniors: Number,
//     destination: String,
//     days: Number,
//     comments: String
// });

// const paymentSchema = new mongoose.Schema({
//     cardNumber: String,
//     expirationDate: String,
//     cvv: String,
//     cardHolderName: String
// });

// const userSchema = new mongoose.Schema({
//     email: String,
//     password: String
// });

// const Contact = mongoose.model('Contact', contactSchema);
// const Booking = mongoose.model('Booking', bookingSchema);
// const Payment = mongoose.model('Payment', paymentSchema);
// const User = mongoose.model('User', userSchema);

// // Routes
// app.post('/submit', (req, res) => {
//     const newContact = new Contact(req.body);
//     newContact.save().then(() => res.status(200).send('Form submitted successfully'))
//         .catch(err => res.status(500).send('Error submitting form'));
// });

// app.post('/book', (req, res) => {
//     const newBooking = new Booking(req.body);
//     newBooking.save().then(() => res.status(200).send('Booking submitted successfully'))
//         .catch(err => res.status(500).send('Error submitting booking'));
// });

// app.post('/pay', (req, res) => {
//     const newPayment = new Payment(req.body);
//     newPayment.save().then(() => res.status(200).send('Payment submitted successfully'))
//         .catch(err => res.status(500).send('Error submitting payment'));
// });

// app.post('/register', (req, res) => {
//     const newUser = new User(req.body);
//     newUser.save().then(() => res.status(200).send('User registered successfully'))
//         .catch(err => res.status(500).send('Error registering user'));
// });

// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     User.findOne({ email, password }, (err, user) => {
//         if (err || !user) {
//             return res.status(400).send('Invalid email or password');
//         }
//         res.status(200).send('Login successful');
//     });
// });

// // Start server
// app.listen(port, () => {
//     console.log(Server running at http://localhost:${port}/);
// });
