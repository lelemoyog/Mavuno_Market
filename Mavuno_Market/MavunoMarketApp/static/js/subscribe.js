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


  $(document).ready(function() {
    $('#email-inputBtn').click(function() {
        var email = $('#email-input').val();

        if (email) {
            // Create a reference to the collection where you want to add the document
            const myCollection = db.collection("Emails");

            // Prepare the data for the new document
            const newDocumentData = {
                email: email
            };

            // Add the document to the collection
            myCollection.add(newDocumentData)
                .then((docRef) => {
                    console.log("Document added with ID:", docRef.id);
                    alert('Subscription successful!');
                    // Clear the input field
                    $('#email-input').val('');
                })
                .catch((error) => {
                    console.error("Error adding document:", error);
                    alert('Error: ' + error.message);
                });
        } else {
            alert('Please enter a valid email address.');
        }
    });
});
});