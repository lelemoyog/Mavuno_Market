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
                document.querySelector('.dropdown-menu').style.display = "none";
                var cartBtn =  document.getElementById("addToCartBtn1");
                if (cartBtn) {
                    cartBtn.style.display = "block";
                }
                $('#profile').hover(function () {
                    $('#signupModal').modal('show');
                });
                $('#img').show();
                $('img').addClass('mt-2');
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
                var btn = document.getElementById("addToCartBtn1");
                if (btn) {
                    btn.style.display = "block";
                }
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
                fetchDashOrderProducts()
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

    // make nav links active on click after reload
    $(document).ready(function () {
        var url = window.location;
        console.log(url);
       //check if the url.pathname is equal to the href of the nav link and add the active class
       var navHref = document.querySelectorAll('.nav-link');
       //loop through the nav links and check if the href is equal to the url.pathname
         for (let i = 0; i < navHref.length; i++) {
              if (navHref[i].href === url.href || navHref[i].href === "#product" || navHref[i].href === "#footer") {
                navHref[i].classList.add('active');
              }
         }
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
                 var data = change.doc.data();
                 var status = data.status;
                var accessLevel = localStorage.getItem('accesslevel');
                var notificationStatus = localStorage.getItem('notificationStatus');
                if (accessLevel === "farmer" && status === "pending") {
                    createPushNotification()
                } else if (accessLevel === "farmer" && status === "paid") {
                    createPushNotification1()
                } else if (accessLevel === "vendor" && status === "approved") {
                    createPushNotification2()
                } else if (accessLevel === "farmer" && status === "completed") {
                    var price = data.price;
                    var quantity = data.quantity;
                    var total = price * quantity;
                    createPushNotification3(total)
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
                fetchOrderProducts();
                const audio = document.getElementById('notificationSound');
                audio.play();
                new Notification('Order Status', {
                    body: 'your a new payment',
                    icon: '/static/img/logo.png',
                });
            }
        });
    }

    function createPushNotification2() {
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

    function createPushNotification3(total) {
        //get permission from the user
        Notification.requestPermission().then(function (result) {
            if (result === 'granted') {
                fetchOrderProducts();
                const audio = document.getElementById('notificationSound');
                audio.play();
                new Notification('Order Status', {
                    body: 'Confirm you have received ' + total + ' ksh',
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


    window.fetchCartProducts = function () {
        document.querySelector("#cartHolder").innerHTML = "";
        //get the user id
        var uid = localStorage.getItem('uid');
        //get the cart collection
        getDocs(query(collection(db, uid))).then(docSnap => {
            let products = [];
            docSnap.forEach((doc) => {
                //check if status = completed and remove from list jst remove do not delete
                products.push({ ...doc.data(), id: doc.id })
                products = products.filter(product => product.status !== "completed");
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

                var input = document.createElement('input');
                input.type = "text";
                //make it no editable
                input.disabled = true;
                //make it transparent
                input.style.backgroundColor = "transparent";
                input.className = "form-control form-control-sm text-center border-0";
                input.value = product.quantity;
                input.id = "cartInput";
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
                var p4 = document.createElement('p');
                var p5 = document.createElement('p');
                p3.className = "mb-0 mt-4";
                p4.className = "mb-0 mt-4";
                p5.className = "mb-0 mt-4";
                // p4.style.display = "none";
                // p5.style.display = "none";
                p4.id = "phone";
                p5.id = "amount";
                p3.innerHTML = product.price * product.quantity;
                td4.appendChild(p3);
                td4.appendChild(p4);
                td4.appendChild(p5);
                productRow.appendChild(td4);

                var td5 = document.createElement('td');

                var button3 = document.createElement('button');
                var button4 = document.createElement('button');
                var button5 = document.createElement('button');
                var button6 = document.createElement('button');
                var button7 = document.createElement('button');
                var button8 = document.createElement('button');
                button6.setAttribute('data-bs-toggle', 'modal');
                button6.setAttribute('data-bs-target', '#exampleModalTogg');
                button4.setAttribute('data-bs-toggle', 'modal');
                button4.setAttribute('data-bs-target', '#exampleModalToggle');
                button7.setAttribute('data-bs-toggle', 'modal');
                button7.setAttribute('data-bs-target', '#exampleModalT');
                button3.className = "btn btn-md rounded-circle bg-light border mt-4";
                button4.className = "btn btn-md rounded-circle bg-light border mt-4";
                button5.className = "btn btn-md rounded-circle bg-light border mt-4";
                button6.className = "btn btn-md rounded-circle bg-light border mt-4";
                button7.className = "btn btn-md rounded-circle bg-light border mt-4 ms-2";
                button8.className = "btn btn-md rounded-circle bg-light border mt-4 ms-2";
                button3.innerHTML = "Make Order";
                button4.innerHTML = "pay";
                button5.innerHTML = 'pending';
                button6.innerHTML = 'Confirm';
                button7.innerHTML = '...';
                button8.innerHTML = "<i class='fa fa-times text-danger'></i>";
                td5.appendChild(button3);
                td5.appendChild(button4);
                td5.appendChild(button5);
                td5.appendChild(button6);
                td5.appendChild(button7);
                td5.appendChild(button8);

                // Add Bootstrap popover on click
                var Details = "Name: " + product.name + '\n' + "Price: " + product.price + '\n' + "Quantity: " + product.quantity + '\n' + "Status: " + product.status + '\n';
                Details = Details.replace(/\n/g, '<br>');
                $(button5).popover({
                    title: 'Order Details',
                    content: Details,
                    trigger: 'focus',
                    placement: 'top',
                    html: true
                });
                productRow.appendChild(td5);


                if(window.matchMedia("(max-width: 768px)").matches){
                    $('#logoutToggle2').show();
                    img.style.width = "40px";
                    img.style.height = "40px";
                    img.className = "img-fluid me-2 rounded-circle img mt-2";
                    td1.style.fontSize = "1.1em";
                    td2.style.fontSize = "1.1em";
                    td3.style.fontSize = "1.1em";
                    td4.style.fontSize = "1.1em";
                    td5.style.fontSize = "1.1em";
                    input.style.fontSize = "1.1em";
                    input.style.width = "1px !important";
                    input.style.margin = "0";
                    div2.style.width = "40px";
                    div2.className = "input-group quantity mt-3 ms-2";
                    td5.style.display = "flex";
                    button3.innerHTML = "<i class='fa fa-check'></i>";
                    button3.className = "btn btn-sm rounded-circle bg-light border mt-1";
                    button4.innerHTML = "<i class='fa fa-clock'></i>";
                    button4.className = "btn btn-sm rounded-circle bg-light border mt-1";
                    button5.innerHTML = "paid";
                    button5.className = "btn btn-sm rounded-circle bg-light border mt-1";
                    button6.innerHTML = "...";
                    button6.className = "btn btn-sm rounded-circle bg-light border mt-1 ms-1";
                    button7.className = "btn btn-sm rounded-circle bg-light border mt-1 ms-1";
                    button8.className = "btn btn-sm rounded-circle bg-light border mt-1 ms-1";
                    productRow.style.display = "flex";
                }


                //check if status is approved
                if (product.status === "approved") {
                    button3.innerHTML = "Pay";
                    button3.style.display = "none";
                    button5.style.display = "none";
                    button6.style.display = "none";
                    button8.style.display = "none";
                }
                if (product.status === "pending") {
                    button3.style.display = "none";
                    button4.style.display = "none";
                    button6.style.display = "none";
                    button8.style.display = "none";
                }
                if (product.status === "cartItem") {
                    button4.style.display = "none";
                    button5.style.display = "none";
                    button6.style.display = "none";
                    button7.style.display = "none";
                    input.disabled = false;
                }
                if (product.status === "paid") {
                    button4.style.display = "none";
                    button5.style.display = "none";
                    button3.style.display = "none";
                    button8.style.display = "none";
                }
                if (product.status === "completed") {
                    button5.innerHTML = "Completed";
                    button3.style.display = "none";
                    button4.style.display = "none";
                    button6.style.display = "none";
                    button7.style.display = "none";
                }
                //append the product row to the cart holder
                document.querySelector("#cartHolder").appendChild(productRow);

                var cartCount = products.length;
                document.querySelector("#cartCount").innerHTML = cartCount;
                console.log(cartCount);



                id = product.id;
                var price = product.price
                var quantity = product.quantity;
                var name = product.name;
                var sellerId = product.sellerId;
                var buyerId = product.buyerId;



                
                //pick the value from the html input
                // Add event listener to the button
                button3.addEventListener('click', (function (id) {
                    return function () {
                        //get the input value from the html from the target element and store it in a varviable called cartQuantity use this.parentElement.value or something simialr this an i dea am giving you
                        var cartQuantity = this.parentElement.parentElement.querySelector("input").value;
                        
                        makeOrder(id,cartQuantity);

                        //reload the page
                        $("#myAlert3").fadeTo(2000, 500).slideUp(500, function () {
                            $("#myAlert3").slideUp(1000);
                        });
                        setTimeout(function () {
                            fetchCartProducts();
                            localStorage.setItem('notificationStatus', 'on');
                        }, 5000);
                    };
                })(id));

                button4.addEventListener('click', (function (id, price, quantity, name, sellerId, buyerId) {
                    return function () {
                        // alert('Pay ' + id + '\n' +'Price: ' + price);
                        document.querySelector("#OrderID").innerHTML = id;
                        document.querySelector("#pPrice").innerHTML = price + " ksh";
                        document.querySelector("#pQuantity").innerHTML = quantity + "kg";
                        document.querySelector("#pName").innerHTML = name;
                        let p = parseInt(price)
                        let q = parseInt(quantity)
                        let total = p * q;
                        console.log(total);
                        document.querySelector("#ptotal").innerHTML = total + ' ksh';

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
                            //    $('#phone2').val(phone);
                        });
                        getDoc(userDoc1).then(docSnap => {
                            let user = docSnap.data();
                            console.log(user);
                            var phone = user.phone;
                            phone = phone.replace(/^0+/, "254");
                            $('#phone1').val(phone);
                            $('#amount1').val(total);
                        });
                    };
                })(id, price, quantity, name, sellerId, buyerId));

                button6.addEventListener('click', (function (sellerId, price, id, buyerId, quantity) {
                    return function () {
                        //add buyerId to the local storage  
                        localStorage.setItem('buyerId', buyerId);
                        localStorage.setItem('productId', id);
                        const userDoc = doc(db, "users", sellerId);
                        //get the user document
                        getDoc(userDoc).then(docSnap => {
                            let user = docSnap.data();
                            console.log(user);
                            //display the user info in the profile page
                            var phone = user.phone;
                            phone = phone.replace(/^0+/, "254");
                            $('#phone3').val(phone);

                            let p = parseInt(price)
                            let q = parseInt(quantity)
                            let total = p * q;
                            $('#amount3').val(total);
                            // updateOrderStatus1(id, buyerId)
                            // window.location.href = "/b2c/";
                            //remove the starting zero and replace with 254 from user.phone

                        });

                    }
                })(sellerId, price, id, buyerId, quantity));

                button7.addEventListener('click', (function (id, price, quantity, name, sellerId, buyerId) {
                    return function () {
                        const userDoc = doc(db, "users", sellerId);
                        //get the user document
                        getDoc(userDoc).then(docSnap => {
                            let user = docSnap.data();
                            console.log(user);
                            //display the user info in the profile page
                            var phone = user.phone;
                            var img;
                            var location = user.location;
                            var username = user.name;
                            if (user.imgUrl == "") {
                                var img = "https://www.w3schools.com/w3images/avatar2.png";
                            } else {
                                var img = user.imgUrl;
                            }
                            document.querySelector("#dFName").innerHTML = username;
                            document.querySelector("#nm").innerHTML = phone;
                            document.querySelector("#dFLocation").innerHTML = location;
                            document.querySelector("#dFImg").src = img;
                            document.querySelector("#dpName").innerHTML = name;
                            document.querySelector("#dpPrice").innerHTML = price;
                            document.querySelector("#dpQuantity").innerHTML = quantity;
                            // window.location.href = "/b2c/";
                            //remove the starting zero and replace with 254 from user.phone

                        });
                    }
                })(id, price, quantity, name, sellerId, buyerId));

                button8.addEventListener('click', (function (productId) {
                    return function () {
                        //delete the product
                        deleteProduct(productId);
                        //remove the product from the cart
                        this.parentElement.parentElement.remove();
                    };
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
        getDocs(query(collection(db, "products"), limit(12))).then(docSnap => {
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
                products = products.filter(product => product.status !== "completed");
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
                img.className = "img-fluid me-5 rounded-circle img";
                img.style.width = "80px";
                img.style.height = "80px";
                //create a meadia query at max width of 768px and set the width to 40px
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

                var input = document.createElement('input');
                input.type = "text";
                input.className = "form-control form-control-sm text-center border-0";
                input.style.backgroundColor = "transparent";
                input.value = product.quantity;
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
                p3.innerHTML = product.price * product.quantity;
                td4.appendChild(p3);
                productRow.appendChild(td4);

                var td5 = document.createElement('td');

                var button3 = document.createElement('button');
                var button4 = document.createElement('button');
                var button5 = document.createElement('button');
                var button6 = document.createElement('button');
                button3.className = "btn btn-md rounded-circle bg-light border mt-4";
                button4.className = "btn btn-md rounded-circle bg-light border mt-4";
                button5.className = "btn btn-md rounded-circle bg-light border mt-4";
                button6.className = "btn btn-md rounded-circle bg-light border mt-4 ms-2";
                button6.setAttribute('data-bs-toggle', 'modal');
                button6.setAttribute('data-bs-target', '#exampleModalT');
                button3.innerHTML = "Aprove Order";
                button4.innerHTML = "Pending";
                button5.innerHTML = "Paid, waiting release";
                button6.innerHTML = "...";
                td5.appendChild(button3);
                td5.appendChild(button4);
                td5.appendChild(button5);
                td5.appendChild(button6);
                productRow.appendChild(td5);

                if(window.matchMedia("(max-width: 768px)").matches){
                    img.style.width = "40px";
                    img.style.height = "40px";
                    img.className = "img-fluid me-2 rounded-circle img mt-2";
                    td1.style.fontSize = "1.1em";
                    td2.style.fontSize = "1.1em";
                    td3.style.fontSize = "1.1em";
                    td4.style.fontSize = "1.1em";
                    td5.style.fontSize = "1.1em";
                    input.style.fontSize = "1.1em";
                    input.style.width = "1px !important";
                    input.style.margin = "0";
                    div2.style.width = "40px";
                    div2.className = "input-group quantity mt-3 ms-2";
                    td5.style.display = "flex";
                    button3.innerHTML = "<i class='fa fa-check'></i>";
                    button3.className = "btn btn-sm rounded-circle bg-light border mt-1";
                    button4.innerHTML = "<i class='fa fa-clock'></i>";
                    button4.className = "btn btn-sm rounded-circle bg-light border mt-1";
                    button5.innerHTML = "paid";
                    button5.className = "btn btn-sm rounded-circle bg-light border mt-1";
                    button6.innerHTML = "...";
                    button6.className = "btn btn-sm rounded-circle bg-light border mt-1 ms-1";
                    productRow.style.display = "flex";
                }

                var Details = "Name: " + product.name + '\n' + "Price: " + product.price + '\n' + "Quantity: " + product.quantity + '\n' + "Status: " + product.status + '\n';
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
                    input.disabled = true;
                }
                if (product.status === "pending") {
                    button4.style.display = "none";
                    button5.style.display = "none";
                    
                }
                if (product.status === "paid") {
                    button4.style.display = "none";
                    button3.style.display = "none";
                    input.disabled = true;
                }
                //append the product row to the cart holder
                document.querySelector("#cartHolder").appendChild(productRow);

                var cartCount = products.length
                document.querySelector("#cartCount").innerHTML = cartCount;
                id = product.id;
                var price = product.price
                var quantity = product.quantity;
                var name = product.name;
                var sellerId = product.sellerId;
                var buyerId = product.buyerId;
                // Add event listener to the button
                button3.addEventListener('click', (function (productId) {
                    return function () {
                        var cartQuantity = this.parentElement.parentElement.querySelector("input").value;
                        updateOrderStatus(productId, product.sellerId, cartQuantity);
                        localStorage.setItem('notificationStatus', 'off');
                        $("#myAlert4").fadeTo(2000, 500).slideUp(500, function () {
                            $("#myAlert4").slideUp(500);
                            $('#spinner').addClass('show');
                            fetchOrderProducts();
                            setTimeout(function () {
                                $('#spinner').removeClass('show');
                            }, 2000);
                        });
                    };
                })(id));

                button6.addEventListener('click', (function (id, price, quantity, name, sellerId, buyerId) {
                    return function () {
                        const userDoc = doc(db, "users", buyerId);
                        //get the user document
                        getDoc(userDoc).then(docSnap => {
                            let user = docSnap.data();
                            console.log(user);
                            //display the user info in the profile page
                            var phone = user.phone;
                            var img;
                            var location = user.location;
                            var username = user.name;
                            if (user.imgUrl == "") {
                                var img = "https://www.w3schools.com/w3images/avatar2.png";
                            } else {
                                var img = user.imgUrl;
                            }
                            document.querySelector("#dFName").innerHTML = username;
                            document.querySelector("#nm").innerHTML = phone;
                            document.querySelector("#dFLocation").innerHTML = location;
                            document.querySelector("#dFImg").src = img;
                            document.querySelector("#dpName").innerHTML = name;
                            document.querySelector("#dpPrice").innerHTML = price;
                            document.querySelector("#dpQuantity").innerHTML = quantity;
                            // window.location.href = "/b2c/";
                            //remove the starting zero and replace with 254 from user.phone

                        });
                    }
                })(id, price, quantity, name, sellerId, buyerId));

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
                p2.className = "mt-4";
                p2.innerHTML = product.price;
                td2.appendChild(p2);
                productRow.appendChild(td2);

                var td3 = document.createElement('td');

                var div2 = document.createElement('div');
                div2.className = "input-group quantity mt-4";
                // div2.style.width = "100px";

                var div3 = document.createElement('div');
                div3.className = "input-group-btn";

                var button1 = document.createElement('button');
                button1.className = "btn btn-sm btn-minus rounded-circle bg-light border";
                button1.innerHTML = '<i class="fa fa-minus"></i>';
                // div3.appendChild(button1);

                div2.appendChild(div3);

                var input = document.createElement('p');
                input.className = "mb-0 mt-0";
                input.innerHTML = product.quantity;
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
                var td5 = document.createElement('td');

                var p3 = document.createElement('p');
                var p4 = document.createElement('p');
                p3.className = "mb-0 mt-4";
                p4.className = "mb-0 mt-4";
                p3.innerHTML = product.price;
                p4.innerHTML = product.status;
                td4.appendChild(p3);
                td5.appendChild(p4);
                productRow.appendChild(td4);
                productRow.appendChild(td5);

                var td5 = document.createElement('td');

                var button3 = document.createElement('button');
                var button4 = document.createElement('button');
                button3.className = "btn btn-md rounded-circle bg-light border mt-2";
                button4.className = "btn btn-md rounded-circle bg-light border mt-4";
                button3.innerHTML = "<i class='fa fa-times text-danger'></i>";
                button4.innerHTML = "Pending";
                td5.appendChild(button3);
                productRow.appendChild(td5);

                var Details = "Name: " + product.name + '\n' + "Price: " + product.price + '\n' + "Quantity: " + product.quantity + '\n' + "Status: " + product.status + '\n';
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
                id = product.id;
                // Add event listener to the button
                button3.addEventListener('click', (function (productId) {
                    return function () {
                        //delete the product
                        deleteProduct(productId);
                        //remove the product from the cart
                        this.parentElement.parentElement.remove();
                    };
                })(id));



            };
        });
    };

    function fetchDashOrderProducts() {
        const cartHolder1 = document.querySelector("#cartHolder2");
        const posts = document.querySelector("#posts");

       
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
                p2.className = "mt-4";
                p2.innerHTML = product.price;
                td2.appendChild(p2);
                productRow.appendChild(td2);

                var td3 = document.createElement('td');

                var div2 = document.createElement('div');
                div2.className = "input-group quantity mt-4";
                // div2.style.width = "100px";

                var div3 = document.createElement('div');
                div3.className = "input-group-btn";

                var button1 = document.createElement('button');
                button1.className = "btn btn-sm btn-minus rounded-circle bg-light border";
                button1.innerHTML = '<i class="fa fa-minus"></i>';
                // div3.appendChild(button1);

                div2.appendChild(div3);

                var input = document.createElement('p');
                input.className = "mb-0 mt-0";
                input.innerHTML = product.quantity;
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
                var td5 = document.createElement('td');

                var p3 = document.createElement('p');
                var p4 = document.createElement('p');
                p3.className = "mb-0 mt-4";
                p4.className = "mb-0 mt-4";
                p3.innerHTML = product.price;
                p4.innerHTML = product.status;
                td4.appendChild(p3);
                td5.appendChild(p4);
                productRow.appendChild(td4);
                productRow.appendChild(td5);

                var td5 = document.createElement('td');

                var button3 = document.createElement('button');
                var button4 = document.createElement('button');
                button3.className = "btn btn-md rounded-circle bg-light border mt-2";
                button4.className = "btn btn-md rounded-circle bg-light border mt-4";
                button3.innerHTML = "<i class='fa fa-times text-danger'></i>";
                button4.innerHTML = "Pending";
                td5.appendChild(button3);
                productRow.appendChild(td5);

                var Details = "Name: " + product.name + '\n' + "Price: " + product.price + '\n' + "Quantity: " + product.quantity + '\n' + "Status: " + product.status + '\n';
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
                var cartHolder = document.querySelector("#cartHolder2");
                if (cartHolder) {
                    cartHolder.appendChild(productRow);
                }
                id = product.id;
                // Add event listener to the button
                button3.addEventListener('click', (function (productId) {
                    return function () {
                        //delete the product
                        deleteProduct(productId);
                        //remove the product from the cart
                        this.parentElement.parentElement.remove();
                    };
                })(id));



            };
        });
    };


    function fetchProducts5() {
        //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
        clearBox();
        var uid = localStorage.getItem('uid');
        getDocs(query(collection(db, "products"), where("sellerId", "==", uid), limit(6))).then(docSnap => {
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
                img.className = "img-fluid w-100 h-40 rounded-top";
                img.alt = name;
                img.style.height = "200px";

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
    //update order status

    function updateOrderStatus(productId, sellerId,cartQuantity) {
        //get the product id
        //get the product document
        const productDoc = doc(db, sellerId, productId);
        //get the product document
        getDoc(productDoc).then((docSnap) => {
            let product = docSnap.data();
            //conver to plain js object
            const productObj = {
              // assign a default value if quantity is undefined
                status: "approved",
                quantity: cartQuantity,
               
            };
            //add product to the database use setDoc and the document id to the product object
            //get uid
            var cartDoc = doc(db, product.buyerId, product.id);
            var orderDoc = doc(db, product.sellerId, product.orderId);
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
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
        });
    }

    //get the product id

    function makeOrder(productId, cartQuantity) {
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
                quantity: cartQuantity,
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
                        orderId: docRef.id,
                        quantity: cartQuantity,
                    }).then(() => {
                        //update the product status
                        updateDoc(productDoc, {
                            status: "pending",
                            orderId: docRef.id,
                            quantity: cartQuantity,
                        }).then(() => {
                            console.log("Order successfully written!");
                        })
                    })

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
            window.fetchCartProducts();
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




