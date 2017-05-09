class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user: null,
            userProfileUrl:''
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
			 self.setState({
				user: result.user,
				 userProfileUrl : firebase.auth().currentUser.providerData[0].photoURL
			})
			//// end checker
			console.log('Email: ' , self.state.user.email)
			console.log('DisplayName: ', self.state.user)
			console.log('userProfilePic', self.state.userProfileUrl )
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

pushToLocalStorage(){
	localStorage.setItem("currentUser", "this.state.userProfileUrl");
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
		localStorage.setItem("currentUserPicutre", this.state.userProfileUrl);
	} else {
		// User not signed in.
		console.log("Ej inloggad, Meddelande till användare on inloggning")
		loginComp = <div><p id="nameHolder">Please login with Facebook aor Google</p><button className="loginBtn loginBtn--facebook" id="loginButton" onClick={this.loginFunction} > Login with Facebook </button><button className="loginBtn loginBtn--google" id="googleLogin" onClick={this.googleFunction}> Login with Google </button> </div>	
	}
    return (
    <div id="divContaienr">
			{loginComp}
		
    </div>
        )
    }
}
ReactDOM.render(
        <App/>,
        document.getElementById('loginRoot')
      );