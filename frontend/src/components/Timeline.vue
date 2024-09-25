<template>
  <div class="timeline">
    <div class="timeline-inner">
      <div
          v-for="(group, date) in groupedPosts"
          :key="date"
          class="timeline-group"
      >
        <div class="timeline-date">{{ formatDate(date) }}</div>
        <div class="timeline-items">
          <div
              v-for="post in group"
              :key="post.id"
              class="timeline-item"
          >
            <h3 class="timeline-title">{{ truncateTitle(post.title) }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'Timeline',
  props: {
    posts: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    // Sort and group posts by date
    const groupedPosts = computed(() => {
      const sortedPosts = [...props.posts].sort((a, b) => new Date(a.date) - new Date(b.date));
      return sortedPosts.reduce((acc, post) => {
        const date = post.date.split('T')[0]; // Get only the date part
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(post);
        return acc;
      }, {});
    });

    // Format date to a readable format
    const formatDate = (date) => {
      const options = {year: 'numeric', month: 'long', day: 'numeric'};
      return new Date(date).toLocaleDateString(undefined, options);
    };

    // Truncate title to 15 characters
    const truncateTitle = (title) => {
      return title.length > 15 ? title.slice(0, 15) + '...' : title;
    };

    return {
      groupedPosts,
      formatDate,
      truncateTitle,
    };
  },
});
</script>

<style scoped>
.timeline {
  display: flex;
  overflow-x: auto; /* Allow horizontal scrolling */
  padding: 20px;
  border: 1px solid #ccc; /* Optional border for styling */
}

.timeline-inner {
  display: flex;
}

.timeline-group {
  margin-right: 60px; /* Space between groups */
  min-width: 200px; /* Adjust width for better spacing */
}

.timeline-date {
  font-weight: bold;
  color: #666;
  margin-bottom: 5px; /* Space below the date */
  font-size: 12px; /* Smaller font size for date */
}

.timeline-items {
  display: flex;
  flex-direction: column; /* Stack items vertically */
}

.timeline-item {
  margin-bottom: 5px; /* Space between items */
  padding: 8px;
  background-color: #f9f9f9; /* Optional background */
  border: 1px solid #ddd; /* Optional border */
  border-radius: 4px; /* Optional border radius */
  min-width: 180px; /* Adjust as needed for larger columns */
  text-align: center; /* Center the title */
}

.timeline-title {
  font-size: 12px; /* Smaller font size for titles */
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden; /* Hide overflow text */
  text-overflow: ellipsis; /* Add ellipsis for overflowing text */
}
</style>
