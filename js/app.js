


var map,infowindow;

    // Create a new blank array for all the listing markers.
    var markers = [];

    var locations = [{
        title: 'Burj khalifa',
        location: {
          lat: 25.197515,
          lng: 55.274873
        }
      },
      {
        title: 'Jumeirah Beach',
        location: {
          lat: 25.193957,
          lng: 55.231618
        }
      },
      {
        title: 'Emirates Mall',
        location: {
          lat: 25.121237,
          lng: 55.200373
        }
      },
      {
        title: 'atlantis the blam',
        location: {
          lat: 25.130443,
          lng: 55.11715
        }
      },
      {
        title: 'Dubai Zoo',
        location: {
          lat: 25.222483,
          lng: 55.256453
        }
      },
      {
        title: 'Sky dive',
        location: {
          lat: 25.091427,
          lng: 55.138296
        }
      }
    ];

    // object literal, not a constructor function
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
        return this.myLocations()
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

        // filter the list items here
      }

    }, myViewModel)

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

      var defaultIcon = makeMarkerIcon('ff3a58');
      var highlightedIcon = makeMarkerIcon('9ec3ff');

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
        wikiMarker(marker)
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.setMarker = null;
        });
      }
    }
      function wikiMarker(marker){
           var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + marker.title + '&namespace=0&format=json&callback=cb';
          
          $.ajax({
    url: wikiURL,
    dataType: 'jsonp',
    success: function (data) {
      var link ;
      if(data[3][0]){
       link = data[3][0];
      }
      else{
        link = "no wikipedia link";
      }
      
        infowindow.setContent('<div>' + marker.title + '</div>' + '<div>' +link + '</div>');
        infowindow.open(map, marker);

      }
      })
        }
  

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

    function openNav() {
      document.getElementById("mySidenav").style.width = "250px";
    }

    function closeNav() {
      document.getElementById("mySidenav").style.width = "0";
    }



    ko.applyBindings(myViewModel);
