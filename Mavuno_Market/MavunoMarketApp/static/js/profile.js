import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where,updateDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { Product } from "/static/js/classes.js";
import { firebaseConfig } from "/static/js/firebaseSDK.js";

// <!-- Add the Firebase Storage SDK !-->
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

//import auth from firebase
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
  var id;

  $('#photo').change(function () {
    // fire the upload here
    $('#spinner').addClass('show');
    uploadImage();
    setTimeout(function() {
      $('#spinner').removeClass('show');
    }, 2500);
  });

  function uploadImage() {
    const file = document.querySelector("#photo").files[0];
    const fileName = file.name;
    const storageRef = ref(storage, fileName);
    const metadata = {
      contentType: file.type,
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        console.log(url);
        document.getElementById("photoUrl").value = url;
        //add local storage
        localStorage.setItem('photoUrl', url);
        updateUser(url);
      })
      .catch(console.error);
  }

  //click event to add product image
  $('#productPhoto').change(function () {
    $('#spinner').addClass('show');
    uploadProductImage();
    setTimeout(function() {
      $('#spinner').removeClass('show');
    }, 2000);
  });

  function uploadProductImage() {
    const file = document.querySelector("#productPhoto").files[0];
     //get the file name
    const fileName = file.name;
     const storageRef = ref(storage, fileName);
    const metadata = {
      contentType: file.type,
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        console.log(url);
        //put img to src of uploadedImage
        $('#uploadedImage').attr('src', url);
        //add local storage
        localStorage.setItem('productPhotoUrl', url);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  //update user
  $('#updateBtn').click(function () {
    var url = localStorage.getItem('photoUrl');
    updateUser(url);
  });



  function updateUser(url) {
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
      $("#myAlert6").fadeTo(2000, 500).slideUp(500, function () {
        $("#myAlert6").slideUp(500);
      });
      //redirect to profile page
      setTimeout(function() {
        window.location.href = "/profile/";
      }, 1000);
    }).catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }



  //use the product class to upload product and  create a product object
  $('#addProduct').click(function () {
    addProduct();
  });

  //create a product object
  // const user = new User(uid, name, email, accesslevel, location, about, imgUrl);


  // //conver to plain js object
  // const userObj = {
  //   uid: user.uid,
  //   name: user.name,
  //   email: user.email,
  //   accesslevel: user.accesslevel,
  //   location: user.location,
  //   about: user.about,
  //   imgUrl: user.imgUrl
  // }; follow the same pattern to create a product object and for the id i want it to be the doc ref id from firebase

  //create a function to add a product
  function addProduct(){
    var name = $('#productName').val();
    var price = $('#productPrice').val();
    var category = $('#postProductCategory').val();
    var amountAvailable = $('#productAmount').val();
    var description = $('#productDescription').val();
    var imgUrl = localStorage.getItem('productPhotoUrl');
    var sellerId = localStorage.getItem('uid');
    var availabilityWindowStart = String($('#availabilityWindowStart').val());
    var availabilityWindowEnd = $('#availabilityWindowEnd').val();
    //create a product object
    const product = new Product('', name, price, category, description, imgUrl, sellerId, availabilityWindowStart, availabilityWindowEnd, amountAvailable);
    //conver to plain js object
    const productObj = {
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      imgUrl: product.imgUrl,
      sellerId: product.sellerId,
      availabilityWindowStart: product.availabilityWindowStart,
      availabilityWindowEnd: product.availabilityWindowEnd,
      amountAvailable: product.amountAvailable
    };
    //add product to the database usee setDoc and and the document id to the product object
    addDoc(collection(db, "products"), productObj).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      //update the product id with the doc ref id
      updateDoc(doc(db, "products", docRef.id), {
        id: docRef.id
      }).then(() => {
        $("#myAlert").fadeTo(2000, 500).slideUp(500, function () {
          $("#myAlert").slideUp(500);
          window.location.href = "/profile/";
        });
      }).catch((error) => {
        // The document probably doesn't exist.
        $("#myAlert").fadeTo(2000, 500).slideUp(500, function () {
          $("#myAlert").innerHTML = error.code;
          $("#myAlert").slideUp(500);
         
        });
      });
    })
    
  }

  // $("document").ready(function () {
  //   //get the user access level from local storage
  //   var accessLevel = localStorage.getItem('accessLevel');
  //   //check if the user is a farmer
  //   if (accessLevel === "farmer") {
  //   fetchProducts5();
  //   }
  //   if (accessLevel === "vendor") {
  //     fetchOrderProducts();
  //   }
   
  // })


  

 

function deleteProduct(productId) {
  //delete the product from the cart
  var uid = localStorage.getItem('uid');
  deleteDoc(doc(db, uid, productId)).then(() => {
      console.log("Document successfully deleted!");
  }).catch((error) => {
      console.error("Error removing document: ", error);
  });
}

  

})(jQuery);