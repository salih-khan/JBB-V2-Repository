<template>
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-4 mb-4" v-for="(card, index) in cards" :key="index">
          <div class="card border-0">
            <img :src="card.image" class="card-img-top" alt="Card image">
            <div class="card-body">
              <h5 class="card-title">{{ card.title }}</h5>
              <p class="card-text">{{ getDescription(card.description) }}</p>
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
    setup() {
      const cards = ref([
        {
          image: 'https://via.placeholder.com/150',
          title: 'A cat shows up in the rubble of a building that was flying',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Card Title 2',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Card Title 3',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Card Title 4',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Card Title 5',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Card Title 6',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'A cat shows up in the rubble of a building that was flying',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Card Title 2',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Card Title 3',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Card Title 4',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Card Title 5',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          image: 'https://via.placeholder.com/150',
          title: 'Card Title 6',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        }
      ]);
  
      const getDescription = (description) => {
        return description.length > 250 ? description.substring(0, 250) + '...' : description;
      };
  
      return {
        cards,
        getDescription
      };
    }
  }
  </script>
  
  <style scoped>

  .card {
    border: none;
    border-radius: 4px;
    margin: auto;
    width: 300px;
  }
  .card-img-top {
    width: 300px;
    height: 200px;
    border-radius: 0px;
    margin: auto;
  }
  .card-body {
    text-align: left;
  }
  .card-title {
    margin-bottom: 0.5rem;
    text-align: left;
  }
  </style>
  