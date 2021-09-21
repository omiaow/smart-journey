
/* Problem to solve - stop fetching after changing query */

import { headers, api } from './api-key.js';
import {generateTicket} from './generateTicket';
import {regionalData, sortPrices} from '../utils/state';
import airports from '../data/airports.json';

/* ----- CALL FLIGHTS ----- */
// main call flights funtion
export async function flightsCall(data, update){

  // defining the dates
  let from = new Date(data.fromDate.slice(0, 7));
  let till = new Date(data.toDate.slice(0, 7));

  // defining all locations
  let allId = [...data.destinations];
  allId.unshift(data.origin);
  let locations = [];
  let locationTicketList = [];
  allId.forEach( id => {
    let identificationNumber = parseInt(id);
    locationTicketList.push({origin: identificationNumber, tickets: []});
    let i=0;
    while(i<airports.length && airports[i].id !== identificationNumber) i++;
    if(i<airports.length) locations.push({id: identificationNumber, sky: airports[i].air});
  });

  // creating flight data list "Tree"
  let days = [];
  let currentDate = new Date(data.fromDate.slice(0, 10));
  let lastDate = new Date(data.toDate.slice(0, 10));
  while(currentDate.getTime() <= lastDate.getTime()){
    days.push({day: currentDate.toISOString().split('T')[0], flights: JSON.parse(JSON.stringify(locationTicketList))});
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // defining loading indicator data
  var months;
  months = (till.getFullYear() - from.getFullYear()) * 12;
  months -= from.getMonth();
  months += till.getMonth();
  months = months <= 0 ? 1 : months+1;
  const total = months * locations.length * (locations.length-1);
  let loader = 0;

  // looping from given month
  while (from.getTime() <= till.getTime()) {
    let departure = from.toISOString().split('T')[0].slice(0, 7);

    // looping from given locations
    for(let i=0; i<locations.length; i++){
      for(let j=0; j<locations.length; j++){
        if(i !== j){

          // api calling
          const result = await fetch(`${api}/${regionalData.country.code}/${regionalData.currency.code}/en-US/${locations[i].sky}-sky/${locations[j].sky}-sky/${departure}`, {
            "method": "GET",
            "headers": headers
          })
          .catch(err => {
            console.log(err);
          });

          if(result === undefined) window.location.replace(`${window.location.origin}/error`);
          if(result.status === 400 || result.status === 401 ||
             result.status === 403 || result.status === 404 ||
             result.status === 500 || result.status === 502 ||
             result.status === 503) window.location.replace(`${window.location.origin}/error`);

          // receiving the data
          const resultJson = await result.json();

          // converting to ticket list
          let ticketList = [];
          if(resultJson.errors === undefined && resultJson.code === undefined){
            ticketList = generateTicket(resultJson, locations[j].id, new Date(data.fromDate.slice(0, 10)), new Date(data.toDate.slice(0, 10)));
          }

          // inserting to flight data list "Tree"
          for(let m=0; m<ticketList.length; m++){
            let o=0;
            while(o < days.length && days[o].day !== ticketList[m].date) o++;
            if(o < days.length){
              let p=0;
              while(p < days[o].flights.length && days[o].flights[p].origin !== locations[i].id) p++;
              if(p < days[o].flights.length){
                days[o].flights[p].tickets.push(ticketList[m]);
                days[o].flights[p].tickets = sortPrices(days[o].flights[p].tickets);
              }
            }
          }

          // updating the data
          loader += 1;
          update(total, loader, days);
        }
      }
    }

    from.setMonth(from.getMonth() + 1);
  }

}
