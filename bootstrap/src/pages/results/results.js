import React from 'react'
import adapterService from '../../adapterService/adapterService'
import {setGlobalData} from '../home/homeActions'
import {connect} from 'react-redux'
import {Col, Label, FormControl, FormGroup, FieldGroup} from 'react-bootstrap'
import DropdownList from 'react-widgets/lib/DropdownList'
import './results.scss'

class Results extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			error: '',
			file: null,
			formData: null,
			ap: '',
			country: ''

		}
		this.getFormData = this.getFormData.bind(this)
		this.submit = this.submit.bind(this)
		this.handleApChange = this.handleApChange.bind(this)
	}

	componentDidMount() {
		this.getFormData(this.props)
	}

	getFormData(props) {
		const {dds_ap_country} = props.globalData
		if (dds_ap_country) {
			const ap = {}
			dds_ap_country.forEach(item => {
				if (!ap[item.ap]) {
					ap[item.ap] = [item.country]
				} else {
					ap[item.ap].push(item.country)
				}
			})
			this.setState({formData: ap, ap: Object.keys(ap)[0], country: ap[Object.keys(ap)[0]][0]})
		}
	}

	componentWillReceiveProps(np) {
		if (this.props.globalData !== np.globalData) {
			this.getFormData(np)
		}
	}

	submit(e) {
		e.preventDefault()
		console.log('SUBMIT', {
			ap: this.state.ap,
			country: this.state.country,
			file: this.state.file
		})
	}

	handleApChange(data) {
		if (this.state.formData[data].indexOf(this.state.country) === -1) {
			this.setState({ap: data, country: this.state.formData[data][0]})
		} else {
			this.setState({ap: data})
		}
	}

	render() {
		//Prepare data for dropdowns
		const ap = this.state.formData && Object.keys(this.state.formData) || []
		const countries = this.state.formData && this.state.ap && this.state.formData[this.state.ap] || []
		return <div className={'results'}>
			<div className={'pageTitle'}><h1>Results Submission</h1></div>
			{this.state.formData ? <form className={'results'} onSubmit={e => this.submit(e)}>
				<FormGroup controlId="accountingPeriod">
					<Col sm={6} componentClass={FormControl.Label}>Accounting period</Col>
					<Col sm={6}>
						<DropdownList
							name={'ap'}
							data={ap}
							value={this.state.ap}
							onChange={data => this.handleApChange(data)}
						/>
					</Col>
				</FormGroup>
				<FormGroup controlId="memberState">
					<Col sm={4} componentClass={FormControl.Label}>Member State</Col>
					<Col sm={8}>
						<DropdownList
							filter
							name={'country'}
							data={countries}
							value={this.state.country}
							onChange={data => this.setState({country: data})}
						/>
					</Col>
				</FormGroup>
				<FormGroup validationState={this.state.file ? null : 'error'}>
					<Col sm={4}>
						<FormControl.Label>Upload File</FormControl.Label>
						<FormControl
							id={'file'}
							name={'file'}
							type={'file'}
							accept=".xml"
							onChange={e => {
								e.preventDefault()
								this.setState({file: e.target.files[0]})}
							}
						/></Col>
				</FormGroup>
				<button
					type={'submit'}
					className={'btn btn-primary'}
					disabled={!this.state.ap || !this.state.country || !this.state.file}
				>Submit</button>
			</form> : <div className={'spinner'}><i className={'fa fa-atom fa-spin'}/></div>}
		</div>
	}
}

function mapStateToProps(store) {
	return {
		mainSpinner: store.header.mainSpinner,
		userData: store.home.userData,
		globalData: store.home.globalData
	}
}

function mapDispatchToProps(dispatch) {
	return {
		managedRequest: (method, url, data, options) => adapterService.managedRequest(dispatch, method, url, data, options),
		setGlobalData: data => setGlobalData(dispatch, data)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(Results)
