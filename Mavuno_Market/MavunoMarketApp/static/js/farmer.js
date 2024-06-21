import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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



  // function getFarmers() {
  //   //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
  //   clearBox();

  //   getDocs(query(collection(db, "users"), where("accesslevel", "==", "farmer"), limit(6))).then(docSnap => {
  //     let Users = [];
  //     docSnap.forEach((doc) => {
  //       Users.push({ ...doc.data(), id: doc.id })
  //     });
  //     console.log("Document6 data:", Users);
  //     let farmers = Users.length;
  //     const farmerHolder = document.querySelector("#farmerHolder");


  //     for (let i = 0; i < farmers; i++) {
  //       var name = Users[i].name;
  //       var about = Users[i].about;
  //       var location = Users[i].location;
  //       //check if the image is available
  //       if (Users[i].imgUrl == "") {
  //         var image = "https://www.w3schools.com/w3images/avatar2.png";
  //       } else {
  //         var image = Users[i].imgUrl;
  //       }

  //       var modal = document.createElement("div");
  //       modal.className = "modal fade";
  //       modal.id = "`productModal-${i}";
  //       modal.tabIndex = "-1";
  //       modal.role = "dialog";
  //       modal.setAttribute("aria-labelledby", "productModalLabel");
  //       modal.setAttribute("aria-hidden", "true");

  //       var modalDialog = document.createElement("div");
  //       modalDialog.className = "modal-dialog modal-dialog-centered";
  //       modalDialog.role = "document";

  //       var modalContent = document.createElement("div");
  //       modalContent.className = "modal-content";

  //       var modalHeader = document.createElement("div");
  //       modalHeader.className = "modal-header";

  //       var modalTitle = document.createElement("h5");
  //       modalTitle.className = "modal-title";
  //       modalTitle.id = "productModalLabel";
  //       modalTitle.innerHTML = name;

  //       var modalCloseButton = document.createElement("button");
  //       modalCloseButton.type = "button";
  //       modalCloseButton.className = "close";
  //       modalCloseButton.setAttribute("data-dismiss", "modal");
  //       modalCloseButton.setAttribute("aria-label", "Close");

  //       var modalCloseIcon = document.createElement("span");
  //       modalCloseIcon.setAttribute("aria-hidden", "true");
  //       modalCloseIcon.innerHTML = "&times;";

  //       modalCloseButton.appendChild(modalCloseIcon);
  //       modalHeader.appendChild(modalTitle);
  //       modalHeader.appendChild(modalCloseButton);

  //       var modalBody = document.createElement("div");
  //       modalBody.className = "modal-body";
  //       modalBody.innerHTML = "Produce: " + produce + "<br>Farmer: " + farmer;

  //       modalContent.appendChild(modalHeader);
  //       modalContent.appendChild(modalBody);
  //       modalDialog.appendChild(modalContent);
  //       modal.appendChild(modalDialog);

  //       farmerHolder.appendChild(modal);


  //       var farmer = document.createElement("div");
  //       farmer.className = "col-md-6 col-lg-4 col-xl-3";
  //       farmer.style = "margin-bottom: 20px;";

  //       var farmerItem = document.createElement("div");
  //       farmerItem.className = "rounded position-relative fruite-item";

  //       var farmerImg = document.createElement("div");
  //       farmerImg.className = "fruite-img";

  //       var img = document.createElement("img");
  //       img.style.height = "300px";
  //       img.src = image;
  //       img.className = "img-fluid w-100 rounded-top";
  //       img.alt = name;

  //       var textWhite = document.createElement("div");
  //       textWhite.className = "text-white bg-secondary px-3 py-1 rounded position-absolute";
  //       textWhite.style.top = "10px";
  //       textWhite.style.left = "10px";
  //       textWhite.innerHTML = location;

  //       var border = document.createElement("div");
  //       border.className = "p-4 border border-secondary border-top-0 rounded-bottom";

  //       var h4 = document.createElement("h4");
  //       h4.innerHTML = name;

  //       var dFlex = document.createElement("div");
  //       dFlex.className = "d-flex justify-content-between flex-lg-wrap";

  //       var p = document.createElement("p");
  //       p.className = "text-dark fs-5 fw-bold mb-0";
  //       p.innerHTML = about;

  //       var a = document.createElement("a");
  //       a.href = "#";
  //       a.className = "btn border border-secondary rounded-pill px-3 text-primary";
  //       a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-primary"></i> View Products`;
  //       a.setAttribute("data-bs-toggle", "modal");
  //       a.setAttribute("data-bs-target", "#productModalf");

  //       farmerHolder.appendChild(farmer);
  //       farmer.appendChild(farmerItem);
  //       farmerItem.appendChild(farmerImg);
  //       farmerImg.appendChild(img);
  //       farmerItem.appendChild(textWhite);
  //       farmerItem.appendChild(border);
  //       border.appendChild(h4);
  //       border.appendChild(dFlex);
  //       dFlex.appendChild(p);
  //       dFlex.appendChild(a);
  //       (function (name) {
  //         a.addEventListener('click', function () {
  //           localStorage.setItem('farmerName', name);
  //           fetchProducts5(Users[i].uid);
  //         });
  //       })(name);




  //     }
  //   });

  // };

  function getFarmers(){
    //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
    clearBox();
  
    getDocs(query(collection(db, "users"), where("accesslevel", "==", "farmer"), limit(12))).then(docSnap => {
      let Users = [];
      docSnap.forEach((doc) => {
        Users.push({ ...doc.data(), id: doc.id })
      });
      console.log("Document6 data:", Users);
      let farmers = Users.length;
      const farmerHolder = document.querySelector("#farmerHolder");

    
    for(let i = 0; i < farmers; i++){
        var name = Users[i].name;
        var about = Users[i].about;
        var location = Users[i].location;
        //check if the image is available
        if(Users[i].imgUrl == ""){
          var image = "https://www.w3schools.com/w3images/avatar2.png";
        }else{
        var image = Users[i].imgUrl;
         }

        
      

        var farmer = document.createElement("div");
        farmer.className = "col-md-6 col-lg-4 col-xl-3";
        farmer.style = "margin-bottom: 20px;";
        
        var farmerItem = document.createElement("div");
        farmerItem.className = "rounded position-relative fruite-item";

        var farmerImg = document.createElement("div");
        farmerImg.className = "fruite-img";

        var img = document.createElement("img");
        img.style.height = "300px";
        img.src = image;
        img.className = "img-fluid w-100 rounded-top";
        img.alt = name;

        var textWhite = document.createElement("div");
        textWhite.className = "text-white bg-secondary px-3 py-1 rounded position-absolute";
        textWhite.style.top = "10px";
        textWhite.style.left = "10px";
        textWhite.innerHTML = location;

        var border = document.createElement("div");
        border.className = "p-4 border border-secondary border-top-0 rounded-bottom";

        var h4 = document.createElement("h4");
        h4.innerHTML = name;

        var dFlex = document.createElement("div");
        dFlex.className = "d-flex justify-content-between flex-lg-wrap";

        var p = document.createElement("p");
        p.className = "text-dark fs-5 fw-bold mb-0";
        p.innerHTML = about;

        var a = document.createElement("a");
        a.href = "#";
        a.className = "btn border border-secondary rounded-pill px-3 text-primary";
        a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-primary">View Products</i>`;
        a.setAttribute("data-bs-toggle", "modal");
        a.setAttribute("data-bs-target", "#productModal");

        farmerHolder.appendChild(farmer);
        farmer.appendChild(farmerItem);
        farmerItem.appendChild(farmerImg);
        farmerImg.appendChild(img);
        farmerItem.appendChild(textWhite);
        farmerItem.appendChild(border);
        border.appendChild(h4);
        border.appendChild(dFlex);
        dFlex.appendChild(p);
        dFlex.appendChild(a);
        (function(name) {
          a.addEventListener('click', function() {
            $('#modalFarmerName').html(name);
            fetchProducts5(Users[i].uid);
          });
        })(name);



        
    }
    });

    };
  
  function fetchProducts5(uid) {
    //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
   document.getElementById('productHolderf').innerHTML = "";
    getDocs(query(collection(db, "products"), where("sellerId", "==", uid), limit(12))).then(docSnap => {
      let Products = [];
      docSnap.forEach((doc) => {
        Products.push({ ...doc.data(), id: doc.id })
      });
      console.log("Document5 data:", Products);
      let goods = Products.length;
      console.log(Products);
      const veiwGoods = document.querySelector("#productHolderf");

      if (Products.length == 0) {
        veiwGoods.innerHTML = "You have no products yet, add some products";
        //make it center and bigger
        veiwGoods.style.textAlign = "center";
        veiwGoods.style.fontSize = "3em";
      }

      for (let i = 0; i < goods; i++) {
        var name = Products[i]['name'];
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
        img.className = "img-fluid w-100 h-40 rounded-top";
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

          (function (id, name) {
            a.addEventListener('click', function () {
              localStorage.setItem('productId', id);
              console.log(name);
              window.location.href = "/description/";
            });
          })(id, name);
        }

      }
    });
  }

  //clear the farmerHolder
  function clearBox() {
    var farmerHolder = document.getElementById('farmerHolder');
    if (farmerHolder) {
      farmerHolder.innerHTML = "";
    }
  }




  getFarmers();

})(jQuery);