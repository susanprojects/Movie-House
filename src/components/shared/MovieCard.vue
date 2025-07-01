<script setup lang="ts">
import { ref } from "vue";
import Card from "primevue/card";
import Tag from "primevue/tag";
import { useStripTags } from "../../composables/useStripTags";

const props = defineProps<{
  movieCard: Movie[];
}>();

const { stripTags } = useStripTags();

const movieImageAlternateText = ref("Movie Poster");
</script>

<template>
  <div
    class="grid gap-6 w-full max-w-screen-xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
    v-if="props?.movieCard"
  >
    <Card
      class="w-full max-w-sm overflow-hidden"
      v-for="movie in props.movieCard"
      :key="movie.id"
    >
      <template #header>
        <img
          v-if="movie.image"
          :alt="movieImageAlternateText"
          :src="movie.image?.medium"
          class="w-full h-full object-cover"
        />
      </template>
      <template #title>
        <span
          class="block mt-2 mb-4 font-medium text-3xl text-gray-900 dark:text-white"
          >{{ movie.name }}</span
        >
      </template>
      <template #content>
        <p class="mt-2 text-xl">
          {{ stripTags(movie.summary) }}
        </p>
        <div class="mt-4 flex flex-wrap items-center">
          <span class="text-lg font-bold me-2">Genres:</span>
          <span
            v-for="(genreTypes, index) in movie.genres"
            :key="index"
            class="text-lg"
          >
            {{ genreTypes
            }}<span v-if="index < movie.genres.length - 1">, </span>
          </span>
        </div>
        <div class="mt-2 flex items-center">
          <span class="text-lg font-bold me-2">Language:</span>
          <span class="text-lg">{{ movie.language }}</span>
        </div>
        <div class="flex flex-wrap mt-2">
          <div class="font-semibold text-xl">
            <span class="text-lg font-bold me-2">Maturity Rating:</span>
            <Tag
              :value="movie.rating?.average || 'N/A'"
              :severity="'warn'"
            ></Tag>
          </div>
        </div>
        <div class="mt-2 flex items-center">
          <span class="text-lg font-bold me-2">Type:</span>
          <span class="text-lg">{{ movie.type }}</span>
        </div>
        <div class="mt-2 flex items-center">
          <span class="text-lg font-bold me-2">Premiered on:</span>
          <span class="text-lg">{{ movie.premiered }}</span>
        </div>
        <div class="mt-2 flex items-center">
          <span class="text-lg font-bold me-2">Status:</span>
          <span class="text-lg">{{ movie.status }}</span>
        </div>
        <div class="mt-2 flex items-center">
          <span class="text-lg font-bold me-2">Last Episode:</span>
          <span class="text-lg">{{ movie._links?.previousepisode?.name }}</span>
        </div>
      </template>
    </Card>
  </div>
</template>
