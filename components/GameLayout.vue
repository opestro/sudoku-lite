<template>
  <div class="bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-4 sm:py-6">
      <div class="max-w-2xl mx-auto">
        <!-- Game Header -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">Sudoku 1vs1</h1>
          <div class="flex items-center space-x-2 sm:space-x-4">
            <div v-if="isMultiplayer" class="bg-blue-100 px-2 sm:px-3 py-1 rounded-full text-blue-700 text-xs sm:text-sm font-medium">
              Multiplayer
            </div>
            <div class="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-gray-700 text-xs sm:text-sm font-medium flex items-center">
              <span class="mr-1">⏱️</span> {{ formatTime(timer) }}
            </div>
            <button 
              @click="toggleFullscreen" 
              class="bg-gray-100 hover:bg-gray-200 p-1 sm:p-2 rounded-full text-gray-700"
              title="Toggle fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Game Content -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
          <slot></slot>
        </div>
        
        <!-- Game Footer -->
        <div class="mt-4 sm:mt-6 text-center text-gray-500 text-xs sm:text-sm px-2">
          <p class="hidden sm:block">Tip: Click on a number then click on a cell to fill it, or select a cell first then pick a number.</p>
          <p class="sm:hidden">Tap a cell to select it, then tap a number to fill.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  isMultiplayer?: boolean;
}>();

const timer = ref(0);
let interval: number | null = null;

onMounted(() => {
  // Start the timer
  interval = window.setInterval(() => {
    timer.value++;
  }, 1000);
});

onBeforeUnmount(() => {
  // Clean up the timer
  if (interval !== null) {
    window.clearInterval(interval);
  }
});

// Toggle fullscreen mode
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

// Format time as MM:SS
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
</script> 