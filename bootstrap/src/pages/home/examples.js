import React from 'react'
import {Button, Col, FormControl, FormGroup, Row} from 'react-bootstrap'
import config from '../../adapterService/config'
import Utils from 'h54s/src/methods/utils'

export const basicCallsExample = props => {
	return <div>
		<h2 className={'text-center mt-4'}>Basic examples</h2>
		<Row>
			<Col md={3}>
				<div>SAS Program: <code>startupService</code></div>
				<div>Data object: <code>null</code></div>
				{config.sasVersion === 'viya' && <div className={'mb-2 mt-1'}>
					<Button bsstyle={'primary'} onClick={props.managedRequest}>H54S.managedRequest</Button>
				</div>}
				<div>
					<Button bsstyle={'secondary'} onClick={props.call}>H54S.call</Button>
				</div>
			</Col>
			<Col md={9}>
				{props.state.res && <div>
					<pre>{JSON.stringify(props.state.res, null, 2)}</pre>
				</div>}
			</Col>
		</Row>
	</div>
}

export const readme = props => {
	return <div>
		<h2 className={'text-center mt-4'}>Read me</h2>
		<h3>Running</h3>
		<p><code>yarn install</code></p>
		<p>This will install all dependencies required for app to run.</p>
		<p><code>yarn start</code></p>
		<p>Runs the app in the development mode.<br/>
			Open http://localhost:3000 to view it in the browser.<br/><br/>
			The page will reload if you make edits.<br/>
			You will also see any lint errors in the console.</p>
		<p><code>yarn build</code></p>
		<p>Builds the app for production to the build folder.<br/>
			It correctly bundles React in production mode and optimizes the build for the best performance.<br/><br/>
			The build is minified and the filenames include the hashes.<br/>
			Your app is ready to be deployed!</p>
	</div>
}

export const getFolderDetailsExample = props => {
	return <div>
		<h3 className={'mb-3'}>Folders & Files methods examples</h3>
		<Row>
			<Col md={5}>
				<h5 className={'mb-0'}>Get details for specific folder</h5>
				<code>getFolderDetails(folderName, options)</code><br/>{config.metadataRoot}
			</Col>
			<Col md={2}>
				<Button
					bsstyle={'btn-sm btn-primary mr-2'}
					onClick={props.getFolderDetails}>Get
				</Button>
			</Col>
			<Col md={5}>
				{props.state.getFolderDetailsError && <div className={'text-danger'}>{props.state.getFolderDetailsError}</div>}
				{props.state.folderDetails && <div>
					<div><span className={'text-info'}>Name:</span> {props.state.folderDetails.name}</div>
					<div><span className={'text-info'}>Id:</span> {props.state.folderDetails.id}</div>
					<div><span className={'text-info'}>Parent Folder Uri:</span> {props.state.folderDetails.parentFolderUri}
					</div>
				</div>}
			</Col>
		</Row>
		<hr/>
	</div>
}

export const getMembersExample = props => {
	return <div>
		<Row className={'members mt-2'}>
			<Col md={5}>
				<h5 className={'mb-0'}>Get members for specific folder</h5>
				<code>getFolderContents(folderName, options)<br/></code>{config.metadataRoot}
			</Col>
			<Col md={2}>
				<Button
					bsstyle={'btn-sm btn-primary mr-2'}
					onClick={props.getRootFolderContent}>Get
				</Button>
			</Col>
			<Col md={5}>
				{props.state.getFolderContents && <div>
					<div className={'mt-3 font-weight-bold'}>Members ({props.state.getFolderContents.count - 1}):</div>
					<hr/>
					{props.state.getFolderContents.items.filter(item => item.name !== 'common').map((item, i) => {
						return <div key={i}><Row>
							<Col md={5}><code>{item.name}</code></Col>
							<Col md={4}><span className={'text-info'}>Type</span> {item.contentType}</Col>
							<Col md={1}>
								{item.contentType === 'file' &&
								<i
									className={'fas fa-file-download'}
									onClick={() => props.getFileContent(item.uri, item.name)}
									title={'get file\'s content'}
								/>}
							</Col><Col md={1}>
							<i
								className={'fas fa-download'}
								onClick={() => props.getFileDetails(item.uri, item.name)}
								title={'get file\'s details'}
							/>
						</Col>
							<Col md={1}>
								<i
									className={'fas fa-trash'}
									onClick={() => props.deleteItem(item.uri)}
									title={'delete file'}
								/>
							</Col>
							<hr/>
						</Row>
							{props.state.filesContent[item.name] && <div>
								<label>Content:</label>
								<pre className={'grayedout'}>{JSON.stringify(props.state.filesContent[item.name], null, 2)}</pre>
							</div>}
							{props.state.filesDetails[item.name] && <div>
								<label>Details:</label>
								<pre className={'grayedout'}>{JSON.stringify(props.state.filesDetails[item.name], null, 2)}</pre>
							</div>}
						</div>
					})}
					<div className={'mt-3 font-weight-bold'}>Folder's Links:</div>
					<hr/>
					{props.state.getFolderContents.links.map((link, i) => {
						return <div key={i}>
							<div><span className={'text-info'}>Method</span> {link.method}</div>
							<div><span className={'text-info'}>Rel</span> {link.rel}</div>
							<div><span className={'text-info'}>URI</span> {link.uri}</div>
							<hr/>
						</div>
					})}
				</div>}
			</Col>
		</Row>
		<hr/>
	</div>
}

