<template>
  <div class="headline">
    <discordInvite />
    <div class="row">
      <div class="col-12 d-flex align-items-stretch">
        <div class="card w-100 d-flex flex-column flex-md-row">
          <div class="col-md-6 d-flex justify-content-center align-items-center p-0">
            <img :src="post?.images?.[0] ?? 'https://www.vocaleurope.eu/wp-content/uploads/no-image.jpg'" :class="imgClass" alt="Main headline" style="object-fit: cover;">
          </div>
          <div class="col-md-6 d-flex flex-column justify-content-start p-3">
            <h5 class="card-title">{{ post?.title ?? 'Default Title' }}</h5>
            <div class="d-flex mb-2">
              <!-- Display number of proofs -->
              <button class=" icons">
                {{ post?.proofs?.length ?? 0 }} Proof{{ (post?.proofs?.length ?? 0) > 1 ? 's' : '' }}
              </button>
              <!-- Display number of images -->
              <button class=" icons">
                +{{ post?.images?.length ?? 0 }} Image{{ (post?.images?.length ?? 0) > 1 ? 's' : '' }}
              </button>
            </div>
            <p class="card-text">{{ truncatedDescription }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import { ref, computed } from 'vue';
import discordInvite from '../components/discordInvite.vue';

export default {
  name: 'NewsCard',
  components: {
    discordInvite
  },
  props: {
    post: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    // Truncated description with optional chaining and nullish coalescing
    const truncatedDescription = computed(() => {
      const description = props.post?.description ?? 'Default Description';
      return description.length > 150 
        ? description.substring(0, 150) + '...' 
        : description;
    });

    // Image class based on screen size
    const imgClass = computed(() => {
      return window.innerWidth <= 574 ? 'img-fluid medium-img' : 'img-fluid medium-img';
    });

    return {
      truncatedDescription,
      imgClass
    };
  }
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 4px;
  text-align: left;
  margin: 2rem;
}

.img-fluid {
  margin: auto;
  border-radius: 4px;
}

.small-img {
  width: 150px;
  height: 150px;
}

.medium-img {
  width: 100%;
  max-height: 300px;
}

.card-body {
  text-align: left;
}

.card-title {
  margin-bottom: 0.5rem;
}

.headline {
  margin: auto;
  max-width: 1250px;
}

.icons {
  margin-right: 0.2rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  z-index: 1; /* Make sure proofs are above other content */
}
</style>
