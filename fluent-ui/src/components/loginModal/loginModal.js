import React from 'react'
// import {Modal} from 'react-bootstrap'
import {Modal} from '@fluentui/react'
import Login from '../../pages/Login/Login'
import {connect} from 'react-redux'
import './loginModal.scss'

class LoginModal extends React.PureComponent {
	render() {
		return (<Modal
			titleAriaId={'loginModalId'}
			subtitleAriaId={'loginModalTitle'}
			isOpen={this.props.shouldLogin}
			isBlocking={false}
		>
			<div className={'loginFormContaienr'}>
				<Login/>
			</div>
		</Modal>)
	}
}

function mapStateToProps(state) {
	return {
		shouldLogin: state.login.shouldLogin
	}
}

export default connect(mapStateToProps)(LoginModal)
