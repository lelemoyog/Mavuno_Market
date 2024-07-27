import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, setDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { User, } from "/static/js/classes.js";
import { firebaseConfig } from "/static/js/firebaseSDK.js";

//import auth from firebase
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

(function ($) {
  "use strict";
  // Import the functions you need from the SDKs you need

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const analytics = getAnalytics(app);


  //to give you context this is the signup.js file that is used to handle the signup form
  //create a function that will be called when the user submits the signup form, it should connect to firebase auth and create an object tha will store the user info in fibase firestore database


  function showSuccessAlert() {

    //hide #signup1 and show #signup2 get document element by id using jquery on document ready
    $('#signup1').hide().css('right', '1000px').fadeOut(2000).animate({ left: '0' }, 800);
    $('#signup2').hide().css('right', '1000px').fadeIn(2000).animate({ left: '0' }, 800);
  }
  function showSuccessAlert2() {
    signup();
    // //hide #signup1 and show #signup2 get document element by id using jquery on document ready
    // $('#signup2').hide().css('right', '1000px').fadeOut(2000).animate({ left: '0' }, 800);
    // $('#signup3').hide().css('right', '1000px').fadeIn(2000).animate({ left: '0' }, 800);
  }

  function showSuccessAlert3() {

    //hide #signup1 and show #signup2 get document element by id using jquery on document ready
    $('#signup2').hide().css('right', '1000px').fadeOut(2000).animate({ left: '0' }, 800);
    $('#signup1').hide().css('right', '1000px').fadeIn(2000).animate({ left: '0' }, 800);
  }



  $('#next').click(function () {
    showSuccessAlert2();
  });

  $('#previous').click(function () {
    showSuccessAlert3();
  });



  function signup() {
    //get the user info
    var email = $('#email').val();
    var password = $('#pass').val();
    var name = $('#name').val();

    //create the user
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        //save the user info to the database
        //add user id to local storage
        localStorage.setItem('uid', user.uid);
        saveUser(user.uid, name, email);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        $('#spinner').removeClass('show');
        console.log(errorMessage);
        //show an error alert
        document.getElementById('error').innerHTML = errorCode;
        document.getElementById('error').style.color = 'red';

        $('#signup2').hide().css('right', '1000px').fadeOut(2000).animate({ left: '0' }, 800);
        $('#signup1').hide().css('right', '1000px').fadeIn(2000).animate({ left: '0' }, 800);

      });
  }

  function saveUser(uid, name, email) {
    //save the user info to the database
    // ...
    var accesslevel = $('#account').val();
    var location = $('#location').val();
    var phone = $('#phone').val();
    var imgUrl = "";
    const user = new User(uid, name, email, accesslevel, location, about, imgUrl, phone);


    //conver to plain js object
    const userObj = {
      uid: user.uid,
      name: user.name,
      email: user.email,
      accesslevel: user.accesslevel,
      location: user.location,
      about: user.about,
      imgUrl: user.imgUrl,
      phone: user.phone,
      rating: "0",
    };

    var docRef = doc(db, "users", user.uid);

    setDoc(docRef, userObj).then((docRef) => {
        // showSuccessAlert();
        document.getElementById('error').innerHTML = 'User created successfully';
        document.getElementById('error').style.color = 'green';
        $('#spinner').removeClass('show');

        $("#myAlert").fadeTo(2000, 500).slideUp(500, function () {
          $("#myAlert").slideUp(500);
        });

        window.location.href = "/signin/"  //redirect to the signin page
        console.log("Document written with ID: ", docRef.id);

        //trigger bootstrap alert

        //show a success alert

      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

  }
  $("#myAlert").hide();

  //create an event listener for the signup form
  document.getElementById('signup').addEventListener('click', function (event) {


    $('#spinner').addClass('show');
    //prevent the default form submission
    event.preventDefault();
    //check if the pass and re_pass match
    var email = document.getElementById('email').value;
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;
    var pass = document.getElementById('pass').value;
    var re_pass = document.getElementById('re_pass').value;

    // check if the email is valid and if the password is at least 6 characters and no field is empty
    if (email == "" || pass == "" || name == "") {
      document.getElementById('error').innerHTML = 'All fields are required';
      document.getElementById('error').style.color = 'red';
      $('#spinner').removeClass('show');
      return;
    }

    if (pass != re_pass) {
      document.getElementById('error').innerHTML = 'Passwords do not match';
      document.getElementById('error').style.color = 'red';
      $('#spinner').removeClass('show');
      return;
    }
    $('#spinner').removeClass('show');
    //call the signup function
    console.log(name)
    showSuccessAlert();
  });


  var about = ""; // Declare and initialize the 'about' variable

  $("#vendor").click(function () {
    var accountType = "vendor";
    about = "I am a vendor at Mavuno Market";
    $('#account').val(accountType);
    $('#vendor').css('background-color', 'lightgray');
    $('#farmer').css('background-color', 'white');
  });

  $("#farmer").click(function () {
    var accountType = "farmer";
    about = "I am a farmer at Mavuno Market";
    $('#account').val(accountType);
    $('#farmer').css('background-color', 'lightgray');
    $('#vendor').css('background-color', 'white');
  });

})(jQuery);