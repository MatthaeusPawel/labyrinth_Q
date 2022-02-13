import { indexToCoors } from './maze.js'

export const cellWidth = 50;
export const cellHeight = 50;

export const intrinsicWidth = 1200;
export const intrinsicHeight = 1200;

const offsetHeight = 20;
const offsetWidth = 20;

function scaleX(x){
  return x*cellWidth;
}

function scaleY(y){
  return y*cellHeight;
}

function transformX(x){
  return scaleX(x) + offsetWidth;
}

function transformY(y){
  return scaleY(y) + offsetHeight;
}


function drawRectangularGrid(ctx, a, b){
  for (let i = 0; i < a; ++i)
    for(let j = 0; j < b; ++j)
    {
      let startx = transformX(i);
      let starty = transformY(j);

      ctx.beginPath();
      ctx.rect(startx, starty, scaleX(1), scaleY(1));
      ctx.strokeStyle = 'rgb(0,0,0)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.closePath();
    }
}

export function drawQuadraticGrid(ctx, a){
  drawRectangularGrid(ctx, a, a);
}

export function deleteLine(ctx, {startx, starty, endx, endy}){
  startx = transformX(startx);
  starty = transformY(starty);
  endx = transformX(endx);
  endy = transformY(endy);

  ctx.beginPath();
  ctx.moveTo(startx, starty);
  ctx.lineTo(endx, endy);
  ctx.strokeStyle = 'rgba(255,255,255, 1)';
  ctx.stroke();
  ctx.closePath();
};

export function drawAI(ctx, {index, radius}){
  let i,j;
  ({i, j} = indexToCoors(index));
  
  let iGraphical = transformX(i+.5);
  let jGraphical = transformY(j+.5);
  let rGraphical = scaleX(radius);

  ctx.beginPath();
  ctx.arc(iGraphical, jGraphical, rGraphical, 0, 2*Math.PI);
  ctx.strokeStyle = 'rgb(0,0,0)';
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.closePath();
}


export function drawScores(ctx, positions, scores){
  positions.forEach( (pos, i) => {
      let iGraphical = transformX(pos.x+.5);
      let jGraphical = transformY(pos.y+.5);

      let score_rnd = Math.round(scores[i]);

      ctx.fillText(score_rnd, iGraphical, jGraphical)
  })
}


export function drawQ(ctx, positions, directions){
  positions.forEach( (pos, i) => {
    ctx.save();
    ctx.translate(offsetWidth, offsetHeight);
    ctx.scale(cellWidth, cellHeight);
    ctx.translate(pos.x+ .5, pos.y +.5);
    directions(i).forEach( 
      (dir) => {
        ctx.save();

        switch (dir){
          case 'N': break;
          case 'E': ctx.rotate(Math.PI / 180 * 90); break;
          case 'S': ctx.rotate(Math.PI / 180 * 180); break;
          case 'W': ctx.rotate(Math.PI / 180 * 270); break;
        }
        ctx.beginPath();
        //ctx.arc(0, 0, 1, 0, 2*Math.PI);
        ctx.strokeStyle = 'rgb(0,0,0)';
        ctx.lineWidth = .05;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -.3);
        ctx.lineTo(-.1, -.2);
        ctx.lineTo(.1, -.2);
        ctx.lineTo(0, -.3);
        ctx.moveTo(0, 0);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
      }
    );
    ctx.restore();
  })
}