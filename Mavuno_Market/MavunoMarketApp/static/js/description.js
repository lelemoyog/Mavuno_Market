import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, setDoc,updateDoc, query,where, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
  var id;


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

    function makeOrder(id){
        //get the product id

          var uid = localStorage.getItem('uid');
          const productDoc = doc(db, "products", id);
          //get the product document
          getDoc(productDoc).then(docSnap => {
              let product = docSnap.data();
             
         
          //conver to plain js object
          const productObj = {
              id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            imgUrl: product.imgUrl,
            sellerId: product.sellerId,
            buyerId: uid,
            availabilityWindowStart: product.availabilityWindowStart,
            availabilityWindowEnd: product.availabilityWindowEnd
          };
          //add product to the database usee setDoc and and the document id to the product object
          //get uid
          var cartDoc = doc(db, product.sellerId, product.id);
          setDoc(cartDoc, productObj).then(() => {
              console.log("Document successfully written!");
              fetchCartProducts();
             }).catch((error) => {
              console.error("Error writing document: ", error);
            });    
          });    
          
        }

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

    $('#addToCartBtn').click(function () {
        //get the product id
       
        var id = localStorage.getItem('productId');
        //get the user id
        //add the product to the cart
        getAuth().onAuthStateChanged(function (user) {
          if (user) {          
              // User is signed in.
              addProduct(id);
          } else {
              // No user is signed in.
              window.location.href = "/signin/";
          }
      });
        
    });

    // function addProductToCart(productId, userId){
    //     //add the product to the cart use SetDoc]
    //     console.log(productId);
    //     const cartDoc = doc(db, userId, productId);
    //     setDoc(cartDoc, {
    //         products: [productId]
    //     }).then(() => {
    //         console.log("Document successfully written!");
    //     }).catch((error) => {
    //         console.error("Error writing document: ", error);
    //     });

        
    // }

    function addProduct(id){
        var uid = localStorage.getItem('uid');
        const productDoc = doc(db, "products", id);
        var quantity = $('#productQuantity').val();
        //get the product document
        getDoc(productDoc).then(docSnap => {
            let product = docSnap.data();
           
       
        //conver to plain js object
        const productObj = {
            id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          imgUrl: product.imgUrl,
          sellerId: product.sellerId,
          buyerId: uid,
          quantity: quantity,
          status: "pending",
          availabilityWindowStart: product.availabilityWindowStart,
          availabilityWindowEnd: product.availabilityWindowEnd
        };
        //add product to the database usee setDoc and and the document id to the product object
        //get uid
        var cartDoc = doc(db, uid, product.id);
        setDoc(cartDoc, productObj).then(() => {
            console.log("Document successfully written!");
            fetchCartProducts();
           }).catch((error) => {
            console.error("Error writing document: ", error);
          });    
        });    
        
      }

      function fetchCartProducts() {
        document.querySelector("#cartHolder").innerHTML = "";
        //get the user id
        var uid = localStorage.getItem('uid');
        //get the cart collection
        getDocs(query(collection(db, uid))).then(docSnap => {
            let products = [];
            docSnap.forEach((doc) => {
                products.push({ ...doc.data(), id: doc.id })
            });
            console.log(products);
            //display the products in the cart use doe loop let i = o and use js to create the elements
            for (let i = 0; i < products.length; i++) {
                //get the product
                var product = products[i];
                //create the elements
                var productRow = document.createElement('tr');

                var th = document.createElement('th');
                th.scope = "row";
                var div = document.createElement('div');
                div.className = "d-flex align-items-center";
                var img = document.createElement('img');
                img.src = product.imgUrl;
                img.className = "img-fluid me-5 rounded-circle";
                img.style.width = "80px";
                img.style.height = "80px";
                img.alt = product.name;
                div.appendChild(img);
                th.appendChild(div);
                productRow.appendChild(th);

                var td1 = document.createElement('td');

                var p1 = document.createElement('p');
                p1.className = "mb-0 mt-4";
                p1.innerHTML = product.name;
                td1.appendChild(p1);
                productRow.appendChild(td1);

                var td2 = document.createElement('td');

                var p2 = document.createElement('p');
                p2.className = "mb-0 mt-4";
                p2.innerHTML = product.price;
                td2.appendChild(p2);
                productRow.appendChild(td2);

                var td3 = document.createElement('td');

                var div2 = document.createElement('div');
                div2.className = "input-group quantity mt-4";
                div2.style.width = "100px";

                var div3 = document.createElement('div');
                div3.className = "input-group-btn";

                var button1 = document.createElement('button');
                button1.className = "btn btn-sm btn-minus rounded-circle bg-light border";
                button1.innerHTML = '<i class="fa fa-minus"></i>';
                div3.appendChild(button1);

                div2.appendChild(div3);

                var input = document.createElement('input');
                input.type = "text";
                input.className = "form-control form-control-sm text-center border-0";
                input.value = "1";
                div2.appendChild(input);

                var div4 = document.createElement('div');
                div4.className = "input-group-btn";

                var button2 = document.createElement('button');
                button2.className = "btn btn-sm btn-plus rounded-circle bg-light border";
                button2.innerHTML = '<i class="fa fa-plus "></i>';
                div4.appendChild(button2);

                div2.appendChild(div4);
                td3.appendChild(div2);
                productRow.appendChild(td3);

                var td4 = document.createElement('td');

                var p3 = document.createElement('p');
                p3.className = "mb-0 mt-4";
                p3.innerHTML = product.price;
                td4.appendChild(p3);
                productRow.appendChild(td4);

                var td5 = document.createElement('td');

                var button3 = document.createElement('button');
                button3.className = "btn btn-md rounded-circle bg-light border mt-4";
                button3.innerHTML = "Make Order";
                td5.appendChild(button3);
                productRow.appendChild(td5);

                //append the product row to the cart holder
                document.querySelector("#cartHolder").appendChild(productRow);

                var cartCount = products.length
                document.querySelector("#cartCount").innerHTML = cartCount;
                id = product.id;
                // Add event listener to the button
                button3.addEventListener('click', (function(productId) {
                    return function() {
                        //get the product id
                        //add the product to the cart
                        alert('Order Made ' + productId);
                        makeOrder(productId);
                    };
                })(id));

            };
        });
    };


})(jQuery);