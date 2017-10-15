import React, { Component } from 'react';

class Intro extends Component {
  renderResult() {
      const mapData = this.props.mapData;
      
      const awayFromDestination = mapData.destY + mapData.destX;
      const awayFromHQ = this.props.realDest.coordX + this.props.realDest.coordY;
      
      return(
        <div className="result-container">
          <ul>
            <li>[BLACK] block is where I'm airdropped, face North.</li>
            <li>[RED] block is first location I visit twice </li>
            <li>[YELLOW] block is Easter Bunny HQ (Puzzle 1)</li>
            <li>----</li>
            <li>Puzzle 1: Easter Bunny HQ is <strong>{awayFromDestination} blocks</strong> away (Yellow)</li>
            <li>Puzzle 2: First location I visit twice <strong>{awayFromHQ} blocks</strong> away (red)</li>
          </ul>
          <h3>Solution</h3>
          <ul className="result-container">
            <li>
              <h5>Create mapData</h5>
              <small>It's important that I need to turn the inputString into the data that I can use to calculate.</small>
              <p>"It's a lot easier if I can just move UP, DOWN, LEFT, RIGHT instead of just L/R".</p> 
              <p>"I need to capture my every single move in <strong>path</strong>"</p>
              <p>"I know how big my Map is after I captured <strong>minX, minY, maxY, maxY</strong>"</p>
            </li>
            <li>
              <h5>Draw the map</h5>
              <small>The map provided all the information I needed</small>
              <p>"I can calculate how many block aways"</p>
              <p>"I can calculate my first location I visit twice."</p>
            </li>
          </ul>
        </div>
      )
  }
  
  render() {
    const renderResult = this.props.mapData ? this.renderResult() : null;
    
    return (
      <div>
        <h1>Advent of Code - Day 1</h1>
        <div className="sub-heading">{this.props.inputString}</div>
        {renderResult}
      </div>
    )
  }
}

export default Intro;