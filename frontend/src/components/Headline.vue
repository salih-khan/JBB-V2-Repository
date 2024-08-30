<template>
  <div class="headline">
    <discordInvite />
    <div class="row">
      <div class="col-12 d-flex align-items-stretch">
        <div class="card w-100 d-flex flex-column flex-md-row">
          <div class="col-md-6 d-flex justify-content-center align-items-center p-0">
            <img src="https://wallpapercave.com/wp/wp2747062.jpg" :class="imgClass" alt="Main headline" style="object-fit: cover;">
          </div>
          <div class="col-md-6 d-flex flex-column justify-content-start p-3">
            <h5 class="card-title">{{ post.title }}</h5>
            <div class="d-flex mb-2">
              <button class="btn btn-secondary btn-sm icons">Icon 1</button>
              <button class="btn btn-secondary btn-sm icons">Icon 2</button>
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
  name: 'Headline',
  components: {
    discordInvite
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const description = ref(props.post.description || '');

    const truncatedDescription = computed(() => {
      return description.value.length > 150 ? description.value.substring(0, 150) + '...' : description.value;
    });

    const imgClass = computed(() => {
      return window.innerWidth <= 574 ? 'img-fluid small-img' : 'img-fluid medium-img';
    });

    return {
      description,
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
}
</style>
