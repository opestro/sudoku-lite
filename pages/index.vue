<template>
  <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 sm:py-12">
      <div class="max-w-5xl mx-auto">
        <!-- Hero section with animated 3D logo -->
        <div class="text-center mb-12 sm:mb-16">
          <div class="inline-block animate-float mb-6">
            <div class="bg-white p-4 rounded-2xl shadow-2xl transform rotate-6 transition-transform hover:rotate-0 hover:scale-110">
              <div class="grid grid-cols-3 gap-1 w-24 h-24 sm:w-28 sm:h-28">
                <div v-for="i in 9" :key="i" 
                  class="bg-gradient-to-br rounded-md flex items-center justify-center text-white font-bold text-lg"
                  :class="i % 2 === 0 ? 'from-indigo-500 to-indigo-700' : 'from-purple-500 to-purple-700'">
                  {{ i % 9 + 1 }}
                </div>
              </div>
            </div>
          </div>
          <h1 class="text-5xl sm:text-6xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Sudoku 1vs1</h1>
          <p class="text-xl text-gray-600 max-w-xl mx-auto">Challenge your friends to real-time Sudoku battles and prove you're the ultimate puzzle master!</p>
        </div>
        
        <!-- Auth/Guest section with improved design -->
        <client-only>
          <div v-if="!currentUser" class="bg-white backdrop-blur-sm bg-opacity-90 rounded-3xl p-8 sm:p-10 mb-12">
            <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">Ready to Play?</h2>
            <div class="flex flex-col space-y-5">
              <button 
                class="group py-5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition duration-300 transform hover:translate-y-[-2px] font-medium text-lg"
                @click="loginAsGuest"
              >
                <span class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 group-hover:animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                  </svg>
                  Play as Guest
                </span>
              </button>
              <div class="flex items-center my-4">
                <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                <div class="px-6 text-gray-500">or join the community</div>
                <div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  class="py-4 px-6 bg-white text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition duration-300 flex items-center justify-center shadow-sm"
                  @click="navigateTo('/login')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  Login
                </button>
                <button 
                  class="py-4 px-6 bg-white text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-50 transition duration-300 flex items-center justify-center shadow-sm"
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
          <div v-else class="bg-white backdrop-blur-sm bg-opacity-90 rounded-3xl  p-8 sm:p-10 mb-12 transform transition-all hover:scale-[1.02]">
            <div class="flex flex-wrap justify-between items-center mb-8">
              <div class="flex items-center mb-3 sm:mb-0">
                <div class="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold mr-4 shadow-sm">
                  {{ currentUser?.['name'] ? String(currentUser['name']).substring(0, 1).toUpperCase() : 'P' }}
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-800">Welcome, {{ currentUser?.['name'] || 'Player' }}!</h2>
                  <p class="text-gray-500 text-sm">Ready for your next challenge?</p>
                </div>
              </div>
              <button 
                class="text-sm text-gray-600 hover:text-red-500 transition flex items-center bg-white py-2 px-4 rounded-lg shadow-sm hover:shadow-md"
                @click="logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 4a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L12 12.586V7z" clip-rule="evenodd" />
                </svg>
                Logout
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl shadow-md transform transition-all hover:scale-[1.03]">
                <h3 class="text-xl font-bold mb-5 text-indigo-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Play
                </h3>
                <div class="flex flex-col space-y-4">
                  <button 
                    class="py-4 px-6 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition duration-300 transform hover:translate-y-[-2px] flex items-center justify-center font-medium"
                    @click="navigateTo('/game')"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                    Start Practice Game
                  </button>
                  <button 
                    class="py-4 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition duration-300 transform hover:translate-y-[-2px] flex items-center justify-center font-medium"
                    @click="navigateTo('/game?mode=create')"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    Create Game Room
                  </button>
                </div>
              </div>
              
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-md transform transition-all hover:scale-[1.03]">
                <h3 class="text-xl font-bold mb-5 text-purple-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Join Game
                </h3>
                <form @submit.prevent="joinGame" class="flex flex-col space-y-4">
                  <div>
                    <label for="game-code" class="block text-sm font-medium text-gray-700 mb-2">
                      Game Code
                    </label>
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <input 
                        id="game-code"
                        v-model="gameCode" 
                        type="text" 
                        placeholder="Enter game code" 
                        class="w-full py-4 px-11 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition shadow-sm"
                        required
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    class="py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition duration-300 transform hover:translate-y-[-2px] flex items-center justify-center font-medium"
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
        
        <!-- Game features section with improved card design -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl  p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-800">Real-time Competition</h3>
            <p class="text-gray-600">
              Challenge your friends to exciting Sudoku duels and see who can solve puzzles faster. Race against time and outsmart your opponents!
            </p>
          </div>
          <div class="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl  p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-800">Multiple Difficulty Levels</h3>
            <p class="text-gray-600">
              Choose from easy, medium, or hard puzzles to match your skill level. Progressively challenge yourself and become a Sudoku master!
            </p>
          </div>
          <div class="bg-white backdrop-blur-sm bg-opacity-90 rounded-2xl  p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div class="w-16 h-16 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-800">Track Your Progress</h3>
            <p class="text-gray-600">
              Keep track of your stats, improve your solving speed, and watch your Sudoku skills grow. Climb the leaderboard and earn bragging rights!
            </p>
          </div>
        </div>
        
        <!-- Testimonials with improved design -->
        <div class="bg-white backdrop-blur-sm bg-opacity-90 rounded-3xl  p-8 sm:p-10 mb-12">
          <h3 class="text-3xl font-bold text-center text-gray-800 mb-8">What Our Players Say</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl  transform transition-all hover:scale-[1.02]">
              <div class="flex items-start">
                <div class="text-indigo-400 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div>
                  <p class="text-gray-600 italic mb-4 text-lg">The real-time battles make Sudoku so much more exciting! I've improved my speed significantly competing against friends.</p>
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3">S</div>
                    <p class="font-medium text-indigo-600">Sarah J.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl transform transition-all hover:scale-[1.02]">
              <div class="flex items-start">
                <div class="text-purple-400 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div>
                  <p class="text-gray-600 italic mb-4 text-lg">I love how easy it is to jump into a game. The multiple difficulty levels keep me challenged as I improve.</p>
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mr-3">M</div>
                    <p class="font-medium text-purple-600">Michael T.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- CTA section with enhanced design -->
        <div class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl  p-12 text-center text-white mb-8">
          <h3 class="text-3xl font-bold mb-4">Ready for the challenge?</h3>
          <p class="mb-8 text-lg opacity-90">Join thousands of players and put your Sudoku skills to the test!</p>
          <button 
            class="py-5 px-10 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition duration-300  transform hover:scale-105 font-bold text-lg"
            @click="!currentUser ? loginAsGuest() : navigateTo('/game')"
          >
            Start Playing Now
          </button>
          <div class="mt-8 flex justify-center space-x-6">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-indigo-100">Quick Games</span>
            </div>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span class="text-purple-100">Challenge Friends</span>
            </div>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span class="text-pink-100">Free to Play</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer with social sharing buttons -->
    <!-- <footer class="bg-white shadow-inner py-8">
      <div class="container mx-auto px-4">
        <div class="max-w-5xl mx-auto">
          <div class="flex flex-col md:flex-row items-center justify-between mb-6">
            <p class="text-gray-600 mb-4 md:mb-0">&copy; {{ new Date().getFullYear() }} Sudoku 1vs1. All rights reserved.</p>
            
            <div class="flex items-center space-x-6">
              <a href="#" class="text-gray-400 hover:text-indigo-600 transition transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-indigo-600 transition transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-indigo-600 transition transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>
          
          
          <div class="flex flex-col items-center justify-center pt-4 border-t border-gray-100">
            <p class="text-gray-500 text-sm mb-3">Enjoyed playing? Share with friends!</p>
            <div class="flex space-x-4">
              <button class="bg-[#3b5998] text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
                Share
              </button>
              <button class="bg-[#1DA1F2] text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-500 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                Tweet
              </button>
              <button class="bg-green-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-green-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer> -->
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