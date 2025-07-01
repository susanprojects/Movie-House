<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useMovieStore } from "../../state/stores/useMovieStoreTransform";
import MovieCard from "../shared/MovieCard.vue";
import Message from "primevue/message";

type MovieStoreData = Record<string, Movie[]>;

const movieStore = useMovieStore();

const { searchQuery, data, error, isFetching } = storeToRefs(movieStore);

const navigateBackText = ref('');
const searchPlaceholderText = ref('Search by movie title');
const loadingMovieText = ref('Searching movie for you...');
const errorMessageForNoResults = ref('No movie found');

const filteredGroupedMovies = computed<MovieStoreData>(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return {};

  const movieSet = new Set<number>();
  const uniqueResults: MovieStoreData = {};

  for (const genre in data.value) {
    const movies = data.value[genre];
    if (!Array.isArray(movies)) continue;

    const filtered = movies.filter((movie) => {
      const match = movie.name?.toLowerCase().includes(query);
      const isNewMovie = !movieSet.has(movie.id);
      if (match && isNewMovie) {
        movieSet.add(movie.id);
        return true;
      }
      return false;
    });

    if (filtered.length) {
      uniqueResults[genre] = filtered;
    }
  }
  return uniqueResults;
});
</script>

<template>
  <div class="md:px-8 py-6">
    <RouterLink
      to="/movie-house/featured-movies"
      class="icon pi pi-arrow-left justify-self-end"
      >{{ navigateBackText }}
      </RouterLink>
    <div class="p-4">
      <div class="flex mb-4">
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="searchPlaceholderText"
          aria-label="Search movie"
          class="pi pi-search px-2 search-movie"
        />
      </div>
      <div v-if="error" class="text-red-500 text-xl py-4">
        <Message severity="error" variant="simple">{{
          error.message || errorMessageForNoResults
        }}</Message>
      </div>
      <div v-else-if="isFetching" class="text-center py-10">
        <i class="pi pi-spin pi-spinner text-5xl text-white-500"></i>
        <p class="mt-2 text-white-600">{{ loadingMovieText }}</p>
      </div>

      <div v-else>
        <div v-if="Object.keys(filteredGroupedMovies)?.length">
          <div
            class="card mb-6"
            v-for="(movies, genre) in filteredGroupedMovies"
            :key="genre"
          >
            <MovieCard :movieCard="movies" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  max-width: 100%;
}
.icon {
  font-size: 1.5rem;
}
.search-movie {
  background-color: #fff;
  color: #000;
  width: 20rem;
  height: 3rem;
  border: 2px solid blue;
  border-radius: 1rem;
}
</style>
