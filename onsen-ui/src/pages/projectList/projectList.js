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
import {openAndEditProjectDialog} from '../../components/projectDialog/projectDialogActions'
import {selectProject, fetchSingleProject} from '../projectProperties/projectPropertiesActions'

class ProjectList extends React.Component {

	constructor(props) {
		super(props);
		this.name = 'projectList'
	}


	componentDidMount = () => {
		ADAPTER_SETTINGS.sasVersion === 'viya' && this.props.fetchProjects();
	}

	pushPage(navigator, project) {
		const uri=project.uri;
		const {projects,projectMetadata} = this.props;
		if (this.props.dirty) {

		} else {
			if (uri !== null && uri !== "noProject" && (!projectMetadata || (projectMetadata && projectMetadata.uri.split('/').pop() !== uri))) {
				//const project = projects.find(p => (p.uri === '/files/files/' + uri))
				if (project) {
					this.props.selectProject(project);
					this.props.fetchSingleProject(project.uri, this.props.dirty);
				}
			}
			navigator.pushPage({component: ProjectProperties, props: {project}})
		}
	}

	render() {
		const {projects, requests, navigator} = this.props;
		const requestsStatus = requests ? getRequestsList(requests) : null;
		return (
			<Page renderToolbar={() => <NavBar title={'Projects'} navigator={navigator}/>}>
				<List>
					{requestsStatus && !requestsStatus.loading ?
						projects && projects.map((project, index) =>
							<ListItem
								tappable
								className={'project'}
								key={index}
								onClick={this.pushPage.bind(this, this.props.navigator, project)}>
								<div className='left'>
									<div>
										<Icon
											className={''}
											icon='folder'/>
									</div>
								</div>
								<div className='center'>
									<div className='list__item__title'>
										{project.name}
									</div>
								</div>
								<div className={'right'}>
									<div
										div onClick={(e) => {
										e.stopPropagation();
									}}>
										<Icon icon='trash'/>
									</div>
								</div>
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
		fetchProjects: () => fetchProjects(dispatch),
		openAndEditProjectDialog: (title) => openAndEditProjectDialog(dispatch, title),
		selectProject:(project)=>selectProject(dispatch,project),
		fetchSingleProject:(uri,dirty)=>fetchSingleProject(dispatch,uri,dirty)
	}
}

function mapStateToProps(store) {
	return {
		projects: store.projectList.projects,
		requests: store.adapter.requests,
		dirty: store.project.save,
		projectMetadata: store.project.projectMetadata
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);