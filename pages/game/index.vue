<template>
  <div>
    <div v-if="!gameStarted"
      class="bg-gradient-to-b from-indigo-100 to-purple-50 min-h-screen flex items-center justify-center">
      <div class="container max-w-md mx-auto px-4 py-8">
        <div class="text-center mb-8">
          <div class="inline-block mb-4 animate-bounce-gentle">
            <div class="bg-white p-3 rounded-2xl transform rotate-3 transition-transform hover:rotate-0">
              <div class="grid grid-cols-3 gap-0.5 w-20 h-20">
                <div v-for="i in 9" :key="i" class="flex items-center justify-center text-white font-bold rounded-sm"
                  :class="i % 2 === 0 ? 'bg-indigo-600' : 'bg-purple-600'">
                  {{ i % 9 + 1 }}
                </div>
              </div>
            </div>
          </div>
          <h1
            class="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Sudoku 1vs1</h1>
          <p class="text-gray-600">Challenge friends and prove your puzzle skills!</p>
        </div>

        <div class="bg-white rounded-2xl p-8 mb-6 ">
          <h2 class="text-2xl font-bold mb-6 text-gray-800 text-center">Game Options</h2>

          <div class="mb-6">
            <p class="text-gray-700 font-medium mb-2">Difficulty Level:</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <label class="flex flex-col p-3 border rounded-lg cursor-pointer transition-all h-full" 
                :class="selectedDifficulty === 'easy' ? 'bg-green-50 border-green-300 shadow-sm' : 'bg-white border-gray-200 hover:bg-green-50'">
                <div class="flex items-center mb-1">
                  <input type="radio" v-model="selectedDifficulty" value="easy" class="mr-2">
                  <span class="font-medium text-green-600">Easy</span>
                  <span class="ml-auto text-green-500">🍃</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Perfect for beginners with many clues given.</p>
              </label>
              
              <label class="flex flex-col p-3 border rounded-lg cursor-pointer transition-all h-full" 
                :class="selectedDifficulty === 'medium' ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-gray-200 hover:bg-blue-50'">
                <div class="flex items-center mb-1">
                  <input type="radio" v-model="selectedDifficulty" value="medium" class="mr-2">
                  <span class="font-medium text-blue-600">Medium</span>
                  <span class="ml-auto text-blue-500">💧</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Balanced challenge requiring some strategy.</p>
              </label>
              
              <label class="flex flex-col p-3 border rounded-lg cursor-pointer transition-all h-full" 
                :class="selectedDifficulty === 'hard' ? 'bg-red-50 border-red-300 shadow-sm' : 'bg-white border-gray-200 hover:bg-red-50'">
                <div class="flex items-center mb-1">
                  <input type="radio" v-model="selectedDifficulty" value="hard" class="mr-2">
                  <span class="font-medium text-red-600">Hard</span>
                  <span class="ml-auto text-red-500">🔥</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Advanced tactics required with fewer starting clues.</p>
              </label>
              
              <label class="flex flex-col p-3 border rounded-lg cursor-pointer transition-all h-full" 
                :class="selectedDifficulty === 'expert' ? 'bg-purple-50 border-purple-300 shadow-sm' : 'bg-white border-gray-200 hover:bg-purple-50'">
                <div class="flex items-center mb-1">
                  <input type="radio" v-model="selectedDifficulty" value="expert" class="mr-2">
                  <span class="font-medium text-purple-600">Expert</span>
                  <span class="ml-auto text-purple-500">⚡</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">For Sudoku masters. Complex solving patterns needed.</p>
              </label>
            </div>
          </div>

          <div class="space-y-5">
            <button
              class="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition transform hover:translate-y-[-2px] flex items-center justify-center font-medium"
              @click="startSinglePlayerGame">
              <span class="mr-2 text-xl">🎮</span> Practice Mode
            </button>

            <button
              class="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition transform hover:translate-y-[-2px] flex items-center justify-center font-medium"
              @click="createGame">
              <span class="mr-2 text-xl">🏆</span> Create Game Room
            </button>

            <div class="relative mt-8">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">or join with code</span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row w-full space-y-3 sm:space-y-0 sm:space-x-2 mt-6">
              <div class="relative flex-grow">
                <input v-model="gameCode"
                  class="w-full py-4 px-5 border border-gray-300 rounded-xl sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
                  placeholder="Enter Game Code" />
              </div>
              <button
                class="py-4 px-8 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl sm:rounded-l-none hover:shadow-lg transition transform hover:translate-y-[-2px]"
                @click="joinGame">
                Join
              </button>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100 shadow-sm">
          <p class="text-sm text-indigo-800 font-medium">
            <span class="block text-lg font-bold mb-1">👋 Invite Friends!</span>
            Create a game room and share the code, or join an existing game with a code.
          </p>
        </div>
      </div>
    </div>

    <GameLayout v-else :is-multiplayer="isMultiplayer">
      <div class="p-4 sm:p-6 max-w-lg mx-auto">
        <div v-if="isWaiting" class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mb-5 animate-pulse">
          <p class="text-amber-800 font-semibold">Waiting for opponent to join...</p>
          <div class="mt-3 flex items-center">
            <span class="text-gray-700 mr-2">Share this code:</span>
            <span class="bg-white px-3 py-1.5 rounded-lg font-mono text-md border border-amber-200">{{ gameId }}</span>
            <button @click="copyGameId"
              class="ml-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition font-medium text-sm">
              Copy
            </button>
          </div>
        </div>

        <div v-if="isRejoining" class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-5">
          <p class="text-blue-800 font-medium">
            <span class="font-bold">Welcome back!</span> You've rejoined your previous game.
          </p>
        </div>

        <div v-if="opponent" class="mb-5">
          <h3 class="text-lg font-bold text-gray-700 mb-3">Game Stats</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl "
              :class="{ 'from-red-50 to-red-100': errorCount > 0 }">
              <p class="text-xs uppercase tracking-wide text-indigo-500 mb-1">Your Errors</p>
              <p class="text-2xl font-bold" :class="errorCount > 0 ? 'text-red-600' : 'text-indigo-600'">
                {{ errorCount }}
              </p>
            </div>
            <div v-if="opponent.name" class="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl "
              :class="{ 'from-red-50 to-red-100': opponentErrors > 0 }">
              <p class="text-xs uppercase tracking-wide text-purple-500 mb-1">{{ opponent.name }}</p>
              <p class="text-2xl font-bold" :class="opponentErrors > 0 ? 'text-red-600' : 'text-purple-600'">
                {{ opponentErrors }}
              </p>
            </div>
          </div>
        </div>

        <!-- Difficulty Information Banner -->
        <div class="mb-4 p-3 rounded-lg text-sm" 
          :class="{
            'bg-green-50 border border-green-200': difficulty === 'easy',
            'bg-blue-50 border border-blue-200': difficulty === 'medium',
            'bg-red-50 border border-red-200': difficulty === 'hard',
            'bg-purple-50 border border-purple-200': difficulty === 'expert'
          }">
          <div class="flex items-center">
            <span class="font-medium mr-2" 
              :class="{
                'text-green-600': difficulty === 'easy',
                'text-blue-600': difficulty === 'medium',
                'text-red-600': difficulty === 'hard',
                'text-purple-600': difficulty === 'expert'
              }">
              {{ difficulty.charAt(0).toUpperCase() + difficulty.slice(1) }} Difficulty
            </span>
            <span class="ml-auto">
              {{ 
                difficulty === 'easy' ? '🍃' : 
                difficulty === 'medium' ? '💧' : 
                difficulty === 'hard' ? '🔥' : 
                '⚡' 
              }}
            </span>
          </div>
          <p class="text-xs text-gray-600 mt-1">
            {{ 
              difficulty === 'easy' ? 'Perfect for beginners with many clues given.' : 
              difficulty === 'medium' ? 'Balanced challenge requiring some strategy.' : 
              difficulty === 'hard' ? 'Advanced tactics required with fewer starting clues.' : 
              'For Sudoku masters. Complex solving patterns needed.' 
            }}
          </p>
        </div>

        <SudokuBoard :initial-puzzle="puzzle" :solution="solution" :difficulty="difficulty"
          :is-multiplayer="isMultiplayer" :game-id="gameId" @error="onError" @complete="onComplete"
          @opponent-errors="onOpponentErrors" />
      </div>
    </GameLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import { generateSudokuPuzzle, type SudokuGame } from '~/utils/sudokuGenerator';
