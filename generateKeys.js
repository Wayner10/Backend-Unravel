const crypto = require('crypto');

// Generar clave de cifrado
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('ENCRYPTION_KEY=' + encryptionKey);

// Generar vector de inicialización
const iv = crypto.randomBytes(16).toString('hex');
console.log('ENCRYPTION_IV=' + iv);