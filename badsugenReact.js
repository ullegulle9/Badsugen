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
		};
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
					console.log(object);
					let distanceKm = object.distance/1000;
					let distanceRound = distanceKm.toFixed(1);
					this.setState({
							name: object.name,
							adress: object.adress,
							distance: distanceRound,
							id: object.id,
							hasBeenPressed: true
						});
				}
			}
			
		}.bind(this));
		
	}
	render() {
		//this.componentDidMount();
		if (this.state.hasBeenPressed) {
			return <div id="badplatsInfo"> <h2> {
					this.state.name
				} </h2> <p> {
					this.state.adress
				}.<br></br> {
					this.state.distance
				}
			km från din position </p></div>
			//<LocationPhoto />
		} else {
			return <div></div>
			
		}
	}
}

class LocationPhoto extends React.Component{
	
}


ReactDOM.render( 
	<App />,
	document.getElementById('badplatsPage')
);
