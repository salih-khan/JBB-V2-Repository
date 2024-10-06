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
                <h5 class="post-title-default">{{ post.title }}</h5>
                <p class="post-description">{{ getDescription(post.description ?? 'Default Description') }}</p>
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
import Timeline from '../components/Timeline.vue';
import { ref, onMounted } from 'vue';
import { useTruncateAndUntag } from '@/composables/useTruncateAndUntag';

export default {
  components: {
    Header,
    Footer,
    Timeline
  },
  setup() {
    const posts = ref([]);
    const apiBaseUrl = process.env.VUE_APP_API_URL;
    const { truncate } = useTruncateAndUntag();

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/getAllPostsFromCategory`);
        posts.value = response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const getDescription = (description) => {
      const maxDescriptionLength = 200;
      return truncate(description, maxDescriptionLength);
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
      getDescription,
      getMediaSrc,
      isVideo
    };
  }
};
</script>

<style scoped>
.category-inner {
  min-height: 100vh;
}
.container {
  padding: 0px;
}
.container-fluid {
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
  .posts-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 posts per row on mobile */
  }
}
</style>