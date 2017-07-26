import React from 'react';
import { Dropdown } from 'semantic-ui-react';


const PrivacyOptions = [
  { key: '1', text: 'Public', value: 'Public' },
  { key: '2', text: 'Private', value: 'Private' },
  { key: '3', text: 'Group', value: 'Group' },
]

class PrivacyBox extends React.Component{
	constructor(props){
		super(props);
	}
	render (){
		return (
			<Dropdown 
				name={this.props.name} 
				placeholder={this.props.defaultValue}
				fluid search selection 
				options={PrivacyOptions} 
			/>
		);
	}
}

export default PrivacyBox;
