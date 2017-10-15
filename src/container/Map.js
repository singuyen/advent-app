import React, { Component } from 'react';
import find from 'lodash/find';

class Map extends Component {
  isDestination(mapData, colIndex, rowIndex) {
    return (mapData.destX + Math.abs(mapData.minX) === colIndex) && (mapData.destY + Math.abs(mapData.minY) === rowIndex);
  }
  
  isStart(mapData, colIndex, rowIndex) {
    return (Math.abs(mapData.minX) === colIndex) && (Math.abs(mapData.minY) === rowIndex);
  }
  
  isPath(mapData, colIndex, rowIndex) {    
    return find(mapData.path, {
      coordX: colIndex + mapData.minX,
      coordY: rowIndex + mapData.minY
    })
  }
  
  isRealDest(mapData, colIndex, rowIndex) {
    const realDest = this.props.realDest;
        
    return (realDest.coordX + Math.abs(mapData.minX) === colIndex && realDest.coordY + Math.abs(mapData.minY) === rowIndex);
  }
  
  getCorrectColor(mapData, rowIndex, colIndex) {
    let backgroundColor = '#CCC'
    
    if (this.isDestination(mapData, colIndex, rowIndex)) {
      backgroundColor = 'yellow';
    } else if (this.isStart(mapData, colIndex, rowIndex)) {
      backgroundColor = '#000';
    } else if (this.isPath(mapData, colIndex, rowIndex) && !this.isRealDest(mapData, colIndex, rowIndex)) {
      backgroundColor = 'green';
    } else if (this.isRealDest(mapData, colIndex, rowIndex)) {
      backgroundColor = 'red';
    }
    
    return backgroundColor
  }
  
  renderMap() {
    const mapData = this.props.mapData;

    const numRows = mapData.maxY - mapData.minY + 1;
    const numCols = mapData.maxX - mapData.minX + 1;
        
    return Array(numRows).fill().map((row, rowIndex) => {
      return Array(numCols).fill().map((col, colIndex) => {
        const keyValue = rowIndex * numCols + colIndex;
        
        const backgroundColor = this.getCorrectColor(mapData, rowIndex, colIndex);
        
        const style = {
          position: 'absolute',
          left: colIndex * this.props.blockWidth,
          top: rowIndex * this.props.blockWidth,
          width: this.props.blockWidth,
          height: this.props.blockWidth,
          backgroundColor: backgroundColor,
          border: '1px solid #FFF'
        }

        return (
            <div key={keyValue} style={style}></div>
        )
      })
    })
  }
  
  render() {
    const renderMap = this.props.mapData ? this.renderMap() : null;
  
    return (
      <div>
        {renderMap}
      </div>
    )
  }
}

Map.propTypes = {
  // Skip this  
}

export default Map;
