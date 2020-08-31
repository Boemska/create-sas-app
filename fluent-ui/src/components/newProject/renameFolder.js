import React, { Component} from 'react'
import { TextField, Dialog, PrimaryButton, DefaultButton, DialogFooter} from '@fluentui/react'
import {connect} from 'react-redux';
import {renameFolder} from './newFolderActions';
//import {renameProject} from './projectActions';

class RenameFolder extends Component {

  constructor(props){
    super(props);

    this.state ={
      oldPropsName: '', 
      name: '',
      folderId: '',
      error: '',
    }
  }

  close = newName => {
    this.setState({name: '', error: '', oldPropsName: ''});
    this.props.close(newName);
  }

  static getDerivedStateFromProps(props, state){
    if(props.folder.text!==state.oldPropsName){
      return {name: props.folder.text, folderId: props.folder.key, oldPropsName: props.folder.text}
    }
  }

  rename = () => {

    console.log("FOLDE", this.props.currentFolder)


    //No need to send request of name stayed the same
    // this.setState({error: ''})
    // if (this.state.name === '') {
    //   this.setState({error: "Please enter a name for the project"});
    //   return;
    // }
    // if (this.state.name !== this.state.oldPropsName) {
    //   this.props.rename(this.state.name, this.props.projectContent, this.props.projectMetadata.uri)
    //             .then(() => this.close())
    //             .catch(e => this.setState({error: e}))
    // }
    console.log("NAME",this.state.name)
    console.log("ID",this.state.folderId)
    const uri = '/folders/folders/' + this.props.currentFolder.id;
    this.props.renameFolder(uri, this.state.name, this.props.currentFolder.lastModified)
      .then(() => this.close(this.state.name))
      .catch(error => this.setState({error}));
  }
  
  render() {
    return (
      <Dialog 
        title={'Rename folder'}
        isOpen={this.props.isOpen}
      >
        <TextField  value={this.state.name} onChange={e => this.setState({name: e.target.value})} errorMessage={this.state.error}/>
  
        <DialogFooter>
          <PrimaryButton text="Rename" onClick={this.rename} disabled={this.state.name==='Files'?true:false}/>
          <DefaultButton text="Close" onClick={() => this.close(null)}/>
        </DialogFooter>
      </Dialog>
    )
  }
 
}

function mapStateToProps(store) {
	return {
    projectContent: store.project.projectContent,
    projectMetadata: store.project.projectMetadata,
    currentFolder: store.projectList.currentFolder
	}
}

function mapDispatchToProps(dispatch) {
	return {
    // renameFolder: (folder, newName) => renameFolder(dispatch, folder, newName),
    renameFolder: (uri, newName, lastModified) => renameFolder(dispatch, uri, newName, lastModified),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RenameFolder)
