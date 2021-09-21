export let regionalData = {currency: {code: "USD", title: "$"}, country: {code: "US", title: "United States"}};

export const weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const shortWeekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

// sorts the lists by price
export function sortPrices(list){
  if (list !== undefined && list.length < 2) return list;
  else if(list === undefined || (list !== undefined && list.length === 0)) return list;

  const pivotID = Math.floor(Math.random() * list.length);
  const pivot = list[pivotID];

  if(pivot === undefined){
    list.splice(pivotID, 1);
    return sortPrices(list);
  }

  let left = [];
  let equal = [];
  let right = [];

  for (let element of list) {
    const exists = (element !== undefined);
    if (exists && element.price > pivot.price) right.push(element);
    else if (exists && element.price < pivot.price) left.push(element);
    else if (exists) equal.push(element);
  }

  return sortPrices(left)
    .concat(equal)
    .concat(sortPrices(right));
}

/* ----- SEARCH ENGINE ----- */
// search engine's helper function finds the cheapest ticket
function findCheapestTicketWithDestination(origin, date, destination, data, directOnly){
  let ticket = undefined;

  let i=0;
  while(i<data.length && new Date(data[i].day).getTime() !== date.getTime()) i++;

  if(i<data.length){
    let j=0;
    while(j<data[i].flights.length && `${data[i].flights[j].origin}` !== `${origin}`) j++;

    if(j<data[i].flights.length){
      data[i].flights[j].tickets.forEach( (item) => {
        if(`${item.destination.id}` === `${destination}` && ticket !== undefined && item.price < ticket.price && (!directOnly || item.direct)) ticket = item;
        else if(`${item.destination.id}` === `${destination}` && ticket === undefined && (!directOnly || item.direct)) ticket = item;
      });
    }
  }

  return ticket;
}

// search engine's helper recursive function to find the chapest cycle
function getCheapestTripOnSelectedDate(origin, finalOrigin, date, cities, data, directOnly){
  if(cities.length > 1){
    let trip = undefined;

    for(let i=0; i<cities.length; i++){
      let first = findCheapestTicketWithDestination(`${origin}`, date, cities[i].id, data, directOnly);

      if(first !== undefined){

        let restCities = cities.filter( (item) => item.id !== cities[i].id );

        let newDate = new Date(date);
        newDate.setDate(newDate.getDate() + cities[i].nights);

        let rest = getCheapestTripOnSelectedDate(`${cities[i].id}`, finalOrigin, newDate, restCities, data, directOnly);

        if(rest !== undefined && trip !== undefined && trip.price > (first.price + rest.price)){
          trip = {price: (first.price + rest.price), tickets: [first, rest.tickets].flat()};
        }else if(rest !== undefined && trip === undefined){
          trip = {price: (first.price + rest.price), tickets: [first, rest.tickets].flat()};
        }
      }
    }

    return trip;
  }else if(cities.length === 1){
    let trip = undefined;

    let first = findCheapestTicketWithDestination(`${origin}`, date, cities[0].id, data, directOnly);

    if(first !== undefined){
      let newDate = new Date(date);
      newDate.setDate(newDate.getDate() + cities[0].nights);

      let last = findCheapestTicketWithDestination(cities[0].id, newDate, finalOrigin, data, directOnly);

      if(last !== undefined){
        trip = {price: (first.price + last.price), tickets: [first, last].flat()};
      }
    }

    return trip;
  }else{
    return undefined;
  }
}

//  search engine's main function
export function searchEngine(origin, data, filter, directOnly, sort){
  let result = [];

  if(origin !== undefined && data !== undefined && filter !== undefined){
    directOnly = (directOnly === undefined) ? false : directOnly;

    let cities = filter.filter( (item) => item.selected && `${item.nights}` !== '0' );

    let dateLong = 0;
    cities.forEach( (item) => dateLong += item.nights );
    let lastDay = new Date(data[0].day);
    lastDay.setDate(lastDay.getDate() + dateLong);

    let date = new Date(data[0].day);

    while(new Date(data[data.length-1].day).getTime() >= lastDay.getTime()){
      let trip = getCheapestTripOnSelectedDate(origin, origin, date, cities, data, directOnly);
      if(trip !== undefined) result.push(trip);
      lastDay.setDate(lastDay.getDate() + 1);
      date.setDate(date.getDate() + 1);
    }
  }

  return (sort !== undefined && sort) ? sortPrices(result) : result;
}