import { usePocketbase } from '~/composables/usePocketbase';
import { useGameSync } from '~/composables/useGameSync';
import GameLayout from '~/components/GameLayout.vue';
import SudokuBoard from '~/components/SudokuBoard.vue';

const { pb, currentUser, loginAsGuest, getUser } = usePocketbase();

// Game state
const gameStarted = ref(false);
const isMultiplayer = ref(false);
const isWaiting = ref(false);
const isRejoining = ref(false);
const gameId = ref('');
const gameCode = ref('');
const puzzle = ref<number[][]>([]);
const solution = ref<number[][]>([]);
const difficulty = ref('hard');
const selectedDifficulty = ref('hard'); // Default selected difficulty
const errorCount = ref(0);
const opponent = ref<null | { id: string; name: string; avatar: string | null; gamesPlayed?: number; gamesWon?: number; rating?: number; }>({
  id: '',
  name: '',
  avatar: null
});
const opponentErrors = ref(0);

// Check for active games when the component loads
onMounted(async () => {
  if (pb.authStore.isValid) {
    await checkForActiveGames();
  }
});

// Check if the user has any active games to rejoin
const checkForActiveGames = async () => {
  try {
    // First, check if user is in a game as player1
    const player1Games = await pb.collection('Games').getList(1, 1, {
      filter: `player1="${pb.authStore.model?.id}" && (status="waiting" || status="in-progress")`,
      sort: '-created'
    });

    if (player1Games.items.length > 0) {
      const game = player1Games.items[0];
      rejoinGame(game);
      return;
    }

    // Then check if user is in a game as player2
    const player2Games = await pb.collection('Games').getList(1, 1, {
      filter: `player2="${pb.authStore.model?.id}" && status="in-progress"`,
      sort: '-created'
    });

    if (player2Games.items.length > 0) {
      const game = player2Games.items[0];
      rejoinGame(game);
    }
  } catch (error) {
    console.error("Failed to check for active games:", error);
  }
};

