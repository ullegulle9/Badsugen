
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			adress: '',
			distance: null,
			id: null,
			currentObjId: '',
			hasBeenPressed: false,
			lat: null,
			lng: null,
			weatherText: ''
		};
		this.streetViewImg = this.streetViewImg.bind(this);
		this.showWeather = this.showWeather.bind(this);
	}
	componentDidMount() {
		let name = ''
		
		// Hämtar data från firebase
		firebase.database().ref('badplatser/').on('value', function (snapshot) {
			
			let allData = snapshot.val();
			//console.log(allData);
			for (let obj in allData) {
				
				
				if (allData[obj].pressed !== undefined){ // Kontrollerar vilket objekt som klickats på
					let object = allData[obj];
					console.log(object.lat, object.lng);
					let distanceKm = object.distance/1000;
					let distanceRound = distanceKm.toFixed(1);
					this.setState({
							name: object.name,
							adress: object.adress,
							distance: distanceRound,
							id: object.id,
							hasBeenPressed: true,
							lat: object.lat,
							lng: object.lng
						});
					
					this.streetViewImg();
					this.getAccumulateKey();
				}
			}
			
		}.bind(this));
		
	}
	
	streetViewImg() {
       let url = `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${this.state.lat},${this.state.lng}&fov=90&heading=235&pitch=10&key=AIzaSyDjN2L8aBzBXjy_atERRLKEiikp1EWuJUQ`;
		return url;
    }
	
	getAccumulateKey() {
            let url1 = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=jcsBwFjECEb5T6Us3Wyb2kzXiVFI3hAG&q=57.5807435%2C11.931910099999982&language=sv";
            
            let req1= new XMLHttpRequest();
            req1.onreadystatechange=() => {
                if(req1.status == 200 && req1.readyState == 4){
                    let json1= JSON.parse(req1.responseText);
                    let key= json1.Key;
                    this.showWeather(key);
                }
            }
        req1.open('get', url1);
        req1.send(); 
    }
	
	showWeather(x) {
            //console.log(x);
            let url2= `http://dataservice.accuweather.com/currentconditions/v1/${x}?apikey=jcsBwFjECEb5T6Us3Wyb2kzXiVFI3hAG&language=sv`;
            
            let req2= new XMLHttpRequest();
            req2.onreadystatechange=() => {
                if(req2.status == 200 && req2.readyState == 4){
                    let json2= JSON.parse(req2.responseText);
                    this.setState({
                        weatherText: json2[0].WeatherText,
                        temperature: json2[0].Temperature.Metric.Value 
                    });
                }
            }
            req2.open('get', url2);
            req2.send();

    }
	
	render() {
		//this.componentDidMount();
		if (this.state.hasBeenPressed) {
			return <div id="badplatsInfo"> 
				<h2>{this.state.name}</h2> 
				<p> {this.state.adress}.<br></br>
					{this.state.distance} km från din position</p>
				<img src={this.streetViewImg()}></img>
				<Accuweather weatherText={this.state.weatherText}
					temperature={this.state.temperature} />
			</div>
		} else {
			return <div></div>
		}
	}
}

class LocationPhoto extends React.Component{
	
}

class Accuweather extends React.Component {
        render(){
			return <div> 
				<h4>Väder från Accuweather</h4>
				<p>
                    {this.props.weatherText},    {this.props.temperature}°C</p>
                </div>
		}
}

ReactDOM.render( 
	<div>
	<App />
	<Weather />
		<FormComponent /></div>,
	document.getElementById('badplatsPage')
);