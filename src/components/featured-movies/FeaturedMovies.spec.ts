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
});
