import React from 'react';
import '../../../styles/render-trip-list.css';

import Tickets from './RenderTickets';

import { monthNames, regionalData } from '../../../utils/state';

class Result extends React.Component {

  state = {
    selectedTicket: undefined
  }

  // generate trips dom
  createTripList(item, i, list){

    // create trip name
    function tripName(tickets){
      let name = "";
      for(let i=0; i<tickets.length-1; i++)
        name += `${tickets[i].destination.city} → `;

      return name.slice(0, name.length-3);
    }

    // create trip if it exists
    if(item.error === undefined){
      let fromDate = new Date(item.tickets[0].date);
      let toDate = new Date(item.tickets[item.tickets.length-1].date);

      list.push(
          <div className="trip" key={i}
               style={(i === this.state.selectedTicket) ? ({boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.29), 0 3px 10px 0 rgba(0, 0, 0, 0.29)'}) : (null)}
               onClick={() => {
                 if(i !== this.state.selectedTicket){
                   this.setState({selectedTicket: i});
                 }else{
                   this.setState({selectedTicket: undefined});
                 }
               }}>
            <span>{tripName(item.tickets)}</span>
            <p>{fromDate.getDate()} {monthNames[fromDate.getMonth()]}, {fromDate.getFullYear()} - {toDate.getDate()} {monthNames[toDate.getMonth()]}, {toDate.getFullYear()}</p>
            <span className="price">Total price: {item.price} {regionalData.currency.title}</span>
          </div>
      );

      if(i === this.state.selectedTicket){
        list.push(
          <div className="ticket-details" key={'T'}>
            <Tickets tickets={item.tickets} initialLocation={this.props.myLocation} width={(window.innerWidth*(71/100))*(96/100)}/>
          </div>
        );
      }
    }
  }

  render(){
    let trips = (this.props.trips === undefined) ? [] : this.props.trips;
    let tripList = [];
    trips.forEach( (item, i) => this.createTripList(item, i, tripList) );

    return (
      <div className="trips" style={{width: ((window.innerWidth > 999) ? ('71%') : ('100%'))}}>
        {((tripList.length !== 0) ? <div className="list"><span className="result">Results: {trips.length}</span> {tripList}</div> :
        <h2 className="message">
          {((trips.length !== 0 && trips[0].error !== undefined) ? "No flights for selected options" :
          <div className="loading"><div className="loader"/></div>)}
        </h2>)}
      </div>
    );
  }

}

export default Result;
