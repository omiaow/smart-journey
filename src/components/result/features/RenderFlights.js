import React from 'react';
import '../../../styles/render-flights.css';

import Tickets from './RenderTickets';

import {weekNames, monthNames, regionalData, findCity} from '../../../utils/state';

class Flights extends React.Component {

  /* using "window.innerWidth" to set the style for individual device */

  state = {
    daysWidth: 220,
    data: undefined,
    date: undefined,
    location: undefined,
    initialDate: undefined,
    initialLocation: undefined,
    tickets: [],
    total: 0
  }

  // always update data
  componentDidMount(){
    this.update();
  }

  componentDidUpdate(){
    this.update();
  }

  update(){
    const props = (this.props.data !== undefined && this.props.myLocation !== undefined && this.props.fromDate !== undefined);
    if(props && (this.state.data === undefined || this.props.data.length !== this.state.data.length)){
      this.setState({
        data: this.props.data,
        location: this.props.myLocation,
        date: this.props.fromDate,
        initialLocation: this.props.myLocation,
        initialDate: this.props.fromDate
      });
    }
  }

  // moving functions
  moveRight(){
    document.querySelector('#ticketList').scrollLeft += 400;
  }

  moveLeft(){
    document.querySelector('#ticketList').scrollLeft -= 400;
  }

  // choosing ticket
  chooseTicket = (ticket) => {
    this.state.tickets.push(ticket);
    let total = 0;
    this.state.tickets.forEach( i => total += i.price);

    this.setState({tickets: this.state.tickets, location: ticket.destination.id, total: total});
    document.querySelector('#ticketList').scrollTo(0, 0);
  }

  // removing ticket
  removeTicket = (i) => {
    let newList = [];
    let total = 0;

    for(let j=0; j<i; j++){
      newList.push(this.state.tickets[j]);
      total += this.state.tickets[j].price;
    }

    this.setState({tickets: newList, location: ((newList.length>0)?(newList[newList.length-1].destination.id):(this.state.initialLocation)), total: total});
  }

  // render list of flights for each days
  generateFlights(data, origin){
    let result = [];

    // generating list of flights dom
    if(data !== undefined && origin !== undefined){
      for(let i=0; i<data.length; i++){
        let date = new Date(data[i].day);

        if(((origin !== this.state.initialLocation) || (origin === this.state.initialLocation && i !== data.length-1))
            && ((this.state.tickets.length === 0) || (this.state.tickets.length > 0 && date.getTime() > new Date(this.state.tickets[this.state.tickets.length-1].date).getTime()))){

          let tickets = [];
          let j=0;
          while(j<data[i].flights.length && `${data[i].flights[j].origin}` !== `${origin}`) j++;

          if(j<data[i].flights.length){
            data[i].flights[j].tickets.forEach((item, k) => {
              let exist = true;
              this.state.tickets.forEach( check => {
                if(`${check.destination.id}` === `${item.destination.id}`) exist = false;
              });

              if(exist){
                const ticket = (
                  (item.direct) ?
                    <div className="direct-ticket" onClick={ this.chooseTicket.bind(null, item) } key={k}>
                      <div className="city-name">{ item.price } {regionalData.currency.title} { item.destination.city } ({ item.destination.iata })</div>
                    </div> :
                    <div className="nondirect-ticket" onClick={ this.chooseTicket.bind(null, item) } key={k}>
                      <div className="city-name">{ item.price } {regionalData.currency.title} { item.destination.city } ({ item.destination.iata })</div>
                    </div>
                );
                tickets.push(ticket);
              }
            });
          }

          if(tickets.length === 0) tickets.push(<div className="empty" key="0">No flights</div>);

          result.push(
            <div className="daily-list" key={i}>
              <div className="header">
                <div className="day">{ date.getDate() }</div>
                <div className="month-weeks">
                  <div className="month">{ monthNames[ date.getMonth() ] }</div>
                  {(date.getDay() === 6 || date.getDay() === 0) ?
                     <div className="weekend">{ weekNames[ date.getDay() ] }</div> :
                     <div className="weekday">{ weekNames[ date.getDay() ] }</div>}
                </div>
              </div>
              { tickets }
            </div>
          );

        }
      }
    }

    let firstLocation = findCity(this.state.initialLocation);
    let firstLocationName = (firstLocation !== undefined) ? firstLocation.loc.split(',')[0] : "Trip";

    return (
      <>
        {/* description part */}
        <div className="header">
          <h2 className="location">{(this.state.tickets.length > 0) ? this.state.tickets[this.state.tickets.length-1].destination.city : firstLocationName} to</h2>
          {(this.state.total > 0) ?
             <h2 className="total">Total: {this.state.total} {regionalData.currency.title}</h2> : ""}
        </div>

        {/* swipe left */}
        {(window.innerWidth >= 1000 && (window.innerWidth*90/100) < ((result.length)*this.state.daysWidth)) ?
           <div className="flights-left-button" onClick={() => this.moveLeft()}/> : ""}

        {/* flights listing */}
        <div className="ticket-list" id="ticketList"
             style={(window.innerWidth < 1000 || (window.innerWidth*90/100) >= ((result.length) * this.state.daysWidth)) ?
               {width: '90%', marginLeft: '5%', marginRight: '5%'} : {width: '90%'}}>
          {result}
        </div>

        {/* swipe right */}
        {(window.innerWidth >= 1000 && (window.innerWidth*90/100) < ((result.length)*this.state.daysWidth)) ?
           <div className="flights-right-button" onClick={() => this.moveRight()}/> : ""}

        {/* direct, transit color description */}
        <div className="color-description">
          <div className="direct"/><span>direct</span>
          <div className="transit"/><span>transit</span>
        </div>
      </>
    );

  }

  render(){
    return(
      <div className="flights">
        {(this.state.tickets.length > 0) ?
           <Tickets width={window.innerWidth*(96/100)} tickets={this.state.tickets} initialLocation={this.state.initialLocation} total={this.state.total} removeTicket={this.removeTicket} /> : ""}

        {((this.state.tickets.length > 0 && `${this.state.tickets[this.state.tickets.length-1].destination.id}` !== `${this.state.initialLocation}`) || (this.state.tickets.length === 0)) ?
          this.generateFlights(this.state.data, this.state.location) : ""}
      </div>
    );
  }

}

export default Flights;
