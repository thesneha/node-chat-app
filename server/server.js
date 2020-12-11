const path =require('path');
const express=require('express');

const publicPath=path.join(__dirname,'..','public');
console.log(publicPath);

const port =process.env.PORT||3000

const app=express();
app.listen(port,()=>{
  console.log(`app is running on port ${port}`);
})


app.use(express.static(publicPath));
