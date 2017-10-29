
# Neiborhood map 

### how to open the page:
open index.html in your browser

#####  First
* I create the navbar side to make the list in it 
* create the map and infowindow 
* Create a new blank array for all the listing markers
* Create locations array to use it any time

#####  scond
* Create the  view model for the knockout, search box and markers to make it work .
 * in the view model 
   * create myLocationand make it observableArray to locations and userInput and make it  ko.observable and filteredLocations array.
   * the idea' her is ts when I search for one marker all the marker disappear and creat a new marker in filteredLocations array to Appears the markers
   * create an if statement to make sure if there is no input to set the markers in the map and use myLocations array to Appears the markers
   * first loop is to make sure thet the input in the search box equle one of the location in myLocations array and push it to filteredLocations array and return filteredLocations
   * second loop is  nested loop go throw the filteredLocations and the markers
     * if statement to make sure that the filteredLocations array equle the marker 
     * if there is a mareker equle filteredLocations set a new marker 
     * if the in `no` mareker equle filteredLocations set the marker to null

#####  third
* create function initMap() to set the location for the map and the zoom 
   infowindow, bounds, defaultIcon and highlightedIcon 
  * uses the location array to create an array of markers on initialize.
  * Get the position from the location array.
  * Create a marker per location, and put into markers array.
  * Style the markers
  * Create a "highlighted location" marker color for when the user mouses over the marker.
  * Create a marker per location, and put into markers array.
  * Push the marker to our array of markers
  * Create an onclick event to open an infowindow at each marker.

##### fourth
* create This function populates the infowindow when the marker is clicked. We'll only allow one infowindow which will open at the marker that is clicked, and populate based on that markers position.
  * Check to make sure the infowindow is not already opened on this marker.
  * open wikipedia in the infowindow
  * Make sure the marker property is cleared if the infowindow is closed.
  
##### fifth
* create function for the third-party wikipedia
   * the API link
   * ajax request
   * if statement to make sure that there is a data in the wikiURL
   * to make sure the wikipedia API will work before you click on it 
   * 
   

##### sixth
* create a function takes in a COLOR, and then creates a new marker icon of that color. The icon will be 21 px wide by 34 high, have an origin of 0, 0 and be anchored at 10, 34).

##### seventh
* create a function to open the navbar side .
* create a function to close the navbar side .


##### last make the knockout works.
