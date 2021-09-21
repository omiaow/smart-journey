/* Problem to solve - disable trip button when data is empty in the begginning of searching | hint: change data in parent component */

import React from 'react';
import {withRouter} from 'react-router-dom';
import '../../styles/result.css';

import RenderFlights from './features/RenderFlights';
import RenderTripFilter from './features/RenderTripFilter';

class Result extends React.Component {
  state = { trip: false }

  // always hide trips feature if data is not enough
  componentDidMount(){
    this.setState({trip: false});
  }

  componentDidUpdate(){
    if(this.state.query !== this.props.location.search && this.props.location.search.length > 0){
      this.setState({trip: false, query: this.props.location.search});
    }
  }

  // to recognize if data was collected enough, from props.switchTrip
  isTripAvailable = (available) => {
    if(!available){
      this.setState({trip: false});
    }else if(available && !this.props.switchTrip){
      this.setState({trip: true});
    }
  }

  render(){
    return(
      <div className="result" id="result">

        {/* Header side of result component to choose features */}
        <div className="header">
          <button style={(!this.state.trip)?
                           ({backgroundColor: "#34495E", color: "#ffffff"}):
                           ({backgroundColor: "#ffffff", color: "#34495E"})}
                  onClick={() => this.isTripAvailable(false)}>flights</button>
          <button style={(this.props.switchTrip)?
                           ({backgroundColor: "#ffffff", border: "1px solid #E5E7E9", color: "#E5E7E9"}):
                           ((this.state.trip)?
                              ({backgroundColor: "#34495E", color: "#ffffff"}):
                              ({backgroundColor: "#ffffff", color: "#34495E"}))}
                  onClick={() => this.isTripAvailable(true)}>trips</button>
        </div>

        {/* features */}
        {(!this.state.trip) ?
            <RenderFlights data={this.props.data} myLocation={this.props.myLocation} fromDate={this.props.fromDate}/> :
            <RenderTripFilter data={this.props.data} myLocation={this.props.myLocation} fromDate={this.props.fromDate}/>}
      </div>
    );
  }

}

export default withRouter(Result);
