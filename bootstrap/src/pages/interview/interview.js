import React from 'react'
import adapterService from '../../adapterService/adapterService'
import {setGlobalData} from '../home/homeActions'
import {connect} from 'react-redux'
import {Col, FormControl, FormGroup} from 'react-bootstrap'
import './interview.scss'
import {DropdownList} from 'react-widgets'
import MenuItem from '../../components/menuItem/menuItem'
import {initialForm} from './initialForm'
import LogoImg from '../../assets/images/eu-transparent.png'


class Interview extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			initialFormSubmitted: false,
			error: '',
			farmerName: '',
			locationCode: '',
			farmerId: '',
			locationCodeArr: null,
			activeForm: {
				group: {},
				category: {},
				table: {}
			},
			submitForm: {}
		}
		this.getCategories = this.getCategories.bind(this)
		this.getGroups = this.getGroups.bind(this)
		this.listTables = this.listTables.bind(this)
		this.submitInitialForm = this.submitInitialForm.bind(this)
		this.handleFormInput = this.handleFormInput.bind(this)
		this.goToNextForm = this.goToNextForm.bind(this)
		this.submitForm = this.submitForm.bind(this)
	}

	componentDidMount() {
		this.getLocationCode(this.props)
		if (this.props.questionData && this.props.questionData.navbar) {
			this.setInitialActiveForm(this.props)
		}
	}

	componentWillReceiveProps(np) {
		if (this.props.globalData !== np.globalData) {
			this.getLocationCode(np)
		}
		if (this.props.questionData !== np.questionData && np.questionData.navbar) {
			this.setInitialActiveForm(np)
		}
	}

	setInitialActiveForm(props) {
		const table = props.questionData.navbar[0]
		const group = props.questionData.collection[table.groups[0].id_group]
		this.setState({
			activeForm: {
				table,
				group,
			}
		})
	}

	getLocationCode(data) {
		if (data.globalData.dd_locationCode) {
			const locationCodeArr = data.globalData.dd_locationCode.map((item) => {
				return item.value
			})
			this.setState({
				locationCodeArr
			})
		}
	}

	setActiveForm(activeForm) {
		this.setState({activeForm})
	}

	// Not used atm, used before for third level menu
	getCategories(group, lang, table) {
		const extendedGroup = this.props.questionData.collection[group.id_group]
		const categories = Object.values(extendedGroup.categories)
		if (categories.length > 0) {
			return <div className={'flex-column'}>{categories.map((c, i) => {
				const classString = `categoryName ${this.state.activeForm.category.id_category +
				this.state.activeForm.group.id_group === c.id_category + group.id_group && 'active'}`
				return <div key={group.id_group + c.id_category + i} className={'category'}>
					<div
						className={classString}
						onClick={() => this.setState({
							activeForm: {
								group: extendedGroup,
								category: c,
								table
							}
						})}>{c.name.lang[lang]}</div>
				</div>
			})}</div>
		} else {
			return null
		}
	}

	getGroups(table, lang) {
		return <div className={'groups flex-column'}>{table.groups.map(g => {
			const extendedGroup = this.props.questionData.collection[g.id_group]
			const classString = `groupName ${this.state.activeForm.group.id_group === g.id_group && 'active'}`
			return <div key={table.id_table + g.id_group}
									className={classString}
									onClick={() => this.setState({
										activeForm: {
											group: extendedGroup,
											table
										}
									})}>{g.name.lang[lang]}</div>
		})}</div>
	}

	handleFormInput(e) {
		const value = e.target.value
		const name = e.target.name
		this.setState({submitForm: Object.assign({}, this.state.submitForm, {[name]: value})}) //asdf
	}

	getCurrentForm() {
		let activeForm = this.state.activeForm
		const extendedGroup = activeForm.group
		const categories = Object.values(extendedGroup.categories)
		const columns = []
		categories.forEach(cat => {
			cat.columns.forEach(col => {
				const newCol = {...col, id_category: cat.id_category, category_name: cat.name.lang[this.props.lang]}
				columns.push(newCol)
			})
		})
		return <div className={'selectedForm'}>
			<div className={'pageTitle'}><h1>{activeForm.table.name.lang[this.props.lang]}</h1></div>
			<div className={'tableHelp'}><h2>{activeForm.table.help.lang[this.props.lang]}</h2></div>
			<div className={'groupTitle'}><h3>{extendedGroup.name.lang[this.props.lang]}</h3></div>
			<div className={'form'}>
				{columns.map(column => {
					const id = activeForm.table.id_table + '/' + activeForm.group.id_group + '/' + column.id_category +
						'/' + column.id_column
					return <FormGroup
						key={id}
						controlId={id}
					>
						<Col sm={6}
								 componentClass={FormControl.Label}>
							{column.category_name} {column.name.lang[this.props.lang]} {column.name.unit && `(${column.name.unit})`}
						</Col>
						<Col sm={6}>
							<FormControl
								type="text"
								name={id}
								value={this.state.submitForm[id] || ''}
								onChange={this.handleFormInput}
								// value={this.state.farmerName}
								// onChange={e => this.setState({farmerName: e.target.value})}
							/>
						</Col>
					</FormGroup>
				})}
			</div>
			<div className={'btn btn-primary pull-left next mb15'} onClick={this.goToNextForm}>Next</div>
			<div className={'btn btn-primary pull-right next mb15'} onClick={this.submitForm}>Submit</div>
		</div>
	}

	listTables(navbar, lang) {
		return (
			<div className={'questionContainer'}>
				<div className={'sidebar'}>
					{navbar && <div className={'qMenu'}>
						{navbar.map(table => {
							return <div key={table.id_table} title={table.help.lang[this.props.lang]}><MenuItem
								expandable
								title={table.name.lang[lang]}
								id={table.id_table}
								isOpen={true}
								sideBarOpen={() => {
								}}
								setActive={() => {
								}}
								active={this.state.activeForm.table.id_table}
								content={this.getGroups(table, lang)}
							/></div>
						})}
					</div>}
				</div>
				<div className={'forms'}>
					{!this.state.initialFormSubmitted && this.state.locationCodeArr && initialForm.call(this)}
					{this.state.initialFormSubmitted && this.getCurrentForm()}
				</div>
			</div>
		)
	}

	goToNextForm() {
		// {table: {id_table: '', groups: [{}...]}, group: {id_group: ''}
		const activeForm = Object.assign({}, this.state.activeForm)
		let activeTable = activeForm.table
		let actualGroupIndex = 0
		for (let i = 0; i < activeForm.table.groups.length; i++) {
			if (activeForm.table.groups[i].id_group === activeForm.group.id_group) {
				actualGroupIndex = i
				break;
			}
		}

		const tables = this.props.questionData.navbar
		const collection = this.props.questionData.collection
		if (actualGroupIndex < activeForm.table.groups.length - 1) {
			let nextIndex = actualGroupIndex + 1
			const _nextGroup = activeTable.groups[nextIndex]
			const nextGroup = collection[_nextGroup.id_group]
			this.setState({
				activeForm: {
					table: activeTable,
					group: nextGroup
				}
			})
		} else if (actualGroupIndex === activeForm.table.groups.length - 1) {
			let activeTableIndex = 0
			for (let i = 0; i < tables.length; i++) {
				if (tables[i].id_table === activeTable.id_table) {
					activeTableIndex = i
					break;
				}
			}
			if (activeTableIndex < tables.length - 1) {
				activeTable = this.props.questionData.navbar[activeTableIndex + 1]
				let firstGroup = this.props.questionData.collection[activeTable.groups[0].id_group]
				this.setState({
					activeForm: {
						table: activeTable,
						group: firstGroup
					}
				})
			} else {
				console.log('end of menu')
			}
		}
	}

	submitForm() {
		const submitData = []
		// KEY in submitForm that uniquely identifies input has structure id_table/id_group/id_category/id_column
		const submitForm = this.state.submitForm
		Object.keys(this.state.submitForm).forEach(key => {
			const ids = key.split('/')
			submitData.push({
				table: ids[0],
				group: ids[1],
				category: ids[2],
				column: ids[3],
				answer: submitForm[key]
			})
		})
		console.log('SUBMIT DATA', submitData)
	}

	render() {
		const navbar = this.props.questionData && this.props.questionData.navbar
		const lang = this.props.lang
		return <div className={'interview'}>
			{navbar ? this.listTables(navbar, lang)
				: <div className={'spinner'}><img src={LogoImg} alt={'logo'}/></div>}
		</div>
	}

	submitInitialForm() {
		//TODO submit this data;
		this.setState({initialFormSubmitted: true})
	}
}

function mapStateToProps(state) {
	return {
		globalData: state.home.globalData,
		userData: state.home.userData,
		questionData: state.home.questionData,
		lang: state.home.language
	}
}

function mapDispatchToProps(dispatch) {
	return {
		// managedRequest: (method, url, data, options) => adapterService.managedRequest(dispatch, method, url, data, options),
		setGlobalData: data => setGlobalData(dispatch, data)
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(Interview)
