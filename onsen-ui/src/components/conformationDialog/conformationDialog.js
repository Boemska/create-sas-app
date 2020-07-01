import React from 'react';
import {connect} from 'react-redux';
import {
	Button,
	AlertDialog
} from 'react-onsenui';
import {closeConformationDialog} from './conformationDialogActions'
import {fetchProjects} from '../../pages/projectList/projectListActions'
import ProjectList from '../../pages/projectList/projectList'
import {platform} from 'onsenui';
import './conformationDialog.scss'


class ConformationDialog extends React.Component {

	constructor(props) {
		super(props);
	}

	submitConformation = () => {
		this.props.conformationDialog.action();
		if (this.props.conformationDialog.push) {
			this.props.conformationDialog.push();
		}
		if (this.props.conformationDialog.additional) {
			this.props.fetchProjects();
			//pop page or reset page
			if(this.props.conformationDialog.additional.pages.length>1) {
				this.props.conformationDialog.additional.popPage();
			}else {
				this.props.conformationDialog.additional.resetPage({component: ProjectList, props: {key: 'projectList'}}, {animation: 'fade'});
			}
		}
		this.props.closeDialog();
	}

	submitCancel = () => {
		if (this.props.conformationDialog.push) {
			this.props.conformationDialog.push();
		}
		this.props.closeDialog();
	}


	render() {
		const {message, isOpen} = this.props.conformationDialog;
		return (
			<AlertDialog isOpen={isOpen} isCancelable={false}>
				<div className={platform.isAndroid()?'androidAlert':''}>
				<div className='alert-dialog-title'>{message}</div>
				<div className='alert-dialog-content'>
				</div>
				<div className='alert-dialog-footer'>
					<Button
						onClick={() => this.submitCancel()}
						className='alert-dialog-button'>
						Cancel
					</Button>
					<Button
						onClick={() => this.submitConformation()}
						className='alert-dialog-button'>
						{this.props.conformationDialog.actionName}
					</Button>
				</div>
				</div>
			</AlertDialog>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		closeDialog: () => closeConformationDialog(dispatch),
		fetchProjects: () => fetchProjects(dispatch)
	}
}


function mapStateToProps(store) {
	return {
		conformationDialog: store.conformationDialog
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ConformationDialog);