import React from 'react';

import {
	Toolbar,
	BackButton, Icon
} from 'react-onsenui';
import {fetchProjects} from '../../pages/projectList/projectListActions'
import {openAndEditProjectDialog} from '../projectDialog/projectDialogActions'
import {connect} from 'react-redux'
import './navBar.scss'

class NavBar extends React.Component {

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
							onClick={(e) => {
							this.props.openAndEditProjectDialog('Edit project');
						}}>
							<Icon icon='edit' className={'icon-m'}/>
						</div>
					}
				</div>
			</Toolbar>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		openAndEditProjectDialog: (title) => openAndEditProjectDialog(dispatch, title)
	}
}

function mapStateToProps(store) {
	return {
		projects: store.projectList.projects,
		requests: store.adapter.requests,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);