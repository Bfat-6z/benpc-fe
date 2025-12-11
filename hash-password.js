// Script để hash mật khẩu bằng BCrypt
// Chạy: node hash-password.js

const bcrypt = require('bcrypt');

// Mật khẩu cần hash
const passwords = ['123456', 'pass123', 'pass456'];

console.log('Hashing passwords...\n');

passwords.forEach(password => {
  // Hash với 10 rounds (giống Spring Security mặc định)
  const hashed = bcrypt.hashSync(password, 10);
  console.log(`Password: ${password}`);
  console.log(`Hashed:   ${hashed}\n`);
});

// Hash cho admin
const adminPassword = '123456';
const adminHashed = bcrypt.hashSync(adminPassword, 10);
console.log('=== ADMIN PASSWORD ===');
console.log(`Password: ${adminPassword}`);
console.log(`Hashed:   ${adminHashed}`);

