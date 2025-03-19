import PocketBase from 'pocketbase';
import { ref, readonly, onMounted } from 'vue';

export function usePocketbase() {
  // Create PocketBase instance with public URL
  const pb = new PocketBase(process.env.NUXT_POCKETBASE_URL || 'https://pocketbase-soduko.cscclub.space');
  const currentUser = ref(null);
  
  // Initialize on client-side only
  onMounted(() => {
    // Set current user from existing auth store if available
    if (pb.authStore.isValid) {
      currentUser.value = pb.authStore.model;
    }
    
    // Listen for auth changes
    pb.authStore.onChange(() => {
      currentUser.value = pb.authStore.model;
    });
  });
  
  // Guest login function
  const loginAsGuest = async () => {
    const guestName = `Guest_${Math.floor(Math.random() * 10000)}`;
    const password = Math.random().toString(36).slice(-8);
    try {
        const data = {
            name: guestName,
            email: `${guestName}@guest.com`,
            password: password,
            passwordConfirm: password,
            rating: 1000,
            gamesPlayed: 0,
            gamesWon: 0,
            bestTime: 0,
        }
      // Create a temporary guest user
      const record = await pb.collection('users').create(data);
      // Auto login
      await pb.collection('users').authWithPassword(data.email, data.password);
      return record;
    } catch (error) {
      console.error("Error creating guest account:", error);
      throw error;
    }
  };
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      return authData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  // Register function
  const register = async (data: any) => {
    try {
      const record = await pb.collection('users').create(data);
      if (record) {
        // Auto login after registration
        await pb.collection('users').authWithPassword(data.email, data.password);
      }
      return record;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    pb.authStore.clear();
  };
  
  // Get user function with error handling
  const getUser = async (id: string) => {
    try {
      return await pb.collection('users').getOne(id);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      // Return a default user object instead of throwing
      return {
        id: id,
        name: 'Unknown Player',
        avatar: null,
        gamesPlayed: 0,
        gamesWon: 0,
        rating: 1000
      };
    }
  };
  
  return {
    pb,
    currentUser: readonly(currentUser),
    loginAsGuest,
    login,
    register,
    logout,
    getUser
  };
} 