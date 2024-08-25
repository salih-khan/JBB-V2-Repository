<template>
  <div class="create">
    <Header />
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
              :disabled="titleConfirmed"
              @keypress="handleKeyPress($event, 'title')"
              :class="{'confirmed': titleConfirmed}"
              v-model="postTitleData"
            />
            <span v-if="titleConfirmed" class="edit-icon" @click="editField('title')">✏️</span>
          </div>

          <h3 class="form-main-text">Description</h3>
          <div class="input-wrapper">
            <textarea
              placeholder="Enter description"
              class="description-input"
              :disabled="descriptionConfirmed"
              @keypress="handleKeyPress($event, 'description')"
              :class="{'confirmed': descriptionConfirmed}"
              v-model="postDescriptionData"
            ></textarea>
            <span v-if="descriptionConfirmed" class="edit-icon" @click="editField('description')">✏️</span>
          </div>

          <h3 class="form-main-text">Date Information</h3>
          <input
            type="date"
            v-model="dateInfo"
            class="date-input mb-3"
          />
        </div>

        <div class="column column2">
          <h2>Evidence</h2>

          <div v-for="(proof, index) in proofs" :key="index" class="proof-section">
            <h3>Proof {{ index + 1 }}</h3>
            <div class="input-wrapper">
              <input
                type="text"
                placeholder="Title"
                class="proof-title"
                :disabled="proof.titleConfirmed"
                @keypress="handleKeyPress($event, 'proofTitle', index)"
                :class="{'confirmed': proof.titleConfirmed}"
                v-model="proof.title"
              />
              <span v-if="proof.titleConfirmed" class="edit-icon" @click="editField('proofTitle', index)">✏️</span>
            </div>

            <div class="input-wrapper">
              <input
                type="text"
                placeholder="Source (link preferable)"
                class="proof-title"
                :disabled="proof.sourceConfirmed"
                @keypress="handleKeyPress($event, 'proofSource', index)"
                :class="{'confirmed': proof.sourceConfirmed}"
                v-model="proof.source"
              />
              <span v-if="proof.sourceConfirmed" class="edit-icon" @click="editField('proofSource', index)">✏️</span>
            </div>

            <div class="input-wrapper">
              <textarea
                placeholder="Description"
                class="proof-description"
                :disabled="proof.descriptionConfirmed"
                @keypress="handleKeyPress($event, 'proofDescription', index)"
                :class="{'confirmed': proof.descriptionConfirmed}"
                v-model="proof.description"
              ></textarea>
              <span v-if="proof.descriptionConfirmed" class="edit-icon" @click="editField('proofDescription', index)">✏️</span>
            </div>
          </div>

          <p style="color: #888; font-size: 0.8em; text-align: center">
            For multiple proofs, submit the current one for a new one to be added.
          </p>

          <button @click="addMoreProofs" class="minimalist-button">Add</button>
          <button v-if="proofs.length > 1" @click="removeLastProof" class="minimalist-button" style="margin: 10px;">Remove Last Proof</button>
        </div>

        <div class="column column3">
          <h2 class="column-title text-center">Images</h2>
          <input
            type="file"
            accept="image/*,video/*"
            @change="handleFileChange"
            multiple
          />

          <div class="images-preview">
            <div v-for="(file, index) in files" :key="index" class="image-preview">
              <img v-if="isImage(file)" :src="getImageURL(file)" class="preview-img" />
              <video v-if="isVideo(file)" :src="getImageURL(file)" controls class="preview-video"></video>
              <span class="delete-button" @click="removeFile(index)">x</span>
            </div>
          </div>

          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="timelineCheck" v-model="addNSFWTag" />
            <label class="form-check-label" for="timelineCheck" style="margin: 5px;">NSFW and graphical content</label>
          </div>
          <p v-if="addNSFWTag" style="color: #888; font-size: 0.8em; text-align: center">
            This will flag your content as NSFW (Blood, Violence, Sexual Content, etc.)
          </p>
        </div>
      </div>

      <div class="container d-flex submit">
        <div class="dark-box">
          <label class="checkbox-container">
            <input type="checkbox" required />
            <span class="checkmark"></span>
            <span class="checkbox-text">I agree to the <button id="TAC" @click="openTACModal">terms and conditions</button></span>
          </label>
          <button class="styled-button">Submit</button>
        </div>
      </div>
    </div>

    <TermsAndConditions v-if="showTermsAndConditions" @close="closeTACModal"/>
  </div>
</template>

<script>
import TermsAndConditions from '../components/termsAndConditions.vue';
import { ref, onMounted, nextTick } from 'vue';
import { useAuthValidate } from '../composables/useAuthValidate';
import Header from '@/components/Header.vue';

