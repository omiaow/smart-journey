import React from 'react';
import '../styles/announcement.css';

function NotFound() {

  return(
    <div className="announcement">
      <h1>Sorry, Your Request Not Found!</h1>
      <a href={window.location.origin}>Back to main page</a>
    </div>
  );
}

export default NotFound;
