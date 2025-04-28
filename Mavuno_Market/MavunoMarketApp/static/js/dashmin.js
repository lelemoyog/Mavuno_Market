import { initializeApp, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, addDoc, collection, getDocs, getDoc, doc, onSnapshot, setDoc, updateDoc, query, where, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { User } from "/static/js/classes.js";
import { firebaseConfig } from "/static/js/firebaseSDK.js";

//import auth from firebase
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

(function ($) {
    "use strict";
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);


     // Worldwide Sales Chart
    var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
    var myChart1 = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
            datasets: [{
                    label: "USA",
                    data: [15, 30, 55, 65, 60, 80, 95],
                    backgroundColor: "rgba(40, 167, 69, 1)"
                },
                {
                    label: "UK",
                    data: [8, 35, 40, 60, 70, 55, 75],
                    backgroundColor: "rgba(40, 167, 69, 0.7)"
                },
                {
                    label: "AU",
                    data: [12, 25, 45, 55, 65, 70, 60],
                    backgroundColor: "rgba(40, 167, 69, 0.4)"
                }
            ]
            },
        options: {
            responsive: true
        }
    });


    // Salse & Revenue Chart
    var ctx2 = $("#salse-revenue").get(0).getContext("2d");
    var myChart2 = new Chart(ctx2, {
        type: "line",
        data: {
            labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022"],
            datasets: [{
                    label: "Salse",
                    data: [15, 30, 55, 45, 70, 65, 85],
                    backgroundColor: "rgba(40, 167, 69, 0.7)",
                    fill: true
                },
                {
                    label: "Revenue",
                    data: [99, 135, 170, 130, 190, 180, 270],
                    backgroundColor: "rgba(40, 167, 69, 0.4)",
                    fill: true
                }
            ]
            },
        options: {
            responsive: true
        }
    });
    
//get transactions from firebase

function getTransactions() {
    const transactions = [];bn
    const q = query(collection(db, "Transactions"));
    getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            transactions.push(doc.data());
             let todaysTransactions = transactions.filter(transaction => transaction.date === new Date().toDateString());
        });
        console.log(transactions);
    });
}
getTransactions();
})(jQuery);