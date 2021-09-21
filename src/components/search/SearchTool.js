import React from 'react';
import '../../styles/search-tool.css';
import {withRouter} from 'react-router-dom';

import DesktopFromInput from './input-desktop-version/FromInput';
import DesktopToInput from './input-desktop-version/ToInput';
import DesktopCalendar from './input-desktop-version/Calendar';
import MobileFromInput from './input-mobile-version/FromInput';
import MobileToInput from './input-mobile-version/ToInput';
import MobileCalendar from './input-mobile-version/Calendar';
import LocalData from './local-data/LocalData';

import {regionalData} from '../../utils/state.js';

class SearchTool extends React.Component {

  state = {
    displayFromInput: false,
    displayToInput: false,
    displayCalendarInput: false
  }

  // function need only for mobile version to swith the inputs
  changeInput = (name) => {
    if(name === "fromInput") this.setState({displayFromInput: true, displayToInput: false, displayCalendarInput: false});
    else if(name === "toInput") this.setState({displayFromInput: false, displayToInput: true, displayCalendarInput: false});
    else if(name === "calendarInput") this.setState({displayFromInput: false, displayToInput: false, displayCalendarInput: true});
    else this.setState({displayFromInput: false, displayToInput: false, displayCalendarInput: false});
  }

  // when search button activates
  search(history){
    let origin = document.querySelector('#Origin').value;
    let destinations = document.querySelector('#Destinations').value;
    let fromDate = document.querySelector('#fromDate').value;
    let toDate = document.querySelector('#toDate').value;
    let errorMessage = "";

    function checkLocations(orig, dest){
      let o = orig.split('+')[0];
      let d = dest.split('+');
      for(let i=0; i<d.length-1; i++){
        if(d[i] === o) return true;
      }
      return false;
    }

    try{
      if(origin.length > 0 && checkLocations(origin, destinations)) errorMessage = "Selected from and to the same city.";
      else if(origin.length === 0 || destinations.length === 0 || fromDate.length === 0 || toDate.length === 0) errorMessage = "Please, fill the form to search.";
    }catch(e){
      errorMessage = "Please, fill the form to search.";
    }

    if(errorMessage.length > 0){
      document.querySelector('#errorMessage').style.backgroundColor = '#FF8B8B';
      document.querySelector('#errorMessage').innerHTML = errorMessage;
      setTimeout(() => {
        try{
          document.querySelector('#errorMessage').style.backgroundColor = '#30475e';
          document.querySelector('#errorMessage').innerHTML = "";
        }catch(e){}
      }, 5000);
    }else{
      history.push({
        pathname: '/search',
        search: `?Origin=${origin}&Destinations=${destinations}&fromDate=${fromDate}&toDate=${toDate}&countryCode=${regionalData.country.code}&currencyCode=${regionalData.currency.code}&countryTitle=${regionalData.country.title}&currencyTitle=${regionalData.currency.title}`
      });
    }
  }

  render(){
    return (
      <>
        <div id="errorMessage"></div>
        {(window.innerWidth < 1000) ? (
          // mobile search tool
          <div className="mobile-search">
            <MobileFromInput displayInput={this.state.displayFromInput} changeInput={this.changeInput} />
            <MobileToInput displayInput={this.state.displayToInput} changeInput={this.changeInput} />
            <MobileCalendar displayInput={this.state.displayCalendarInput} changeInput={this.changeInput} search={this.search} />
            <input type="submit" value="search" onClick={() => this.search(this.props.history)}/>
            <LocalData/>
          </div>
        ) : (
          // desktop search tool
          <div className="desktop-search">
            <DesktopFromInput/>
            <DesktopToInput/>
            <DesktopCalendar/>
            <input type="submit" value="search" onClick={() => this.search(this.props.history)}/>
            <LocalData/>
          </div>
        )}
      </>
    );
  }

}

export default withRouter(SearchTool);
