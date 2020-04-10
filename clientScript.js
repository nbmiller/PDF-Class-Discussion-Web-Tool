
// var URL = "http://localhost:8080"
// var URL = 'http://24.207.30.121:3000'
// var URL = 'http://host-24-207-30-121.public.eastlink.ca:3000'
var URL = 'https://class-pdf-discussion-tool.herokuapp.com:3000'

/*********************************************************
**  GOOGLE SIGN IN
**********************************************************/
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId());
  // Do not send to backend! Use an ID token
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
   // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;
  var name = profile.getName()
  var imgurl = profile.getImageUrl()
  var email = profile.getEmail()
  // var usertype = document.getElementById('userType').value
//send sign in post to server

// gapi.auth2.getAuthInstance().disconnect().then(function () {

      //Do stuff here after the user has been signed out, you can still authenticate the token with Google on the server side


  $.ajax({
        type: 'POST',
        url: URL + '/signin',
        data: { id_token: id_token, name: name, imgurl: imgurl, email:email },
        dataType: 'json',
        async: true,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert("some error");
        },
        success: function (data) {
          console.log("Sign in Success!")
          console.log(data)
          //redirect page to given URL
          window.location.assign(data.url);
        }
      });
    // }
}

/*********************************************************
** SEND USER TYPE
**********************************************************/
function sendUserType() {

  var user = getCookie('username')
  var imgurl = getCookie('imgurl')
  var email = getCookie('email')
  var usertype = document.getElementById('userType').value
//send sign in post to server



      //Do stuff here after the user has been signed out, you can still authenticate the token with Google on the server side

  $.ajax({
        type: 'POST',
        url: URL + '/userType',
        data: { name: user, imgurl: imgurl, email:email, userType: usertype },
        dataType: 'json',
        async: true,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert("some error");
        },
        success: function (data) {
          console.log("Sign in Success!")
          console.log(data)
          //redirect page to given URL
          window.location.assign(data.url);
        }
      });

}

function studentStuff(){
  getUser();
  getClasses();
}

/*********************************************************
** GET CLASSES
**********************************************************/
function getClasses() {

  // var user = getCookie('username')
  // var imgurl = getCookie('imgurl')
  // var email = getCookie('email')
  // var usertype = document.getElementById('userType').value
//send sign in post to server



      //Do stuff here after the user has been signed out, you can still authenticate the token with Google on the server side

  $.ajax({
        type: 'GET',
        url: URL + '/getClasses',
        // data: { name: user, imgurl: imgurl, email:email, userType: usertype },
        // dataType: 'json',
        async: true,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert("some error");
        },
        success: function (data) {

          console.log("Classes:")
          console.log(data)
          var select = document.getElementById("class");

          data.forEach(function(c) {
            var option = document.createElement("option");
            option.text = c;
            option.value = c;
            select.appendChild(option);
          });

        }
      });

}

/*********************************************************
** GET LESSONS
**********************************************************/
function getLessons() {

  // var user = getCookie('username')
  // var imgurl = getCookie('imgurl')
  // var email = getCookie('email')
  var className = document.getElementById('class').value
  console.log('class name selected is ', className)
//send sign in post to server
  var middle = document.getElementById('middle')


      //Do stuff here after the user has been signed out, you can still authenticate the token with Google on the server side

  $.ajax({
        type: 'POST',
        url: URL + '/getLessons',
        data: { className: className },
        dataType: 'json',
        async: true,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert("some error");
        },
        success: function (data) {

          console.log("Lessons:")
          console.log(data)

          var select = document.createElement("select");
          select.id = 'lesson'

          data.forEach(function(c) {
            var option = document.createElement("option");
            option.text = c;
            option.value = c;
            select.appendChild(option);
          });
          middle.innerHTML = 'Lesson Names For: ' + className + '<br>';
          middle.appendChild(select);
          var button = document.createElement("button");

          // button.setAttribute("value", 'Submit')
          button.innerHTML = 'Submit'

          middle.appendChild(button);
          // button.setAttribute("onclick", fetchLesson)
          button.onclick = fetchLesson

        }
      });

}

