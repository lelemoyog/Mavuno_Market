import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where, updateDoc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { Product } from "/static/js/classes.js";
import { firebaseConfig } from "/static/js/firebaseSDK.js";

// <!-- Add the Firebase Storage SDK !-->
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

//import auth from firebase
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

(function ($) {
  "use strict";
  // Import the functions you need from the SDKs you need

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  var id;

  $('#photo').change(function () {
    // fire the upload here
    $('#spinner').addClass('show');
    uploadImage();
    setTimeout(function () {
      $('#spinner').removeClass('show');
    }, 2500);
  });

  $('#video').change(function () {
    // fire the upload here
    $('#spinner').addClass('show');
    uploadVideo();
    setTimeout(function () {
      $('#spinner').removeClass('show');
    }, 2500);
  });

  $('#front').change(function () {
    // fire the upload here
    $('#spinner').addClass('show');
    uploadFrontPiImage();
    setTimeout(function () {
      $('#spinner').removeClass('show');
    }, 2500);
  });

  $('#back').change(function () {
    // fire the upload here
    $('#spinner').addClass('show');
    uploadbackPiImage();
    setTimeout(function () {
      $('#spinner').removeClass('show');
    }, 2500);
  });


  $('#btnGet').click(function () {
    //check the access level of the user
     getDoc(doc(db, "users", localStorage.getItem('uid'))).then((docSnap) => {
       if (docSnap.exists()) {
         var user = docSnap.data();
         var accessLevel = user.accesslevel;
         if (accessLevel === "farmer") {
          document.getElementById("info").textContent = "Create a documentary showing your farm and products. Method of farming, seeds used for your products and type of fertilizer you use.";
         }
         if (accessLevel === "vendor") {
           document.getElementById("info").textContent = "Create a documentary showing your shop and products. The type of products you sell and the quality of your products.";
         }
       }
    });
  });

  $('document').ready(function () {
    //get the verficationRequest document
    getDoc(doc(db, "verificationRequests", localStorage.getItem('uid'))).then((docSnap) => {
      if (docSnap.exists()) {
        var verificationRequest = docSnap.data();
        console.log(verificationRequest);
        var status = verificationRequest.status;
        if (status === "pending") {
          document.getElementById("btnGet").style.display = "none";
          document.getElementById("status").innerHTML = "Verification request is pending";
        } else if (status === "verified") {
          document.getElementById("btnGet").style.display = "none";
          document.getElementById("status").innerHTML = "Verified Documents";
          document.getElementById("checkVerify").style.display = "block";
          document.getElementById("videoFrame").src = verificationRequest.video;
          document.getElementById("frontImage").src = verificationRequest.front;
          document.getElementById("backImage").src = verificationRequest.back;
          document.getElementById("status").addEventListener("click", function () {
            //check if sec2 style is none
            if (document.getElementById("sec2").style.display === "none") {
              document.getElementById("btnGet").style.display = "none";
              document.getElementById("sec2").style.display = "block";
              document.getElementById("status").innerHTML = "Hide Documents";
            } else {
              document.getElementById("btnGet").style.display = "none";
              document.getElementById("sec2").style.display = "none";
              document.getElementById("status").innerHTML = "Verified Documents";
            }
          });
        } else if (status === "rejected") {
          document.getElementById("btnGet").innerHTML = "Verification request is rejected";
          document.getElementById("status").style.display = "none";
        }
      } else {
        document.getElementById("status").style.display = "none";
      }
    });
  });



  function uploadImage() {
    const file = document.querySelector("#photo").files[0];
    const fileName = file.name;
    const storageRef = ref(storage, fileName);
    const metadata = {
      contentType: file.type,
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        console.log(url);
        document.getElementById("photoUrl").value = url;
        //add local storage
        localStorage.setItem('photoUrl', url);
        updateUser(url);
      })
      .catch(console.error);
  }

  function uploadVideo() {
    const file = document.querySelector("#video").files[0];
    const fileName = file.name;
    const storageRef = ref(storage, fileName);
    const metadata = {
      contentType: file.type,
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on("state_changed", (snapshot) => {
      // Get upload progress
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      const progressBar = document.querySelector(".progress-bar");
      const counter = document.querySelector("#counter");
      const iframe = document.querySelector("#iframe");
      progressBar.style.width = progress + "%";
      counter.innerHTML = progress.toFixed(0) + "%" + "  please wait...";
      console.log("Upload progress: " + progress + "%");
    }, (error) => {
      console.error("Error uploading file: ", error);
    }, () => {
      // Upload completed
      uploadTask
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((url) => {
          console.log(url);
          iframe.src = url;
          counter.innerHTML = "Upload complete";
          //add local storage
          localStorage.setItem('videoUrl', url);
          createVideo(url);
        })
        .catch(console.error);
    });
  }

  function uploadFrontPiImage() {
    const file = document.querySelector("#front").files[0];
    const fileName = file.name;
    const storageRef = ref(storage, fileName);

    const metadata = {
      contentType: file.type,
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    uploadTask
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
         // Set the image URL in the HTML
        $("#frontImg").attr('src', url);
        console.log(url);
        const type = "front";
      
        //add local storage
        localStorage.setItem('frontPhotoUrl', url);
        piDocUpload(url, type);
      })
      .catch(console.error);
  }
  function uploadbackPiImage() {
    const file = document.querySelector("#back").files[0];
    const fileName = file.name;
    const storageRef = ref(storage, fileName);
    const metadata = {
      contentType: file.type,
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        console.log(url);
        const type = "back";
        document.getElementById("backImg").src = url;
        //add local storage
        localStorage.setItem('backPhotoUrl', url);
        piDocUpload(url, type);
      })
      .catch(console.error);
  }


  //create verification request document in firesotre

  function createVerificationRequest() {
    var verificationRequest = {
      uid: localStorage.getItem('uid'),
      status: "pending",
      front: localStorage.getItem('frontPhotoUrl'),
      back: localStorage.getItem('backPhotoUrl'),
      video: localStorage.getItem('videoUrl')
    };

    //use setDoc and use uid as the doc id
    setDoc(doc(db, "verificationRequests", localStorage.getItem('uid')), verificationRequest)
      .then(() => {
        console.log("Document successfully written!");
        $("#myAlert").fadeTo(2000, 500).slideUp(500, function () {
          $("#myAlert").slideUp(500);
          window.location.href = "/profile/";
        });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }

  //click event to create verification request

  $('#verify').click(function () {
    //show spinner
    $('#verificationSpinner').addClass('show');
    createVerificationRequest();
    $('#loading').innerHTML = "sent";
    setTimeout(function () {
      $('#verificationSpinner').removeClass('show');
    }, 2500);
  });

  //add video link to videos in firebase firestore

  function createVideo(url) {
    var video = {
      uid: localStorage.getItem('uid'),
      url: url
    };
    addDoc(collection(db, "videos"), video)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        //update the product id with the doc ref id
        updateDoc(doc(db, "videos", docRef.id), {
          id: docRef.id
        }).then(() => {
          console.log("Document successfully updated!");
          $("#myAlert").fadeTo(2000, 500).slideUp(500, function () {
            $("#myAlert").slideUp(500);
          });
        }).catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }


  function piDocUpload(url, type) {
    var piDoc = {
      uid: localStorage.getItem('uid'),
      url: url,
      type: type
    };
    addDoc(collection(db, "piDocs"), piDoc)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        //update the product id with the doc ref id
        updateDoc(doc(db, "piDocs", docRef.id), {
          id: docRef.id
        }).then(() => {
          console.log("Document successfully updated!");
          $("#myAlert").fadeTo(2000, 500).slideUp(500, function () {
            $("#myAlert").slideUp(500);
          });
        }).catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });

      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }


  //click event to add product image
  $('#productPhoto').change(function () {
    $('#spinner').addClass('show');
    uploadProductImage();
    setTimeout(function () {
      $('#spinner').removeClass('show');
    }, 2000);
  });

  function uploadProductImage() {
    const file = document.querySelector("#productPhoto").files[0];
    //get the file name
    const fileName = file.name;
    const storageRef = ref(storage, fileName);
    const metadata = {
      contentType: file.type,
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((url) => {
        console.log(url);
        //put img to src of uploadedImage
        $('#uploadedImage').attr('src', url);
        //add local storage
        localStorage.setItem('productPhotoUrl', url);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
      });
  }

  //update user
  $('#updateBtn').click(function () {
    var url = localStorage.getItem('photoUrl');
    updateUser(url);
  });



  function updateUser(url) {
    var uid = localStorage.getItem('uid');
    const userDoc = doc(db, "users", uid);
    updateDoc(userDoc, {
      name: $('#userN').val(),
      email: $('#userEmail').val(),
      location: $('#userLocation').val(),
      about: $('#userAbout').val(),
      phone: $('#userPhone').val(),
    }).then(() => {
      console.log("Document successfully updated!");
      $("#myAlert6").fadeTo(2000, 500).slideUp(500, function () {
        $("#myAlert6").slideUp(500);
      });
      //redirect to profile page
      setTimeout(function () {
        window.location.href = "/profile/";
      }, 1000);
    }).catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }

  //fuction to edit products
  function editProduct(productId) {
    //get the product document
    getDoc(doc(db, "products", productId)).then((docSnap) => {
      let product = docSnap.data();
      //conver to plain js object

      const productObjEdit = {
        name: $('#productNameEdit').val(),
        price: $('#productPriceEdit').val(),
        category: $('#postProductCategoryEdit').val(),
        description: $('#productDescriptionEdit').val(),
        imgUrl: $('#productPhotoEdit2').val(),
        sellerId: product.sellerId,
        availabilityWindowStart: $('#availabilityWindowStratEdit').val(),
        availabilityWindowEnd: $('#availabilityWindowEndEdit').val(),
        amountAvailable: $('#productAmountEdit').val()
      };
      //add product to the database use setDoc and the document id to the product object
      //get uid
      var productDoc = doc(db, "products", productId);
      updateDoc(productDoc, productObjEdit)
        .then(() => {
          console.log("Product successfully updated!");
          $("#myAlertEdit").fadeTo(2000, 500).slideUp(500, function () {
            $("#myAlertEdit").slideUp(500);
            window.location.href = "/profile/";
          });
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    });
  }



  //use the product class to upload product and  create a product object
  $('#addProduct').click(function () {
    addProduct();
  });

  $('#editProduct').click(function () {
    var productId = localStorage.getItem('productId');
    editProduct(productId);
  });

  //create a product object
  // const user = new User(uid, name, email, accesslevel, location, about, imgUrl);


  // //conver to plain js object
  // const userObj = {
  //   uid: user.uid,
  //   name: user.name,
  //   email: user.email,
  //   accesslevel: user.accesslevel,
  //   location: user.location,
  //   about: user.about,
  //   imgUrl: user.imgUrl
  // }; follow the same pattern to create a product object and for the id i want it to be the doc ref id from firebase

  //create a function to add a product
  function addProduct() {
    var name = $('#productName').val();
    var price = $('#productPrice').val();
    var category = $('#postProductCategory').val();
    var amountAvailable = $('#productAmount').val();
    var description = $('#productDescription').val();
    var imgUrl = localStorage.getItem('productPhotoUrl');
    var sellerId = localStorage.getItem('uid');
    var availabilityWindowStart = $('#availabilityWindowStrat').val();
    var availabilityWindowEnd = $('#availabilityWindowEnd').val();
    //create a product object
    const product = new Product('', name, price, category, description, imgUrl, sellerId, availabilityWindowStart, availabilityWindowEnd, amountAvailable);
    //conver to plain js object
    const productObj = {
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      imgUrl: product.imgUrl,
      sellerId: product.sellerId,
      availabilityWindowStart: product.availabilityWindowStart,
      availabilityWindowEnd: product.availabilityWindowEnd,
      amountAvailable: product.amountAvailable,
      rating: "0"
    };
    //add product to the database usee setDoc and and the document id to the product object
    addDoc(collection(db, "products"), productObj).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      //update the product id with the doc ref id
      updateDoc(doc(db, "products", docRef.id), {
        id: docRef.id
      }).then(() => {
        $("#myAlert").fadeTo(2000, 500).slideUp(500, function () {
          $("#myAlert").slideUp(500);
          window.location.href = "/profile/";
        });
      }).catch((error) => {
        // The document probably doesn't exist.
        $("#myAlert").fadeTo(2000, 500).slideUp(500, function () {
          $("#myAlert").innerHTML = error.code;
          $("#myAlert").slideUp(500);

        });
      });
    })

  }



  // $("document").ready(function () {
  //   //get the user access level from local storage
  //   var accessLevel = localStorage.getItem('accessLevel');
  //   //check if the user is a farmer
  //   if (accessLevel === "farmer") {
  //   fetchProducts5();
  //   }
  //   if (accessLevel === "vendor") {
  //     fetchOrderProducts();
  //   }

  // })





  $("#logOut1").click(function (event) {
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




})(jQuery);