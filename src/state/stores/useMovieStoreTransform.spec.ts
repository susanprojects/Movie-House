import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useMovieStore } from "./useMovieStoreTransform";
import { useFetch } from "@vueuse/core";

vi.mock("@vueuse/core", () => ({
  useFetch: vi.fn(),
}));

describe("useMovieStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("fetches and groups movies by genre", async () => {
    const mockMovies = [
      {
        id: 1,
        name: "Movie A",
        genres: ["Action", "Drama"],
        rating: { average: 8.5 },
      },
      {
        id: 2,
        name: "Movie B",
        genres: ["Action"],
        rating: { average: 7.0 },
      },
    ];

    (useFetch as unknown as Mock).mockReturnValue({
      json: () => ({
        data: { value: mockMovies },
        error: { value: null },
      }),
    });

    const store = useMovieStore();
    await store.fetchFromEndpoint("/shows");

    expect(store.data.Action).toHaveLength(2);
    expect(store.data.Drama).toHaveLength(1);
    expect(store.data.Action[0].name).toBe("Movie A");
    expect(store.error).toBeNull();
    expect(store.isFetching).toBe(false);
  });

  it("handles fetch error", async () => {
    const mockError = new Error("Fetch failed");

    (useFetch as unknown as Mock).mockReturnValue({
      json: () => ({
        data: { value: null },
        error: { value: mockError },
      }),
    });

    const store = useMovieStore();
    await store.fetchFromEndpoint("/shows");

    expect(store.error).toBe(mockError);
    expect(store.data).toEqual({});
    expect(store.isFetching).toBe(false);
  });
});