/*********************************************************
**FETCH LESSON
**********************************************************/
function fetchLesson() {

  var classN = getCookie('class')
  console.log('class cookie: ', classN)
  // var imgurl = getCookie('imgurl')
  // var email = getCookie('email')
  // var classN = document.getElementById('classN').value
  var lesson = document.getElementById('lesson').value
  // var url = document.getElementById('url').value

  // var url = formatPDF(url)
//send sign in post to server

      //Do stuff here after the user has been signed out, you can still authenticate the token with Google on the server side

  $.ajax({
        type: 'POST',
        url: URL + '/fetchLesson',
        data: { classN: classN, lesson: lesson},
        dataType: 'json',
        async: true,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert("some error");
        },
        success: function (data) {
          console.log("Lesson Fetched!")
          console.log(data)
          //redirect page to given URL
          window.location.assign(data.url);
        }
      });

}
/*********************************************************
**CREATE LESSON
**********************************************************/
function createLesson() {

  var user = getCookie('username')
  var imgurl = getCookie('imgurl')
  var email = getCookie('email')
  var classN = document.getElementById('classN').value
  var lesson = document.getElementById('lessonN').value
  var url = document.getElementById('url').value

  var url = formatPDF(url)
//send sign in post to server

      //Do stuff here after the user has been signed out, you can still authenticate the token with Google on the server side

  $.ajax({
        type: 'POST',
        url: URL + '/createLesson',
        data: { name: user, imgurl: imgurl, email:email, classN: classN, lesson: lesson, url: url},
        dataType: 'json',
        async: true,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
           alert("some error");
        },
        success: function (data) {
          console.log("Sign in Success!")
          console.log(data)
          //redirect page to given URL
          window.location.assign(data.url);
        }
      });

}

/*********************************************************
** DISPLAY USERNAME AND PROFILE PIC
**********************************************************/
function getUser(){
  var user = getCookie('username')
  var imgu = getCookie('imgurl')
  var stock = getCookie('stock')
  var middletop = document.getElementById('middletop')

  middletop.innerHTML = 'Welcome ' + user + '!'

  var img = document.createElement("img");
  img.src = imgu
  img.width = 25
  img.height = 25
  img.style.paddingLeft = '5px'
  img.className= 'help'
  middletop.appendChild(img);
}

/*********************************************************
** RETRIEVE COOKIE OF NAME GIVEN IN PARAMS
**********************************************************/
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


/*********************************************************
** FORMAT PDF
**********************************************************/

function formatPDF() {
  var input = document.getElementById('url').value
if(input.includes('view?usp=sharing') == true){
  input = input.replace('view?usp=sharing','preview')
}
else{
  input = input + '/preview'
}
if(input.includes('open?id=') == true){
  input = input.replace('open?id=','file/d/')
}
console.log(input)

return input

  }



/*********************************************************
** PREVIEW PDF
**********************************************************/

function showPDF() {
  var input = getCookie('url')

              $('#embdLink').attr('src', input)

  }



/*********************************************************
** RUN USER AND COMPANY INFO FUNCTIONS
**********************************************************/
function completeActions(){
  getUser();
  showPDF();
  joinRoom();
  // getCompany();
}


// var socket = io.connect(window.location.protocol + '//' + window.location.hostname);
var socket = io(URL);
// var socket = io();

// var socket = io(URL, {transports: ['websocket']});
// let socket = io.connect(window.location.href);
// var socket = io.connect(URL);
// var socket = io.connect(URL, {
//       transports: ['polling']
//    });

// io.origins((origin, callback) => {
//      if (origin !== URL) {
//          return callback('origin not allowed', false);
//      }
//     callback(null, true);
// });


function joinRoom(){
  var lesson = getCookie('lessonID')
  socket.emit('join', {lessonID: lesson} ) ;
}

/*
** On Socket Message Sent
**/
socket.on('getChat', function(data){
  console.log(data.chat)
  if (data.chat != undefined || data.chat != 0){
    data.chat.forEach((item, i) => {
      var isScrolledToBottom = output.scrollHeight - output.clientHeight <= output.scrollTop + 1;
        output.innerHTML +=  item
        //empty message text field
        var message = document.getElementById('message').value ="";

        // allow 1px inaccuracy by adding 1

        if(isScrolledToBottom)
            output.scrollTop = output.scrollHeight - output.clientHeight;
    });
  }



});

/*
** Send Message To Other Player
******************************************************************************
**/

var input = document.getElementById("message");
// if(input != null){
  // Execute a function when the user releases a key on the keyboard
  input.addEventListener("keyup", function(event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      document.getElementById("send").click();
    }
  });
// }

function sendMsg(){
  var classN = getCookie('classN')
  var lesson = getCookie('lesson')
    var usern =  getCookie('username')
    var lessonID = getCookie('lessonID')
    var message = document.getElementById('message').value;
    var anon = document.getElementById('anon');
    // var output = document.getElementById('output');
    if(message !==""){
      if(anon.checked == true){
        socket.emit('sendMessage', {classN: classN,userName: 'Anonymous', lessonID: lessonID,
          message: message});
          // anon = ''
      }
      else{
        socket.emit('sendMessage', {classN: classN,userName: usern, lessonID: lessonID,
          message: message});
      }
      // var gameID = getGameID();

    }
}



/*
** On Socket Message Sent
**/
socket.on('messageSent', function(data){


  var isScrolledToBottom = output.scrollHeight - output.clientHeight <= output.scrollTop + 1;
    output.innerHTML += '<p><strong>' + data.userName +
    ":  </strong>"+ data.message +'</p>'
    //empty message text field
    var message = document.getElementById('message').value ="";

    // allow 1px inaccuracy by adding 1

    if(isScrolledToBottom)
        output.scrollTop = output.scrollHeight - output.clientHeight;
});
