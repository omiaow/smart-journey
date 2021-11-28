import React from 'react';
import TSForm from 'thoughts-storage-form';
import "../styles/introduction.css";

import SearchTool from './search/SearchTool';

function Home() {
  let jsonForm = {
    "_id": "61a27bf283a65ea167bba3c8",
    "name": "Feedback",
    "listOfForms": [
      {
        "isImportant": false,
        "name": "radio",
        "title": "How would you rate your experience?",
        "options": [
          {
            "isTrue": false,
            "title": "Excellent"
          },
          {
            "isTrue": false,
            "title": "Good"
          },
          {
            "isTrue": false,
            "title": "Normal"
          },
          {
            "isTrue": false,
            "title": "Bad"
          },
          {
            "isTrue": false,
            "title": "Worst"
          }
        ]
      },
      {
        "isImportant": false,
        "name": "paragraph",
        "title": "Tell us about your experience:",
        "text": ""
      },
      {
        "isImportant": false,
        "name": "radio",
        "title": "Do you wanna use this website in the future?",
        "options": [
          {
            "isTrue": false,
            "title": "Yes"
          },
          {
            "isTrue": false,
            "title": "No"
          }
        ]
      }
    ]
  }

  return (
    <>
      {/* searching form */}
      <div className="search-panel" style={{height: window.innerHeight}}>
        <div className="header" style={{height: window.innerHeight/4}}></div>
        <h1>Your Next Trip</h1>
        <SearchTool/>
      </div>

      {/* introduction side */}
      <div className="introduction">
        <div className="textplace">
          <div className="section">
            <h2>Multi-city searching</h2>
            <p>Search flights for multiple cities specifying just destinations and vacation dates.</p>
          </div>
          <div className="section">
            <h2>Create trip</h2>
            <p>Generate a trip by selecting a flight from the search results and see the total cost.</p>
          </div>
          <div className="section">
            <h2>Find trip</h2>
            <p>Select city(s) and number of nights you plan to stay for and find the cheapest trip.</p>
          </div>
        </div>
      </div>

      <TSForm form={jsonForm}/>
    </>
  );
}

export default Home;
