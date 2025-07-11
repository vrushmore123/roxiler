const jwt = require('jsonwebtoken');

const payload = { id: 1, email: 'test@example.com' };
const secret = 'YOUR_SECRET_KEY';

const token = jwt.sign(payload, secret, { expiresIn: '1h' });

console.log('JWT:', token);
