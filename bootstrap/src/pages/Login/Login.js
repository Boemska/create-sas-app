import React, {Component} from 'react';
import {
	Row, Col, Form,
	FormGroup,
	Button, InputGroup
} from 'react-bootstrap'
import {withRouter} from 'react-router'
import adapterService from '../../adapterService/adapterService'
import {connect} from 'react-redux'
import {Card} from 'react-bootstrap'
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
		this.setState({error: '', validated: true})
		/*
		adapterService.login(this.state.username, this.state.password)
			.then(res => {
				console.log('[LOGIN RES]', res)
				this.props.logging(false);
			})
			.catch(e => {
				debugger
				if (e === -1) {
					this.setState({error: 'Username or password invalid'})
				} else if (e === -2) {
					this.setState({error: 'Problem communicating with server'});
				} else {
					this.setState({error: 'SAS login error with status code ' + e})
					console.log('[ADAPT SERVICE - LOGIN ERROR]', e.message || e.stack)
				}
			})
		*/
		// })
		// }
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
		const isOk = this.state.username.length > 4
		return isOk ? 'success' : 'error'
	}

	validatePassword() {
		if (!this.state.password) {
			return undefined
		}
		const isOk = this.state.password.length > 2
		return isOk ? 'success' : 'error'
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
				<div className="flex justify-content-center align-items-center">
					<Card className={'w100 mb0'}>
						<Row className="loginForm">
							<Col md={12}>
								<Form noValidate validated={this.state.validated}>
									<h1>Login</h1>
									<p className="text-muted">Sign In to your account</p>
									<FormGroup>
										<InputGroup>
											<InputGroup.Prepend><i className={'fas fa-user'}/></InputGroup.Prepend>
											<Form.Control
												name={'username'}
												className={`textInput`}
												placeholder={'Username'}
												value={this.state.username}
												onChange={this.onInputChange}
												required
											/>
										</InputGroup>
									</FormGroup>
									<FormGroup>
										<InputGroup>
											<InputGroup.Prepend><i className={'fas fa-lock'}/></InputGroup.Prepend>
											<Form.Control
												name={'password'}
												placeholder={'Password'}
												type={'password'}
												value={this.state.password}
												onChange={this.onInputChange}
												required
											/>
										</InputGroup>
									</FormGroup>
									<Row>
										<Col md={12}>
											<Button
												onClick={this.login}
												bsstyle={'primary'}
												disabled={this.validateEmail() === 'error' || this.validatePassword() === 'error' || !this.state.username || !this.state.password}
												className={'pull-right'}
											>Login</Button>
											{this.state.error && <div className={'text-danger'}>{this.state.error}</div>}
										</Col>
									</Row>
								</Form>
							</Col>
						</Row>
					</Card>
				</div>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		login: (u, p) => adapterService.login(dispatch, u, p)
	}
}
export default withRouter(connect(()=>({}), mapDispatchToProps)(Login));
