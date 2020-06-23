import React from 'react';

import {
	Toolbar,
	BackButton, Icon
} from 'react-onsenui';
import {openAndEditProjectDialog} from '../projectDialog/projectDialogActions'
import {openDeleteConformationDialog} from '../conformationDialog/conformationDialogActions'
import {connect} from 'react-redux'
import './navBar.scss'

class NavBar extends React.Component {

	handleDelete = (uri, navigator) => {
		this.props.openDeleteConformationDialog("Process is irreversible, are you sure you want to delete project?", uri, navigator);
	}

	render() {

		const {title, navigator, backButton, hasIcon} = this.props;
		return (
			<Toolbar>
				<div className='left'>
					{backButton ? <BackButton onClick={() => navigator.popPage()}>Back</BackButton> : null}
				</div>
				<div className='center'>
					{title}
				</div>
				<div className='right'>
					{
						hasIcon &&
						<div
							className={'edit-icon'}
							onClick={() => {
								this.props.openAndEditProjectDialog('Edit project');
							}}>
							<Icon icon='edit' className={'icon-m'}/>
						</div>
					}
					{
						hasIcon &&
						<div
							div onClick={() => {
							this.handleDelete(this.props.projectMetadata.uri, navigator);
						}}>
							<Icon icon='trash'/>
						</div>
					}
				</div>
			</Toolbar>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		openAndEditProjectDialog: (title) => openAndEditProjectDialog(dispatch, title),
		openDeleteConformationDialog: (message, uri, navigator) => openDeleteConformationDialog(dispatch, message, uri, navigator)
	}
}

function mapStateToProps(store) {
	return {
		projects: store.projectList.projects,
		requests: store.adapter.requests,
		projectMetadata: store.project.projectMetadata,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);