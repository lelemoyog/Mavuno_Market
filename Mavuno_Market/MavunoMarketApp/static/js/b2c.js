import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

    $(document).ready(function () {
        var resultCode = document.getElementById('resultCode').innerHTML;

        if (resultCode == "0") {
            console.log('Transaction was successful');
            //redirect to query page

            //get the product id and seller id from local storage
            var productId = localStorage.getItem('productId');
            var orderId = localStorage.getItem('orderId');
            var buyerId = localStorage.getItem('buyerId');
            console.log(productId);
            console.log(buyerId);
            // console.log(orderId);

            var type = localStorage.getItem('type');

            if (type == '1') {
                //update order status
                updateOrderStatus(productId, buyerId, orderId);
            } else if (type == '0') {
                console.log(type);
                //update wallet balance
                cancelOrder(productId, buyerId);
            }

        }

    });


    //cancel order

    function cancelOrder(productId, buyerId) {
        //get the product id
        //get the product document
        const productDoc = doc(db, buyerId, productId);

        // const prod = doc(db, "products", orderId);
        // var availableQuantity
        // getDoc(prod).then((docSnap) => {
        //     let product = docSnap.data();
        //     console.log(product);
        //     if (product) {
        //         availableQuantity = product.amountAvailable;
        //     }
        // });


        //get the product document
        getDoc(productDoc).then((docSnap) => {
            let product = docSnap.data();
            console.log(product);
            var quantity = product.quantity;
            // var remainingQuantity = parseInt(availableQuantity) + parseInt(quantity);
            //conver to plain js object
            const productObj = {
                status: "cancelled",
            };
            //add product to the database use setDoc and the document id to the product object
            //get uid
            var cartDoc = doc(db, buyerId, productId);
            var orderDoc = doc(db, product.sellerId, productId);
            var productDoc = doc(db, "products", product.orderId);
            // updateDoc(productDoc, {
            //     amountAvailable: remainingQuantity
            // })
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
                    var message = "Confirm you have receive payment from mavuno market for the product you sold. thank you for your hardwork.";
                    sendEmailToUser(product.sellerId, message, product.orderId, product.price, quantity);
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
    }

    //update order status

    function updateOrderStatus(productId, buyerId, orderId) {
        //get the product id
        //get the product document
        const productDoc = doc(db, buyerId, productId);
        const prod = doc(db, "products", orderId);
        getDoc(prod).then((docSnap) => {
            let product = docSnap.data();
            console.log(product);
            if (product) {
                var availableQuantity = product.amountAvailable;
          

            //get the product document
            getDoc(productDoc).then((docSnap) => {
                let product = docSnap.data();
                //conver to plain js object
                var quantity = product.quantity;
                var remainingQuantity = availableQuantity - quantity;
                console.log(product);
                if (product) {
                    const productObj = {
                        // assign a default value if quantity is undefined
                        status: "completed",

                    };
                    //add product to the database use setDoc and the document id to the product object
                    //get uid
                    var cartDoc = doc(db, product.buyerId, productId);
                    var orderDoc = doc(db, product.sellerId, productId);
                    var productDoc = doc(db, "products", product.orderId);
                    updateDoc(productDoc, {
                        amountAvailable: remainingQuantity
                    })
                    updateDoc(cartDoc, productObj)
                        .then(() => {
                            console.log("Order successfully written!");
                            updateUserRating(product.buyerId, "1");
                        })
                        .catch((error) => {
                            console.error("Error writing document: ", error);
                        });
                    updateDoc(orderDoc, productObj)
                        .then(() => {
                            console.log("Order successfully written!");
                            var message = "Confirm you have receive payment from mavuno market for the product you sold. thank you for your hardwork.";
                            sendEmailToUser(product.sellerId, message, product.orderId, product.price, quantity);
                            setTimeout(function () {
                                window.location.href = "/home/";
                            }, 5000);
                        })
                        .catch((error) => {
                            console.error("Error writing document: ", error);
                            setTimeout(function () {
                                window.location.href = "/home/";
                            }, 5000);
                        });
                }
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

    //update user rating
    function updateUserRating(sellerId, rating) {
        //get the user document
        const userDoc = doc(db, "users", sellerId);
        //get the user document
        getDoc(userDoc).then(docSnap => {
            let user = docSnap.data();
            //get the user rating
            var userRating = user.rating;

            //update the user rating
            var newUserRating = parseInt(userRating) + parseInt(rating);
            //update the user rating
            updateDoc(userDoc, {
                rating: newUserRating.toString(),
            }).then(() => {
                console.log("Document successfully updated!");
                //reload the page
                location.reload();
            }).catch((error) => {
                console.error("Error updating document: ", error);
            });
        });
    }

})(jQuery);