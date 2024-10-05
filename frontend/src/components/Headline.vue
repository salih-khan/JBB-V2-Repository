<template>
  <div class="headline">
    <discordInvite />
    <div class="row">
      <div class="col-12 d-flex align-items-stretch" @click="post ? goToPost(post._id) : null">
        <div class="card w-100 d-flex flex-column flex-md-row">
          <div class="col-md-6 d-flex justify-content-center align-items-center p-0">
            <template v-if="isVideo(post?.images)">
              <video
                  :src="getMediaSrc(post?.images)"
                  class="video-fluid medium-video"
                  poster="https://www.vocaleurope.eu/wp-content/uploads/no-image.jpg"
                  autoplay
                  muted
                  playsinline
                  disablePictureInPicture
                  controlsList="nodownload noplaybackrate nofullscreen">
              </video>
            </template>
            <template v-else>
              <img :src="getMediaSrc(post?.images)" :class="imgClass" alt="Main headline" style="object-fit: cover;">
            </template>
          </div>
          <div class="col-md-6 d-flex flex-column justify-content-start p-3">
            <h5 class="card-title">{{ post?.title ?? 'Default Title' }}</h5>
            <div class="d-flex mb-2">
              <!-- Display number of proofs -->
              <button class="icons">
                {{ post?.proofs?.length ?? 0 }} Proof{{ (post?.proofs?.length ?? 0) > 1 ? 's' : '' }}
              </button>
              <!-- Display number of images -->
              <button class="icons">
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
import { useRouter } from 'vue-router';

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
    const router = useRouter();

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

    // Get media (image or video) source
    const getMediaSrc = (media) => {
      return (media && media.length > 0 ? media[0] : 'https://www.vocaleurope.eu/wp-content/uploads/no-image.jpg');
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
      truncatedDescription,
      imgClass,
      getMediaSrc,
      isVideo,
      goToPost
    };
  }
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 4px;
  text-align: left;
  margin: 2rem; /* general margin for larger screens */
}

.card:hover{
  cursor: pointer;
}

/* Ensure no padding/margin gap on mobile */
@media (max-width: 576px) {
  .card {
    margin: 0.5rem; /* Reduce margin on smaller screens */
  }
  .headline {
    padding: 0.5rem; /* Adjust padding on mobile */
  }
  .col-md-6 {
    padding: 0; /* Remove padding between columns on mobile */
  }
}

.img-fluid, .video-fluid {
  margin: auto;
  border-radius: 4px;
}

.medium-img, .medium-video {
  width: 100%;
  max-height: 300px;
}

@media (max-width: 576px) {
  .medium-img, .medium-video {
    max-height: 200px; /* Reduce the height on mobile for better fit */
  }
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
  padding: 1rem;
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

/* Responsive tweaks */
@media (max-width: 576px) {
  .icons {
    font-size: 0.7rem; /* Reduce icon size on smaller screens */
  }
}
</style>

