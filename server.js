
var express = require('express');
var app = express();
var serverIndex = require('serve-index');
var http = require('http');
var bodyParser = require("body-parser");
// var socketIO = require('socket.io');
// var io = require('socket.io')(http);
var path = require('path');
// var server = http.createServer(app).listen(8080);
var port = process.env.PORT || 3000;
var server = http.createServer(app).listen(port);

var fs = require('fs');
var io = require('socket.io')(server);
var cookieParser = require('cookie-parser');
const {spawn} = require('child_process');
let {PythonShell} = require('python-shell')

var mongoose = require('mongoose');
var mongodb = require('mongodb');
var generator = require('mongoose-gen');
const {OAuth2Client} = require('google-auth-library');
var io = require('socket.io')(server);
// const expressStatusMonitor = require('express-status-monitor');
// app.use(expressStatusMonitor({
//   websocket: io,
//   port: app.get('port')
// }));




mongoose.connect('mongodb://root:root12@ds050559.mlab.com:50559/240project',{  useNewUrlParser: true });

//Google Client ID
var CLIENT_ID = '1010765927944-ecgak7pup964bph4q3ej3kn018455et7.apps.googleusercontent.com'


var db = mongoose.connection;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());



/*********************************************************
** SCHEMA
** STUFF
*********************************************************/
var Schema = mongoose.Schema;
// instantiate the constructor

/*
** User Schema
*/
var userSchema= new Schema({
  username:{type: String},
  id_token:{type: String}, //only save ID token, full ID is unsafe
  imgurl:{type: String},
  email:{type: String, unique: true},
  userType: {type: String}
});

var classSchema= new Schema({
  name:{type: String, unique: true},
  // lessons: [{
  //   lessonName: {type: String}
  //   // lessonName: {type: String,ref: 'Lesson'}
  // }]
  lessons: {
    type: Array,
          default: []
    // lessonName: {type: String,ref: 'Lesson'}
  }

});

var lessonSchema= new Schema({
  name:{type: String},
  // className:{type: String},
  className:{type: String , ref: 'Class'},
  url: {type: String},
  chat: {
    type: Array,
          default: []
    // lessonName: {type: String,ref: 'Lesson'}
  }
});


// create a new model
var User = mongoose.model('User', userSchema);
var Class = mongoose.model('Class', classSchema);
var Lesson = mongoose.model('Lesson', lessonSchema);
/*
** On Database Connection
*/
db.once('open', function(){
console.log('DB Connection Success');
});


/***********************************************************
** POSTS & GETS
** STUFF
***********************************************************/
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm','html'],
  index: "index.html"
}

app.use('/', function(req,res,next){
  console.log(req.method, 'request:', req.url, JSON.stringify(req.body));
  next();
});

app.use('/', express.static('./', options));



/*******************************************************
** User Sign In
********************************************************/
app.post('/signin', function(req,res,next){
  var userName = req.body.name;
  console.log("Trying to sign in ",userName);
  //get user log in information
  var id_token = req.body.id_token;
  var email = req.body.email;
  var imgurl = req.body.imgurl;
  // var usertype = req.body.userType;

//Verify login Information with Google Again
const client = new OAuth2Client(CLIENT_ID);
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
}
verify().catch(console.error);

//Search Database if user exists, if not add user to DB
  var query = { 'email':email};

  User.findOneAndUpdate(query, { username: userName, imgurl: imgurl, id_token: id_token },
         {upsert:true, new: true}, function(err, doc){
        if (err)
          console.log(err);
        else{
          console.log(doc.username, " successfully logged in!");
          //save user information to cookies in order to use later
          res.cookie('username' , doc.username);
          res.cookie('imgurl' , doc.imgurl);
          res.cookie('email' , doc.email);
          // res.cookie('usertype' , doc.userType);
          //send user to next page
          res.send({url:'./unknownLogIn.html'})

          // if(usertype == 'teacher'){
          //   res.send({url:'./loggedin.html'})
          // }
          // else if(usertype == 'student'){
          //   res.send({url:'./studentLoggedin.html'})
          // }
        }
      });
  });

  /*******************************************************
  ** User Type
  ********************************************************/
  app.post('/userType', function(req,res,next){
    var userName = req.body.name;
    console.log("Trying to set user type of ",userName);
    //get user log in information
    var id_token = req.body.id_token;
    var email = req.body.email;
    var imgurl = req.body.imgurl;
    var usertype = req.body.userType;

  //Search Database if user exists, if not add user to DB
    var query = { 'email':email};

    User.findOneAndUpdate(query, { username: userName, imgurl: imgurl, id_token: id_token, userType: usertype },
           {upsert:true, new: true}, function(err, doc){
          if (err)
            console.log(err);
          else{
            console.log(doc.username, " updated type!");
            res.cookie('usertype' , doc.userType);
            if(usertype == 'teacher'){
              res.send({url:'./loggedin.html'})
            }
            else if(usertype == 'student'){
              res.send({url:'./studentLoggedin.html'})
            }
          }
        });
    });

