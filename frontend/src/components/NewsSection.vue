<template>
  <div class="container mt-4">
    <div class="row g-4">
      <div class="col-md-4" v-for="(card, index) in visibleCards" :key="index">
        <div class="card border-0 d-flex flex-column align-items-center">
          <div class="img-container">
            <img :src="getImageSrc(card.images)" class="card-img" alt="Card image" />
          </div>
          <div class="card-body text-center">
            <h5 class="card-title">{{ card.title ?? 'Default Title' }}</h5>
            <p class="card-text">{{ getDescription(card.description ?? 'Default Description') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import 'bootstrap/dist/css/bootstrap.min.css';

export default {
  name: 'CardGrid',
  props: {
    posts: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const initialCardCount = 12;
    const cardCount = ref(initialCardCount);

    const visibleCards = computed(() => {
      return props.posts.slice(0, cardCount.value);
    });

    const getDescription = (description) => {
      const maxLength = 250; // Fixed length for the description
      return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
    };



    const getImageSrc = (images) => {
      return (images && images.length > 0 ? images[0] : 'https://via.placeholder.com/300x200');
    };

    return {
      visibleCards,
      getDescription,
      getImageSrc
    };
  }
};
</script>

<style scoped>
.container {
  padding: 0 15px; /* Padding for mobile devices */
}

.card {
  border: none;
  margin: auto;
  margin-bottom: 20px; /* Spacing between cards */
  width: 100%;
  max-width: 350px; /* Fixed width for the cards */
  height: 350px; /* Fixed height for the cards */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  justify-content: center; /* Center content vertically if needed */
}

.img-container {
  width: 100%;
  height: 200px; /* Fixed height for the image container */
  overflow: hidden;
  display: flex;
  align-items: center; /* Center image vertically */
  justify-content: center; /* Center image horizontally */
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures images fit well */
  border-radius: 0; /* No border-radius for images */
}

.card-body {
  padding: 15px; /* Padding inside the card */
  text-align: center; /* Center text inside the card body */
}

.card-title {
  margin-bottom: 0.5rem;
}

.card-text {
  height: 4.5em; /* Fixed height for description */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 8; /* Number of lines to show */
  -webkit-box-orient: vertical;
  text-align: justify;
}

.btn-primary {
  width: 100%;
}
</style>