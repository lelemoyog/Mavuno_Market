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
            $("#available").text(product.amountAvailable);
            $('#productImage').attr('src', product.imgUrl);
            $("#planting").text(product.availabilityWindowStart);
            $("#havesting").text( product.availabilityWindowEnd);
            var uid = product.sellerId;
            getUser(uid)
        });
    });

    
    function getUser(uid){
        const userDoc = doc(db, "users", uid);
        getDoc(userDoc).then(docSnap => {
            let user = docSnap.data();
            console.log(user);
            //display the famer image
            
            if(user.imgUrl == ""){
                var image = "https://www.w3schools.com/w3images/avatar2.png";
                $('#descriptionFamerImg').attr('src', image);
              }else{
                $('#descriptionFamerImg').attr('src', user.imgUrl);
               }
            console.log(user.imgUrl);
            $('#descriptionFamerName').text(user.name);
            $('#descriptionFamerAbout').text(user.about);
            $('#descriptionFamerLocation').text(user.location);
            $('#descriptionFamerPhone').text(user.phone);

        });
    }

    $('#tel').click(function () {
        //get the phone number
        var phone = $('#descriptionFamerPhone').text();
        //remove the 0 and add 254
        phone = phone.substring(1);
        //remove spaces
        phone = phone.replace(/\s/g, '');
        phone = '254' + phone;
        //whatsapp the phone number
        window.open('https://wa.me/' + phone, '_blank');
    });

    $('#addToCartBtn').click(function () {
        //get the product id
        document.querySelector("#spin").style.display = "block";
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
          status: "cartItem",
          availabilityWindowStart: product.availabilityWindowStart,
          availabilityWindowEnd: product.availabilityWindowEnd
        };
        //add product to the database usee setDoc and and the document id to the product object
        //get uid
        var cartDoc = doc(db, uid, product.id);
        setDoc(cartDoc, productObj).then(() => {
            console.log("Document successfully written!");
            document.querySelector("#spin").style.display = "none";
            $("#myAlert2").fadeTo(2000, 500).slideUp(500, function () {
                $("#myAlert2").slideUp(1000);
              });
            //   window.location.href = "/description/";
            window.fetchCartProducts();
            //reload the page
            // location.reload();
           }).catch((error) => {
            $("#myAlert2").fadeTo(2000, 500).slideUp(500, function () {
                $("#myAlert2").innerHTML = error.code;
                $("#myAlert2").slideUp(500);
              });
            console.error("Error writing document: ", error);
          });    
        });    
        
      }


})(jQuery);