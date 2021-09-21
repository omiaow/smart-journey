
/* Problem to solve - stop fetching after changing query */

import { headers, api } from './api-key.js';
import {generateTicket} from './generateTicket';
import {regionalData} from '../utils/state';

/* ----- CALL TICKETS ----- */
// main call tickets funtion
export async function ticketsCall(data, update){
  if(data.from.length === data.to.length && data.to.length === data.date.length && data.date.length === data.direct.length){
    for(let i=0; i<data.from.length; i++){
      const result = await fetch(`${api}/${regionalData.country.code}/${regionalData.currency.code}/en-US/${data.from[i]}-sky/${data.to[i]}-sky/${data.date[i]}`, {
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

      const flight = await result.json();

      if(flight.errors === undefined){
        let tickets = generateTicket(flight);
        let j = 0;
        while(j<tickets.length && `${tickets[j].direct}` !== `${data.direct[i]}`) j++;
        if(j<tickets.length) update(tickets[j]);
      }
    }
  }
}
