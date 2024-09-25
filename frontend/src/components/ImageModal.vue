<template>
  <div class="modal" v-if="visible" @click="closeModal">
    <div class="modal-content" @click.stop>
      <img :src="imageSrc" class="modal-image" alt="Full size image" />
      <button class="close-button" @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    imageSrc: String,
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it’s above other content */
}

.modal-content {
  position: relative;
  width: 90%; /* Slightly smaller than full width */
  max-width: 800px; /* Max width for the image */
  height: auto; /* Height adjusts automatically */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px; /* Optional: rounded corners */
  background: rgba(255, 255, 255, 0); /* Slightly transparent white background */
  padding: 10px; /* Padding around the image */
}

.modal-image {
  max-width: 100%;
  max-height: 80vh; /* Limit height to avoid overflow */
  object-fit: contain; /* Keep aspect ratio */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #333;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
