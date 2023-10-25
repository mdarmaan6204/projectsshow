const boxes = document.querySelectorAll(".box");
const gameInfo = document.querySelector(".game-info");
const newGameBtn = document.querySelector(".btn");
const gameType = document.querySelectorAll(".link");


let currPlayer;
let gameGrid;
let winner = "";

const winningPos = [
   [0, 1 ,2] ,
   [3, 4, 5] ,
   [6 ,7, 8] ,
   [0 ,3, 6],
   [1 ,4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6]
];

//  Let's create the fucntion to insitalise the game
function initGame()
{
    gameType[0].classList.remove("game-type");
    gameType[1].classList.remove("game-type");
    gameType[2].classList.remove("game-type");
    gameType[3].classList.add("game-type");

   currPlayer = "X";
   gameGrid = ["" , "" ,"" , "" , "", "" ,"" , "" , "" ];

   //  Empty the box in web page
   boxes.forEach((box , index) =>{
       box.innerText = "";
       boxes[index].style.pointerEvents ="all";
       //  Initialise the css propteties again
       box.classList = `box box${index+1}`;
   });

   newGameBtn.classList.remove("active");
   if(winner === "X")
   gameInfo.classList.remove('green');
   else if(winner === "O")
   gameInfo.classList.remove('red');

  gameInfo.innerText = `Your Turn`;
   winner = "";
}

initGame();



function compTurn()
{
    let bestScore = -Infinity;
    let bestMove;

    for(let i = 0; i<9; i++)
    {
      if(gameGrid[i] === "")
      {
        
        gameGrid[i] = "O";
        let score = minimax(0 , false);
        gameGrid[i] = "";
       
        if(score > bestScore)
        {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    gameGrid[bestMove] = "O";
    boxes[bestMove].innerText  = "O";
    boxes[bestMove].style.pointerEvents = "none";
    currPlayer = "X";


    checkGameOver();
    if(winner === "")
    gameInfo.innerText = `Your Turn`;
}


function minimax(depth , isMaximizing)
{
  
  let result = checkWinner();
  if(result !== "")
  {
   
    if(result === "X")
    return -10;
    else if(result === "O")
    return 10;
    else if(result === "tie")
    return 0;
  }

  if(isMaximizing)
  {
    let posBestScore = -Infinity;
    for(let i = 0; i<9; i++)
    {
      if(gameGrid[i] === "")
      {
        gameGrid[i] = "O";
        let posScore = minimax(depth+1 , false);
        gameGrid[i] = "";
        if(posScore > posBestScore)
        {
          posBestScore = posScore;
        }
      }
    }
    return posBestScore;
  }
  else
 {
  let posBestScore = Infinity;
    for(let i =0; i<9; i++)
    {
      if(gameGrid[i] === "")
      {
        gameGrid[i] = "X";
        let posScore = minimax(depth+1 , true);
        gameGrid[i] = "";
        if(posScore < posBestScore)
        {
          posBestScore = posScore;
        }
      }
    }
    return posBestScore;
 }
}

function checkWinner()
{
  let result = "";
  winningPos.forEach( (pos) => 
  {
    if( ( gameGrid[pos[0]] !== "" && gameGrid[pos[1]] !== "" && gameGrid[pos[2]] !== "" )
     && (gameGrid[pos[0]] === gameGrid[pos[1]]) && (gameGrid[pos[2]] === gameGrid[pos[1]] ) )
    {
      result = gameGrid[pos[0]];
    }
  })

  if(result === "")
  {
    let cnt = 0;
    for(let i = 0; i<9; i++)
    {
      if(gameGrid[i] !== "")
      {
        cnt++;
      }
    }
    if(cnt === 9)
    result = "tie";
  }
  return result;

}

function checkGameOver()
{
   winningPos.forEach((pos) =>
   {
       if((gameGrid[pos[0]] !== "" && gameGrid[pos[1] !=="" && gameGrid[pos[2]]] !== "")
       && (gameGrid[pos[0]] === gameGrid[pos[1]] ) && (gameGrid[pos[1]] === gameGrid[pos[2]]) )
       {
           if(gameGrid[pos[0]] === "X")
           {
               winner = "X";
           }
           else{
               winner = "O";
           }

           // Disable pointer events
           boxes.forEach((box) =>
           {
              box.style.pointerEvents = "none";
           })
           boxes[pos[0]].classList.add("green");
           boxes[pos[1]].classList.add("green");
           boxes[pos[2]].classList.add("green");
       }
   })
   


   if(winner !== "")
   {
       if(winner === "X")
       {
            gameInfo.innerHTML = `<b>You Win! </b>`;
            gameInfo.classList.add('green')
       }
       
       else 
       {
            gameInfo.innerHTML = `<b>You Lost! </b>`
            gameInfo.classList.add('red')
       }
       

       newGameBtn.classList.add('active');
       return;
   }
   
   let count = 0;
   gameGrid.forEach((box)=>
   {
       if(box !== "")
       count++;
   })

   if(count === 9)
   {
      gameInfo.innerHTML = `<b>Game Tied</b>`;
      winner = "tie";
      newGameBtn.classList.add("active");
   }

}


function handleClick(index)
{
   if(gameGrid[index] === "")
   {
       gameInfo.innerText = `Your Turn`;
       boxes[index].innerText = currPlayer;
       
       // Colour the input 
       if(currPlayer === "X")
       boxes[index].classList.add("playerX");
       else
       boxes[index].classList.remove("playerX");

       gameGrid[index] = currPlayer;
       boxes[index].style.pointerEvents = "none";

       checkGameOver();
       // Computer turn
       
       if(winner === "")
       {
            gameInfo.innerText = `Computer Turn`;
            currPlayer = "O";
            setTimeout(compTurn , 500);
            
       }
       
   }
   
}


boxes.forEach((box , index) =>{
   box.addEventListener('click' , () =>{
       handleClick(index);
   })
});


newGameBtn.addEventListener('click' , initGame);
