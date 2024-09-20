<template>
    <div class="post-detail container-fluid" v-if="post">
      <Header />
  
      <div class="post-content container">
        <div v-if="post" class="post-container">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <p class="post-author">By: {{ post.nameId }}</p>
            <p class="post-date">{{ formatDate(post.date) }}</p>
          </div>
  
          <!-- Post Main Image -->
          <div v-if="post.images.length > 0" class="post-image">
            <img :src="post.images[0]" :alt="post.title" />
          </div>
  
          <!-- Post Content -->
          <div class="post-body">
            <p v-html="post.description"></p>
          </div>
  
          <!-- Other Images -->
          <div v-if="post.images.length > 1" class="post-images-gallery">
            <h4>More Images</h4>
            <div class="gallery-grid">
              <img
                v-for="(image, index) in post.images.slice(1)"
                :key="index"
                :src="image"
                :alt="`Image ${index + 1}`"
                class="gallery-image"
              />
            </div>
          </div>
  
          <!-- Post Proofs -->
          <div v-if="post.proofs.length > 0" class="post-proofs">
            <h4>Proofs</h4>
            <ul>
              <li v-for="(proof, index) in post.proofs" :key="index">
                <p><strong>{{ proof.title }}:</strong> {{ proof.description }} <a :href="proof.source" target="_blank">Source</a></p>
              </li>
            </ul>
          </div>
  
          <!-- Comments Section -->
          <div v-if="post.comments && post.comments.length > 0" class="comments-section">
            <h4>Comments</h4>
            <ul>
              <li v-for="(comment, index) in post.comments" :key="index">
                <p><strong>{{ comment.user.name }}:</strong> {{ comment.text }}</p>
              </li>
            </ul>
          </div>
  
          <!-- Add Comment Form -->
          <div class="add-comment">
            <h4>Add a Comment</h4>
            <textarea
              v-model="newComment"
              placeholder="Enter your comment..."
              rows="4"
            ></textarea>
            <button  class="btn btn-primary mt-3">Submit</button>
          </div>
        </div>
  
        <!-- Loading & Error States -->
        <div v-else-if="loading" class="loading-message">
          Loading post...
        </div>
        <div v-else class="error-message">
          Post not found or an error occurred.
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
  import { useRoute } from "vue-router"; // Import useRoute
  
  export default {
    components: { Header, Footer },
    setup() {
      const post = ref(null);
      const loading = ref(true);
      const route = useRoute();
  
      // Fetch individual post using the new API endpoint
      const fetchPost = async () => {
        try {
          const { postId } = route.params; // Correct extraction of postId from route params
          const response = await axios.get(`/api/getIndividualPost/${postId}`);
          post.value = response.data;
          loading.value = false;
        } catch (error) {
          console.error("Error fetching post:", error);
          loading.value = false;
        }
      };
  
      // Function to add a comment
    //   const addComment = async () => {
    //     try {
    //       const { postId } = route.params;
    //       await axios.post(`/api/post/${postId}/comment`, {
    //         comment: newComment.value,
    //       });
    //       newComment.value = "";
    //       fetchPost(); // Refresh post to show the new comment
    //     } catch (error) {
    //       console.error("Error adding comment:", error);
    //     }
    //   };
  
      // Format date utility function
      const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
      };
  
      // Fetch post on component mount
      onMounted(() => {
        fetchPost();
      });
  
      return { post, loading, formatDate };
    },
  };
  </script>
  
  <style scoped>
  .post-detail {
    padding: 20px;
  }
  
  .post-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .post-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .post-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .post-image {
    margin-bottom: 20px;
  }
  
  .post-body {
    margin-bottom: 20px;
  }
  
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
  
  .gallery-image {
    width: 100%;
    object-fit: cover;
  }
  
  .post-proofs,
  .comments-section {
    margin-bottom: 20px;
  }
  
  .add-comment {
    margin-top: 20px;
  }
  
  textarea {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
  }
  
  button:disabled {
    background-color: #ccc;
  }
  </style>
  