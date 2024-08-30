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
              <h5 class="card-title">{{post.title}}</h5>
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
  import {ref, computed} from 'vue'
  import discordInvite from '../components/discordInvite.vue'
  export default {
    name: 'NewsCard',
    components: {
      discordInvite
    },
    props: ['post'],

    setup() {
      const description = ref(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);
  
      const truncatedDescription = computed(() => {
        return description.value.length > 150 ? description.value.substring(0, 150) + '...' : description.value;
      });
  
      const imgClass = computed(() => {
        if(window.innerWidth <= 574){
            return 'img-fluid medium-img';
        }else{
            return 'img-fluid medium-img';
        }
      });
  
      return {
        description,
        truncatedDescription,
        imgClass
      };
    }
  }
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
  