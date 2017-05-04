



function Weather(){
  return fetch(`http://api.openweathermap.org/data/2.5/weather?q=Gothenbueg&APPID=2d3055ddb7941ccc16f48f3aaeb29121&units=metric`)
     .then(function(res){
       return res.json();
     }) //chain
     .then(function(data){
       var iconUrl = "http://openweathermap.org/img/w/" + data.weather[0].icon+ ".png";
       var self = this;
       return self.setState({
         text: `windSpeed: ${data.wind.speed},temperature: ${data.main.temp}`,
         icon: iconUrl
       }) ;
     });
}


class FormComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      rating: 0,
      comment: ''
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit .bind(this);
    this.onStarClick = this.onStarClick.bind(this);
    }
 handleInput(event){
   this.setState({
     comment: event.target.value
   })
 }
 handleSubmit(){
    fb.ref('comment').push().set({rating: this.state.rating, comment: this.state.comment});
    // var self = this;
    // fb.ref('comment/').once('value')
    // .then(function(snapshot){
    //   var a = snapshot.val();
    //   var comment = Object.keys(a).map(function(x){return a[x] });
    //   self.setState({
    //     rating: comment.rating,
    //     comment: comment.comment
    //   })
    // });
 }
  onStarClick(nextValue, prevValue, name) {
    debugger
    this.setState({rating: nextValue});
  }

  render() {
    const { rating } = this.state;
    return (
      <div>
      <input value={this.state.comment} onChange={this.handleInput} type="text"  className="form-control" placeholder="Comments" />
      <button  onClick={this.handleSubmit} className="btn btn-success" type="button">Submit</button>
      <input type={"hidden"} className={"rating"}/>
      </div>
    );
  }
}
