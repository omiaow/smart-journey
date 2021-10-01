import React from 'react';
import countries from '../../../data/countries.json';
import currencies from '../../../data/currencies.json';
import {regionalData} from '../../../utils/state.js';
import '../../../styles/local-data.css';

class LocalData extends React.Component {

  state = {
    display: false,
    country: false,
    currency: false,
    regionalData: {
      country: {code: countries[0].code, title: countries[0].title},
      currency: {code: currencies[0].code, title: currencies[0].title}
    }
  }

  // listing countries
  renderCountries(list){
    let options = [];

    list.forEach((item, i) => {
      options.push(<div key={i} className="option" onClick={() => {
        let newRegionalData = {...this.state.regionalData};
        newRegionalData.country.code = item.code;
        newRegionalData.country.title = item.title;
        this.setState({regionalData: this.state.regionalData});
      }}>{item.code} - {item.title}</div>);
    });

    return <div className="dropdown">{options}</div>;
  }

  // listing currencies
  renderCurrencies(list){
    let options = [];

    list.forEach((item, i) => {
      options.push(<div key={i} className="option" onClick={() => {
        let newRegionalData = {...this.state.regionalData};
        newRegionalData.currency.code = item.code;
        newRegionalData.currency.title = item.title;
        this.setState({regionalData: this.state.regionalData});
      }}>{item.code} - {item.title}</div>);
    });

    return <div className="dropdown">{options}</div>;
  }

  render(){
    return <>
      <div className="local-data" onClick={() => this.setState({display: true})}
      style={(window.innerWidth > 999) ? {width: '17%'} : {width: '45%', marginLeft: '5%'}}>{regionalData.country.code}, {regionalData.currency.code} {regionalData.currency.title}</div>
      {(this.state.display) ?
        <div className="local-data-input">
          <div className="tool" style={(window.innerWidth > 999) ? {
            marginTop: '120px',
            width: '400px',
            height: '280px'
          } : {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px'
          }}>

            <div className="input-name">Regional settings</div>
            <span className="exit" onClick={() => this.setState({display: false, country: false, currency: false})}>+</span>

            {/* countries */}
            <span className="title">Country</span>
            <div className="options" onClick={() => (this.state.country) ? this.setState({country: false}) : this.setState({country: true, currency: false})}>
              <span className="option-name">{this.state.regionalData.country.code} - {this.state.regionalData.country.title}</span>
              {(this.state.country) ? this.renderCountries(countries) : ""}
            </div>

            {/* currencies */}
            <span className="title">Currency</span>
            <div className="options" onClick={() => (this.state.currency) ? this.setState({currency: false}) : this.setState({currency: true, country: false})}>
              <span className="option-name">{this.state.regionalData.currency.code} - {this.state.regionalData.currency.title}</span>
              {(this.state.currency) ? this.renderCurrencies(currencies) : ""}
            </div>

            {/* save button */}
            <button className="save" onClick={() => {
              regionalData.country.code = this.state.regionalData.country.code;
              regionalData.country.title = this.state.regionalData.country.title;
              regionalData.currency.code = this.state.regionalData.currency.code;
              regionalData.currency.title = this.state.regionalData.currency.title;
              localStorage.setItem("RegionalData", JSON.stringify(regionalData));
              this.setState({display: false, country: false, currency: false});
            }}>save</button>

          </div>
      </div> : ""}
      <input type="hidden" id="localCountry" value={regionalData.country.code}/>
      <input type="hidden" id="localCurrency" value={regionalData.currency.code}/>
    </>;
  }
}

export default LocalData;
