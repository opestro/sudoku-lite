<template>
  <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 sm:py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Header section with animated logo -->
        <div class="text-center mb-8 sm:mb-12">
          <div class="inline-block animate-float mb-3">
            <div class="bg-white p-3 rounded-xl shadow-lg transform rotate-6 transition-transform hover:rotate-0">
              <div class="grid grid-cols-3 gap-0.5 w-16 h-16 sm:w-20 sm:h-20">
                <div v-for="i in 9" :key="i" class="bg-indigo-500 rounded-sm flex items-center justify-center text-white font-bold" :class="i % 2 === 0 ? 'bg-indigo-600' : 'bg-indigo-500'">
                  {{ i % 9 + 1 }}
                </div>
              </div>
            </div>
          </div>
          <h1 class="text-4xl sm:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Sudoku 1vs1</h1>
          <p class="text-xl text-gray-600 max-w-lg mx-auto">Challenge your friends to Sudoku duels in real-time and become the puzzle champion!</p>
        </div>
        
        <!-- Auth/Guest section with improved design -->
        <client-only>
          <div v-if="!currentUser" class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 transform transition-all hover:scale-[1.01]">
            <h2 class="text-2xl font-bold mb-4 text-gray-800">Ready to Play?</h2>
            <div class="flex flex-col space-y-4">
              <button 
                class="py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition duration-300 transform hover:translate-y-[-2px] font-medium text-lg"
                @click="loginAsGuest"
              >
                <span class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                  Play as Guest
                </span>
              </button>
              <div class="flex items-center my-2">
                <div class="flex-1 h-px bg-gray-200"></div>
                <div class="px-4 text-gray-500 text-sm">or join the community</div>
                <div class="flex-1 h-px bg-gray-200"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  class="py-3 px-6 bg-white text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition duration-300 flex items-center justify-center"
                  @click="navigateTo('/login')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  Login
                </button>
                <button 
                  class="py-3 px-6 bg-white text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-50 transition duration-300 flex items-center justify-center"
                  @click="navigateTo('/register')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Register
                </button>
              </div>
            </div>
          </div>
          
          <!-- Game options for logged in users -->
          <div v-else class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 transform transition-all hover:scale-[1.01]">
            <div class="flex flex-wrap justify-between items-center mb-6">
              <div class="flex items-center mb-2 sm:mb-0">
                <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3">
                  {{ currentUser?.['name'] ? String(currentUser['name']).substring(0, 1).toUpperCase() : 'P' }}
                </div>
                <h2 class="text-2xl font-bold text-gray-800">Welcome, {{ currentUser?.['name'] || 'Player' }}!</h2>
              </div>
              <button 
                class="text-sm text-gray-600 hover:text-red-500 transition flex items-center"
                @click="logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 4a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clip-rule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl">
                <h3 class="text-xl font-semibold mb-4 text-indigo-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Play
                </h3>
                <div class="flex flex-col space-y-4">
                  <button 
                    class="py-3 px-6 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                    @click="navigateTo('/game')"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                    Start Practice Game
                  </button>
                  <button 
                    class="py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                    @click="navigateTo('/game?mode=create')"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Create Game Room
                  </button>
                </div>
              </div>
              
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h3 class="text-xl font-semibold mb-4 text-purple-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Join Game
                </h3>
                <form @submit.prevent="joinGame" class="flex flex-col space-y-4">
                  <div>
                    <label for="game-code" class="block text-sm font-medium text-gray-700 mb-1">
                      Game Code
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <input 
                        id="game-code"
                        v-model="gameCode" 
                        type="text" 
                        placeholder="Enter game code" 
                        class="w-full py-3 px-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-white bg-opacity-80"
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    class="py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                    Join Game
                  </button>
                </form>
              </div>
            </div>
          </div>
        </client-only>
        
        <!-- Game features section with cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div class="w-12 h-12 bg-indigo-100 rounded-xl mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Real-time Competition</h3>
            <p class="text-gray-600">
              Challenge your friends to exciting Sudoku duels and see who can solve puzzles faster. Race to fill the grid!
            </p>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div class="w-12 h-12 bg-purple-100 rounded-xl mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Multiple Difficulty Levels</h3>
            <p class="text-gray-600">
              Choose from easy, medium, or hard puzzles to match your skill level and progressively challenge yourself.
            </p>
          </div>
          <div class="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div class="w-12 h-12 bg-pink-100 rounded-xl mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-800">Track Your Progress</h3>
            <p class="text-gray-600">
              Keep track of your stats, improve your solving speed, and watch your Sudoku skills grow over time.
            </p>
          </div>
        </div>
        
        <!-- Testimonials/social proof -->
        <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h3 class="text-2xl font-bold text-center text-gray-800 mb-6">What Our Players Say</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl">
              <div class="flex items-start">
                <div class="text-indigo-400 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div>
                  <p class="text-gray-600 italic mb-2">The real-time battles make Sudoku so much more exciting! I've improved my speed significantly competing against friends.</p>
                  <p class="font-medium text-indigo-600">- Sarah J.</p>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
              <div class="flex items-start">
                <div class="text-purple-400 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div>
                  <p class="text-gray-600 italic mb-2">I love how easy it is to jump into a game. The multiple difficulty levels keep me challenged as I improve.</p>
                  <p class="font-medium text-purple-600">- Michael T.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- CTA section -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-center text-white">
          <h3 class="text-2xl font-bold mb-4">Ready for the challenge?</h3>
          <p class="mb-6">Join thousands of players and put your Sudoku skills to the test!</p>
          <button 
            class="py-4 px-8 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition duration-300 shadow-lg transform hover:scale-105 font-bold"
            @click="!currentUser ? loginAsGuest() : navigateTo('/game')"
          >
            Start Playing Now
          </button>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <footer class="bg-gray-50 py-6 mt-12">
      <div class="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>Made with ❤️ for puzzle enthusiasts</p>
      </div>
    </footer>
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
/* Animation for the logo */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>