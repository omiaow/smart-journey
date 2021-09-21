import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './styles/App.css';
import skyscanner from './styles/images/skyscanner.png';

// pages
import Home from './components/Home';
import Search from './components/Search';
import Tickets from './components/Tickets';
import Error from './components/Error';
import NotFound from './components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="wrapper">

          {/* divide to pages with react router dom */}
          <main>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/search" component={Search}/>
            <Route path="/tickets" component={Tickets}/>
            <Route path="/error" component={Error}/>
            <Route path='*' exact={true} component={NotFound}/>
          </Switch>
          </main>

          {/* footer part */}
          <footer>
            <img src={skyscanner} alt="skyscanner"/>
            <span>
              <a href="mailto:omurzak.keldibek@gmail.com" target="_newtab">Email</a>, <a href="https://github.com/omiaow" target="_newtab">Github</a>
            </span>
            <span>&copy; 2021 SmartJourney - Flight Search web application</span>
          </footer>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