export const createNewFolderExample = props => {
	return <div>
		<h5 className={'mb-0'}>Create new folder</h5>
		<div>To create folder we need URI of parent folder</div>
		<div>For this example we'll use metadataRoot folder's details above</div>
		<code>createNewFolder(parentUri, folderName, options)</code>
		<div>
			<label className={'mr-2'}>parentFolderUri:</label><span className={'comment'}>{props.state.folderDetails ?
			Utils.getSelfUri(props.state.folderDetails.links) :
			<Button
				bsstyle={'btn-sm btn-primary mr-2'}
				onClick={props.getFolderDetails}>Get
			</Button>}</span>
		</div>
		<Row className={'mt-3'}>
			<Col md={5}>
				<FormGroup>
					<FormControl
						type={'text'}
						placeholder={'folderName'}
						value={props.state.newFolder}
						onChange={e => props.setState({newFolder: e.target.value})}
					/>
				</FormGroup>
			</Col>
			<Col md={2}>
				<Button
					bsstyle={'btn btn-primary mr-2 btn-loading'}
					onClick={props.createNewFolder}
					disabled={!props.state.folderDetails || !props.state.newFolder || props.state.creatingNewFolder}
				>
					{props.state.creatingNewFolder && <i className={'fas fa-spinner fa-spin'}/>} Create
				</Button>
			</Col>
		</Row>
		<hr/>
	</div>
}

export const createNewFileExample = props => {
	return <div>
		<h3 className={'mb-3'}>Files methods examples</h3>
		<h5 className={'mb-0'}>Create new file</h5>
		<code>createNewFile(fileName, fileBlob, parentFolderUri, options)</code>
		<Row>
			<Col md={1}>fileName: </Col>
			<Col md={4} className={'comment'}>{props.state.newFileName ? props.state.newFileName + '.txt' : 'unknown'}</Col>
		</Row>
		<Row>
			<Col md={1}>fileBlob: </Col>
			<Col md={4} className={'comment'}>{<pre
				className={'text-inline'}>{JSON.stringify(props.fileContent, null, 2)}</pre>}</Col>
		</Row>
		<div>
			<label className={'mr-2'}>parentFolderUri:</label><span className={'comment'}>{props.state.folderDetails ?
			Utils.getSelfUri(props.state.folderDetails.links) :
			<Button
				bsstyle={'btn-sm btn-primary mr-2'}
				onClick={props.getFolderDetails}>Get
			</Button>}</span>
		</div>
		<Row className={'mt-3'}>
			<Col md={5}>
				<FormGroup>
					<FormControl
						type={'text'}
						placeholder={'fileName'}
						value={props.state.newFileName}
						onChange={e => props.setState({newFileName: e.target.value})}
					/>
				</FormGroup>
			</Col>
			<Col md={2}>
				<Button
					bsstyle={'btn btn-primary mr-2 btn-loading'}
					onClick={props.createNewFile}
					disabled={!props.state.folderDetails || !props.state.newFileName || props.state.creatingNewFile}
				>
					{props.state.creatingNewFile && <i className={'fas fa-spinner fa-spin'}/>} Create
				</Button>
			</Col>
		</Row>
	</div>
}


export const editFileExample = props => {
	const file = props.state.editFile
	const content = (file && file.content) || ''
	return <div>
		<h5 className={'mb-0'}>Update file</h5>
		<code>updateFile(fileName, fileBlob, lastModified, overwrite, options)</code>
		<div>If overwrite = <span className={'text-danger'}>false</span> you will be notified if file was edited in the
			meantime
		</div>
		<div>
			<label className={'mr-2'}>file:</label><span className={'comment'}>{file && file.name + '.txt'}</span>
		</div>
		<Row className={'mt-3'}>
			<Col md={5}>
				<FormGroup>
					<FormControl
						as="textarea" rows="3"
						value={content}
						onChange={e => {
							let v = e.target.value
							const editFile = props.state.editFile
							editFile.content = v
							props.setState({editFile})
						}}
					/>
				</FormGroup>
			</Col>
			<Col md={2}>
				<button
					className={'btn btn-primary mr-2 btn-loading'}
					onClick={props.updateFile}
					disabled={!file || !file.name || !file.content}
				>
					{props.state.updatingFile && <i className={'fas fa-spinner fa-spin'}/>} Update
				</button>
			</Col>
		</Row>
		{props.state.editFileError && <div className={'text-danger'}>props.state.editFileError</div>}
	</div>
}
