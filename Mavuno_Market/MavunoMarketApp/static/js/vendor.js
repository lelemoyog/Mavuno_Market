import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where,updateDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
  var id;



  function getVendors(){
    //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
    clearBox();
  
    getDocs(query(collection(db, "users"), where("accesslevel", "==", "vendor"), limit(12))).then(docSnap => {
      let Users = [];
      docSnap.forEach((doc) => {
        Users.push({ ...doc.data(), id: doc.id })
      });
      console.log("Document7 data:", Users);
      let vendors = Users.length;
      const vendorHolder = document.querySelector("#vendorHolder");

    
    for(let i = 0; i < vendors; i++){
        var name = Users[i].name;
        var about = Users[i].about;
        var location = Users[i].location;
        var uid = Users[i].uid

        // if(Users[i].imgUrl == ""){
        //   var image = "https://www.w3schools.com/w3images/avatar2.png";
        // }else{
        // var image = Users[i].imgUrl;
        //  }
        var image = Users[i].imgUrl ? Users[i].imgUrl : "https://www.w3schools.com/w3images/avatar2.png";

        

        var vendor = document.createElement("div");
        vendor.className = "col-md-6 col-lg-4 col-xl-3";
        vendor.style = "margin-bottom: 20px;";
        
        var vendorItem = document.createElement("div");
        vendorItem.className = "rounded position-relative fruite-item";

        var vendorImg = document.createElement("div");
        vendorImg.className = "fruite-img";

        var img = document.createElement("img");
        img.style.height = "300px";
        img.src = image;
        img.className = "img-fluid w-100 rounded-top";
        img.alt = name;

        var textWhite = document.createElement("div");
        textWhite.className = "text-white bg-success px-3 py-1 rounded position-absolute";
        textWhite.style.top = "10px";
        textWhite.style.left = "10px";
        textWhite.innerHTML = location;

        var border = document.createElement("div");
        border.className = "p-4 border border-secondary border-top-0 rounded-bottom";

        var h4 = document.createElement("h4");
        h4.innerHTML = name;

        var dFlex = document.createElement("div");
        dFlex.className = "d-flex justify-content-between flex-lg-wrap";

        var p = document.createElement("p");
        p.className = "text-dark fs-5 fw-bold mb-0";
        p.innerHTML = about;

        var a = document.createElement("a");
        a.href = "#";
        a.className = "btn border border-secondary rounded-pill px-3 text-primary";
        a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-primary"></i> View completed Orders`;
        a.setAttribute("data-bs-toggle", "modal");
        a.setAttribute("data-bs-target", "#vendorOrderModal");

        vendorHolder.appendChild(vendor);
        vendor.appendChild(vendorItem);
        vendorItem.appendChild(vendorImg);
        vendorImg.appendChild(img);
        vendorItem.appendChild(textWhite);
        vendorItem.appendChild(border);
        border.appendChild(h4);
        border.appendChild(dFlex);
        dFlex.appendChild(p);
        dFlex.appendChild(a);
       
        id= uid;

        a.addEventListener('click', (function(id) {
          return function() {
            fetchCompletedOrders(id);                                       
           };
        })(id));
    }
    });

    };

    function fetchCompletedOrders(uid) {
      
      document.querySelector("#cartHolderVendor").innerHTML = "";
      console.log("fetching orders" + uid);
      //get the cart collection
      getDocs(query(collection(db, uid))).then(docSnap => {
          let products = [];
          docSnap.forEach((doc) => {
              products.push({ ...doc.data(), id: doc.id })
          });
          console.log("docs" + products);
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
              // td5.appendChild(button3);
              // td5.appendChild(button4);
              // td5.appendChild(button5);
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
              document.querySelector("#cartHolderVendor").appendChild(productRow);

              var cartCount = products.length;
              document.querySelector("#cartCount").innerHTML = cartCount;


              
              var productId = product.id;
              // Add event listener to the button
              button3.addEventListener('click', function() {
                  //get the product id
                makeOrder(productId);
                //reload the page
                $("#myAlert3").fadeTo(2000, 500).slideUp(500, function () {
                  $("#myAlert3").slideUp(1000);
                });
                  setTimeout(function() {
                      fetchCartProducts();
                  }, 5000);
                 
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

              //populate the carosel with the products
              // <div class="carousel-item active rounded">
              //             <img src="{% static 'img/hero-img-1.png' %}" class="img-fluid w-100 h-100 bg-secondary rounded" alt="First slide">
              //             <a href="#" class="btn px-4 py-2 text-white rounded">Fruits</a>
              //         </div> use this code to create the elements and the div holder id is caroselHolder

             




          };
      });
  };


    function getVendorOrder(vendorId) {
      getDocs(query(collection(db, "orders"), where("vendorId", "==", vendorId), limit(1))).then(orderSnap => {
        if (!orderSnap.empty) {
          orderSnap.forEach(orderDoc => {
            displayVendorOrder(orderDoc.data());
          });
        }
      });
    }
    
    function displayVendorOrder(order) {
      var vendorOrderHolder = document.getElementById("vendorOrderHolder");
      if (!vendorOrderHolder) return;
    
      // Clear previous orders
      clearVendorOrder();

      // Create elements to display order details
      var orderContainer = document.createElement("div");
      orderContainer.className = "order-container";

      var orderTitle = document.createElement("h3");
      orderTitle.innerHTML = "Order Details";

      var orderId = document.createElement("p");
      orderId.innerHTML = "Order ID: " + order.id;

      var orderDate = document.createElement("p");
      orderDate.innerHTML = "Order Date: " + order.date;

      var orderProducts = document.createElement("div");
      orderProducts.className = "order-products";

      // Loop through the ordered products and create elements to display each product
      order.products.forEach(function (product) {
        var productContainer = document.createElement("div");
        productContainer.className = "product-container";

        var productName = document.createElement("h4");
        productName.innerHTML = product.name;

        var productPrice = document.createElement("p");
        productPrice.innerHTML = "Price: $" + product.price;

        var productQuantity = document.createElement("p");
        productQuantity.innerHTML = "Quantity: " + product.quantity;

        productContainer.appendChild(productName);
        productContainer.appendChild(productPrice);
        productContainer.appendChild(productQuantity);

        orderProducts.appendChild(productContainer);
      });

      orderContainer.appendChild(orderTitle);
      orderContainer.appendChild(orderId);
      orderContainer.appendChild(orderDate);
      orderContainer.appendChild(orderProducts);

      // Append the order container to the vendor order holder
      var vendorOrderHolder = document.getElementById("vendorOrderHolder");
      vendorOrderHolder.appendChild(orderContainer);
    }
    

    // Function to clear the vendor order holder
    function clearVendorOrder() {
      var vendorOrderHolder = document.getElementById("vendorOrderHolder");
      if (vendorOrderHolder) {
        vendorOrderHolder.innerHTML = "";
      }
    }

    function getVendorOrder(vendorId) {
      getDocs(query(collection(db, "orders"), where("vendorId", "==", vendorId), limit(1))).then(orderSnap => {
        if (!orderSnap.empty) {
          orderSnap.forEach(orderDoc => {
            displayVendorOrder(orderDoc.data());
          });
        }
      });
    }
    
    function displayVendorOrder(order) {
      var vendorOrderHolder = document.getElementById("vendorOrderHolder");
      if (!vendorOrderHolder) return;
    
      // Clear previous orders
      clearVendorOrder();

      // Create elements to display order details
      var orderContainer = document.createElement("div");
      orderContainer.className = "order-container";

      var orderTitle = document.createElement("h3");
      orderTitle.innerHTML = "Order Details";

      var orderId = document.createElement("p");
      orderId.innerHTML = "Order ID: " + order.id;

      var orderDate = document.createElement("p");
      orderDate.innerHTML = "Order Date: " + order.date;

      var orderProducts = document.createElement("div");
      orderProducts.className = "order-products";

      // Loop through the ordered products and create elements to display each product
      order.products.forEach(function (product) {
        var productContainer = document.createElement("div");
        productContainer.className = "product-container";

        var productName = document.createElement("h4");
        productName.innerHTML = product.name;

        var productPrice = document.createElement("p");
        productPrice.innerHTML = "Price: $" + product.price;

        var productQuantity = document.createElement("p");
        productQuantity.innerHTML = "Quantity: " + product.quantity;

        productContainer.appendChild(productName);
        productContainer.appendChild(productPrice);
        productContainer.appendChild(productQuantity);

        orderProducts.appendChild(productContainer);
      });

      orderContainer.appendChild(orderTitle);
      orderContainer.appendChild(orderId);
      orderContainer.appendChild(orderDate);
      orderContainer.appendChild(orderProducts);

      // Append the order container to the vendor order holder
      var vendorOrderHolder = document.getElementById("vendorOrderHolder");
      vendorOrderHolder.appendChild(orderContainer);
    }
    

    // Function to clear the vendor order holder
    function clearVendorOrder() {
      var vendorOrderHolder = document.getElementById("vendorOrderHolder");
      if (vendorOrderHolder) {
        vendorOrderHolder.innerHTML = "";
      }
    }

//clear the farmerHolder
function clearBox() {
    var farmerHolder = document.getElementById('vendorHolder');
    if (farmerHolder) {
        farmerHolder.innerHTML = "";
    }
}
    
     
     
  
getVendors();

})(jQuery);