<template>
  <div class="w-full max-w-md mx-auto relative">
    <NumberCounter :board="board" />
    <div class="flex justify-between mb-2 p-2 bg-gray-50 rounded-t-md">
      <div class="text-xs sm:text-sm font-medium">Difficulty: <span class="text-blue-600 font-semibold">{{ capitalizeFirst(difficulty) }}</span></div>
      <div v-if="errorCount > 0" class="text-xs sm:text-sm text-red-500 font-medium">Errors: {{ errorCount }}</div>
    </div>
    
    <!-- Debug Toggle Button -->
    <button 
      @click="showDebugPanel = !showDebugPanel" 
      class="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md z-10"
    >
      {{ showDebugPanel ? 'Hide Debug' : 'Debug' }}
    </button>
    
    <!-- Debug Panel -->
    <div v-if="showDebugPanel" class="mb-4 p-2 bg-gray-100 rounded-md text-xs border border-gray-300 overflow-auto max-h-48">
      <div class="font-bold mb-1">Debug Info:</div>
      <div><span class="font-medium">Note Mode:</span> {{ noteMode ? 'ON' : 'OFF' }}</div>
      <div><span class="font-medium">Selected Cell:</span> {{ selectedCell ? `[${selectedCell.row},${selectedCell.col}]` : 'None' }}</div>
      <div><span class="font-medium">Selected Number:</span> {{ selectedNumber || 'None' }}</div>
      <div><span class="font-medium">Multi-Selected Cells:</span> {{ selectedCells.length }}</div>
      <div v-if="selectedCells.length > 0">
        <span class="font-medium">Cells:</span>
        <span v-for="(cell, index) in selectedCells" :key="index">
          [{{ cell.row }},{{ cell.col }}]{{ index < selectedCells.length - 1 ? ', ' : '' }}
        </span>
      </div>
      <div v-if="selectedCell">
        <span class="font-medium">Selected Cell Value:</span> {{ board[selectedCell.row][selectedCell.col] || 'Empty' }}
      </div>
      <div v-if="selectedCell">
        <span class="font-medium">Notes:</span> 
        {{ notes[selectedCell.row][selectedCell.col].length ? notes[selectedCell.row][selectedCell.col].join(', ') : 'None' }}
      </div>
      <div><span class="font-medium">Shift Key:</span> {{ isShiftKeyPressed ? 'Pressed' : 'Not Pressed' }}</div>
    </div>
    
    <!-- Responsive Sudoku Grid -->
    <div 
      class="grid grid-cols-9 bg-white border-2 border-slate-800 aspect-square shadow-md" 
      :class="{ 'ring-4 ring-yellow-300 ring-offset-2': noteMode }"
    >
      <SudokuCell
        v-for="i in 81"
        :key="i"
        :row="Math.floor((i - 1) / 9)"
        :col="(i - 1) % 9"
        :value="board[Math.floor((i - 1) / 9)][(i - 1) % 9]"
        :is-read-only="initialBoard[Math.floor((i - 1) / 9)][(i - 1) % 9] !== 0"
        :is-selected="selectedCell && selectedCell.row === Math.floor((i - 1) / 9) && selectedCell.col === (i - 1) % 9"
        :is-multi-selected="isMultiSelected(Math.floor((i - 1) / 9), (i - 1) % 9)"
        :is-highlighted="isHighlighted(Math.floor((i - 1) / 9), (i - 1) % 9)"
        :is-same-number="isSameNumber(Math.floor((i - 1) / 9), (i - 1) % 9)"
        :has-error="errors[Math.floor((i - 1) / 9)][(i - 1) % 9]"
        :is-note-mode-active="noteMode"
        :notes="notes[Math.floor((i - 1) / 9)][(i - 1) % 9] || []"
        @select="selectCell(Math.floor((i - 1) / 9), (i - 1) % 9)"
        @update="handleCellUpdate(Math.floor((i - 1) / 9), (i - 1) % 9, $event)"
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
      
      <!-- Notes toggle button - improve visibility when active -->
      <button
        :class="[
          'p-2 sm:p-3 text-base sm:text-xl font-bold rounded-md transition-all active:scale-95 col-span-2 sm:col-span-1 flex items-center justify-center',
          noteMode 
            ? 'bg-yellow-500 text-white shadow-md ring-2 ring-yellow-300 ring-offset-1' 
            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
        ]"
        @click="toggleNoteMode"
        aria-label="Toggle notes mode"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span class="text-xs sm:text-sm">{{ noteMode ? "NOTES ON" : "Notes" }}</span>
        <span class="hidden sm:inline-block ml-1 text-[8px] opacity-75">(N)</span>
      </button>
    </div>
    
    <!-- Multi-selection hint - show only when notes mode is active -->
    <div v-if="noteMode" class="mb-4 text-xs text-center bg-blue-50 py-2 rounded-md">
      <span class="font-medium">Shift+Click</span> to select multiple cells for notes
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
    
    <!-- Add keyboard instructions section -->
    <div class="mt-4 bg-blue-50 p-3 rounded-md hidden sm:block">
      <h3 class="text-sm font-semibold text-blue-800 mb-1">Keyboard & Mouse Controls:</h3>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-blue-700">
        <div>
          <span class="font-medium">Arrow keys:</span> Navigate cells
        </div>
        <div>
          <span class="font-medium">Numbers (1-9):</span> Enter numbers
        </div>
        <div>
          <span class="font-medium">0, Delete, Backspace:</span> Clear cell
        </div>
        <div>
          <span class="font-medium">N key:</span> Toggle notes mode
        </div>
        <div>
          <span class="font-medium">Home/End:</span> Move to start/end of row
        </div>
        <div>
          <span class="font-medium">Shift+Click:</span> Select multiple cells for notes
        </div>
        <div>
          <span class="font-medium">Numpad:</span> Works for both numbers & notes
        </div>
      </div>
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

