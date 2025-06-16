const express = require('express');
const fs = require('fs');
const https = require('https');
const helmet = require('helmet');
const path = require('path');

const app = express();
app.use(express.json());
app.use(helmet());

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
        },
    })
);

const renderHTML = (title, body) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${title}</title>
    <style>
      body { font-family: system-ui, sans-serif; background: #f4f4f4; margin: 0; padding: 2rem; color: #333; }
      header, main, footer { max-width: 800px; margin: auto; }
      header h1 { color: teal; margin-bottom: 0; }
      nav a { margin-right: 1rem; text-decoration: none; color: teal; }
      .card { background: #fff; padding: 1rem; margin-top: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    </style>
  </head>
  <body>
    <header>
      <h1>${title}</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/goals">Goals</a>
        <a href="/profile">Profile</a>
      </nav>
    </header>
    <main>
      ${body}
    </main>
    <footer>
      <p style="text-align:center;margin-top:2rem;font-size:0.9em;">© 2025 Daily Quest Tracker</p>
    </footer>
  </body>
  </html>
`;

// Routes
app.get('/', (req, res) => {
    res.send(renderHTML('Welcome to Daily Quest Tracker', `
    <section class="card">
      <p>Track your daily goals and level up like a hero. Every completed goal earns you XP!</p>

    </section>
  `));
});

app.get('/goals', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    const goals = [
        { id: 1, name: 'Drink 2L of water' },
        { id: 2, name: 'Stretch for 10 minutes' }
    ];
    const html = goals.map(goal => `
    <section class="card">
      <h2>${goal.name}</h2>
      <p>Goal ID: ${goal.id}</p>
      <a href="/goals/${goal.id}">View Details</a>
    </section>
  `).join('');
    res.send(renderHTML('Your Goals', html));
});

app.get('/goals/:id', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=300');
    const goal = { id: req.params.id, name: 'Drink 2L of water', xp: 10 };
    res.send(renderHTML(`Goal #${goal.id}`, `
    <section class="card">
      <h2>${goal.name}</h2>
      <p>XP: ${goal.xp}</p>
    </section>
  `));
});

app.post('/create-goal', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.status(201).json({ message: 'Goal created successfully!' });
});

app.get('/profile', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.send(renderHTML('Your Profile', `
    <section class="card">
      <h2>Player: <strong>player1</strong></h2>
      <p>Level: 5</p>
      <p>Total XP: 320</p>
    </section>
  `));
});

// HTTPS Setup
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'cert/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert/cert.pem')),
};

https.createServer(sslOptions, app).listen(3000, () => {
    console.log('Daily Quest Tracker running at https://localhost:3000');
});
