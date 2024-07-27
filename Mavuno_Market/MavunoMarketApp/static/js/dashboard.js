

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
      series: [20, 15, 50, 50],
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
    let totalArray1 = [];
    console.log("totalArray1"+totalArray1);
  // --------------------------------------------------------------------
  const totalRevenueChartEl = document.querySelector('#totalRevenueChart'),
    totalRevenueChartOptions = {
      series: [
        {
          name: 'sales',
          data: totalArray1
        },
        // {
        //   name: '2020',
        //   data: [-13, -18, -9, -14, -5, -17, -15]
        // }
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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
  // if (typeof totalRevenueChartEl !== undefined && totalRevenueChartEl !== null) {
  //   const totalRevenueChart = new ApexCharts(totalRevenueChartEl, totalRevenueChartOptions);
  //   totalRevenueChart.render();
  // }

  //get all complete orders and add it to the total revenue chart


  $(document).ready(function () {
   var uid = localStorage.getItem('uid');
  //get all orders status to be completed
  const ordersRef = collection(db, uid);
  const q = query(ordersRef, where("status", "==", "completed"));
  const querySnapshot = getDocs(q);
  
  querySnapshot.then((querySnapshot) => {
    var products = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      products.push({ ...doc.data(), id: doc.id })
    });
 
console.log(products);
var length = products.length;
console.log(length);
var total1 = 0;
var total2 = 0;
var total3 = 0;
var total4 = 0;
var total5 = 0;
var total6 = 0;
var total7 = 0;
var total8 = 0;
var total9 = 0;
var total10 = 0;
var total11 = 0;
var total12 = 0;
 for (let i = 0; i < products.length; i++) {
    //get the product id
    const product = products[i];
   
      var quantity = product.quantity;
      var price = product.price;
      var total = quantity * price;
      //separete the totals into mothly totals by checking the date
      var date = product.date;
      var month = date.split("/")[0];
      console.log(month.toString());
    
     
      

      (function (total) {
        if (month == "1") {
          total1 += total;
        } else if (month == "2") {
          total2 += total;
        } else if (month == "3") {
          total3 += total;
        } else if (month == "4") {
          total4 += total;
        } else if (month == "5") {
          total5 += total;
        } else if (month == "6") {
          total6 += total;
        } else if (month == "7") {
          total7 += total;
        } else if (month == "8") {
          total8 += total;
        } else if (month == "9") {
          total9 += total;
        } else if (month == "10") {
          total10 += total;
        } else if (month == "11") {
          total11 += total;
        } else if (month == "12") {
          total12 += total;
        }
       
    })(total);
  
  }
  //add product to the database use setDoc and the document id to the product object
 
  let totalArray = [total1, total2, total3, total4, total5, total6, total7, total8, total9, total10, total11, total12];
  //loop through the total array and push to totalArray
  for (let i = 0; i < 12; i++) {
    totalArray1.push(totalArray[i]);
  }
  console.log("total"+totalArray);
  const totalRevenueChart = new ApexCharts(totalRevenueChartEl, totalRevenueChartOptions);
  totalRevenueChart.render();

});
});

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


})(jQuery);