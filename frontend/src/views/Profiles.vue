<template>
  <div class="profiles">
    <Header />
    <div class="container">
      <h1>All Users</h1>
      <ul class="user-list" v-if="users.length">
        <li v-for="user in users" :key="user._id" class="user-item" @click="IndividualProfile(user._id)">
          <img :src="user.imageUrl" alt="User Image" class="user-image" />
          <div class="user-info">
            <h2 class="user-name">{{ user.displayName }}</h2>
            <p class="user-email">{{ user.nameId }}</p>
          </div>
        </li>
      </ul>
      <p v-else>No users found.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

export default {
  components: {
    Header
  },
  setup() {
    const users = ref([]);
    const router = useRouter();

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/getAllUsers');
        console.log('API Response:', response.data);
        users.value = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const IndividualProfile = (profileID) => {
      router.push({ name: 'ProfilePage', params: { id: profileID } });


    }

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      IndividualProfile
    };
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
.user-item:hover{
  cursor: pointer;
}
.user-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 18px;
  margin: 0;
  color: #333;
  text-align: left;
}

.user-email {
  font-size: 14px;
  margin: 0;
  color: #777;
  text-align: left;
}
</style>
