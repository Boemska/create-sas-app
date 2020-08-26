import React, { Component} from 'react'
import { TextField, Dialog, PrimaryButton, DefaultButton, DialogFooter} from '@fluentui/react'
import {connect} from 'react-redux';
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

  close = () => {
    this.setState({name: '', error: '', oldPropsName: ''});
    this.props.close();
  }

  static getDerivedStateFromProps(props, state){
    if(props.folder.text!==state.oldPropsName){
      return {name: props.folder.text, folderId: props.folder.key, oldPropsName: props.folder.text}
    }
  }

  rename = () => {
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
          <DefaultButton text="Close" onClick={this.close}/>
        </DialogFooter>
      </Dialog>
    )
  }
 
}

function mapStateToProps(store) {
	return {
    projectContent: store.project.projectContent,
    projectMetadata: store.project.projectMetadata
	}
}

function mapDispatchToProps(dispatch) {
	return {
   // rename: (newName, projectContent, uri) => renameProject(dispatch, newName, projectContent, uri)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(RenameFolder)
