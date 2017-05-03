let latitude;
let longitude;
var user = {
	lat: 0,
	lng: 0
};

let userName = {
	name: 'Du'
}

var userMarker;

var map, infoWindow;



function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: user,
		zoom: 10
	});
	infoWindow = new google.maps.InfoWindow;

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			//console.log('start', user);
			user = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			let request = {
				location: user,
				radius: 10000,
				name: 'badplats'
			}
			let request2 = {
				location: user,
				radius: 10000,
				name: 'badhus'
			}

			var service = new google.maps.places.PlacesService(map);
			service.nearbySearch(request, callback);
			service.nearbySearch(request2, callback);

			//console.log('post', user);
			userMarker = new google.maps.Marker({
				position: user,
				map: map
			});
			google.maps.event.addListener(userMarker, 'click', function () {
				infoWindow.setContent('<strong>' + userName.name + '</strong>')


				infoWindow.open(map, this);
			});
			map.setCenter(user);
		}, function () {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

	//console.log(user);


	//console.log(request);

}



let distanceArray = [];


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}

function callback(results, status) {
	//console.log(results);
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			let bName = results[i].name;
			let startDestination = user;
			let endDestination = {
				lat: results[i].geometry.location.lat(),
				lng: results[i].geometry.location.lng()
			};
			let matrixService = new google.maps.DistanceMatrixService;
			matrixService.getDistanceMatrix({
				origins: [startDestination],
				destinations: [endDestination],
				travelMode: 'WALKING'
			}, function (response, status) {
				if (status !== 'OK') {
					console.log(status);
				} else {
					//console.log(response.destinationAddresses[0]);
					//console.log(bName);
					//console.log(response.rows[0].elements[0].distance.value);
					let obj = {
						name: bName,
						adress: response.destinationAddresses[0],
						distance: response.rows[0].elements[0].distance.value
					}
					listBaths(obj);
					
					// React: setState componentDidMount
					console.log('length:', distanceArray.length);
				}
			})
			var place = results[i];
			createMarker(results[i]);
		}
		//console.log(distanceArray);
		
		
		//listNearestBaths(distanceArray);
	}
/*	console.log('distancearray', typeof(distanceArray), distanceArray, distanceArray['0'], distanceArray.length);
	console.log( JSON.stringify(distanceArray) );
	for(let x in distanceArray) {
		console.log('x:', x);
	}
	for (let i = 0; i<distanceArray.length; i++){
			console.log('körs');
		}*/
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function () {
		infoWindow.setContent('<strong>' + place.name + '</strong>' + '<br>' + place.vicinity + '<br>Betyg: ' + place.rating);

		infoWindow.open(map, this);
	});

}

let table = document.getElementById('tabellBadplats');
table.style.display = 'none';

function listBaths(obj){
	table.style.display = 'block';
	let row = document.createElement('tr');
	let html = `<td>${obj.name}</td><td>${obj.adress}</td><td>${obj.distance}m</td>`
	row.innerHTML = html;
	document.getElementById('tBody').appendChild(row);
}

function listNearestBaths(list) {
	//console.log(list);
	let sortedList = list.sort(function (a, b) {
			return a.distance - b.distance;
		});
	let row = document.createElement('tr');
	let html = `<th>Badplats</th>
        <th>Adress</th> 
        <th>Avstånd</th>`;
	row.innerHTML = html;
	document.getElementById('tBody').appendChild(row);
	console.log(sortedList);
	for (i = 0; i < list.length; i++) {
		console.log('körs');
		/*
		let li = list[i];
		let row = document.createElement('tr');
		let html = `<td>${li.name}</td><td>${li.adress}</td><td>${li.distance}</td>`;
		row.innerHTML = html;
		document.getElementById('tBody').appendChild('row');*/
	};
	
	
}
