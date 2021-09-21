
// rebuilds the SkyScanner API result to ticket list

export function generateTicket(flights, locId, firstDay, lastDay){
  let flightList = [];

  flights.Quotes.forEach(item => {
    let flightDate = item.OutboundLeg.DepartureDate.split('T')[0];
    let givenDate = new Date(flightDate);
    if(((firstDay !== undefined && lastDay !== undefined) &&
       firstDay.getTime() <= givenDate.getTime() && givenDate.getTime() <= lastDay.getTime()) ||
       (firstDay === undefined && lastDay === undefined)){
      let ticket = { price: item.MinPrice, direct: item.Direct};
      ticket.airline = getAirline(flights.Carriers, item.OutboundLeg.CarrierIds);
      ticket.origin = getLocation(flights.Places, item.OutboundLeg.OriginId);
      ticket.destination = getLocation(flights.Places, item.OutboundLeg.DestinationId, locId);
      ticket.date = flightDate;
      ticket.url = `https://www.skyscanner.hu/transport/flights/${ticket.origin.iata}/${ticket.destination.iata}/${flightDate.substring(2, 4) + flightDate.substring(5, 7) + flightDate.substring(8, 10)}/?adults=1&adultsv2=1&cabinclass=economy&children=0&childrenv2=&destinationentityid=27539438&inboundaltsenabled=false&infants=0&originentityid=27541717&outboundaltsenabled=false&preferdirects=false&preferflexible=false&ref=home&rtn=0`;
      flightList.push(ticket);
    }
  });

  function getAirline(airlines, ids){
    let result = [];
    ids.forEach( i => {
      airlines.forEach( j => {
        if(j.CarrierId === i){
          result.push(j.Name);
        }
      });
    });
    return result;
  }

  function getLocation(places, id, locId){
    for(let i=0; i<places.length; i++){
      if(places[i].PlaceId === id){
        return {airportName: places[i].Name, iata: places[i].IataCode, country: places[i].CountryName, city: places[i].CityName, id: locId};
      }
    }
    return undefined;
  }

  return flightList;
}
