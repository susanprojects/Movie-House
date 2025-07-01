import { defineStore } from "pinia";
import { ref } from "vue";
import { useFetch } from "@vueuse/core";

type GroupedMovies = Record<string, Movie[]>;

export const useMovieStore = defineStore("movie", () => {
  const data = ref<GroupedMovies>({});
  const error = ref<Error | null>(null);
  const isFetching = ref(false);
  const searchQuery = ref("");

  const fetchFromEndpoint = async (url: string) => {
    isFetching.value = true;
    const { data: fetchedData, error: fetchError } = await useFetch(url).json();

    let result = fetchedData.value;
    if (result) {
      const groupMoviesByGenres: GroupedMovies = result.reduce((accumulator: GroupedMovies, currentValue: Movie) => {
        currentValue.genres.forEach((genre) => {
          accumulator[genre]?.length > 0
            ? (accumulator[genre] = [...accumulator[genre], currentValue])
            : (accumulator[genre] = [currentValue]);
        });
        return accumulator;
      }, {});

      Object.keys(groupMoviesByGenres).forEach((genre) => {
        const genreValue = groupMoviesByGenres[genre];
        const sortMoviesByRating = genreValue.sort((a, b) => {
          const currentMovieRating = a.rating?.average ?? 0;
          const previousMovieRating = b.rating?.average ?? 0;

          return previousMovieRating - currentMovieRating;
        });

        data.value[genre] = sortMoviesByRating;
      });
    }
    error.value = fetchError.value;
    isFetching.value = false;
  };

  return {
    data,
    error,
    isFetching,
    searchQuery,
    fetchFromEndpoint,
  };
});
