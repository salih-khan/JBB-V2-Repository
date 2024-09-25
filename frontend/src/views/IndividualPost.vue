<template>
  <div class="post-detail container-fluid" v-if="post">
    <Header />

    <div class="post-wrapper">
      <!-- Main Post Section -->
      <div class="post-content">
        <h1 class="post-title">{{ post.title }}</h1>

        <div class="post-meta">
          <p>
            By: <a :href="`http://localhost:3000/profiles/${user._id}`" target="_blank">{{ user.displayName }} - {{ post.nameId }}</a>
          </p>
          <span class="post-date">{{ formatDate(post.date) }}</span>
        </div>

        <!-- Post Main Media -->
        <!-- Post Main Media -->
        <div class="post-media" @click="getMediaType(post.images[0]) === 'image' ? openModal(getMediaSource(post.images[0])) : null">
          <component
              :is="getMediaType(post.images[0]) === 'video' ? 'video' : 'img'"
              :src="getMediaSource(post.images[0])"
              :alt="post.title"
              controls="getMediaType(post.images[0]) === 'video'"
          />
        </div>

        <!-- Post Description -->
        <div class="post-body">
          <p v-html="post.description"></p>
        </div>

        <!-- Additional Media Section -->
        <div class="additional-media" v-if="post.images.length > 1">
          <h4>Additional Media</h4>
          <div class="media-gallery">
            <div
                v-for="(media, index) in post.images.slice(1)"
                :key="index"
                class="media-item"
                @click="openModal(getMediaSource(media))"
            >
              <component
                  :is="getMediaType(media) === 'video' ? 'video' : 'img'"
                  :src="getMediaSource(media)"
                  :alt="'Additional Media ' + (index + 1)"
                  controls="getMediaType(media) === 'video'"
              />
            </div>
          </div>
        </div>

        <!-- Proofs Section -->
        <div class="post-proofs" v-if="post.proofs.length > 0">
          <h4>Proofs</h4>
          <div class="proofs-gallery">
            <div v-for="(proof, index) in post.proofs" :key="index" class="proof-item">
              <div class="proof-details">
                <strong>{{ proof.title }}</strong>
                <br />
                <a :href="formattedSource(proof.source)" target="_blank">{{ proof.source }}</a>
                <p>{{ proof.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Posts Section -->
      <div class="recent-posts">
        <h4>Recent Posts</h4>
        <ul>
          <li v-for="(recentPost, index) in recentPosts" :key="index" class="recent-post-item">
            <a :href="`/category/palestine/${recentPost._id}`">{{ recentPost.title }}</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Image Modal -->
    <ImageModal :visible="isModalOpen" :imageSrc="selectedImage" @close="closeModal" />

    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { useRoute } from "vue-router";
import ImageModal from "@/components/ImageModal.vue"; // Import the ImageModal component

export default {
  components: { Header, Footer, ImageModal },
  setup() {
    const post = ref(null);
    const user = ref(null);
    const recentPosts = ref([]); // Holds the recent posts
    const placeholderImage = "path/to/placeholder.jpg"; // Add your placeholder image URL here
    const selectedImage = ref(null); // To hold the selected image/video for modal
    const isModalOpen = ref(false); // To manage modal visibility
    const route = useRoute();

    // Fetch an individual post
    const fetchPost = async () => {
      try {
        const { postId } = route.params;
        const response = await axios.get(`/api/getIndividualPost/${postId}`);
        const responseData = response.data;
        post.value = responseData.post;
        user.value = responseData.user;
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    // Fetch recent posts
    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get(`/api/getAllPosts?page=1&limit=10`);
        recentPosts.value = response.data; // Set the fetched posts to the recentPosts array
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formattedSource = (source) => {
      if (!source.startsWith('http://') && !source.startsWith('https://')) {
        return `https://${source}`;
      }
      return source;
    };

    const openModal = (media) => {
      selectedImage.value = media;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      selectedImage.value = null;
    };

    // Function to determine media type
    const getMediaType = (media) => {
      if (media) {
        const extension = media.split('.').pop().toLowerCase();
        if (['mp4', 'webm', 'ogg'].includes(extension)) {
          return 'video';
        } else {
          return 'image';
        }
      }
      return 'image';
    };

    // Function to get the media source for rendering
    const getMediaSource = (media) => {
      return media || placeholderImage;
    };

    onMounted(() => {
      fetchPost();
      fetchRecentPosts(); // Fetch recent posts when the component is mounted
    });

    return {
      post,
      user,
      recentPosts,
      placeholderImage,
      formatDate,
      formattedSource,
      openModal,
      closeModal,
      isModalOpen,
      selectedImage,
      getMediaType,
      getMediaSource,
    };
  },
};
</script>

<style scoped>
.container-fluid, .container{
  padding: 0px;
}
.post-wrapper {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.post-content {
  max-width: 800px;
  flex: 3;
  margin-right: 20px;
}

.post-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-align: left;
}

.post-meta {
  font-size: 0.9rem;
  color: #555;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.post-media img,
.post-media video {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 20px;
}

.post-body {
  font-size: 1.1rem;
  line-height: 1.8; /* Increase line height for readability */
  margin-bottom: 40px;
  text-align: left;
  letter-spacing: 0.02rem; /* Adds spacing between letters */
  word-spacing: 0.05rem; /* Adds spacing between words */
  color: #333; /* Softer color for body text */
}

.additional-media {
  margin-bottom: 40px;
}

.media-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 media items per row */
  gap: 10px;
}

.media-item {
  overflow: hidden;
}

.media-item img,
.media-item video {
  width: 100%;
  height: 100%;
  max-height: 200px;
  object-fit: cover; /* Ensures the image/video is not pixelated and maintains aspect ratio */
}

/* Proofs Section */
.post-proofs {
  margin-bottom: 40px;
  text-align: left;
}

.proofs-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.proof-item {
  border: 1px solid #ccc;
  padding: 10px;
  background: #f9f9f9;
  overflow-wrap: anywhere;
}

.proof-details {
  margin-top: 10px;
}

/* Recent Posts Section */
.recent-posts {
  flex: 1;
  border-left: 1px solid #ddd;
  padding-left: 20px;
}

.recent-posts h4 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.recent-posts ul {
  list-style: none;
  padding: 0;
}

.recent-posts li {
  margin-bottom: 10px;
  text-align: left;
}

.recent-posts a {
  text-decoration: none;
  color: #007bff;
}

.recent-posts a:hover {
  text-decoration: underline;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal img,
.modal video {
  max-width: 90%;
  max-height: 90%;
}

@media (max-width: 768px) {
  .post-wrapper{
    display: block;
  }
  .post-content{
    margin: auto;
  }
  .recent-posts{
    display: flex;
    flex-direction: column;
  }
  .media-gallery{ grid-template-columns: repeat(1,1fr); }
}
</style>
