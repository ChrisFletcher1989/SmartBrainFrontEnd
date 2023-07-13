import React from "react";
//States
class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signInEmail: '',
      signInPassword: ''
    }
  }
  //Inputs
  onEmailChange = (event) => {
this.setState({signInEmail: event.target.value})
  }
  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value})
      }

    //Fetch user from server
      onSubmitSignIn = () => {
        fetch('https://git.heroku.com/fierce-cliffs-57128.git/signin', {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            email: this.state.signInEmail,
            password: this.state.signInPassword
          })
        })      
        .then(response => response.json())
        .then(user => {
          if(user.id) {
            this.props.loadUser(user);
          this.props.onRouteChange('home')

          }
        })
      }
//The html

  render() {
const { onRouteChange } = this.props;

    return (
        <article className="br6 ba b--black-10 mv4 w-100 w-50-m w-35-l mw6 shadow-5 center">

        <main className="pa4 black-80"> 
        <div className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address" >Email</label>
              <input 
              className="pa2 input-reset ba4  hover-bg-black hover-white w-100" 
              type="email" 
              name="email-address" placeholder="メールアドレスご記入ください" 
              id="email-address" 
              onChange={this.onEmailChange}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
              <input className="b pa2 input-reset ba4 hover-bg-black hover-white w-100" 
              type="password" 
              name="password"  placeholder="パスワードご記入ください"
              id="password" 
              onChange={this.onPasswordChange}
              />
            </div>
          </fieldset>
          <div className="">
            <input 
            onClick={this.onSubmitSignIn}
            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
            type="submit" 
            value="Sign in" />
          </div>
          <div className="lh-copy mt3">
            <p onClick={() => onRouteChange('register')}
className="f6 link dim black db pointer">Register/新規登録</p>
          </div>
        </div>
      </main> 
     </article>
    );
}
}
export default Signin;