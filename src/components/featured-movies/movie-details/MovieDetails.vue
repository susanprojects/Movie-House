<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard from '../../shared/MovieCard.vue'
import { useMovieStore } from '../../../state/stores/useMovieStoreTransform'

const loadingMovieText = ref('Try reloading the page')
const route = useRoute()
const movieId = route.params.id

const movieStore = useMovieStore()

const movie = computed(() => {
  if (!movieStore.data || typeof movieStore.data !== 'object') return null
  const allMovies = Object.values(movieStore.data).flat()
  return allMovies.find(movie => movie.id === Number(movieId))
})

onMounted(async () => {
  if (!Object.keys(movieStore.data || {}).length) {
    await movieStore.fetchFromEndpoint('https://api.tvmaze.com/shows')
  }
})
</script>

<template>
    <div class="card">
        <MovieCard v-if="movie" :movieCard="[movie]"/>
        <p v-else>{{ loadingMovieText }}</p>
    </div>
</template>

<style scoped>
.card {
  max-width: 100%;
}
</style>