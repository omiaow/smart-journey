import React from 'react';
import {withRouter} from 'react-router-dom';
import {monthNames, shortWeekNames, shortMonthNames} from '../../../utils/state';

class Calendar extends React.Component {

  state = {
    firstMonth: new Date(),
    secondMonth: new Date(new Date().getFullYear(), new Date().getMonth() + 1),
    fromDate: undefined,
    toDate: undefined,
    toAnyDate: undefined,
    fromDateString: "From when?",
    toDateString: "To when?",
    fromDateInput: "",
    toDateInput: "",
    toAnyDateInput: "",
    url: ""
  }

  // update input by url
  componentDidMount(){
    this.changeData();
  }

  componentDidUpdate(){
    this.changeData();
  }

  changeData(){
    if (this.state.url !== window.location.search){
      const queryString = require('query-string');
      const parsed = queryString.parse(window.location.search);
      if (parsed.fromDate !== undefined && parsed.toDate !== undefined){
        const fromDate = new Date(parsed.fromDate);
        const toDate = new Date(parsed.toDate);
        this.setState({
          url: window.location.search,
          fromDateString: `${fromDate.getDate()} ${shortMonthNames[fromDate.getMonth()]}, ${fromDate.getFullYear()}`,
          toDateString: `${toDate.getDate()} ${shortMonthNames[toDate.getMonth()]}, ${toDate.getFullYear()}`,
          fromDateInput: parsed.fromDate,
          toDateInput: parsed.toDate,
          fromDate: new Date(parsed.fromDate),
          toDate: new Date(parsed.toDate),
        });
      }
    }
  }

  // action after pressing date
  pressDate = (date) => {
    if (this.state.fromDate === undefined) {
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let dayDifference = (lastDay.getTime() - date.getTime()) / (1000 * 3600 * 24);
      lastDay = (dayDifference < 5) ? new Date(lastDay.getFullYear(), lastDay.getMonth() + 2, 0) : lastDay;
      let inputDate = new Date(date);
      inputDate.setDate(inputDate.getDate() + 1);
      let inputLastDate = new Date(lastDay);
      inputLastDate.setDate(inputLastDate.getDate() + 1);

      this.setState({
        fromDate: date,
        toAnyDate: lastDay,
        fromDateString: `${shortWeekNames[date.getDay()]}, ${date.getDate()}-${shortMonthNames[date.getMonth()]}`,
        toDateString: "To any",
        fromDateInput: inputDate.toISOString().slice(0, 10),
        toAnyDateInput: inputLastDate.toISOString().slice(0, 10)
      });
    } else if (date.getDate() === this.state.fromDate.getDate() && date.getMonth() === this.state.fromDate.getMonth() && date.getFullYear() === this.state.fromDate.getFullYear()) {
      this.setState({
        fromDate: undefined,
        toDate: undefined,
        toAnyDate: undefined,
        fromDateString: "From when?",
        toDateString: "To when?",
        fromDateInput: "",
        toDateInput: "",
        toAnyDateInput: ""
      });
    } else if (date < this.state.fromDate) {
      let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let dayDifference = (lastDay.getTime() - date.getTime()) / (1000 * 3600 * 24);
      lastDay = (dayDifference < 5) ? new Date(lastDay.getFullYear(), lastDay.getMonth() + 2, 0) : lastDay;
      let inputDate = new Date(date);
      inputDate.setDate(inputDate.getDate() + 1);
      let inputLastDate = new Date(lastDay);
      inputLastDate.setDate(inputLastDate.getDate() + 1);

      this.setState({
        fromDate: date,
        toAnyDate: lastDay,
        fromDateString: `${shortWeekNames[date.getDay()]}, ${date.getDate()}-${shortMonthNames[date.getMonth()]}`,
        toDateString: "To any",
        fromDateInput: inputDate.toISOString().slice(0, 10),
        toAnyDateInput: inputLastDate.toISOString().slice(0, 10)
      });
    } else if (date > this.state.fromDate) {
      let inputToDate = new Date(date);
      inputToDate.setDate(inputToDate.getDate() + 1);

      this.setState({
        toDate: date,
        toDateString: `${shortWeekNames[date.getDay()]}, ${date.getDate()}-${shortMonthNames[date.getMonth()]}`,
        toDateInput: inputToDate.toISOString().slice(0, 10),
        toAnyDate: undefined,
        toAnyDateInput: ""
      });
    }
  }

