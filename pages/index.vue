<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2">Sudoku 1vs1</h1>
        <p class="text-xl text-gray-600">Challenge your friends to Sudoku duels in real-time!</p>
      </div>
      
      <!-- Auth/Guest section -->
      <client-only>
        <div v-if="!currentUser" class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 class="text-2xl font-bold mb-4">Start Playing</h2>
          <div class="flex flex-col space-y-4">
            <button 
              class="py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              @click="loginAsGuest"
            >
              Play as Guest
            </button>
            <div class="flex items-center">
              <div class="flex-1 h-px bg-gray-300"></div>
              <div class="px-4 text-gray-500">or</div>
              <div class="flex-1 h-px bg-gray-300"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                class="py-3 px-6 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                @click="navigateTo('/login')"
              >
                Login
              </button>
              <button 
                class="py-3 px-6 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                @click="navigateTo('/register')"
              >
                Register
              </button>
            </div>
          </div>
        </div>
        
        <!-- Game options for logged in users -->
        <div v-else class="bg-white rounded-lg shadow-md p-6 mb-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">Welcome, {{ currentUser.name || 'Player' }}!</h2>
            <button 
              class="text-sm text-gray-600 hover:text-red-500 transition"
              @click="logout"
            >
              Logout
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-blue-50 p-6 rounded-lg">
              <h3 class="text-xl font-semibold mb-4">Quick Play</h3>
              <div class="flex flex-col space-y-4">
                <button 
                  class="py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                  @click="navigateTo('/game')"
                >
                  Start Practice Game
                </button>
                <button 
                  class="py-3 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  @click="navigateTo('/game?mode=create')"
                >
                  Create Game Room
                </button>
              </div>
            </div>
            
            <div class="bg-purple-50 p-6 rounded-lg">
              <h3 class="text-xl font-semibold mb-4">Join Game</h3>
              <form @submit.prevent="joinGame" class="flex flex-col space-y-4">
                <div>
                  <label for="game-code" class="block text-sm font-medium text-gray-700 mb-1">
                    Game Code
                  </label>
                  <input 
                    id="game-code"
                    v-model="gameCode" 
                    type="text" 
                    placeholder="Enter game code" 
                    class="w-full py-2 px-4 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  class="py-3 px-6 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
                >
                  Join Game
                </button>
              </form>
            </div>
          </div>
        </div>
      </client-only>
      
      <!-- Game features section -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-semibold mb-2">Real-time Competition</h3>
          <p class="text-gray-600">
            Challenge your friends to Sudoku duels and see who can solve puzzles faster.
          </p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-semibold mb-2">Multiple Difficulty Levels</h3>
          <p class="text-gray-600">
            Choose from easy, medium, or hard puzzles to match your skill level.
          </p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-semibold mb-2">Track Your Progress</h3>
          <p class="text-gray-600">
            Keep track of your stats and improve your Sudoku solving skills over time.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePocketbase } from '~/composables/usePocketbase';

const { pb, currentUser, loginAsGuest, logout } = usePocketbase();
const gameCode = ref('');

// Join game with code
const joinGame = () => {
  if (gameCode.value) {
    navigateTo(`/game?mode=join&code=${gameCode.value}`);
  }
};
</script>

<style scoped>
/* Component specific styles can be added here */
</style>