<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link class="navbar-brand fw-bold display-6" to="/">JBB</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/profiles">Profiles</router-link>
            </li>
          </ul>
          <div class="d-none d-lg-flex align-items-center">
            <router-link v-if="isAuthenticated" to="/create" class="btn btn-primary rounded-pill me-2 create-btn">Create</router-link>
            <a id="login" v-if="!isAuthenticated" @click="signIn" class="sign-in m-1">Sign In</a>
            <div v-if="isAuthenticated" class="dropdown d-inline-block">
              <a 
                class="btn p-0 m-0" 
                href="#" 
                role="button" 
                id="dropdownMenuLink" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <img :src="user.imageUrl" alt="User Profile" width="40" height="40" class="rounded-circle m-1 d-none d-lg-inline">
                <img :src="user.imageUrl" alt="User Profile" width="30" height="30" class="rounded-circle m-1 d-inline d-lg-none">
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink">
                <li><router-link class="dropdown-item" :to="'/profiles/' + user._id">Profile</router-link></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item logout-btn" href="/auth/logout">Logout</a></li>
              </ul>
            </div>
          </div>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 d-lg-none">
            <li class="nav-item" v-if="isAuthenticated">
              <router-link to="/create" class="nav-link">Create</router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated">
              <a @click="signIn" class="nav-link">Sign In</a>
            </li>
            <li class="nav-item dropdown" v-if="isAuthenticated">
              <a 
                class="nav-link dropdown-toggle" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <img :src="user.imageUrl" alt="User Profile" width="30" height="30" class="rounded-circle">
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><router-link class="dropdown-item" :to="'/profiles/' + user._id">Profile</router-link></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item logout-btn" href="/auth/logout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container-fluid container-items p-2 bg-light">
      <div class="container justify-content-start d-flex">
        <router-link class="btn btn-pink rounded-pill" :to="{ path: '/category/' + 'Palestine' }" >Palestine</router-link>
      </div>
    </div>
  </header>
</template>

  <script>
  import { onMounted } from 'vue';
  import { useAuthValidate } from '../composables/useAuthValidate';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Header',
    setup() {
      const { isAuthenticated, user, fetchUser } = useAuthValidate();
      const router = useRouter();
  
      const signIn = () => {
        if (!isAuthenticated.value) {
          window.location.href = '/auth/google';
        }
      };
  
      const createVerifyClick = () => {
        if (isAuthenticated.value) {
          router.push({ name: 'Create' });
        } else {
          window.location.href = '/auth/google';
        }
      };

      const goToProfile = () => {
      if (user && user._id) {
        router.push(`/profile/${user._id}`);
        console.log("It worked going to your profile")
      } else {
        console.error('User or user.nameId is undefined');
      }
    };
    
      onMounted(async () => {
        await fetchUser();
        console.log("User is ", user)
      });
  
      return {
        isAuthenticated,
        user,
        signIn,
        createVerifyClick,
        goToProfile
      };
    }
  };
  </script>
  
  <style scoped>
  /* Add any custom styles here if needed */
  /* Sign In Button Styles */
  .sign-in {
    display: inline-block;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    color: #ffffff;
    background-color: #333333;
    border: none;
    border-radius: 25px;
    transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
    cursor: pointer;
  }
  
  .sign-in:hover {
    background-color: #555555;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .sign-in:active {
    background-color: #222222;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(0);
  }
  
  .create {
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .header-title{
    z-index: 5;
  }
  .header-title:hover{
    cursor: pointer;
  }
  
  .btn-pink {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #ff6f61; /* Warm pink color */
    border: none;
    border-radius: 50px; /* Makes the button rounded like a pill */
    transition: background-color 0.3s ease, transform 0.3s ease; /* Add transition for smooth animation */
  }
  
  .btn-pink:hover {
    background-color: #ff856c; /* Slightly lighter pink on hover */
    transform: scale(1.05); /* Slightly increase size on hover */
  }
  
  .dropdown-menu {
    min-width: 200px;
  }
  
  .dropdown-item {
    color: #333;
  }
  
  .dropdown-item:hover {
    background-color: #f1f1f1;
  }
  
  .shadow-sm {
    box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075);
  }
  
  .me-3 {
    margin-right: 1rem !important;
  }
  
  /* Logout Button Styles */
  .logout-btn {
    color: #ff4500;
    font-weight: bold;
    text-align: center;
  }
  </style>
  