// Add multi-cell selection support
const selectedCells = ref<CellPosition[]>([]);

// Add shift key tracking for multi-selection
const isShiftKeyPressed = ref(false);

// Add showDebugPanel reactive variable
const showDebugPanel = ref(false);

// Initialize the board when component is mounted
onMounted(() => {
  // Create deep copies to avoid reference issues
  initialBoard.value = JSON.parse(JSON.stringify(props.initialPuzzle));
  board.value = JSON.parse(JSON.stringify(props.initialPuzzle));
  
  // Add keyboard event listeners for global navigation
  window.addEventListener('keydown', handleGlobalKeyDown);
  
  // Track shift key for multi-selection
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') {
      isShiftKeyPressed.value = true;
    }
  });
  
  window.addEventListener('keyup', (e) => {
    if (e.key === 'Shift') {
      isShiftKeyPressed.value = false;
    }
  });
});

onBeforeUnmount(() => {
  // Clean up event listeners
  window.removeEventListener('keydown', handleGlobalKeyDown);
  window.removeEventListener('keydown', (e) => {
    if (e.key === 'Shift') isShiftKeyPressed.value = true;
  });
  window.removeEventListener('keyup', (e) => {
    if (e.key === 'Shift') isShiftKeyPressed.value = false;
  });
});

