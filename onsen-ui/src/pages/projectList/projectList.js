import React from 'react';
import {ListItem, List, Page, Toolbar, Navigator, Icon} from 'react-onsenui'
import {connect} from 'react-redux'
import {getRequestsList} from '../../common/utils'
import ADAPTER_SETTINGS from '../../adapterService/config'
import {fetchProjects} from './projectListActions';
import './projectList.scss'
import ProjectProperties from '../projectProperties/projectProperties'
import NavBar from '../../components/navBar/navBar'
import AddProject from '../../components/addProject/addProject'

class ProjectList extends React.Component {

	constructor(props) {
		super(props);
		this.name = 'projectList'
	}


	componentDidMount = () => {
		ADAPTER_SETTINGS.sasVersion === 'viya' && this.props.fetchProjects();
	}

	pushPage(navigator,project) {
		navigator.pushPage({component:ProjectProperties,props:{project}})
	}

	render() {
		const {projects, requests,navigator} = this.props;
		const requestsStatus = requests ? getRequestsList(requests) : null;
		return (
			<Page renderToolbar={()=> <NavBar title={'Projects'} navigator={navigator}/>}>
				<List>
					{requestsStatus && !requestsStatus.loading ?
						projects && projects.map((project, index) =>
							<ListItem
								tappable
								className={'project'}
								key={index}
								onClick={this.pushPage.bind(this,this.props.navigator, project)}>
								<Icon
									className={'icon-m'}
									icon='folder'/>
								{project.name}
							</ListItem>
						)
						:
						null
					}
				</List>
				<AddProject/>
			</Page>
		)
	}
}

function mapDispatchToProps(dispatch) {
	return {
		fetchProjects: () => fetchProjects(dispatch)
	}
}

function mapStateToProps(store) {
	return {
		projects: store.projectList.projects,
		requests: store.adapter.requests,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);