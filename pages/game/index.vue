<template>
  <div>
    <div v-if="!gameStarted" class="bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-md mx-auto">
          <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Sudoku 1vs1</h1>
          
          <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">Game Options</h2>
            
            <div class="space-y-4">
              <button 
                class="w-full py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition transform hover:scale-105 flex items-center justify-center"
                @click="startSinglePlayerGame"
              >
                <span class="mr-2">🎮</span> Practice Mode
              </button>
              
              <button 
                class="w-full py-3 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 transition transform hover:scale-105 flex items-center justify-center"
                @click="createGame"
              >
                <span class="mr-2">🏆</span> Create Game Room
              </button>
              
              <div class="flex flex-col sm:flex-row w-full space-y-2 sm:space-y-0 sm:space-x-2">
                <input 
                  v-model="gameCode" 
                  class="w-full sm:flex-1 py-3 px-4 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  placeholder="Enter Game Code"
                />
                <button 
                  class="w-full sm:w-auto py-3 px-6 bg-purple-500 text-white rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-purple-600 transition"
                  @click="joinGame"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p class="text-sm text-blue-800">
              Challenge your friends to a Sudoku duel! Create a game room and share the code, or join an existing game with a code.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <GameLayout v-else :is-multiplayer="isMultiplayer">
      <div class="p-2 sm:p-4 max-w-lg mx-auto">
        <div v-if="isWaiting" class="game-notification warning mb-4">
          <p><span class="font-semibold">Waiting for opponent to join...</span></p>
          <p class="mt-1">Share this code: 
            <span class="bg-white px-2 py-0.5 rounded font-mono text-sm">{{ gameId }}</span>
            <button
              @click="copyGameId"
              class="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
            >
              Copy
            </button>
          </p>
        </div>

        <div v-if="isRejoining" class="game-notification info mb-4">
          <p><span class="font-semibold">Welcome back!</span> You've rejoined your previous game.</p>
        </div>
        
        <div v-if="opponent" class="mb-4 grid grid-cols-2 gap-2">
          <div class="error-counter player p-2 text-sm rounded-md bg-gray-50" :class="{ 'has-errors': errorCount > 0 }">
            <span class="font-medium">You:</span> {{ errorCount }} {{ errorCount === 1 ? 'error' : 'errors' }}
          </div>
          <div class="error-counter opponent p-2 text-sm rounded-md bg-gray-50" :class="{ 'has-errors': opponentErrors > 0 }">
            <span class="font-medium">{{ opponent.name }}:</span> {{ opponentErrors }} {{ opponentErrors === 1 ? 'error' : 'errors' }}
          </div>
        </div>
        
        <SudokuBoard 
          :initial-puzzle="puzzle"
          :solution="solution"
          :difficulty="difficulty"
          :is-multiplayer="isMultiplayer"
          :game-id="gameId"
          @error="onError"
          @complete="onComplete"
          @opponent-errors="onOpponentErrors"
        />
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
const difficulty = ref('medium');
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
    // Generate a puzzle using the improved generator
    const sudoku = generateSudokuPuzzle('medium');
    
    // Create a new game in the database
    const game = await pb.collection('Games').create({
      player1: pb.authStore.model.id,
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
  // Use the improved generator for a better puzzle experience
  const sudoku = generateSudokuPuzzle('easy'); // Easier puzzle for practice
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
      player2: pb.authStore.model.id,
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