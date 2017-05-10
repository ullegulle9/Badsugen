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
var pressedID;
var currentObj;
var currentObj2;

/*
window.onload = function(){
	firebase.database().ref('pressed/').remove();
}
*/

document.getElementById('badplatsPage').style.display = 'none';


function initMap() {
	distanceArray = [];
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




var distanceArray = [];


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Din plats kunde inte lokaliseras' :
		'Var vänlig tillåt applikationen att hämta platsinfo och försök igen');
	infoWindow.open(map);
}

function callback(results, status) {

	if (status == google.maps.places.PlacesServiceStatus.OK) {
		//console.log(results);
		for (var i = 0; i < results.length; i++) {
			let lat = results[i].geometry.location.lat();
			let lng = results[i].geometry.location.lng();
			//console.log(lng);
			let id = results[i].id;
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
						distance: response.rows[0].elements[0].distance.value,
						id: id,
						lat: lat,
						lng: lng
					}
					//distanceArray.push(obj);
					//console.log('obj', obj);
					//console.log(distanceArray);
					listBaths(obj);

					// React: setState componentDidMount
					//console.log('length:', distanceArray.length);
				}
			})
			var place = results[i];
			createMarker(results[i]);
		}
		//console.log(distanceArray);



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
	//console.log(place);
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: "img/swimicon-green-small.png"
	});

	google.maps.event.addListener(marker, 'click', function () {
		//console.log(place);
		let obj = {
			id: place.id,
			name: place.name
		};
		currentObj(obj.id);
		currentObj2(obj.id);
		//console.log('currentObj');
		//hasBeenPressed = true;
		//firebase.database().ref('badplatser/' + obj.id + '/pressed').set(obj);
		pressedID = obj.id;
		//localStorage.setItem('localPlaceID', pressedID);
		//console.log(localStorage.getItem('localPlaceID'));
		document.getElementById('mapRoot').style.display = 'none';
		document.getElementById('badplatsPage').style.display = 'block';
		/*
		infoWindow.setContent('<strong>' + place.name + '</strong>' + '<br>' + place.vicinity + '<br>Betyg: ' + place.rating);
		
		infoWindow.open(map, this);*/
	});

}



let table = document.getElementById('tabellBadplats');
table.style.display = 'none';

function listBaths(obj) {
	//setTimeout(function, milliseconds)
	
	distanceArray.push(obj);
	//console.log('distanceArray', distanceArray);
	/*
		let distance = obj.distance / 1000;
		let roundDistance = distance.toFixed(2);
		table.style.display = 'block';
		let row = document.createElement('tr');
		let html = `<td>${obj.name}</td>
					<td>${obj.adress}</td>					
					<td>${roundDistance}km</td>`
		row.innerHTML = html;
		document.getElementById('tBody').appendChild(row);*/
	firebase.database().ref('badplatser/' + obj.id).set(obj);
	listNearestBaths(distanceArray);
}

function listNearestBaths(list) {
	//console.log('list',list);
	table.style.display = 'block';
	//console.log('list',list);
	let sortedList = list.sort(function (a, b) {
		return a.distance - b.distance;
	});
	
	let tBody = document.getElementById('tBody');
	tBody.innerHTML = '';
	let row = document.createElement('tr');
	let html = `<th>Badplats</th>
        		<th>Adress</th> 
        		<th>Avstånd</th>`;
	row.innerHTML = html;
	tBody.appendChild(row);
	//console.log(sortedList);
	for (i = 0; i < sortedList.length; i++) {
		if (i >= 5) {
			break;
		}
		let li = sortedList[i];
		//console.log('Loopnr: ',i, 'dist:', li.distance);
		if (sortedList[i] !== undefined) {


			let distance = li.distance / 1000;
			let roundDistance = distance.toFixed(2);
			let formAdress = deleteSwe(li.adress);
			let row = document.createElement('tr');
			let html = `<td>${li.name}</td><td>${formAdress}</td><td>${roundDistance}km</td>`;
			row.innerHTML = html;
			document.getElementById('tBody').appendChild(row);
		}

	};
}

function deleteSwe(string) {
	let deleteAmount = string.length - 10;

	//console.log(string.length);
	let endPos = string.length - 9;
	let newString = string.substring(0, endPos);
	return newString;
}
