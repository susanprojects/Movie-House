import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',
        redirect: '/movie-house/featured-movies',
    },
    {
        path: '/movie-house',
        component: () => import('../components/MovieHouse.vue'),
        children: [
            {
                path: 'featured-movies',
                name: 'FeaturedMovies',
                component: () => import('../components/featured-movies/FeaturedMovies.vue'),
            },
            {
                path: 'search-movies',
                name: 'SearchMovies',
                component: () => import('../components/search-movies/SearchMovies.vue'),
            },
        ],
    },
    {
        path: '/movie/:id',
        name: 'MovieDetails',
        component: () => import('../components/featured-movies/movie-details/MovieDetails.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router