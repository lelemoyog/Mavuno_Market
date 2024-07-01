import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where, setDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
    var id;

    $(document).ready(function () {






        var resultCode = document.getElementById('resultCode').innerHTML;


        var resultCode = document.getElementById('resultCode').innerHTML;

        if (resultCode == "0") {
            console.log('Transaction was successful');
            //redirect to query page

            //get the product id and seller id from local storage
            var productId = localStorage.getItem('productId');
            var buyerId = localStorage.getItem('buyerId');
            console.log(productId);
            console.log(buyerId);

            //update order status
            updateOrderStatus(productId, buyerId);
        }

    });

    // //reload after 5000
   

    //update order status

    function updateOrderStatus(productId, buyerId) {
        //get the product id
        //get the product document
        const productDoc = doc(db, buyerId, productId);
        //get the product document
        getDoc(productDoc).then((docSnap) => {
            let product = docSnap.data();
            //conver to plain js object
            console.log(product);
            if (product) {
                const productObj = {
                    id: productId,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    description: product.description,
                    imgUrl: product.imgUrl,
                    sellerId: product.sellerId,
                    buyerId: product.buyerId,
                    quantity: product.quantity || "1", // assign a default value if quantity is undefined
                    status: "paid",
                    availabilityWindowStart: product.availabilityWindowStart,
                    availabilityWindowEnd: product.availabilityWindowEnd,
                };
                //add product to the database use setDoc and the document id to the product object
                //get uid
                var cartDoc = doc(db, product.buyerId, productId);
                var orderDoc = doc(db, product.sellerId, product.id);
                setDoc(cartDoc, productObj)
                    .then(() => {
                        console.log("Order successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                setDoc(orderDoc, productObj)
                    .then(() => {
                        console.log("Order successfully written!");
                        setTimeout(function () {
                            window.location.href = "/home/";
                        }, 5000);
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            }
        });
    }



})(jQuery);