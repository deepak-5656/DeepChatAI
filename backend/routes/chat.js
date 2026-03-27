
import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/open.js";


const router = express.Router();

//test
router.post("/test", async(req,res)=>{
    try{
        const thread = new Thread({
            threadId: "xyz",
            title:"Testing new Thread"
        });
        const response = await thread.save();
        res.send(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to save in db"});
    }
});


// Get all threads 
router.get("/thread",async(req,res)=>{
    try{
        const threads = await Thread.find({}).sort({updatedAt:-1});
        // most recent chats should get at on top
        res.json(threads);

    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to fetch threads"});
    }
});

// send information of that selected thread to see all messages
router.get("/thread/:threadId",async(req,res)=>{
    const {threadId} = req.params;

    try{
       const thread = await Thread.findOne({threadId});

       if(!thread){
        res.status(404).json({error:"Thread is not found"});
       }

       res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to fetch chat"});
    }
});

//to delete the thread creating the route for that
router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId} = req.params;

    try{
        const deletedthread = await Thread.findOneAndDelete({threadId});

        if(!deletedthread){
            res.status(404).json({error:"Thread is not found"});
        }

         res.status(200).json({success:"Thread deleted successfully"});

    }catch(err){
        console.log(err);
        res.status(500).json({error:"failed to delete thread"});
    }
});


// crate chat route

router.post("/chat",async(req,res)=>{

    const {threadId,message} = req.body;

    if(!threadId||!message){
        res.status(400).json({error:"missing required fields"});
    }
   
    try{
      let  thread = await Thread.findOne({threadId});


      if(!thread){
        thread = new Thread({
            threadId,
            title:message,
            messages: [{role:"user",content:message}]
        });
      }else{
        thread.messages.push({role:"user",content:message});
      }

      const assistantReply = await getGeminiResponse(message);
      thread.messages.push({role:"assistant",content:assistantReply});


     thread.updatedAt = new Date();
      await thread.save();
      res.json({reply:assistantReply});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "somthing went wrong"});
       
    }
});





export default router;

