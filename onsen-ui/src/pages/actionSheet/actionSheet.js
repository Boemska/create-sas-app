import React from 'react'
import {Page, ActionSheetButton, ActionSheet, Button} from 'react-onsenui';
import './myActionSheet.scss'

class MyActionSheet extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false
		}
		this.name = 'actionSheet' //this name is mandatory for navigator to work
	}

	handleClick = () => {
		this.setState({isOpen: true});
	}

	handleCancel = () => {
		this.setState({isOpen: false});
	}

	render() {
		return (
			<Page>
				<div className='title'>
					<h2>Action Sheet</h2>
					docs :
					<a href='https://onsen.io/v2/api/react/ActionSheet.html'>list-docs-onsen</a>
					<p>
						<Button onClick={this.handleClick.bind(this)}>Show dialog</Button>
					</p>
				</div>
				<ActionSheet isOpen={this.state.isOpen} animation='default'
										 onCancel={this.handleCancel.bind(this)}
										 isCancelable={true}
										 title={'This is description'}
				>
					<ActionSheetButton onClick={this.handleCancel.bind(this)}>Label1</ActionSheetButton>
					<ActionSheetButton onClick={this.handleCancel.bind(this)}>Label2</ActionSheetButton>
					<ActionSheetButton onClick={this.handleCancel.bind(this)} modifier={'destructive'}>Label3</ActionSheetButton>
					<ActionSheetButton onClick={this.handleCancel.bind(this)} icon={'md-close'}>Cancel</ActionSheetButton>
				</ActionSheet>
			</Page>
		)
	}
}


export default MyActionSheet;
