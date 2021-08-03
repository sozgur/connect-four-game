/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
let inputWidth = document.getElementById("width");
let inputHeight = document.getElementById("height");
let boardForm = document.getElementById("board-form");
let start = document.getElementById("start");
let end = document.getElementById("end");

let boardWidth;
let boardHeight;
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

// you would normally derive this programmatically but using constant here for simplicity
const pieceHeight = 47;

// Start game
boardForm.addEventListener("submit", startGame);

function startGame(event) {
  event.preventDefault();
  boardWidth = +inputWidth.value;
  boardHeight = +inputHeight.value;
  start.classList.add("playing");
  makeBoard();
  makeHtmlBoard();
}

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  // set "board" to empty boardHeight x boardWidth matrix array
  for (let r = 0; r < boardHeight; r++) {
    const row = [];
    for (let c = 0; c < boardWidth; c++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");
  // create first top row which is light gray
  const top = document.createElement("tr");
  // add id to light gray row
  top.setAttribute("id", "column-top");
  // add click event to first row and change background color
  top.addEventListener("click", handleClick);
  top.addEventListener("mouseover", changeColor);
  top.addEventListener("mouseout", outColor);

  // create cell(column) in first row
  for (let x = 0; x < boardWidth; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create cells according to height and width and add id to each data cell
  // add all cell to board
  for (let y = 0; y < boardHeight; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < boardWidth; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

function changeColor(event) {
  event.target.style.backgroundColor = currPlayer === 1 ? "gold" : "red";
}

function outColor(event) {
  event.target.style.backgroundColor = null;
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  // find null rows which is null specific column and return the last one
  return board.filter((row) => row[x] === null).length - 1;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y, x) {
  // calculate offset height
  const offsetHeight = ((boardHeight + 1) - (boardHeight - y)) * pieceHeight;
  // make a div and insert into correct table cell
  const cellID = `${y}-${x}`;
  const cell = document.getElementById(cellID);
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`);
  piece.style.transform = `translateY(-${offsetHeight}px)`;
  cell.append(piece);
  // on the next tick, reset transform
  // this needs to happen because the piece should be rendered on the screen first *then* removal of transform will activate the transition
  setTimeout(() => {
    piece.style.removeProperty('transform');
  }, 0)
}

/** endGame: announce game end */
function endGame(msg, currPlayer) {
  end.classList.add("game-over");
  end.children[1].innerText = msg;
  end.children[0].classList.add(`p${currPlayer}`);
}

/** handleClick: handle click of column top to play piece */
function handleClick(evt) {
  // get x from ID of clicked cell
  // x is column index number
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === -1) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);
  //update in-memory board
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`, currPlayer);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  const isFilled = board.every((row) => row.every((col) => col !== null));
  if (isFilled) {
    endGame(`It's a tie!`);
  }

  // switch players
  // switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;

  //Change ball color
  changeColor(evt);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < boardHeight &&
        x >= 0 &&
        x < boardWidth &&
        board[y][x] === currPlayer
    );
  }

  // check connections of cell in four way when fill the cell
  // return tree if find one connection in four ways
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
