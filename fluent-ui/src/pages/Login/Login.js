import React, {Component} from 'react';
import {withRouter} from 'react-router'
import adapterService from '../../adapterService/adapterService'
import {connect} from 'react-redux'
import {PrimaryButton as Button, TextField, Stack} from '@fluentui/react';
import './login.scss'

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			username: 'jimdemo',
			password: 'Bigballs1',
			error: ''
		}
		this.login = this.login.bind(this)
		this.validateEmail = this.validateEmail.bind(this)
		this.validatePassword = this.validatePassword.bind(this)
		this.onInputChange = this.onInputChange.bind(this)
	}

	login() {
		this.setState({error: ''})
		this.props.login(this.state.username, this.state.password)
			.then(res => {
				console.log('login response', res)
			})
			.catch(e => this.setState({error: e.message}))
	}

	validateEmail() {
		if (!this.state.username) {
			return undefined
		}
		// const isEmail = RegExp(/^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/).test(this.state.username.trim())
		const isOk = this.state.username.length > 2
		return isOk ? '' : 'Usrename has to be longer than 2 characters'
	}

	validatePassword() {
		if (!this.state.password) {
			return undefined
		}
		const isOk = this.state.password.length > 2
		return isOk ? '' : 'Password has to be longer than 2 characters'
	}

	onInputChange(e) {
		const name = e.target.name
		const value = e.target.value
		this.setState({
			[name]: value
		})
	}

	render() {
		return (
			<div className="login">
				<form>
					<h1>Login</h1>
					<p className="text-muted">Sign In to your account</p>
					<Stack
						tokens={ {childrenGap: 15 }}
    				styles={ {root:{ width: 300 }}}
						>
					<TextField
						prefix={<i className={'fas fa-user'}/>}
						name={'username'}
						className={`textInput`}
						placeholder={'Username'}
						value={this.state.username}
						onChange={this.onInputChange}
						onGetErrorMessage={this.validateEmail}
					/>
					<TextField
						prefix={<i className={'fas fa-lock'}/>}
						name={'password'}
						placeholder={'Password'}
						type={'password'}
						value={this.state.password}
						onChange={this.onInputChange}
						className={'mb-4'}
						onGetErrorMessage={this.validatePassword}
					/>
					</Stack>
					<div>
						<Button
							onClick={this.login}
							disabled={this.validateEmail() === 'error' || this.validatePassword() === 'error' || !this.state.username || !this.state.password}
							className={'mt-15'}
						>Login</Button>
						{this.state.error && <div className={'text-danger'}>{this.state.error}</div>}
					</div>
				</form>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		login: (u, p) => adapterService.login(dispatch, u, p)
	}
}

export default withRouter(connect(() => ({}), mapDispatchToProps)(Login));
