import React from 'react';
import '../styles/announcement.css';

function NotFound() {

  return(
    <div className="announcement">
      <h1>Something went wrong, please try it later!</h1>
      <a href={window.location.origin}>Back to main page</a>
    </div>
  );
}

export default NotFound;
