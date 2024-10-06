<template>
  <div class="create">
    <Header />
    <div class="create-inner">
      <div class="guidelines container">
        <h4>Guidelines to creating a post</h4>
        <br />
        <p>
          <ul>
            <li>All fields except images <b>must</b> be filled</li>
            <li>The date input should correspond with the date of the relevant event</li>
            <li>Videos and images are both acceptable. Files with a large size must have a link to the file instead (in development)</li>
          </ul>
        </p>
      </div>
      <LoadingSpinner v-if="isLoading" />
      <div class="entry-form-wrapper">
        <div class="entry-form">
          <div class="column column1">
            <h2 class="column-title text-center">Post Details</h2>
            <h3 class="form-main-text">Title</h3>
            <div class="input-wrapper">
              <input
                  type="text"
                  placeholder="Enter title"
                  class="title-input mb-3"
                  v-model="postTitleData"
              />
            </div>
            <h3 class="form-main-text">Description</h3>
            <div class="input-wrapper">
              <div ref="quillContainer" class="description-editor"></div>
            </div>
            <h3 class="form-main-text">Date Information</h3>
            <input type="date" v-model="dateInfo" class="date-input mb-3" />
            <p style="color: #888; font-size: 0.8em; text-align: center">
              At this stage all posts will be submitted to the 'Palestine'
              category. See dev logs for further information
            </p>
          </div>
          <div class="column column2">
            <h2>Evidence</h2>
            <div
                v-for="(proof, index) in proofs"
                :key="index"
                class="proof-section"
            >
              <h3>Proof {{ index + 1 }}</h3>
              <div class="input-wrapper">
                <input
                    type="text"
                    placeholder="Title"
                    class="proof-title"
                    v-model="proof.title"
                />
              </div>
              <div class="input-wrapper">
                <input
                    type="text"
                    placeholder="Source (link preferable)"
                    class="proof-title"
                    v-model="proof.source"
                />
              </div>
              <div class="input-wrapper">
                <textarea
                    placeholder="Description"
                    class="proof-description"
                    v-model="proof.description"
                ></textarea>
              </div>
            </div>
            <p style="color: #888; font-size: 0.8em; text-align: center">
              For multiple proofs, submit the current one for a new one to be
              added.
            </p>
            <button @click="addMoreProofs" class="minimalist-button">Add</button>
            <button
                v-if="proofs.length > 1"
                @click="removeLastProof"
                class="minimalist-button"
                style="margin: 10px;"
            >
              Remove Last Proof
            </button>
          </div>
          <div class="column column3">
            <h2 class="column-title text-center">Images/Videos</h2>
            <input
                type="file"
                accept="image/*,video/*"
                @change="handleFileChange"
                multiple
            />
            <div class="images-preview">
              <div v-for="(file, index) in files" :key="index" class="image-preview">
                <img
                    v-if="isImage(file)"
                    :src="getImageURL(file)"
                    class="preview-img"
                />
                <video
                    v-if="isVideo(file)"
                    :src="getImageURL(file)"
                    controls
                    class="preview-video"
                ></video>
                <span class="delete-button" @click="removeFile(index)">x</span>
              </div>
            </div>
            <div>
              <h2 class="column-title text-center">Proof Links</h2>
              <div
                  v-for="(link, index) in videoLinks"
                  :key="index"
                  class="link-wrapper"
              >
                <input
                    type="text"
                    placeholder="Enter video link (e.g., YouTube)"
                    v-model="link.url"
                    class="link-input"
                />
                <span class="delete-button" @click="removeLink(index)">x</span>
              </div>
              <button @click="addLink" class="minimalist-button">
                Add Link
              </button>
            </div>
            <div class="form-check form-switch">
              <input
                  class="form-check-input"
                  type="checkbox"
                  id="timelineCheck"
                  v-model="addNSFWTag"
              />
              <label class="form-check-label" for="timelineCheck" style="margin: 5px;">
                NSFW and graphical content
              </label>
            </div>
            <p v-if="addNSFWTag" style="color: #888; font-size: 0.8em; text-align: center">
              This will flag your content as NSFW (Blood, Violence, Sexual Content,
              etc.)
            </p>
          </div>
        </div>
        <div class="container d-flex submit">
          <div class="dark-box">
            <label class="checkbox-container">
              <input type="checkbox" required v-model="isChecked" />
              <span class="checkmark"></span>
              <span class="checkbox-text">
                I agree to the
                <button id="TAC" @click="openTACModal">terms and conditions</button>
              </span>
            </label>
            <button class="styled-button" @click="submitPost">Submit</button>
          </div>
        </div>
      </div>
      <TermsAndConditions v-if="showTermsAndConditions" @close="closeTACModal" />
    </div>
    <Footer />
  </div>
