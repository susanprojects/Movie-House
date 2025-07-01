<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMovieStore } from "../../state/stores/useMovieStoreTransform";
import { useStripTags } from "../../composables/useStripTags";

import Carousel from "primevue/carousel";
import Tag from "primevue/tag";
import Button from "primevue/button";
import Message from "primevue/message";
import "primeicons/primeicons.css";

type GroupedMovies = Record<string, Movie[]>;

const movieStore = useMovieStore();
const router = useRouter();
const { stripTags } = useStripTags();

const pageTitle = ref('Popular on Movie House');
const loadingMovieText = ref('Fetching movies for you...');
const moviePoster = ref('Movie Poster');
const movieSummaryFallbackMessage = ref('No summary available');
const noMovieResultsMessage = ref('Movies not available.');

const moviesGroupedByGenre = ref<GroupedMovies>({});

const responsiveOptions = ref([
  {
    breakpoint: "1400px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
]);

const goToMovieDetails = (movie: Movie) => {
  router.push({ name: 'MovieDetails', params: { id: movie.id }  });
};

onMounted(async () => {
  await movieStore.fetchFromEndpoint("https://api.tvmaze.com/shows");
  if (movieStore.data && Object.keys(movieStore.data).length) {
    moviesGroupedByGenre.value = { ...movieStore.data };
  }
});
</script>

<template>
  <section class="md:px-8 py-6">
    <h2 class="text-3xl font-bold mb-6">{{ pageTitle }}</h2>

    <div v-if="movieStore.error" class="text-red-500 text-xl py-4">
      <Message severity="error" variant="simple">{{
        movieStore.error.message || noMovieResultsMessage
      }}</Message>
    </div>
    <div v-else-if="movieStore.isFetching" class="text-center py-10">
      <i class="pi pi-spin pi-spinner text-5xl text-white-500"></i>
      <p class="mt-2 text-white-600">{{ loadingMovieText }}</p>
    </div>
    <div v-else-if="Object.keys(moviesGroupedByGenre).length">
      <div v-for="(movieItems, genre) in moviesGroupedByGenre" :key="genre">
        <h3 class="text-2xl font-semibold text-left mb-4">{{ genre }}</h3>
        <Carousel
          :value="movieItems"
          :numVisible="3"
          :numScroll="1"
          :responsiveOptions="responsiveOptions"
        >
          <template #item="{ data: movie }">
            <div
              v-if="movie"
              class="border border-gray-200 dark:border-gray-700 rounded-lg m-2 p-4 bg-white dark:bg-gray-800 transition-shadow hover:shadow-md"
            >
              <div class="mb-4">
                <div class="relative mx-auto overflow-hidden rounded">
                  <img
                    :src="movie.image?.medium"
                    :alt="moviePoster"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div
                class="mb-2 font-medium text-2xl text-gray-900 dark:text-white"
              >
                {{ movie.name }}
              </div>
              <p class="text-lg line-clamp-3 text-left">
                {{
                  stripTags(movie.summary || '') ||
                  movieSummaryFallbackMessage
                }}
              </p>

              <div class="flex flex-col items-center mt-4">
                <div class="font-semibold text-xl">
                  <Tag
                    :value="movie.rating?.average || 'N/A'"
                    severity="warn"
                    class="me-2"
                  ></Tag>
                  <i class="pi pi-star-fill text-yellow-500"></i>
                </div>
                <div class="mt-2">
                  <Button
                    icon="pi pi-info-circle"
                    @click="goToMovieDetails(movie)"
                  />
                </div>
              </div>
            </div>
            <div v-else class="p-4 text-center">
              {{ noMovieResultsMessage }}
            </div>
          </template>
        </Carousel>
      </div>
    </div>
    <div v-else class="text-red-500 text-xl mb-4">
      <Message severity="error" variant="simple">{{
        noMovieResultsMessage
      }}</Message>
    </div>
  </section>
</template>
