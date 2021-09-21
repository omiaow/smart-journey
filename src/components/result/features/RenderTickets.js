import React from 'react';
import { FacebookMessengerShareButton, WhatsappShareButton, TelegramShareButton } from 'react-share';
import { FacebookMessengerIcon, WhatsappIcon, TelegramIcon } from 'react-share';
import '../../../styles/render-tickets.css';

import {shortMonthNames, regionalData} from '../../../utils/state';

class Tickets extends React.Component {

  /* using "window.innerWidth" to set the style for individual device */

  state = {
    ticketWidth: 250
  }

  // moving functions
  moveRight(){
    document.querySelector('#ticketScreen').scrollLeft += 400;
  }

  moveLeft(){
    document.querySelector('#ticketScreen').scrollLeft -= 400;
  }

  // detecting and showing price
  renderPrice(){
    if(this.props.tickets !== undefined && this.props.tickets.length > 0 && `${this.props.tickets[this.props.tickets.length-1].destination.id}` !== `${this.props.initialLocation}`){
      return "Ticket details";
    }else if(this.props.total !== undefined){
      return `Total: ${this.props.total} ${regionalData.currency.title}`;
    }else return "";
  }

  render(){
    let tickets = [];
    let shareURL = `${window.location.origin}/tickets?`;

    // generate list of tickets dom
    if(this.props.tickets !== undefined){
      this.props.tickets.forEach((item, i) => {

        const date = new Date(item.date);

        shareURL += `from=${item.origin.iata}&to=${item.destination.iata}&date=${date.toISOString().slice(0, 10)}&direct=${item.direct}&`;

        tickets.push(
          <div className="ticket" key={i}>
            {(this.props.removeTicket !== undefined) ?
               (<div className="close" onClick={this.props.removeTicket.bind(null, i)}>+</div>) :
               ("")}

            <div className="border" /*onClick={ () => window.open(item.url, "_blank") }*/>
              <div className="description">from:</div>
                <div className="data-words">{ item.origin.city } ({ item.origin.iata })</div>
              <div className="description">to:</div>
                <div className="data-words">{ item.destination.city } ({ item.destination.iata })</div>
              <div className="description">date:</div>
                <div className="data-words">{ date.getDate() } { shortMonthNames[date.getMonth()] }, { date.getFullYear() }</div>
              <div className="description">direct:</div>
                <div className="data-words">{ (item.direct) ? ("Yes") : ("No") }</div>
              <div className="description">price:</div>
                <div className="price">{ item.price } {regionalData.currency.title}</div>
                <div className="company">{ item.airline }</div>
            </div>
          </div>
        );
      });
    }

    shareURL += window.location.search.slice(1, window.location.search.length);

    return (
      <div className="ticket-borders">
        <div className="tickets">

          <h3>{ this.renderPrice() }</h3>

          {/* swipe left */}
          {(window.innerWidth > 999 && this.props.tickets !== undefined && (this.props.width*90/100) < (this.props.tickets.length*this.state.ticketWidth)) ?
             (<div className="tickets-left-button" onClick={() => this.moveLeft()}/>) :
             ("")}


           {/* display tickets */}
          <div className="ticket-screen" id="ticketScreen"
               style={((this.props.tickets !== undefined && (this.props.width*90/100) >= (this.props.tickets.length*this.state.ticketWidth)) ?
                        ((window.innerWidth > 999) ? {width: 'calc(100% - 80px)', marginLeft: '40px', marginRight: '40px'} : {width: '100%'}) :
                        ((window.innerWidth > 999) ? {width: 'calc(100% - 80px)'} : {width: '100%'}))}>

            {tickets}

          </div>

          {/* swipe right */}
          {(window.innerWidth > 999 && this.props.tickets !== undefined && (this.props.width*90/100) < (this.props.tickets.length*this.state.ticketWidth)) ?
             (<div className="tickets-right-button" onClick={() => this.moveRight()}/>) :
             ("")}

          {/* share tickets part */}
          <div className="share"
               style={((this.props.tickets !== undefined && (this.props.width*90/100) >= (this.props.tickets.length*this.state.ticketWidth)) ?
                        ((window.innerWidth > 999) ? {width: 'calc(100% - 110px)', marginLeft: '55px', marginRight: '55px'} : {width: '100%'}) :
                        {width: '100%'})}>
            <span>Share:</span>
            <div className="button">
              <WhatsappShareButton url={shareURL}>
                <WhatsappIcon size={30} round={true}/>
              </WhatsappShareButton>
            </div>
            <div className="button">
              <FacebookMessengerShareButton url={shareURL}>
                <FacebookMessengerIcon size={30} round={true}/>
              </FacebookMessengerShareButton>
            </div>
            <div className="button">
              <TelegramShareButton url={shareURL}>
                <TelegramIcon size={30} round={true}/>
              </TelegramShareButton>
            </div>
          </div>

        </div>
      </div>
    );

  }

}

export default Tickets;
