<template>
  <div class="container devlog">
    <Header />
    <div class="development-log">
      <h1 class="text-left mb-5">Development Log</h1>

      <!-- Current Updates Section -->
      <section class="current-updates mb-5">
        <h2 class="section-title">Current Updates</h2>
        <div class="update-list">
          <div v-for="update in currentUpdates" :key="update.id" class="update-item">
            <h5 class="update-title">{{ update.title }}</h5>
            <p class="update-description">{{ update.description }}</p>
            <p class="update-date">{{ formatDate(update.date) }}</p>
          </div>
        </div>
      </section>

      <!-- Future Plans Section -->
      <section class="future-plans">
        <h2 class="section-title">Future Plans</h2>
        <div class="plan-list">
          <div v-for="plan in futurePlans" :key="plan.id" class="plan-item">
            <h5 class="plan-title">{{ plan.title }}</h5>
            <p class="plan-description">{{ plan.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Header from '../components/Header.vue'

export default defineComponent({
  components: {
    Header
  },
  name: 'DevelopmentLog',
  setup() {
    // Sample data for Current Updates
    const currentUpdates = ref([
      {
        id: 1,
        title: 'jbb.foundation Official setup',
        date: '2024-10-05',
        description: 'Hello everyone, the developer here. Journalists Beyond Borders is now at a stage where there is a working ' +
                     'product available for users to user. Officially this is now in beta testing.',
      },
      {
        id: 2,
        title: '"Palestine" currently is the only category',
        date: '2024-10-05',
        description: 'This will most certainly change in the near future as the user base grows a wide variety of topics will ' +
                     'become available. ',
      },
    ]);

    // Sample data for Future Plans
    const futurePlans = ref([
      {
        id: 1,
        title: 'User Profile Overhaul',
        description: 'We plan to overhaul user profiles with more customization and security.',
      },
      {
        id: 2,
        title: 'Mobile App Development',
        description: 'Development is underway for mobile apps on iOS and Android platforms.',
      },
    ]);

    // Date formatting function
    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    };

    return {
      currentUpdates,
      futurePlans,
      formatDate,
    };
  },
});
</script>

<style scoped>
/* Global container adjustments */
.development-log {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  background-color: #f9fafc;
  text-align: left;
  border-radius: 10px;
}

.devlog{
  margin-top: 20px;
}

h1, h2 {
  color: #333;
  font-weight: 600;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

/* Left-aligned updates list */
.update-list, .plan-list {
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto; /* Makes sections scrollable */
  padding-left: 0;
}

.update-item, .plan-item {
  padding: 15px 0;
  border-bottom: 1px solid #eaeaea;
}

.update-title, .plan-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #007bff;
}

.update-description, .plan-description {
  font-size: 0.9rem;
  color: #495057;
  margin-top: 5px;
}

.update-date {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 5px;
}

/* Remove border for the last item */
.update-item:last-child, .plan-item:last-child {
  border-bottom: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .development-log {
    padding: 10px;
  }

  .devlog{
    margin-top: 0px;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .update-title, .plan-title {
    font-size: 1rem;
  }

  .update-description, .plan-description {
    font-size: 0.85rem;
  }
}
</style>