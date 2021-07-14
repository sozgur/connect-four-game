/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
const inputWidth = document.getElementById("width");
const inputHeight = document.getElementById("height");
const startGame = document.getElementById("make-board");

// const WIDTH = Number(document.getElementById("width").value);
// const HEIGHT = Number(document.getElementById("height").value);

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for (let r = 0; r < HEIGHT; r++) {
    const row = [];
    for (let c = 0; c < WIDTH; c++) {
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
  // add click event to first row
  top.addEventListener("click", handleClick);

  // create cell(column) in first row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.addEventListener("mouseover", hoverColor);
    headCell.addEventListener("click", clickColor);
    headCell.addEventListener("mouseout", outColor);
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // create cells according to height and width and add id to each data cell
  // add all cell to board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

function hoverColor(event) {
  event.target.style.backgroundColor = currPlayer === 1 ? "gold" : "red";
}

function clickColor(event) {
  event.target.style.backgroundColor = currPlayer === 2 ? "gold" : "red";
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
  // make a div and insert into correct table cell
  const cellID = `${y}-${x}`;
  const cell = document.getElementById(cellID);
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`);
  cell.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  setTimeout(function () {
    window.alert("msg");
  }, 100);
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
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  const isFilled = board.every((row) => row.every((col) => col !== null));
  if (isFilled) {
    endGame(`It's a tie!`);
  }

  // switch players
  // switch currPlayer 1 <-> 2
  if (currPlayer === 1) {
    currPlayer = 2;
  } else {
    currPlayer = 1;
  }
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
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // check connections of cell in four way when fill the cell
  // return tree if find one connection in four ways
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
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

makeBoard();
makeHtmlBoard();