export default {
  components: {
    Header,
    TermsAndConditions
  },
  setup() {
    const showTermsAndConditions = ref(false);

    const { isAuthenticated, fetchUser } = useAuthValidate();
    const files = ref([]);
    const dateInfo = ref('');
    const addNSFWTag = ref(false);

    const titleConfirmed = ref(false);
    const descriptionConfirmed = ref(false);

    const postTitleData = ref('');
    const postDescriptionData = ref('');

    const proofs = ref([
      {
        title: '',
        source: '',
        description: '',
        titleConfirmed: false,
        sourceConfirmed: false,
        descriptionConfirmed: false
      }
    ]);

    const handleFileChange = (event) => {
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'image/heic', 'image/bmp', 'image/tiff', 'image/svg+xml',
        'video/mp4', 'video/ogg', 'video/webm', 'video/quicktime',
        'video/x-msvideo', 'video/x-matroska'
      ];
      for (let file of event.target.files) {
        if (allowedTypes.includes(file.type)) {
          files.value.push(file);
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

    const handleKeyPress = (event, field, index) => {
      if (field === 'title') {
        if (event.key === 'Enter') {
          nextTick(() => {
            if (postTitleData.value.trim() !== '') {
              titleConfirmed.value = true;
            } else {
              alert('Title cannot be empty.');
            }
          });
        }
      } else if (field === 'description') {
        if (event.key === 'Enter') {
          nextTick(() => {
            if (postDescriptionData.value.trim() !== '') {
              descriptionConfirmed.value = true;
            } else {
              alert('Description cannot be empty.');
            }
          });
        }
      } else {
        if (!proofs.value[index]) {
          proofs.value[index] = {
            title: '',
            source: '',
            description: '',
            titleConfirmed: false,
            sourceConfirmed: false,
            descriptionConfirmed: false
          };
        }

        if (event.key === 'Enter') {
          nextTick(() => {
            const proof = proofs.value[index];
            if (!proof) {
              console.error(`Proof object at index ${index} does not exist.`);
              return;
            }

            if (field === 'proofTitle') {
              if (proof.title.trim() !== '') {
                proof.titleConfirmed = true;
              } else {
                alert('Title cannot be empty.');
              }
            } else if (field === 'proofSource') {
              if (proof.source.trim() !== '') {
                proof.sourceConfirmed = true;
              } else {
                alert('Source cannot be empty.');
              }
            } else if (field === 'proofDescription') {
              if (proof.description.trim() !== '') {
                proof.descriptionConfirmed = true;
              } else {
                alert('Description cannot be empty.');
              }
            }
          });
        }
      }
    };

    const addMoreProofs = () => {
      proofs.value.push({
        title: '',
        source: '',
        description: '',
        titleConfirmed: false,
        sourceConfirmed: false,
        descriptionConfirmed: false
      });
    };

    const removeLastProof = () => {
      if (proofs.value.length > 1) {
        proofs.value.pop();
      }
    };

    const editField = (field, index) => {
      if (field === 'title') {
        titleConfirmed.value = false;
      } else if (field === 'description') {
        descriptionConfirmed.value = false;
      } else if (field === 'proofTitle' || field === 'proofSource' || field === 'proofDescription') {
        if (proofs.value[index]) {
          const proof = proofs.value[index];
          if (field === 'proofTitle') {
            proof.titleConfirmed = false;
          } else if (field === 'proofSource') {
            proof.sourceConfirmed = false;
          } else if (field === 'proofDescription') {
            proof.descriptionConfirmed = false;
          }
        }
      }
    };

    const openTACModal = () => {
      showTermsAndConditions.value = true;
      console.log("Being lcikced")

    };
    const closeTACModal = () => {
      showTermsAndConditions.value = false;
    };

    return {
      showTermsAndConditions,
      files,
      dateInfo,
      addNSFWTag,
      titleConfirmed,
      descriptionConfirmed,
      postTitleData,
      postDescriptionData,
      proofs,
      handleFileChange,
      removeFile,
      isImage,
      isVideo,
      getImageURL,
      handleKeyPress,
      addMoreProofs,
      removeLastProof,
      editField,
      openTACModal,
      closeTACModal
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
    /* Align text to the left */
}

.dark-box {
    background-color: #333;
    /* Dark background */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    /* Add shadow for depth */
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
    /* Green background */
    border: none;
    /* Remove borders */
    color: white;
    /* White text */
    padding: 15px 32px;
    /* Some padding */
    text-align: center;
    /* Centered text */
    text-decoration: none;
    /* Remove underline */
    display: inline-block;
    /* Get it to display like a button */
    font-size: 16px;
    /* Increase font size */
    margin: 4px 2px;
    /* Some margin */
    cursor: pointer;
    /* Pointer/hand icon on hover */
    border-radius: 12px;
    /* Rounded corners */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    /* Add shadow for depth */
    transition: background-color 0.3s ease, transform 0.3s ease;
    /* Smooth transition for hover effects */
}

.styled-button:hover {
    background-color: #45a049;
    /* Darker green on hover */
    transform: translateY(-2px);
    /* Slight lift on hover */
}

.styled-button:active {
    background-color: #3e8e41;
    /* Even darker green on click */
    transform: translateY(0);
    /* Reset lift on click */
}

/* proofs submit button */
.minimalist-button {
    background-color: #4caf50;
    /* Green background */
    color: white;
    /* White text */
    border: none;
    /* Remove borders */
    padding: 12px 24px;
    /* Some padding */
    font-size: 16px;
    /* Increase font size */
    cursor: pointer;
    /* Pointer/hand icon on hover */
    border-radius: 5px;
    /* Rounded corners */
    transition: background-color 0.3s ease, transform 0.3s ease;
    /* Smooth transition for hover effects */
}

.minimalist-button:hover {
    background-color: #45a049;
    /* Darker green on hover */
}

.minimalist-button:active {
    background-color: #3e8e41;
    /* Even darker green on click */
    transform: translateY(0);
    /* Reset lift on click */
}

.minimalist-button:focus {
    outline: none;
    /* Remove default focus outline */
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.5);
    /* Add custom focus outline */
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
    /* Green color for the pencil icon */
    font-size: 1.2em;
}

/* Wrapper to ensure proper layout */
.input-wrapper {
    display: flex;
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
}
</style>
