import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home.vue';
import Profiles from '../views/Profiles.vue';
import ProfilePage from '../views/ProfilePage.vue';
import { useAuthValidate } from '../composables/useAuthValidate';
import Create from '../views/Create.vue'
import Category from '../views/Category.vue'
import IndividualPost from '../views/IndividualPost.vue'
import LoadingTest from '../views/LoadingTest.vue'
import DevLog from '../views/DevLog.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/create',
    name: 'Create',
    component: Create    
  },
  {
    path: '/profiles',
    name: 'Profiles',
    component: Profiles,
    // meta: { requiresAuth: true }
  },
  {
    path: '/profiles/:id',
    name: 'ProfilePage',
    component: ProfilePage,
    props: true // Pass route params as props to the component
  },
  {
    path: '/category/:cat',
    name: 'Category',
    component: Category,
    props: true // Pass route params as props to the component
  },
  {
    path: '/category/:cat/:postId',
    name: 'IndividualPost',
    component: IndividualPost,
    props: true // Pass route params as props to the component
  }
  ,
  {
    path: '/loading',
    name: 'Loading',
    component: LoadingTest,
  }
  ,
  {
    path: '/development',
    name: 'Development',
    component: DevLog,
  },
  {
    path: '*', // Catch-all route
    redirect: '/' // Redirect all unknown routes to the home page
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, fetchUser } = useAuthValidate();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    await fetchUser();
    if (isAuthenticated.value) {
      next();
    } else {
      next({ name: 'Home' });
    }
  } else {
    next();
  }
});

export default router;
