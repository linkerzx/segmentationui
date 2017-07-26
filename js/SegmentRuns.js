import React, {Component} from 'react';
import {Icon, Grid, Container} from 'semantic-ui-react';

class SegmentRunStatus extends React.Component {
	constructor(props){
		super(props);
		this.state = {icon: ""};
		//this.getIcon();
	}
	getIcon(){
		var new_icon = "";
		if(this.props.status == 'OK') {
			new_icon = <Icon name="smile" size="large" color="green"/>
		} else {
			new_icon = <Icon name="frown" size="large" color="red"/>
		}
		//this.setState({icon: new_icon});		
		return new_icon;
	}
	render () {	
		//var thisIcon = this.state.icon;	
		const thisIcon = this.getIcon();
		return (<div> {thisIcon} </div>);
	}
}

class SegmentRunsForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {runs: []};
		this.getSegmentRuns();
	}
	getSegmentRuns() {
		var classAttr = this;
		const API_SEGMENT_RUNS_GET = '/api/segmentation/runs/';
		fetch(API_SEGMENT_RUNS_GET + this.props.segment_id)
		.then(function(response) {
                     return response.json()
                   }).then(function(json) {
                         classAttr.setState({runs: json});
                   })
	}
	render () {	
		var segmentRunId = 0;
		const runs = this.state.runs.map(function(run) {
			var row = (
					<Grid.Row columns={2} key={run.id}> 
						<Grid.Column> {run.date} </Grid.Column>
						<Grid.Column> <SegmentRunStatus status={run.status}/> </Grid.Column>
					</Grid.Row>
				);
			return row;
		});
		return (
			<Container>
				<Grid>
					{runs}
				</Grid>
			</Container>
		);
	}
}

export default SegmentRunsForm;
