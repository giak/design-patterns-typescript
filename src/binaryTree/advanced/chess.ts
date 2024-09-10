/**
 * Basic example of a chess game using a binary tree.
 * ⚠️ Beware: purpose is about using Typescript and "basic binary search tree", not about performance or efficiency.
 */

/**
 * Represents a chess piece.
 * @typedef {("P" | "N" | "B" | "R" | "Q" | "K" | "p" | "n" | "b" | "r" | "q" | "k" | " ")} Piece
 */
type PieceType =
  | "P"
  | "N"
  | "B"
  | "R"
  | "Q"
  | "K"
  | "p"
  | "n"
  | "b"
  | "r"
  | "q"
  | "k"
  | " ";

/**
 * Represents the chess board as a 2D array of pieces.
 * @typedef {PieceType[][]} BoardType
 */
type BoardType = PieceType[][];

/**
 * Represents a move in the chess game.
 * @typedef {Object} MoveInterface
 * @property {[number, number]} from - The starting position of the move.
 * @property {[number, number]} to - The ending position of the move.
 */
interface MoveInterface {
  from: [number, number];
  to: [number, number];
}

/**
 * Class representing a node in the decision tree for the chess game.
 */
class DecisionTreeNode {
  /** The board state. */
  board: BoardType;
  move: MoveInterface | null;
  children: DecisionTreeNode[];
  isWhiteTurn: boolean;

  /**
   * Creates an instance of DecisionTreeNode.
   * @param {BoardType} board - The current state of the chess board.
   * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
   * @param {MoveInterface | null} move - The move that led to this state.
   */
  constructor(
    board: BoardType,
    isWhiteTurn: boolean,
    move: MoveInterface | null = null
  ) {
    this.board = board;
    this.move = move;
    this.children = [];
    this.isWhiteTurn = isWhiteTurn;
  }
}

// Utility functions

/**
 * Checks if the given coordinates are within the bounds of the chess board.
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @returns {boolean} - True if the coordinates are in bounds, false otherwise.
 */
function isInBounds(x: number, y: number): boolean {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}

/**
 * Checks if the given piece belongs to the current player.
 * @param {PieceType} piece - The chess piece to check.
 * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
 * @returns {boolean} - True if the piece belongs to the current player, false otherwise.
 */
function isCurrentPlayerPiece(piece: PieceType, isWhiteTurn: boolean): boolean {
  return isWhiteTurn
    ? piece === piece.toUpperCase()
    : piece === piece.toLowerCase();
}

// Motion generation functions

/**
 * Generates all possible moves for the current player.
 * @param {BoardType} board - The current state of the chess board.
 * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
 * @returns {MoveInterface[]} - An array of possible moves.
 */
function generateMoves(
  board: BoardType,
  isWhiteTurn: boolean
): MoveInterface[] {
  const moves: MoveInterface[] = [];

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (isCurrentPlayerPiece(piece, isWhiteTurn)) {
        const pieceMoves = getPieceMoves(board, x, y, isWhiteTurn);
        moves.push(...pieceMoves);
      }
    }
  }

  return moves;
}

/**
 * Gets all possible moves for a specific piece.
 * @param {BoardType} board - The current state of the chess board.
 * @param {number} x - The x-coordinate of the piece.
 * @param {number} y - The y-coordinate of the piece.
 * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
 * @returns {MoveInterface[]} - An array of possible moves for the piece.
 */
function getPieceMoves(
  board: BoardType,
  x: number,
  y: number,
  isWhiteTurn: boolean
): MoveInterface[] {
  const piece = board[y][x].toLowerCase();
  switch (piece) {
    case "p":
      return getPawnMoves(board, x, y, isWhiteTurn);
    case "r":
      return getRookMoves(board, x, y, isWhiteTurn);
    case "n":
      return getKnightMoves(board, x, y, isWhiteTurn);
    case "b":
      return getBishopMoves(board, x, y, isWhiteTurn);
    case "q":
      return getQueenMoves(board, x, y, isWhiteTurn);
    case "k":
      return getKingMoves(board, x, y, isWhiteTurn);
    default:
      return [];
  }
}

