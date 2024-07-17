import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { User } from "/static/js/classes.js";
import { firebaseConfig } from "/static/js/firebaseSDK.js";
//import https://cdn.jsdelivr.net/npm/apexcharts
import { } from "https://cdn.jsdelivr.net/npm/apexcharts";
//import auth from firebase
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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





  var id;

  //search function for products

  $("#search").click(function (event) {
    event.preventDefault();
    var search = document.getElementById('searchInput').value;
    console.log(search);
    clearBox();
    window.location.href = "#productHolder";
    //use firebase firestore search function to search for products with the name that matches the search input

    getDocs(query(collection(db, "products"), where("name", "==", search), limit(8))).then(docSnap => {
      let Products = [];
      docSnap.forEach((doc) => {
        Products.push({ ...doc.data(), id: doc.id })
      });

      console.log("Document data:", Products);
      let goods = Products.length;
      console.log(Products);
      const veiwGoods = document.querySelector("#productHolder");
      // check if Products is empty
      if (Products.length == 0) {
        veiwGoods.innerHTML = "Please enter a valid product name ie Banana, Maize, etc";
        //make it center and bigger
        veiwGoods.style.textAlign = "center";
        veiwGoods.style.fontSize = "3em";
      }
      for (let i = 0; i < goods; i++) {
        var name = Products[i]['name'];
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
        textWhite.className = "text-white bg-success px-3 py-1 rounded position-absolute";
        textWhite.style.top = "10px";
        textWhite.style.left = "10px";
        textWhite.innerHTML = category;

        var border = document.createElement("div");
        border.className = "p-4 border border-secondary border-top-0 rounded-bottom";

        var h4 = document.createElement("h4");
        h4.innerHTML = name;

        var h6 = document.createElement("h6");
        h6.innerHTML = id;
        h6.style.display = "none";

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
  });

  //create a function that takes in an array called products and a string productName then loop through the array and return the product with the name that matches the first letter of the productName




  //get all products from firebase
  let Products = [];
  getDocs(query(collection(db, "products"))).then(docSnap => {

    docSnap.forEach((doc) => {
      //push only the names to the products array
      Products.push({ ...doc.data(), id: doc.id })

    });

    console.log("Document words data:", Products);
    console.log(" data:", Products.length);
    let words = [];
    for (let i = 0; i < Products.length; i++) {
      words.push(Products[i]['name']);
    }
    console.log("words" + words);

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

  $("#search-icon-1").click(function (event) {
    event.preventDefault();
    var search = document.getElementById('modalSearchInput').value;
    console.log(search);
    clearBox();
    //use firebase firestore search function to search for products with the name that matches the search input
    window.location.href = "#productHolder";
    getDocs(query(collection(db, "products"), where("name", "==", search), limit(8))).then(docSnap => {
      let Products = [];
      docSnap.forEach((doc) => {
        Products.push({ ...doc.data(), id: doc.id })
        //fetch only the product names that start with the first letter of the search input
      });
      console.log("Document data:", Products);
      let goods = Products.length;
      console.log(Products);
      const veiwGoods = document.querySelector("#productHolder");
      if (Products.length == 0) {
        veiwGoods.innerHTML = "Please enter a valid product name ie Banana, Maize, etc";
        //make it center and bigger
        veiwGoods.style.textAlign = "center";
        veiwGoods.style.fontSize = "2em";
      }
      for (let i = 0; i < goods; i++) {
        var name = Products[i]['name'];
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
        textWhite.className = "text-white bg-success px-3 py-1 rounded position-absolute";
        textWhite.style.top = "10px";
        textWhite.style.left = "10px";
        textWhite.innerHTML = category;

        var border = document.createElement("div");
        border.className = "p-4 border border-secondary border-top-0 rounded-bottom";

        var h4 = document.createElement("h4");
        h4.innerHTML = name;

        var h6 = document.createElement("h6");
        h6.innerHTML = id;
        h6.style.display = "none";

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
  });



  function fetchProducts() {
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
        var name = Products[i]['name'];
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
        textWhite.className = "text-white bg-success px-3 py-1 rounded position-absolute";
        textWhite.style.top = "10px";
        textWhite.style.left = "10px";
        textWhite.innerHTML = category;

        var border = document.createElement("div");
        border.className = "p-4 border border-success border-top-0 rounded-bottom";

        var h4 = document.createElement("h4");
        h4.innerHTML = name;

        var h6 = document.createElement("h6");
        h6.innerHTML = id;
        h6.style.display = "none";

        var dFlex = document.createElement("div");
        dFlex.className = "d-flex justify-content-between flex-lg-wrap";

        var p = document.createElement("p");
        p.className = "text-dark fs-5 fw-bold mb-0";
        p.innerHTML = `Ksh ${price} / kg`;

        var a = document.createElement("a");
        a.href = "#";
        a.className = "btn btn-outline-success";
        a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-success"></i> View Description`;



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



  //create function fetchProducts2 to fetch products from firebase filter by category the product holder id is productHolder2, use the query function to query only products with the category fruits

  function fetchProducts2() {
    //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
    clearBox();

    getDocs(query(collection(db, "products"), where("category", "==", "fruits"), limit(12))).then(docSnap => {
      let Products = [];
      docSnap.forEach((doc) => {
        Products.push({ ...doc.data(), id: doc.id })
      });
      console.log("Document2 data:", Products);
      let goods = Products.length;
      console.log(Products);
      const veiwGoods = document.querySelector("#productHolder2");

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
        img.className = "img-fluid w-100 rounded-top";
        img.alt = name;

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
        a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-success"></i> View Description`;

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

  function fetchProducts3() {
    //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
    clearBox();

    getDocs(query(collection(db, "products"), where("category", "==", "vegetable"), limit(12))).then(docSnap => {
      let Products = [];
      docSnap.forEach((doc) => {
        Products.push({ ...doc.data(), id: doc.id })
      });
      console.log("Document3 data:", Products);
      let goods = Products.length;
      console.log(Products);
      const veiwGoods = document.querySelector("#productHolder3");

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
        img.className = "img-fluid w-100 rounded-top";
        img.alt = name;

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
        a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-success"></i> View Description`;

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

  function fetchProducts4() {
    //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
    clearBox();

    getDocs(query(collection(db, "products"), where("category", "==", "cereals"), limit(12))).then(docSnap => {
      let Products = [];
      docSnap.forEach((doc) => {
        Products.push({ ...doc.data(), id: doc.id })
      });
      console.log("Document4 data:", Products);
      let goods = Products.length;
      console.log(Products);
      const veiwGoods = document.querySelector("#productHolder4");

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
        img.className = "img-fluid w-100 rounded-top";
        img.alt = name;

        var textWhite = document.createElement("div");
        textWhite.className = "text-white bg-secondary px-3 py-1 rounded position-absolute";
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
        a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-success"></i> View Description`;



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


  function clearBox() {
    const productHolder = document.getElementById('productHolder');
    const productHolder2 = document.getElementById('productHolder2');
    const productHolder3 = document.getElementById('productHolder3');
    const productHolder4 = document.getElementById('productHolder4');
    const productHolderc = document.getElementById('productHolderC');

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
    if (productHolderc) {
      productHolderc.innerHTML = " ";
    }
  }


  fetchProducts();
  fetchProducts2();
  fetchProducts3();
  fetchProducts4();


})(jQuery);