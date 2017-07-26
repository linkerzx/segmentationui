import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { 
	Form, 
	Header,
	Radio,
	Statistic, 
	Input, Label, Item, Grid, Table, Button, Dropdown, Icon, Divider, Modal} from 'semantic-ui-react';
import {
	Map,
	Circle,
	LayersControl, 
	LayerGroup,  
	FeatureGroup,
	Marker, 
	Popup, 
	TileLayer,
	MapControl,
	Tooltip
} from 'react-leaflet';
import 'leaflet';

const API_LOCATION_GET_POINTS = '/api/location/points/';
const API_LOCATION_GET_GEOFENCES = '/api/location/geofences/';
const DEFAULT_MIN_GEOFENCE_RADIUS = 1000;
const DEFAULT_MAX_GEOFENCE_RADIUS = 8000;
const DEFAULT_GEOFENCE_RADIUS = 1000;

const { BaseLayer, Overlay } = LayersControl

export class LegendControl extends MapControl {

  componentWillMount() {
    const legend = L.control({position: 'topright'});
    const jsx = (
      <div {...this.props}>
        {this.props.children}
      </div>
    );

    legend.onAdd = function (map) {
      let div = L.DomUtil.create('div', '');
      ReactDOM.render(jsx, div);
      return div;
    };

    this.leafletElement = legend;
  }
}

class GeoMapsPoint extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		var point = this.props.point;
		var position = [this.props.point.lat, this.props.point.long];
		var showGeofenceForm  = this.props.showGeofenceForm;
		return (
			<Marker position={position}> 
				<Popup>
					<span>			
						{this.props.point.name}
						{this.props.point.description}
						<Button onClick={() => showGeofenceForm(point.id)}>GeoFence</Button>
					</span>
				</Popup>
			</Marker>
		);
	}
}
	
class GeoMaps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			toggle_marker_add: false,
			toggle_geofence_add: false,
			toggle_geofence_view: false
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleMarker = this.handleMarker.bind(this);
		this.handleGeofence = this.handleGeofence.bind(this);
		this.handleAddGeo = this.handleAddGeo.bind(this);
		this.addMarker = this.addMarker.bind(this);
		this.removeMarker = this.removeMarker.bind(this);
	}
	handleMarker(e) {
		this.setState(prevState => ({ 
                        toggle_marker_add: !prevState.toggle_marker_add,
			toggle_geofence_add: false
                    }));
	}
	handleGeofence(e) {
		this.setState(prevState => ({
                        toggle_marker_add: false,
                        toggle_geofence_add: !prevState.toggle_geofence_add
                    }));

	}
	handleAddGeo(e) {
		e.preventDefault();
		var thisMap = this.map.leafletElement;
		var thisOverlay = this.overlay;
		if(this.state.toggle_geofence_view == false) {
			thisMap.addLayer(thisOverlay.layer);
		} else {
			thisMap.removeLayer(thisOverlay.layer);
		}
		this.setState(prevState => ({
      			toggle_geofence_view: !prevState.toggle_geofence_view
		    }));
	}
	handleClick(e) {
		if(this.state.toggle_marker_add == true){
			var GeoFenceData = {
				type: 'create',
				option: 'point',
				latlong: [e.latlng.lat, e.latlng.lng]
			};
			this.props.showGeofenceForm(GeoFenceData);
			this.addMarker(GeoFenceData);
			this.handleMarker();
		}
		else if(this.state.toggle_geofence_add == true) {
			var GeoFenceData = {
				type: 'create',
				option: 'geofence',
				latlong: [e.latlng.lat, e.latlng.lng]
			};
			this.props.showGeofenceForm(GeoFenceData);
			this.addMarker(GeoFenceData);
			this.handleGeofence();
			console.log(this.map.leafletElement._layers);
			this.map.leafletElement._layers[0].eachLayer(function(layer) {
				if(layer instanceof L.Marker){console.log(layer);}
			});
		}
	}
	addMarker(value){
		var thisMap = this.map.leafletElement;
		var myIcon = L.divIcon({
      			iconSize: [40, 40],	
			html: '<image src="/image/40/40">',
			className: 'activeMarker'
		    });
		var latlong = [value.latlong[0], value.latlong[1]];
		var marker = L.marker(
					latlong, {icon: myIcon}
				).addTo(thisMap);
		if(value.option == 'geofence') {
			var circle = L.circle(latlong,  DEFAULT_GEOFENCE_RADIUS).addTo(thisMap);
			marker.circle = circle;
		}
		this.props.setOptimisticMarker(marker);
	}
	removeMarker(value){
		var thisMap = this.map.leafletElement;
		var marker = this.props.optimisticMarker;
		thisMap.removeLayer(marker);
		if(value.option == 'geofence'){
			thisMap.removeLayer(marker.circle);
		}
	}
	render() {
		const position = [51.505, -0.09];
		var id = -1;
		var showGeofenceForm = this.props.showGeofenceForm;
		const GeoPoints = this.props.points.map(function(point) {
			id = id + 1;
			return (<GeoMapsPoint 
				 	key={id}	
					point={point}
					showGeofenceForm={showGeofenceForm}
				/>);
			});
		const GeofencedAreas = this.props.geofences.map(function(areas) {
			id = id +1;
			return (
				<Circle 
					key={id}
					center={[areas.lat, areas.long]} 
					radius={areas.radius}
				/>
			);
		});
		return (
			<Map 
				center={position} 
				zoom={13} 
				onClick={this.handleClick}
				ref={Map => this.map = Map}
				style={{height: '400px', width:'100%'}}
			>
				<LegendControl>
					<div style={{width: "50px", backgroundColor: "lightsteelblue", opacity: 0.9}}>
							<Button compact onClick={this.handleMarker}><Icon name="marker"/></Button>
							<Button compact onClick={this.handleGeofence}><Icon name="circle outline"/></Button>
							<Button compact onClick={this.handleAddGeo}><Icon name="bullseye"/></Button>
					</div>
				</LegendControl>
				<LayersControl position='topright'>
				  <BaseLayer checked name='Oula'>
				    <TileLayer
				      url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
				    />
				  </BaseLayer>
				    <Overlay name='Geofences' ref={Overlay => this.overlay = Overlay}>
					<FeatureGroup color='red'>
						{GeofencedAreas}
					</FeatureGroup>
				    </Overlay>
				</LayersControl> 
				{GeoPoints}	
			</Map>
		);
	}
}


