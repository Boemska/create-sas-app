import React from 'react'
import Login from '../../pages/Login/Login'

import {connect} from 'react-redux'
import './loginModal.scss'

class LoginModal extends React.PureComponent {
	render() {
		return (
			<div style={{visibility: this.props.shouldLogin ? "visible" : "hidden"}}>
				<Login/>
			</div>)
	}
}

function mapStateToProps(state) {
	return {
		shouldLogin: state.login.shouldLogin
	}
}

export default connect(mapStateToProps)(LoginModal)
