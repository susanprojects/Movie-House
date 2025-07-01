import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import App from "./App.vue";

const routes = [
  { path: "/", component: { template: "<div>Home</div>" } },
  {
    path: "/movie-house/search-movies",
    component: { template: "<div>Search</div>" },
  },
];

const createTestWrapper = async (initialPath = "/") => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  });

  router.push(initialPath);
  await router.isReady();

  return mount(App, {
    global: {
      plugins: [router],
      stubs: {
        RouterLink: {
          template: "<a><slot /></a>",
        },
        RouterView: true,
      },
    },
  });
};

describe("App.vue", () => {
  it("renders logo and title correctly", async () => {
    const wrapper = await createTestWrapper();

    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("alt")).toBe("Movie House Logo");
    expect(img.attributes('src')).toMatch(/^data:image\/svg\+xml/)

    expect(wrapper.text()).toContain("Movie House");
  });

  it("shows search icon when not on search page", async () => {
    const wrapper = await createTestWrapper("/");
    const searchLink = wrapper.find(".search-icon");
    expect(searchLink.exists()).toBe(true);
    expect(searchLink.attributes("to")).toBe("/movie-house/search-movies");
  });

  it("hides search icon on search page", async () => {
    const wrapper = await createTestWrapper("/movie-house/search-movies");
    const searchLink = wrapper.find(".search-icon");
    expect(searchLink.exists()).toBe(false);
  });
});