class GeoPointsTableRow extends React.Component {
	constructor(props){
		super(props);
	}
	render () {
		var point = this.props.point;
		var showGeofenceForm = this.props.showGeofenceForm;
		var value = {
			type: 'edit',
			option: 'geofence',
			latlong: [point.lat, point.long]
		}
		return (
			<Table.Row>
				<Table.Cell>{point.name}</Table.Cell> 
				<Table.Cell>{point.description}</Table.Cell>
				<Table.Cell>
					<Button compact><Icon name="edit"/></Button>
					<Button compact onClick={() => showGeofenceForm(value)}><Icon name="bullseye"/></Button>
					<Button compact><Icon name='trash'/></Button>
				</Table.Cell>
			</Table.Row>
		);
	}
}
class GeoPointsTable extends React.Component {
	constructor(props) {
		super(props);
	}
	render () {
		var showGeofenceForm = this.props.showGeofenceForm;
		var id = -1;
		const TableRows = this.props.points.map(function(point) {
				id = id + 1;
				return <GeoPointsTableRow 
						key={id}
						point={point}
						showGeofenceForm={showGeofenceForm}
					/>;
				});
		return (
			<div>
				<Grid>
					<Grid.Row columns={2} verticalAlign='bottom'>
						<Grid.Column><Header>Points of Interest</Header></Grid.Column>
						<Grid.Column textAlign='right'>
							<Icon name='marker' />
							<Radio toggle/>
							<Icon name='circle outline' />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			<Table>
				<Table.Header> 
					<Table.Row> 
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Descriptions</Table.HeaderCell>
						<Table.HeaderCell></Table.HeaderCell> 						
					</Table.Row>
				</Table.Header>
				<Table.Body>{TableRows}</Table.Body>
			</Table>	
			</div>
		); 
	}
}

class GeofenceForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			radius: DEFAULT_MIN_GEOFENCE_RADIUS
		}
		this.getTitle = this.getTitle.bind(this);
		this.getFormName = this.getFormName.bind(this);
		this.handleRadiusChange = this.handleRadiusChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleOnClose = this.handleOnClose.bind(this);
	}
	getTitle(){
		var data = this.props.data; 
		var prefix = '';
		var middle = '';
		if(data.type == 'create') {
			prefix = 'Add a '
		}
		if(data.option == 'point') {
			middle = 'point of interest';
		} else if(data.option == 'geofence'){
			middle = 'geofence';
		}
		return ( prefix + middle);
	}
	getFormName(){
		var data = this.props.data;
		var name = data.option;
		if(data.option == 'point') {
			name = 'point of interest';
		}
		return "Your " + name + "'s name here";
	}
	submitForm(){}
	handleRadiusChange(e){
		this.setState({ radius: e.target.value });
		this.props.optimisticMarker.circle.setRadius(e.target.value);
	}
	handleSubmit(e) {
		e.preventDefault();	
		console.log("Submited");
	}
	handleOnClose(value) {
		this.props.showGeofenceForm(value);
		this.setState({radius: DEFAULT_GEOFENCE_RADIUS});
	}
	getContent(){
		var data = this.props.data;
		var lat = data.lat.toFixed(3);
		var long = data.long.toFixed(3);
		var latlng = "(" + lat + "," + long + ")";
		var namePlaceholder = this.getFormName(); 
		return (<Form onSubmit={this.handleSubmit}>
			<Grid>
				<Grid.Row columns={2}>
					<Grid.Column>
						<Form.Field>
							<Label>Name</Label>
							<Input name="name" placeholder={namePlaceholder}/>
						</Form.Field>
					</Grid.Column>
					<Grid.Column>
						<Form.Field>
							<Label>Coordinates</Label>
							<Input disabled type='text' placeholder={latlng}/>
						</Form.Field>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Form.Field>
							<Label>Description</Label>
							<Input type='text' placeholder="Your description here"/>
						</Form.Field>
					</Grid.Column>
				</Grid.Row>
				{ data.option == 'geofence' && 
				<Grid.Row columns={3}>
					<Grid.Column>	
						<Form.Field>
							<Label>Radius</Label>
							<Input 
								type='range' 	
								min={DEFAULT_MIN_GEOFENCE_RADIUS} 
								max={DEFAULT_MAX_GEOFENCE_RADIUS} 	
								onChange={(a) => this.handleRadiusChange(a)}
							/> 
						</Form.Field>
					</Grid.Column>
					<Grid.Column verticalAlign='middle'>	
						<Statistic 
							size='small' 
							horizontal 
							value={this.state.radius} 
							label='Meters' 
						/>
					</Grid.Column>
				</Grid.Row>
				}
			</Grid>
				<Divider/>
				<Button onClick={() => this.submitForm()}>Submit</Button>
			</Form>
		);
	}
	render () {
		var data = this.props.data;
		var title = this.getTitle();
		var content = this.getContent();
		var exitData = {
			type: 'close',
			option: data.option
		};
		return (
			<Modal 
				open={this.props.open}
				onClose={() => this.handleOnClose(exitData)}

			> 
				<Modal.Header>{title}</Modal.Header>
				<Modal.Content>{content}</Modal.Content>
			</Modal>
		);
	}
}

class Geofence extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			geofence_open: false,
			optimisticMarker: null,
			points: [],
			geofences: [],
			geofenceFormData: {
				title: 'Create New',
				type: '',
				lat: 0,
				long: 0,
				radius: 0
			}
		};
		this.getGeoAreas = this.getGeoAreas.bind(this);
		this.showGeofenceForm = this.showGeofenceForm.bind(this);
		this.setOptimisticMarker = this.setOptimisticMarker.bind(this);
		this.getGeoAreas();
		this.getGeofences();
	}
	getGeoAreas() {
		var classAttr = this;
		fetch(API_LOCATION_GET_POINTS)
			.then(function(response) {return response.json()})
			.then(function(json) {classAttr.setState({points: json})});
	}
	getGeofences(){
		var classAttr = this;
                fetch(API_LOCATION_GET_GEOFENCES)
                        .then(function(response) {return response.json()})
                        .then(function(json) {classAttr.setState({geofences: json})});
	}
	setOptimisticMarker(value) {
		this.setState({optimisticMarker: value});
	}
	showGeofenceForm(value){
		 this.setState(prevState => ({
                        geofence_open: !prevState.geofence_open
                     }));
		if(value.type == 'create') {
			this.setState({
				geofenceFormData: {
					type: value.type,
					option: value.option,
					lat: value.latlong[0],
					long: value.latlong[1],
					radius: 0 
				}
			});
		}
		else if(value.type == 'edit') {
			var map = this.GeoMaps.map;	
			map.leafletElement.eachLayer(function (layer) { 
				if('_latlng' in layer){
					var latlng = layer._latlng;
					var latLng = [latlng.lat, latlng.lng];	
					if(value.latlong[0] == latLng[0] && value.latlong[1] == latLng[1]){
						console.log("Add the logic here to get the layer ");
						console.log(map);
						console.log(marker);
					}
				} 
			});

		} 
		else if(value.type == 'close') {
			var data = this.state.geofenceFormData;	
			var option = value.option;
			this.setState({
                                 geofenceFormData: {
                                         type: value.type,
                                         option: option,
					 lat: data.lat,
					 long: data.long,
                                         radius: 0
					}
                                 });
			var output = this.state.geofenceFormData;
			this.GeoMaps.removeMarker(output);	
		}
	}
	render() {
		var geofence_open = this.state.geofence_open;
		return (
			<div>	
				<GeoMaps
					ref={GeoMaps => this.GeoMaps = GeoMaps}
					showGeofenceForm={this.showGeofenceForm}
					points={this.state.points}
					geofences={this.state.geofences}
					optimisticMarker={this.state.optimisticMarker}
					setOptimisticMarker={this.setOptimisticMarker}
					open={geofence_open}
				/>
				<Divider/>
				<GeoPointsTable 
					showGeofenceForm={this.showGeofenceForm}
					points={this.state.points}
				/>
				<GeofenceForm
					open={geofence_open}
					showGeofenceForm={this.showGeofenceForm}
					optimisticMarker={this.state.optimisticMarker}
					data={this.state.geofenceFormData}
				/>
			</div>
		);
	}
}


export default Geofence;