// Rejoin an existing game
const rejoinGame = async (game: any) => {
  gameId.value = game.id;
  puzzle.value = game.puzzle;
  solution.value = game.solution;
  difficulty.value = game.difficulty;
  isMultiplayer.value = true;
  gameStarted.value = true;
  isRejoining.value = true; // Set rejoining flag

  // Auto-hide the rejoining notification after 5 seconds
  setTimeout(() => {
    isRejoining.value = false;
  }, 5000);

  // If the user is player1 and game is waiting, show waiting UI
  if (game.player1 === pb.authStore.model?.id && game.status === 'waiting') {
    isWaiting.value = true;
    pollForOpponent();
  } else {
    isWaiting.value = false;
    // Get opponent info
    const opponentId = game.player1 === pb.authStore.model?.id ? game.player2 : game.player1;
    if (opponentId) {
      await getOpponentInfo(opponentId);
    }

    // Get the latest game state
    await updateGameState();
  }
};

// Create a new multiplayer game
const createGame = async () => {
  if (!currentUser.value) {
    try {
      await loginAsGuest();
    } catch (error) {
      console.error("Failed to create guest account:", error);
      return;
    }
  }

  try {
    // Generate a puzzle using the selected difficulty
    const sudoku = generateSudokuPuzzle(selectedDifficulty.value);

    // Create a new game in the database
    const game = await pb.collection('Games').create({
      player1: pb.authStore.model?.id,
      player2: null,
      status: 'waiting',
      difficulty: sudoku.difficulty,
      puzzle: sudoku.puzzle,
      solution: sudoku.solution,
      winner: null,
      player1Time: 0,
      player2Time: 0,
    });

    // Set the game ID and puzzle
    gameId.value = game.id;
    puzzle.value = sudoku.puzzle;
    solution.value = sudoku.solution;
    difficulty.value = sudoku.difficulty;
    isMultiplayer.value = true;
    isWaiting.value = true;
    gameStarted.value = true;

    // Start polling for opponent
    pollForOpponent();
  } catch (error) {
    console.error("Failed to create game:", error);
  }
};

// Poll for opponent joining
const pollForOpponent = () => {
  if (!isWaiting.value) return;

  const interval = setInterval(async () => {
    try {
      const game = await pb.collection('Games').getOne(gameId.value);

      if (game.player2) {
        clearInterval(interval);
        isWaiting.value = false;
        getOpponentInfo(game.player2);
      }

      if (game.status !== 'waiting') {
        clearInterval(interval);
      }
    } catch (error) {
      console.error("Failed to poll for opponent:", error);
      clearInterval(interval);
    }
  }, 2000);
};

// Start a single player game
const startSinglePlayerGame = () => {
  isMultiplayer.value = false;
  // Use the improved generator with the selected difficulty
  const sudoku = generateSudokuPuzzle(selectedDifficulty.value);
  puzzle.value = sudoku.puzzle;
  solution.value = sudoku.solution;
  difficulty.value = sudoku.difficulty;
  gameStarted.value = true;
};

