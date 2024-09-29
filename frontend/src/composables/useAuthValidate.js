import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export function useAuthValidate() {
  const isAuthenticated = ref(false); //will be used to verify the authentication of the user
  const user = ref(null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await axios.get('https://jbb-fullstack.onrender.com/api/user', {
        withCredentials: true
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