  // creating date dom with some criteria
  createDay(name, key, date){
    let newDate = new Date(date);
    if (name === "empty") {
      return (<div className="empty" key={key} />);
    } else if (name === "days") {
      return (<div className="days" key={key} onClick={() => this.pressDate(newDate)}> {newDate.getDate()} </div>);
    } else if (name === "selected") {
      return (<div className="selected" key={key} onClick={() => this.pressDate(newDate)}> {newDate.getDate()} </div>);
    } else {
      return (<div className={name} key={key} > {newDate.getDate()} </div>);
    }
  }

  // create month of given date
  createMonth(givenDate, i){
    let days = [];
    let firstDay = new Date(givenDate.getFullYear(), givenDate.getMonth(), 1);

    for (let i=0; i<getWeekDay(firstDay); i++) {
      days.push(this.createDay("empty", i));
    }

    function getWeekDay(date){
      let day = date.getDay();
      if (day === 0) day = 7;
      return day - 1;
    }

    let currentDate = new Date();
    let lastDay = new Date(firstDay);
    lastDay.setMonth(lastDay.getMonth() + 1);

    while (firstDay < lastDay) {
      if (firstDay.getDate() === currentDate.getDate() && firstDay.getMonth() === currentDate.getMonth() && firstDay.getFullYear() === currentDate.getFullYear()) {
        days.push(this.createDay("today", firstDay, firstDay));
      } else if (firstDay.getTime() < currentDate.getTime()) {
        days.push(this.createDay("passed", firstDay, firstDay));
      } else if (this.state.fromDate !== undefined && this.state.fromDate.getDate() === firstDay.getDate() && this.state.fromDate.getMonth() === firstDay.getMonth() && this.state.fromDate.getFullYear() === firstDay.getFullYear()) {
        days.push(this.createDay("selected", firstDay, firstDay));
      } else if (this.state.toDate !== undefined && this.state.toDate.getDate() === firstDay.getDate() && this.state.toDate.getMonth() === firstDay.getMonth() && this.state.toDate.getFullYear() === firstDay.getFullYear()) {
        days.push(this.createDay("selected", firstDay, firstDay));
      } else if (this.state.fromDate !== undefined && this.state.toDate !== undefined && firstDay > this.state.fromDate && firstDay < this.state.toDate) {
        days.push(this.createDay("selected", firstDay, firstDay));
      } else {
        days.push(this.createDay("days", firstDay, firstDay));
      }
      firstDay.setDate(firstDay.getDate() + 1);
    }

    return (
      <div key={i}>
        <div className="month-name">{monthNames[givenDate.getMonth()]}</div>
        <div className="dates">{days}</div>
      </div>
    );
  }

  // creating month input window
  window(){
    var weekNames = (
      <div className="week-names">
        <div className="weekdays">Mo</div>
        <div className="weekdays">Tu</div>
        <div className="weekdays">We</div>
        <div className="weekdays">Th</div>
        <div className="weekdays">Fr</div>
        <div className="weekends">Sa</div>
        <div className="weekends">Su</div>
      </div>
    );

    let date = new Date();
    let calendar = [];
    for (let i=0; i<5; i++) {
      calendar.push(this.createMonth(date, i));
      date.setMonth(date.getMonth() + 1);
    }

    return (
      <div className="input">
        <div className="exit" onClick={ () => this.props.changeInput() } >+</div>
        <div className="input-name">Vacation dates</div>
        {weekNames}
        <div className="month-box">{calendar}</div>
        <input type="submit" value="search" onClick={() => {
          this.props.changeInput();
          this.props.search(this.props.history);
        }}/>
      </div>
    );
  }

  render(){
    return (
      <>
        <div className="date" onClick={() => this.props.changeInput("calendarInput")}>
          <h2 data-testid="h2">dates</h2>
          <p data-testid="p">{`${this.state.fromDateString} - ${this.state.toDateString}`}</p>

          <input data-testid="fromDate" type="hidden" id="fromDate" name="fromDate" value={this.state.fromDateInput}/>
          <input data-testid="toDate" type="hidden" id="toDate" name="toDate" value={(this.state.toDate !== undefined) ? this.state.toDateInput : this.state.toAnyDateInput}/>
        </div>
        
        {(this.props.displayInput) ? (this.window()) : ("")}
      </>
    );
  }

}

export default withRouter(Calendar);
