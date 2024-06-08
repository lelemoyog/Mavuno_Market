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


  //get document using the id from the local storage

    $("document").ready(function () {
        var id = localStorage.getItem('productId');
        console.log(id);
        //get the document
        const productDoc = doc(db, "products", id);
        //get the product document
        getDoc(productDoc).then(docSnap => {
            let product = docSnap.data();
            console.log(product);
            //display the product info in the description page
            $('#productName').text(product.name);
            $('#productPrice').text(product.price);
            $('#productCategory').text(product.category);
            $('#productDescription').text(product.description);
            $('#productImage').attr('src', product.imgUrl);
            var uid = product.sellerId;
            getUser(uid)
        });
    });

//get user

    function getUser(uid){
        const userDoc = doc(db, "users", uid);
        getDoc(userDoc).then(docSnap => {
            let user = docSnap.data();
            console.log(user);
            //display the famer image
            $('#descriptionFamerImg').attr('src', user.imgUrl);
            console.log(user.imgUrl);
            $('#descriptionFamerName').text(user.name);
            $('#descriptionFamerAbout').text(user.about);

        });
    }


})(jQuery);