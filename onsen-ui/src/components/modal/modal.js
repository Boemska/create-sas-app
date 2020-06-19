import React from 'react'
import {Page, section, Modal, Button} from 'react-onsenui';
import './modal.scss';

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
			<Page renderModal={() => (
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
				<div className={'centered-text'}>
					<h1>Modal Example</h1>
					<a href="https://onsen.io/v2/api/react/Modal.html">
						modal-docs-onsen
					</a>
				</div>
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