// Handle global keyboard events
const handleGlobalKeyDown = (event: KeyboardEvent) => {
  console.log('🌐 Global keydown event:', { 
    key: event.key, 
    code: event.code,
    shiftKey: event.shiftKey,
    ctrlKey: event.ctrlKey,
    noteMode: noteMode.value,
    hasSelectedCell: !!selectedCell.value,
    activeElement: document.activeElement?.tagName,
    activeElementClass: document.activeElement?.className
  });
  
  // Check if the active element is a cell (has sudoku-cell class)
  // If so, let the cell handle its own keyboard events 
  if (document.activeElement?.className.includes('sudoku-cell')) {
    const isNumpad = event.code && event.code.startsWith('Numpad');
    const keyNum = parseInt(event.key);
    
    // If this is a numpad key or number being handled by the cell directly,
    // don't process it here to avoid double input
    if (isNumpad || (!isNaN(keyNum) && keyNum >= 0 && keyNum <= 9)) {
      console.log('  Skipping global handling for numpad/number key on focused cell');
      return;
    }
  }
  
  // If no cell is selected, skip keyboard handling
  if (!selectedCell.value) {
    console.log('  No cell selected, skipping keyboard handling');
    return;
  }
  
  const { row, col } = selectedCell.value;
  
  // Handle arrow keys for navigation
  switch (event.key) {
    case 'ArrowUp':
      if (row > 0) {
        event.preventDefault();
        console.log('  Arrow Up: Moving to cell above');
        selectCell(row - 1, col);
      }
      break;
    case 'ArrowDown':
      if (row < 8) {
        event.preventDefault();
        console.log('  Arrow Down: Moving to cell below');
        selectCell(row + 1, col);
      }
      break;
    case 'ArrowLeft':
      if (col > 0) {
        event.preventDefault();
        console.log('  Arrow Left: Moving to cell to the left');
        selectCell(row, col - 1);
      }
      break;
    case 'ArrowRight':
      if (col < 8) {
        event.preventDefault();
        console.log('  Arrow Right: Moving to cell to the right');
        selectCell(row, col + 1);
      }
      break;
    case 'Home':
      event.preventDefault();
      console.log('  Home: Moving to beginning of row');
      selectCell(row, 0); // Move to beginning of row
      break;
    case 'End':
      event.preventDefault();
      console.log('  End: Moving to end of row');
      selectCell(row, 8); // Move to end of row
      break;
    case 'n':
    case 'N':
      // Toggle note mode with 'n' key
      event.preventDefault();
      console.log('  N key: Toggling note mode');
      toggleNoteMode();
      break;
  }
  
  // Handle number keys for input (both row and numpad)
  const keyNum = parseInt(event.key);
  const isNumpad = event.code && event.code.startsWith('Numpad');
  
  console.log('  Number input check:', { keyNum, isNumpad, isValidNumber: !isNaN(keyNum) && keyNum >= 0 && keyNum <= 9 });
  
  if (!isNaN(keyNum) && keyNum >= 0 && keyNum <= 9) {
    // For numpad input specifically, we need to ensure the event is prevented
    // to make sure it doesn't bubble up and cause issues
    if (isNumpad) {
      event.preventDefault();
      console.log(`  Numpad ${keyNum} pressed, preventing default`);
    } else {
      console.log(`  Number key ${keyNum} pressed`);
    }
    
    if (keyNum === 0) {
      // 0 clears the cell
      console.log('  Clearing cell with 0 key');
      eraseCell();
    } else {
      // 1-9 inputs a number
      console.log(`  Inputting number ${keyNum}`);
      inputNumber(keyNum);
    }
  } else if (event.key === 'Delete' || event.key === 'Backspace') {
    console.log('  Delete/Backspace: Clearing cell');
    eraseCell();
  }
};

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
  console.log('🔍 selectCell called:', { row, col, isShiftKeyPressed: isShiftKeyPressed.value, noteMode: noteMode.value });
  
  // If the cell is read-only, don't select it for multi-selection
  const isCellReadOnly = initialBoard.value[row][col] !== 0;
  console.log('  Cell status:', { isCellReadOnly, currentValue: board.value[row][col] });
  
  if (isShiftKeyPressed.value && !isCellReadOnly) {
    // When shift is pressed, add to selection for notes mode
    const cellPos = { row, col };
    
    // Check if cell is already selected
    const existingIndex = selectedCells.value.findIndex(
      cell => cell.row === row && cell.col === col
    );
    
    if (existingIndex === -1) {
      // Add to multi-selection
      selectedCells.value.push(cellPos);
      console.log('  Added to multi-selection:', selectedCells.value);
    } else {
      // Remove from multi-selection
      selectedCells.value.splice(existingIndex, 1);
      console.log('  Removed from multi-selection:', selectedCells.value);
    }
    
    // Set the last selected cell as the current selected cell
    if (selectedCells.value.length > 0) {
      selectedCell.value = cellPos;
      console.log('  Updated selectedCell to last in multi-selection:', selectedCell.value);
    } else {
      selectedCell.value = null;
      console.log('  Cleared selectedCell, no cells in multi-selection');
    }
  } else {
    // Only clear multi-selection if we're not in note mode or we're clicking on a different cell
    if (!noteMode.value || !selectedCell.value || selectedCell.value.row !== row || selectedCell.value.col !== col) {
      selectedCells.value = [];
      console.log('  Cleared multi-selection array');
    }
    
    // Always add the current cell to selectedCells in note mode if it's not read-only
    if (noteMode.value && !isCellReadOnly && board.value[row][col] === 0) {
      // First check if it's already in the array to avoid duplicates
      const existingIndex = selectedCells.value.findIndex(
        cell => cell.row === row && cell.col === col
      );
      
      if (existingIndex === -1) {
        selectedCells.value.push({ row, col });
        console.log('  Added current cell to selectedCells in note mode:', selectedCells.value);
      }
    }
    
    // Always set the selectedCell for proper keyboard navigation
    selectedCell.value = { row, col };
    console.log('  Set selectedCell to:', selectedCell.value);
    
    // Update selected number if the cell has a value
    const cellValue = board.value[row][col];
    if (cellValue !== 0 && !noteMode.value) {
      selectedNumber.value = cellValue;
      console.log('  Updated selectedNumber to cell value:', selectedNumber.value);
    }
  }
};

