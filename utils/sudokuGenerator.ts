import * as sudokuGen from 'sudoku-gen';

/**
 * Interface for a Sudoku puzzle with proper typing
 */
export interface SudokuGame {
  puzzle: number[][];
  solution: number[][];
  difficulty: string;
}

/**
 * Convert string representation to 2D array
 * @param boardString String representation of the board (81 characters)
 * @returns 2D array of the board
 */
function stringToBoard(boardString: string): number[][] {
  const board: number[][] = [];
  
  for (let i = 0; i < 9; i++) {
    const row: number[] = [];
    for (let j = 0; j < 9; j++) {
      const index = i * 9 + j;
      const char = boardString[index];
      // In sudoku-gen, '-' represents empty cells
      row.push(char === '-' || char === '0' || char === '.' ? 0 : parseInt(char, 10));
    }
    board.push(row);
  }
  
  return board;
}

/**
 * Generates a valid Sudoku puzzle with the specified difficulty
 * @param difficulty Difficulty level ('easy', 'medium', 'hard', 'expert')
 * @returns An object containing the puzzle, solution, and difficulty
 */
export function generateSudokuPuzzle(difficulty: string = 'medium'): SudokuGame {
  // Map our difficulty levels to sudoku-gen's difficulty levels
  let mappedDifficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium';
  
  // Convert our difficulty to sudoku-gen's difficulty
  switch (difficulty.toLowerCase()) {
    case 'easy':
      mappedDifficulty = 'easy';
      break;
    case 'medium':
      mappedDifficulty = 'medium';
      break;
    case 'hard':
      mappedDifficulty = 'hard';
      break;
    case 'expert':
    case 'very-hard':
    case 'insane':
      mappedDifficulty = 'expert';
      break;
    default:
      mappedDifficulty = 'medium';
  }
  
  // Generate a puzzle using sudoku-gen
  const sudoku = sudokuGen.getSudoku(mappedDifficulty);
  
  // Convert string representations to 2D arrays
  const puzzle = stringToBoard(sudoku.puzzle);
  const solution = stringToBoard(sudoku.solution);
  
  console.log('Generated puzzle using sudoku-gen package');
  console.log(`Difficulty: ${sudoku.difficulty}`);
  
  return {
    puzzle,
    solution,
    difficulty: sudoku.difficulty
  };
}

/**
 * Validates a sudoku board
 * @param board The board to validate
 * @returns Whether the board is valid
 */
export function validateSudokuBoard(board: number[][]): boolean {
  // Check rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== 0) {
        if (seen.has(value)) return false;
        seen.add(value);
      }
    }
  }
  
  // Check columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < 9; row++) {
      const value = board[row][col];
      if (value !== 0) {
        if (seen.has(value)) return false;
        seen.add(value);
      }
    }
  }
  
  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set<number>();
      for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
        for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
          const value = board[row][col];
          if (value !== 0) {
            if (seen.has(value)) return false;
            seen.add(value);
          }
        }
      }
    }
  }
  
  return true;
} 