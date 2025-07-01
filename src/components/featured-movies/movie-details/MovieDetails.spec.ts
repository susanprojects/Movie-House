import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import MovieDetails from "./MovieDetails.vue";
import { createTestingPinia } from "@pinia/testing";
import { useMovieStore } from "../../../state/stores/useMovieStoreTransform";

vi.mock("vue-router", () => ({
  useRoute: () => ({
    params: { id: "1" },
  }),
}));

describe("MovieDetails.vue", () => {
  const mountComponent = () =>
    mount(MovieDetails, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
        stubs: ["MovieCard"],
      },
    });

  it("shows loading message when movie is not found", async () => {
    const wrapper = mountComponent();
    const store = useMovieStore();

    store.$patch({ data: {} });

    await flushPromises();

    expect(wrapper.text()).toContain("Try reloading the page");
  });

  it("renders MovieCard when movie is found", async () => {
    const wrapper = mountComponent();
    const store = useMovieStore();

    store.$patch({
      data: {
        Action: [
          {
            id: 1,
            name: "Test Movie",
            summary: "A test movie",
            image: { medium: "test.jpg" },
            rating: { average: 8.5 },
            genres: ["Action"],
            language: "English",
            type: "Scripted",
            premiered: "2020-01-01",
            status: "Ended",
          },
        ],
      },
    });

    await flushPromises();

    expect(wrapper.findComponent({ name: "MovieCard" }).exists()).toBe(true);
  });

  it("calls fetchFromEndpoint if store is empty", async () => {
    const fetchSpy = vi.fn();

    mount(MovieDetails, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: () => fetchSpy,
            stubActions: false,
          }),
        ],
        stubs: ["MovieCard"],
      },
    });

    const store = useMovieStore();
    store.$patch({ data: {} });

    await flushPromises();

    expect(fetchSpy).toHaveBeenCalled();
  });


it("calls fetchFromEndpoint with correct URL if store is empty", async () => {
  const fetchSpy = vi.fn();

  mount(MovieDetails, {
    global: {
      plugins: [
        createTestingPinia({
          createSpy: () => fetchSpy,
          stubActions: false,
        }),
      ],
      stubs: ["MovieCard"],
    },
  });

  const store = useMovieStore();
  store.$patch({ data: {} });

  await flushPromises();

  expect(fetchSpy).toHaveBeenCalled();
  expect(fetchSpy).toHaveBeenCalledWith("https://api.tvmaze.com/shows");
});

});
