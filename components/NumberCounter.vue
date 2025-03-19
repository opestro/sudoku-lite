<template>
  <div class="flex justify-center mb-2 mt-4">
    <div class="grid grid-cols-9 gap-1">
      <div 
        v-for="n in 9" 
        :key="n" 
        class="w-6 h-8 flex flex-col items-center"
      >
        <div class="text-xs font-medium">{{ n }}</div>
        <div 
          class="h-4 w-full rounded-sm mt-1" 
          :class="getColorClass(n)"
        >
          <div 
            class="text-[8px] text-center font-medium"
            :class="{ 'text-white': counts[n-1] > 7 }"
          >
            {{ counts[n-1] }}/9
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  board: {
    type: Array,
    required: true
  }
});

// Count occurrences of each number on the board
const counts = computed(() => {
  const result = Array(9).fill(0);
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = props.board[row][col];
      if (val > 0 && val <= 9) {
        result[val - 1]++;
      }
    }
  }
  
  return result;
});

// Get color class based on count
const getColorClass = (num) => {
  const count = counts.value[num - 1];
  if (count === 9) return 'bg-green-500';
  if (count >= 7) return 'bg-green-400';
  if (count >= 5) return 'bg-blue-400';
  if (count >= 3) return 'bg-blue-300';
  return 'bg-gray-300';
};
</script> 