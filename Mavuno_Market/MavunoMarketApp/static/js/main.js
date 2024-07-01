import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where, setDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
        fetchCaroselProducts()
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
            $('#userPhone').val(user.phone);
            $('#profileUserPhone').text(user.phone);
            //add image to image tag in profile page
            //check user category and hide the #postBtn if user is vendor
            if (user.accesslevel === "vendor") {
                //add accesslevel to the local storage
                localStorage.setItem('accesslevel', user.accesslevel);
                $('#addToCartBtn').show();
                document.getElementById('exampleModalLabel1').innerHTML = "My Cart";
                fetchCartProducts();
                fetchProfileOrderProducts()
            }
            if (user.accesslevel === "farmer") {
                //add accesslevel to the local storage
                localStorage.setItem('accesslevel', user.accesslevel);
                localStorage.setItem('notificationStatus', 'on');
                console.log('farmer');
                $('#postBtn').show();
                document.getElementById('exampleModalLabel1').innerHTML = "My Orders";
                fetchOrderProducts()
                fetchProducts5()
                var posts1Element = document.querySelector("#posts1");
                if (posts1Element) {
                    posts1Element.innerHTML = "";
                }
                document.getElementById('dash').style.display = "inline";
                
            }


            //check if user has an image
            if (user.imgUrl === "" || user.imgUrl === null) {
                //use bootstrap to show the span with the user initials
                localStorage.setItem('notificationStatus', 'off');
                $('#userName').removeClass('d-none');
                $('#img2').attr('src', "https://bootdey.com/img/Content/avatar/avatar3.png");
            } else {
                //hide the default image

                //show the user image using show() method n jquery
                $('#img').show();
                $('#img').attr('src', user.imgUrl);
                $('#img2').attr('src', user.imgUrl);
                localStorage.setItem('productPhotoUrl', user.imgUrl);
            }
        });




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
    

//listen for change in database using onSnapshot when field is updated in the database when the status field is updated in the database
var uid = localStorage.getItem('uid');
onSnapshot(query(collection(db, uid)), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
            console.log("Modified city: ", change.doc.data());
            
            var accessLevel = localStorage.getItem('accesslevel');
            var notificationStatus = localStorage.getItem('notificationStatus');
            if (accessLevel === "farmer" && notificationStatus === "on") {
            createPushNotification()
            }else if(accessLevel === "vendor" && notificationStatus === "on"){
                createPushNotification1()
            }
        }
    });

});
//create push notification
Notification.requestPermission();
function createPushNotification() {
    //get permission from the user
    Notification.requestPermission().then(function (result) {
        if (result === 'granted') {
            fetchOrderProducts();
            const audio = document.getElementById('notificationSound');
            audio.play();
           new Notification('Order Status', {
                body: 'you have a new order',
                icon: '/static/img/logo.png',
           });
        }
    });
}

