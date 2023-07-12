import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin'; 
import Register from './components/Register/Register'; 
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import DetectCeleb from './components/DetectCeleb/DetectCeleb';

//set Initial state
const initialState = {
  
 input: '',
      imageUrl: '',
      box: {},
      box2: {},
      calculateCeleb: [],
      route: 'signin',
      isSignedIn: false,
      user: {
            id: "",
            name: "",
            email: "",
            entries: 0,
            joined: ""      
      }
//Components
}
class App extends Component {
  constructor () {
    super ();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      box2: {},
      calculateCeleb: [],
      route: 'signin',
      isSignedIn: false,
      user: {
            id: "",
            name: "",
            email: "",
            entries: 0,
            joined: ""      
      }
    } 
  }
  //Routes
  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    }
    else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  
 //Get user from server
  loadUser = (data) => {
    this.setState ({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value})


    //Pass input to server and return JSON from it's Celeb recognition API
      }
      onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        fetch('http://localhost:3000/imageurl', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: this.state.input
          })
        })
          .then(response => response.json())

          //Continue to add count to profile
          .then(response => {
            if (response) {
              console.log("response from server", response);
              fetch('http://localhost:3000/image', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: this.state.user.id
                })
              })
                .then(response => response.json())
                .then(count => {
                  this.setState(Object.assign(this.state.user, { entries: count }))
                })
                .catch(console.log);
            }
      
            this.displayCelebBox(this.calculateCeleb(response));

            //Fetch box from facial recognition API (via server)
      
            fetch('http://localhost:3000/imagedetect', {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                input: this.state.input
              })
            })
              .then(response => response.json())
              .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
              .catch(err => console.log('error', err));
          })
          .catch(err => console.log('error', err));
      }

  //Box around face
calculateFaceLocation = (data) => {
  console.log("Face Location API response", data)
const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
 const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}   
//Recognize celebrity functions
  calculateCeleb = (data) => {
    console.log("response from celeb API", data) 
    let clarifaiCeleb = data.outputs[0].data.concepts[0];
    console.log(clarifaiCeleb.value)
     let Celebrity = clarifaiCeleb.name.toUpperCase()
   
     if (clarifaiCeleb.value > .9) return{
      Accuracy: "Confidence Level: Certain",
      celebrity: Celebrity  
    }
  
    else if (clarifaiCeleb.value > 0.7)
    return {
      Accuracy: "Confidence Level: Almost certain",
      celebrity: Celebrity  

    }
    else if (clarifaiCeleb.value > 0.5)
    return {
      Accuracy: "Confidence Level: Quite Certain",
      celebrity: Celebrity  

    }
    else if (clarifaiCeleb.value > 0.2)
    return {
      Accuracy: "Confidence Level: Not so certain",
      celebrity: Celebrity  
    }

          else return {
        Accuracy: "That's a toughie, this is a stab in the dark to be honest",
        celebrity: Celebrity
      }
    }
  //function to grab correct details from API and return as <p>

  displayFaceBox = (box) => {
    console.log("box", box)
    this.setState({box: box})
  }
  displayCelebBox = (box2) => {
    console.log("celeb", box2)
    this.setState({box2: box2})
  }

//The html

  render() {
    const { isSignedIn, imageUrl, route, box, box2 } = this.state;
  return (
    <div className="App">
    <ParticlesBg type="cobweb" bg={true} color="#22A7F0" className="particles"/>
     <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
     { route === 'home'
     ? <div><Logo />
     <Rank name={this.state.user.name} entries= {this.state.user.entries}/>
     <ImageLinkForm
     onInputChange={this.onInputChange} 
     onButtonSubmit={this.onButtonSubmit}/>

     <DetectCeleb box2={box2}></DetectCeleb>
     <FaceRecognition box={box} imageUrl ={imageUrl}/>  
     </div>
      : (
        route === 'signin' ?
        <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      :
        <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>

      )
     
     } 
     <ParticlesBg/>

    </div>
  );
}
}

export default App;