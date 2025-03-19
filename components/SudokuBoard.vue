<template>
  <div class="w-full max-w-md mx-auto relative">
    <NumberCounter :board="board" />
    <div class="flex justify-between mb-2 p-2 bg-gray-50 rounded-t-md">
      <div class="text-xs sm:text-sm font-medium">Difficulty: <span class="text-blue-600 font-semibold">{{ capitalizeFirst(difficulty) }}</span></div>
      <div v-if="errorCount > 0" class="text-xs sm:text-sm text-red-500 font-medium">Errors: {{ errorCount }}</div>
    </div>
    
    <!-- Responsive Sudoku Grid -->
    <div class="grid grid-cols-9 bg-white border-2 border-slate-800 aspect-square shadow-md">
      <SudokuCell
        v-for="i in 81"
        :key="i"
        :row="Math.floor((i - 1) / 9)"
        :col="(i - 1) % 9"
        :value="board[Math.floor((i - 1) / 9)][(i - 1) % 9]"
        :is-read-only="initialBoard[Math.floor((i - 1) / 9)][(i - 1) % 9] !== 0"
        :is-selected="selectedCell && selectedCell.row === Math.floor((i - 1) / 9) && selectedCell.col === (i - 1) % 9"
        :is-highlighted="isHighlighted(Math.floor((i - 1) / 9), (i - 1) % 9)"
        :is-same-number="isSameNumber(Math.floor((i - 1) / 9), (i - 1) % 9)"
        :has-error="errors[Math.floor((i - 1) / 9)][(i - 1) % 9]"
        :notes="notes[Math.floor((i - 1) / 9)][(i - 1) % 9] || []"
        @select="selectCell(Math.floor((i - 1) / 9), (i - 1) % 9)"
      />
    </div>
    
    <!-- Number pad section replacement with better mobile layout -->
    <div class="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-2 mt-3 sm:mt-4 mb-4 sm:mb-6">
      <!-- Numbers 1-9 with responsive sizing -->
      <button
        v-for="n in 9"
        :key="n"
        :class="[
          'p-2 sm:p-3 text-base sm:text-xl font-bold rounded-md transition-all active:scale-95',
          selectedNumber === n 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'bg-gray-100 text-gray-800 hover:bg-blue-100'
        ]"
        @click="inputNumber(n)"
        :aria-label="`Input number ${n}`"
      >
        {{ n }}
      </button>
      
      <!-- Erase button - full width on mobile -->
      <button
        class="p-2 sm:p-3 text-base sm:text-xl font-bold bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-all active:scale-95 col-span-1 flex items-center justify-center"
        @click="eraseCell"
        aria-label="Erase cell"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Notes toggle button -->
      <button
        :class="[
          'p-2 sm:p-3 text-base sm:text-xl font-bold rounded-md transition-all active:scale-95 col-span-2 sm:col-span-1 flex items-center justify-center',
          noteMode 
            ? 'bg-yellow-400 text-white shadow-md' 
            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
        ]"
        @click="toggleNoteMode"
        aria-label="Toggle notes mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span class="text-xs sm:text-sm">{{ noteMode ? "ON" : "Notes" }}</span>
      </button>
    </div>
    
    <!-- Game controls -->
    <div class="flex justify-between mb-4">
      <button 
        class="px-3 py-2 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        @click="resetBoard"
      >
        Reset
      </button>
      <button 
        class="px-3 py-2 text-sm sm:text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        @click="checkProgress"
      >
        Check Progress
      </button>
    </div>
    
    <!-- Number completed notification -->
    <div 
      v-if="numberCompleted"
      class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-green-500 text-white px-4 py-2 rounded-md shadow-md animate-bounce z-10 text-sm sm:text-base"
    >
      All {{ numberCompleted }}s completed! 🎉
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePocketbase } from '~/composables/usePocketbase';
import { useGameSync } from '~/composables/useGameSync';
import NumberCounter from './NumberCounter.vue';
import type { SudokuGame } from '~/utils/sudokuGenerator';

interface CellPosition {
  row: number;
  col: number;
}

const props = defineProps<{
  gameId?: string;
  initialPuzzle: number[][];
  solution: number[][];
  difficulty: string;
  isMultiplayer?: boolean;
}>();

const emit = defineEmits(['update:board', 'complete', 'error', 'opponent-errors']);

// Initialize board and game state
const initialBoard = ref<number[][]>(Array(9).fill(0).map(() => Array(9).fill(0)));
const board = ref<number[][]>(Array(9).fill(0).map(() => Array(9).fill(0)));
const selectedCell = ref<CellPosition | null>(null);
const selectedNumber = ref<number | null>(null);
const notes = reactive(Array(9).fill(0).map(() => Array(9).fill(0).map(() => [] as number[])));
const errors = reactive(Array(9).fill(0).map(() => Array(9).fill(false)));
const noteMode = ref(false);
const errorCount = ref(0);
const { pb } = usePocketbase();
const numberCompleted = ref<number | null>(null);

