class App extends React.Component{
	render(){
		return <Map />
	}
}

class Map extends React.Component{
	constructor() {
		super(...arguments);
		window.initMap = this.initMap;
	}
	
	initMap() {
		
		new google.maps.Map(document.getElementById('map'), {
			center: {lat: 0, lng: 0},
			zoom: 10
		});
	}
	render(){
		return <div id="mapSection">Map</div>
	}
	
	
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);