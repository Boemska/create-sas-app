import React from 'react';
import {connect} from 'react-redux';
import {platform} from 'onsenui';
import {createNewProject} from './addProjectActions'

import {
	Fab,
	Icon,
	Button,
	Input,
	AlertDialog
} from 'react-onsenui';
import {fetchProjects} from '../../pages/projectList/projectListActions'

class AddProject extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			name: "",
			description: "",
		}
	}

	onChange = (event) => {
		this.setState({[event.target.name]: event.target.value})
	}

	showAddProjectDialog = (isOpen) => {
		this.setState({isOpen: isOpen})
	}

	addNewProject=()=>{
		//dispatch({type: ActionTypes.CLEAR})
		//if (props.edit === null) {
		const {name,description}=this.state;
			const forSubmit = {
				name: name,
				createdOn: new Date(),
				createdBy: this.props.userData.id,
				description: description
			}
			console.log(forSubmit);

			const res = this.props.createNewProject(name, forSubmit, false);

			res.then((res) => {
				console.log('response', res)
				this.showAddProjectDialog(false);
			})
		// } else {
		// 	const newProject = {
		// 		...projectContent,
		// 		name: project.name,
		// 		description: project.description
		// 	}
		// 	dispatch({
		// 		type: ProjectActons.UPDATE_PROJECT,
		// 		payload: newProject
		// 	})
		//
		// 	props.close();
		}


	button = () => {
		let button;

		if (platform.isAndroid()) {
			button = (
				<Fab
					onClick={()=>this.showAddProjectDialog(true)}
					ripple
					position='bottom right'>
					<Icon icon='md-plus'/>
				</Fab>
			);
		} else {
			button = (
				<Button onClick={()=>this.showAddProjectDialog(true)} modifier='large quiet'>+ Add Project</Button>
			);
		}
		return button;
	}

	render() {
		return (
			<div>
				{this.button()}
				<AlertDialog isOpen={this.state.isOpen} isCancelable={true}>
					<div className='alert-dialog-title'>Add new project</div>
					<div className='alert-dialog-content'>
						<Input
							name="name"
							value={this.state.name}
							onChange={this.onChange}
							modifier='underbar'
							//ref={node => (input = node)}
							placeholder='Project name' float
						/>
						<Input
							name="description"
							value={this.state.description}
							onChange={this.onChange}
							modifier='underbar'
							//ref={node => (input = node)}
							placeholder='Project description' float
						/>
					</div>
					<div className='alert-dialog-footer'>
						<button
							onClick={() => this.showAddProjectDialog(false)}
							className='alert-dialog-button'>
							Cancel
						</button>
						<button
							onClick={()=>this.addNewProject()}
							className='alert-dialog-button'>
							Add Project
						</button>
					</div>
				</AlertDialog>
			</div>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		createNewProject: (name,projectObjc,override) => createNewProject(dispatch,name,projectObjc,override)
	}
}


function mapStateToProps(store) {
	return {
		userData: store.home.userData
	}
}

export default (connect(mapStateToProps,mapDispatchToProps)(AddProject))