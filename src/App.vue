<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import movieHouseLogo from '../src/assets/movieHouseLogo.svg'

const alternativeLogoText = ref('Movie House Logo')
const title = ref('Movie House')

const route = useRoute()
</script>

<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
    <div class="flex items-center justify-between px-4 py-3 md:px-8">
      <div class="flex items-center space-x-4">
        <img width="100" height="100" :alt="alternativeLogoText" :src="movieHouseLogo" class="h-12 w-auto">
        <h1 class="movie-house-title md:text-xl font-sans font-semibold">
          <RouterLink to="/" class="!text-gray-800">{{ title }}</RouterLink>
        </h1>
      </div>
      <RouterLink 
        v-if="route.path !== '/movie-house/search-movies'"
        to="/movie-house/search-movies" class="search-icon pi pi-search">
      </RouterLink>
    </div>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
  .movie-house-title {
    font-size: 2.5rem;
  }
  .search-icon {
    font-size: 1.5rem;
  }
</style>
