import { initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot,updateDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { User } from "/static/js/classes.js";
import { firebaseConfig } from "/static/js/firebaseSDK.js";

// <!-- Add the Firebase Storage SDK !-->
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

//import auth from firebase
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

(function ($) {
  "use strict";
  // Import the functions you need from the SDKs you need

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  document.getElementById('photo').onchange = function() {
  // fire the upload here
  uploadImage();
};

  function uploadImage() {
    const storageRef = ref(storage, 'images');
    const file = document.querySelector("#photo").files[0];
    const metadata = {
      contentType: file.type,
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        console.log(url);
        document.getElementById("photoUrl").value = url;
        updateUser(url);
      })
      .catch(console.error);
  }


//update user
$('#updateBtn').click(function(){
  var url = $('#photoUrl').val();
    updateUser(url);
    alert('Profile Updated');
});

function updateUser(url){
    var uid = localStorage.getItem('uid');
    const userDoc = doc(db, "users", uid);
    updateDoc(userDoc, {
        name: $('#userN').val(),
        email: $('#userEmail').val(),
        location: $('#userLocation').val(),
        about: $('#userAbout').val(),
        imgUrl: url
    }).then(() => {
        console.log("Document successfully updated!");
        //redirect to profile page
        window.location.href = "/profile/";
    }).catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

}
)(jQuery);