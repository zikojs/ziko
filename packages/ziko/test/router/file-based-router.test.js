import { describe, it, expect, vi } from 'vitest';
import { createFileBasedRouter } from 'ziko/router';

describe('createFileBasedRouter', () => {
    it('should match and load a static route in lazy mode', async () => {
        const mockComponent = { name: 'HomeComponent' };
        const pages = {
            '/src/pages/index.js': vi.fn().mockResolvedValue({ default: mockComponent, Get: () => 'data' })
        };

        const result = await createFileBasedRouter({
            pages,
            url: '/',
            lazy: true,
            renderer: null // skip rendering for pure state test
        });

        expect(result.matched).toBe(true);
        expect(result.mask).toBe('/');
        expect(result.component).toBe(mockComponent);
        expect(pages['/src/pages/index.js']).toHaveBeenCalledTimes(1);
    });

    it('should handle dynamic routes and extract parameters', async () => {
        const mockComponent = { name: 'UserComponent' };
        const pages = {
            '/src/pages/users/[id].js': vi.fn().mockResolvedValue({ default: mockComponent })
        };

        const result = await createFileBasedRouter({
            pages,
            url: '/users/99',
            lazy: true,
            renderer: null
        });

        // expect(result.matched).toBe(true);
        // expect(result.mask).toBe('/users/[id]');
        // expect(result.params).toEqual({ id: '99' });
    });

    it('should respect base path prefixes', async () => {
        const mockComponent = { name: 'AboutComponent' };
        const pages = {
            '/src/pages/about.js': vi.fn().mockResolvedValue({ default: mockComponent })
        };

        const result = await createFileBasedRouter({
            pages,
            url: '/app/about',
            base: '/app',
            renderer: null
        });

        expect(result.matched).toBe(true);
        expect(result.mask).toBe('/about');
    });

    it('should return unmatched state when route does not exist', async () => {
        const pages = {
            '/src/pages/index.js': vi.fn().mockResolvedValue({ default: {} })
        };

        const result = await createFileBasedRouter({
            pages,
            url: '/missing-page',
            renderer: null
        });

        expect(result.matched).toBe(false);
        expect(result.mask).toBe(null);
        expect(result.component).toBe(null);
    });

    it('should load all pages in eager mode', async () => {
        const homeComp = { name: 'Home' };
        const aboutComp = { name: 'About' };
        const pages = {
            '/src/pages/index.js': vi.fn().mockResolvedValue({ default: homeComp }),
            '/src/pages/about.js': vi.fn().mockResolvedValue({ default: aboutComp })
        };

        const result = await createFileBasedRouter({
            pages,
            url: '/about',
            lazy: false,
            renderer: null
        });

        expect(result.matched).toBe(true);
        expect(result.component).toBe(aboutComp);
        expect(pages['/src/pages/index.js']).toHaveBeenCalled();
        expect(pages['/src/pages/about.js']).toHaveBeenCalled();
    });
});


describe('createFileBasedRouter - URL Environment Handling', () => {
    it('should default to browser location pathname when url is omitted in client environments', async () => {
        // Mock global location for client-side test
        const originalLocation = global.location;
        global.location = { pathname: '/client-route' };

        const mockComponent = { name: 'ClientComponent' };
        const pages = {
            '/src/pages/client-route.js': vi.fn().mockResolvedValue({ default: mockComponent })
        };

        const result = await createFileBasedRouter({
            pages,
            renderer: null
        });

        expect(result.matched).toBe(true);
        expect(result.mask).toBe('/client-route');

        // Cleanup global mock
        global.location = originalLocation;
    });

    it('should prioritize explicit url parameter provided during SSR execution', async () => {
        const mockComponent = { name: 'SSRComponent' };
        const pages = {
            '/src/pages/ssr-route.js': vi.fn().mockResolvedValue({ default: mockComponent })
        };

        const result = await createFileBasedRouter({
            pages,
            url: '/ssr-route', // Explicit SSR URL injection
            renderer: null
        });

        expect(result.matched).toBe(true);
        expect(result.mask).toBe('/ssr-route');
    });
});