//cerate Location Picker Form using google map api and bootstrap modal
//create an event listener for the picklocation button to show a modal tha contains a map

//create a function that will be called when the user clicks the picklocation button



(function ($) {
    "use strict";

function pickLocation() {
    //show the modal
    $('#locationPicker').modal('show');
    //initialize the map
    initMap();
}

//create a function that will be called when the user clicks the save location button

function saveLocation() {
    //get the selected location
    var location = map.getCenter();
    //set the location to the input field
    $('#location').val(location.lat() + ',' + location.lng());
    //hide the modal
    $('#locationPickerModal').modal('hide');
}

//create a function that will be called when the user clicks the cancel location button

function cancelLocation() {
    //hide the modal
    $('#locationPickerModal').modal('hide');
}

//create a function that will be called when the user clicks the my location button

function myLocation() {
    //get the current location
    navigator.geolocation.getCurrentPosition(function(position) {
        //set the location to the input field
        $('#location').val(position.coords.latitude + ',' + position.coords.longitude);
        //hide the modal
        $('#locationPickerModal').modal('hide');
    });
}

//create a function that will be called to initialize the map

var map;

function initMap() {
    //create a new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -1.286389, lng: 36.817223},
        zoom: 8
    });
    //create a new marker
    var marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        draggable: true
    });
    //add an event listener for the marker
    marker.addListener('dragend', function() {
        //set the location to the input field
        $('#location').val(marker.getPosition().lat() + ',' + marker.getPosition().lng());
    });
}

//create an event listener for the picklocation button

document.getElementById('picklocation').addEventListener('click', function() {  
  //alert('pick location button clicked');
     document.getElementById('picklocation').focus();

});

document.addEventListener('DOMContentLoaded', function () {
    let mapFrame = document.querySelector('#map iframe');
    let latitudeInput = document.getElementById('latitude');
    let longitudeInput = document.getElementById('longitude');

    // Function to update form fields with location data
    function updateLocation(lat, lng) {
        latitudeInput.value = lat;
        longitudeInput.value = lng;
    }

    // Add event listener to detect clicks on the map (simulate this part)
    // You would need a way to get the clicked location inside the iframe, which can be tricky.
    // The below code assumes that you can somehow capture clicks or location changes.
    mapFrame.addEventListener('load', function() {
        // Simulated location update
        // Ideally, this should be handled via a more robust method
        updateLocation(37.7749, -122.4194);
    });
});
//create an event listener for the savelocation button

$('#savelocation').click(saveLocation);

//create an event listener for the cancellocation button

$('#cancellocation').click(cancelLocation);




})(jQuery);
