<template>
  <div class="modal-overlay">
    <div class="terms-card">
      <header class="card-header">
        <h1>Terms and Conditions</h1>
        <button class="close-button" @click="closeModal">×</button>
      </header>

      <section class="card-content">
        <h2>1. Introduction</h2>
        <p>Welcome to Journalists Beyond Borders. By using our services, you agree to the following terms and conditions. Please read them carefully.</p>

        <h2>2. Content Guidelines</h2>
        <p>While we allow the posting of sensitive content, including NSFW (Not Safe For Work) material, within certain boundaries, it is crucial that such content remains relevant and appropriate. The following guidelines apply:</p>
        <ul>
          <li>NSFW content should be directly relevant to the context in which it is posted.</li>
          <li>Examples of acceptable NSFW content include reporting on newsworthy incidents such as bombings, killings, provided it is done in a respectful and informative manner with appropriate evidence.</li>
          <li>Content that is irrelevant, gratuitous, or falls into categories such as pornography or explicit sexual content is strictly prohibited.</li>
        </ul>
        <p>Violation of these guidelines will result in immediate account suspension and potential removal of the offending content.</p>

        <h2>3. Age Restrictions</h2>
        <p>Our services are intended for individuals who are 18 years of age or older. You must be at least 18 years old to create, upload, or view content on our platform. This age restriction is enforced because Google accounts, which are required to use our services, are only available to users who are 18 or older.</p>

        <h2>4. Legal Compliance and Responsibility</h2>
        <p>You are solely responsible for ensuring that any content you create or upload complies with the laws and regulations of your country. Any illegal content, or content that violates applicable laws, will hold you responsible and may lead to legal consequences. We do not condone or support illegal activities, and we reserve the right to take action against users who violate these laws.</p>

        <h2>5. Consequences of Violations</h2>
        <p>Any content that violates our guidelines or legal standards will result in immediate account suspension. This includes, but is not limited to:</p>
        <ul>
          <li>Posting irrelevant or gratuitous NSFW content.</li>
          <li>Uploading pornography or other explicit sexual content.</li>
          <li>Any content that violates the laws of your country.</li>
          <li>Any other actions that breach our acceptable use policies.</li>
        </ul>
        <p>We take these rules seriously to ensure a safe and respectful environment for all users.</p>

        <h2>6. Contact Information</h2>
        <p>If you have any questions or concerns about our terms and conditions, please contact us at [Your Contact Information].</p>
      </section>
    </div>
  </div>
</template>


  
<script>
export default {

  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>
  
<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal Content */
.terms-card {
  background: white;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90vh;
  width: 600px;
  text-align: left;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow-y: auto; /* Scroll if content overflows */
  position: relative;
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.card-header h1 {
  margin: 0;
  font-size: 1.5em;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #333;
}

/* Card Content */
.card-content {
  font-size: 1em;
  line-height: 1.6;
}

h2 {
  font-size: 1.2em;
  margin-top: 20px;
  margin-bottom: 10px;
}

ul {
  list-style-type: disc;
  margin-left: 20px;
}

p {
  margin-bottom: 10px;
}
</style>

  /* Modal Container */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Ensure it is above other content */
}

/* Modal Content */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 90%; /* Responsive width */
  max-height: 80vh; /* Limit height to viewport height */
  overflow-y: auto; /* Scroll if content overflows */
}

/* Close Button */
.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 1.5em;
  background: none;
  border: none;
}

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .terms-card {
    background: white;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-header h1 {
    margin: 0;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
  }
  
  .card-content {
    font-size: 1em;
    line-height: 1.6;
  }
  
  h2 {
    font-size: 1.2em;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  
  ul {
    list-style-type: disc;
    margin-left: 20px;
  }
  
  p {
    margin-bottom