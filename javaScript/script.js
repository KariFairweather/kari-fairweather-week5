var pandemic = {};

pandemic.googleMapsKey = 'AIzaSyAHLUzB-tEbkZt9PgI0CKWu8AbjjBEW3CQ';

pandemic.foursquareApiClientId = 'GYTV3BZ4IACA4EG3LQZVJCHPTDHUJLICLK3ISXNBFUEQS2GF';

pandemic.foursquareApiClientSecret = 'AW1WDIADKN4GYW1EM1FXMXTS3LNNZ5MST22TZCBPXPVW4IHX'; 

//User inputs their current location through Google geocoding to get lat and long 

pandemic.getLocation = function(userLocation){
	$('form').on('submit', function(e){
		e.preventDefault();
		initMap();
		// console.log('help');
	var userAddress = $('input[type=text]').val();
	console.log(userAddress);
	$.ajax({
	url:'https://maps.googleapis.com/maps/api/geocode/json',
	method:'GET',
	dataType:'json',
	data: {
		address: userAddress
		}
	}).then(function(data){
		var lat = data.results[0].geometry.location.lat;
		// console.log(data.results[0].geometry.location.lat);
		var lng = data.results[0].geometry.location.lng;
		// console.log(data.results[0].geometry.location.lng);
		pandemic.getGroceryStores(lat, lng);
		pandemic.getHardwareStores(lat, lng);
		pandemic.getDrugStores(lat, lng);
		// console.log(lat, lng);
		// console.log(map);
		pandemic.userLatLng = {lat: lat, lng:lng};
		var marker = new google.maps.Marker({
			// We need to pass to the position property
			// and object with the keys lat and lng 
			position: pandemic.userLatLng,
			// and we need to set which map we want it to live on
			map: pandemic.map
			})
		});
	});
};

//************** Get Grocery Stores **************
pandemic.getGroceryStores = function(lat, lng) {
//Use the users current location to locate the nearest grocery store, hardware store and hospital using foursquare's API: 
	$.ajax({
	//The nearest grocery stores
		url:'https://api.foursquare.com/v2/venues/explore',
		method: 'GET',
		dataType: 'json',
		data: {
			ll: lat + ', ' + lng,
			client_id: pandemic.foursquareApiClientId,
			client_secret:pandemic.foursquareApiClientSecret,
			query:'grocery',
			v: 20160217,
			radius:800,
			limit:3
			}
		}).then(function(res) {
		// console.log(res.response.groups[0].items);
		console.log(res);
		pandemic.displayGroceryStoreInfo(res);
	});
};

//************** Get Hardware Stores **************
pandemic.getHardwareStores = function(lat, lng) {
//Use the users current location to locate the nearest hardware stores using foursquare's API: 
$.ajax({
	//The nearest hardware stores
		url:'https://api.foursquare.com/v2/venues/explore',
		method: 'GET',
		dataType: 'json',
		data: {
			ll: lat + ', ' + lng,
			client_id: pandemic.foursquareApiClientId,
			client_secret:pandemic.foursquareApiClientSecret,
			query:'hardware',
			v: 20160217,
			radius:1500,
			limit:3
		}
	}).then(function(res) {
		// console.log(res.response.groups[0].items);
		pandemic.displayHardwareStoreInfo(res);
	});
};

//************** Get Drug Stores **************
pandemic.getDrugStores = function(lat, lng) {
$.ajax({
	//The nearest drug stores 
		url:'https://api.foursquare.com/v2/venues/explore',
		method: 'GET',
		dataType: 'json',
		data: {
			ll: lat + ', ' + lng,
			client_id: pandemic.foursquareApiClientId,
			client_secret:pandemic.foursquareApiClientSecret,
			query:'drugstore pharmacy',
			v: 20160217,
			radius:800,
			limit:3
		}
	}).then(function(res) {
		console.log(res);
		// console.log(res.response.groups[0].items);
		pandemic.displayDrugStoreInfo(res);
	});
};