/*******************************************************
** CREATE LESSON
********************************************************/
app.post('/createLesson', function(req,res,next){
  var userName = req.body.name;
  console.log("Creating Lesson from ",userName);
  //get user log in information
  var id_token = req.body.id_token;
  var email = req.body.email;
  var imgurl = req.body.imgurl;
  // var usertype = req.body.userType;
  var classN = req.body.classN;
  var lesson = req.body.lesson;
  var url = req.body.url;


  var query = { 'name':classN};

  Class.findOneAndUpdate(query, { name: classN, $push: {lessons: lesson} },
    // $push: {lessons: [{lessonName: lesson}]}
         {upsert:true, new: true}, function(err, doc){
        if (err)
          console.log(err);
        else{
          console.log(doc.name, " Class Created/Updated!");
          res.cookie('classN' , doc.name);
          res.cookie('lesson' , lesson);
          res.cookie('url' , url);

          var query = { 'name': lesson, 'className': classN};
          Lesson.findOneAndUpdate(query, { name: lesson, className: classN, url: url },
                 {upsert:true, new: true}, function(err, doc){
                if (err)
                  console.log(err);
                else{
                  console.log(doc.name, " Lesson Created/Updated!");

                  res.cookie('lessonID', String(doc._id))
                    res.send({url:'./lesson.html'})

                }
              });

        }
      });
  });

  /*******************************************************
  ** Get Classes
  ********************************************************/
  app.get('/getClasses', function(req,res,next){

    console.log("Trying to fetch Classes ");
    Class.find({}, function(err, classes) {
        // var classMap = {};
        var classMap = [];

        classes.forEach(function(c) {
          classMap.push(c.name)

        });

        res.send(classMap);
    });
    //save stock user selected as a cookie
    // res.cookie('stock' , stock);
    //send to next page
    // res.send({url:'./getstock.html'})
    });


    /*******************************************************
    ** Get Lessons
    ********************************************************/
    app.post('/getLessons', function(req,res,next){

      console.log("Trying to fetch Lessons for ", req.body.className);
      var name = req.body.className
      // name = name.replace(/\s/g, '')
      var query = {'name': req.body.className};
      Class.findOne(query, function(err, classes) {
        if (err)
          console.log(err);
          // var classMap = {};
          // var classMap = [];
          //
          // classes.forEach(function(c) {
          //   classMap.push(c.name)
          //
          // });
          if(!classes){
            console.log('no class found')
        }
          if(classes){
            console.log('classes: ', classes)

            res.cookie('class' , req.body.className);
            res.send(classes.lessons);
        }
      });
      //save stock user selected as a cookie
      // res.cookie('stock' , stock);
      //send to next page
      // res.send({url:'./getstock.html'})
      });

/*******************************************************
** FETCH LESSON
********************************************************/
app.post('/fetchLesson', function(req,res,next){
  var classN = req.body.classN;
  var lesson = req.body.lesson;
  console.log("Trying to fetch lesson: ", lesson, ' from ', classN);

  var query = { 'name': lesson, 'className': classN};
  Lesson.findOne(query, function(err, classes) {
    if (err)
      console.log(err);
      // });
      if(!classes){
        console.log('no LESSON found')
    }
      if(classes){
        res.cookie('lesson' , lesson);
        res.cookie('url' , classes.url);
        console.log('class id cookie is: ', String(classes._id))
        res.cookie('lessonID', String(classes._id))
        //send to next page

        res.send({url:'./lesson.html'});
    }

  });
});

/*
** On Socket Connection
*/
io.on('connection', function(socket){
  console.log('new connection', socket.id);
  // clients++;
  // console.log('Clients now at', clients);

  socket.on('join', function(data){
    var count=0;
    console.log(data.lessonID, "is the lesson ID socket is trying to join");
    // socket.join(data.lessonID);

    var query = { '_id': data.lessonID};
    Lesson.findOne(query, function(err, classes) {
      if (err)
        console.log(err);
        // });
        if(!classes){
          console.log('no LESSON found')
      }
        if(classes){
          console.log(data.lessonID, "is the lesson ID socket joined");
          console.log(classes.chat)
          socket.join(data.lessonID);
          socket.emit('getChat', {lessonID: data.lessonID, chat: classes.chat} ) ;
          // res.cookie('lesson' , lesson);
          // res.cookie('url' , classes.url);
          // res.cookie('lessonID', classes._id)
          //send to next page

          // res.send({url:'./lesson.html'});
      }

    });


  });

  /*
  ** On Chat Send Message
  */
  socket.on('sendMessage', function(data){
      //Broadcast to all sockets in room
    // wss.sockets.in(data.gameID).emit('messageSent', data);
    var classN = data.classN;
    var lesson = data.lessonID;
    var user = data.userName;

  var update = '<p><strong>' + data.userName +
  ":  </strong>"+ data.message +'</p>'

    var query = { '_id': data.lessonID};
    Lesson.findOneAndUpdate(query, { $push: {chat: update} } ,
           {upsert:true, new: true}, function(err, doc){
          if (err)
            console.log(err);
          else{
            console.log(" Chat DB Updated!");

            // res.cookie('lessonID', doc._id)
              // res.send({url:'./lesson.html'})
              io.sockets.in(data.lessonID).emit('messageSent', data);
          }
        });



    });








  });
