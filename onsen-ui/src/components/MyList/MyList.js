import React from 'react'
import {
	Page,
	ListItem,
	ListTitle,
	List,
	Button,
	Dialog
} from 'react-onsenui';
import './myList.scss'
import CustomToolbar from "../customToolbar/customToolbar";

class MyList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			alertShown: false
		}
		this.name = 'myList' //this name is mandatory for navigator to work
	}

	showAlert = () => {
		this.setState({alertShown: true});
	}

	hideAlert = () => {
		this.setState({alertShown: false});
	}

	render() {
		return (
			<Page renderToolbar={()=><CustomToolbar title={'My List'}/>}>
				<ListTitle>
					docs: <a href='https://onsen.io/v2/api/react/LazyList.html'>list-docs-onsen</a>
				</ListTitle>
				<List>
					<ListItem onClick={this.showAlert}>Element One</ListItem>
					<ListItem onClick={this.showAlert}>Element Two</ListItem>
					<ListItem onClick={this.showAlert}>Element Three</ListItem>
				</List>

				<Dialog
					isOpen={this.state.alertShown}
					isCancelable={true}
					onCancel={this.hideAlert}>
					<div className={'centered-text div-margin'}>
						<p className={'alert-opacity'}>This is a alert!</p>
						<p>
							<Button onClick={this.hideAlert}>Close</Button>
						</p>
					</div>
				</Dialog>
			</Page>
		)
	}
}


export default MyList;
