<template>
    <div class="container">
        <div v-if="visible" class="info-bar text-light alert alert-dismissible fade show m-3 information-bar" role="alert">
            <div class="d-flex align-items-center">
              <span class="info-bar-icon">ℹ️</span>
              <span class="info-bar-message flex-grow-1">{{ message }}</span>
              <button type="button" class="close" @click="dismiss" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
    </div>
  </template>
  
  <script>
import {ref} from 'vue'
  
  export default {
    name: 'InfoBar',
    props: ['message'],
    setup() {
    const visible = ref(true);
    const dismiss = () => {
      visible.value = false;
    };

    return {
      visible,
      dismiss
    };
  }
  }
  </script>
  
  <style scoped>
  .information-bar {
    background-color: #333;
  }
  </style>