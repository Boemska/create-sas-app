import React from 'react'
import {
	managedRequest,
	call,
	getFolderContents,
	createNewFolder,
	getFolderDetails,
	createNewFile,
	deleteItem, getFileDetails, getFileContent, updateFile,
} from './homeActions'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import config from '../../adapterService/config'
import Utils from 'h54s/src/methods/utils'
import './home.scss'
import {
	basicCallsExample,
	createNewFileExample,
	createNewFolderExample, editFileExample,
	getFolderDetailsExample,
	getMembersExample, readme
} from './examples'
import toastr from 'toastr'


class Home extends React.Component {
	state = {
		res: '',
		folderDetails: null,
		getFolderContents: null,
		creatingNewFolder: false,
		newFolder: '',
		newFileName: '',
		creatingNewFile: false,
		filesDetails: {},
		filesContent: {},
		editFile: null,
		editFileError: '',
		updatingFile: false,
		getFolderDetailsError: ''
	}

	fileContent = {"firstName": "George", "lastName": "Clooney"}

	componentDidMount() {
		config.sasVersion === 'viya' && this.getFileToEdit();
	}

	managedRequest = async () => {
		this.setState({res: ''})
		const sasProgram = 'common/startupService'
		const options = {
			sasProgram,
			dataObj: null,
			params: null
		}
		const res = await this.props.managedRequest(options)
		this.setState({res})
	}

	call = async () => {
		this.setState({res: ''})
		const sasProgram = 'common/startupService'
		const res = await this.props.call(sasProgram)
		this.setState({res})
	}

	getFolderDetails = () => {
		this.setState({getFolderDetailsError: ''})
		this.props.getFolderDetails(config.metadataRoot, null)
			.then(res => {
				res.body.etag = res.headers['etag'] || res.headers.get('Etag');
				this.setState({folderDetails: res.body})
			}).catch(e => {
			try {
				const message = JSON.parse(e.message)
				this.setState({getFolderDetailsError: message.message})
			} catch (er) {
				console.log(er)
			}
		})

	}

	getRootFolderContent = () => {
		this.props.getFolderContents(config.metadataRoot, null)
			.then(res => {
				this.setState({getFolderContents: res.body})
			})
	}

	createNewFolder = () => {
		this.setState({creatingNewFolder: true})
		const parentUri = Utils.getSelfUri(this.state.folderDetails.links)
		this.props.createNewFolder(parentUri, this.state.newFolder)
			.then(() => {
				toastr.info('Folder created successfully')
			})
			.catch(e => {
				toastr.error(e.message.message)
			})
			.finally(() => {
				this.setState({creatingNewFolder: false})
				this.getRootFolderContent();
			})
	}

	createNewFile = () => {
		// Append extension to your file
		let fullFileName = this.state.newFileName + ".txt"
		const fileData = this.fileContent
		let file = JSON.stringify(fileData);
		let blob = new Blob([file], {type: "octet/stream"});
		const parentUri = Utils.getSelfUri(this.state.folderDetails.links)
		this.props.createNewFile(fullFileName, blob, parentUri)
			.then(() => {
				this.getRootFolderContent()
			})
	}

	deleteItem = (uri) => {
		this.props.deleteItem(uri)
			.then(() => {
				this.getRootFolderContent()
			})
	}

	getFileDetails = (uri, name) => {
		this.props.getFileDetails(uri)
			.then(res => {
				res.body.etag = res.headers['etag'] || res.headers.get('Etag');
				const filesDetails = this.state.filesDetails
				filesDetails[name] = res.body
				this.setState({filesDetails})
			})
	}

	getFileContent = (uri, name) => {
		this.props.getFileContent(uri)
			.then(res => {
				const filesContent = this.state.filesContent
				filesContent[name] = res.body
				this.setState({filesContent})
			})
	}

	getFileToEdit = () => {
		this.props.getFolderContents(config.metadataRoot, null)
			.then(res => {
				const file = res.body.items.filter(i => i.name !== 'common' && i.contentType === 'file')
				if (file[0]) {
					this.props.getFileContent(file[0].uri)
						.then(response => {
							// res.body.etag = res.headers['etag'] || res.headers.get('Etag');
							file[0].lastModified = response.headers['last-modified']
							const editFile = {
								...file[0],
								content: JSON.stringify(response.body)
							}
							this.setState({editFile})
						})
				}
			})
	}

	updateFile = () => {
		const file = this.state.editFile
		console.log('file', file)
		this.props.updateFile(file.uri, file.content, file.lastModified)
			.then(() => {
				this.getFileToEdit()
			})

	}


	render() {
		return <div className={'home'}>
			{basicCallsExample(this)}
			{readme()}
			{config.sasVersion === 'viya' && <div>
				{getFolderDetailsExample(this)}
				{getMembersExample(this)}
				{createNewFolderExample(this)}
				{createNewFileExample(this)}
				{editFileExample(this)}
			</div>
			}
		</div>
	}
}


function mapStateToProps(store) {
	return {}
}

function mapDispatchToProps(dispatch) {
	return {
		managedRequest: options => managedRequest(dispatch, options),
		call: program => call(dispatch, program),
		getFolderDetails: (folderName, options) => getFolderDetails(dispatch, folderName, options),
		getFolderContents: (folderName, options) => getFolderContents(dispatch, folderName, options),
		createNewFolder: (parentUri, folderName, options) => createNewFolder(dispatch, parentUri, folderName, options),
		createNewFile: (fileName, file, parentUri, options) => createNewFile(dispatch, fileName, file, parentUri, options),
		deleteItem: uri => deleteItem(dispatch, uri),
		getFileDetails: uri => getFileDetails(dispatch, uri),
		getFileContent: uri => getFileContent(dispatch, uri),
		updateFile: (itemUri, fileBlob, lastModified) => updateFile(dispatch, itemUri, fileBlob, lastModified)
	}
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home))
