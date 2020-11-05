import React from 'react'
import {
	Page,
	section,
	Select,
	Button,
	Input,
	ListTitle
} from 'react-onsenui';
import * as ons from 'onsenui';
import CustomToolbar from "../customToolbar/customToolbar";

class FormInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			selectValue: "age"
		}
		this.name = 'formInput' //this name is mandatory for navigator to work
	}

	handleSignIn = () => {
		const {username, password, selectValue} = this.state;
		ons.notification.alert(`Username: ${username} , Password: ${password}, Select: ${selectValue}`);
	}

	onChange = (event) => {
		this.setState({[event.target.name]: event.target.value})
	}

	render() {
		return (
			<Page renderToolbar={()=><CustomToolbar title={'Form Input'}/>}>
				<section style={{"textAlign": 'center'}}>
					<ListTitle>
						docs: <a href='https://onsen.io/v2/api/react/Input.html'>input-docs-onsen</a>
					</ListTitle>
					<ListTitle>
						docs: <a href='https://onsen.io/v2/api/react/Select.html'>select-docs-onsen</a>
					</ListTitle>
					<p>
						<Input
							name="username"
							value={this.state.username}
							onChange={this.onChange}
							modifier='underbar'
							float
							placeholder='Username'/>
					</p>
					<p>
						<Input
							name="password"
							value={this.state.password}
							onChange={this.onChange}
							modifier='underbar'
							type='password'
							float
							placeholder='Password'/>
					</p>
					<p>
						<Select modifier="material"
										value={this.state.selectValue}
										onChange={(event) => this.setState({"selectValue": event.target.value})}>
							<option value="age">Age</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
						</Select>
					</p>
					<p>
						<Button onClick={this.handleSignIn}>Sign in</Button>
					</p>
				</section>
			</Page>
		)
	}
}

export default FormInput;
