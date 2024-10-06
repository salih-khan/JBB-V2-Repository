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
                <p class="post-description">{{ getDescription(post.description ?? 'Default Description') }}</p>
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

<script>
import axios from 'axios';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import updateProfileInfo from '../components/updateProfileInfo.vue';
import { ref, onMounted } from 'vue';
import { useTruncateAndUntag } from '@/composables/useTruncateAndUntag';

export default {
  components: {
    Header,
    Footer,
    updateProfileInfo
  },
  setup() {
    const posts = ref([]);
    const apiBaseUrl = process.env.VUE_APP_API_URL;
    const { truncate } = useTruncateAndUntag();

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/getUserPosts`);
        posts.value = response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const getDescription = (description) => {
      const maxDescriptionLength = 100;
      return truncate(description, maxDescriptionLength);
    };

    const goToPost = (id) => {
      // your logic to route to the post detail page
    };

    onMounted(() => {
      fetchPosts();
    });

    return {
      posts,
      getDescription,
      goToPost
    };
  }
};
</script>

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
.edit-buttons,
.edit-box {
  cursor: pointer;
}

.edit-box {
  transition: background-color 0.3s ease;
}

.edit-box:hover {
  background-color: #f0f0f0;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Posts Grid */
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 350px; /* Fixed height for uniformity */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-image-container {
  width: 100%;
  height: 200px; /* Fixed height for the media container */
  overflow: hidden;
  display: flex;
  align-items: center; /* Center media vertically */
  justify-content: center; /* Center media horizontally */
}

.post-image, .post-video {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures media fits well */
}

.post-details {
  padding: 15px; /* Padding inside the post card */
}

.post-title-default {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  text-align: left;
}

.post-description {
  height: 3em; /* Adjust height for description */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Clamp lines for ellipsis */
  -webkit-box-orient: vertical;
}

.more-images-badge, .post-proofs {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 0.8rem;
}

.post-link {
  text-decoration: none;
  color: inherit;
}

.post-card:hover {
  transform: translateY(-10px); /* Lift animation on hover */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 576px) {
  #pfp {
    height: 150px;
    width: 150px;
  }

  .row2 {
    transform: translateY(-5rem);
  }

  .row2-inner {
    padding-right: 1rem;
  }

  .desc {
    transform: translateY(-3rem);
  }

  .posts-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 posts per row on mobile */
  }
}
</style>