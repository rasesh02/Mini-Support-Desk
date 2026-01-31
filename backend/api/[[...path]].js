import { app } from "../src/app.js";
import connectDB from "../src/db/index.js";

let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error('DB connection error:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  
  return app(req, res);
};

export default handler;