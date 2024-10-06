<template>
  <div class="container mt-4">
    <div class="row g-4">
      <div class="col-md-4" v-for="(card, index) in visibleCards" :key="index">
        <div class="card border-0 d-flex flex-column align-items-center" @click="goToPost(card._id)">
          <div class="media-container">
            <template v-if="isVideo(card.images)">
              <video
                  :src="getMediaSrc(card.images)"
                  class="card-video"
                  poster="https://via.placeholder.com/300x200"
                  autoplay
                  muted
                  playsinline
                  disablePictureInPicture
                  controlsList="download noplaybackrate nofullscreen">
              </video>
            </template>
            <template v-else>
              <img :src="getMediaSrc(card.images)" class="card-img" alt="Card image" />
            </template>
          </div>
          <div class="card-body text-center">
            <h5 class="card-title">{{ getTruncatedTitle(card.title ?? 'Default Title') }}</h5>
            <p class="card-text">{{ getDescription(card.description ?? 'Default Description') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTruncateAndUntag } from '@/composables/useTruncateAndUntag';

export default {
  name: 'NewsSection',
  props: {
    posts: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const router = useRouter();
    const { truncate } = useTruncateAndUntag();

    const visibleCards = computed(() => {
      return props.posts; // All posts are visible (Pagination handled in Home)
    });

    // Truncate and strip HTML tags from description
    const getDescription = (description) => {
      const maxDescriptionLength = 250;
      return truncate(description, maxDescriptionLength);
    };

    // Truncate the title to a fixed length
    const getTruncatedTitle = (title) => {
      const maxTitleLength = 50;
      return truncate(title, maxTitleLength);
    };

    // Get media (image or video) source
    const getMediaSrc = (media) => {
      return (media && media.length > 0 ? media[0] : 'https://via.placeholder.com/300x200');
    };

    // Check if the media file is a video based on the file extension
    const isVideo = (media) => {
      if (media && media.length > 0) {
        const videoFormats = ['mp4', 'webm', 'ogg'];
        const fileExtension = media[0].split('.').pop().toLowerCase();
        return videoFormats.includes(fileExtension);
      }
      return false;
    };

    const goToPost = (id) => {
      router.push(`category/palestine/${id}`);
    }

    return {
      visibleCards,
      getDescription,
      getTruncatedTitle,
      getMediaSrc,
      isVideo,
      goToPost
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

.media-container {
  width: 100%;
  height: 200px; /* Fixed height for the media container */
  overflow: hidden;
  display: flex;
  align-items: center; /* Center media vertically */
  justify-content: center; /* Center media horizontally */
}

.card-img, .card-video {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures media fits well */
  border-radius: 10px; /* No border-radius for images or videos */
}

.card-body {
  padding: 15px; /* Padding inside the card */
  text-align: left; /* Center text inside the card body */
  width: 100%;
}

.card-title {
  margin-bottom: 0.5rem;
  text-align: left;
}

.card:hover {
  cursor: pointer;
}

.card-text {
  height: 5em; /* Fixed height for description */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 8; /* Clamp lines for ellipsis */
  -webkit-box-orient: vertical;
}
</style>