import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    //query sign in user form users collection using id from local storage
    $("document").ready(function () {
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
            //check if user has an image
            if (user.imgUrl === "") {
                $('#img').attr('src', "https://bootdey.com/img/Content/avatar/avatar3.png");
                $('#img2').attr('src', "https://bootdey.com/img/Content/avatar/avatar3.png");
            } else {
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
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
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

    // <!--Location Picker Form using google map api and bootstrap modal-->
    // <!--https://www.codecheef.org/article/location-picker-form-using-google-map-api-and-bootstrap-modal-->
    // <!--https://developers.google.com/maps/documentation/javascript/get-api-key-->
    // <!--https://developers.google.com/maps/documentation/javascript/overview-->
    // <!--https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-->
    // <!--https://developers.google.com/maps/documentation/javascript/examples/places-searchbox-->
    // <!--https://developers.google.com/maps/documentation/javascript/places-autocomplete-->
    // <!--https://developers.google.com/maps/documentation/javascript/places-->


})(jQuery);




