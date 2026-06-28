import mongoose from 'mongoose'

const connection = {}

export const connectToDb = async () => {
  try {
    console.log("Connecting...");

    if (connection.isConnected) {
      console.log("Already connected");
      return;
    }

    console.log(process.env.MONGO); // temporarily

    const db = await mongoose.connect(process.env.MONGO);

    console.log("Connected!");

    connection.isConnected = db.connections[0].readyState;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