</template>

<script>
import TermsAndConditions from '../components/termsAndConditions.vue';
import { ref, onMounted, nextTick } from 'vue';
import { useAuthValidate } from '../composables/useAuthValidate';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useRouter } from 'vue-router'
import Quill from 'quill'; // Import Quill
import 'quill/dist/quill.snow.css'; // Import Quill CSS

export default {
  components: {
    Header,
    TermsAndConditions,
    LoadingSpinner,
    Footer
  },
  setup() {
    //for the spinner
    const isLoading = ref(false);
    const apiBaseUrl = process.env.VUE_APP_API_URL;
    const showTermsAndConditions = ref(false);
    const { isAuthenticated, fetchUser } = useAuthValidate();
    const files = ref([]);
    const dateInfo = ref('');
    const addNSFWTag = ref(false);
    const isChecked = ref(false);  // Track checkbox state
    const postTitleData = ref('');
    const postDescriptionData = ref(''); // Data to store Quill content

    // For video/proof links
    const videoLinks = ref([{ url: '' }]);

    const router = useRouter();
    const proofs = ref([{ title: '', source: '', description: '' }]);

    // Quill editor refs
    const quillContainer = ref(null); // DOM element for Quill
    const quillEditor = ref(null); // Quill instance

    onMounted(async () => {
      try {
        await fetchUser();
        if (isAuthenticated.value) {
          if (quillContainer.value) {
            quillEditor.value = new Quill(quillContainer.value, {
              theme: 'snow', // Quill theme
              placeholder: 'Enter description...',
              modules: {
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'] // Clear formatting
                ]
              }
            });

            // Listen for Quill content changes
            quillEditor.value.on('text-change', () => {
              postDescriptionData.value = quillEditor.value.root.innerHTML;
            });
          } else {
            console.error('Quill container is not available.');
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error("Error fetching the user in Create.vue:", error);
        router.push('/');
      }
    });

    // File handling methods
    const handleFileChange = (event) => {
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'image/heic', 'image/bmp', 'image/tiff', 'image/svg+xml',
        'video/mp4', 'video/ogg', 'video/webm', 'video/quicktime',
        'video/x-msvideo', 'video/x-matroska'
      ];
      const maxSize = 30 * 1024 * 1024; // 30 MB

      for (let file of event.target.files) {
        if (allowedTypes.includes(file.type)) {
          if (file.size <= maxSize) {
            files.value.push(file);
          } else {
            alert(`File ${file.name} exceeds the maximum size of 30 MB.`);
          }
        } else {
          alert(`File type ${file.type} is not allowed.`);
        }
      }
    };

    const removeFile = (index) => {
      files.value.splice(index, 1);
    };

    const isImage = (file) => file.type.startsWith('image/');
    const isVideo = (file) => file.type.startsWith('video/');
    const getImageURL = (file) => URL.createObjectURL(file);

    // Proofs handling methods
    const addMoreProofs = () => {
      proofs.value.push({ title: '', source: '', description: '' });
    };

    const removeLastProof = () => {
      if (proofs.value.length > 1) {
        proofs.value.pop();
      }
    };

    // Video links handling methods
    const addLink = () => {
      videoLinks.value.push({ url: '' });
    };

    const removeLink = (index) => {
      if (videoLinks.value.length > 1) {
        videoLinks.value.splice(index, 1);
      }
    };

    // Terms and Conditions modal
    const openTACModal = () => {
      showTermsAndConditions.value = true;
    };
    const closeTACModal = () => {
      showTermsAndConditions.value = false;
    };

    // Submit post method
    const submitPost = async () => {
      if (!isChecked.value) {
        alert('You must agree to the terms and conditions before submitting.');
        return;
      }

      // Validate proof entries
      for (const proof of proofs.value) {
        if (!proof.title || !proof.source || !proof.description) {
          alert('All proof fields must be filled.');
          return;
        }
      }

      isLoading.value = true; // Show loading spinner

      const formData = new FormData();
      formData.append('title', postTitleData.value);
      formData.append('description', postDescriptionData.value); // Quill content
      formData.append('date', dateInfo.value);

      proofs.value.forEach((proof, index) => {
        formData.append(`proofs[${index}][title]`, proof.title);
        formData.append(`proofs[${index}][source]`, proof.source);
        formData.append(`proofs[${index}][description]`, proof.description);
      });

      files.value.forEach((file) => {
        formData.append('images', file);
      });

      formData.append('nsfw', addNSFWTag.value);

      videoLinks.value.forEach((link, index) => {
        formData.append(`videoLinks[${index}][url]`, link.url);
      });

      try {
        const response = await fetch(`${apiBaseUrl}/api/newPost`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          isLoading.value = false; // Hide loading spinner
          alert('Post submitted successfully!');
          window.location = '/';
        } else {
          const errorData = await response.json();
          alert(`Failed to submit post: ${errorData.message || 'Unknown error'}`);
          isLoading.value = false;
        }
      } catch (error) {
        console.error('Error submitting the post:', error);
        alert('An error occurred while submitting the post.');
        isLoading.value = false;
      }
    };

    return {
      showTermsAndConditions,
      files,
      dateInfo,
      addNSFWTag,
      postTitleData,
      postDescriptionData,
      proofs,
      handleFileChange,
      removeFile,
      isImage,
      isVideo,
      getImageURL,
      addMoreProofs,
      removeLastProof,
      openTACModal,
      closeTACModal,
      submitPost,
      isChecked,
      isLoading,
      videoLinks,
      addLink,
      removeLink,
      quillContainer // Expose quillContainer to the template
    };
  }
};
</script>

