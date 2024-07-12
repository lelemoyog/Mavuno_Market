import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, query, limit, where} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { User } from "/static/js/classes.js";
import { firebaseConfig } from "/static/js/firebaseSDK.js";
//import https://cdn.jsdelivr.net/npm/apexcharts
import {} from "https://cdn.jsdelivr.net/npm/apexcharts";
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





var id;

//search function for products

$("#search").click(function (event) {
  event.preventDefault();
  var search = document.getElementById('searchInput').value;
  console.log(search);
  clearBox();
  window.location.href = "#productHolder";
  //use firebase firestore search function to search for products with the name that matches the search input

  getDocs(query(collection(db, "products"), where("name", "==", search), limit(8))).then(docSnap => {
    let Products = [];
    docSnap.forEach((doc) => {
      Products.push({ ...doc.data(), id: doc.id })
    });
  
    console.log("Document data:", Products);
    let goods = Products.length;
    console.log(Products);
    const veiwGoods = document.querySelector("#productHolder");
     // check if Products is empty
     if (Products.length == 0) {
      veiwGoods.innerHTML = "Please enter a valid product name ie Banana, Maize, etc";
      //make it center and bigger
      veiwGoods.style.textAlign = "center";
      veiwGoods.style.fontSize = "3em";
     }
    for (let i = 0; i < goods; i++) {
      var name  = Products[i]['name'];
      var price = Products[i]['price'];
      var category = Products[i]['category'];
      var imgUrl = Products[i]['imgUrl'];
      id = Products[i]['id'];
      
      var product = document.createElement("div");
      product.className = "col-md-6 col-lg-4 col-xl-3";
      
      var fruiteItem = document.createElement("div");
      fruiteItem.className = "rounded position-relative fruite-item";

      var fruiteImg = document.createElement("div");
      fruiteImg.className = "fruite-img";

      var img = document.createElement("img");
      img.src = imgUrl;
      img.className = "img-fluid w-100 rounded-top";
      img.alt = name;

      

      var textWhite = document.createElement("div");
      textWhite.className = "text-white bg-success px-3 py-1 rounded position-absolute";
      textWhite.style.top = "10px";
      textWhite.style.left = "10px";
      textWhite.innerHTML = category;

      var border = document.createElement("div");
      border.className = "p-4 border border-secondary border-top-0 rounded-bottom";

      var h4 = document.createElement("h4");
      h4.innerHTML = name;

      var h6 = document.createElement("h6");
      h6.innerHTML = id;
      h6.style.display = "none";

      var dFlex = document.createElement("div");
      dFlex.className = "d-flex justify-content-between flex-lg-wrap";

      var p = document.createElement("p");
      p.className = "text-dark fs-5 fw-bold mb-0";
      p.innerHTML = `Ksh ${price} / kg`;

      var a = document.createElement("a");
      a.href = "#";
      a.className = "btn border border-secondary rounded-pill px-3 text-primary";
      a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-primary"></i> View Description`;

      

      veiwGoods.appendChild(product);
      product.appendChild(fruiteItem);
      fruiteItem.appendChild(fruiteImg);
      fruiteImg.appendChild(img);
      fruiteItem.appendChild(textWhite);
      fruiteItem.appendChild(border);
      border.appendChild(h4);
      border.appendChild(h6);
      border.appendChild(dFlex);
      dFlex.appendChild(p);
      dFlex.appendChild(a);

      // Add event listener to the button
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
});

$("#search-icon-1").click(function (event) {
  event.preventDefault();
  var search = document.getElementById('modalSearchInput').value;
  console.log(search);
  clearBox();
  //use firebase firestore search function to search for products with the name that matches the search input
window.location.href = "#productHolder";
  getDocs(query(collection(db, "products"), where("name", "==", search), limit(8))).then(docSnap => {
    let Products = [];
    docSnap.forEach((doc) => {
      Products.push({ ...doc.data(), id: doc.id })
    });
    console.log("Document data:", Products);
    let goods = Products.length;
    console.log(Products);
    const veiwGoods = document.querySelector("#productHolder");
    if (Products.length == 0) {
      veiwGoods.innerHTML = "Please enter a valid product name ie Banana, Maize, etc";
      //make it center and bigger
      veiwGoods.style.textAlign = "center";
      veiwGoods.style.fontSize = "2em";
     }
    for (let i = 0; i < goods; i++) {
      var name  = Products[i]['name'];
      var price = Products[i]['price'];
      var category = Products[i]['category'];
      var imgUrl = Products[i]['imgUrl'];
      id = Products[i]['id'];
      
      var product = document.createElement("div");
      product.className = "col-md-6 col-lg-4 col-xl-3";
      
      var fruiteItem = document.createElement("div");
      fruiteItem.className = "rounded position-relative fruite-item";

      var fruiteImg = document.createElement("div");
      fruiteImg.className = "fruite-img";

      var img = document.createElement("img");
      img.src = imgUrl;
      img.className = "img-fluid w-100 rounded-top";
      img.alt = name;

      

      var textWhite = document.createElement("div");
      textWhite.className = "text-white bg-success px-3 py-1 rounded position-absolute";
      textWhite.style.top = "10px";
      textWhite.style.left = "10px";
      textWhite.innerHTML = category;

      var border = document.createElement("div");
      border.className = "p-4 border border-secondary border-top-0 rounded-bottom";

      var h4 = document.createElement("h4");
      h4.innerHTML = name;

      var h6 = document.createElement("h6");
      h6.innerHTML = id;
      h6.style.display = "none";

      var dFlex = document.createElement("div");
      dFlex.className = "d-flex justify-content-between flex-lg-wrap";

      var p = document.createElement("p");
      p.className = "text-dark fs-5 fw-bold mb-0";
      p.innerHTML = `Ksh ${price} / kg`;

      var a = document.createElement("a");
      a.href = "#";
      a.className = "btn border border-secondary rounded-pill px-3 text-primary";
      a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-primary"></i> View Description`;

      

      veiwGoods.appendChild(product);
      product.appendChild(fruiteItem);
      fruiteItem.appendChild(fruiteImg);
      fruiteImg.appendChild(img);
      fruiteItem.appendChild(textWhite);
      fruiteItem.appendChild(border);
      border.appendChild(h4);
      border.appendChild(h6);
      border.appendChild(dFlex);
      dFlex.appendChild(p);
      dFlex.appendChild(a);

      // Add event listener to the button
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
});



function fetchProducts(){
  clearBox();
  getDocs(query(collection(db, "products"), limit(12))).then(docSnap => {
    let Products = [];
    docSnap.forEach((doc) => {
      Products.push({ ...doc.data(), id: doc.id })
    });
    console.log("Document data:", Products);
    let goods = Products.length;
    console.log(Products);
    const veiwGoods = document.querySelector("#productHolder");
   
    for (let i = 0; i < goods; i++) {
      var name  = Products[i]['name'];
      var price = Products[i]['price'];
      var category = Products[i]['category'];
      var imgUrl = Products[i]['imgUrl'];
      id = Products[i]['id'];
      
      var product = document.createElement("div");
      product.className = "col-md-6 col-lg-4 col-xl-3";
      
      var fruiteItem = document.createElement("div");
      fruiteItem.className = "rounded position-relative fruite-item";

      var fruiteImg = document.createElement("div");
      fruiteImg.className = "fruite-img";

      var img = document.createElement("img");
      img.src = imgUrl;
      img.className = "img-fluid w-100 rounded-top";
      img.alt = name;

      

      var textWhite = document.createElement("div");
      textWhite.className = "text-white bg-success px-3 py-1 rounded position-absolute";
      textWhite.style.top = "10px";
      textWhite.style.left = "10px";
      textWhite.innerHTML = category;

      var border = document.createElement("div");
      border.className = "p-4 border border-success border-top-0 rounded-bottom";

      var h4 = document.createElement("h4");
      h4.innerHTML = name;

      var h6 = document.createElement("h6");
      h6.innerHTML = id;
      h6.style.display = "none";

      var dFlex = document.createElement("div");
      dFlex.className = "d-flex justify-content-between flex-lg-wrap";

      var p = document.createElement("p");
      p.className = "text-dark fs-5 fw-bold mb-0";
      p.innerHTML = `Ksh ${price} / kg`;

      var a = document.createElement("a");
      a.href = "#";
      a.className = "btn btn-outline-success";
      a.innerHTML = `<i class="fa fa-shopping-bag me-2 text-success"></i> View Description`;

      

      veiwGoods.appendChild(product);
      product.appendChild(fruiteItem);
      fruiteItem.appendChild(fruiteImg);
      fruiteImg.appendChild(img);
      fruiteItem.appendChild(textWhite);
      fruiteItem.appendChild(border);
      border.appendChild(h4);
      border.appendChild(h6);
      border.appendChild(dFlex);
      dFlex.appendChild(p);
      dFlex.appendChild(a);

      // Add event listener to the button
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



//create function fetchProducts2 to fetch products from firebase filter by category the product holder id is productHolder2, use the query function to query only products with the category fruits

function fetchProducts2(){
  //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
  clearBox();

  getDocs(query(collection(db, "products"),  where("category", "==", "fruits"), limit(12))).then(docSnap => {
    let Products = [];
    docSnap.forEach((doc) => {
      Products.push({ ...doc.data(), id: doc.id })
    });
    console.log("Document2 data:", Products);
    let goods = Products.length;
    console.log(Products);
    const veiwGoods = document.querySelector("#productHolder2");
   
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
      img.className = "img-fluid w-100 rounded-top";
      img.alt = name;

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

      veiwGoods.appendChild(product);
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

function fetchProducts3(){
  //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
  clearBox();

  getDocs(query(collection(db, "products"),  where("category", "==", "vegetable"), limit(12))).then(docSnap => {
    let Products = [];
    docSnap.forEach((doc) => {
      Products.push({ ...doc.data(), id: doc.id })
    });
    console.log("Document3 data:", Products);
    let goods = Products.length;
    console.log(Products);
    const veiwGoods = document.querySelector("#productHolder3");
   
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
      img.className = "img-fluid w-100 rounded-top";
      img.alt = name;

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

      veiwGoods.appendChild(product);
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

function fetchProducts4(){
  //use this as reference const q = query(collection(db, "users"), where("accessLevel", "==", "farmer")); and then limit
  clearBox();

  getDocs(query(collection(db, "products"),  where("category", "==", "cereals"), limit(12))).then(docSnap => {
    let Products = [];
    docSnap.forEach((doc) => {
      Products.push({ ...doc.data(), id: doc.id })
    });
    console.log("Document4 data:", Products);
    let goods = Products.length;
    console.log(Products);
    const veiwGoods = document.querySelector("#productHolder4");
   
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
      img.className = "img-fluid w-100 rounded-top";
      img.alt = name;

      var textWhite = document.createElement("div");
      textWhite.className = "text-white bg-secondary px-3 py-1 rounded position-absolute";
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

     

      veiwGoods.appendChild(product);
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


function clearBox()
{
  const productHolder = document.getElementById('productHolder');
  const productHolder2 = document.getElementById('productHolder2');
  const productHolder3 = document.getElementById('productHolder3');
  const productHolder4 = document.getElementById('productHolder4');
  const productHolderc = document.getElementById('productHolderC');

  if (productHolder) {
    productHolder.innerHTML = " ";
  }
  if (productHolder2) {
    productHolder2.innerHTML = " ";
  }
  if (productHolder3) {
    productHolder3.innerHTML = " ";
  }
  if (productHolder4) {
    productHolder4.innerHTML = " ";
  }
  if (productHolderc) {
    productHolderc.innerHTML = " ";
  }
}


 // Profit Report Line Chart
  // --------------------------------------------------------------------
  const profileReportChartEl = document.querySelector('#profileReportChart'),
    profileReportChartConfig = {
      chart: {
        height: 190,
        // width: 175,
        type: 'line',
        toolbar: {
          show: false
        },
        dropShadow: {
          enabled: true,
          top: 10,
          left: 5,
          blur: 3,
          color: "#515365",
          opacity: 0.15
        },
        sparkline: {
          enabled: true
        }
      },
      grid: {
        show: false,
        padding: {
          right: 8
        }
      },
      colors: ['#f77e53'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: 'smooth'
      },
      series: [
        {
          data: [110, 270, 145, 245, 205, 285]
        }
      ],
      xaxis: {
        show: false,
        lines: {
          show: false
        },
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        show: false
      }
    };
  if (typeof profileReportChartEl !== undefined && profileReportChartEl !== null) {
    const profileReportChart = new ApexCharts(profileReportChartEl, profileReportChartConfig);
    profileReportChart.render();
  }
 // Order Statistics Chart
  // --------------------------------------------------------------------
  const chartOrderStatistics = document.querySelector('#orderStatisticsChart'),
    orderChartConfig = {
      chart: {
        height: 210,
        width: 210,
        type: 'donut'
      },
      labels: ['Electronic', 'Sports', 'Decor', 'Fashion'],
      series: [85, 15, 50, 50],
      colors: ["#f77e53", "#d1d1d1"],
      stroke: {
        width: 5,
        colors: '#fff'
      },
      dataLabels: {
        enabled: false,
        formatter: function (val, opt) {
          return parseInt(val) + '%';
        }
      },
      legend: {
        show: false
      },
      grid: {
        padding: {
          top: 0,
          bottom: 0,
          right: 15
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              value: {
                fontSize: '1.5rem',
                fontFamily: 'Public Sans',
                color: '#8c8da9',
                offsetY: -15,
                formatter: function (val) {
                  return parseInt(val) + '%';
                }
              },
              name: {
                offsetY: 20,
                fontFamily: 'Public Sans'
              },
              total: {
                show: true,
                fontSize: '0.8125rem',
                color: '#8c8da9',
                label: 'Weekly',
                formatter: function (w) {
                  return '38%';
                }
              }
            }
          }
        }
      }
    };
  if (typeof chartOrderStatistics !== undefined && chartOrderStatistics !== null) {
    const statisticsChart = new ApexCharts(chartOrderStatistics, orderChartConfig);
    statisticsChart.render();
  }


    // Total Revenue Report Chart - Bar Chart
  // --------------------------------------------------------------------
  const totalRevenueChartEl = document.querySelector('#totalRevenueChart'),
    totalRevenueChartOptions = {
      series: [
        {
          name: '2021',
          data: [18, 7, 15, 29, 18, 12, 9]
        },
        {
          name: '2020',
          data: [-13, -18, -9, -14, -5, -17, -15]
        }
      ],
      chart: {
        height: 300,
        stacked: true,
        type: 'bar',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '33%',
          borderRadius: 12,
          startingShape: 'rounded',
          endingShape: 'rounded'
        }
      },
      colors: ['#f77e53', '#d1d1d1'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 6,
        lineCap: 'round',
        colors: ['#fff']
      },
      legend: {
        show: true,
        horizontalAlign: 'left',
        position: 'top',
        markers: {
          height: 8,
          width: 8,
          radius: 12,
          offsetX: -3
        },
        labels: {
          colors: "#8c8da9",
        },
        itemMargin: {
          horizontal: 10
        }
      },
      grid: {
        borderColor: "#f8f9fa",
        padding: {
          top: 0,
          bottom: -8,
          left: 20,
          right: 20
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        labels: {
          style: {
            fontSize: '13px',
            colors: "#8c8da9"
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '13px',
            colors: "#8c8da9"
          }
        }
      },
      responsive: [
        {
          breakpoint: 1700,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '32%'
              }
            }
          }
        },
        {
          breakpoint: 1580,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '35%'
              }
            }
          }
        },
        {
          breakpoint: 1440,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '42%'
              }
            }
          }
        },
        {
          breakpoint: 1300,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '48%'
              }
            }
          }
        },
        {
          breakpoint: 1200,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '40%'
              }
            }
          }
        },
        {
          breakpoint: 1040,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 11,
                columnWidth: '48%'
              }
            }
          }
        },
        {
          breakpoint: 991,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '30%'
              }
            }
          }
        },
        {
          breakpoint: 840,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '35%'
              }
            }
          }
        },
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '28%'
              }
            }
          }
        },
        {
          breakpoint: 640,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '32%'
              }
            }
          }
        },
        {
          breakpoint: 576,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '37%'
              }
            }
          }
        },
        {
          breakpoint: 480,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '45%'
              }
            }
          }
        },
        {
          breakpoint: 420,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '52%'
              }
            }
          }
        },
        {
          breakpoint: 380,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: '60%'
              }
            }
          }
        }
      ],
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  if (typeof totalRevenueChartEl !== undefined && totalRevenueChartEl !== null) {
    const totalRevenueChart = new ApexCharts(totalRevenueChartEl, totalRevenueChartOptions);
    totalRevenueChart.render();
  }

  // Growth Chart - Radial Bar Chart
  // --------------------------------------------------------------------
  const growthChartEl = document.querySelector('#growthChart'),
    growthChartOptions = {
      series: [78],
      labels: ['Growth'],
      chart: {
        height: 240,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          size: 150,
          offsetY: 10,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '55%'
          },
          track: {
            background: '#f2f2f2',
            strokeWidth: '100%'
          },
          dataLabels: {
            name: {
              offsetY: 15,
              color: "#8c8da9",
              fontSize: '15px',
              fontWeight: '600',
              fontFamily: 'Public Sans'
            },
            value: {
              offsetY: -25,
              color: "#f77e53",
              fontSize: '22px',
              fontWeight: '500',
              fontFamily: 'Public Sans'
            }
          }
        }
      },
      colors: ["#f77e53"],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.5,
          gradientToColors: ["#f77e53"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 0.6,
          stops: [30, 70, 100]
        }
      },
      stroke: {
        dashArray: 5
      },
      grid: {
        padding: {
          top: -35,
          bottom: -10
        }
      },
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  if (typeof growthChartEl !== undefined && growthChartEl !== null) {
    const growthChart = new ApexCharts(growthChartEl, growthChartOptions);
    growthChart.render();
  }
fetchProducts();
fetchProducts2();
fetchProducts3();
fetchProducts4();


})(jQuery);