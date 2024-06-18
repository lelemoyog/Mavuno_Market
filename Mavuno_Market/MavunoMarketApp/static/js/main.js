import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where,setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    $("#profile").click(function (event) {

        getAuth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                console.log('User is signed in');
                window.location.href = "/profile/";
            } else {
                // No user is signed in.
                window.location.href = "/signin/";
                console.log('No user is signed in');
            }
        });

    });

    $("#logOut").click(function (event) {
        getAuth().signOut().then(() => {
            // Sign-out successful.
            console.log('Sign-out successful');
            //remove user from local storage
            localStorage.removeItem('uid');
            window.location.href = "/signin/";
        }).catch((error) => {
            // An error happened.
            console.log('An error happened');
        });
    });


    //query sign in user form users collection using id from local storage
    $("document").ready(function () {
        getAuth().onAuthStateChanged(function (user) {
            if (user) {          
                // User is signed in.
                $('#logoutToggle').show();
            } else {
                // No user is signed in.
                $('#addToCartBtn').show();
                $('#profile').hover(function () {
                    $('#signupModal').modal('show');
                });
                $('#img').show();
            }
        });
        var uid = localStorage.getItem('uid');
        //getuser document
        const userDoc = doc(db, "users", uid);
        //get the user document
        getDoc(userDoc).then(docSnap => {
            let user = docSnap.data();
            console.log(user);
            //display the user info in the profile page
            var jina = getInitials(user.name);
            $('#userName').text(jina);
            $('#userN').val(user.name);
            $('.profileUserName').text(user.name);
            $('#profileUserEmail').text(user.email);
            $('#userEmail').val(user.email);
            $('#profileLocation').text(user.location);
            $('#userLocation').val(user.location);
            $('#profileCategory').text(user.accesslevel);
            $('#userAbout').val(user.about);
            //add image to image tag in profile page
            //check user category and hide the #postBtn if user is vendor
            if (user.accesslevel === "vendor") {
                $('#addToCartBtn').show();
                fetchCartProducts();
            }
            if(user.accesslevel === "farmer"){
                console.log('farmer');
                $('#postBtn').show();
                fetchOrderProducts()
            }


            //check if user has an image
            if (user.imgUrl === "" || user.imgUrl === null) {
                //use bootstrap to show the span with the user initials
                $('#userName').removeClass('d-none');
                $('#img2').attr('src', "https://bootdey.com/img/Content/avatar/avatar3.png");
            } else {
                //hide the default image

                //show the user image using show() method n jquery
                $('#img').show();
                $('#img').attr('src', user.imgUrl);
                $('#img2').attr('src', user.imgUrl);
            }
        });




        //getusers collection
        // getDocs(collection(db, "users")).then(docSnap => {
        //     let users = [];
        //     docSnap.forEach(doc => {
        //         users.push(doc.data());
        //     });

        //     //get the user with the id from local storage
        //     let user = users.find(user => user.uid === uid);
        //     console.log(user);
        //     //display the user info in the profile page
        //     var jina = getInitials(user.name);
        //     $('#userName').text(jina);
        //     $('.profileUserName').text(user.name);
        //     $('#profileUserEmail').text(user.email);
        //     $('#profileLocation').text(user.location);
        //     $('#profileCategory').text(user.accesslevel);



        // })

    });


    function getInitials(names) {
        // Split the names string into an array
        var nameArray = names.split(' ');

        // Initialize an empty string for the initials
        var initials = '';

        // Loop through the name array
        for (var i = 0; i < nameArray.length; i++) {
            // Add the first letter of each name to the initials string
            initials += nameArray[i].charAt(0).toUpperCase();
        }

        // Return the initials
        return initials;
    }

    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });


    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });




    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });

    //trigger bootstrap modal on hover
    // $('#cartModal').hover(function () {
    //     $('#exampleModal').modal('show');
    // });




    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });


    //getDocs(collection(db, uid)).then(docSnap => { and display the products
    {/* <tr>
                        <th scope="row">
                            <div class="d-flex align-items-center">
                                <img src="{% static 'img/vegetable-item-3.png' %}" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;" alt="">
                            </div>
                        </th>
                        <td>
                            <p class="mb-0 mt-4">Big Banana</p>
                        </td>
                        <td>
                            <p class="mb-0 mt-4">2.99 $</p>
                        </td>
                        <td>
                            <div class="input-group quantity mt-4" style="width: 100px;">
                                <div class="input-group-btn">
                                    <button class="btn btn-sm btn-minus rounded-circle bg-light border" >
                                    <i class="fa fa-minus"></i>
                                    </button>
                                </div>
                                <input type="text" class="form-control form-control-sm text-center border-0" value="1">
                                <div class="input-group-btn">
                                    <button class="btn btn-sm btn-plus rounded-circle bg-light border">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td>
                            <p class="mb-0 mt-4">2.99 $</p>
                        </td>
                        <td>
                            <button class="btn btn-md rounded-circle bg-light border mt-4" >
                                <i class="fa fa-times text-danger"></i>
                            </button>
                        </td>
                    
                    </tr>  */}


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
                var button4 = document.createElement('button');
                var button5 = document.createElement('button');
                button3.className = "btn btn-md rounded-circle bg-light border mt-4";
                button4.className = "btn btn-md rounded-circle bg-light border mt-4";
                button5.className = "btn btn-md rounded-circle bg-light border mt-4";
                button3.innerHTML = "Make Order";
                button4.innerHTML = "pay";
                button5.innerHTML = 'pending';
                td5.appendChild(button3);
                td5.appendChild(button4);
                td5.appendChild(button5);
                productRow.appendChild(td5);
                //check if status is approved
                if (product.status === "approved") {
                    button3.innerHTML = "Pay";
                    button3.style.display = "none";
                    button5.style.display = "none";
                }
                if (product.status === "pending") {
                    button3.style.display = "none";
                    button4.style.display = "none";
                }
                if (product.status === "cartItem") {
                    button4.style.display = "none";
                    button5.style.display = "none";
                }
                //append the product row to the cart holder
                document.querySelector("#cartHolder").appendChild(productRow);

                var cartCount = products.length;
                document.querySelector("#cartCount").innerHTML = cartCount;
                var productId = product.id;
                // Add event listener to the button
                button3.addEventListener('click', function() {
                    //get the product id
                  makeOrder(productId);
                  //re
                });
                button4.addEventListener('click', function() {
                    //get the product id
                    //add the product to the cart
                    alert('Pay ' + productId + '\n' +'Price: ' + product.price);
                    window.location.href = "https://flutterwave.com/pay/wsws9l0lhrx8";
                });
                button5.addEventListener('click', function() {
                    //get the product id
                    //add the product to the cart
                    alert('Product Details ' + productId + '\n' + "Name: " +product.name + '\n' + "Price: " + product.price + '\n' + "Quantity: " + product.quantity + '\n' + "Status: " + product.status);

                });

            };
        });
    };
    function fetchOrderProducts() {
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
                button3.innerHTML = "Aprove Order";
                td5.appendChild(button3);
                productRow.appendChild(td5);

                //check if status is approved
                if (product.status === "approved") {
                    button3.innerHTML = "Pending";
                }
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
                        alert('Aproved ' + productId);
                        updateOrderStatus(productId,product.sellerId);
                    };
                })(id));

            };
        });
    };


     //update order status
     
    function updateOrderStatus(productId, sellerId) {
        //get the product id
        //get the product document
        const productDoc = doc(db, sellerId, productId);
        //get the product document
        getDoc(productDoc).then((docSnap) => {
            let product = docSnap.data();
            //conver to plain js object
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
                status: "approved",
                availabilityWindowStart: product.availabilityWindowStart,
                availabilityWindowEnd: product.availabilityWindowEnd,
            };
            //add product to the database use setDoc and the document id to the product object
            //get uid
            var cartDoc = doc(db, product.buyerId, product.id);
            var orderDoc = doc(db, product.sellerId, product.id2);
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
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });    
        });
    }
        //get the product id

    function makeOrder(productId){
        //get the product id

          var uid = localStorage.getItem('uid');
          const productDoc = doc(db, uid, productId);
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
            quantity: product.quantity,
            status: "pending",
            availabilityWindowStart: product.availabilityWindowStart,
            availabilityWindowEnd: product.availabilityWindowEnd
          };
          //add product to the database usee setDoc and and the document id to the product object
          //get uid
        var cartCollection = collection(db, product.sellerId);
        addDoc(cartCollection, productObj)
            .then((docRef) => {
                //update the product with id2 docRef.id
                var cartDoc = doc(db, product.sellerId, docRef.id);
                var productDoc = doc(db, product.buyerId, productId);
                updateDoc(cartDoc, {
                    id2: docRef.id
                })
                //update the product status
                updateDoc(productDoc, {
                    status: "pending"
                })
                console.log("Order successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
          
        });

    }
    

    // <!--Location Picker Form using google map api and bootstrap modal-->
    // <!--https://www.codecheef.org/article/location-picker-form-using-google-map-api-and-bootstrap-modal-->
    // <!--https://developers.google.com/maps/documentation/javascript/get-api-key-->
    // <!--https://developers.google.com/maps/documentation/javascript/overview-->
    // <!--https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-->
    // <!--https://developers.google.com/maps/documentation/javascript/examples/places-searchbox-->
    // <!--https://developers.google.com/maps/documentation/javascript/places-autocomplete-->
    // <!--https://developers.google.com/maps/documentation/javascript/places-->


})(jQuery);




