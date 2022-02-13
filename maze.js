import { distance2 } from './generics.js';

export const mazeSize = 5;
export const goalX = mazeSize - 1;
export const goalY = mazeSize - 1;

export function distanceToGoalCoors({posX, posY}, {goalX, goalY}){
  return Math.sqrt(Math.sqrt(distance2([posX, posY], [goalX, goalY])));
}

export function distanceToGoalIndex(index){
  let i,j;
  ({i,j} = indexToCoors(index));
  return (goalX, goalY) => distanceToGoalCoors({posX: i, posY: j}, {goalX, goalY});
}


export let mazeFunc = () => (  
  () => {
    let mazeList = initializeQuadraticMazeCellList(mazeSize);
    const startx = 0;
    const starty = 0;
    const goalx = mazeSize-1;
    const goaly = mazeSize-1;
    return{
      list: mazeList,
      startx: startx,
      starty: starty,
      goalx: goalx,
      goaly: goaly,
      size: mazeSize,
      distanceStateToGoal: (index) => distanceToGoalIndex(index)(goalx, goaly)
    };} 
)();

let mazeCell = (posX, posY, index, neighbours) => (
  (_posX, _posY, _index, _neighbours) => {
    let isVisited = false;
    let index = _index;
    let x = posX;
    let y = posY;
    // _neighbours = [ {i: index in array, wall: bool }, ...] 
    let neighbours = _neighbours; 

    let getRealNeighbours = () => {return neighbours.filter(el => el.getIndex() !== undefined);};
    return {
      visit: () => {isVisited = true; return this;},

      isVisited: () => {return isVisited},
      getIndex: () => {return index},
      getPos: () => {return {x:x, y:y}},
      getNeighbours: () => {return neighbours;},
      getRealNeighbours: getRealNeighbours,
      getVisitableNeighbours: () => {return getRealNeighbours().filter(neighbour => !neighbour.getIsWall());},
      addNeighbour: (_neighbour) => {neighbours.push(_neighbour)},
      removeWallToNeighbour: (i) => {neighbours.filter((el) => el.getIndex() === i).forEach((el) => el.removeWall())},
    }
  }
)(posX, posY, index, neighbours);

export function indexToCoors(index, sidelength=mazeSize){
  let mod = index % sidelength;

  return {i : (index - mod)/sidelength, j: mod};
};

function coorsToIndex(i, j, sidelength=mazeSize){
  return i*sidelength + j;
};

let neighbour = (index, relPos, isWall=true) => (
  (_index, _relPos, _isWall) => {
    let index = _index;
    let isWall = _isWall; 
    let relPos = _relPos;
    return {
      getIndex: () => {return index;},
      getIsWall: () => {return isWall;},
      getRelPos: () => {return relPos;},

      removeWall: () => {isWall = false; return `Wall removed from neighbour ${index}`}
    }
  }
)(index, relPos, isWall);

function getQuadraticNeighbours(i, j, sidelength){
  let neighbours = [];
  if (i > 0)
    neighbours.push(neighbour(coorsToIndex(i-1,j,sidelength), 'W'));
  if (j > 0)
    neighbours.push(neighbour(coorsToIndex(i,j-1,sidelength), 'N'));
  if (j < sidelength-1)
    neighbours.push(neighbour(coorsToIndex(i,j+1,sidelength), 'S'));
  if (i < sidelength-1)
    neighbours.push(neighbour(coorsToIndex(i+1,j,sidelength), 'E'));
  
  return neighbours;
}

function addStartandEnd(neighbours){
    neighbours.push(neighbour(undefined, 'W', false));
}

export function initializeQuadraticMazeCellList(sidelength){
  let mazeCellList = [];
  
  for (let i=0; i<sidelength; ++i) {
    for (let j=0; j<sidelength; ++j) {
      let neighbours = getQuadraticNeighbours(i, j, sidelength);
      let index = coorsToIndex(i, j, sidelength)
      mazeCellList[index] = mazeCell(i, j, index, neighbours);
    }
  }
  mazeCellList[0].addNeighbour(neighbour(undefined, 'W', false));
  mazeCellList[mazeCellList.length-1].addNeighbour(neighbour(undefined, 'E', false));
  return mazeCellList;
}


export function movingStates(index, {dx, dy}){
  let i,j;
  ({i,j} = indexToCoors(index));

  return coorsToIndex(i+dx, j+dy);

}


export function prettyPrintCell(cell){
  console.log(`x: ${cell.getPos().x}, y: ${cell.getPos().y}, isVisited: ${cell.isVisited()}`);
  console.log(`Neighbours: `);
  cell.getNeighbours().forEach( (el) => console.log(`neighbourIndex: ${el.getIndex()}, wall: ${el.getIsWall()}`));
  console.log(`------------------------------------------------`);
}

//  maze.forEach(el => prettyPrintCell(el));


export function generateWhiteCoordinatesForQuadraticCell(cell){
  let neighbours = cell.getNeighbours().filter( el => !el.getIsWall());
  let lines = [];

  neighbours.forEach( (el) => {
    switch (el.getRelPos()){
      case 'N':
        lines.push({startx: cell.getPos().x,
                    starty: cell.getPos().y,
                    endx: cell.getPos().x+1,
                    endy: cell.getPos().y});
        break;
      case 'W': 
        lines.push({startx: cell.getPos().x,
                    starty: cell.getPos().y,
                    endx: cell.getPos().x,
                    endy: cell.getPos().y+1});
        break;
      case 'E': 
        lines.push({startx: cell.getPos().x+1,
                    starty: cell.getPos().y,
                    endx: cell.getPos().x+1,
                    endy: cell.getPos().y+1});
        break;
      case 'S':
        lines.push({startx: cell.getPos().x,
                    starty: cell.getPos().y+1,
                    endx: cell.getPos().x+1,
                    endy: cell.getPos().y+1});
        break;

    }
  });
  

  return lines;
}
