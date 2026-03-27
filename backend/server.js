import express from "express";

import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);

app.listen(PORT,()=>{
  console.log(`server running on ${PORT}`);
  connectDB();
});

//connecting the database
const connectDB = async()=>{

  try{
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected with Database");
  }catch(err){
    console.log("Failed to connect with Db",err);
  }
}








// app.post("/test", async (req, res) => {
//   try {
//     const userMessage = req.body.message;

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: userMessage }]
//             }
//           ]
//         })
//       }
//     );

//     const data = await response.json();
//     console.log(data); // debug
//     const reply =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";


//       console.log(reply);
//     res.json({ reply });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Error occurred" });
//   }
// });

