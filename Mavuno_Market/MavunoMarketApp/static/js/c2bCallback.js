import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where,  updateDoc, setDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
        var spinner = document.getElementById('spinnercle');

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
            createTransaction(productId, buyerId);
        }
        if (resultCode == "1") {
          //reload in 1000
          spinner.style.display = "block";
            setTimeout(function () {
                window.location.reload();
            }, 4000);
        }

    });

    // //reload after 5000


    //create transaction
    function createTransaction(productId, buyerId) {
        //get the product id
        //get the product document
        const transactionDoc = doc(db, "Transactions", productId);
        //get the product document
        const productDoc = doc(db, buyerId, productId);
        getDoc(productDoc).then((docSnap) => {
            let product = docSnap.data();
            //conver to plain js object
            console.log(product);
            if (product) {
               
              //create transaction object
                const transactionObj = {
                    // assign a default value if quantity is undefined
                    status: "paid",
                    productId: product.productId,
                    buyerId: product.buyerId,
                    sellerId: product.sellerId,
                    price: product.price,
                    quantity: product.quantity,
                    orderId: product.orderId,
                    productId: product.id,
                    date: new Date().toLocaleString(),
                };
                //add product to the database use setDoc and the document id to the product object
                setDoc(transactionDoc, transactionObj).then(() => {
                    console.log("Transaction successfully written!");
                }).catch((error) => {
                    console.error("Error writing document: ", error);   
                });
            }
        }); 
    }
   

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
                    // assign a default value if quantity is undefined
                    status: "paid",
                };
                //add product to the database use setDoc and the document id to the product object
                //get uid
                var cartDoc = doc(db, product.buyerId, productId);
                var orderDoc = doc(db, product.sellerId, productId);
                updateDoc(cartDoc, productObj)
                    .then(() => {
                        console.log("Order successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                    updateDoc(orderDoc, productObj)
                    .then(() => {
                        console.log("Order successfully written!");
                        var message = "Your order has been paid for successfully. You will receive the payment once the product has been delivered. We will notify you once the buyer confirms delivery.";
                        sendEmailToUser(product.sellerId,message,product.orderId,product.price,product.quantity);
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

    function sendEmailToUser(uid, message, orderId, price, quantity) {
        //get the user id

        //get the user document
        const userDoc = doc(db, "users", uid);
        getDoc(userDoc).then(docSnap => {
            let user = docSnap.data();

            //get the user email
            var email = user.email;
            var name = user.name;
            console.log(email);


            emailjs.send("service_pfpj96r", "template_9ya4sl5", {
                subject: "Mavuno Market",
                to_email: email,
                to_name: name,
                message: message,
                orderId: orderId,
                productName: name,
                productPrice: price,
                productQuantity: quantity,
                productTotal: price * quantity,
            })
                .then(function (response) {
                    console.log("SUCCESS!", response.status, response.text);
                }, function (error) {
                    console.error("FAILED...", error);
                });

        });
    }

})(jQuery);