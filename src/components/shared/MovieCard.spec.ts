import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import MovieCard from './MovieCard.vue'

vi.mock('../../composables/useStripTags', () => ({
  useStripTags: () => ({
    stripTags: (html: string) => html.replace(/<[^>]*>/g, ''),
  }),
}))

describe('MovieCard.vue', () => {
  const movie = {
    id: 1,
    name: 'Test Movie',
    summary: '<p>This is a <strong>test</strong> summary.</p>',
    image: { medium: 'test.jpg' },
    rating: { average: 8.5 },
    genres: ['Action', 'Adventure'],
    language: 'English',
    type: 'Scripted',
    premiered: '2020-01-01',
    status: 'Ended',
    _links: {
      previousepisode: {
        name: 'Final Episode',
      },
    },
  }

  it('renders movie details correctly', () => {
    const wrapper = mount(MovieCard, {
      props: {
        movieCard: [movie],
      },
      global: {
        stubs: {
          Card: {
            template: `
                <div>
                    <slot name="header"></slot>
                    <slot name="title"></slot>
                    <slot name="content"></slot>
                </div>
             `,
          },
          Tag: {
            props: ["value"],
            template: "<span>{{ value }}</span>",
          },
        },
      },
    });

    expect(wrapper.text()).toContain('Test Movie')
    expect(wrapper.text()).toContain('This is a test summary.')
    expect(wrapper.text()).toContain('Genres:')
    expect(wrapper.text()).toContain('Action, Adventure')
    expect(wrapper.text()).toContain('Language:')
    expect(wrapper.text()).toContain('English')
    expect(wrapper.text()).toContain('Maturity Rating:')
    expect(wrapper.text()).toContain('8.5')
    expect(wrapper.text()).toContain('Type:')
    expect(wrapper.text()).toContain('Scripted')
    expect(wrapper.text()).toContain('Premiered on:')
    expect(wrapper.text()).toContain('2020-01-01')
    expect(wrapper.text()).toContain('Status:')
    expect(wrapper.text()).toContain('Ended')
    expect(wrapper.text()).toContain('Last Episode:')
    expect(wrapper.text()).toContain('Final Episode')
  })

  it('renders image with correct alt text', () => {
    const wrapper = mount(MovieCard, {
      props: {
        movieCard: [movie],
      },
      global: {
        stubs: {
          Card: {
            template:
              '<div><slot name="header"></slot><slot name="title"></slot><slot name="content"></slot></div>',
          },
          Tag: true,
        },
      },
    });

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Movie Poster')
    expect(img.attributes('src')).toBe('test.jpg')
  })
})
