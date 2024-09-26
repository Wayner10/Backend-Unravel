require('dotenv').config();
const { Client } = require('pg');
const crypto = require('crypto');

console.log('ENCRYPTION_KEY:', process.env.ENCRYPTION_KEY);
console.log('ENCRYPTION_IV:', process.env.ENCRYPTION_IV);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

// Función para cifrar la contraseña
function encrypt(text) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return { iv: iv.toString('hex'), encryptedData: encrypted };
}

// Cifrar la contraseña
const encryptedPassword = encrypt(process.env.DB_PASSWORD);

// Desencriptar la contraseña (si es necesario)
function decrypt(text) {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = Buffer.from(text.iv, 'hex');

  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(text.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Ejemplo de uso de la contraseña desencriptada
const decryptedPassword = decrypt(encryptedPassword);

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "db_unravel",
  password: decryptedPassword,
  port: 5432, // El puerto por defecto de PostgreSQL
});

client.connect()
  .then(() => console.log('Connecting to the database'))
  .catch(err => console.error('Error connecting to database', err.stack));

module.exports = client;
