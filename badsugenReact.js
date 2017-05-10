

class InfoApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			adress: '',
			distance: null,
			id: null,
			currentObjId: '',
			lat: null,
			lng: null,
			weatherText: '',
			userName: '',
			userURL: '',
			owWind: null,
             owTemp: null,
             owIcon: null
		};
		this.streetViewImg = this.streetViewImg.bind(this);
		this.showWeather = this.showWeather.bind(this);
		this.updateCurrentObj = this.updateCurrentObj.bind(this);
		this.superfunction = this.superfunction.bind(this);
		this.openWeather = this.openWeather.bind(this);
		this.ApixuApi = this.ApixuApi.bind(this);
	}
	componentDidMount() {
		this.superfunction();
		this.openWeather();
	}
	
	updateCurrentObj(objId){
		let userName = localStorage.getItem('currentUserName');
		let userURL = localStorage.getItem('currentUserURL');
		console.log(userName, userURL);
		this.setState({
			currentObjId: objId,
			userName: userName,
			userURL: userURL
		});
		console.log('update');
		this.superfunction();
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
	
	openWeather(){
		console.log('openWe');
		return fetch(`http://api.openweathermap.org/data/2.5/weather?q=Gothenbueg&APPID=2d3055ddb7941ccc16f48f3aaeb29121&units=metric`)
         .then(function(res){
           return res.json();
         }) //chain
         .then(function(data){
           var iconUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon+ ".png";
           let vind = data.wind.speed + "m/s";
           let temp = data.main.temp + "°C";
           return this.setState({
             owWind: vind,
             owTemp: temp,
             owIcon: iconUrl
           }) ;
         }.bind(this));
	}
	
	ApixuApi() {
            let url1 = `http://api.apixu.com/v1/current.json?key=%20f064c533ae01465682e82338170905&q=${this.state.lat},${this.state.lng}`;
            
            let req1= new XMLHttpRequest();
            req1.onreadystatechange=() => {
                if(req1.status == 200 && req1.readyState == 4){
                    let json1= JSON.parse(req1.responseText);
                    console.log(json1);
                    let temperature = json1.current.temp_c;
                    let conditionText = json1.current.condition.text;
                    let conditionIcon = json1.current.condition.icon;
                    console.log(temperature);
                    console.log(conditionText);
                    console.log(conditionIcon);
                    this.setState({
                        weatherTextEmma: conditionText,
                        temperatureEmma: temperature,
                        iconEmma: conditionIcon
                    })
                }
            }
        req1.open('get', url1);
        req1.send(); 
        }
	
	 DarkskyWeatherApi(){
    console.log("Carls!!!")
        return fetch(`https://api.darksky.net/forecast/2da378f7b9b4c7a98fde4eebe0238193/57.70887,11.974559999999997`)
        .then(function(res){
            return res.json();
        })
        .then(function(data){
            let temp = data.currently.temperature
            let tempC = (temp-32)*(5/9);
            return this.setState({
                temperatureCarl: tempC.toFixed(1) + '°c'
            }.bind(this));
        });
    }
	
	superfunction(){
		let name = '';
		
		console.log('super',this.state.currentObjId);
		//let pressedID = localStorage.getItem('localPlaceID');
		//console.log('pressedID', pressedID);
		// Hämtar data från firebase
		//console.log(this.state.currentObjId);
		firebase.database().ref('badplatser/').on('value', function (snapshot) {
			
			let allData = snapshot.val();
			let list = [];
			//console.log(allData);
			for (let obj in allData) {
				//list.push(allData[obj]);
				
				if (allData[obj].id === this.state.currentObjId){ // Kontrollerar vilket objekt som klickats på
					let object = allData[obj];
					console.log(object);
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
					this.ApixuApi();
                    this.DarkskyWeatherApi();
				}
			}
			
			//console.log(this.state.distanceArray);
		}.bind(this));
	}
	
	render() {
		
		//console.log('oldID', oldId);
		currentObj = this.updateCurrentObj;
			//this.componentDidMount();
		
		
		//console.log(this.state.currentObjId);
		return <div id="badplatsInfo"> 
				<h2>{this.state.name}</h2> 
				<p> {this.state.adress}.<br></br>
					{this.state.distance} km från din position</p>
				<img src={this.streetViewImg()}></img>
				<Accuweather weatherText={this.state.weatherText}
					temperature={this.state.temperature} />
			<OpenWeather icon={this.state.owIcon}
			wind={this.state.owWind}
				temp={this.state.owTemp} />
			<EmmaApixuWeather weatherTextEmma={this.state.weatherTextEmma} temperatureEmma={this.state.temperatureEmma} iconEmma={this.state.iconEmma} />
                 <CarlDarkskyWeather temperatureCarl={this.state.temperatureCarl}/>
			</div>
	}
}
/*
class ListNearestBaths extends React.Component{
	render() {
		let sortedList = this.props.list.sort(function (a, b) {
		return a.distance - b.distance;
	});
		let closest5 = [];
	for (let i = 0; i < sortedList.length; i++){
		console.log(sortedList[i]);
	}
	let elementList = sortedList.map(el => {
		return <tr>
			<td>{el.name}</td>
			<td>{el.adress}</td>
			<td>{el.distance}</td>
			</tr>
	});
		//console.log('this.props.list',this.props.list.length);
		if(this.props.list.length > 0){
			return <div id="tableForm">
			<h2> Badplatser närmast dig:</h2>
			<table id="tabellBadplats">
				<tbody id="tBody">
					<tr>
						<th>Badplats</th>
						<th>Adress</th>
						<th>Avstånd</th>
					</tr>
					{elementList}
				</tbody>
			</table>
		</div>
		} else {
			return <span></span>
		}
		
	}
}

*/

class Accuweather extends React.Component {
        render(){
			return <div> 
				<h4>Väder från Accuweather</h4>
				<p>
                    {this.props.weatherText},    {this.props.temperature}°C</p>
                </div>
		}
}

class OpenWeather extends React.Component{
    render(){
      return (
        <div>
        <h4>Väder från Openweather</h4>
        <span>Vindstyrka:{this.props.wind}, temp: {this.props.temp}</span>
        </div>
      )
    }
}

class EmmaApixuWeather extends React.Component {
        render(){
            return <div> 
                <h4>Väder från Apixu</h4>
                <p>
                    {this.props.weatherTextEmma},    {this.props.temperatureEmma}°C</p>
                </div>
        }
}
class CarlDarkskyWeather extends React.Component {
        render(){
            return <div> 
                <h4>Väder från Darksky</h4>
                <p>
                    {this.props.temperatureCarl}°C</p>
                </div>
        }
}

ReactDOM.render( 
	<div>
	<InfoApp />
		<FormComponent /></div>,
	document.getElementById('badplatsPage')
);