const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = 2000;

// MongoDB Connection
mongoose.connect('mongodb+srv://vermaprateek0026:prateekverma@gymcluster.j8fm81z.mongodb.net/?retryWrites=true&w=majority&appName=GymCluster', {})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure views directory is set correctly
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true,
}));

// Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Redirect to index.html
  } else {
    res.render('home');
  }
});

app.get('/loading', (req, res) => {
  res.render('loading'); // This will render loading.ejs
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { name, email, mobile, password, age, gender } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, mobile, password: hashedPassword, age, gender });
  await newUser.save();
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    res.redirect('/');  // Redirects to index.html instead of dashboard.ejs
  } else {
    res.send("<script>alert('Invalid Credentials!'); window.location.href='/login';</script>");
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
