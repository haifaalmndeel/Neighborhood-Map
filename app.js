

// Create the map and the infowindow'
var map, infowindow;

// Create a new blank array for all the listing markers.
var markers = [];

// Create locations array to use it any time.
var locations=[
  {title:"Burj khalifa",location:{lat:25.197515,lng:55.274873}},
  {title:"Jumeirah Beach",location:{lat:25.193957,lng:55.231618}},
  {title:"Emirates Mall",location:{lat:25.121237,lng:55.200373}},
  {title:"atlantis the blam",location:{lat:25.130443,lng:55.11715}},
  {title:"Dubai Zoo",location:{lat:25.222483,lng:55.256453}},
  {title:"Sky dive",location:{lat:25.091427,lng:55.138296}}];

// Create the  view model for the knockout, search box and markers to make it work.
var myViewModel = {
   myLocations: ko.observableArray(locations),
   userInput: ko.observable('')
};

myViewModel.mySearch = ko.computed(function() {
   var userInput = this.userInput().toLowerCase();
   var filteredLocations = [];

   if (!userInput) {
      for (i = 0; i < markers.length; i++) {
         markers[i].setMap(map);
      }
      return this.myLocations();
   } else {

      for (i = 0; i < locations.length; i++) {
         if (userInput == locations[i].title.toLowerCase()) {
            filteredLocations.push(locations[i]);
         }
      }
      for (i = 0; i < markers.length; i++) {
         for (j = 0; j < filteredLocations.length; j++) {
            if (filteredLocations[j].title == markers[i].getTitle()) {
               markers[i].setMap(map);
            } else {
               markers[i].setMap(null);
            }
         }

      }

      return filteredLocations;

   }

}, myViewModel);

function initMap() {
   // Constructor creates a new map - only center and zoom are required.
   map = new google.maps.Map(document.getElementById('map'), {
      center: {
         lat: 25.204849,
         lng: 55.270783
      },
      zoom: 13
   });

   infowindow = new google.maps.InfoWindow();
   var bounds = new google.maps.LatLngBounds();
   // Style the markers
   var defaultIcon = makeMarkerIcon('ff3a58');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
   var highlightedIcon = makeMarkerIcon('9e9e9e');

   // The following group uses the location array to create an array of markers on initialize.
   for (var i = 0; i < locations.length; i++) {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
         map: map,
         position: position,
         title: title,
         animation: google.maps.Animation.DROP,
         icon: defaultIcon,

         id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
         populateInfoWindow(this);
      });
      bounds.extend(markers[i].position);

      // Two event listeners - one for mouseover, one for mouseout,
      // to change the colors back and forth.
      marker.addListener('mouseover', function() {
         this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
         this.setIcon(defaultIcon);
      });
   }
   // Extend the boundaries of the map for each marker
   map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker) {

   // Check to make sure the infowindow is not already opened on this marker.
   if (infowindow.marker != marker) {
      infowindow.marker = marker;
      // open wikipedia in the infowindow
      wikiMarker(marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
         infowindow.setMarker = null;
      });
   }
}

//this function for the third-party wikipedia 
function wikiInfoWindow(marker) {
  // the API link
   var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + marker.title + '&namespace=0&format=json&callback=cb';
   // ajax request 
   $.ajax({
      url: wikiURL,
      dataType: 'jsonp',
      success: function(data) {
         var link;
         // if there is no data in the wikiURL
         if (data[3][0]) {
            link = data[3][0];
         } else {
            link = "no wikipedia link";
         }
        // to make sure the wikipedia API will work before you click on it 
         infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' + link + '</div>');
         infowindow.open(map, marker);

      }
   });
}


  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  function makeMarkerIcon(markerColor) {
   var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
   return markerImage;
}

// this function to open the navbar side .
function openNav() {
   document.getElementById("mySidenav").style.width = "250px";
}
// this function to close the navbar side .
function closeNav() {
   document.getElementById("mySidenav").style.width = "0";
}

// to make the knockout works.
ko.applyBindings(myViewModel);