import React from 'react';
import {connect} from 'react-redux';
import {platform} from 'onsenui';
import './addProject.scss'
import ProjectDialog from '../projectDialog/projectDialog'
import {
	Fab,
	Icon,
	Button,
	Input,
	AlertDialog
} from 'react-onsenui';
import {openProjectDialog} from '../projectDialog/projectDialogActions'

class AddProject extends React.Component {

	constructor(props) {
		super(props);
	}


	button = () => {
		let button;

		if (platform.isAndroid()) {
			button = (
				<Fab
					onClick={()=>this.props.openProjectDialog()}
					ripple
					position='bottom right'>
					<Icon icon='md-plus'/>
				</Fab>
			);
		} else {
			button = (
				<Button onClick={()=>this.props.openProjectDialog()} modifier='large quiet'>+ Add Project</Button>
			);
		}
		return button;
	}

	render() {
		return (
			<div>
				{this.button()}
				<ProjectDialog/>
			</div>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		openProjectDialog:()=>openProjectDialog(dispatch)
	}
}

export default (connect(null,mapDispatchToProps)(AddProject))