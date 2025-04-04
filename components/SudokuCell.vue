<template>
  <div 
    class="sudoku-cell relative flex items-center justify-center border-gray-300 text-base md:text-xl font-medium transition-colors"
    :class="{
      'bg-blue-500 text-white': isSelected,
      'bg-blue-300': isMultiSelected && !isSelected,
      'bg-blue-100': isHighlighted && !isSelected && !isSameNumber && !isMultiSelected,
      'bg-green-200': isSameNumber && !isSelected && !isMultiSelected,
      'bg-red-100': hasError,
      'cursor-pointer hover:bg-orange-400 hover:text-white': !isReadOnly,
      'font-bold': isReadOnly,
      'text-blue-600': !isReadOnly && value && !isSelected && !isSameNumber && !isMultiSelected,
      'font-semibold': isSameNumber || isSelected || isMultiSelected,
      'border-r border-b': true,
      'border-r-2 border-r-slate-800': (col + 1) % 3 === 0 && col < 8,
      'border-b-2 border-b-slate-800': (row + 1) % 3 === 0 && row < 8,
      'border-l-2 border-l-slate-800': col === 0,
      'border-t-2 border-t-slate-800': row === 0,
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
          'text-blue-600 font-bold': notes.includes(n)
        }"
      >
        {{ notes.includes(n) ? n : '' }}
      </div>
    </div>
    
    <!-- Note mode indicator - small dot in the corner -->
    <div 
      v-if="isNoteModeActive && !isReadOnly && !value" 
      class="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-yellow-400"
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

// New click handler for better debugging
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

// Handle touch events better on mobile
function handleTouchStart(event) {
  console.log('👆 Touch start on cell:', { row: props.row, col: props.col });
  
  // Add visual feedback for touch start
  const target = event.currentTarget;
  target.style.opacity = '0.7';
  
  // Set a timeout to restore normal appearance if touch does not complete
  setTimeout(() => {
    target.style.opacity = '1';
  }, 300);
}

// Add touch end handler for debugging
function handleTouchEnd(event) {
  console.log('👆 Touch end on cell:', { row: props.row, col: props.col });
  emit('select', props.row, props.col);
}

// Handle keyboard events for PC users
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
    background-color: rgba(59, 130, 246, 0.1);
  }
}

/* Add focus styles for keyboard navigation */
.sudoku-cell:focus {
  outline: 2px solid var(--color-blue-500);
  outline-offset: -2px;
  z-index: 1;
}
</style> 