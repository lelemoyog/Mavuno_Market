import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where,updateDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

  $('#photo').change(function () {
    // fire the upload here
    uploadImage();
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
    uploadProductImage();
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
    alert('Profile Updated');
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
      //redirect to profile page
      window.location.href = "/profile/";
    }).catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }



  //use the product class to upload product and  create a product object
  $('#addProduct').click(function () {
    addProduct();
    alert('Product Added');
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
      availabilityWindowEnd: product.availabilityWindowEnd
    };
    //add product to the database usee setDoc and and the document id to the product object
    addDoc(collection(db, "products"), productObj).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      //update the product id with the doc ref id
      updateDoc(doc(db, "products", docRef.id), {
        id: docRef.id
      }).then(() => {
        console.log("Document successfully updated!");
      }).catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
    })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    
  }

  $("document").ready(function () {
    fetchProducts5();
  });


  function fetchProducts5(){
    //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
    clearBox();
    var uid = localStorage.getItem('uid');
    getDocs(query(collection(db, "products"),  where("sellerId", "==", uid), limit(6))).then(docSnap => {
      let Products = [];
      docSnap.forEach((doc) => {
        Products.push({ ...doc.data(), id: doc.id })
      });
      console.log("Document5 data:", Products);
      let goods = Products.length;
      console.log(Products);
      const veiwGoods = document.querySelector("#productHolder5");
     
      for (let i = 0; i < goods; i++) {
        var name  = Products[i]['name'];
        var price = Products[i]['price'];
        var category = Products[i]['category'];
        var imgUrl = Products[i]['imgUrl'];
        var id = Products[i]['id'];
        
        var product = document.createElement("div");
        product.className = "col-md-6 col-lg-4 col-xl-3";
        
        var fruiteItem = document.createElement("div");
        fruiteItem.className = "rounded position-relative fruite-item";
  
        var fruiteImg = document.createElement("div");
        fruiteImg.className = "fruite-img";
  
        var img = document.createElement("img");
        img.src = imgUrl;
        img.className = "img-fluid w-100 rounded-top";
        img.alt = name;
  
        var textWhite = document.createElement("div");
        textWhite.className = "text-white bg-success px-3 py-1 rounded position-absolute";
        textWhite.style.top = "10px";
        textWhite.style.left = "10px";
        textWhite.innerHTML = category;
  
        var border = document.createElement("div");
        border.className = "p-4 border border-secondary border-top-0 rounded-bottom";
  
        var h4 = document.createElement("h4");
        h4.innerHTML = name;
  
        var dFlex = document.createElement("div");
        dFlex.className = "d-flex justify-content-between flex-lg-wrap";
  
        var p = document.createElement("p");
        p.className = "text-dark fs-5 fw-bold mb-0";
        p.innerHTML = `Ksh ${price} / kg`;
  
        var a = document.createElement("a");
        a.href = "#";
        a.className = "btn border border-secondary rounded-pill px-3 text-primary";
        a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-primary"></i> View Description`;
  
        veiwGoods.appendChild(product);
        product.appendChild(fruiteItem);
        fruiteItem.appendChild(fruiteImg);
        fruiteImg.appendChild(img);
        fruiteItem.appendChild(textWhite);
        fruiteItem.appendChild(border);
        border.appendChild(h4);
        border.appendChild(dFlex);
        dFlex.appendChild(p);
        dFlex.appendChild(a);
  
        for (let i = 0; i < goods; i++) {
          // ... existing code ...
  
          (function(id, name) {
            a.addEventListener('click', function() {
              localStorage.setItem('productId', id);
              console.log(name);
              window.location.href = "/description/";
            });
          })(id, name);
        }
  
      }
    });
  }

  function clearBox() {
    document.getElementById('productHolder5').innerHTML = "";
  }

})(jQuery);