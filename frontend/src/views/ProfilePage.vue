<template>
  <div class="profile">
    <Header />

    <div class="main-info container-lg">
      <div class="banner-image" :style="{ backgroundImage: 'url(' + bannerImage + ')' }"></div>
      <div class="row2 d-flex container">
        <img :src="pfp" alt="pfp" id="pfp">
        <div class="row2-inner d-flex align-items-center rounded">
          <div>
            <h1 style="color: #333;">{{ displayName }}</h1>
            <h6 style="color: #888;">{{ nameId }}</h6>
          </div>
        </div>
        <div v-if="isCurrentUser" class="edit-buttons d-none d-lg-block ms-3">
          <div class="edit-box" @click="showProfileEditor">
            <i class="bi bi-pencil"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-inner container">
      <div class="image-headers container">
        <div class="desc">
          <h2>Bio</h2>
          <p>{{ description }}</p>
        </div>
        <div v-if="isCurrentUser" class="edit-buttons d-lg-none">
          <div class="edit-box" @click="showProfileEditor">
            <i class="bi bi-pencil"></i>
          </div>
        </div>
      </div>

      <div class="container-sm creations">
        <h3>Posts</h3>
        <p style="color: #888">There is nothing to show at this moment</p>
      </div>
    </div>

    <updateProfileInfo v-if="showProfileEditorBool && isAuthenticated && isCurrentUser"   
    @close="closeProfileEditor"
    @profileUpdated="handleProfileUpdated"/>

  </div>
</template>


<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthValidate } from '../composables/useAuthValidate';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';
import updateProfileInfo from '@/components/updateProfileInfo.vue';

export default {
  name: 'Profile',
  components: {
    Header,
    Footer,
    updateProfileInfo
  },
  setup() {
    const { isAuthenticated, fetchUser, user } = useAuthValidate();
    const route = useRoute();

    const displayName = ref('');
    const nameId = ref('');
    const description = ref('');
    const bannerImage = ref('');
    const pfp = ref('');
    const isCurrentUser = ref(false);

    const showProfileEditorBool = ref(false);

    const getAccountInfo = async (id) => {
      try {
        const response = await axios.get('/api/getAllUsers');
        const users = response.data;
        console.log('API Response:', users);

        const currentUser = users.find(user => user._id === id);
        if (currentUser) {
          displayName.value = currentUser.displayName;
          nameId.value = currentUser.nameId;
          description.value = currentUser.description;
          bannerImage.value = currentUser.bannerImage;
          pfp.value = currentUser.imageUrl;

          // Check if the current profile belongs to the logged-in user
          isCurrentUser.value = user.value && currentUser._id === user.value._id;

          console.log("Value of displayName and other attributes: ", currentUser);
          console.log("Is Current User: ", isCurrentUser.value);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const showProfileEditor = () => {
      console.log("Being Clicked");
      showProfileEditorBool.value = true;
    }

    const closeProfileEditor = () => {
      showProfileEditorBool.value = false;
    }

    const handleProfileUpdated = () => {
      window.location.reload(); // Reload the page
    }

    onMounted(() => {
      const userId = route.params.id;
      fetchUser().then(() => {
        getAccountInfo(userId);
      });
    });

    return {
      isAuthenticated,
      displayName,
      nameId,
      description,
      pfp,
      bannerImage,
      showProfileEditor,
      showProfileEditorBool,
      closeProfileEditor,
      handleProfileUpdated,
      isCurrentUser
    };
  }
};
</script>

<style scoped>
#pfp {
  height: 250px;
  width: 250px;
  border-radius: 1rem;
  text-align: left;
  object-fit: cover;
  z-index: 6;
}

.banner-image {
  width: 100%;
  height: auto;
  background-size: cover;
  padding-top: 33.3%; /* Adjust this value to change the aspect ratio */
  object-fit: cover;
}

.row2 {
  text-align: left;
  margin-top: 1rem;
  justify-content: center;
  margin: auto;
  transform: translateY(-7.5rem);
}

.row2-inner {
  justify-content: center;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 1rem;
  padding-left: 1rem;
  padding-right: 4rem;
  width: auto;
  border: 1px solid #888;
  background-color: white;
  transform: translateX(-0.5rem);
  z-index: 5;
}

.desc {
  padding: 20px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  color: #333;
  line-height: 1.6;
  margin-left: auto;
  margin-right: auto;
  transform: translateY(-5rem);
  min-width: fit-content;
  max-width: 35rem;
}

.desc h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #555;
  font-weight: 300;
}

.desc p {
  margin: 0;
  font-size: 1em;
  color: #666;
}

.creations {
  text-align: left;
  margin: auto;
  margin-top: 3rem;
  display: inline-block;
}

.edit-buttons {
  margin-top: auto;
  margin-bottom: auto;
}

.edit-box {
  width: 4rem;
  height: 4rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.edit-box:hover {
  background-color: #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-icon {
  width: 24px;
  height: 24px;
  background-image: url('https://cdn-icons-png.flaticon.com/512/2921/2921222.png');
  background-size: cover;
}

/* Media query for devices with a width of 768px or less (phones and below) */
@media (max-width: 768px) {
  #pfp {
    width: 100px;
    height: 100px;
  }

  .container-lg {
    margin: 0px;
    padding: 0px;
  }

  .banner-image {
    width: 100%;
    height: auto;
    background-size: cover;
    padding-top: 33.33%;
  }

  .row2 {
    text-align: left;
    margin: auto;
    transform: translateY(-2.5rem);
  }

  .row2-inner {
    justify-content: center;
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
    z-index: 5;
  }

  .desc {
    transform: translateY(-1rem);
  }

  .row2-inner h1 {
    font-size: 20px;
  }

  .row2-inner h6 {
    font-size: 15px;
  }
}
</style>
