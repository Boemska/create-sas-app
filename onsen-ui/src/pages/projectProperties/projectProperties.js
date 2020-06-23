import React from 'react';
import {Page} from 'react-onsenui'
import './projectProperties.scss'
import NavBar from '../../components/navBar/navBar'
import {connect} from 'react-redux'

class ProjectProperties extends React.Component {

	constructor(props) {
		super(props);
		this.name = 'projectProperties'
	}

	popPage = (page, navigator) => {
		navigator.popPage();
	}


	render() {
		const {project, navigator} = this.props;
		return (
			<Page key={'projectProperties'} renderToolbar={() => <NavBar
				title={this.props.projectContent.name}
				navigator={navigator}
				backButton={true}
				hasIcon={true}/>}
			>
				<div>
					<p className={'project-property-name'}>Folder Location</p>
					<p className={'project-property'}>{project.parentFolderUri}</p>
				</div>
				<div>
					<p className={'project-property-name'}>Created by</p>
					<p className={'project-property'}>{project.createdBy}</p>
				</div>
				<div>
					<p className={'project-property-name'}>Project file URI</p>
					<p className={'project-property'}>{project.uri}</p>
				</div>
			</Page>
		);
	}
}

function mapStateToProps(store) {
	return {
		projectContent: store.project.projectContent
	}
}

export default connect(mapStateToProps, null)(ProjectProperties);