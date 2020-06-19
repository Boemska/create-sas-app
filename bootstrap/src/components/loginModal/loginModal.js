import React from 'react'
import {Modal} from 'react-bootstrap'
import Login from '../../pages/Login/Login'
import {connect} from 'react-redux'
import './loginModal.scss'

class LoginModal extends React.PureComponent {
	render() {
		return (<Modal bssize="small" className={'h100 flex-important align-items-center'}
			show={this.props.shouldLogin}
			dialogClassName="loginModal"
		>
			<Modal.Body>
				<Login />
			</Modal.Body>
		</Modal>)
	}
}

function mapStateToProps(state) {
	return {
		shouldLogin: state.login.shouldLogin
	}
}

export default connect(mapStateToProps)(LoginModal)
