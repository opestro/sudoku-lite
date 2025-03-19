import { ref, onMounted, onBeforeUnmount } from 'vue';
import { usePocketbase } from './usePocketbase';

export function useGameSync(gameId: string) {
  const { pb } = usePocketbase();
  const pollingInterval = ref<number | null>(null);
  const lastUpdate = ref<Date | null>(null);
  
  // Game state
  const opponentErrors = ref(0);
  const opponentMoves = ref<any[]>([]);
  
  // Callbacks
  let onUpdateCallback: ((data: any) => void) | null = null;
  
  // Poll for game updates
  const startPolling = () => {
    if (pollingInterval.value) return;
    
    // Poll every 2 seconds
    pollingInterval.value = window.setInterval(async () => {
      try {
        // Get the latest updates from opponent
        const records = await pb.collection('GameStates').getList(1, 50, {
          filter: `gameId="${gameId}" && playerId != "${pb.authStore.model?.id}"`,
          sort: '-lastUpdated'
        });
        
        if (records.items.length > 0) {
          const latestRecord = records.items[0];
          const updateTime = new Date(latestRecord.lastUpdated);
          
          // Only process if it's a new update
          if (!lastUpdate.value || updateTime > lastUpdate.value) {
            lastUpdate.value = updateTime;
            processUpdate(latestRecord);
          }
        }
        
        // Also check if the game status has changed
        const game = await pb.collection('Games').getOne(gameId);
        if (game.status === 'completed' && game.winner !== pb.authStore.model?.id) {
          if (onUpdateCallback) {
            onUpdateCallback({
              type: 'game_completed',
              winner: game.winner
            });
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);
    
    console.log('Game state polling initialized');
  };
  
  // Process an update
  const processUpdate = (record: any) => {
    // Store opponent's errors
    opponentErrors.value = record.errors || 0;
    
    // Store opponent's moves
    if (record.board) {
      opponentMoves.value = record.board;
    }
    
    // Call the callback
    if (onUpdateCallback) {
      onUpdateCallback({
        type: 'board_update',
        board: record.board,
        errors: record.errors,
        notes: record.notes,
        playerId: record.playerId
      });
    }
  };
  
  // Send a game update
  const sendUpdate = async (data: any) => {
    try {
      // Get existing game state
      let gameState;
      try {
        gameState = await pb.collection('GameStates').getFirstListItem(`gameId="${gameId}" && playerId="${pb.authStore.model?.id}"`);
      } catch (error) {
        // Create new game state if it doesn't exist
        gameState = await pb.collection('GameStates').create({
          gameId: gameId,
          playerId: pb.authStore.model?.id,
          board: data.board || [],
          notes: data.notes || [],
          errors: data.errors || 0,
          lastUpdated: new Date()
        });
        return;
      }
      
      // Update game state
      await pb.collection('GameStates').update(gameState.id, {
        board: data.board || gameState.board,
        notes: data.notes || gameState.notes,
        errors: data.errors || gameState.errors,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error("Error updating game state:", error);
    }
  };
  
  // Set up a callback for updates
  const onUpdate = (callback: (data: any) => void) => {
    onUpdateCallback = callback;
  };
  
  // Initialize
  onMounted(() => {
    startPolling();
  });
  
  // Clean up
  onBeforeUnmount(() => {
    // Clear polling interval
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
    }
  });
  
  return {
    opponentMoves,
    opponentErrors,
    sendUpdate,
    onUpdate
  };
} 