// Initialize the board when component is mounted
onMounted(() => {
  // Create deep copies to avoid reference issues
  initialBoard.value = JSON.parse(JSON.stringify(props.initialPuzzle));
  board.value = JSON.parse(JSON.stringify(props.initialPuzzle));
});

// Watch for changes in the initialPuzzle and solution props
watch(() => props.initialPuzzle, (newPuzzle) => {
  if (newPuzzle && newPuzzle.length === 9) {
    initialBoard.value = JSON.parse(JSON.stringify(newPuzzle));
    board.value = JSON.parse(JSON.stringify(newPuzzle));
    // Reset other game state
    notes.forEach(row => row.forEach(cell => cell.length = 0));
    errors.forEach(row => row.fill(false));
    errorCount.value = 0;
    selectedCell.value = null;
    selectedNumber.value = null;
  }
}, { deep: true });

// Initialize game sync if multiplayer
let gameSync: any = null;

if (props.isMultiplayer && props.gameId) {
  onMounted(() => {
    gameSync = useGameSync(props.gameId as string);
    
    // Listen for updates from opponent
    gameSync.onUpdate((data: any) => {
      if (data.type === 'board_update') {
        // Update opponent's progress visually
        // For example, you could highlight cells the opponent has completed
      }
    });
  });
}

// Function to check if a cell should be highlighted
const isHighlighted = (row: number, col: number): boolean => {
  if (!selectedCell.value) return false;
  
  const { row: selectedRow, col: selectedCol } = selectedCell.value;
  
  // Highlight the same row, column, or 3x3 box
  return row === selectedRow || 
         col === selectedCol || 
         (Math.floor(row / 3) === Math.floor(selectedRow / 3) && 
          Math.floor(col / 3) === Math.floor(selectedCol / 3));
};

// Function to check if a cell has the same number as the selected cell or number
const isSameNumber = (row: number, col: number): boolean => {
  const cellValue = board.value[row][col];
  if (cellValue === 0) return false;
  
  // If there's a selected number, check if this cell has that number
  if (selectedNumber.value) {
    return cellValue === selectedNumber.value;
  }
  
  // If there's a selected cell with a value, check if this cell has the same value
  if (selectedCell.value) {
    const selectedCellValue = board.value[selectedCell.value.row][selectedCell.value.col];
    if (selectedCellValue !== 0) {
      return cellValue === selectedCellValue;
    }
  }
  
  return false;
};

// Select a cell
const selectCell = (row: number, col: number): void => {
  // Update selected cell
  selectedCell.value = { row, col };
  
  // Update selected number if the cell has a value
  const cellValue = board.value[row][col];
  if (cellValue !== 0) {
    selectedNumber.value = cellValue;
  }
};

// Input a number to the selected cell
const inputNumber = (num: number): void => {
  // Always update the selected number
  selectedNumber.value = num;
  
  if (!selectedCell.value) return;
  
  const { row, col } = selectedCell.value;
  
  // If the cell is read-only, do nothing
  if (initialBoard.value[row][col] !== 0) return;
  
  // If note mode is on, toggle the note
  if (noteMode.value) {
    const noteIndex = notes[row][col].indexOf(num);
    if (noteIndex === -1) {
      notes[row][col].push(num);
      notes[row][col].sort((a, b) => a - b); // Keep notes ordered
    } else {
      notes[row][col].splice(noteIndex, 1);
    }
    return;
  }
  
  // Clear any notes for this cell
  notes[row][col] = [];
  
  // Check if we're replacing a number that was previously marked as an error
  const wasError = errors[row][col];
  
  // Input the number
  board.value[row][col] = num;
  
  // Validate the move
  const isValid = validateMove(row, col, num);
  
  // Update error state
  if (wasError && isValid) {
    // If it was an error before but is now valid, decrement error count
    errorCount.value = Math.max(0, errorCount.value - 1);
    errors[row][col] = false;
  } else if (!wasError && !isValid) {
    // If it wasn't an error before but is now invalid, increment error count
    errorCount.value++;
    errors[row][col] = true;
  } else {
    // Just update the error state without changing the count
    errors[row][col] = !isValid;
  }
  
  // Emit error updates
  if (!isValid) {
    emit('error', errorCount.value);
  }
  
  // Check if the puzzle is complete
  if (isPuzzleComplete()) {
    emit('complete', errorCount.value);
  }
  
  // If this is a multiplayer game, update the game state
  if (props.isMultiplayer && props.gameId && gameSync) {
    gameSync.sendUpdate({
      board: board.value,
      notes: notes,
      errors: errorCount.value
    });
  }
  
  // Emit the updated board
  emit('update:board', board.value);

  // Check if all instances of this number are now filled
  const numCount = board.value.reduce((count, row) => {
    return count + row.filter(cell => cell === num).length;
  }, 0);
  
  if (numCount === 9) {
    numberCompleted.value = num;
    
    // Reset after animation
    setTimeout(() => {
      numberCompleted.value = null;
    }, 2000);
  }
};

