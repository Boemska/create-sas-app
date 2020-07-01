import React from 'react';
import {withRouter} from 'react-router'
import {Page,Card} from 'react-onsenui'
import './projectProperties.scss'
import NavBar from '../../components/navBar/navBar'
import {connect} from 'react-redux'
import {fetchProjects} from '../projectList/projectListActions'
import {fetchSingleProject, selectProject} from '../projectProperties/projectPropertiesActions'
import QRcode from 'qrcode.react';
import ConformationDialog from '../../components/conformationDialog/conformationDialog'
import ProjectDialog from '../../components/projectDialog/projectDialog'

class ProjectProperties extends React.Component {

	constructor(props) {
		super(props);
		this.name = 'projectProperties'
	}

	popPage = (page, navigator) => {
		navigator.popPage();
	}

	componentWillUnmount() {
		this.props.history.goBack();
	}


	getDataForProject = () => {
		let uri = this.props.history.location.pathname.split('/')[2];
		if (uri !== null && uri !== "noProject" && (!this.props.projectMetadata || (this.props.projectMetadata && this.props.projectMetadata.uri.split('/').pop() !== uri))) {
			const project = this.props.projects.find(p => (p.uri === '/files/files/' + uri))
			if (project) {
				this.props.selectProject(project);
				this.props.fetchSingleProject(project.uri, this.props.dirty);
			}
		}
	}


	render() {
		this.getDataForProject();
		const shareURL = window.location.href;
		const {projectMetadata, navigator, projectContent} = this.props;
		return (
			<Page key={'projectProperties'} renderToolbar={() => projectContent && <NavBar
				title={this.props.projectContent.name}
				navigator={navigator}
				backButton={true}
				hasIcon={true}/>}
			>
				{projectMetadata && projectContent ?
					<div>
						<Card>
						<div className={'property-qr'}>
							<QRcode className={'qr'} value={shareURL} size={220}/>
						</div>
							<div className="title">Scan QR code and share project!</div>
							<div className="content">
							<div>
								<p className={'project-property-name'}>Folder Location</p>
								<p className={'project-property'}>{projectMetadata.parentFolderUri}</p>
							</div>
							<div>
								<p className={'project-property-name'}>Created by</p>
								<p className={'project-property'}>{projectMetadata.createdBy}</p>
							</div>
							<div>
								<p className={'project-property-name'}>Project file URI</p>
								<p className={'project-property'}>{projectMetadata.uri}</p>
							</div>
						</div>
						</Card>
					</div>
					:
					<div className={'no-project'}>
						<h3>
							There is no project!
						</h3>
					</div>
				}
				<ConformationDialog/>
				<ProjectDialog/>
			</Page>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return {
		fetchProjects: () => fetchProjects(dispatch),
		selectProject: (project) => selectProject(dispatch, project),
		fetchSingleProject: (uri, dirty) => fetchSingleProject(dispatch, uri, dirty),
	}
}

function mapStateToProps(store) {
	return {
		projectContent: store.project.projectContent,
		projects: store.projectList.projects,
		projectMetadata: store.project.projectMetadata,
	}
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectProperties));