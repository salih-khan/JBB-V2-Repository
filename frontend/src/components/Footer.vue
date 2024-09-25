<template>
  <footer class="bg-light text-center text-lg-start">
    <div class="container p-4">
      <div class="row">
        <div class="col-lg-6 col-md-12 mb-4 mb-md-0">
          <h5 class="text-uppercase">About jbb.foundation</h5>
          <p>
            jbb.foundation is dedicated to sharing news, insights, and historical information with a focus on global events and cultural heritage, particularly the ongoing situation in Palestine.
          </p>
        </div>

        <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
          <h5 class="text-uppercase">Quick Links</h5>
          <ul class="list-unstyled mb-0">
            <li>
              <a href="/" class="text-dark">Home</a>
            </li>
            <li>
              <a href="/profile" class="text-dark">Profile</a>
            </li>
            <li>
              <a href="/create" class="text-dark">Create</a>
            </li>
            <li>
              <a href="/category/palestine" class="text-dark">Palestine</a>
            </li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
          <h5 class="text-uppercase mb-0">More Resources</h5>
          <ul class="list-unstyled">
            <li>
              <a href="/development" class="text-dark">Dev Log</a>
            </li>
            <li>
              <a href="https://discord.com/invite/pg9rCfSb" target="_blank" class="text-dark">Official Discord</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="text-center p-3 bg-dark text-light">
      © 2024 Copyright:
      <a class="text-light" href="https://yourwebsite.com/">jbb.foundation</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
footer {
  position: relative;
  bottom: 0;
  padding-top: 5rem;
  width: 100%;
}
</style>
