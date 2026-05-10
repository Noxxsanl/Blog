/**
 * Seed script: tạo user admin mặc định
 * Chạy: node scripts/seed-user.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import User model
const { default: User } = await import('../src/app/models/User.js');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_edu';

await mongoose.connect(MONGODB_URI);
console.log('✓ Kết nối MongoDB thành công');

// Xóa user cũ nếu có
await User.deleteOne({ email: 'admin@blog.com' });

const user = new User({
    name: 'Admin',
    email: 'admin@blog.com',
    password: '123456',
    role: 'admin',
});

await user.save();

console.log('✓ Tạo user thành công!');
console.log('  Email   :', user.email);
console.log('  Password: 123456');
console.log('  Role    :', user.role);

await mongoose.disconnect();
process.exit(0);
