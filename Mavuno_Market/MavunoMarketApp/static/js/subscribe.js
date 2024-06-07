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



  $('#email-inputBtn').click(function (){
    const app = initializeApp(firebaseConfig);

    // Get a reference to the Firestore database
    const db = getFirestore(app);

    var email = $('email-input').val();
    
    // Create a reference to the collection where you want to add the document
    const myCollection = collection(db, "Emails");
    
    // Prepare the data for the new document
    const newDocumentData = {
      id: email
     
    };
    
    // Add the document to the collection
    addDoc(myCollection, newDocumentData)
      .then((docRef) => {
        console.log("Document added with ID:", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document:", error);
      }); 

  });


})(jQuery);