<template>
  <div 
    class="sudoku-cell relative flex items-center justify-center border-gray-300 text-base md:text-xl font-medium transition-colors"
    :class="{
      'bg-blue-500 text-white': isSelected,
      'bg-blue-100': isHighlighted && !isSelected && !isSameNumber,
      'bg-green-200': isSameNumber && !isSelected,
      'bg-red-100': hasError,
      'cursor-pointer hover:bg-gray-50': !isReadOnly,
      'font-bold': isReadOnly,
      'text-blue-600': !isReadOnly && value && !isSelected && !isSameNumber,
      'font-semibold': isSameNumber || isSelected,
      'border-r border-b': true,
      'border-r-2 border-r-slate-800': (col + 1) % 3 === 0 && col < 8,
      'border-b-2 border-b-slate-800': (row + 1) % 3 === 0 && row < 8,
      'border-l-2 border-l-slate-800': col === 0,
      'border-t-2 border-t-slate-800': row === 0,
      'read-only': isReadOnly
    }"
    @click="$emit('select', row, col)"
    @touchstart.passive="handleTouchStart"
    @touchend.prevent="$emit('select', row, col)"
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
  </div>
</template>

<script setup lang="ts">
defineProps<{
  row: number;
  col: number;
  value: number;
  isReadOnly?: boolean;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isSameNumber?: boolean;
  hasError?: boolean;
  notes?: number[];
}>();

defineEmits<{
  (e: 'select', row: number, col: number): void;
}>();

// Handle touch events better on mobile
function handleTouchStart(event: TouchEvent) {
  // Add visual feedback for touch start
  const target = event.currentTarget as HTMLElement;
  target.style.opacity = '0.7';
  
  // Set a timeout to restore normal appearance if touch does not complete
  setTimeout(() => {
    target.style.opacity = '1';
  }, 300);
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
</style> 