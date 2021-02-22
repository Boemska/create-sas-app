import React, {Component} from 'react';
import {withRouter} from 'react-router'
import './login.scss'
import adapterService from '../../adapterService/adapterService'
import {connect} from 'react-redux'
import {Page, section, Button, Input, Toolbar} from 'react-onsenui';
import {setWelcomeMessage} from '../home/homeActions'

class LoginPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			password: '',
			loginPressed: false,
			error: ''
		}
		this.name = 'login-page'
		this.login = this.login.bind(this)
		this.validateEmail = this.validateEmail.bind(this)
		this.validatePassword = this.validatePassword.bind(this)
		this.onInputChange = this.onInputChange.bind(this)
	}

	login() {
		this.setState({error: ''})
		this.setState({loginPressed: true})
		this.props.login(this.state.username, this.state.password)
			.then(response => {
				this.setState({loginPressed: false})
				this.props.setWelcomeMessage(true);
			})
			.catch(e => this.setState({error: e, loginPressed: false}))
	}

	validateEmail() {
		if (! this.state.username) {
			return undefined
		}
		// const isEmail = RegExp(/^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/).test(this.state.username.trim())
		const isOk = this.state.username.length > 4
		return isOk ? 'success' : 'error'
	}

	validatePassword() {
		if (! this.state.password) {
			return undefined
		}
		const isOk = this.state.password.length > 2
		return isOk ? 'success' : 'error'
	}

	onInputChange(e) {
		const name = e.target.name
		const value = e.target.value
		this.setState({[name]: value})
	}

	renderToolbar() {
		return (
			<Toolbar>
				<div className='center'>
					Login
				</div>
			</Toolbar>
		)
	}

	render() {
		return (
			<Page renderToolbar={this.renderToolbar}>
				<section className={'centerSection'}>
					<p className={'text-muted text-bottom-margin'}>Sign In to your account</p>
					<i className={'fas fa-user iconMargin'}/>
					<Input
						className={'input-margin'}
						name={'username'}
						value={this.state.username}
						onChange={this.onInputChange}
						modifier='material'
						float={true}
						placeholder='Username'
					/>
					<p/>
					<i className={'fas fa-lock iconMargin'}/>
					<Input
						className={'input-margin'}
						name={'password'}
						value={this.state.password}
						onChange={this.onInputChange}
						modifier='material'
						float={true}
						type='password'
						placeholder='Password'
					/>
					<p/>
					{this.state.error ? <div className={'text-danger'}>{this.state.error}</div> :
						<div style={{height: "20px"}}/>}
					<Button
						className="loginBtn"
						onClick={this.login}
						disabled={this.validateEmail() === 'error' || this.validatePassword() === 'error' || ! this.state.username || ! this.state.password || this.state.loginPressed}
					>Login</Button>
				</section>
			</Page>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		setWelcomeMessage: isActive => setWelcomeMessage(dispatch, isActive),
		login: (username, password) => adapterService.login(dispatch, username, password)
	}
}

export default withRouter(connect(() => ({}), mapDispatchToProps)(LoginPage));
