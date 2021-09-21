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
            <p>You can search flights for multiple cities specifying just your vacation dates.</p>
          </div>
          <div className="section">
            <h2>Create your trip</h2>
            <p>Select destinations and dates, and create trip by looking all possible options.</p>
          </div>
          <div className="section">
            <h2>Find your trip</h2>
            <p>Find trip by fast searching function, which shows the cheapest possible trip.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
