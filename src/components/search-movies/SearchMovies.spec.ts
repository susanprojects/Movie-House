import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import SearchMovies from './SearchMovies.vue'
import { createTestingPinia } from '@pinia/testing'
import { useMovieStore } from '../../state/stores/useMovieStoreTransform'

describe('SearchMovies.vue', () => {
  const mountComponent = () =>
    mount(SearchMovies, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
        stubs: {
          MovieCard: true,
          RouterLink: true,
          Message: {
            template: "<div><slot /></div>",
          },
        },
      },
    });

  it('displays loading state when isFetching is true', async () => {
    const wrapper = mountComponent()
    const store = useMovieStore()
    store.$patch({ isFetching: true })

    await flushPromises()
    expect(wrapper.text()).toContain('Searching movie for you...')
  })

  
    it("displays error message when error is set", async () => {
    const wrapper = mountComponent();
    const store = useMovieStore();

    store.$patch((state) => {
        state.isFetching = false;
        state.error = new Error("Something went wrong");
    });

    await flushPromises();
    expect(wrapper.text()).toContain("Something went wrong");
    });

  it('displays filtered movies when search query matches', async () => {
    const wrapper = mountComponent()
    const store = useMovieStore()

    store.$patch({
      isFetching: false,
      error: null,
      data: {
        Action: [
          {
            id: 1,
            name: 'Avengers',
            summary: 'Superhero movie',
            image: { medium: 'avengers.jpg' },
            rating: { average: 9 },
            genres: ['Action'],
            language: 'English',
            type: 'Scripted',
            premiered: '2012-05-04',
            status: 'Released',
          },
        ],
      },
    })

    store.searchQuery = 'avengers'

    await flushPromises()
    expect(wrapper.findComponent({ name: 'MovieCard' }).exists()).toBe(true)
  })

  it('shows no results when search query does not match', async () => {
    const wrapper = mountComponent()
    const store = useMovieStore()

    store.$patch({
      isFetching: false,
      error: null,
      data: {
        Comedy: [
          {
            id: 2,
            name: 'Funny Movie',
            summary: 'A comedy',
            image: { medium: 'funny.jpg' },
            rating: { average: 7 },
            genres: ['Comedy'],
            language: 'English',
            type: 'Scripted',
            premiered: '2020-01-01',
            status: 'Released',
          },
        ],
      },
    })

    store.searchQuery = 'empty'

    await flushPromises()
    expect(wrapper.findComponent({ name: 'MovieCard' }).exists()).toBe(false)
  })
})
