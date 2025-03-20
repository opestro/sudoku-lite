<template>
  <div 
    class="sudoku-cell relative flex items-center justify-center border-gray-300 text-base md:text-xl font-medium transition-all duration-200"
    :class="{
      'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-inner': isSelected,
      'bg-gradient-to-br from-indigo-300 to-indigo-400 text-white': isMultiSelected && !isSelected,
      'bg-indigo-50': isHighlighted && !isSelected && !isSameNumber && !isMultiSelected,
      'bg-gradient-to-br from-green-100 to-emerald-100': isSameNumber && !isSelected && !isMultiSelected,
      'bg-red-100 border-red-300': hasError,
      'cursor-pointer hover:bg-gradient-to-br hover:from-purple-400 hover:to-indigo-400 hover:text-white hover:shadow-inner transform hover:scale-[1.02]': !isReadOnly,
      'font-bold': isReadOnly,
      'text-indigo-700': !isReadOnly && value && !isSelected && !isSameNumber && !isMultiSelected,
      'font-semibold': isSameNumber || isSelected || isMultiSelected,
      'border-r border-b': true,
      'border-r-2 border-r-indigo-800': (col + 1) % 3 === 0 && col < 8,
      'border-b-2 border-b-indigo-800': (row + 1) % 3 === 0 && row < 8,
      'border-l-2 border-l-indigo-800': col === 0,
      'border-t-2 border-t-indigo-800': row === 0,
      'read-only': isReadOnly
    }"
    @click="handleClick"
    @touchstart.passive="handleTouchStart"
    @touchend.prevent="handleTouchEnd"
    tabindex="0"
    @keydown="handleKeyDown"
    :aria-label="`Sudoku cell row ${row + 1}, column ${col + 1}${value ? ', value ' + value : ''}`"
  >
    <span :class="{'animate-pulse': isSelected && value, 'font-bold': isSameNumber && !isSelected}">{{ value || '' }}</span>
    
    <!-- Notes grid - adaptive sizing for smaller screens -->
    <div v-if="!value && notes && notes.length > 0" class="absolute inset-0 grid grid-cols-3 grid-rows-3 p-0.5">
      <div 
        v-for="n in 9" 
        :key="n" 
        class="flex items-center justify-center text-[6px] md:text-[8px]"
        :class="{
          'text-gray-400': !notes.includes(n),
          'text-indigo-600 font-bold': notes.includes(n)
        }"
      >
        {{ notes.includes(n) ? n : '' }}
      </div>
    </div>
    
    <!-- Note mode indicator - enhanced yellow glow in the corner -->
    <div 
      v-if="isNoteModeActive && !isReadOnly && !value" 
      class="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-yellow-100 shadow-sm"
      aria-hidden="true"
    ></div>
  </div>
</template>

<script setup>
const props = defineProps({
  row: {
    type: Number,
    required: true
  },
  col: {
    type: Number,
    required: true
  },
  value: {
    type: Number,
    default: 0
  },
  isReadOnly: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  isMultiSelected: {
    type: Boolean,
    default: false
  },
  isHighlighted: {
    type: Boolean,
    default: false
  },
  isSameNumber: {
    type: Boolean,
    default: false
  },
  hasError: {
    type: Boolean,
    default: false
  },
  isNoteModeActive: {
    type: Boolean,
    default: false
  },
  notes: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['select', 'update']);

// Click handler
function handleClick(event) {
  console.log('🖱️ Cell clicked:', { row: props.row, col: props.col, value: props.value });
  console.log('  Cell state:', { 
    isSelected: props.isSelected, 
    isMultiSelected: props.isMultiSelected,
    isReadOnly: props.isReadOnly,
    noteMode: props.isNoteModeActive
  });
  
  emit('select', props.row, props.col);
}

// Handle touch events for mobile
function handleTouchStart(event) {
  console.log('👆 Touch start on cell:', { row: props.row, col: props.col });
  
  // Add visual feedback for touch start
  const target = event.currentTarget;
  target.style.opacity = '0.7';
  target.style.transform = 'scale(0.97)';
  
  // Set a timeout to restore normal appearance if touch does not complete
  setTimeout(() => {
    target.style.opacity = '1';
    target.style.transform = '';
  }, 300);
}

// Touch end handler
function handleTouchEnd(event) {
  console.log('👆 Touch end on cell:', { row: props.row, col: props.col });
  
  // Reset visual feedback
  const target = event.currentTarget;
  target.style.opacity = '1';
  target.style.transform = '';
  
  emit('select', props.row, props.col);
}

// Handle keyboard events
function handleKeyDown(event) {
  console.log('⌨️ Keyboard event on cell:', { 
    row: props.row, 
    col: props.col, 
    key: event.key, 
    code: event.code,
    isNoteModeActive: props.isNoteModeActive
  });
  
  // Skip if the cell is read-only
  if (props.isReadOnly) {
    console.log('  Cell is read-only, ignoring keyboard input');
    return;
  }
  
  // Check if this is a numpad key (needs special handling)
  const isNumpad = event.code && event.code.startsWith('Numpad');
  const keyNum = parseInt(event.key);
  
  console.log('  Parsed key info:', { isNumpad, keyNum });
  
  // Handle number keys (both top row and numpad)
  if (!isNaN(keyNum) && keyNum >= 0 && keyNum <= 9) {
    // Always prevent default for number keys to avoid double input
    event.preventDefault();
    
    // For numpad keys, also stop propagation to prevent the global handler from processing it
    if (isNumpad) {
      console.log('  Stopping propagation for numpad key to prevent double handling');
      event.stopPropagation();
    }
    
    if (keyNum === 0) {
      // 0 or Delete will clear the cell
      console.log('  Emitting clear cell (0)');
      emit('update', 0);
    } else {
      // 1-9 will set the value
      console.log(`  Emitting update with value ${keyNum}`);
      emit('update', keyNum);
    }
  } else if (event.key === 'Delete' || event.key === 'Backspace') {
    // Delete or Backspace will clear the cell
    event.preventDefault();
    console.log('  Emitting clear cell (Delete/Backspace)');
    emit('update', 0);
  } else {
    console.log('  No action taken for this key');
  }
}
</script>

<style scoped>
.sudoku-cell {
  width: 100%;
  aspect-ratio: 1 / 1;
  touch-action: manipulation; /* Prevent double-tap zoom on mobile */
}

/* Add a subtle touch feedback effect for mobile */
@media (hover: none) {
  .sudoku-cell:active {
    background-color: rgba(79, 70, 229, 0.2); /* indigo-600 with opacity */
    transform: scale(0.97);
  }
}

/* Add focus styles for keyboard navigation */
.sudoku-cell:focus {
  outline: 2px solid rgb(99, 102, 241); /* indigo-500 */
  outline-offset: -2px;
  z-index: 1;
}

/* Animation for read-only cells */
.read-only {
  background-image: linear-gradient(135deg, rgba(224, 231, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(224, 231, 255, 0.2) 50%, rgba(224, 231, 255, 0.2) 75%, transparent 75%, transparent);
  background-size: 16px 16px;
}
</style> 