<template>
  <div class="post-detail container-fluid" v-if="post">
    <Header />

    <div class="post-wrapper">
      <!-- Main Post Section -->
      <div class="post-content">
        <h1 class="post-title">{{ post.title }}</h1>

        <div class="post-meta">
          <p>By: <a :href="`http://localhost:3000/profiles/${user._id}`" target="_blank">{{ user.displayName }} - {{ post.nameId }}</a></p>
          <span class="post-date">{{ formatDate(post.date) }}</span>
        </div>

        <!-- Post Main Image -->
        <div class="post-image">
          <img :src="post.images.length > 0 ? post.images[0] : 'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'" :alt="post.title" />
        </div>

        <!-- Post Description -->
        <div class="post-body">
          <p v-html="post.description"></p>
        </div>

        <!-- Additional Images Section -->
        <div class="additional-images" v-if="post.images.length > 1">
          <h4>Additional Images</h4>
          <div class="images-gallery">
            <div
              v-for="(image, index) in post.images.slice(1)" 
              :key="index" 
              class="image-item"
            >
              <img :src="image" :alt="'Additional Image ' + (index + 1)" />
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
          <li v-for="(recentPost, index) in recentPosts" :key="index">
            <a :href="`/post/${recentPost.id}`">{{ recentPost.title }}</a>
          </li>
        </ul>
      </div>
    </div>

    <Footer />
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import { useRoute } from "vue-router";

export default {
  components: { Header, Footer },
  setup() {
    const post = ref(null);
    const user = ref(null);
    const recentPosts = ref([]);
    const placeholderImage = "path/to/placeholder.jpg"; // Add your placeholder image URL here
    const route = useRoute();

    const fetchPost = async () => {
      try {
        const { postId } = route.params;
        const response = await axios.get(`/api/getIndividualPost/${postId}`);

        // Axios automatically parses the JSON response
        const responseData = response.data; // Access data directly
        post.value = responseData.post;
        user.value = responseData.user;

        console.log("Frontend: post and user: ", user.value, " ", post.value);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formattedSource = (source) => {
      // Ensure the URL starts with 'http://' or 'https://'
      if (!source.startsWith('http://') && !source.startsWith('https://')) {
        return `https://${source}`;
      }
      return source;
    };

    onMounted(() => {
      fetchPost();
    });

    return { post, user, recentPosts, placeholderImage, formatDate, formattedSource };
  },
};
</script>


<style scoped>
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

.post-image img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  margin-bottom: 20px;
}

.post-body {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 40px;
  text-align: left;
}

/* Additional Images Section */
.additional-images {
  margin-bottom: 40px;
}

.images-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 images per row */
  gap: 10px;
}

.image-item {
  overflow: hidden;
}

.image-item img {
  width: 100%;
  height: 100%;
  max-height: 200px;
  object-fit: cover; /* Ensures the image is not pixelated and maintains aspect ratio */
}

/* Proofs Section */
.post-proofs {
  margin-bottom: 40px;
  text-align: left
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
  overflow-wrap: anywhere
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
}

.recent-posts a {
  text-decoration: none;
  color: #007bff;
}

.recent-posts a:hover {
  text-decoration: underline;
}
</style>
