import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useAuthValidate() {
  const isAuthenticated = ref(false);
  const user = ref(null);
  const router = useRouter();

  const apiBaseUrl = process.env.NODE_ENV === 'production' ? 'https://jbb-fullstack.onrender.com.com' : 'http://localhost:3000';

  const fetchUser = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/user`, {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        isAuthenticated.value = true;
        user.value = userData;
      } else {
        isAuthenticated.value = false; //change to false later
        user.value = null; // change to null after
      }
    } catch (error) {
      isAuthenticated.value = false;
      user.value = null;
    }
  };

  return {
    isAuthenticated,
    user,
    fetchUser
  };
}
