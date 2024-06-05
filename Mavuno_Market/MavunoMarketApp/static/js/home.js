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

  $("#profile").click(function (event) {

  getAuth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log('User is signed in');
      window.location.href = "/profile/";
    } else {
      // No user is signed in.
      window.location.href = "/signin/";
      console.log('No user is signed in');
    }
  });

});

$("#logOut").click(function (event) {
  getAuth().signOut().then(() => {
    // Sign-out successful.
    console.log('Sign-out successful');
    window.location.href = "/signin/";
  }).catch((error) => {
    // An error happened.
    console.log('An error happened');
  });
});

})(jQuery);