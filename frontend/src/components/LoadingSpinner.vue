<template>
  <div class="spinner" v-if="isLoading">
    <div class="loader"></div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const isLoading = ref(true); // You can control this prop externally

    return {
      isLoading,
    };
  },
};
</script>

<style scoped>
.spinner {
  position: fixed; /* Make the spinner fixed */
  top: 0; /* Position at the top of the viewport */
  left: 0; /* Position at the left of the viewport */
  right: 0; /* Stretch to the right of the viewport */
  bottom: 0; /* Stretch to the bottom of the viewport */
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5); /* Optional: semi-transparent background */
  z-index: 8; /* Ensure it's above other elements */
}

.loader {
  border: 8px solid rgba(255, 255, 255, 0.2);
  border-left-color: #4caf50; /* Spinner color */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