<style>
.entry-form-wrapper {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  text-align: left;
  padding: 20px;
  box-sizing: border-box;
}

.entry-form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  box-sizing: border-box;
}

.column {
  background: #f9f9f9;
  padding: 20px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.column1 {
  grid-column: 1;
}

.column2 {
  grid-column: 2;
}

.column3 {
  grid-column: 3;
}

.column h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #333;
}

.description-editor {
  min-height: 200px;
  max-height: 400px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;
}

.column input,
.column textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
  box-sizing: border-box;
}

.proof-section h3 {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 5px;
}

.form-main-text {
  font-size: 1.2em;
  color: #555;
  text-align: left;
}

.submit {
  text-align: left;
}

.dark-box {
  background-color: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 100%;
  color: white;
  margin: auto;
  text-align: center;
  box-sizing: border-box;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 25px;
  width: 25px;
  background-color: #444;
  border-radius: 5px;
  display: inline-block;
  position: relative;
  transition: background-color 0.3s ease;
}

.checkbox-container input:checked+.checkmark {
  background-color: #4caf50;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.checkbox-container input:checked+.checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.checkbox-text {
  margin-left: 10px;
  font-size: 14px;
  color: #ddd;
}

.styled-button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.styled-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.styled-button:active {
  background-color: #3e8e41;
  transform: translateY(0);
}

/* proofs submit button */
.minimalist-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.minimalist-button:hover {
  background-color: #45a049;
}

.minimalist-button:active {
  background-color: #3e8e41;
  transform: translateY(0);
}

.minimalist-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.5);
}

.images-section {
  margin-top: 20px;
}

.images-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-preview {
  position: relative;
}

.preview-img,
.preview-video {
  max-width: 100px;
  max-height: 100px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.delete-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 5px;
  width: 30px;
  text-align: center;
  cursor: pointer;
  font-size: 0.8em;
}

/* Styles for the edit icon */
.edit-icon {
  cursor: pointer;
  margin-left: 10px;
  margin-bottom: 15px;
  color: #4caf50;
  font-size: 1.2em;
}

/* Wrapper to ensure proper layout */
.input-wrapper {
  display: block;
  align-items: center;
}

/* Confirmed state styles */
.confirmed {
  outline: 2px solid #4caf50;
  background-color: #f0f0f0;
  pointer-events: none;
}

#TAC{
  border: none;
  color: white;
  background: none;
  text-decoration: underline;
}

/* General styling for the guidelines container */
.guidelines{
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  max-width: 800px;
  margin: 20px auto;
  margin-bottom: 0px;
  font-family: 'Arial', sans-serif;
  color: #333;
  text-align: left;
}

/* Title styling */
.guidelines h4 {
  font-size: 1.8rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
}

/* Paragraph styling */
.guidelines p {
  margin: 10px 0;
  line-height: 1.6;
}

/* UL List styling */
.guidelines ul {
  list-style-type: disc;
  padding-left: 20px;
  margin-top: 10px;
}

.guidelines ul li {
  margin: 10px 0;
  font-size: 1rem;
  color: #555;
}

/* Bold text inside paragraphs */
.guidelines b {
  color: #000;
  font-weight: 600;
}

/* Link inputs and buttons */
.link-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.link-input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.delete-button {
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  font-size: 0.8em;
}

/* Mobile Layout */
@media (max-width: 768px) {
  .entry-form {
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    padding: 0;
  }

  .column {
    width: 100%;
    margin-bottom: 20px;
    padding: 10px;
  }

  .column1,
  .column2,
  .column3 {
    width: 100%;
  }

  .dark-box {
    padding: 10px;
  }
  .guidelines.container {
    padding: 15px;
  }

  .guidelines h4 {
    font-size: 1.6rem;
  }

  .guidelines ul li {
    font-size: 0.9rem;
  }
}
</style>
