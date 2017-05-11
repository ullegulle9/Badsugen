class LoginApp extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user: null,
            userProfileUrl:'',
			userObj: {}
        };
        //bind us together forever and ever
        this.loginFunction = this.loginFunction.bind(this);
        this.googleFunction = this.googleFunction.bind(this);
        /*this.logoutFunction = this.logoutFunction.bind(this);*/
    }
	loginFunction() {
		console.log('this:',this)
		let self = this;
		let provider = new firebase.auth.FacebookAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function (result) {
			//console.log(result.user.displayName);
			 self.setState({
				user: result.user,
				 userProfileUrl : firebase.auth().currentUser.providerData[0].photoURL
			})
			//// end checker
			//console.log('Email: ' , self.state.user.email)
			//console.log('DisplayName: ', self.state.user)
			//console.log('userProfilePic', self.state.userProfileUrl )
			let obj = {
				displayName: result.user.displayName,
				photoUrl: result.user.photoURL
			};
			/*
			this.setState({
				userObj: obj
			});*/
		}).catch();
	};
googleFunction() {
let self = this;
	let googleProvider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(googleProvider).then(function (result) {
		
		self.setState({
		user : result.user,
		userProfileUrl : firebase.auth().currentUser.providerData[0].photoURL
		})
		console.log('DisplayName: ', self.state.user)
			console.log('userProfilePic', self.state.userProfileUrl )
	});
};

updateDisplay(){
	mapRoot.style.display = 'block';
	//console.log(isLoggedIn);
}
/*
logoutFunction() {
	firebase.auth().signOut().then(function (result) {
		console.log("You are no more my friend");
	}).catch(function (error) {
		// Utloggning misslyckades
		console.log("Det gick inte som vi ville" + error);
		nameHolder.innerHTML = "Somting went wrong";
	});
};
*/
render() {
	let loginComp;
	if(this.state.user){ // If user is online
		loginComp =<p id="nameHolder">Du är nu inloggad</p>;
		console.log("Inloggad, Gå vidare till sidan")
		//<button id=logoutButton" onClick={this.logoutFunction}>Logout</button>
		//mapRoot.style.display = 'block';
		this.updateDisplay();
		initMap();
		//console.log(updateUser);
		localStorage.setItem("currentUserPicutre", this.state.userProfileUrl);
		
	} else {
		// User not signed in.
		console.log("Ej inloggad, Meddelande till användare on inloggning")
		loginComp = <div><p id="nameHolder">Please login with Facebook aor Google</p><button className="loginBtn loginBtn--facebook" id="loginButton" onClick={this.loginFunction} > Login with Facebook </button><button className="loginBtn loginBtn--google" id="googleLogin" onClick={this.googleFunction}> Login with Google </button> </div>	
	}
    return (
    <div id="divContaienr">
			{loginComp}
		<Weather />
			<InfoApp />
    </div>
        )
    }
}





class Weather extends React.Component{
  constructor() {
    super();
    this.state = {
      windSpeed: '',
      temperature: 0,
      icon: ''
    }
  }
    componentDidMount(){
      return fetch(`http://api.openweathermap.org/data/2.5/weather?q=Gothenbueg&APPID=2d3055ddb7941ccc16f48f3aaeb29121&units=metric`)
         .then(function(res){
           return res.json();
         }) //chain
         .then(function(data){
           var iconUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon+ ".png";
           let vind = data.wind.speed + "m/s";
           let temp = data.main.temp + "°C";
           return this.setState({
             windSpeed: vind,
             temperature:temp,
             icon: iconUrl
           }) ;
         }.bind(this));
    }
    render(){
      return (
        <div style={{marginTop:'2%'}}>
        <img src={this.state.icon}/>
        <span>windSpeed:{this.state.windSpeed}, temperature: {this.state.temperature}</span>
        </div>
      )
    }
}
let currentUserPicture = localStorage.getItem("currentUserPicture")

class FormComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      rating: 0,
      comment: '',
      color1: 'black',
      color2: "black",
      color3: "black",
      color4: "black",
      color5: "black",
	  currentObjId: null,
		commentList: []
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit .bind(this);
    // this.onStarClick = this.onStarClick.bind(this);
    this.handleRating1 = this.handleRating1.bind(this);
    this.handleRating2 = this.handleRating2.bind(this);
    this.handleRating3 = this.handleRating3.bind(this);
    this.handleRating4 = this.handleRating4.bind(this);
    this.handleRating5 = this.handleRating5.bind(this);
    this.resetStars = this.resetStars.bind(this);
	  this.updateCurrentObj = this.updateCurrentObj.bind(this);
 }
  resetStars(){
     this.setState({
       rating: 0,
       color1: "black",
       color2: "black",
       color3: "black",
       color4: "black",
       color5: "black"
     })
 }
 handleRating1(){
   if(this.state.rating===1){
     this.resetStars()
   }else{
     this.setState({
       rating: 1,
       color1: "#FFD700",
       color2: "black",
       color3: "black",
       color4: "black",
       color5: "black"
     })
   }
 }
 handleRating2(){
   if(this.state.rating===2){
     this.resetStars()
   }else{
     this.setState({
       rating: 2,
       color1: "#FFD700",
       color2: "#FFD700",
       color3: "black",
       color4: "black",
       color5: "black"
     })
   }
 }
 handleRating3(){
  if(this.state.rating===3){
    this.resetStars()
  }else{
    this.setState({
      rating: 3,
      color1: "#FFD700",
      color2: "#FFD700",
      color3: "#FFD700",
      color4: "black",
      color5: "black"
    })
  }
 }
 handleRating4(){
   if(this.state.rating===4){
     this.resetStars()
   }
   else{
     this.setState({
       rating: 4,
       color1: "#FFD700",
       color2: "#FFD700",
       color3: "#FFD700",
       color4: "#FFD700",
       color5: "black"
     })
   }
 }
 handleRating5(){
   if(this.state.rating===5){
     this.resetStars()
   }else{
     this.setState({
       rating: 5,
       color1: "#FFD700",
       color2: "#FFD700",
       color3: "#FFD700",
       color4: "#FFD700",
       color5: "#FFD700"
     })
   }
 }
 handleInput(event){
   this.setState({
     comment: event.target.value
   })
 }
 handleSubmit(){
   let fb = firebase.database();
   // firebase.database().ref('comment').push({rating: this.state.rating, comment: this.state.comment});
   // var self = this;
   //console.log(this.state.rating)
   let dataId;
   fb.ref('badplatser/').on('value', function (snapshot) {
     let data = snapshot.val();
     // Object.keys(data)
     for(let o in data){
       if(data[o].id === this.state.currentObjId){
         console.log(data[o].id);
         dataId = data[o].id;
       }
     }
	   let time = new Date().toString();
     fb.ref(`omdömen/${dataId}/rateComment/${time}`).set({rating: this.state.rating, comment: this.state.comment});
   }.bind(this))
   /*
   let list = []
   this.setState({
	   commentList: list
   });*/
 }
	showCommentsAndRating(){
		let list = [];
		let fb = firebase.database();
		fb.ref(`omdömen/${this.state.currentObjId}/rateComment/`).on('value', snap => {
			let data = snap.val();
			for (let obj in data){
				let object = {
					comment: data[obj].comment,
					rating: data[obj].rating
				}
				
				list.push(object);
				
			}
			this.setState({
					commentList: list
				});
				console.log(this.state.commentList);
		});
	}
	updateCurrentObj(objId){
		this.setState({
			currentObjId: objId
		});
		//console.log('funk');
		this.showCommentsAndRating();
	}
 render() {
   currentObj = this.updateCurrentObj;
	 let elementList = this.state.commentList.map(el => {
		 return <li>{el.comment}. Betyg: {el.rating} </li>
	 });
   return (
     <div>
		 <div>
			 <h3>Ge ditt betyg på den har badplatsen!</h3>
			 <span style={{color:this.state.color1}} onClick={this.handleRating1} className="fa fa-star" aria-hidden="true"></span>
			 <span style={{color:this.state.color2}} onClick={this.handleRating2} className="fa fa-star" aria-hidden="true"></span>
			 <span style={{color:this.state.color3}} onClick={this.handleRating3} className="fa fa-star" aria-hidden="true"></span>
			 <span style={{color:this.state.color4}} onClick={this.handleRating4} className="fa fa-star" aria-hidden="true"></span>
			 <span style={{color:this.state.color5}} onClick={this.handleRating5} className="fa fa-star" aria-hidden="true"></span>
			 
		 </div>
     <div>
     <input value={this.state.comment} onChange={this.handleInput} type="text" placeholder="Comments" />
     <button  onClick={this.handleSubmit}  type="button">Submit</button>
     </div>
		   <ul>{elementList}</ul>
     </div>
   );
 }
}

class InfoApp extends React.Component {
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
		this.updateCurrentObj = this.updateCurrentObj.bind(this);
		this.superfunction = this.superfunction.bind(this);
	}
	
	updateCurrentObj(objId){
		this.setState({
			currentObjId: objId
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
					//console.log(object);
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
			
			//console.log(this.state.distanceArray);
		}.bind(this));
	}
	
	updateUserInfo(obj){
		console.log(obj);
	}
	
	render() {
		//updateUser = this.updateUserInfo;
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

ReactDOM.render(
        <LoginApp />,
        document.getElementById('loginRoot')
      );