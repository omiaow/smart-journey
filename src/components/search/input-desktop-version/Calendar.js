import React from 'react';
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
    displayCalendar: false,
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
    if (this.state.url !== window.location.search) {
      const queryString = require('query-string');
      const parsed = queryString.parse(window.location.search);

      if (parsed.fromDate !== undefined && parsed.toDate !== undefined) {
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

  // move left to see previous month
  moveLeft = () => {
    this.state.firstMonth.setMonth(this.state.firstMonth.getMonth() - 1);
    this.state.secondMonth.setMonth(this.state.secondMonth.getMonth() - 1);

    this.setState({
      firstMonth: this.state.firstMonth,
      secondMonth: this.state.secondMonth
    });
  }

  // move right to see next month
  moveRight = () => {
    this.state.firstMonth.setMonth(this.state.firstMonth.getMonth() + 1);
    this.state.secondMonth.setMonth(this.state.secondMonth.getMonth() + 1);

    this.setState({
      firstMonth: this.state.firstMonth,
      secondMonth: this.state.secondMonth
    });
  }

  // select date from and to date
  selectDates = (date, mouseOver) => {
    if(this.state.fromDate != null){

      let className = mouseOver ? "selected" : "days";
      let currentFromDate = new Date(this.state.fromDate.getFullYear(), this.state.fromDate.getMonth(), this.state.fromDate.getDate() + 1);
      var currentToDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-1);

      while (currentFromDate.getTime() <= currentToDate.getTime()) {
        try{
          document.getElementById(currentFromDate.getDate() + "-" + currentFromDate.getMonth() + "-" + currentFromDate.getFullYear()).className = className;
          currentFromDate = new Date(currentFromDate.getFullYear(), currentFromDate.getMonth(), currentFromDate.getDate() + 1);
        }catch(e){
          currentFromDate = new Date(currentFromDate.getFullYear(), currentFromDate.getMonth(), currentFromDate.getDate() + 1);
        };
      }

    }
  }

  // when date was pressed
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
        displayCalendar: false,
        fromDate: date,
        fromDateString: `${shortWeekNames[date.getDay()]}, ${date.getDate()}-${shortMonthNames[date.getMonth()]}`,
        toAnyDate: lastDay,
        toDateString: "To any",
        fromDateInput: inputDate.toISOString().slice(0, 10),
        toAnyDateInput: inputLastDate.toISOString().slice(0, 10)
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
        displayCalendar: false,
        fromDate: date,
        fromDateString: `${shortWeekNames[date.getDay()]}, ${date.getDate()}-${shortMonthNames[date.getMonth()]}`,
        toAnyDate: lastDay,
        toDateString: "To any",
        fromDateInput: inputDate.toISOString().slice(0, 10),
        toAnyDateInput: inputLastDate.toISOString().slice(0, 10)
      });

    } else if (date.getDate() === this.state.fromDate.getDate() && date.getMonth() === this.state.fromDate.getMonth()) {

      this.setState({
        displayCalendar: true,
        fromDate: undefined,
        fromDateString: "From when?",
        toDate: undefined,
        toDateString: "To when?",
        toAnyDate: undefined
      });

    } else if (date.getTime() > this.state.fromDate.getTime()) {

      let inputToDate = new Date(date);
      inputToDate.setDate(inputToDate.getDate() + 1);

      this.setState({
        displayCalendar: false,
        toDate: date,
        toDateString: `${shortWeekNames[date.getDay()]}, ${date.getDate()}-${shortMonthNames[date.getMonth()]}`,
        toDateInput: inputToDate.toISOString().slice(0, 10)
      });

    }
  }

  // create calendar date, detecting some criteria
  createDay(name, key, date){
    let newDate = new Date(date);

    if (name === "empty") {
      return (<div className="empty" key={key} />);
    } else if (name === "days") {
      return (<div className="days" key={key}
                   onClick={() => this.pressDate(newDate)}
                   onMouseOver={() => this.selectDates(newDate, true)}
                   onMouseOut={() => this.selectDates(newDate, false)}
                   id={newDate.getDate() + "-" + newDate.getMonth() + "-" + newDate.getFullYear()}> {newDate.getDate()} </div>);
    } else if (name === "selected") {
      return (<div className="selected" key={key} onClick={() => this.pressDate(newDate)}> {newDate.getDate()} </div>);
    } else {
      return (<div className={name} key={key} > {newDate.getDate()} </div>);
    }
  }

  // generating calendar dom
  generateCalendar(givenDate){
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
        days.push(this.createDay("past", firstDay, firstDay));
      } else if (this.state.fromDate !== undefined && this.state.fromDate.getDate() === firstDay.getDate() && this.state.fromDate.getMonth() === firstDay.getMonth() && this.state.fromDate.getFullYear() === firstDay.getFullYear()) {
        days.push(this.createDay("selected", firstDay, firstDay));
      } else {
        days.push(this.createDay("days", firstDay, firstDay));
      }
      firstDay.setDate(firstDay.getDate() + 1);
    }

    return days;
  }

  // creating calendar window
  window(){
    if (this.state.displayCalendar) {

      var header = (
        <div className="calendar-header">
          <div className="calendar_name">your vacation date</div>
          <div className="left" onClick={() => {this.moveLeft()}} />
          <div className="month-description">
            <p className="left-side">{monthNames[this.state.firstMonth.getMonth()] + " " + this.state.firstMonth.getFullYear()}</p>
            <p className="right-side">{monthNames[this.state.secondMonth.getMonth()] + " " + this.state.secondMonth.getFullYear()}</p>
          </div>
          <div className="right" onClick={() => {this.moveRight()}} />
        </div>
      );

      var weekNames = (
        <div  className="week-names"><b>
          <div className="weekdays">Mo</div>
          <div className="weekdays">Tu</div>
          <div className="weekdays">We</div>
          <div className="weekdays">Th</div>
          <div className="weekdays">Fr</div>
          <div className="weekends">Sa</div>
          <div className="weekends">Su</div>
        </b></div>
      );

      var body = (
        <div className="two-month">
          <div className="left-month">
            {weekNames}
            <div className="left_month_days">
              {this.generateCalendar(this.state.firstMonth)}
            </div>
          </div>
          <div className="right-month">
            {weekNames}
            <div className="right_month_days">
              {this.generateCalendar(this.state.secondMonth)}
            </div>
          </div>
        </div>
      );

      return <div className="calendar-window">{header}{body}</div>;

    } else return <div/>;
  }

  render(){
    return (
      <div className="dates">

        <h4>dates</h4>
        {/* dates button */}
        <div id="inputDate" onClick={() => {
          if (this.state.toDate !== undefined && !this.state.displayCalendar) {
            this.setState({
              displayCalendar: !this.state.displayCalendar,
              fromDate: undefined,
              toDate: undefined,
              toAnyDate: undefined,
              fromDateString: "From when?",
              toDateString: "To when?"
            });
          } else {
            this.setState({
              displayCalendar: !this.state.displayCalendar
            });
          }
        }}> {this.state.fromDateString} - {this.state.toDateString} </div>

        {this.window()}

        <input type="hidden" id="fromDate" name="fromDate" value={this.state.fromDateInput}/>
        <input type="hidden" id="toDate" name="toDate" value={(this.state.toDate !== undefined) ? this.state.toDateInput : this.state.toAnyDateInput}/>

      </div>
    );
  }

}

export default Calendar;
