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




  function getFarmers() {
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


      for (let i = 0; i < farmers; i++) {
        var name = Users[i].name;
        var about = Users[i].about;
        var location = Users[i].location;
        //check if the image is available

        var image = Users[i].imgUrl ? Users[i].imgUrl : "https://www.w3schools.com/w3images/avatar2.png";



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
        textWhite.className = "text-white bg-success px-3 py-1 rounded position-absolute";
        textWhite.style.top = "10px";
        textWhite.style.left = "10px";
        textWhite.innerHTML = location;

        var border = document.createElement("div");
        border.className = "p-4 border border-success border-top-0 rounded-bottom";

        var h4 = document.createElement("h4");
        h4.innerHTML = name;

        var dFlex = document.createElement("div");
        dFlex.className = "d-flex justify-content-between flex-lg-wrap";

        var p = document.createElement("p");
        p.className = "text-dark fs-5 fw-bold mb-0";
        p.innerHTML = about;

        var a = document.createElement("a");
        a.href = "#";
        a.className = "btn btn-outline-success";
        a.innerHTML = `<i class="fa fa-shopping-bag me-2"></i>View Products`;
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
        (function (name) {
          a.addEventListener('click', function () {
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
        veiwGoods.innerHTML = "Farmers products are not available at the moment. Please check again later.";
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
        img.style.height = "200px";

        var textWhite = document.createElement("div");
        textWhite.className = "text-white bg-success px-3 py-1 rounded position-absolute";
        textWhite.style.top = "10px";
        textWhite.style.left = "10px";
        textWhite.innerHTML = category;

        var border = document.createElement("div");
        border.className = "p-4 border border-success border-top-0 rounded-bottom";

        var h4 = document.createElement("h4");
        h4.innerHTML = name;

        var dFlex = document.createElement("div");
        dFlex.className = "d-flex justify-content-between flex-lg-wrap";

        var p = document.createElement("p");
        p.className = "text-dark fs-5 fw-bold mb-0";
        p.innerHTML = `Ksh ${price} / kg`;

        var a = document.createElement("a");
        a.href = "#";
        a.className = "btn btn-outline-success";
        a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-success"></i> Purchase`;

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

          (function (id, name, category) {
            a.addEventListener('click', function () {
              localStorage.setItem('productId', id);
              localStorage.setItem('category', category);
              console.log(name);
              window.location.href = "/description/";
            });
          })(id, name, category);
        }

      }
    });
  }

  function searchFarmer() {
    var search = document.getElementById('searchInput').value;
    clearBox();
    getDocs(query(collection(db, "users"), where("name", "==", search), limit(12))).then(docSnap => {
      let Users = [];
      docSnap.forEach((doc) => {
        Users.push({ ...doc.data(), id: doc.id })
      });
      console.log("Document6 data:", Users);
      let farmers = Users.length;
      const farmerHolder = document.querySelector("#farmerHolder");


      for (let i = 0; i < farmers; i++) {
        var name = Users[i].name;
        var about = Users[i].about;
        var location = Users[i].location;
        //check if the image is available

        var image = Users[i].imgUrl ? Users[i].imgUrl : "https://www.w3schools.com/w3images/avatar2.png";



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
        textWhite.className = "text-white bg-success px-3 py-1 rounded position-absolute";
        textWhite.style.top = "10px";
        textWhite.style.left = "10px";
        textWhite.innerHTML = location;

        var border = document.createElement("div");
        border.className = "p-4 border border-success border-top-0 rounded-bottom";

        var h4 = document.createElement("h4");
        h4.innerHTML = name;

        var dFlex = document.createElement("div");
        dFlex.className = "d-flex justify-content-between flex-lg-wrap";

        var p = document.createElement("p");
        p.className = "text-dark fs-5 fw-bold mb-0";
        p.innerHTML = about;

        var a = document.createElement("a");
        a.href = "#";
        a.className = "btn btn-outline-success";
        a.innerHTML = `<i class="fa fa-shopping-bag me-2"></i>View Products`;
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
        (function (name) {
          a.addEventListener('click', function () {
            $('#modalFarmerName').html(name);
            fetchProducts5(Users[i].uid);
          });
        })(name);




      }
    });

  };


  $('#search').on('click', function () {
    searchFarmer();
  });

  let users = [];
  getDocs(collection(db, "users")).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id });
    });

    let words = [];
    for (let i = 0; i < users.length; i++) {
      words.push(users[i].name);
    }

    var input = document.getElementById('searchInput');
    var suggestion = document.getElementById('suggestion');
    //Enter key code
    const enterKey = 13;
    window.onload = () => {
      input.value = "";
      clearSuggestion();
    };
    const clearSuggestion = () => {
      suggestion.innerHTML = "";
    };
    const caseCheck = (word) => {
      //Array of characters
      word = word.split("");
      let inp = input.value;
      //loop through every character in ino
      for (let i in inp) {
        //if input character matches with character in word no need to change
        if (inp[i] == word[i]) {
          continue;
        } else if (inp[i].toUpperCase() == word[i]) {
          //if inp[i] when converted to uppercase matches word[i] it means word[i] needs to be lowercase
          word.splice(i, 1, word[i].toUpperCase());
        } else {
          //word[i] needs to be uppercase
          word.splice(i, 1, word[i].toLowerCase());
        }
      }
      //array to string
      return word.join("");
    };
    //Execute function on input
    input.addEventListener("input", (e) => {
      clearSuggestion();
      //Convert input value to regex since string.startsWith() is case sensitive
      let regex = new RegExp("^" + input.value, "i");
      //loop through words array
      for (let i in words) {
        //check if input matches with any word in words array
        if (regex.test(words[i]) && input.value != "") {
          //Change case of word in words array according to user input
          words[i] = caseCheck(words[i]);
          //display suggestion
          suggestion.innerHTML = words[i];
          break;
        }
      }
    });
    //Complete predictive text on enter key
    input.addEventListener("keydown", (e) => {
      //When user presses enter and suggestion exists
      if (e.keyCode == enterKey && suggestion.innerText != "") {
        e.preventDefault();
        input.value = suggestion.innerText;
        //clear the suggestion
        clearSuggestion();
      }
    });
    
  });
    
    
    
    
    var input = document.getElementById('searchInput');
    var suggestion = document.getElementById('suggestion');
    
    suggestion.addEventListener("click", function (event) {
      event.preventDefault();
      input.value = suggestion.innerText;
      suggestion.innerHTML = "";
    });




  



  //clear the farmerHolder
  function clearBox() {
    var farmerHolder = document.getElementById('farmerHolder');
    if (farmerHolder) {
      farmerHolder.innerHTML = "";
    }
  }




  getFarmers();

})(jQuery);