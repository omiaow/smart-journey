import React from 'react';
import {withRouter} from 'react-router-dom';

import NotFound from './NotFound';
import SearchTool from './search/SearchTool';
import RenderTickets from './result/features/RenderTickets';

import {ticketsCall} from '../api/ticketsCall';
import {regionalData} from '../utils/state';

class Tickets extends React.Component {

  state = {
    total: 0,
    tickets: [],
    locations: []
  }

  // update data adding new result of api call
  update = (data) => {
    this.state.tickets.push(data);
    let total = this.state.total + data.price;
    this.setState({tickets: this.state.tickets, total: total});
  }

  // running flightsCall function to collect tickets
  componentDidMount(){
    let query = this.props.location.search;
    const queryString = require('query-string');
    const parsed = queryString.parse(query);

    if(parsed.countryCode !== undefined && parsed.currencyCode !== undefined && parsed.countryTitle !== undefined && parsed.currencyTitle !== undefined &&
       parsed.from !== undefined && parsed.to !== undefined && parsed.date !== undefined && new Date().getTime() < new Date(parsed.date[0]) &&
       parsed.Origin !== undefined && parsed.Destinations !== undefined && parsed.fromDate !== undefined && parsed.toDate !== undefined){

         regionalData.country.code = parsed.countryCode;
         regionalData.country.title = parsed.countryTitle;
         regionalData.currency.code = parsed.currencyCode;
         regionalData.currency.title = parsed.currencyTitle;

         ticketsCall(parsed, this.update);

         this.setState({locations: parsed.from});
    }
  }

  render(){
   console.log(this.state.tickets);
    return (
      <>
        {/* searching form */}
        <div className="search-panel" style={{minHeight: window.innerHeight/3}}>
          <div className="header" style={{height: '25px'}}></div>
          <h1><a href={window.location.origin}>SmartJourney</a></h1>
          <SearchTool/>
        </div>

        {/* loading indicator */}
        <div className="loading"
             style={{width: `${(100*this.state.tickets.length)/this.state.locations.length}%`,
                     backgroundColor: ((this.state.tickets.length !== this.state.locations.length) ? '#FF8B8B' : '#7EC9A1')}}/>

        {/* result of shared tickets */}
        <div className="result" id="result">
          {(this.state.tickets.length > 0) ?
              <RenderTickets tickets={this.state.tickets} total={this.state.total} width={window.innerWidth*(96/100)} /> :
              <NotFound/>}
        </div>
      </>
    );
  }
}

export default withRouter(Tickets);
