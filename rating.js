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
      color5: "black"
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
   console.log(this.state.rating)
   let dataId;
   fb.ref('badplatser/').on('value', function (snapshot) {
     let data = snapshot.val();
     // Object.keys(data)
     for(let o in data){
       if(data[o].pressed !== undefined){
         // console.log(this.state.rating)
         dataId = data[o].id
       }
     }
     fb.ref(`badplatser/${dataId}/rateComment/`).set({rating: this.state.rating, comment: this.state.comment});
   }.bind(this))
 }
 render() {
   // const { rating } = this.state;
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
     </div>
   );
 }
}

/*ReactDOM.render(
	<div>
	 <Weather />
		<FormComponent />
	</div>, document.getElementById('badplatsPage')
);*/
