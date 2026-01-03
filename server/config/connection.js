import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Use the environment variable, or fall back to local if it's missing
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

mongoose.connect(connectionString);

// This specific syntax is required for ESM ("type": "module")
export default mongoose.connection;