import React, {Component} from 'react';
import { Grid, Divider, Form, Input, Label, Table, Icon, Button, Container} from 'semantic-ui-react';
import PrivacyBox from './PrivacyBox';
import 'whatwg-fetch';


const API_SEGMENT_EDIT = '/api/segmentation/edit/';
const API_GET_ATTRIBUTES = '/api/customer_profile/attributes/';
const API_GET_SEGMENT_DETAILS = '/api/segmentation/details/';

class SegmentConditionRowDeleteButton extends React.Component {
	constructor(props) {
		super(props);
        }
   	render () {
		var rowDelete = this.props.rowDelete;
		var rowKey = this.props.rowKey;
		return (
			<Button onClick={ (evt) => rowDelete(rowKey)}>
				<Icon color="red" name="delete"/>
				Delete
			</Button>
		);
	}
}

class SegmentAttributeInput extends React.Component {
	constructor(props) {
		super(props);
	}
	render () {
		return (<Div> </Div>);
	}
}

class SegmentConditionRow extends React.Component {
	constructor(props) {
		super(props);
		this.item = this.props.item;
	}
	render () {
		var rowDelete = this.props.rowDelete;
		var prefix = "segmentConditions[0]";
		var form_name = function(item, name) {return prefix + "[" + item.id + "][" + name + "]"; };
		return (
			<Table.Row> 
				<Table.Cell>
					<Input type="hidden" name={form_name(this.item, 'id')} value={this.item.id}/> 
					<Input name={form_name(this.item, 'attribute')}/> 
				</Table.Cell> 
				<Table.Cell>
					<Input name={form_name(this.item, 'condition')}/>
				</Table.Cell>
				<Table.Cell>
					<Input name={form_name(this.item, 'value')}/>
				</Table.Cell>
				<Table.Cell>
					<SegmentConditionRowDeleteButton 
						rowDelete={this.props.rowDelete}
						rowKey={this.item.id}
					/>
				</Table.Cell>
			</Table.Row>
		);
	}
}

class SegmentConditionRows extends React.Component {
	constructor(props) {
		super(props);	
		this.state = {
			items: this.props.items
		};
	}
	render () {
		var items = this.props.items;
		const listItems = items.map((item) =>
  			<SegmentConditionRow key={item.id} item={item} rowDelete={this.props.rowDelete}/>
		);
		return (<Table.Body>{listItems}</Table.Body>);
	}
}


class SegmentTable extends React.Component {
	constructor(props) {
		super(props);
	}
	render () {
		return (
			<Table celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Attribute</Table.HeaderCell>
						<Table.HeaderCell>Condition</Table.HeaderCell>
						<Table.HeaderCell>Value</Table.HeaderCell>
						<Table.HeaderCell>Delete</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<SegmentConditionRows 
					items={this.props.items}
					rowDelete = {this.props.rowDelete}
				/>
			</Table>
		);
	}
}

class SegmentConditions extends React.Component {
	constructor(props){
		super(props);
		this.rowDelete = this.rowDelete.bind(this);
		this.addRow = this.addRow.bind(this);
		// modify this :)
		this.state = {
			  item_counter: -1, 
                          items: [
                                  ]
                  };

	}
	counterAdd(value) {
		var new_item_counter = this.state.item_counter + value; 
		this.setState({item_counter: new_item_counter});
		return new_item_counter;
	}
	rowDelete(value, e){
		//console.log(e);
		//console.log("delete row " + value + " counter" + this.state.item_counter);
		var new_items = this.state.items.filter(function(item){
                          return item.id != value;
                 });     
		this.setState({items: new_items});
		}
	addRow(e){
		//console.log("add row " + this.state.item_counter);
		var new_items = this.state.items;
		var newelement = {name: "Null", id: this.counterAdd(1)};
		new_items.push(newelement);
		this.setState({items: new_items});
	}
	render () {
		return (
			<div>	
				<Grid>
					<Grid.Row columns={2}>
						<Grid.Column><Label> Conditions </Label></Grid.Column>
						<Grid.Column textAlign='right'>
							<Button onClick={ () => this.addRow()}><Icon name='plus' color='green' />Add</Button> 
						</Grid.Column>
					</Grid.Row>
				</Grid>
				<SegmentTable 
					items={this.state.items}
					rowDelete={this.rowDelete}
				/>
			</div>
			);
	}
}

class SegmentForm extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			attributes: [],
			segment_details: {
				segment_desc: {
					name: "My New Test Segment",
					description: "My New Test Description",
					privacy: "Group"
				}
			}
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getAttributes = this.getAttributes.bind(this);
		this.getDetails = this.getDetails.bind(this);
		this.submitForm = this.submitForm.bind(this);
		if(this.props.segment_id != null){
			this.getDetails();
		}
  	}
  	handleSubmit(e) {
		// to not autoSubmit 
		e.preventDefault();
  	}
	getDetails(e) {
		var classAttr = this;
		fetch(API_GET_SEGMENT_DETAILS + this.props.segment_id)
			.then(function(response) {return response.json()})
			.then(function(json) {
				// add non empty handler
				classAttr.setState({segment_details: json});
			});		
	}
	getAttributes(e) {	
		var classAttr = this;
		fetch(API_GET_ATTRIBUTES)
                   .then(function(response) {
                     return response.json()
                   }).then(function(json) {
			// add non empty handler
                         classAttr.setState({attributes: json});
                   })
	}
	submitForm(e) {
		var serialize = require('form-serialize');
		var form = document.querySelector('form');
		var obj = serialize(form, { hash: true });
		var json_obj = JSON.stringify(obj);
		console.log(json_obj);
		//al
		var classAttr = this;
		fetch(API_SEGMENT_EDIT, {
  			method: 'PUT',
  			body: json_obj
		}).then(function() {
			//classAttr.props.closeForm();
		});
	}
  	render() {
			const segmentDetails = this.state.segment_details;
			const segmentDesc = segmentDetails.segment_desc;
			const segmentName = segmentDesc.name;
			const segmentPrivacy = segmentDesc.privacy;
			const segmentDescription = segmentDesc.description;
    		return (
			<Container>
			<Form onSubmit={this.handleSubmit}>
				<Input type='hidden' name='segment_desc[id]' value={this.props.segment_id}/>
			<Grid>
				<Grid.Row columns={2}>
					<Grid.Column>
						<Form.Field>
			      				<Label><Icon circular name="write"/>Name</Label>
			      				<Input name="segment_desc[name]" type='text' placeholder={segmentName} />
						</Form.Field>
					</Grid.Column>
					<Grid.Column>
						<Form.Field>
							<Label><Icon circular name="privacy"/>Privacy</Label>
							<PrivacyBox name="segment_desc[privacy]" defaultValue={segmentPrivacy}/> 
						</Form.Field>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row columns={1}>	
					<Grid.Column>
						<Form.Field>
							<Label>Description </Label>
                                			<Input type='text' name="segment_desc[description]" placeholder={segmentDescription} />			
						</Form.Field>
					</Grid.Column>
				</Grid.Row>
			</Grid>
				<Divider/>
				<SegmentConditions/ >
				<Divider/>
				<Button onClick={ () => this.submitForm()}> Submit </Button>
			</Form>	
			</Container>
	);
  	}
};

export default SegmentForm;
