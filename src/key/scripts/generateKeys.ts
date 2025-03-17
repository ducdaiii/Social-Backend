import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// Tạo cặp khóa RSA 4096-bit
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
  },
});

// Định nghĩa đường dẫn thư mục chứa keys
const keysDir = path.join(__dirname, '../keys');
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir);
}

// Lưu file
fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey);
fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey);

console.log('✅ Private key và Public key đã được tạo trong thư mục "keys/"');