/**
 * Gets all possible moves for a pawn.
 * @param {BoardType} board - The current state of the chess board.
 * @param {number} x - The x-coordinate of the pawn.
 * @param {number} y - The y-coordinate of the pawn.
 * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
 * @returns {MoveInterface[]} - An array of possible moves for the pawn.
 */
function getPawnMoves(
  board: BoardType,
  x: number,
  y: number,
  isWhiteTurn: boolean
): MoveInterface[] {
  const moves: MoveInterface[] = [];
  const direction = isWhiteTurn ? -1 : 1;
  const startRank = isWhiteTurn ? 6 : 1;

  // Mouvement simple
  if (isInBounds(x, y + direction) && board[y + direction][x] === " ") {
    moves.push({ from: [x, y], to: [x, y + direction] });

    // Double mouvement depuis la position de départ
    if (y === startRank && board[y + 2 * direction][x] === " ") {
      moves.push({ from: [x, y], to: [x, y + 2 * direction] });
    }
  }

  // Captures
  for (const dx of [-1, 1]) {
    if (isInBounds(x + dx, y + direction)) {
      const targetPiece = board[y + direction][x + dx];
      if (
        targetPiece !== " " &&
        !isCurrentPlayerPiece(targetPiece, isWhiteTurn)
      ) {
        moves.push({ from: [x, y], to: [x + dx, y + direction] });
      }
    }
  }

  return moves;
}

/**
 * Gets all possible moves for a rook.
 * @param {BoardType} board - The current state of the chess board.
 * @param {number} x - The x-coordinate of the rook.
 * @param {number} y - The y-coordinate of the rook.
 * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
 * @returns {MoveInterface[]} - An array of possible moves for the rook.
 */
function getRookMoves(
  board: BoardType,
  x: number,
  y: number,
  isWhiteTurn: boolean
): MoveInterface[] {
  return getStraightMoves(board, x, y, isWhiteTurn, [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]);
}

/**
 * Gets all possible moves for a knight.
 * @param {BoardType} board - The current state of the chess board.
 * @param {number} x - The x-coordinate of the knight.
 * @param {number} y - The y-coordinate of the knight.
 * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
 * @returns {MoveInterface[]} - An array of possible moves for the knight.
 */
function getKnightMoves(
  board: BoardType,
  x: number,
  y: number,
  isWhiteTurn: boolean
): MoveInterface[] {
  const knightOffsets: [number, number][] = [
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2],
  ];
  return getJumpMoves(board, x, y, isWhiteTurn, knightOffsets);
}

/**
 * Gets all possible moves for a bishop.
 * @param {BoardType} board - The current state of the chess board.
 * @param {number} x - The x-coordinate of the bishop.
 * @param {number} y - The y-coordinate of the bishop.
 * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
 * @returns {MoveInterface[]} - An array of possible moves for the bishop.
 */
function getBishopMoves(
  board: BoardType,
  x: number,
  y: number,
  isWhiteTurn: boolean
): MoveInterface[] {
  return getStraightMoves(board, x, y, isWhiteTurn, [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ]);
}

/**
 * Gets all possible moves for a queen.
 * @param {BoardType} board - The current state of the chess board.
 * @param {number} x - The x-coordinate of the queen.
 * @param {number} y - The y-coordinate of the queen.
 * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
 * @returns {MoveInterface[]} - An array of possible moves for the queen.
 */
function getQueenMoves(
  board: BoardType,
  x: number,
  y: number,
  isWhiteTurn: boolean
): MoveInterface[] {
  return [
    ...getStraightMoves(board, x, y, isWhiteTurn, [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]),
    ...getStraightMoves(board, x, y, isWhiteTurn, [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ]),
  ];
}

/**
 * Gets all possible moves for a king.
 * @param {BoardType} board - The current state of the chess board.
 * @param {number} x - The x-coordinate of the king.
 * @param {number} y - The y-coordinate of the king.
 * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
 * @returns {MoveInterface[]} - An array of possible moves for the king.
 */
