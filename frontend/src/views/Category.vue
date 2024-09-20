<template>
  <div class="category container-fluid">
    <Header />

    <div class="category-inner">
      <div class="timeline container">
        <!-- Timeline or additional content can go here -->
      </div>

      <div class="posts-section container">
        <h3 class="mb-4" style="text-align: left;">All Posts</h3>

        <!-- Display when there are no posts -->
        <div v-if="posts.length === 0" class="text-center text-muted">
          There are no posts available at the moment.
        </div>

        <!-- Posts Grid Section -->
        <div v-else class="posts-grid">
          <router-link 
            v-for="post in posts" 
            :key="post._id" 
            :to="`/category/palestine/${post._id}`"
            class="post-link"
          >
            <div class="post-card">
              <div class="post-image-container">
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
import { ref, onMounted } from 'vue';

export default {
  components: {
    Header,
    Footer
  },
  setup() {
    const posts = ref([]);

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/getAllPostsFromCategory`);
        posts.value = response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    onMounted(() => {
      fetchPosts(); // Fetch posts on component mount
    });

    return {
      posts,
      truncateText,
    };
  }
};
</script>

<style scoped>
.category-inner {
  min-height: 100vh;
}

.timeline {
  height: 300px;
  background-color: #333;
}

/* Grid Layout for Posts */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* Hover effect on post card */
.post-card {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: #fff;
  transition: border 0.3s ease; /* Transition for border */
}

.post-card:hover {
  border: 3px solid #007bff; /* Blue border on hover */
}

/* Link Styles */
.post-link {
  text-decoration: none;
  color: inherit;
}

.post-image-container {
  position: relative;
  height: 200px;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
}

.post-description {
  font-size: 1rem;
  color: #fff;
  text-align: justify;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 10px;
}

.post-card:hover .post-title-default {
  opacity: 0;
}

.post-card:hover .post-description {
  opacity: 1;
}

/* Pagination Styles */
.pagination-controls {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-controls button {
  margin: 0 10px;
}
</style>
