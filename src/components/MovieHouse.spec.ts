import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import MovieHouse from "./MovieHouse.vue";

const DummyComponent = {
  template: "<div>Dummy Page</div>",
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: DummyComponent,
    },
  ],
});

describe("MovieHouse.vue", () => {
  it("renders RouterView content", async () => {
    router.push("/");
    await router.isReady();

    const wrapper = mount(MovieHouse, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.html()).toContain("Dummy Page");
  });
});
