import React, { Component } from 'react'
import {TextField, Dialog, PrimaryButton, DefaultButton, DialogFooter} from '@fluentui/react'
import {connect} from 'react-redux';
import { createNewProject } from './newProjectAction';
import {withRouter} from 'react-router-dom'

class NewProject extends Component {

  constructor(props){
    super(props);

    this.state ={
      name: '',
      description: '',
      error: '',
    }
  }

  submit = () => {
    const forSubmit = {
      name: this.state.name,
      createdOn: new Date(),
      createdBy: this.props.user.name,
      description: this.state.description
    }
    const res = this.props.createNewProject(this.state.name, forSubmit, null, this.props.metadataRoot);

    res.then((res) => {
      console.log('response', res)
      this.close();
      this.props.history.push('/project/' + res);
    }).catch((res)=>this.setState({error : res}))
	}

  close = () => {
    this.setState({name: '', description: '', error: ''});
    this.props.close();
  }
  
  render() {
    return (
      <Dialog 
        title={'Add New Project'}
        isOpen={this.props.isOpen}
        subText={this.props.metadataRoot==="/" ? "You can not create new project in root folder! " : `Path: ${this.props.metadataRoot}`}
      >
        <TextField  value={this.state.name} onChange={e => this.setState({name: e.target.value, error:""})} errorMessage={this.state.error} label={"Project name"}/>
        <TextField  value={this.state.description} onChange={e => this.setState({description: e.target.value})} label={"Description"} multiline/>
  
        <DialogFooter>
          <PrimaryButton text="Add project" onClick={this.submit} disabled={this.props.metadataRoot==="/" ? true:false}/>
          <DefaultButton text="Close" onClick={this.close}/>
        </DialogFooter>
      </Dialog>
    )
  } 
}

function mapStateToProps(store) {
	return {
    user: store.home.userData
	}
}

function mapDispatchToProps(dispatch) {
	return {
    createNewProject: (projectName, projectProps, override, metadataRoot) => createNewProject(dispatch, projectName, projectProps, override, metadataRoot)
	}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewProject))
