import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const constants = {
	SESSION_KEY: 'session'
}

class PrivateRoute extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loaded: false,
			callback: null
		}
		const searchParams = new URLSearchParams(this.props.location.search);
		this.session = localStorage.getItem(constants.SESSION_KEY)

	}



	render() {
		console.log('PROPS', this.props)
		const {component: Component, ...rest} = this.props;
		const {loaded} = this.state;

		if (!this.session && !loaded) {
			return <Route {...rest} render={props => <Redirect to={{pathname: '/login', state: {from: props.location}}}/>}/>
		}

		let token = null
		if (this.session) {
			token = JSON.parse(this.session).token
		}
		if (token) {
			return <Route {...rest} render={props => <Component {...props}/>}/>
		} else {
			return <Route {...rest} render={props => <Redirect to={{pathname: '/login', state: {from: props.location}}}/>}/>
		}
	}
}

export default PrivateRoute

const mockSession = {
	"name": "Amazon ASDF",
	"email": "amazon@asdf.com",
	"phoneNumber": "+1111223344",
	"accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbWF6b25AYXNkZi5jb20iLCJhdXRob3JpdGllcyI6W3siYXV0aG9yaXR5IjoiYWRtaW5fZW5kcG9pbnRzIn0seyJhdXRob3JpdHkiOiJ1c2VyX2VuZHBvaW50cyJ9XSwidXNlcklkIjoyLCJjbGllbnRJZCI6MiwiY2xpZW50TmFtZSI6ImFtYXpvbiIsInVzZXJzTmFtZSI6IkFtYXpvbiBBU0RGIiwiaWF0IjoxNTYyMDU0ODcxLCJleHAiOjE1NjIwNTg0NzF9.H8jQIjj1L-yAIRIj5no0dRFzqf-6SwBcTIKTpq9YM5z4A3WLUXeoi9sj0NA9ETZXrrR2TXM7ZAQzHyKnIv6pZg",
	"refreshToken": "C-dtTfHO73AQhX-NQV0io4pjZWB-KAbxaDZdKtGCOTC1ETM_ZgB9V1dVzl5_O0M_VsjW_lfVLwWvQ9LDiuPlHcXXTY1-xamXVdFrUtHzRmM",
	"client": "amazon",
	"authorities": ["admin_endpoints", "user_endpoints"]
}
