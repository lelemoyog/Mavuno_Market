import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { User } from "/static/js/classes.js";
import { firebaseConfig } from "/static/js/firebaseSDK.js";

//import auth from firebase
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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



$("#signin").click(function (event) {
    //prevent the default form submission
    event.preventDefault();
    //get the email and password from the form
    var email = $("#email").val();
    var password = $("#pass").val();


    //create a user object
    const user = new User(email, password);

    //connect to firebase auth and sign in the user
    signInWithEmailAndPassword(getAuth(), email, password)
    .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        //add user to local storage
        localStorage.setItem('uid', user.uid);
        document.getElementById('error').innerHTML = 'successfully logged in';
        document.getElementById('error').style.color = 'green';
        window.location.href = "/home/";
        // ...
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        $('#spinner').removeClass('show');
        console.log(errorMessage);
        //show an error alert
        document.getElementById('error').innerHTML = errorCode;
        document.getElementById('error').style.color = 'red';

        
    });
});

      getAuth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      window.location.href = "/home/";
      console.log('User is signed in');
    } else {
      // No user is signed in.
      console.log('No user is signed in');
    }
  });

})(jQuery);