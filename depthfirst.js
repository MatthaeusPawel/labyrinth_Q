import { getRandomNumber } from './generics.js';


function getRandomNeighbour(maze, neighbours){
  let relevantNeighbours = getUnvisitedNeighbours(maze, neighbours);
  let releventNeighboursCount = relevantNeighbours.length;
  
  if (!releventNeighboursCount)
    return null;
 
  return relevantNeighbours[getRandomNumber(0,releventNeighboursCount-1)];
}

export function depthSearchInit(maze){
  let startingCell = maze[0];
  let toDoList = [startingCell];

  depthSearch(maze, toDoList)
}

function getUnvisitedNeighbours(maze, neighbours){
  return neighbours.map((el) => maze[el.getIndex()])
                   .filter((el) => !el.isVisited())
}

function depthSearch(maze, toDoList){
  while (toDoList.length){
    let cell = toDoList[toDoList.length-1];
    let neighbour = getRandomNeighbour(maze, cell.getRealNeighbours());

    cell.visit(); 
    if (neighbour == null)
      toDoList.pop();
    else {
      toDoList.push(neighbour);
      cell.removeWallToNeighbour(neighbour.getIndex());
      neighbour.removeWallToNeighbour(cell.getIndex());
    }
  }

}