//importing

import express from 'express';
import mongoose from 'mongoose';
import List from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';
import moment from 'moment';
import bodyParser from 'body-parser';
import path from 'path';
import logger from 'morgan';
import router from 'router'






//app config

const app=express();
var mTime=moment();
app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const port=process.env.PORT || 3000;
var increment=0;
var listInfo=List.find({});



const pusher = new Pusher({
  appId: '1069235',
  key: '78f107e3972c429b803d',
  secret: '34e7773e91ba20860d25',
  cluster: 'ap2',
  encrypted: true
});

const db=mongoose.connection;

db.once("open",function(){
  console.log("DB is connected");


const listCollection=db.collection('tasks');
const changeStream=listCollection.watch();

changeStream.on('change',function(change){
  console.log(change);
if(change.operationType == 'insert'){
  const listDetails=change.fullDocument;
  pusher.trigger('List','inserted',{
    task_name:listDetails.task_name,
    task_description:listDetails.task_description
  }
);
}else{
  console.log('Error triggering Pusher');

}

});
});


//middleware



// app.use((req,res,next) =>{
//
//   res.setHeader("Access-Control-Allow-Origin","*");
//   res.setHeader("Access-Control-Allow-Headers","*");
//   next();
// });



//DB config

const connection_url='mongodb+srv://Alok:8002098005alok@cluster0.9dgmz.mongodb.net/todoList?retryWrites=true&w=majority';
mongoose.connect(connection_url,{
  useCreateIndex:true,
  useNewUrlParser:true,
  useUnifiedTopology:true
});

function deleteOldUsers()
{
  var startTime=moment(mTime.toDate()).add(increment,"seconds").toDate();
  List.deleteMany({expired: {$lte: startTime }},(err) =>{
    if(err) return console.log("Error while errasing users " + err);
    else console.log("successfully erased data");
    console.log("I am Running");
  });
  increment++;
}

setInterval(deleteOldUsers,1000);







//api routers

app.get("/",function(req,res,next)
{

  listInfo.exec(function(err,data){
    if(err) throw err;
res.render('home',{ title:'To Do List', records:data})
});


});

app.post("/",function(req,res,next) {



doInfo.save(function(err,response){
  if(err) throw err;
  listInfo.exec(function(err,data){
    if(err) throw err;
res.render("home",{ title:'To Do List', records:data});
});
});

});

app.get("/task/sync",function(req,res){
  List.find((err,data) =>{
    if(err)
    {
      res.status(500).send(err);
    }
    else{
      res.status(200).send(data)
    }
  });
});

app.post("/task/new",function(req,res){
  var doInfo=new List({
    task_name:req.body.task_name,
    task_description:req.body.task_description,
    creator:req.body.creator,
    duration:req.body.duration,

  });

  console.log(doInfo)
  //
  // var dt=new Date();
  //
  // const dl=timeConverter(req.body.duration);
  const dbTask=doInfo




//   const obj={
//     expired: moment(dt).add(dl, "m").toDate(),
//   };
//
//
// const newTask=Object.assign(dbtask,obj);




  List.create(dbTask,function(err,data){
    if(err)
    {
      res.status(500).send(err);
    }
    else{
      res.status(201).send(data)
    }
  });
});
//

//listner

app.listen(port, function() {
  console.log("server is running at 3000");
});
