<template>
    <div class="profile">
      <Header />
  
      <div class="main-info container-lg">
        <div class="banner-image" :style="{ backgroundImage: 'url(' + bannerImage + '?t=' + new Date().getTime() + ')' }"></div>
        <div class="row2 d-flex container">
          <img :src="pfp + '?t=' + new Date().getTime()" alt="pfp" id="pfp">
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
  
        <!-- Posts Section -->
        <div class="posts-section container-sm mt-4">
          <h3 class="mb-4" style="text-align: left;">Posts</h3>
  
          <div v-if="posts.length === 0" class="text-center text-muted">
            There is nothing to show at this moment
          </div>
  
          <div v-else class="posts-grid">
            <div v-for="post in posts" :key="post._id" class="post-card">
              <div class="post-image-container" @click="goToPost(post._id)">
                <img :src="post.images && post.images.length > 0 ? post.images[0] : 'https://www.vocaleurope.eu/wp-content/uploads/no-image.jpg'" class="post-image" :alt="post.title" />
                <div v-if="post.images.length > 1" class="more-images-badge">
                  +{{ post.images.length - 1 }} more
                </div>
                <div class="post-overlay">
                <h5 class="post-title-default">{{ post.title }}</h5>
                  <p class="post-description">{{ truncateText(post.description, 100) }}</p>
                </div>
                <p class="post-proofs">{{ post.proofs.length }} proofs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Update Profile Info Modal -->
      <updateProfileInfo v-if="showProfileEditorBool && isAuthenticated && isCurrentUser" @close="closeProfileEditor" @profileUpdated="handleProfileUpdated" />

      <Footer />
    </div>
  </template>

<style scoped>
#pfp {
  height: 250px;
  width: 250px;
  border-radius: 1rem;
  object-fit: cover;
  z-index: 6;
}

/* Banner Image */
.banner-image {
  width: 100%;
  height: auto;
  background-size: cover;
  padding-top: 33.3%;
  object-fit: cover;
}

/* Card Image */
.card-img-top {
  height: 200px;
  width: 100%;
  object-fit: cover;
}

/* Profile Details Row */
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
  background-color: white;
  transform: translateX(-0.5rem);
  z-index: 5;
}

/* Description Section */
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

/* Edit Buttons */
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

/* Posts Section Styles */
.posts-section {
  margin-top: 3rem;
}

/* Grid Layout for Posts */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.post-card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
}

/* Post Image Container */
.post-image-container {
  position: relative;
  height: 200px;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border: none; /* Remove border around the image */
}

.more-images-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.post-proofs {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  z-index: 1; /* Make sure proofs are above other content */
}

.post-title-default {
  font-size: 1.25rem;
  color: #eee;
  text-align: center;
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 5;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 10px;
  transform: translateY(100%);
  transition: display 0.3s ease;
}

.post-title-hover {
  font-size: 1.25rem;
  color: #fff;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.post-description {
  font-size: 1rem;
  color: #fff;
  text-align: justify;  /* Ensure text is centered */
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 10px;
  margin-top: 10px;
}

.post-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically */
  align-items: center;     /* Center content horizontally */
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.post-card:hover ,
.post-card:hover .post-description {
  opacity: 1;
}
.post-card:hover{
    cursor: pointer;
}
.post-card:hover .post-title-default {
  opacity: 0;
  display: none;
}



.post-card:hover .post-description {
  opacity: 1;
  text-align: center; /* Center the description horizontally */
}
/* Media Query for Smaller Devices */
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

  .post-image-container {
    height: 150px;
  }

  .post-title-default,
  .post-title-hover {
    font-size: 1rem;
  }

  .post-description {
    font-size: 0.9rem;
  }

  .posts-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>

<script>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Import useRouter
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
    updateProfileInfo,
  },
  setup() {
    const { isAuthenticated, fetchUser, user } = useAuthValidate();
    const route = useRoute();
    const router = useRouter(); // Initialize router
    const displayName = ref('');
    const nameId = ref('');
    const description = ref('');
    const bannerImage = ref('');
    const pfp = ref('');
    const isCurrentUser = ref(false);
    const posts = ref([]); // Reactive state for storing the user's posts

    const apiBaseUrl = 'https://jbb-fullstack.onrender.com';

    const showProfileEditorBool = ref(false);

    const getAccountInfo = async (id) => {
      try {
        const response = await axios.get('${apiBaseUrl}/api/getAllUsers');
        const users = response.data;
        console.log('API Response:', users);

        const currentUser = users.find((user) => user._id === id);
        if (currentUser) {
          displayName.value = currentUser.displayName;
          nameId.value = currentUser.nameId;
          description.value = currentUser.description;
          bannerImage.value = currentUser.bannerImage;
          pfp.value = currentUser.imageUrl;

          isCurrentUser.value =
              user.value && currentUser._id === user.value._id;

          console.log(
              'Value of displayName and other attributes: ',
              currentUser
          );
          console.log('Is Current User: ', isCurrentUser.value);

          const postsResponse = await axios.get(
              `${apiBaseUrl}/api/getAllPostsFromUser`,
              {
                params: {
                  nameId: currentUser.nameId,
                },
              }
          );

          posts.value = postsResponse.data;
          console.log('User Posts:', posts.value);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const showProfileEditor = () => {
      console.log('Being Clicked');
      showProfileEditorBool.value = true;
    };

    const closeProfileEditor = () => {
      showProfileEditorBool.value = false;
    };

    const handleProfileUpdated = () => {
      window.location.reload(); // Reload the page
    };

    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength
          ? text.slice(0, maxLength) + '...'
          : text;
    };

    // Use router to navigate to the post
    const goToPost = (id) => {
      router.push(`/category/palestine/${id}`); // Use router for navigation
    };

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
      isCurrentUser,
      posts,
      truncateText,
      goToPost, // Ensure goToPost is returned here
    };
  },
};
</script>