// Join an existing game
const joinGame = async () => {
  if (!gameCode.value) return;

  if (!currentUser.value) {
    try {
      await loginAsGuest();
    } catch (error) {
      console.error("Failed to create guest account:", error);
      return;
    }
  }

  try {
    // Get the game
    const game = await pb.collection('Games').getOne(gameCode.value);

    // Make sure the game is waiting for a player
    if (game.status !== 'waiting') {
      alert('This game is no longer available.');
      return;
    }

    // Join the game
    await pb.collection('Games').update(game.id, {
      player2: pb.authStore.model?.id,
      status: 'in-progress',
    });

    // Set the game ID and puzzle
    gameId.value = game.id;
    puzzle.value = game.puzzle;
    solution.value = game.solution;
    difficulty.value = game.difficulty;
    isMultiplayer.value = true;
    gameStarted.value = true;

    // Get opponent info
    getOpponentInfo(game.player1);
  } catch (error) {
    console.error("Failed to join game:", error);
  }
};

// Handle errors
const onError = (count: number) => {
  errorCount.value = count;

  // Update the game state if in multiplayer mode
  if (isMultiplayer.value && gameId.value) {
    updateGameState();
  }
};

// Handle opponent errors
const onOpponentErrors = (count: number) => {
  opponentErrors.value = count;
};

// Handle game completion
const onComplete = async (errors: number) => {
  alert(`Congratulations! You completed the puzzle with ${errors} errors.`);

  // If this is a multiplayer game, update the game status
  if (isMultiplayer.value && gameId.value) {
    try {
      const game = await pb.collection('Games').getOne(gameId.value);

      // If the game is already completed, do nothing
      if (game.status === 'completed') return;

      // Update the game
      await pb.collection('Games').update(gameId.value, {
        status: 'completed',
        winner: pb.authStore.model?.id,
        ...(game.player1 === pb.authStore.model?.id
          ? { player1Time: Date.now() - new Date(game.created).getTime() }
          : { player2Time: Date.now() - new Date(game.created).getTime() }),
      });

      // Update user stats
      await pb.collection('users').update(pb.authStore.model?.id, {
        gamesPlayed: (pb.authStore.model?.gamesPlayed || 0) + 1,
        gamesWon: (pb.authStore.model?.gamesWon || 0) + 1,
      });
    } catch (error) {
      console.error("Failed to update game status:", error);
    }
  }
};

// Get opponent info
const getOpponentInfo = async (id: string) => {
  try {
    // Use the getUser function which has better error handling
    const user = await getUser(id);
    opponent.value = user;
  } catch (error) {
    console.error("Failed to get opponent info:", error);
    // Fallback to a default opponent
    opponent.value = {
      id: id,
      name: "Unknown Player",
      avatar: null
    };
  }
};

// Update game state
const updateGameState = async () => {
  try {
    // Get existing game state
    let gameState;
    try {
      gameState = await pb.collection('GameStates').getFirstListItem(`gameId="${gameId.value}" && playerId="${pb.authStore.model?.id}"`);
    } catch (error) {
      // Create new game state if it doesn't exist
      gameState = await pb.collection('GameStates').create({
        gameId: gameId.value,
        playerId: pb.authStore.model?.id,
        board: [],  // We'll update this from the SudokuBoard component
        notes: [],
        errors: errorCount.value,
      });
      return;
    }

    // Update game state
    await pb.collection('GameStates').update(gameState.id, {
      errors: errorCount.value,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error("Failed to update game state:", error);
  }
};

// If user refreshes or leaves, mark the game as abandoned
onBeforeUnmount(async () => {
  if (isMultiplayer.value && gameId.value) {
    try {
      const game = await pb.collection('Games').getOne(gameId.value);
      // Only mark as abandoned if the status is 'waiting' or 'in-progress'
      if (game.status === 'waiting' || game.status === 'in-progress') {
        await pb.collection('Games').update(gameId.value, {
          status: 'abandoned',
        });
      }
    } catch (error) {
      console.error("Failed to update game status on leave:", error);
    }
  }
});

// Copy game ID to clipboard
const copyGameId = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(gameId.value)
      .then(() => {
        alert('Game ID copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy game ID: ', err);
        // Fallback: Let the user manually select and copy
        alert(`Your game ID is: ${gameId.value}`);
      });
  } else {
    // Fallback for browsers that don't support clipboard API
    alert(`Your game ID is: ${gameId.value}`);
  }
};
</script>

<style scoped>
@keyframes bounce-gentle {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-gentle {
  animation: bounce-gentle 5s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>