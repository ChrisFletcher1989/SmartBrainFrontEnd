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

const returnClarifaiRequestOptions = (imageUrl) => {
 const PAT ='0c1e3431a67a413db04239c90b89d1db';
 const USER_ID ='chrisfletcher';       
 const APP_ID ='smartbrain';
 const IMAGE_URL = imageUrl;

const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
  body: raw
};
return requestOptions;
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
 
  loadUser = (data) => {
    this.setState ({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

calculateFaceLocation = (data) => {
  console.log(data)
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

  calculateCeleb = (data) => {
    console.log("response from API", data) 
    const clarifaiCeleb = data.outputs[0].data.concepts[0];
    console.log(clarifaiCeleb)
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
  //function to grab correct details from API and return as <p>?

  displayFaceBox = (box) => {
    this.setState({box: box})
  }
  displayCelebBox = (box2) => {
    console.log(box2)
    this.setState({box2: box2})
  }


  onInputChange = (event) => {
this.setState({input: event.target.value})
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    const MODEL_ID = 'face-detection';
    const MODEL_ID2 = 'celebrity-face-recognition';

     fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiRequestOptions(this.state.input)) 
  .then(response => 
    response.json())
  .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))

  .catch(err => console.log('error', err));
  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID2 + "/outputs", returnClarifaiRequestOptions(this.state.input)) 
  .then(response => {
    if(response) {
      fetch('http://localhost:3000/image', {
        method: 'put',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
      }
      
    this.displayCelebBox(this.calculateCeleb(response))
      })

  .catch(err => console.log('error', err));
    }
onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState({isSignedIn: false})
  }
  else if (route === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

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