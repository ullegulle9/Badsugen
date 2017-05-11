
var mapRoot = document.getElementById('mapRoot'),
	logoutButton = document.getElementById('logoutButton');


var updateUser;

class LoginApp extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user: firebase.auth().currentUser,
            userProfileUrl:'',
        };
        //bind us together forever and ever
        this.loginFunction = this.loginFunction.bind(this);
        this.googleFunction = this.googleFunction.bind(this);
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
		localStorage.setItem("currentUserName", result.user.displayName);
		localStorage.setItem("currentUserURL", result.user.photoURL);

	}.bind(this)).catch(function (error) {
	console.log("Login error")
	alert("Kunde inte logga in ," + error);
});
};
googleFunction() {
let self = this;
	let googleProvider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(googleProvider).then(function (result) {
		
		self.setState({
		user : result.user,
		userProfileUrl : firebase.auth().currentUser.providerData[0].photoURL
		})
		localStorage.setItem("currentUserName", result.user.displayName);
		localStorage.setItem("currentUserURL", result.user.photoURL);
		console.log('DisplayName: ', self.state.user)
			console.log('userProfilePic', self.state.userProfileUrl )
	}).catch(function (error) {
		console.log("Login error")
		alert("Kunde inte logga in ," + error);
	})
};

updateDisplay(){
	mapRoot.style.display = 'block';
	logoutButton.style.display = 'block';
	
	//console.log(isLoggedIn);
}
	



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
		
	} else{
        // User not signed in.
        console.log("Ej inloggad, Meddelande till användare on inloggning")
        loginComp = <div><p id="nameHolder"></p><button className="loginBtn loginBtn--facebook" id="loginButton" onClick={this.loginFunction} >Logga in med Facebook <i className="fa fa-facebook fa-lg" aria-hidden="true"></i></button><br /> eller <br /><button className="loginBtn loginBtn--google" id="googleLogin" onClick={this.googleFunction}> Logga in med Google <i className="fa fa-google-plus fa-lg" aria-hidden="true"></i></button> </div>  
    }
	console.log("current user from firebase ",firebase.auth().currentUser);

    return (
    <div id="divContaienr">
			{loginComp}
    </div>
        )
    }
}
ReactDOM.render(
        <LoginApp />,
        document.getElementById('loginRoot')
      );