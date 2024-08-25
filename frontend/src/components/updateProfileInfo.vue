<template>
  <div class="overlay">
    <div class="edit-profile-box text-left">
      <h1 class="text-center">Edit Profile</h1>
      <div class="edit-field">
        <label for="displayName" class="form-label">Display Name</label>
        <input type="text" id="displayName" class="form-control" v-model="displayName" />
      </div>
      <div class="edit-field">
        <label for="bannerImage" class="form-label">Banner Image</label>
        <input type="file" id="bannerImage" class="form-control" @change="handleBannerImageChange" />
      </div>
      <div class="edit-field">
        <label for="pfp" class="form-label">Profile Picture</label>
        <input type="file" id="profilePicture" class="form-control" @change="handleProfilePictureChange" />
      </div>
      <div class="edit-field">
        <label for="bio" class="form-label">Bio</label>
        <textarea id="bio" class="form-control" v-model="bio"></textarea>
      </div>
      <div class="text-center mt-3">
        <button class="btn btn-primary" style="margin-right: 1rem;" @click="saveChanges">Save Changes</button>
        <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
      </div>
      <p class="error-message"></p>
    </div>
  </div>
</template>


<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  emits: ['close', 'profileUpdated'],
  setup(_, { emit }) {
    const displayName = ref('');
    const bannerImage = ref(null);
    const pfp = ref(null);
    const userId = ref('');
    const bio = ref('');

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/api/user');
        const user = response.data;
        displayName.value = user.displayName || '';
        bio.value = user.description || '';
        userId.value = user._id || '';
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    const handleBannerImageChange = (event) => {
      bannerImage.value = event.target.files[0];
    };

    const handleProfilePictureChange = (event) => {
      pfp.value = event.target.files[0];
    };

    const saveChanges = async () => {
      const formData = new FormData();
      if (displayName.value) formData.append('displayName', displayName.value);
      formData.append('userId', userId.value); // Using userId to represent _id
      if (bio.value) formData.append('bio', bio.value);
      if (bannerImage.value) formData.append('bannerImage', bannerImage.value);
      if (pfp.value) formData.append('pfp', pfp.value);

      for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]); 
      }

      try {
        const response = await axios.post('/api/updateProfile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Response:', response.data);
        emit('profileUpdated');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
      emit('close');
    };

    onMounted(() => {
      fetchCurrentUser();
    });

    return {
      displayName,
      bannerImage,
      pfp,
      userId,
      bio,
      handleBannerImageChange,
      handleProfilePictureChange,
      saveChanges
    };
  }
};
</script>


  
<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.edit-profile-box {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.edit-profile-box h1 {
    font-size: 24px;
    margin-bottom: 20px;
}

.edit-field {
    margin-bottom: 15px;
}

.edit-field .form-label {
    font-size: 14px;
    color: #555;
}

.edit-field .form-control {
    border-radius: 5px;
}
</style>
