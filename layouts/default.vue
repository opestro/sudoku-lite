<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-blue-600">
          Sudoku 1vs1
        </NuxtLink>
        
        <nav class="flex items-center space-x-4">
          <NuxtLink to="/" class="text-gray-700 hover:text-blue-600">
            Home
          </NuxtLink>
          <NuxtLink to="/game" class="text-gray-700 hover:text-blue-600">
            Play
          </NuxtLink>
          <client-only>
            <template v-if="currentUser">
              <span class="text-sm text-gray-500">{{ currentUser.name || 'Player' }}</span>
              <button 
                class="text-sm text-gray-500 hover:text-red-500"
                @click="logout"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="text-gray-700 hover:text-blue-600">
                Login
              </NuxtLink>
              <NuxtLink 
                to="/register" 
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Register
              </NuxtLink>
            </template>
          </client-only>
        </nav>
      </div>
    </header>
    
    <main class="flex-1">
      <slot />
    </main>
    
    <footer class="bg-white border-t border-gray-200 py-6">
      <div class="container mx-auto px-4 text-center text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} Sudoku 1vs1. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { usePocketbase } from '~/composables/usePocketbase';

const { currentUser, logout } = usePocketbase();
</script>

