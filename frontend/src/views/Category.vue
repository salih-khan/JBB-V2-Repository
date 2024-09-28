<template>
  <div class="category container-fluid">
    <Header />

    <div class="category-inner">
      <div class="timeline container">
        <Timeline v-if="posts.length > 0" :posts="posts"/>
      </div>

      <div class="posts-section container">
        <h3 class="mb-4 all-posts" style="text-align: left;">All Posts</h3>

        <div v-if="posts.length === 0" class="text-center text-muted">
          There are no posts available at the moment.
        </div>

        <div v-else class="posts-grid">
          <router-link
              v-for="post in posts"
              :key="post._id"
              :to="`/category/palestine/${post._id}`"
              class="post-link"
          >
            <div class="post-card">
              <div class="post-image-container">
                <template v-if="isVideo(post.images)">
                  <video
                      :src="getMediaSrc(post.images)"
                      class="post-image"
                      poster="https://via.placeholder.com/300x200"
                      autoplay
                      muted
                      playsinline
                      disablePictureInPicture
                      controlsList="nodownload noplaybackrate nofullscreen"
                  ></video>
                </template>
                <template v-else>
                  <img :src="getMediaSrc(post.images)" class="post-image" :alt="post.title" />
                </template>
                <div v-if="post.images.length > 1" class="more-images-badge">
                  +{{ post.images.length - 1 }} more
                </div>
                <p class="post-proofs">{{ post.proofs.length }} proofs</p>
              </div>
              <div class="post-details">
                <h5 class="post-title-default">{{ truncateText(post.title, 50) }}</h5>
                <p class="post-description">{{ truncateText(post.description, 200) }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import Timeline from '../components/Timeline.vue'
import { ref, onMounted } from 'vue';

export default {
  components: {
    Header,
    Footer,
    Timeline
  },
  setup() {
    const posts = ref([]);

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`https://jbb-backend-webservice.onrender.com/api/getAllPostsFromCategory`);
        posts.value = response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    const getMediaSrc = (media) => {
      return media && media.length > 0 ? media[0] : 'https://www.vocaleurope.eu/wp-content/uploads/no-image.jpg';
    };

    const isVideo = (media) => {
      if (media && media.length > 0) {
        const videoFormats = ['mp4', 'webm', 'ogg'];
        const fileExtension = media[0].split('.').pop().toLowerCase();
        return videoFormats.includes(fileExtension);
      }
      return false;
    };

    onMounted(() => {
      fetchPosts();
    });

    return {
      posts,
      truncateText,
      getMediaSrc,
      isVideo,
    };
  },
};
</script>

<style scoped>
.category-inner {
  min-height: 100vh;
}
.container{
  padding: 0px;
}
.container-fluid{
  padding: 0px;
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 350px; /* Fixed height for uniformity */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.post-link {
  text-decoration: none;
  color: inherit;
}

.post-image-container {
  position: relative;
  height: 180px; /* Fixed height for the image/video container */
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}

.all-posts{
  margin-left: 1rem;
}
.post-details {
  padding: 10px;
  text-align: left;
  display: flex;
  flex-direction: column;
  /* Removed justify-content: space-between */
  height: 150px; /* Fixed height for the details section */
  gap: 0.5rem; /* Add some space between title and description */
}

.post-title-default {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.2rem; /* Reduced margin for a tighter layout */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.post-description {
  font-size: 0.9rem;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Show up to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0; /* Remove default margins for tighter alignment */
}

.post-card:hover .post-title-default,
.post-card:hover .post-description {
  opacity: 1;
}

@media (max-width: 768px) {
  .posts-grid{
    gap: 0.25rem;
  }

  .post-link{
    margin: 10px;
  }
}
</style>