// Erase a cell
const eraseCell = (): void => {
  if (!selectedCell.value) return;
  
  const { row, col } = selectedCell.value;
  
  // If the cell is read-only, do nothing
  if (initialBoard.value[row][col] !== 0) return;
  
  // Clear the cell
  board.value[row][col] = 0;
  errors[row][col] = false;
  
  // If this is a multiplayer game, update the game state
  if (props.isMultiplayer && props.gameId && gameSync) {
    gameSync.sendUpdate({
      board: board.value,
      notes: notes,
      errors: errorCount.value
    });
  }
  
  // Emit the updated board
  emit('update:board', board.value);
};

// Toggle note mode
const toggleNoteMode = (): void => {
  noteMode.value = !noteMode.value;
};

// Modified validateMove function that can use the solution
const validateMove = (row: number, col: number, num: number): boolean => {
  // If we have a solution, use it for validation
  if (props.solution && props.solution.length === 9) {
    // Check if the number matches the solution
    const expected = props.solution[row][col];
    return expected === num;
  }
  
  // Otherwise, do standard validation with Sudoku rules
  // Check row
  for (let i = 0; i < 9; i++) {
    if (i !== col && board.value[row][i] === num) return false;
  }
  
  // Check column
  for (let i = 0; i < 9; i++) {
    if (i !== row && board.value[i][col] === num) return false;
  }
  
  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (i !== row && j !== col && board.value[i][j] === num) return false;
    }
  }
  
  return true;
};

// Check if the puzzle is complete
const isPuzzleComplete = (): boolean => {
  // Check if all cells are filled
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board.value[i][j] === 0) return false;
    }
  }
  
  // Check if there are any errors
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (errors[i][j]) return false;
    }
  }
  
  return true;
};

// Update game state in multiplayer mode
const updateGameState = async (): Promise<void> => {
  try {
    // Get existing game state
    let gameState;
    try {
      gameState = await pb.collection('GameStates').getFirstListItem(`gameId="${props.gameId}" && playerId="${pb.authStore.model?.id}"`);
    } catch (error) {
      // Create new game state if it doesn't exist
      gameState = await pb.collection('GameStates').create({
        gameId: props.gameId,
        playerId: pb.authStore.model?.id,
        board: board.value,
        notes: notes,
        errors: errorCount.value,
      });
      return;
    }
    
    // Update game state
    await pb.collection('GameStates').update(gameState.id, {
      board: board.value,
      notes: notes,
      errors: errorCount.value,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error("Error updating game state:", error);
  }
};

// Set up polling for opponent's updates if this is a multiplayer game
let pollingInterval: number | null = null;

if (props.isMultiplayer && props.gameId) {
  onMounted(() => {
    // Poll every 2 seconds for opponent's updates
    pollingInterval = window.setInterval(async () => {
      try {
        // Get opponent's game state
        const records = await pb.collection('GameStates').getList(1, 1, {
          filter: `gameId="${props.gameId}" && playerId != "${pb.authStore.model?.id}"`,
          sort: '-lastUpdated'
        });
        
        if (records.items.length > 0) {
          const opponentState = records.items[0];
          
          // Update opponent's error count (could be displayed somewhere in UI)
          emit('opponent-errors', opponentState.errors);
          
          // You could also use opponentState.board to highlight opponent's progress
        }
      } catch (error) {
        console.error("Error polling for opponent updates:", error);
      }
    }, 2000);
  });
  
  onBeforeUnmount(() => {
    // Clean up polling interval
    if (pollingInterval !== null) {
      window.clearInterval(pollingInterval);
    }
  });
}

// Reset the board to initial state
const resetBoard = (): void => {
  board.value = JSON.parse(JSON.stringify(initialBoard.value));
  notes.forEach(row => row.forEach(cell => cell.length = 0));
  errors.forEach(row => row.fill(false));
  errorCount.value = 0;
  selectedCell.value = null;
  selectedNumber.value = null;
  
  // Emit the updated board
  emit('update:board', board.value);
};

// Check current progress
const checkProgress = (): void => {
  let wrongCells = 0;
  
  // Compare with solution
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board.value[row][col] !== 0) {
        const expected = props.solution[row][col];
        const actual = board.value[row][col];
        const isCorrect = actual === expected;
        
        if (!isCorrect) {
          errors[row][col] = true;
          wrongCells++;
        }
      }
    }
  }
  
  if (wrongCells > 0) {
    alert(`You have ${wrongCells} incorrect cells.`);
  } else {
    alert('Looking good! All filled cells are correct.');
  }
};

// Helper to capitalize first letter
const capitalizeFirst = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
</script>

<style scoped>
.sudoku-cell {
  width: 100%;
  aspect-ratio: 1 / 1;
}
</style>