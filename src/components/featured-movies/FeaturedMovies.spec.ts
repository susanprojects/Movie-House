import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FeaturedMovies from "../featured-movies/FeaturedMovies.vue";
import { createTestingPinia } from "@pinia/testing";
import { useMovieStore } from "../../state/stores/useMovieStoreTransform";
import * as stripTagsModule from "../../composables/useStripTags";

vi.mock("../../composables/useStripTags", () => ({
  useStripTags: vi.fn(),
}));

describe("FeaturedMovies.vue", () => {
  beforeEach(() => {
    (stripTagsModule.useStripTags as any).mockReturnValue({
      stripTags: vi.fn((html: string) => html.replace(/<[^>]*>/g, "")),
    });
  });

  const mountComponent = () =>
    mount(FeaturedMovies, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
        stubs: {
          Carousel: {
            template: '<div><slot name="item" :data="value[0]" /></div>',
            props: ["value"],
          },
          Tag: true,
          Button: true,
          Message: true,
        },
      },
    });

  it("displays loading state", async () => {
    const wrapper = mountComponent();
    const store = useMovieStore();

    store.$patch({ isFetching: true });

    await flushPromises();
    expect(wrapper.text()).toContain("Fetching movies for you...");
  });

  
it("does not display loading message when isFetching is false", async () => {
  const wrapper = mountComponent();
  const store = useMovieStore();

  store.$patch({
    isFetching: false,
    data: {
      Comedy: [
        {
          id: 2,
          name: "Funny Movie",
          summary: "<p>Laugh out loud</p>",
          image: { medium: "funny.jpg" },
          rating: { average: 7.2 },
          genres: ["Comedy"],
          language: "English",
          type: "Scripted",
          premiered: "2021-05-10",
          status: "Running",
        },
      ],
    },
  });

  await flushPromises();
  await wrapper.vm.$nextTick();

  expect(wrapper.text()).not.toContain("Fetching movies for you...");
  expect(wrapper.text()).toContain("Popular on Movie House");
  expect(wrapper.text()).toContain("Funny Movie");
  expect(wrapper.text()).toContain("Laugh out loud");
});


  it("displays error message", async () => {
    const wrapper = mountComponent();
    const store = useMovieStore();

    store.$patch((state) => {
      state.isFetching = false
      state.error = new Error("Failed to fetch")
    });

    await flushPromises();
    expect(wrapper.text()).toContain("Failed to fetch");
  });

  it("renders grouped movies by genre", async () => {
    const wrapper = mountComponent();
    const store = useMovieStore();

    store.$patch({
      isFetching: false,
      data: {
        Action: [
          {
            id: 1,
            name: "Test Movie",
            summary: "<p>Test summary</p>",
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
    expect(wrapper.text()).toContain("Popular on Movie House");
    expect(wrapper.text()).toContain("Test Movie");
    expect(wrapper.text()).toContain("Test summary");
  });
});
