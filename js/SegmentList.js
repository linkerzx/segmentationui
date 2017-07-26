import React, {Component} from 'react';
import {Icon, Container, Table, Button, Dimmer, Modal, Header} from 'semantic-ui-react';
import SegmentForm from './SegmentForm';
import SegmentRunsForm from './SegmentRuns';
import 'whatwg-fetch';

export const API_SEGMENT_LIST = '/api/segmentation/list/'

class SegmentListRow extends React.Component {
	constructor(props) {
		super(props);
	}
	render () {
		var showSegmentForm = this.props.showSegmentForm;
		var showRunModal = this.props.showRunModal;
		var segment = this.props.segment;
		return (
			<Table.Row>
				<Table.Cell> {segment.name}</Table.Cell>
				<Table.Cell> {segment.description}  </Table.Cell>
				<Table.Cell textAlign="right"> 
					<Button compact onClick={(e) => showSegmentForm(segment.id)}><Icon name="edit"/>Edit</Button>
					<Button compact onClick={(e) => showRunModal(segment.id)}><Icon name="calendar"/>Runs</Button>
					<Button compact>
						<Button.Content><Icon name="trash outline"/></Button.Content>
					</Button>
				</Table.Cell>
			</Table.Row>
		);
	}
}

class SegmentListTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {count: 0};
	}
	count(){
		var new_count = this.state.count + 1;
		this.state.count = new_count;
		return this.state.count;
	}
	render () {
		const listSegments = this.props.segments.map((segment) => 
			<SegmentListRow
				key = {this.count()}
				segment={segment}
				showSegmentForm={this.props.showSegmentForm}
				showRunModal={this.props.showRunModal}
			/>
                );
		return (
				<Table celled>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell> Segment Name </Table.HeaderCell>
							<Table.HeaderCell> Segment Description </Table.HeaderCell>
							<Table.HeaderCell> </Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{listSegments}						
					</Table.Body>
				</Table>
		);
	}
}

class SegmentList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			segment_open: false,
			run_open: false,
			segment_id: null,
			segments: []
		}	
		this.showSegmentForm = this.showSegmentForm.bind(this);
		this.showRunModal = this.showRunModal.bind(this);
		this.getSegments = this.getSegments.bind(this);
		this.getSegments();
	}
	handleSubmit(e) {
                // to not autoSubmit 
                 e.preventDefault();
        }
	showSegmentForm(value, e){
		if(this.state.segment_open == false) {
			this.setState({segment_open: true});
			if(value){
				this.setState({segment_id: value});
			}
			
		} else {
			this.setState({segment_open: false, segment_id: null});
		}
	}
	showRunModal(value, e) {
		  this.setState(prevState => ({
			segment_id: value,
      			run_open: !prevState.run_open
		    }));
	}
	getSegmentbyID(value){
		if(!(value != null && this.segment_id == null)){
			value = this.state.segment_id;
		}
		var output = this.state.segments.filter(function(segment) {return segment.id == value});
		return output[0];
	}
	getHeader(e) {
		var header = "";
		if(this.state.segment_id != null) {
			header = ("Edit Segment " + this.getSegmentbyID().name);
		} else {
			header = "Create Segment";
		}
		return header;
	}	
	getSegments(e){
		var classAttr = this;
		fetch(API_SEGMENT_LIST)
		  .then(function(response) {
		    return response.json()
		  }).then(function(json) {
			classAttr.setState({segments: json});
		  }).catch(function(ex) {
		    console.log('parsing failed', ex)
		  });
	}
	render (){
		const segment_open = this.state.segment_open;
		const run_open = this.state.run_open;
		return (
			<div>
				<div> <p></p> </div>
				<SegmentListTable 
					showSegmentForm={this.showSegmentForm}
					showRunModal={this.showRunModal}
					segments={this.state.segments}
				/>
				<Modal open={segment_open} onClose={() => this.showSegmentForm()}>
					<Modal.Header> {this.getHeader()}</Modal.Header>
					<Modal.Content>
						<SegmentForm
							segment_id={this.state.segment_id}
							closeForm={this.showSegmentForm}
						/>
					</Modal.Content>
				</Modal>
				<Modal open={run_open} onClose={() => this.showRunModal()}>
					<Modal.Header> Runs </Modal.Header> 
					<Modal.Content>
						<SegmentRunsForm
							segment_id={this.state.segment_id}
						/>
					</Modal.Content>
				</Modal>
			</div>
		);
		}
}

export default SegmentList;
