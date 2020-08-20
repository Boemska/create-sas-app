import React from 'react'
import "./projectList.scss";
//import {fetchProjects, setMainSpinner} from './projectListActions';
import { connect } from 'react-redux';
import {useHistory} from 'react-router';
//import {PROJECT_EXTENTION} from '../../components/newProject/newProjectActions'
import ADAPTER_SETTINGS from '../../adapterService/config'
import { Stack, Separator,CommandButton,  Breadcrumb , DetailsList, FontIcon, SelectionMode, DetailsRow} from '@fluentui/react'
import { 
        fetchRootFolders,
        fetchFolderChildren,
        fetchFolderChildrenByUri 
} from './projectListActions'
import moment from 'moment'

const newMenuProps = {
  items: [
    {
      key: 'Test',
      text: 'Test',
      iconProps: { iconName: 'Mail' },
      onClick: ()=>{console.log("Test")}
    },
    {
      key: 'calendarEvent',
      text: 'Calendar event',
      iconProps: { iconName: 'Calendar' },
    },
  ]
};

const uploadMenuProps = {
  items: [
    {
      key: 'upload',
      text: 'Upload project',
      iconProps: { iconName: 'ChatBot' },
      onClick: ()=>{console.log("Upload project")}
    }
  ]
};

class ProjectList extends React.PureComponent {

  constructor(props){
    super(props);

    const columns = [
      {
        key: 'column0',
        name: 'File Type',
        className: 'fileIconCell',
        iconClassName: 'fileIconHeaderIcon',
        ariaLabel: 'Column operations for File type, Press to sort on File type',
        iconName: 'Page',
        isIconOnly: true,
        fieldName: 'name',
        minWidth: 16,
        maxWidth: 16,
        //sort func
        //onColumnClick: this._onColumnClick,
        onRender: (item) => {
          return <FontIcon iconName="OpenFolderHorizontal" className={'fileIconImg'} />
        },
      },
      { 
        key: 'column1', 
        name: 'Name', 
        fieldName: 'name',
        minWidth: 210,
        maxWidth: 350, 
        isResizable: true, 
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        //onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true,
        onRender: (item) => {
          return <span>{item.name}</span>;
        }
      },
      { 
        key: 'column2', 
        name: 'Modified', 
        fieldName: 'modified',  
        minWidth: 100,
        maxWidth: 130, 
        data: 'number',
        isResizable: true,
        onRender: (item) => {
          return <span>{moment(item.modifiedTimeStamp).format('DD-MM-YYYY HH:mm')}</span>;
        }
       },
      { key: 'column3', name: 'Modified By', fieldName: 'modifiedBy', minWidth: 200, maxWidth: 230, isResizable: true, data: 'string'},
      { key: 'column4', name: 'File size (kB)', fieldName: 'fileSize', minWidth: 70, maxWidth: 90, isResizable: true,  data: 'number' },
      { key: 'column5', name: 'Sharing', fieldName: 'sharing', minWidth: 70, maxWidth: 90, isResizable: true },
    ];

    this.state={
      breadCrumb : [{ text: 'Files', key: 'Files', onClick: ()=>{this.handleBcClick({id:'Files'})}}],
      columns: columns,
      items: []
    }
  }

  componentDidMount = () => {
    this.props.fetchRootFolders();
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    this.setState({items : nextProps.folders})
  }
  
  renderRow= (props) => {
    const {item} = props;
    return <DetailsRow {...props} onClick={()=>this.handleRowClick(item)} />
  }

  handleRowClick= (item) => {
    const { breadCrumb } = this.state;
    let bc = { 
      text: item.name,
      key: item.id, 
      uri: item.uri? item.uri : null,
      onClick: () => {this.handleBcClick(item)}}
		if (breadCrumb.length === 1) { // we are in root folder
      this.props.fetchFolderChildren(item.id);
		} else {
      this.props.fetchFolderChildrenByUri(item.uri);
		}
    this.setState({ breadCrumb : breadCrumb.concat(bc) })
  }

  handleBcClick= (item) => {
    const {breadCrumb} = this.state;
    const index = breadCrumb.findIndex((bc)=>bc.key === item.id)
    if(index===0){ //root
      this.props.fetchRootFolders();
    } else if (index === 1) { // we are in root folder
      this.props.fetchFolderChildren(item.id);
		} else {
      this.props.fetchFolderChildrenByUri(item.uri);
		}
    this.setState({breadCrumb: breadCrumb.slice(0, index+1)})
  }

  render(){
    //const items = this.props.folders
    return (
      <div className={'align-center'}>
        <Stack>
          <Stack horizontal className={'projectListHeader'}>
            <CommandButton
              iconProps={ { iconName: 'Add' }}
              text="New"
              menuProps={newMenuProps}
            />
            <CommandButton
              iconProps={ { iconName: 'Upload' }}
              text="Upload"
              menuProps={uploadMenuProps}
            />
            <CommandButton
              iconProps={ { iconName: 'Link' }}
              text="Copy link"
            />
          </Stack>
          <Separator/>
          <Breadcrumb
            items={this.state.breadCrumb}
            ariaLabel="With last item rendered as heading"
            overflowAriaLabel="More links"
          />
          <DetailsList
            items={this.state.items}
            columns={this.state.columns}
            setKey="none"
            selectionMode={SelectionMode.none} //select row feature
            onRenderRow={this.renderRow}
          />
        </Stack>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
	return {
    fetchRootFolders: () => fetchRootFolders(dispatch),
    fetchFolderChildren: (folderId) => fetchFolderChildren(dispatch, folderId),
		fetchFolderChildrenByUri: (uri) => fetchFolderChildrenByUri(dispatch, uri)
	}
}

function mapStateToProps(store) {
	return {
		 folders: store.projectList.folders,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);