import React, { Component } from 'react';
import pickBy from 'lodash/pickBy';

import './App.css';
import Map from './container/Map';
import Intro from './container/Intro';

const BLOCKWIDTH = 5;
const INPUT_STRING = 'R2, L1, R2, R1, R1, L3, R3, L5, L5, L2, L1, R4, R1, R3, L5, L5, R3, L4, L4, R5, R4, R3, L1, L2, R5, R4, L2, R1, R4, R4, L2, L1, L1, R190, R3, L4, R52, R5, R3, L5, R3, R2, R1, L5, L5, L4, R2, L3, R3, L1, L3, R5, L3, L4, R3, R77, R3, L2, R189, R4, R2, L2, R2, L1, R5, R4, R4, R2, L2, L2, L5, L1, R1, R2, L3, L4, L5, R1, L1, L2, L2, R2, L3, R3, L4, L1, L5, L4, L4, R3, R5, L2, R4, R5, R3, L2, L2, L4, L2, R2, L5, L4, R3, R1, L2, R2, R4, L1, L4, L4, L2, R2, L4, L1, L1, R4, L1, L3, L2, L2, L5, R5, R2, R5, L1, L5, R2, R4, R4, L2, R5, L5, R5, R5, L4, R2, R1, R1, R3, L3, L3, L4, L3, L2, L2, L2, R2, L1, L3, R2, R5, R5, L4, R3, L3, L4, R2, L5, R5';

class App extends Component {
  constructor() {
    super();
    
    this.state = {
      mapData: null,
      realDest: {}
    }
  }
  
  componentDidMount() {    
    const mapData = this.getMapData();
    
    this.setState({
      mapData,
      realDest: this.findFirstDuplicatedPath(mapData)
    })
  }
  
  getCanvasWidth() {
    const mapData = this.state.mapData;
    
    return mapData ? (mapData.maxX - mapData.minX + 1) * BLOCKWIDTH : 0;
  }
  
  getEasyDirection(prevDirection, curDirection) {    
    const lookUpDirection = {
      'UP-R': 'RIGHT',
      'UP-L': 'LEFT',
      'DOWN-R': 'LEFT',
      'DOWN-L': 'RIGHT',
      'LEFT-R': 'UP',
      'LEFT-L': 'DOWN',
      'RIGHT-R': 'DOWN',
      'RIGHT-L': 'UP'
    };
    
    return lookUpDirection[`${prevDirection}-${curDirection}`];
  }
  
  updateNewCoord(prevCoord, curDirection, numMoves) {
    const lookUpDirection = {
      'UP-Y': -numMoves,
      'DOWN-Y': numMoves,
      'LEFT-X': -numMoves,
      'RIGHT-X': numMoves
    };
    
    const coordX = prevCoord.coordX + (lookUpDirection[`${curDirection}-X`] || 0);
    const coordY = prevCoord.coordY + (lookUpDirection[`${curDirection}-Y`] || 0);
    
    return {
      coordX,
      coordY
    }
  }
  
  updateNewPath(prevCoord, curDirection, numMoves) {  
    const lookUp = {
      'UP': [0,-1],
      'DOWN': [0,1],
      'LEFT': [-1,0],
      'RIGHT': [1,0]
    };
    
    return Array(numMoves).fill().reduce((oldPath, newPath, index) => {  
      return oldPath.concat({
        coordX: prevCoord.coordX + lookUp[curDirection][0] * (index + 1),
        coordY: prevCoord.coordY + lookUp[curDirection][1] * (index + 1)
      })
    }, []);
  }
  
  updateNewMove(prevMoveData, curDirection, numMoves) {
    let destX = prevMoveData.destX;
    let destY = prevMoveData.destY;
    let minX = prevMoveData.minX;
    let minY = prevMoveData.minY;
    let maxX = prevMoveData.maxX;
    let maxY = prevMoveData.maxY;
    
    if (curDirection === 'UP') {
      destY = destY - numMoves;
      if (destY < minY) minY = destY;
    } else if (curDirection === 'DOWN') {
      destY = destY + numMoves;
      if (destY > maxY) maxY = destY;
    } else if (curDirection === 'LEFT') {
      destX = destX - numMoves;
      if (destX < minX) minX = destX;
    } else if (curDirection === 'RIGHT') {
      destX = destX + numMoves;
      if (destX > maxX) maxX = destX;
    } else {
      console.error('Wrong direction');
    }
    
    return {
      destX,
      destY,
      minX,
      minY,
      maxX,
      maxY
    }
  }
  
  findFirstDuplicatedPath(mapData) {
    const coordList = mapData.path.map((item, index) => {
      return JSON.stringify(item);      
    });
      
    const counts = coordList.reduce((oldData, newData) => {
        oldData[newData] = (oldData[newData] || 0) + 1;
        
        return oldData;
    }, {});
    
    const keys = pickBy(counts, (value) => {
      return value > 1;
    });
        
    return JSON.parse(Object.keys(keys)[0]);
  }
  
  getMapData() {
    const inputArray = INPUT_STRING.replace(/\s/g, '').split(',');
    
    let initData = {
      destX: 0,
      destY: 0,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      path: [],
      curDirection: 'UP',
      curCoord: {
        coordX: 0,
        coordY: 0
      }
    };
  
    return inputArray.reduce((oldData, newMove, index) => {      
      const numMoves = parseInt(newMove.split(/ /)[0].replace(/[^\d]/g, ''));
      const curDirection = newMove.replace(numMoves,'');
      const easyDirection = this.getEasyDirection(oldData.curDirection, curDirection);
      
      const newMoveData = this.updateNewMove(oldData, easyDirection, numMoves);
      const newPath = this.updateNewPath(oldData.curCoord, easyDirection, numMoves);
    
      const newCoord = this.updateNewCoord(oldData.curCoord, easyDirection, numMoves);
            
      return {
        destX: newMoveData.destX,
        destY: newMoveData.destY,
        minX: newMoveData.minX,
        minY: newMoveData.minY,
        maxX: newMoveData.maxX,
        maxY: newMoveData.maxY,
        curDirection: easyDirection,
        path: oldData.path.concat(newPath), 
        curCoord: newCoord
      }      
    }, initData);
    
  }
  
  render() {
    const canvasWidth = this.getCanvasWidth();
    const style = {
      width: canvasWidth
    }
    
    return (
      <div className="main">
        <Intro 
          inputString={INPUT_STRING} 
          mapData={this.state.mapData}
          realDest={this.state.realDest} />
        <h3>[MAP]</h3>
        <div className="container" style={style}>
          <Map 
            mapData={this.state.mapData} 
            blockWidth={BLOCKWIDTH}
            realDest={this.state.realDest} />
        </div>
      </div>
    );
  }
}

export default App;
