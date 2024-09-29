import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export function useAuthValidate() {
  const isAuthenticated = ref(false); // Will be used to verify the authentication of the user
  const user = ref(null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await axios.get('https://jbb-fullstack.onrender.com/api/user', {
        withCredentials: true // Ensure cookies are sent with the request
      });

      // Axios responses are handled differently, check for successful response
      if (response.status === 200) {
        console.log('Response received:', response.data);
        isAuthenticated.value = true;
        user.value = response.data; // Directly use response.data
      } else {
        isAuthenticated.value = false;
        user.value = null;
      }
    } catch (error) {
      console.error('Error fetching user:', error); // Log the error
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
