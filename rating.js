

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
		commentList: [],
		userName: '',
		userURL: '',
		clickedID: null
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
	  this.clickList = this.clickList.bind(this);
	  this.handleEdit = this.handleEdit.bind(this);
	  this.sortChange = this.sortChange.bind(this);
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
	 console.log('submit körs');

   let dataId = this.state.currentObjId;
   
   let time = new Date().toLocaleString();

     fb.ref(`omdömen/${dataId}/rateComment/${time}`).set({
		 rating: this.state.rating,
		 comment: this.state.comment,
		 userName: this.state.userName,
		 userURL: this.state.userURL,
		 time: time
	 });
	 this.setState({
		 comment: '',
		 rating: 0
	 });
   this.showCommentsAndRating();
 }
	
	
	showCommentsAndRating(){
		console.log('showcomments kör');
		let list = [];
		this.setState({
			commentList: list
		});
		let fb = firebase.database();
		fb.ref(`omdömen/${this.state.currentObjId}/rateComment/`).on('value', snap => {
			let data = snap.val();
			for (let obj in data){
				console.log(data[obj]);
				let object = {
					comment: data[obj].comment,
					rating: data[obj].rating,
					userName: data[obj].userName,
					userURL: data[obj].userURL,
					time: data[obj].time
				};

				list.push(object);

				this.setState({
					commentList: list
				});

			}

		});
	}
	updateCurrentObj(objId){
		console.log('updatecurrentObj');
		let userName = localStorage.getItem('currentUserName');
		let userURL = localStorage.getItem('currentUserURL');
		//console.log(userName, userURL);
		this.setState({
			currentObjId: objId,
			userName: userName,
			userURL: userURL
		});
		this.showCommentsAndRating();

	}

	clickList(ev){

		

		//console.log(ev.target.parentElement);

		let commentId = ev.target.parentElement.id;
		//console.log(commentId);
		this.setState({
			clickedID: commentId
		});
		//console.log(this.state.clickedID);
		
		this.showCommentsAndRating();
	}


	handleEdit(){
		//console.log('click');
		//console.log(this.state.clickedID);
		let fb = firebase.database();
		let obj;
		fb.ref(`omdömen/${this.state.currentObjId}/rateComment/${this.state.clickedID}`).on('value', snap => {
			let data = snap.val();
			//console.log(data);
			obj = {
					comment: this.state.comment,
					rating: data.rating,
					userName: data.userName,
					userURL: data.userURL,
					time: data.time
			};
			/*
			for (let obj in data){
				console.


			} */
		});

		fb.ref(`omdömen/${this.state.currentObjId}/rateComment/${this.state.clickedID}`).set(obj);

		this.setState({
			clickedID: null,
			comment: '',
			rating: 0
		});

		this.showCommentsAndRating();
	}
	
	sortChange(ev){

		console.log(this.state.currentObjId);
		console.log(ev.target.value);
	let fb = firebase.database();	fb.ref(`omdömen/${this.state.currentObjId}/rateComment/`).orderByChild(ev.target.value).once('value', snap => {
			let sorted = [];
		snap.forEach(o =>{
			sorted.push(o.val());
		});
		this.setState({
			commentList: sorted.reverse()
		});
		
		});
	}

	/*<li>
         <i id="changeComment" class="fa fa-pencil-square-o fa-5" aria-hidden="true"></i><img src="https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-1/p160x160/13256253_10154096534105792_6902039832411105859_n.jpg?oh=cb5c804b5fc34ca34451d80448526c05&oe=59B8A842" alt="profilbild" id="">
        <p id="NameComment">Martin Larsson <span id="posted">Postat 2017-05-11 10:57:05</span></p>
        <p class="writtenComment">"Så himla bra badplats! Så himla bra badplats! Så himla bra badplats!"</p>
        <p id="rating">Betyg: 5</p>
       
    </li>*/

 render() {
   currentObj2 = this.updateCurrentObj;
	 let elementList = this.state.commentList.map(el => {
		 return <li key={el.time} id={el.time}>
			 <i className="fa fa-pencil-square-o fa-5 changeComment" aria-hidden="true" onClick={this.clickList}></i>
			 <img src={el.userURL} alt="profilbild"/>
			 <p className="NameComment">{el.userName} <span className="posted">Postat {el.time}</span></p>
			 <p className="writtenComment">{el.comment} </p>
			 <p className="rating">Betyg: {el.rating}</p>
			  </li>
	 });
	 //console.log(this.state.clickedID);
	 if (this.state.clickedID === null) {
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
     <input value={this.state.comment} onChange={this.handleInput} type="text" placeholder="Kommentarer..." />
     <button  onClick={this.handleSubmit}  type="button">Skicka</button><br></br><h3>Kommentarer</h3>
		 <span>Sortera efter</span>
		 <select onChange={this.sortChange}>
			 <option value="rating">Betyg</option>
			 <option value="time">Datum</option>
		 </select>
     </div>
		   <ul>{elementList}</ul>
     </div>


   );
	 } else {
		 return <div>
		 <div>
			 <h3>Ge ditt betyg på den har badplatsen!</h3>
			 <span style={{color:this.state.color1}} onClick={this.handleRating1} className="fa fa-star" aria-hidden="true"></span>
			 <span style={{color:this.state.color2}} onClick={this.handleRating2} className="fa fa-star" aria-hidden="true"></span>
			 <span style={{color:this.state.color3}} onClick={this.handleRating3} className="fa fa-star" aria-hidden="true"></span>
			 <span style={{color:this.state.color4}} onClick={this.handleRating4} className="fa fa-star" aria-hidden="true"></span>
			 <span style={{color:this.state.color5}} onClick={this.handleRating5} className="fa fa-star" aria-hidden="true"></span>
		 </div>
     <div>
     <input value={this.state.comment} onChange={this.handleInput} type="text" placeholder="Ändra" />
     <button  onClick={this.handleEdit}  type="button">Redigera kommentar</button>
     </div>
		   <ul>{elementList}</ul>
     </div>
	 }
 }
}

/*ReactDOM.render(
	<div>
	 <Weather />
		<FormComponent />
	</div>, document.getElementById('badplatsPage')
);*/
