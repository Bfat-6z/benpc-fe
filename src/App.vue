<template>
  <div>
    <Navbar />

    <main>
      <router-view />
    </main>

    <CartOffcanvas />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import CartOffcanvas from './components/CartOffcanvas.vue'
</script>
