import React from 'react'
import {
	Page,
	Toast,
	Dialog,
	List,
	Button,
	AlertDialog,
	ListItem
} from 'react-onsenui';
import './alertDialogs.scss'
import * as ons from 'onsenui';

class AlertDialogs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dialogShown: false,
			alertDialogShown: false,
			toastShown: false,
			items: [
				{
					title: 'Dialog',
					fn: this.showDialog
				},
				{
					title: 'Alert dialog',
					fn: this.showAlertDialog
				},
				{
					title: 'Toast',
					fn: this.handleShow
				},
				{
					title: 'Alert notification',
					fn: () => ons.notification.alert('An error has occurred!')
				},
				{
					title: 'Confirmation',
					fn: () => ons.notification.confirm('Are you ready?')
				},
				{
					title: 'Prompt',
					fn: () => ons.notification.prompt('What\'s your name?')
				}
			]
		}
		this.name = 'alertDialogs' //this name is mandatory for navigator to work
	}

	renderRow = (row) => {
		return (
			<ListItem key={row.title} tappable onClick={row.fn}>
				{row.title}
			</ListItem>
		)
	}


	showDialog = () => {
		this.setState({dialogShown: true});
	}

	hideDialog = () => {
		this.setState({dialogShown: false});
	}

	showAlertDialog = () => {
		this.setState({alertDialogShown: true});
	}

	hideAlertDialog = () => {
		this.setState({alertDialogShown: false});
	}

	handleShow = () => {
		this.setState({toastShown: true});
	}

	handleDismiss = () => {
		this.setState({toastShown: false});
	}

	render() {
		return (
			<Page>
				<div className={'centered-text'}>
					<h2>Alert Dialogs</h2>
					<p>
						<a href='https://onsen.io/v2/api/react/AlertDialog.html'>alert-docs-onsen</a>
					</p>
					<p>
						<a href='https://onsen.io/v2/api/react/Toast.html'>toast-docs-onsen</a>
					</p>
					<p>
						<a href='https://onsen.io/v2/api/react/Dialog.html'>dialog-docs-onsen</a>
					</p>
				</div>
				<List dataSource={this.state.items} renderRow={this.renderRow}/>
				<Dialog
					isOpen={this.state.dialogShown}
					isCancelable={true}
					onCancel={this.hideDialog}>
					<div className={'centered-text div-margin'}>
						<p className={'dialog-opacity'}>This is a dialog!</p>
						<p>
							<Button onClick={this.hideDialog}>Close</Button>
						</p>
					</div>
				</Dialog>

				<AlertDialog
					isOpen={this.state.alertDialogShown}
					isCancelable={false}>
					<div className='alert-dialog-title'>Warning!</div>
					<div className='alert-dialog-content'>
						An error has occurred!
					</div>
					<div className='alert-dialog-footer'>
						<button onClick={this.hideAlertDialog} className='alert-dialog-button'>
							Cancel
						</button>
						<button onClick={this.hideAlertDialog} className='alert-dialog-button'>
							Ok
						</button>
					</div>
				</AlertDialog>

				<Toast isOpen={this.state.toastShown}>
					<div className="message">
						An error has occurred!
					</div>
					<button onClick={this.handleDismiss}>
						Dismiss
					</button>
				</Toast>
			</Page>
		)
	}
}

export default AlertDialogs;
