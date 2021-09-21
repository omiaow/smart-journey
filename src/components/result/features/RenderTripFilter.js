import React from 'react';
import '../../../styles/render-trip-filter.css';

import RenderTripList from './RenderTripList';

import airports from '../../../data/airports.json';
import { searchEngine } from '../../../utils/state';

class Result extends React.Component {

  // define state, otherwise undefine
  componentDidMount(){
    if(this.props.data !== undefined && this.props.data.length !== 0 && this.props.myLocation !== undefined){
      let state = {
        fromDate: this.props.data[0].day,
        toDate: this.props.data[this.props.data.length-1].day,
        filter: [],
        myLocation: this.props.myLocation,
        trips: [],
        direct: false,
        sort: true
      }

      const interval = this.props.data.length-1;

      this.props.data[0].flights.forEach( (flight, j) => {
        if(`${flight.origin}` !== `${this.props.myLocation}`){
          let city = {selected: false, nights: 1, name: undefined, id: flight.origin};
          if(state.filter.length < interval) city.selected = true;
          let i=0;
          while(i<airports.length && `${airports[i].id}` !== `${flight.origin}`) i++;
          if(i<airports.length) city.name = airports[i].loc;
          state.filter.push(city);
        }
      });

      this.setState(state);
    }
  }

  // update state
  componentDidUpdate(){
    if(this.state.trips.length === 0){
      setTimeout(() => {
        const result = searchEngine(this.state.myLocation, this.props.data, this.state.filter, this.state.direct, this.state.sort);
        if(result.length > 0) this.setState({trips: result});
        else this.setState({trips: [{error: true}]});
      }, 0);
    }
  }

  // gemerate filter tool
  filterPanel(filter){
    let cities = [];

    // generating filter by chosen cities
    for(let i=0; i<filter.length; i++){
      cities.push(
        <div className="city-tool" key={i}>
          <label className="container">
            <span className="word">{ filter[i].name }</span>
            <input type="checkbox" checked={filter[i].selected}
              onChange={() => {
                  filter[i].selected = !filter[i].selected;
                  this.setState({filter: filter, selectedTicket: undefined, specialTickets: false, trips: []});
              }}/>
            <span className="checkmark"></span>
          </label>
          <div className="nights">
            <span>nights</span><br/>
            <input type="number" value={ filter[i].nights }
              onChange={(e) => {
                if(e.target.value !== '' && e.target.value > 0){
                  filter[i].nights = parseInt(e.target.value);
                  this.setState({filter: filter, lastChosen: e.target.value, selectedTicket: undefined, specialTickets: false, trips: []});
                }else if(e.target.value === ''){
                  filter[i].nights = e.target.value;
                  this.setState({filter: filter, selectedTicket: undefined, specialTickets: false, trips: []});
                }
              }}
              onFocus={() => {
                let lastChosen = filter[i].nights;
                filter[i].nights = '';
                this.setState({filter: filter, lastChosen: lastChosen, selectedTicket: undefined, specialTickets: false});
              }}
              onBlur={() => {
                filter[i].nights = parseInt(this.state.lastChosen);
                this.setState({filter: filter, selectedTicket: undefined, specialTickets: false});
              }}/>
          </div>
        </div>
      );
    }

    return (
      <div className="right-pannel" style={{width: ((window.innerWidth > 999) ? ('25%') : ('96%'))}}>
        <h3>Create trip</h3>
        {cities}

        {/* rest buttons of filter panel */}
        <button className="only-direct"
          style={(this.state.direct) ? {backgroundColor: "#ffffff", color: "#34495E"} : {backgroundColor: "#34495E", color: "#ffffff"}}
          onClick={() => this.setState({direct: !this.state.direct, trips: []})}
        >{(this.state.direct) ? "all tickets" : "only direct tickets"}</button>

        <h4>Sort by</h4>
        <button className="by-price"
          style={(this.state.sort) ? {backgroundColor: "#34495E", color: "#ffffff"} : {backgroundColor: "#ffffff", color: "#34495E"}}
          onClick={() => this.setState({sort: true, trips: []})}
        >price</button>
        <button className="by-date"
          style={(!this.state.sort) ? {backgroundColor: "#34495E", color: "#ffffff"} : {backgroundColor: "#ffffff", color: "#34495E"}}
          onClick={() => this.setState({sort: false, trips: []})}
        >date</button>

      </div>
    );
  }

  render(){
    if(this.state != null){
      return(
        <>
          { this.filterPanel(this.state.filter) }
          <RenderTripList trips={this.state.trips} myLocation={this.state.myLocation}/>
        </>
      );
    }else return <></>;
  }
}

export default Result;
