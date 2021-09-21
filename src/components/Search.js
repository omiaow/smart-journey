import React from 'react';
import {withRouter} from 'react-router-dom';

import SearchTool from './search/SearchTool';
import Result from './result/Result';

import {flightsCall} from '../api/flightsCall';
import {regionalData} from '../utils/state';

class Search extends React.Component {

  state = {
    data: [],
    query: "",
    total: 0,
    loading: 0
  }

  // update query
  componentDidMount(){
    console.log(this.props.location);
    this.findFlights(this.props.location.search);
  }

  componentDidUpdate(){
    this.findFlights(this.props.location.search);
  }

  // running flightsCall function to collect flights
  findFlights(query){
    if(this.state.query !== query && query.length > 0){

      const queryString = require('query-string');
      const parsed = queryString.parse(query);

      if(parsed.Origin !== undefined && parsed.Destinations !== undefined && parsed.fromDate !== undefined && parsed.toDate !== undefined &&
        parsed.countryCode !== undefined && parsed.currencyCode !== undefined && parsed.countryTitle !== undefined && parsed.currencyTitle !== undefined){

        const origin = parsed.Origin.split(' ')[0];
        const destResult = parsed.Destinations.split(' ');
        const destinations = destResult.slice(0, destResult.length-1);
        const fromDate = parsed.fromDate;
        const toDate = parsed.toDate;

        regionalData.country.code = parsed.countryCode;
        regionalData.country.title = parsed.countryTitle;
        regionalData.currency.code = parsed.currencyCode;
        regionalData.currency.title = parsed.currencyTitle;

        this.setState({ query: query, data: [], myLocation: origin, fromDate: new Date(fromDate) });

        flightsCall({fromDate: fromDate, toDate: toDate, origin: origin, destinations: destinations}, (total, loading, data) => {
          if(data !== undefined){
            this.setState({total: total, loading: loading, data: data});
          }else{
            this.setState({total: total, loading: loading});
          }
        });
      }
    }
  }

  render(){
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
             style={{width: `${(100*this.state.loading)/this.state.total}%`,
                     backgroundColor: ((this.state.total !== this.state.loading) ? '#FF8B8B' : '#7EC9A1')}}/>

        {/* use Result's features */}
        <Result data={this.state.data}
               myLocation={this.state.myLocation}
               fromDate={this.state.fromDate}
               switchTrip={(this.state.total !== this.state.loading)}/>
      </>
    );
  }

}

export default withRouter(Search);
