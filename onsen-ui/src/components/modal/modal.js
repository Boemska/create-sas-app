import React from 'react'
import {Page, section, Modal, Button, ListTitle} from 'react-onsenui';
import './modal.scss';
import CustomToolbar from "../customToolbar/customToolbar";

class ModalTest extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: false
		}
		this.name = 'modalTest' //this name is mandatory for navigator to work
	}

	render() {
		return (
			<Page
				renderToolbar={()=><CustomToolbar title={'Modal'}/>}
				renderModal={() => (
				<Modal
					isOpen={this.state.isOpen}
				>
					<section className={'section-margin'}>
						<p className={'paragraph-opacity'}>
							This is a Modal Example.
						</p>
						<p>
							<Button onClick={() => this.setState({isOpen: false})}>
								Close
							</Button>
						</p>
					</section>
				</Modal>
			)}
			>
				<ListTitle>
					docs: <a href="https://onsen.io/v2/api/react/Modal.html">modal-docs-onsen</a>
				</ListTitle>
				<section className={'section-margin'}>
					<p className={'centered-text'}>
						<Button ref='button' onClick={() => this.setState({isOpen: true})}>Tap here!</Button>
					</p>
				</section>
			</Page>
		)
	}
}

export default ModalTest;
