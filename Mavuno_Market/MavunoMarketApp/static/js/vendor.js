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



  function getVendors(){
    //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
    clearBox();
  
    getDocs(query(collection(db, "users"), where("accesslevel", "==", "vendor"), limit(6))).then(docSnap => {
      let Users = [];
      docSnap.forEach((doc) => {
        Users.push({ ...doc.data(), id: doc.id })
      });
      console.log("Document7 data:", Users);
      let farmers = Users.length;
      const farmerHolder = document.querySelector("#vendorHolder");

    
    for(let i = 0; i < farmers; i++){
        var name = Users[i].name;
        var about = Users[i].about;
        var location = Users[i].location;
        var image = Users[i].imgUrl;
     
        

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
        a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-primary"></i> View Products`;

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
            localStorage.setItem('farmerName', name);
            window.location.href = "/products/";
          });
        })(name);



        
    }
    });

    };

//clear the farmerHolder
function clearBox() {
    var farmerHolder = document.getElementById('vendorHolder');
    if (farmerHolder) {
        farmerHolder.innerHTML = "";
    }
}
    
     
     
  
getVendors();

})(jQuery);