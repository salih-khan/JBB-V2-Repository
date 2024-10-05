<template>
  <div class="container-fluid">
    <Header />

  <div class="container mt-5">
    <h1 class="text-center">Privacy Policy</h1>

    <div class="mt-4">
      <p>
        Welcome to our website. This Privacy Policy outlines how we handle your personal data when you use our platform.
      </p>

      <h2>User Accounts</h2>
      <p>
        You can create an account on our website using your Google account. By signing up, you agree to provide us with accurate information. We do not store your Google password.
      </p>

      <h2>Content Usage</h2>
      <p>
        All materials posted on this platform are allowed to be downloaded and reused, as our website focuses on journalism and historical/news content. By contributing content, you grant us permission to display and distribute your posts on our platform.
      </p>

      <h2>Data Collection</h2>
      <p>
        We collect personal information when you create an account and post content. This may include your name, email address, and any other information you provide. We will not share your data with third parties without your consent.
      </p>

      <h2>Cookies</h2>
      <p>
        Our website uses cookies to enhance your experience. You can choose to accept or decline cookies through your browser settings. However, declining cookies may prevent you from taking full advantage of the website.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about our Privacy Policy, please feel free to contact us through our website or email us at support@example.com.
      </p>

      <p class="text-center mt-4">
        Thank you for visiting our site and trusting us with your information!
      </p>
    </div>
  </div>

    <Footer />
  </div>

</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: "PrivacyPolicy",
  components:{
    Header,
    Footer
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