//************** Display Grocery Store Info **************
pandemic.displayGroceryStoreInfo = function(data) {
//Display the details of each grocery store on the page
	$('#groceryStoreLocationInfo').empty();
	var storeInfo = data.response.groups[0].items;
	// console.log(storeInfo);
	var storeType = $('<h3>').text('Grocery Stores');
	$('#groceryStoreLocationInfo').prepend(storeType);
	$.each(storeInfo, function(i, storeInfo){
		// console.log(storeInfo.venue.name);
		var storeName = $('<h4>').text(storeInfo.venue.name);
		var storeContactInfo = $('<p>').addClass('contactInfo').text(storeInfo.venue.location.address);
		var storeNum = $('<p>').addClass('contactNum').text(storeInfo.venue.contact.formattedPhone);
		var finalStoreInfo = $('<div>').addClass('storeInfo').append(storeName, storeContactInfo, storeNum);
		$('#groceryStoreLocationInfo').append(finalStoreInfo);
		//Grab longitude and longitude
		var storeLatitude = storeInfo.venue.location.lat;
		// console.log(storeLatitude);
		var storeLongitude = storeInfo.venue.location.lng;
		// console.log(storeLongitude);
		pandemic.map.setCenter(pandemic.userLatLng)
		//add markers to the map
		var image = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
		var marker = new google.maps.Marker({
			position: {
				lat: storeLatitude,
				lng: storeLongitude
			},
			map: pandemic.map,
			// title:'Hello World'
			icon: image
		});
	});
}

//************** Display Hardware Store Info **************
pandemic.displayHardwareStoreInfo = function(data) {
	$('#hardwareStoreLocationInfo').empty();
	var storeInfo = data.response.groups[0].items;
	var storeType = $('<h3>').text('Hardware Stores');
	$('#hardwareStoreLocationInfo').prepend(storeType);
	// console.log(storeInfo);
	$.each(storeInfo, function(i, storeInfo) {
		var storeName = $('<h4>').text(storeInfo.venue.name);
		var storeContactInfo = $('<p>').addClass('contactInfo').text(storeInfo.venue.location.address);
		var storeNum = $('<p>').addClass('contactNum').text(storeInfo.venue.contact.formattedPhone);
		var finalStoreInfo = $('<div>').addClass('storeInfo').append(storeName, storeContactInfo, storeNum);
		$('#hardwareStoreLocationInfo').append(finalStoreInfo);
		var storeLatitude = storeInfo.venue.location.lat;
		// console.log(storeLatitude);
		var storeLongitude = storeInfo.venue.location.lng;
		// console.log(storeLongitude);
		pandemic.map.setCenter(pandemic.userLatLng)
		var image = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
		var marker = new google.maps.Marker({
			position: {
				lat: storeLatitude,
				lng: storeLongitude
			},
			map: pandemic.map,
			// title:'Hello World'
			icon: image
		});
	});
};

//************** Display Drug Store Info **************
pandemic.displayDrugStoreInfo = function(data) {
	$('#pharmacyLocationInfo').empty();
	var storeInfo = data.response.groups[0].items;
	var storeType = $('<h3>').text('Pharmacies');
	$('#pharmacyLocationInfo').prepend(storeType);
	// console.log(storeInfo);
	$.each(storeInfo, function(i, storeInfo) {
		var storeName = $('<h4>').text(storeInfo.venue.name);
		var storeContactInfo = $('<p>').addClass('contactInfo').text(storeInfo.venue.location.address);
		var storeNum = $('<p>').addClass('contactNum').text(storeInfo.venue.contact.formattedPhone);
		var finalStoreInfo = $('<div>').addClass('storeInfo').append(storeName, storeContactInfo, storeNum);
		$('#pharmacyLocationInfo').append(finalStoreInfo);
		var storeLatitude = storeInfo.venue.location.lat;
		// console.log(storeLatitude);
		var storeLongitude = storeInfo.venue.location.lng;
		// console.log(storeLongitude);
		pandemic.map.setCenter(pandemic.userLatLng)
		var image = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
		var marker = new google.maps.Marker({
			position: {
				lat: storeLatitude,
				lng: storeLongitude
			},
			map: pandemic.map,
			// title: storeName,
			icon: image
		});
	});
};

pandemic.init = function(){
	pandemic.getLocation();
};

var initMap;
$(function(){

	$('.collapse-card').paperCollapse()
	smoothScroll.init();
	// Here we initial a new google maps.
	// We need to store that object on a variable.
	pandemic.map;
	initMap = function() {
	// This is where the new map is created
  		pandemic.map = new google.maps.Map(document.getElementById('map'), {
  		//You can set a center
    	center: {lat: 43.653226, lng: -79.3831843},
    	//0-18
    	zoom: 13
  		});
  	};
	pandemic.init();
});

