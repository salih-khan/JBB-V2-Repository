<template>
  <div class="home">
    <Header/>
    <!-- <InfoBar message="In the near future other events and categories shall be added"/> -->
    <Headline />
    <div v-for="(section, index) in newsSections" :key="index">
      <NewsSection />
    </div>
    <button @click="addNewsSection" class="btn btn-primary mt-3">Add More News</button>

    <Footer />
  </div>
</template>

<script>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import InfoBar from '@/components/InfoBar.vue';
import Headline from '@/components/Headline.vue';
import NewsSection from '@/components/NewsSection.vue';
import Footer from '@/components/Footer.vue'
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

    const addNewsSection = () => {
      newsSections.value.push({});
    };

    return {
      newsSections,
      addNewsSection
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