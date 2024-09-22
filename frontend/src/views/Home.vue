<template>
  <div class="home">
    <Header />
    <Headline :post="firstItem"/>

    <div v-for="(section, index) in newsSections" :key="index">
      <NewsSection :posts="visiblePosts"/>
    </div>

    <button v-if="!allPostsLoaded" @click="loadMore" class="btn btn-primary mt-3">Load More</button>

    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import Headline from '@/components/Headline.vue';
import NewsSection from '@/components/NewsSection.vue';
import axios from 'axios';
import Footer from '@/components/Footer.vue';

export default {
  name: 'HomeView',
  components: {
    Header,
    Headline,
    NewsSection,
    Footer
  },
  setup() {
    const newsSections = ref([{}]);
    const firstItem = ref(null);
    const visiblePosts = ref([]);
    const page = ref(1);
    const limit = 12;
    const allPostsLoaded = ref(false);

    const loadAllPosts = async () => {
    try {
        const response = await axios.get(`/api/getAllPosts?page=${page.value}&limit=${limit}`);
        const posts = response.data;

        if (posts.length > 0) {
            if (page.value === 1) {
                firstItem.value = posts[0]; // First item for headline
                visiblePosts.value = posts.slice(1); // All other posts
            } else {
                visiblePosts.value = [...visiblePosts.value, ...posts]; // Append new posts to the existing list
            }

            if (posts.length < limit) {
                allPostsLoaded.value = true; // No more posts to load
            }
        } else {
            allPostsLoaded.value = true; // If no posts, stop loading
        }
    } catch (error) {
        console.error('Failed to load posts:', error);
    }
};

    const loadMore = () => {
      page.value++;
      loadAllPosts();
    };

    onMounted(() => {
      loadAllPosts();
    });

    return {
      newsSections,
      firstItem,
      visiblePosts,
      loadMore,
      allPostsLoaded
    };
  }
};
</script>

<style scoped>
.btn {
  display: block;
  margin: 20px auto;
}
</style>
