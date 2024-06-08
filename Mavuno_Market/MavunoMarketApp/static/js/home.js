import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
    //remove user from local storage
    localStorage.removeItem('uid');
    window.location.href = "/signin/";
  }).catch((error) => {
    // An error happened.
    console.log('An error happened');
  });
});

//fetch products
{/* <div class="col-md-6 col-lg-4 col-xl-3">
<div class="rounded position-relative fruite-item">
    <div class="fruite-img">
        <img src="{% static 'img/fruite-item-1.jpg' %}" class="img-fluid w-100 rounded-top" alt="">
    </div>
    <div class="text-white bg-secondary px-3 py-1 rounded position-absolute" style="top: 10px; left: 10px;">Fruits</div>
    <div class="p-4 border border-secondary border-top-0 rounded-bottom">
        <h4>Oranges</h4>
        <div class="d-flex justify-content-between flex-lg-wrap">
            <p class="text-dark fs-5 fw-bold mb-0">Ksh 150 / kg</p>
            <a href="#" class="btn border border-secondary rounded-pill px-3 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> View Description</a>
        </div>
    </div>
</div>
</div> */}

var id;

function fetchProducts(){
  clearBox();
  getDocs(query(collection(db, "products"), limit(12))).then(docSnap => {
    let Products = [];
    docSnap.forEach((doc) => {
      Products.push({ ...doc.data(), id: doc.id })
    });
    console.log("Document data:", Products);
    let goods = Products.length;
    console.log(Products);
    const veiwGoods = document.querySelector("#productHolder");
   
    for (let i = 0; i < goods; i++) {
      var name  = Products[i]['name'];
      var price = Products[i]['price'];
      var category = Products[i]['category'];
      var imgUrl = Products[i]['imgUrl'];
      id = Products[i]['id'];
      
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
      textWhite.className = "text-white bg-secondary px-3 py-1 rounded position-absolute";
      textWhite.style.top = "10px";
      textWhite.style.left = "10px";
      textWhite.innerHTML = category;

      var border = document.createElement("div");
      border.className = "p-4 border border-secondary border-top-0 rounded-bottom";

      var h4 = document.createElement("h4");
      h4.innerHTML = name;

      var h6 = document.createElement("h6");
      h6.innerHTML = id;

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
      border.appendChild(h6);
      border.appendChild(dFlex);
      dFlex.appendChild(p);
      dFlex.appendChild(a);

      // Add event listener to the button
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

//create function fetchProducts2 to fetch products from firebase filter by category the product holder id is productHolder2, use the query function to query only products with the category fruits

function fetchProducts2(){
  //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
  clearBox();

  getDocs(query(collection(db, "products"),  where("category", "==", "fruits"), limit(6))).then(docSnap => {
    let Products = [];
    docSnap.forEach((doc) => {
      Products.push({ ...doc.data(), id: doc.id })
    });
    console.log("Document2 data:", Products);
    let goods = Products.length;
    console.log(Products);
    const veiwGoods = document.querySelector("#productHolder2");
   
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
      textWhite.className = "text-white bg-secondary px-3 py-1 rounded position-absolute";
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

function fetchProducts3(){
  //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
  clearBox();

  getDocs(query(collection(db, "products"),  where("category", "==", "vegetable"), limit(6))).then(docSnap => {
    let Products = [];
    docSnap.forEach((doc) => {
      Products.push({ ...doc.data(), id: doc.id })
    });
    console.log("Document3 data:", Products);
    let goods = Products.length;
    console.log(Products);
    const veiwGoods = document.querySelector("#productHolder3");
   
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
      textWhite.className = "text-white bg-secondary px-3 py-1 rounded position-absolute";
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

function fetchProducts4(){
  //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
  clearBox();

  getDocs(query(collection(db, "products"),  where("category", "==", "cereals"), limit(6))).then(docSnap => {
    let Products = [];
    docSnap.forEach((doc) => {
      Products.push({ ...doc.data(), id: doc.id })
    });
    console.log("Document4 data:", Products);
    let goods = Products.length;
    console.log(Products);
    const veiwGoods = document.querySelector("#productHolder4");
   
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
      textWhite.className = "text-white bg-secondary px-3 py-1 rounded position-absolute";
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


function clearBox()
{
  const productHolder = document.getElementById('productHolder');
  const productHolder2 = document.getElementById('productHolder2');
  const productHolder3 = document.getElementById('productHolder3');
  const productHolder4 = document.getElementById('productHolder4');

  if (productHolder) {
    productHolder.innerHTML = " ";
  }
  if (productHolder2) {
    productHolder2.innerHTML = " ";
  }
  if (productHolder3) {
    productHolder3.innerHTML = " ";
  }
  if (productHolder4) {
    productHolder4.innerHTML = " ";
  }
}

fetchProducts();
fetchProducts2();
fetchProducts3();
fetchProducts4();

})(jQuery);