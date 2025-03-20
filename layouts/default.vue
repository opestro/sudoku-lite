<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
    <header class="bg-white  border-b border-gray-200 backdrop-blur-sm bg-opacity-90 sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3 flex flex-wrap md:flex-nowrap items-center justify-between">
        <NuxtLink to="/" class="flex items-center space-x-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          <!-- Animated mini Sudoku grid logo -->
          <div class="w-10 h-10 grid grid-cols-3 gap-px bg-white p-1 rounded-lg shadow-sm transform transition-all duration-300 hover:rotate-6">
            <div v-for="i in 9" :key="i" class="bg-gradient-to-br rounded-[1px] flex items-center justify-center text-white text-[7px]" 
                :class="i % 2 === 0 ? 'from-indigo-500 to-indigo-600' : 'from-purple-500 to-purple-600'">
              {{ i % 9 + 1 }}
            </div>
          </div>
          <span class="text-xl md:text-2xl">Sudoku 1vs1</span>
        </NuxtLink>
        
        <nav class="flex items-center space-x-1 sm:space-x-4">
          <NuxtLink to="/" class="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </NuxtLink>
          <NuxtLink to="/game" class="px-3 py-2 text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center nav-link">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Play
          </NuxtLink>
          <client-only>
            <template v-if="currentUser">
              <div class="flex items-center ml-2 space-x-3">
                <div class="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5 rounded-lg shadow-sm">
                  <div class="w-7 h-7 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold shadow-inner">
                    {{ currentUser?.['name'] ? String(currentUser['name']).substring(0, 1).toUpperCase() : 'P' }}
                  </div>
                  <span class="text-sm text-gray-700 font-medium">{{ currentUser?.['name'] || 'Player' }}</span>
                </div>
                <button 
                  class="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  @click="logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span class="hidden sm:inline">Logout</span>
                </button>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center space-x-2">
                <NuxtLink to="/login" class="px-3 py-1.5 text-gray-700 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </NuxtLink>
                <NuxtLink 
                  to="/register" 
                  class="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition transform hover:translate-y-[-1px] flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </NuxtLink>
              </div>
            </template>
          </client-only>
        </nav>
      </div>
    </header>
    
    <main class="flex-1">
      <slot />
    </main>
    
    <footer class="bg-white shadow-inner py-6">
      <div class="container mx-auto px-4">
        <div class="max-w-5xl mx-auto">
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="flex items-center mb-4 md:mb-0">
              <div class="w-8 h-8 grid grid-cols-3 gap-px bg-white p-1 rounded-md shadow-sm mr-3">
                <div v-for="i in 9" :key="i" class="rounded-[1px] flex items-center justify-center"
                    :class="i % 2 === 0 ? 'bg-indigo-400' : 'bg-purple-400'"></div>
              </div>
              <div>
                <p class="text-gray-500">&copy; {{ new Date().getFullYear() }} Sudoku 1vs1</p>
                <p class="text-gray-400 text-xs">Made with ❤️ for puzzle enthusiasts</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-5">
              <a href="#" class="text-gray-400 hover:text-indigo-600 transition transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-indigo-600 transition transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-indigo-600 transition transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>
          
          <!-- Quick links -->
          <div class="pt-5 mt-5 border-t border-gray-100 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-500">
            <a href="#" class="hover:text-indigo-600 transition">Privacy Policy</a>
            <a href="#" class="hover:text-indigo-600 transition">Terms of Service</a>
            <a href="#" class="hover:text-indigo-600 transition">Contact Us</a>
            <a href="#" class="hover:text-indigo-600 transition">About</a>
            <a href="#" class="hover:text-indigo-600 transition">Help & Support</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { usePocketbase } from '~/composables/usePocketbase';

const { currentUser, logout } = usePocketbase();
</script>

<style scoped>
/* Add animations for interactive elements */
@keyframes pulse-gentle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.nav-link.router-link-active {
  color: rgb(79, 70, 229); /* indigo-600 */
  background-color: rgb(238, 242, 255); /* indigo-50 */
}
</style>