// Input a number to the selected cell
const inputNumber = (num: number): void => {
  console.log('📝 inputNumber called:', { num, noteMode: noteMode.value });
  console.log('  Current state:', { 
    selectedCell: selectedCell.value, 
    selectedCells: selectedCells.value.length,
    selectedNumber: selectedNumber.value
  });
  
  // Only update selectedNumber in normal mode (not in note mode)
  // This prevents highlighting of numbers used in notes
  if (!noteMode.value) {
    selectedNumber.value = num;
    console.log('  Updated selectedNumber (normal mode):', selectedNumber.value);
  } else {
    console.log('  Skipped updating selectedNumber (note mode)');
  }
  
  // Check if we have any selected cells in note mode
  if (noteMode.value && selectedCells.value.length > 0) {
    console.log('  Processing notes for selected cells:', selectedCells.value);
    
    // Apply notes to all selected cells when in note mode
    selectedCells.value.forEach(cellPos => {
      const { row, col } = cellPos;
      
      // Skip read-only cells
      if (initialBoard.value[row][col] !== 0) {
        console.log(`  Skipping read-only cell [${row},${col}]`);
        return;
      }
      
      // Skip cells that already have values
      if (board.value[row][col] !== 0) {
        console.log(`  Skipping filled cell [${row},${col}] with value ${board.value[row][col]}`);
        return;
      }
      
      // Toggle note
      const noteIndex = notes[row][col].indexOf(num);
      if (noteIndex === -1) {
        notes[row][col].push(num);
        notes[row][col].sort((a, b) => a - b); // Keep notes ordered
        console.log(`  Added note ${num} to cell [${row},${col}]`, notes[row][col]);
      } else {
        notes[row][col].splice(noteIndex, 1);
        console.log(`  Removed note ${num} from cell [${row},${col}]`, notes[row][col]);
      }
    });
    
    // If this is a multiplayer game, update the game state
    if (props.isMultiplayer && props.gameId && gameSync) {
      gameSync.sendUpdate({
        board: board.value,
        notes: notes,
        errors: errorCount.value
      });
    }
    
    return;
  }
  
  // If we don't have any cells selected or we're not in note mode,
  // but we do have a selected cell, use it
  if (selectedCell.value) {
    console.log('  Processing input for selectedCell:', selectedCell.value);
    
    const { row, col } = selectedCell.value;
    
    // If the cell is read-only, do nothing
    if (initialBoard.value[row][col] !== 0) {
      console.log(`  Can't input in read-only cell [${row},${col}]`);
      return;
    }
    
    // If note mode is on, toggle the note in this cell
    if (noteMode.value) {
      // Skip if the cell already has a value
      if (board.value[row][col] !== 0) {
        console.log(`  Can't add note to filled cell [${row},${col}]`);
        return;
      }
      
      // Add this cell to selectedCells if it's not already there
      if (!selectedCells.value.some(cell => cell.row === row && cell.col === col)) {
        selectedCells.value.push({ row, col });
        console.log(`  Added cell [${row},${col}] to selectedCells`);
      }
      
      // Handle this case by using handleCellUpdate which now properly handles multiple selections
      handleCellUpdate(row, col, num);
      return;
    }
    
    // If we get here, we're in normal mode
    console.log(`  Inputting number ${num} in normal mode to cell [${row},${col}]`);
    
    // Check if we're replacing a number that was previously marked as an error
    const wasError = errors[row][col];
    
    // Input the number
    board.value[row][col] = num;
    console.log(`  Set board value at [${row},${col}] to ${num}`);
    
    // Clear any notes for this cell
    notes[row][col] = [];
    
    // Validate the move
    const isValid = validateMove(row, col, num);
    console.log(`  Move validation: ${isValid ? 'valid' : 'invalid'}`);
    
    // Update error state
    if (wasError && isValid) {
      // If it was an error before but is now valid, decrement error count
      errorCount.value = Math.max(0, errorCount.value - 1);
      errors[row][col] = false;
      console.log(`  Fixed previous error, new error count: ${errorCount.value}`);
    } else if (!wasError && !isValid) {
      // If it wasn't an error before but is now invalid, increment error count
      errorCount.value++;
      errors[row][col] = true;
      console.log(`  New error detected, new error count: ${errorCount.value}`);
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
      console.log('  Puzzle is complete! 🎉');
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
      console.log(`  All instances of number ${num} are now filled!`);
      
      // Reset after animation
      setTimeout(() => {
        numberCompleted.value = null;
      }, 2000);
    }
  } else {
    console.log('  No cell selected, can\'t input number');
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

// Handle cell update event
const handleCellUpdate = (row: number, col: number, value: number): void => {
  console.log('🔄 handleCellUpdate called:', { row, col, value, noteMode: noteMode.value });
  
  // Skip if the cell is read-only
  if (initialBoard.value[row][col] !== 0) {
    console.log(`  Can't update read-only cell [${row},${col}]`);
    return;
  }
  
  // If we're clearing the cell (value = 0), just do it
  if (value === 0) {
    console.log(`  Clearing cell [${row},${col}]`);
    // Clear cell and any notes
    board.value[row][col] = 0;
    notes[row][col] = [];
    errors[row][col] = false;
    
    // Emit the updated board
    emit('update:board', board.value);
    return;
  }
  
  // If in note mode, handle note toggle
  if (noteMode.value) {
    // Skip if cell already has a value
    if (board.value[row][col] !== 0) {
      console.log(`  Can't add note to filled cell [${row},${col}]`);
      return;
    }
    
    // Make sure this cell is selected (both in selectedCells and selectedCell)
    selectedCell.value = { row, col };
    console.log(`  Updated selectedCell to [${row},${col}]`);
    
    // If the cell is not in the selectedCells array, add it
    const isAlreadySelected = selectedCells.value.some(cell => cell.row === row && cell.col === col);
    if (!isAlreadySelected) {
      selectedCells.value.push({ row, col });
      console.log(`  Added cell [${row},${col}] to selectedCells`);
    }
    
    // Get all cells to update (either all selected cells or just the current one)
    const cellsToUpdate = selectedCells.value.length > 1 ? 
      selectedCells.value : 
      [{ row, col }];
      
    console.log(`  Applying note ${value} to ${cellsToUpdate.length} cells:`, cellsToUpdate);
      
    // Apply the note to all cells
    cellsToUpdate.forEach(cellPos => {
      const cellRow = cellPos.row;
      const cellCol = cellPos.col;
      
      // Skip read-only cells and filled cells
      if (initialBoard.value[cellRow][cellCol] !== 0 || board.value[cellRow][cellCol] !== 0) {
        console.log(`  Skipping cell [${cellRow},${cellCol}] (read-only or filled)`);
        return;
      }
      
      // Toggle note for this cell
      const noteIndex = notes[cellRow][cellCol].indexOf(value);
      if (noteIndex === -1) {
        notes[cellRow][cellCol].push(value);
        notes[cellRow][cellCol].sort((a, b) => a - b); // Keep notes ordered
        console.log(`  Added note ${value} to cell [${cellRow},${cellCol}]`, notes[cellRow][cellCol]);
      } else {
        notes[cellRow][cellCol].splice(noteIndex, 1);
        console.log(`  Removed note ${value} from cell [${cellRow},${cellCol}]`, notes[cellRow][cellCol]);
      }
    });
    
    // If this is a multiplayer game, update the game state
    if (props.isMultiplayer && props.gameId && gameSync) {
      gameSync.sendUpdate({
        board: board.value,
        notes: notes,
        errors: errorCount.value
      });
    }
    
    return;
  }
  
  // If we get here, we're in normal mode and inputting a number
  // Update the selected number for normal mode
  selectedNumber.value = value;
  console.log(`  Updated selectedNumber to ${value} (normal mode)`);
  
  // Clear any notes for this cell
  notes[row][col] = [];
  
  // Update the board with the new value
  board.value[row][col] = value;
  console.log(`  Set board value at [${row},${col}] to ${value}`);
  
  // Validate the move
  const isValid = validateMove(row, col, value);
  console.log(`  Move validation: ${isValid ? 'valid' : 'invalid'}`);
  
  // Update error state
  if (!isValid) {
    errorCount.value++;
    errors[row][col] = true;
    console.log(`  New error detected, error count: ${errorCount.value}`);
  } else {
    errorCount.value = Math.max(0, errorCount.value - 1);
    errors[row][col] = false;
  }
  
  // Emit error updates
  if (!isValid) {
    emit('error', errorCount.value);
  }
  
  // Check if the puzzle is complete
  if (isPuzzleComplete()) {
    console.log('  Puzzle is complete! 🎉');
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
};

// Function to check if a cell is part of the multi-selection
const isMultiSelected = (row: number, col: number): boolean => {
  return selectedCells.value.some(cell => cell.row === row && cell.col === col);
};
</script>

<style scoped>
.sudoku-cell {
  width: 100%;
  aspect-ratio: 1 / 1;
}
</style>