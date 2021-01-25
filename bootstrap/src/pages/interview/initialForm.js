import {Button, Col, FormControl, FormGroup} from 'react-bootstrap'
import {DropdownList} from 'react-widgets'
import React from 'react'

export function initialForm() {
	return <div className={'pageTitle'}><h1>Direct Collection</h1>
		<form>
			<FormGroup controlId="accountingPeriod">
				<Col sm={6} componentClass={FormControl.Label}>Farmer name</Col>
				<Col sm={6}>
					<FormControl
						type="text"
						value={this.state.farmerName}
						placeholder="Enter text"
						onChange={e => this.setState({farmerName: e.target.value})}
					/>
				</Col>
			</FormGroup>
			<FormGroup controlId="memberState">
				<Col sm={4} componentClass={FormControl.Label}>Location code</Col>
				<Col sm={8}>
					<DropdownList
						filter
						data={this.state.locationCodeArr}
						value={this.state.locationCode}
						onChange={locationCode => this.setState({locationCode})}
					/>
				</Col>
			</FormGroup>
			<FormGroup controlId="accountingPeriod">
				<Col sm={6} componentClass={FormControl.Label}>Farm ID</Col>
				<Col sm={6}>
					<FormControl
						type="text"
						value={this.state.farmerId}
						placeholder="Enter text"
						onChange={e => this.setState({farmerId: e.target.value})}
					/>
				</Col>
			</FormGroup>
			<Col sm={12}>
				<Button
					className={'pull-left'}
					bsStyle="primary"
					// *** Commented out for testing purposes ***
					// disabled={!this.state.locationCode.length > 0 ||
					// !this.state.farmerName.length > 0 ||
					// !this.state.farmerId.length > 0}
					onClick={this.submitInitialForm}
				>
					BEGIN</Button>
			</Col>
		</form>
	</div>
}
