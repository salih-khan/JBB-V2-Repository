<template>
  <div class="home">
    <Header />
    <Headline :post="firstItem"/>
    <div v-for="(section, index) in newsSections" :key="index">
      <NewsSection :posts="restOfItems"/>
    </div>
    <button @click="addNewsSection" class="btn btn-primary mt-3">Add More News</button>
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import InfoBar from '@/components/InfoBar.vue';
import Headline from '@/components/Headline.vue';
import NewsSection from '@/components/NewsSection.vue';
import axios from 'axios';
import Footer from '@/components/Footer.vue';


export default {
  name: 'HomeView',
  components: {
    Header,
    InfoBar,
    Headline,
    NewsSection,
    Footer
  },
  setup() {
    const newsSections = ref([{}]);
    const firstItem = ref(null);
    const restOfItems = ref([]);

    const addNewsSection = () => {
      newsSections.value.push({});
    };

    const loadAllPosts = async () => {
      try {
        const response = await axios.get('/api/getAllPosts');
        const posts = response.data;

        if (Array.isArray(posts) && posts.length > 0) {
          firstItem.value = posts[0];
          restOfItems.value = posts.slice(1);
        }

        console.log("First item: ", firstItem);
        console.log("Everything else: ", restOfItems);
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    };

    onMounted(() => {
      loadAllPosts();
    });

    return {
      newsSections,
      addNewsSection,
      firstItem,
      restOfItems
    };
  }
}
</script>

<style scoped>
.btn {
    display: block;
    margin: 20px auto;
}
</style>
