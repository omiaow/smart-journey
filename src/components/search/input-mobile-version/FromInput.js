import React from 'react';

import CityList from '../../../data/airports.json';
import {fromInput} from '../../../utils/state';

class AutocompleteFrom extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      value: "",
      autocompleteLength: 7,
      locs: [],
      url: ""
    };
  }

  // update by localStorage
  componentDidMount(){
    this.setState({locs: fromInput.value});
  }

  // update by url query
  componentDidUpdate(){
    if(this.state.url !== window.location.search){
      this.setState({locs: fromInput.value, url: window.location.search});
    }
  }

  // choosing option
  choose = (newLocs) => {
    fromInput.value = [newLocs];
    localStorage.setItem("Origin", JSON.stringify([newLocs]));
    this.setState({locs: [newLocs]});
    this.props.changeInput("toInput");
  }

  // finding options
  autocomplete(){

    function check_substring(given_str, checking_str){
      var splitted = given_str.split(" ");
      var return_check_substring = true;
      for(var i=0; i<splitted.length; i++){
        if(!(checking_str.toUpperCase().includes(splitted[i].toUpperCase()))){
          return_check_substring = false;
        }
      }
      return return_check_substring;
    }

    let list = [];
    if(this.state.value.length > 0){
      var j=0;
      for(var i=0; i<CityList.length; i++){
        if(check_substring(this.state.value, CityList[i].loc) && j < this.state.autocompleteLength){
          let city = CityList[i].loc;
          if(city.includes("&#039;")){
            city = (`${city.slice(0, city.indexOf("&#039;"))}'${city.slice((city.indexOf("&#039;")+6), city.length)}`);
          }
            list.push(<div className="autocomplete-tag" key={j} onClick={this.choose.bind(null, CityList[i])}> {city} </div>);
          j++;
        }else if(j >= this.state.autocompleteLength){
          i=CityList.length;
        }
      }
    }

    let returnValue = (<div className="autocomplete"> {list} </div>);
    return returnValue;

  }

  render(){

    return(
      <>
        <div className="from" onClick={() => this.props.changeInput("fromInput")}>
          <h2 data-testid="h2">from</h2>
          <p data-testid="p">{(this.state.locs.length > 0) ? (this.state.locs[0].loc) : ("From where? (city, countries)")}</p>
          <input type="hidden" id="Origin" name="Origin" value={(this.state.locs.length > 0) ? this.state.locs[0].id : ""}/>
        </div>

        {(this.props.displayInput) ? (
          <div className="input">
            <div data-testid="exit" className="exit" onClick={ () => {this.setState({value: ""}); this.props.changeInput()} } >+</div>
            <div data-testid="inputName" className="input-name">Origin</div>
            <input data-testid="fromInput"
                   className="from-input"
                   autoComplete="nope"
                   type="text"
                   placeholder={(this.state.locs.length > 0) ? (this.state.locs[0].loc) : ("city, countries")}
                   onChange={(e) => this.setState({value: e.target.value})}
                   value={this.state.value}
                   autoFocus/>
            {this.autocomplete()}
          </div>) : ("")
        }
      </>
    );
  }

}

export default AutocompleteFrom;
