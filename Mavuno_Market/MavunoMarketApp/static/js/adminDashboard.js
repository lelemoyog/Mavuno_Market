(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });


    // Progress Bar
    $('.pg-bar').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    //Calender
    $('#calender').datetimepicker({
        inline: true,
        format: 'L'
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





    // // Single Line Chart
    // var ctx3 = $("#line-chart").get(0).getContext("2d");
    // var myChart3 = new Chart(ctx3, {
    //     type: "line",
    //     data: {
    //         labels: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
    //         datasets: [{
    //             label: "Salse",
    //             fill: false,
    //             backgroundColor: "rgba(40, 167, 69, 0.3)",
    //             data: [7, 8, 8, 9, 9, 9, 10, 11, 14, 14, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // // Single Bar Chart
    // var ctx4 = $("#bar-chart").get(0).getContext("2d");
    // var myChart4 = new Chart(ctx4, {
    //     type: "bar",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(40, 167, 69, 0.7)",
    //                 "rgba(40, 167, 69, 0.6)",
    //                 "rgba(40, 167, 69, 0.5)",
    //                 "rgba(40, 167, 69, 0.4)",
    //                 "rgba(40, 167, 69, 0.3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // // Pie Chart
    // var ctx5 = $("#pie-chart").get(0).getContext("2d");
    // var myChart5 = new Chart(ctx5, {
    //     type: "pie",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(40, 167, 69, 0.7)",
    //                 "rgba(40, 167, 69, 0.6)",
    //                 "rgba(40, 167, 69, 0.5)",
    //                 "rgba(40, 167, 69, 0.4)",
    //                 "rgba(40, 167, 69, 0.3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });


    // // Doughnut Chart
    // var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
    // var myChart6 = new Chart(ctx6, {
    //     type: "doughnut",
    //     data: {
    //         labels: ["Italy", "France", "Spain", "USA", "Argentina"],
    //         datasets: [{
    //             backgroundColor: [
    //                 "rgba(40, 167, 69, 0.7)",
    //                 "rgba(40, 167, 69, 0.6)",
    //                 "rgba(40, 167, 69, 0.5)",
    //                 "rgba(40, 167, 69, 0.4)",
    //                 "rgba(40, 167, 69, 0.3)"
    //             ],
    //             data: [55, 49, 44, 24, 15]
    //         }]
    //     },
    //     options: {
    //         responsive: true
    //     }
    // });

    
})(jQuery);