function getKingMoves(
  board: BoardType,
  x: number,
  y: number,
  isWhiteTurn: boolean
): MoveInterface[] {
  const kingOffsets: [number, number][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  return getJumpMoves(board, x, y, isWhiteTurn, kingOffsets);
}

/**
 * Gets all straight moves for a piece in specified directions.
 * @param {BoardType} board - The current state of the chess board.
 * @param {number} x - The x-coordinate of the piece.
 * @param {number} y - The y-coordinate of the piece.
 * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
 * @param {Array<[number, number]>} directions - The directions to check for moves.
 * @returns {MoveInterface[]} - An array of possible straight moves.
 */
function getStraightMoves(
  board: BoardType,
  x: number,
  y: number,
  isWhiteTurn: boolean,
  directions: [number, number][]
): MoveInterface[] {
  const moves: MoveInterface[] = [];

  for (const [dx, dy] of directions) {
    let newX = x + dx;
    let newY = y + dy;

    while (isInBounds(newX, newY)) {
      const targetPiece = board[newY][newX];
      if (targetPiece === " ") {
        moves.push({ from: [x, y], to: [newX, newY] });
      } else {
        if (!isCurrentPlayerPiece(targetPiece, isWhiteTurn)) {
          moves.push({ from: [x, y], to: [newX, newY] });
        }
        break;
      }
      newX += dx;
      newY += dy;
    }
  }

  return moves;
}

/**
 * Gets all jump moves for a piece in specified offsets.
 * @param {BoardType} board - The current state of the chess board.
 * @param {number} x - The x-coordinate of the piece.
 * @param {number} y - The y-coordinate of the piece.
 * @param {boolean} isWhiteTurn - Indicates if it's white's turn.
 * @param {Array<[number, number]>} offsets - The offsets to check for jump moves.
 * @returns {MoveInterface[]} - An array of possible jump moves.
 */
function getJumpMoves(
  board: BoardType,
  x: number,
  y: number,
  isWhiteTurn: boolean,
  offsets: [number, number][]
): MoveInterface[] {
  const moves: MoveInterface[] = [];

  for (const [dx, dy] of offsets) {
    const newX = x + dx;
    const newY = y + dy;

    if (isInBounds(newX, newY)) {
      const targetPiece = board[newY][newX];
      if (
        targetPiece === " " ||
        !isCurrentPlayerPiece(targetPiece, isWhiteTurn)
      ) {
        moves.push({ from: [x, y], to: [newX, newY] });
      }
    }
  }

  return moves;
}

// Evaluation function

/**
 * Evaluates the current position of the chess board.
 * @param {BoardType} board - The current state of the chess board.
 * @returns {number} - The evaluation score of the board position.
 */
function evaluatePosition(board: BoardType): number {
  const pieceValues: Record<PieceType, number> = {
    P: 1,
    N: 3,
    B: 3,
    R: 5,
    Q: 9,
    K: 100,
    p: -1,
    n: -3,
    b: -3,
    r: -5,
    q: -9,
    k: -100,
    " ": 0,
  };

  return board.flat().reduce((sum, piece) => sum + pieceValues[piece], 0);
}

/**
 * Minimax algorithm with alpha-beta pruning for decision making.
 * @param {DecisionTreeNode} node - The current node in the decision tree.
 * @param {number} depth - The current depth in the tree.
 * @param {number} alpha - The best score that the maximizer currently can guarantee.
 * @param {number} beta - The best score that the minimizer currently can guarantee.
 * @returns {number} - The best score for the current player.
 */
function minimax(
  node: DecisionTreeNode,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean
): number {
  if (depth === 0) {
    return evaluatePosition(node.board);
  }

  const moves = generateMoves(node.board, node.isWhiteTurn);

  if (isMaximizingPlayer) {
    let maxEval = Number.NEGATIVE_INFINITY;
    for (const move of moves) {
      const childBoard = applyMove(node.board, move);
      const childNode = new DecisionTreeNode(
        childBoard,
        !node.isWhiteTurn,
        move
      );
      node.children.push(childNode);
      const evaluation = minimax(childNode, depth - 1, alpha, beta, false);
      maxEval = Math.max(maxEval, evaluation);
      const newAlpha = Math.max(alpha, evaluation);
      if (beta <= newAlpha) {
        break; // Élagage alpha
      }
    }
    return maxEval;
  }

  let minEval = Number.POSITIVE_INFINITY;
  for (const move of moves) {
    const childBoard = applyMove(node.board, move);
    const childNode = new DecisionTreeNode(childBoard, !node.isWhiteTurn, move);
    node.children.push(childNode);
    const evaluation = minimax(childNode, depth - 1, alpha, beta, true);
    minEval = Math.min(minEval, evaluation);
    const newBeta = Math.min(beta, evaluation);
    if (beta <= alpha) {
      break; // Élagage beta
    }
  }
  return minEval;
}

// Function to find the best movement

/**
 * Finds the best move for the current player.
 * @param {BoardType} board -The current state of the chess board.
 * @param {number} depth -The current depth in the tree.
 * @param {boolean} isWhiteTurn -Indicates if it's white's turn.
 * @returns {MoveInterface | null} -The best move for the current player.
 */
function findBestMove(
  board: BoardType,
  depth: number,
  isWhiteTurn: boolean
): { move: MoveInterface | null; resultingBoard: BoardType } {
  const rootNode = new DecisionTreeNode(board, isWhiteTurn, null);
  let bestMove: MoveInterface | null = null;
  let bestValue = isWhiteTurn
    ? Number.NEGATIVE_INFINITY
    : Number.POSITIVE_INFINITY;
  let resultingBoard: BoardType = board;

  const moves = generateMoves(board, isWhiteTurn);
  for (const move of moves) {
    const childBoard = applyMove(board, move);
    const childNode = new DecisionTreeNode(childBoard, !isWhiteTurn, move);
    rootNode.children.push(childNode);
    const value = minimax(
      childNode,
      depth - 1,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      !isWhiteTurn
    );

    if (isWhiteTurn ? value > bestValue : value < bestValue) {
      bestValue = value;
      bestMove = move;
      resultingBoard = childBoard;
    }
  }

  return { move: bestMove, resultingBoard };
}

// Function to apply a movement to the chessboard

/**
 * Applies a move to the chess board.
 * @param {BoardType} board - The current state of the chess board.
 * @param {MoveInterface} move - The move to apply.
 * @returns {BoardType} - The resulting board after applying the move.
 */
function applyMove(board: BoardType, move: MoveInterface): BoardType {
  const newBoard = board.map((row) => [...row]);
  const [fromX, fromY] = move.from;
  const [toX, toY] = move.to;
  newBoard[toY][toX] = newBoard[fromY][fromX];
  newBoard[fromY][fromX] = " ";
  return newBoard;
}

// Chessboard display function

/**
 * Displays the chess board.
 * @param {BoardType} board - The current state of the chess board.
 */
function displayBoard(board: BoardType): void {
  const symbols: Record<PieceType, string> = {
    P: "♙",
    N: "♘",
    B: "♗",
    R: "♖",
    Q: "♕",
    K: "♔",
    p: "♟",
    n: "♞",
    b: "♝",
    r: "♜",
    q: "♛",
    k: "♚",
    " ": " ",
  };

  console.log("  a b c d e f g h");
  board.forEach((row, index) => {
    const rowString = row.map((piece) => symbols[piece]).join(" ");
    console.log(`${8 - index} ${rowString} ${8 - index}`);
  });
  console.log("  a b c d e f g h");
}

// Example of use
const initialBoard: BoardType = [
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["r", "n", "b", "q", "k", "b", "n", "r"],
];

console.log("Échiquier initial :");
displayBoard(initialBoard);

// Finding the best move for white
const { move: bestMoveWhite, resultingBoard: newBoardWhite } = findBestMove(
  initialBoard,
  3,
  true
);
console.log("\nMeilleur coup trouvé pour les blancs :", bestMoveWhite);

if (bestMoveWhite) {
  console.log("\nÉchiquier après le meilleur coup des blancs :");
  displayBoard(newBoardWhite);

  // Finding the best move for black
  const { move: bestMoveBlack, resultingBoard: newBoardBlack } = findBestMove(
    newBoardWhite,
    3,
    false
  );
  console.log("\nMeilleur coup trouvé pour les noirs :", bestMoveBlack);

  if (bestMoveBlack) {
    console.log("\nÉchiquier après le meilleur coup des noirs :");
    displayBoard(newBoardBlack);
  }
}

export type {};
