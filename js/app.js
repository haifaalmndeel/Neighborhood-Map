// Create the map and the infowindow'
var map, infowindow;
// Create a new blank array for all the listing markers.
var markers = [];
// Create locations array to use it any time.
var locations=[
  {title:"Burj khalifa",location:{lat:25.197515,lng:55.274873}},
  {title:"Jumeirah Beach",location:{lat:25.193957,lng:55.231618}},
  {title:"Emirates Mall",location:{lat:25.121237,lng:55.200373}},
  {title:"Atlantis the blam",location:{lat:25.130443,lng:55.11715}},
  {title:"Dubai Zoo",location:{lat:25.222483,lng:55.256453}},
  {title:"Sky dive",location:{lat:25.091427,lng:55.138296}}];
// Create the  view model for the knockout, search box and markers to make it work.
// object literal, not a constructor function
var myViewModel = {
  myLocations: ko.observableArray(locations),
  userInput: ko.observable('')
};
//create a function when click on one of the list make info window open
function openInfo(title) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].title == title)
      google.maps.event.trigger(markers[i], 'click');
  }
}
myViewModel.mySearch = ko.computed(function () {
  var userInput = this.userInput().toLowerCase();
  var filteredLocations = [];
  //if there is no userInput set all the marker 
  if (!userInput) {
    for (i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
    return this.myLocations();
  } else {
    //push evry marker get in userInput to filteredLocations 
    for (i = 0; i < locations.length; i++) {
      if (locations[i].title.toLowerCase().indexOf(userInput) > -1) {
        filteredLocations.push(locations[i]);
      }
    }
    for (i = 0; i < markers.length; i++) {
      for (j = 0; j < filteredLocations.length; j++) {
          if ( markers[i].getTitle().indexOf(filteredLocations[j].title) > -1) {
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

  // The following group uses the location array to create an array of markers on initialize.
  locations.forEach(function (d, i) {
    // Get the position from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });

    // Push the marker to our array of markers.
    markers.push(marker);

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function () {
        toggleBounce();
        populateInfoWindow(this);
      });
    bounds.extend(markers[i].position);

    //this function to make the marker animate 
    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(
          function(){
           marker.setAnimation(null)
         },700)
      }
    }
  });
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
    wikiInfo(marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function () {
        infowindow.setMarker = null;
      });
  }
}

//this function for the third-party wikipedia 
function wikiInfo(marker) {
  // the API link
  var wikiURL =
    'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' +
    marker.title +
    '&namespace=0&format=json&callback=cb';
  // ajax request 
  $.ajax({
    url: wikiURL,
    dataType: 'jsonp',
    success: function (data) {
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
    },
    error: function(ErrorMessage){
     alert("Error: wikipedia could not be laoded");
    }
  });
}

//function for Error Handling for the map .
function ErrorHandling(){
  alert("Error: map could not be laoded");
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