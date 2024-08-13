import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, setDoc, updateDoc, query, where, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { User } from "/static/js/classes.js";
import { firebaseConfig } from "/static/js/firebaseSDK.js";

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
            $("#havesting").text(product.availabilityWindowEnd);
            var uid = product.sellerId;
            localStorage.setItem('productSellerId', uid);
            getUser(uid)
        });
    });


    function getUser(uid) {
        const userDoc = doc(db, "users", uid);
        getDoc(userDoc).then(docSnap => {
            let user = docSnap.data();
            console.log(user);
            //display the famer image

            if (user.imgUrl == "" || user.imgUrl == null) {
                var image = "https://www.w3schools.com/w3images/avatar2.png";
                $('#descriptionFamerImg').attr('src', image);
            } else {
                $('#descriptionFamerImg').attr('src', user.imgUrl);
            }
            console.log(user.imgUrl);
            $('#descriptionFamerName').text(user.name);
            $('#descriptionFamerAbout').text(user.about);
            $('#descriptionFamerLocation').text(user.location);
            $('#descriptionFamerPhone').text(user.phone);

        });

        getDoc(doc(db, "verificationRequests", uid)).then((docSnap) => {
            if (docSnap.exists()) {
              var data = docSnap.data();
              if (data.status == "verified") {
                document.querySelector("#checkVerify").style.display = "block";
              }
            }
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

    function fetchCaroselProducts(category) {
        document.querySelector("#cartHolder").innerHTML = "";

        //get the cart collection
        getDocs(query(collection(db, "products"), where("category", "==", category), limit(12))).then(docSnap => {
            let products = [];
            docSnap.forEach((doc) => {
                products.push({ ...doc.data(), id: doc.id })
            });
            console.log("this: " + products);
            //display the products in the cart use doe loop let i = o and use js to create the elements
            for (let i = 0; i < products.length; i++) {
                //get the product
                var product = products[i];
                //create the elements
                var caroselItem = document.createElement('div');
                caroselItem.className = "carousel-item rounded";
                if (i === 0) caroselItem.classList.add('active');
                var img = document.createElement('img');
                img.style.height = "400px";
                img.src = product.imgUrl;
                img.className = "img-fluid w-100 bg-success rounded";
                img.alt = product.name;
                caroselItem.appendChild(img);
                var a = document.createElement('a');
                a.className = "btn btn-outline-success";
                a.innerHTML = product.category;
                caroselItem.appendChild(a);
                var caroselHolder = document.querySelector("#caroselHolder");
                if (caroselHolder) {
                    caroselHolder.appendChild(caroselItem);
                }
                console.log(product.category);

                let goods = products.length;
                var id = product.id;
                for (let i = 0; i < goods; i++) {
                    // ... existing code ...

                    (function (id) {
                        a.addEventListener('click', function () {
                            localStorage.setItem('productId', id);
                            console.log(id);
                            window.location.href = "/description/";
                        });
                    })(id);
                }


            };
        });
    };
    var category = localStorage.getItem('category');
    fetchCaroselProducts(category);



    $('document').ready(function () {
        var uid = localStorage.getItem('uid');
        //fetch complete orders 
        getDocs(query(collection(db, uid), where("status", "==", "completed"))).then(docSnap => {
            let products = [];
            docSnap.forEach((doc) => {
                products.push({ ...doc.data(), id: doc.id })
            });
            console.log("complete" + products);
            //display the products in the cart use doe loop let i = o and use js to create the elements
            var id = localStorage.getItem('productId');
            for (let i = 0; i < products.length; i++) {
                if (products[i].orderId == id) {
                    document.querySelector("#reviewForm").style.display = "block";
                }
            }
        });


        //create an event listner for hover
        $('#one').hover(function () {
            $('#one').addClass('text-secondary starz');
            $('#two').removeClass('text-secondary starz');
            $('#three').removeClass('text-secondary starz');
            $('#four').removeClass('text-secondary starz');
            $('#five').removeClass('text-secondary starz');
        });
        $('#two').hover(function () {
            $('#one').addClass('text-secondary starz');
            $('#two').addClass('text-secondary starz');
            $('#three').removeClass('text-secondary starz');
            $('#four').removeClass('text-secondary starz');
            $('#five').removeClass('text-secondary starz');
        });
        $('#three').hover(function () {
            $('#one').addClass('text-secondary starz');
            $('#two').addClass('text-secondary starz');
            $('#three').addClass('text-secondary starz');
            $('#four').removeClass('text-secondary starz');
            $('#five').removeClass('text-secondary starz');
        });
        $('#four').hover(function () {
            $('#one').addClass('text-secondary starz');
            $('#two').addClass('text-secondary starz');
            $('#three').addClass('text-secondary starz');
            $('#four').addClass('text-secondary starz');
            $('#five').removeClass('text-secondary starz');
        });

        $('#five').hover(function () {
            $('#one').addClass('text-secondary starz');
            $('#two').addClass('text-secondary starz');
            $('#three').addClass('text-secondary starz');
            $('#four').addClass('text-secondary starz');
            $('#five').addClass('text-secondary starz');
        });


        //create an event listner for click
        $('#one').click(function () {
            $('#one').addClass('text-secondary starz');
            $('#two').removeClass('text-secondary starz');
            $('#three').removeClass('text-secondary starz');
            $('#four').removeClass('text-secondary starz');
            $('#five').removeClass('text-secondary starz');
        });
        $('#two').click(function () {
            $('#one').addClass('text-secondary starz');
            $('#two').addClass('text-secondary starz');
            $('#three').removeClass('text-secondary starz');
            $('#four').removeClass('text-secondary starz');
            $('#five').removeClass('text-secondary starz');
        });
        $('#three').click(function () {
            $('#one').addClass('text-secondary starz');
            $('#two').addClass('text-secondary starz');
            $('#three').addClass('text-secondary starz');
            $('#four').removeClass('text-secondary starz');
            $('#five').removeClass('text-secondary starz');
        });
        $('#four').click(function () {
            $('#one').addClass('text-secondary starz');
            $('#two').addClass('text-secondary starz');
            $('#three').addClass('text-secondary starz');
            $('#four').addClass('text-secondary starz');
            $('#five').removeClass('text-secondary starz');
        });

        $('#five').click(function () {
            $('#one').addClass('text-secondary starz');
            $('#two').addClass('text-secondary starz');
            $('#three').addClass('text-secondary starz');
            $('#four').addClass('text-secondary starz');
            $('#five').addClass('text-secondary starz');
        });


        
        var id = localStorage.getItem('productId');
        getDocs(query(collection(db, "comments"), where("productId", "==", id))).then(docSnap => {
            let comments = [];
            docSnap.forEach((doc) => {
                comments.push({ ...doc.data(), id: doc.id })
            });
            console.log(comments);
            //display the comments
            var rate = 0;
            var rating;
            var numberOfRatings;
            for (let i = 0; i < comments.length; i++) {
                //get the comment
                var comment = comments[i];
                //create the elements
                var commentDiv = document.createElement('div');
                commentDiv.className = "d-flex";
                var img = document.createElement('img');
                img.className = "img-fluid rounded-circle p-3";
                img.style.width = "100px";
                img.style.height = "100px";
                img.alt = "";
                commentDiv.appendChild(img);
                var div = document.createElement('div');
                div.className = "";
                var p = document.createElement('p');
                p.className = "mb-2";
                p.style.fontSize = "14px";
                p.innerHTML = comment.date;
                div.appendChild(p);
                var div2 = document.createElement('div');
                div2.className = "d-flex justify-content-between";
                var h5 = document.createElement('h5');
                div2.appendChild(h5);
                var div3 = document.createElement('div');
                div3.className = "d-flex mb-3";
                for (let i = 0; i < comment.rating; i++) {
                    var iz = document.createElement('i');
                    iz.className = "fa fa-star ms-2 text-success";
                    div3.appendChild(iz);
                }
                div2.appendChild(div3);
                div.appendChild(div2);
                var p2 = document.createElement('p');
                p2.innerHTML = comment.comment;
                div.appendChild(p2);
                commentDiv.appendChild(div);
                var commentsHolder = document.querySelector("#nav-mission");
                if (commentsHolder) {
                    commentsHolder.appendChild(commentDiv);
                }

           
                    var uid = comment.uid;
                   rating = comment.rating;
                    numberOfRatings = comments.length;
                    (function (uid, img, h5, rating, numberOfRatings) {
                       
                       rate += parseInt(rating);
                       console.log(rate);
                       console.log(numberOfRatings);
                       
                            //get the user document
                           
                            const userDoc = doc(db, "users", uid);
                            getDoc(userDoc).then(docSnap => {
                                let user = docSnap.data();
                                console.log(user);
                                //display the famer image

                                var image = user.imgUrl ? user.imgUrl : "https://www.w3schools.com/w3images/avatar2.png";
                                img.src = image;
                                h5.innerHTML = user.name;
                            });
                      


                    })(uid, img, h5, rating, numberOfRatings);
                
                };

                var newRating = rate / numberOfRatings;

                console.log(newRating.toFixed(0));

                var starHolder = document.querySelector("#starholder");
                if(comments.length != 0){
                for (let i = 0; i < newRating.toFixed(0); i++) {
                    var iz = document.createElement('i');
                    iz.className = "fa fa-star ms-2 text-success";
                    starHolder.appendChild(iz);
                }
            }
            });


    });

    //create an event listner for click

    $('#commentBtn').click(function () {
        //get the user id
        var uid = localStorage.getItem('uid');
        //get productSellerId
        var productSellerId = localStorage.getItem('productSellerId');
        //get the product id
        var id = localStorage.getItem('productId');
        //get the comment
        var comment = $('#comment').val();
        //get the rating
        var rating = $('.starz').length;

        //get the date
        var date = new Date().toLocaleString();
        //create a comment object
        var commentObj = {
            uid: uid,
            productId: id,
            comment: comment,
            rating: rating,
            date: date,
            sellerId: productSellerId
        };
        //add the comment to the database
        addComment(commentObj);
    });

    function addComment(commentObj) {
        //add the comment to the database
        addDoc(collection(db, "comments"), commentObj).then(() => {
            console.log("Document successfully written!");
            //reload the page
            updateRating(commentObj.productId, commentObj.rating);
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    }
    //make a horizontal list scrollable by clicking the next and previous buttons

    //update the product rating

    function updateRating(productId, rating) {
        //get the product document
        const productDoc = doc(db, "products", productId);
        //get the product document
        getDoc(productDoc).then(docSnap => {
            let product = docSnap.data();
            var sellerId = product.sellerId;
            //get the product rating
            var productRating = product.rating;
            //calculate the new rating
            var newRating = parseInt(productRating) + parseInt(rating);
            //update the product rating
            updateDoc(productDoc, {
                rating: newRating.toString(),
            }).then(() => {
                console.log("Document successfully updated!");
                //update the user rating
                updateUserRating(sellerId, rating);
            }).catch((error) => {
                console.error("Error updating document: ", error);
            });
        });
    }



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


    function addProduct(id) {
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