function createPushNotification1() {
    //get permission from the user
    Notification.requestPermission().then(function (result) {
        if (result === 'granted') {
            fetchCartProducts();
            const audio = document.getElementById('notificationSound');
            audio.play();
           new Notification('Order Status', {
                body: 'order Approved',
                icon: '/static/img/logo.png',
           });
        }
    });
}


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
                var button6 = document.createElement('button');
                button4.setAttribute('data-bs-toggle', 'modal');
                button4.setAttribute('data-bs-target', '#exampleModalToggle');
                button3.className = "btn btn-md rounded-circle bg-light border mt-4";
                button4.className = "btn btn-md rounded-circle bg-light border mt-4";
                button5.className = "btn btn-md rounded-circle bg-light border mt-4";
                button6.className = "btn btn-md rounded-circle bg-light border mt-4";
                button3.innerHTML = "Make Order";
                button4.innerHTML = "pay";
                button5.innerHTML = 'pending';
                button6.innerHTML = 'Confirm your have received produce';
                td5.appendChild(button3);
                td5.appendChild(button4);
                td5.appendChild(button5);
                td5.appendChild(button6);

                // Add Bootstrap popover on click
                var Details = "Name: " +product.name + '\n' + "Price: " + product.price + '\n' + "Quantity: " + product.quantity + '\n' + "Status: " + product.status + '\n' ;
                Details = Details.replace(/\n/g, '<br>');
                $(button5).popover({
                    title: 'Order Details',
                    content: Details,
                    trigger: 'focus',
                    placement: 'top',
                    html: true
                });
                productRow.appendChild(td5);
                //check if status is approved
                if (product.status === "approved") {
                    button3.innerHTML = "Pay";
                    button3.style.display = "none";
                    button5.style.display = "none";
                    button6.style.display = "none";
                }
                if (product.status === "pending") {
                    button3.style.display = "none";
                    button4.style.display = "none";
                    button6.style.display = "none";
                }
                if (product.status === "cartItem") {
                    button4.style.display = "none";
                    button5.style.display = "none";
                    button6.style.display = "none";
                }
                if (product.status === "paid") {
                    button4.style.display = "none";
                    button5.style.display = "none";
                    button3.style.display = "none";
                }
                //append the product row to the cart holder
                document.querySelector("#cartHolder").appendChild(productRow);

                var cartCount = products.length;
                document.querySelector("#cartCount").innerHTML = cartCount;


                
                id = product.id;
                var price =product.price
                var quantity = product.quantity;
                var name = product.name;
                var sellerId = product.sellerId;
                var buyerId = product.buyerId;
                // Add event listener to the button
                button3.addEventListener('click', (function(id) {
                    return function() {
                        makeOrder(id);
                        
                        //reload the page
                        $("#myAlert3").fadeTo(2000, 500).slideUp(500, function () {
                          $("#myAlert3").slideUp(1000);
                        });
                          setTimeout(function() {
                              fetchCartProducts();
                              localStorage.setItem('notificationStatus', 'on');
                          }, 5000);
                    };
                })(id));

                button4.addEventListener('click', (function(id, price, quantity, name, sellerId, buyerId) {
                    return function() {
                        // alert('Pay ' + id + '\n' +'Price: ' + price);
                        document.querySelector("#OrderID").innerHTML = id;
                        document.querySelector("#pPrice").innerHTML = price;
                        document.querySelector("#pQuantity").innerHTML = quantity;
                        document.querySelector("#pName").innerHTML = name;
                        document.querySelector("#total").innerHTML = price * quantity + " Ksh";
                        
                        //add product id and sellerId to the local storage
                        localStorage.setItem('productId', id);
                        localStorage.setItem('buyerId', buyerId);

                        //get user doc using the sellerId
                        const userDoc = doc(db, "users", sellerId);
                        const userDoc1 = doc(db, "users", buyerId);
                        //get the user document
                        getDoc(userDoc).then(docSnap => {
                            let user = docSnap.data();
                            console.log(user);
                            //display the user info in the profile page
                           document.querySelector("#fName").innerHTML = user.name;
                           //remove the starting zero and replace with 254 from user.phone
                            var phone = user.phone;
                            phone = phone.replace(/^0+/, "254");
                           $('#phone2').val(phone);
                        });
                        getDoc(userDoc1).then(docSnap => {
                            let user = docSnap.data();
                            console.log(user);
                            // document.querySelector("#phone").innerHTML = user.phone;
                            var phone = user.phone;
                            phone = phone.replace(/^0+/, "254");
                            $('#phone').val(phone);
                        });
                    };
                })(id, price, quantity, name, sellerId, buyerId));
               
                button6.addEventListener('click', (function(id) {
                    return function() {
                        window.location.href = "/b2c/";
                    }
                })(id));

                //populate the carosel with the products
                // <div class="carousel-item active rounded">
                //             <img src="{% static 'img/hero-img-1.png' %}" class="img-fluid w-100 h-100 bg-secondary rounded" alt="First slide">
                //             <a href="#" class="btn px-4 py-2 text-white rounded">Fruits</a>
                //         </div> use this code to create the elements and the div holder id is caroselHolder

               

            };
        });
    };
    

    function fetchCaroselProducts() {
        document.querySelector("#cartHolder").innerHTML = "";
        
        //get the cart collection
        getDocs(query(collection(db, "products"))).then(docSnap => {
            let products = [];
            docSnap.forEach((doc) => {
                products.push({ ...doc.data(), id: doc.id })
            });
            console.log("this: "+products);
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
                img.className = "img-fluid w-100 bg-secondary rounded";
                img.alt = product.name;
                caroselItem.appendChild(img);
                var a = document.createElement('a');
                a.className = "btn px-4 py-2 text-white rounded";
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
            
                    (function(id) {
                      a.addEventListener('click', function() {
                        localStorage.setItem('productId', id);
                        console.log(id);
                        window.location.href = "/description/";
                      });
                    })(id);
                  }


            };
        });
    };

    fetchCaroselProducts();
    
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
                var button4 = document.createElement('button');
                var button5 = document.createElement('button');
                button3.className = "btn btn-md rounded-circle bg-light border mt-4";
                button4.className = "btn btn-md rounded-circle bg-light border mt-4";
                button5.className = "btn btn-md rounded-circle bg-light border mt-4";
                button3.innerHTML = "Aprove Order";
                button4.innerHTML = "Pending";
                button5.innerHTML = "Paid, waiting release";
                td5.appendChild(button3);
                td5.appendChild(button4);
                td5.appendChild(button5);
                productRow.appendChild(td5);

                var Details = "Name: " +product.name + '\n' + "Price: " + product.price + '\n' + "Quantity: " + product.quantity + '\n' + "Status: " + product.status + '\n' ;
                Details = Details.replace(/\n/g, '<br>');

                $(button4).popover({
                    title: 'Order Details',
                    content: Details,
                    trigger: 'focus',
                    placement: 'top',
                    html: true
                });
                $(button5).popover({
                    title: 'Order Details',
                    content: Details,
                    trigger: 'focus',
                    placement: 'top',
                    html: true
                });

                //check if status is approved
                if (product.status === "approved") {
                    button3.style.display = "none";
                    button5.style.display = "none";
                }
                if (product.status === "pending") {
                    button4.style.display = "none";
                    button5.style.display = "none";
                }
                if (product.status === "paid") {
                    button4.style.display = "none";
                    button3.style.display = "none";
                }
                //append the product row to the cart holder
                document.querySelector("#cartHolder").appendChild(productRow);

                var cartCount = products.length
                document.querySelector("#cartCount").innerHTML = cartCount;
                id = product.id;
                // Add event listener to the button
                button3.addEventListener('click', (function(productId) {
                    return function() {
                        updateOrderStatus(productId,product.sellerId);
                        localStorage.setItem('notificationStatus', 'off');
                        $("#myAlert4").fadeTo(2000, 500).slideUp(500, function () {
                            $("#myAlert4").slideUp(500);
                            $('#spinner').addClass('show');
                            fetchOrderProducts();
                            setTimeout(function() {
                                $('#spinner').removeClass('show');
                              }, 2000);
                          });
                    };
                })(id));

                

            };
        });
    };

    function fetchProfileOrderProducts() {
        const cartHolder1 = document.querySelector("#cartHolder1");
        const posts = document.querySelector("#posts");

        if (cartHolder1 && posts) {
            cartHolder1.innerHTML = "";
            posts.innerHTML = "";
        }
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
                // div3.appendChild(button1);
    
                div2.appendChild(div3);
    
                var input = document.createElement('p');
                input.className = "mb-0 mt-0";
                input.innerHTML = "1";
                div2.appendChild(input);
    
                var div4 = document.createElement('div');
                div4.className = "input-group-btn";
    
                var button2 = document.createElement('button');
                button2.className = "btn btn-sm btn-plus rounded-circle bg-light border";
                button2.innerHTML = '<i class="fa fa-plus "></i>';
                // div4.appendChild(button2);
    
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
                button3.className = "btn btn-md rounded-circle bg-light border mt-2";
                button4.className = "btn btn-md rounded-circle bg-light border mt-4";
                button3.innerHTML = "<i class='fa fa-times text-danger'></i>";
                button4.innerHTML = "Pending";
                td5.appendChild(button3);
                productRow.appendChild(td5);
    
                var Details = "Name: " +product.name + '\n' + "Price: " + product.price + '\n' + "Quantity: " + product.quantity + '\n' + "Status: " + product.status + '\n' ;
                Details = Details.replace(/\n/g, '<br>');
    
                $(button4).popover({
                    title: 'Order Details',
                    content: Details,
                    trigger: 'focus',
                    placement: 'top',
                    html: true
                });
    
                //check if status is approved
                if (product.status === "approved") {
                   
                }
                if (product.status === "pending") {
                    button4.style.display = "none";
                }
                // Check if the cart holder element exists before appending the product row
                var cartHolder = document.querySelector("#cartHolder1");
                if (cartHolder) {
                    cartHolder.appendChild(productRow);
                }

                var cartCount = products.length
                document.querySelector("#cartCount").innerHTML = cartCount;
                id = product.id;
                // Add event listener to the button
                button3.addEventListener('click', (function(productId) {
                    return function() {
                        //delete the product
                        deleteProduct(productId);
                        //remove the product from the cart
                        this.parentElement.parentElement.remove();
                    };
                })(id));
    
                
    
            };
        });
    };


    function fetchProducts5(){
        //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
        clearBox();
        var uid = localStorage.getItem('uid');
        getDocs(query(collection(db, "products"),  where("sellerId", "==", uid), limit(6))).then(docSnap => {
          let Products = [];
          docSnap.forEach((doc) => {
            Products.push({ ...doc.data(), id: doc.id })
          });
          console.log("Document5 data:", Products);
          let goods = Products.length;
          console.log(Products);
          const veiwGoods = document.querySelector("#productHolder5");
    
          if (Products.length == 0) {
            veiwGoods.innerHTML = "You have no products yet, add some products";
            //make it center and bigger
            veiwGoods.style.textAlign = "center";
            veiwGoods.style.fontSize = "3em";
           }
         
          for (let i = 0; i < goods; i++) {
            var name  = Products[i]['name'];
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
            border.className = "p-4 border border-secondary border-top-0 rounded-bottom";
      
            var h4 = document.createElement("h4");
            h4.innerHTML = name;
      
            var dFlex = document.createElement("div");
            dFlex.className = "d-flex justify-content-between flex-lg-wrap";
      
            var p = document.createElement("p");
            p.className = "text-dark fs-5 fw-bold mb-0";
            p.innerHTML = `Ksh ${price} / kg`;
      
            var a = document.createElement("a");
            a.href = "#";
            a.className = "btn border border-secondary rounded-pill px-3 text-primary";
            a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-primary"></i> View Description`;
      
            if (veiwGoods) {
                veiwGoods.appendChild(product);
            }
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
      
              (function(id, name) {
                a.addEventListener('click', function() {
                  localStorage.setItem('productId', id);
                  console.log(name);
                  window.location.href = "/description/";
                });
              })(id, name);
            }
      
          }
        });
      }
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

    //send push notification to seller

    function deleteProduct(productId) {
        //delete the product from the cart
        var uid = localStorage.getItem('uid');
        deleteDoc(doc(db, uid, productId)).then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
      }

    function clearBox() {
        var productHolder = document.getElementById('productHolder5');
        if (productHolder) {
            productHolder.innerHTML = "";
        }
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




