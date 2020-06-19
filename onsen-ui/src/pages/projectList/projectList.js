import React from 'react';
import {ListItem, List, Page, Toolbar, Navigator, Icon} from 'react-onsenui'
import {connect} from 'react-redux'
import {getRequestsList} from '../../common/utils'
import ADAPTER_SETTINGS from '../../adapterService/config'
import {fetchProjects} from './projectListActions';
import './projectList.scss'
import ProjectProperties from '../projectProperties/projectProperties'

class ProjectList extends React.Component {

	constructor(props) {
		super(props);
		this.name = 'projectList'
	}


	componentDidMount = () => {
		ADAPTER_SETTINGS.sasVersion === 'viya' && this.props.fetchProjects();
	}

	renderToolbar = () => {
		return (
			<Toolbar>
				<div className={'center'}>Projects</div>
			</Toolbar>
		);
	}

	pushPage(page, project) {
		let new_page;
		if (page.WrappedComponent) { //if component is wrapped (connect(...)(ComponentName))
			new_page = new page.WrappedComponent();
		} else {
			new_page = new page();
		}
		const page_name = new_page.name
		this.props.navigator.resetPage({component: page, props: {key: page_name, project}},{animation: 'slide'})
	}

	render() {

		const {projects, requests} = this.props;
		const requestsStatus = requests ? getRequestsList(requests) : null;

		return (
			<Page key={''} renderToolbar={this.renderToolbar.bind(this)}>
				<List>
					{requestsStatus && !requestsStatus.loading ?
						projects && projects.map((project, index) =>
							<ListItem
								tappable
								className={'project'}
								key={index}
								onClick={this.pushPage.bind(this, ProjectProperties, project)}>
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
			</Page>
		);
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