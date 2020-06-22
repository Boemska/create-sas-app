import React from 'react';
import {connect} from 'react-redux';
import {platform} from 'onsenui';
import {createNewProject} from '../addProject/addProjectActions'
import ActionTypes from './ActionTypes'
import {
	Fab,
	Icon,
	Button,
	Input,
	AlertDialog
} from 'react-onsenui';
import {updateProject} from '../../pages/projectProperties/projectPropertiesActions'
import {closeProjectDialog} from './projectDialogActions'

class ProjectDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: "",
			description: "",
		}
	}

	onChange = (event) => {
		this.setState({[event.target.name]: event.target.value})
	}

	addNewProject = () => {
		//dispatch({type: ActionTypes.CLEAR})
		const {name, description} = this.state;
		if (!this.props.projectDialog.edit) {
			const forSubmit = {
				name: name,
				createdOn: new Date(),
				createdBy: this.props.userData.id,
				description: description
			}
			const res = this.props.createNewProject(name, forSubmit, false);
			res.then((res) => {
				console.log('response', res)
				this.props.closeDialog();
			})
		} else {
			const newProject = {
				...this.props.projectContent,
				name: name,
				description: description
			}
			console.log(newProject);
			this.props.updateProject(newProject);
		}
	}


	render() {
		const {errorMessage, error} = this.props.newProject;
		console.log(this.props);
		return (
			<AlertDialog isOpen={this.props.projectDialog.isOpen} isCancelable={true}
									 onCancel={() => this.props.closeDialog()}>
				<div className='alert-dialog-title'>{this.props.projectDialog.title}</div>
				<div className='alert-dialog-content'>
					<Input
						className={'name-input'}
						name="name"
						value={this.state.name}
						onChange={this.onChange}
						modifier='underbar'
						placeholder='Project name' float
					/>
					{error &&
					<div>
						<small className={'warning'}>{errorMessage}</small>
					</div>
					}
					<Input
						className={'desc-input'}
						name="description"
						value={this.state.description}
						onChange={this.onChange}
						modifier='underbar'
						placeholder='Project description' float
					/>
				</div>
				<div className='alert-dialog-footer'>
					<Button
						onClick={() => this.props.closeDialog()}
						className='alert-dialog-button'>
						Cancel
					</Button>
					<Button
						onClick={() => this.addNewProject()}
						className='alert-dialog-button'>
						Add Project
					</Button>
				</div>
			</AlertDialog>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		createNewProject: (name, projectObjc, override) => createNewProject(dispatch, name, projectObjc, override),
		closeDialog: () => closeProjectDialog(dispatch),
		updateProject:(newProject)=>updateProject(dispatch,newProject)
	}
}


function mapStateToProps(store) {
	return {
		userData: store.home.userData,
		newProject: store.newProject,
		projectDialog: store.projectDialog,
		projectContent: store.project.projectContent
	}
}

export default (connect(mapStateToProps, mapDispatchToProps)(ProjectDialog))