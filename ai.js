
import { argmax, quantize, initializeMultiDimArray } from './generics.js';
import { indexToCoors } from './maze.js';

const randomActionProbability = 1;
const learningRate = .3;
const gamma = .9;

const actionSpace = ['N', 'E', 'S', 'W'];

function directionToMovement(direction){
  let dx=0, dy=0;
  
  switch (direction){
    case 'N': dy = -1; break;
    case 'E': dx =  1; break;
    case 'S': dy =  1; break;
    case 'W': dx = -1; break;
  }
  return {dx: dx, dy:dy}
}

function updateChance(p){
  if (p <= 0.01) 
    return 0.01;
  return p -= 0.0001;
}

export let Qtable = (maze) => (  
  (_maze) => {
    let table = initializeQTable(_maze.list);
    let chanceForRandom = randomActionProbability;
    let update = (oldScore, newScore, state, actionIndex, newState) => {
      table[state][actionIndex].score 
        = (1-learningRate)*table[state][actionIndex].score
            + learningRate*(newScore - oldScore + gamma*Math.max(...table[newState].map(el => el.score)))
    }
    let QactionIndex = (state) => argmax(table[state].map(el => el.score));
    let bestDirections = (state) => {
      let max = Math.max(...table[state].map(el => el.score));
      return table[state].filter( el => el.score === max).map( el => el.pos);
    }
    let randomActionIndex = (state) => {
      let neighbours = _maze.list[state].getVisitableNeighbours();
      //return relPos[quantize(0, 0, neighbours.length, neighbours.length)];
      return quantize(Math.random(), 0, 1, neighbours.length);
    }
    let getActionIndex = state => {
      if (Math.random() < chanceForRandom)
      {
        chanceForRandom = updateChance(chanceForRandom);
        return randomActionIndex(state)
      }
      return QactionIndex(state);
    };

    let getActionDirection = (state, index) => {
      return  _maze.list[state].getVisitableNeighbours()[index].getRelPos();
    }
    let getActionChange = (action) => directionToMovement(action);
    return {
      getAction: (state) =>{
        let index = getActionIndex(state);
        let direction = getActionDirection(state, index);
        let change = getActionChange(direction);
        
        return {actionIndex: index, actionDirection: direction, actionChange: change}
      },
      bestDirections: bestDirections,
      update: update,
      table: () => {return table;},
      randomActionProbability: randomActionProbability
    };
  }
)(maze);

export function initializeQTable(mlist){
  let Qtable = initializeMultiDimArray([mlist.length]);
  mlist.forEach(cell => Qtable[cell.getIndex()] = []);

  let cell = mlist[0].getRealNeighbours();
  let n;
  
  for (let i= 0; i< 2; i++)
    n = cell[i].getRelPos();

  mlist.forEach( cell => 
    cell.getVisitableNeighbours()
        .forEach( (neighbour) => Qtable[cell.getIndex()]
                                .push({'pos':neighbour.getRelPos(), 'score': 0}))
  );
  
  return Qtable;
}
