import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot,query, limit, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
    getAuth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
         
        } else {
          // No user is signed in.
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
        $('#postBtn').hide();
    }


    //check if user has an image
    if (user.imgUrl === "") {
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

    // Fetch data from Firebase and populate the carousel
    function fetchVegetables() {
        // Replace "your-collection" with the actual collection name in your Firebase database
        const collectionRef = collection(db, "products");

        // Fetch the documents from the collection
        getDocs(collectionRef).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // Access the data of each document
                const data = doc.data();

                // Create a carousel item using the data
                const carouselItem = `
                    <div class="carousel-item">
                        <img src="${data.imgUrl}" alt="${data.name}">
                        <h3>${data.name}</h3>
                        <p>${data.category}</p>
                    </div>
                `;

                // Append the carousel item to the vegetable carousel
                $(".vegetable-carousel").owlCarousel("add", carouselItem);
            });

            // Refresh the carousel to display the new items
            $(".vegetable-carousel").owlCarousel("refresh");
        });
    }

    // Call the fetchVegetables function to populate the carousel
    // fetchVegetables();

    function fetchProductsc(){
        //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
        clearBox();
      
        getDocs(query(collection(db, "products"),  where("category", "==", "fruits"), limit(6))).then(docSnap => {
          let Products = [];
          docSnap.forEach((doc) => {
            Products.push({ ...doc.data(), id: doc.id })
          });
          console.log("Documentc data:", Products);
          let goods = Products.length;
          console.log(Products);
          const veiwGoods = document.querySelector("#productHolderC");
         
          for (let i = 0; i < goods; i++) {
            var name  = Products[i]['name'];
            var price = Products[i]['price'];
            var category = Products[i]['category'];
            var imgUrl = Products[i]['imgUrl'];
            var id = Products[i]['id'];
            
        //     <div class="border border-primary rounded position-relative vesitable-item">
        //     <div class="vesitable-img">
        //         <img src="{% static 'img/vegetable-item-6.jpg' %}" class="img-fluid w-100 rounded-top" alt="">
        //     </div>
        //     <div class="text-white bg-primary px-3 py-1 rounded position-absolute" style="top: 10px; right: 10px;">Vegetable</div>
        //     <div class="p-4 rounded-bottom">
        //         <h4>Parsely</h4>
        //         <p>Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod te incididunt</p>
        //         <div class="d-flex justify-content-between flex-lg-wrap">
        //             <p class="text-dark fs-5 fw-bold mb-0">$4.99 / kg</p>
        //             <a href="#" class="btn border border-secondary rounded-pill px-3 text-primary"><i class="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
        //         </div>
        //     </div>
        // </div> use this
      
            // var product = document.createElement("div");
            // product.className = "col-md-6 col-lg-4 col-xl-3";
      
            //add objects to  var carouselContainer = $(".vegetable-carousel");
            var carouselContainer = $(".vegetable-carousel");
            
      
            var fruiteItem = document.createElement("div");
            fruiteItem.className = "border border-primary rounded position-relative vesitable-item";
      
            var fruiteImg = document.createElement("div");
            fruiteImg.className = "vesitable-img";
      
            var img = document.createElement("img");
            img.src = imgUrl;
            img.className = "img-fluid w-100 rounded-top";
            img.alt = name;
      
            var textWhite = document.createElement("div");
            textWhite.className = "text-white bg-primary px-3 py-1 rounded position-absolute";
            textWhite.style.top = "10px";
            textWhite.style.right = "10px";
            textWhite.innerHTML = category;
      
            var border = document.createElement("div");
            border.className = "p-4 rounded-bottom";
      
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
      
            veiwGoods.owlCarousel("add", fruiteItem);
            fruiteItem.appendChild(fruiteImg);
            fruiteImg.appendChild(img);
            fruiteItem.appendChild(textWhite);
            fruiteItem.appendChild(border);
            border.appendChild(h4);
            border.appendChild(dFlex);
            dFlex.appendChild(p);
            dFlex.appendChild(a);
      
            veiwGoods.owlCarousel({
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
            });;
      
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

    function clearBox() {
        var veiwGoods = document.getElementById('productHolderC');
        veiwGoods.innerHTML = "";
    }

      
    // Modal Video
    $(document).ready(function () {
        fetchProductsc();
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

    // <!--Location Picker Form using google map api and bootstrap modal-->
    // <!--https://www.codecheef.org/article/location-picker-form-using-google-map-api-and-bootstrap-modal-->
    // <!--https://developers.google.com/maps/documentation/javascript/get-api-key-->
    // <!--https://developers.google.com/maps/documentation/javascript/overview-->
    // <!--https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-->
    // <!--https://developers.google.com/maps/documentation/javascript/examples/places-searchbox-->
    // <!--https://developers.google.com/maps/documentation/javascript/places-autocomplete-->
    // <!--https://developers.google.com/maps/documentation/javascript/places-->


})(jQuery);




