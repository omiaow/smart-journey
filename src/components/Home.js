import React from 'react';
import "../styles/introduction.css";

import SearchTool from './search/SearchTool';

function Home() {
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
    </>
  );
}

export default Home;
