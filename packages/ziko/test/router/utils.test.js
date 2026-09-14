import { describe, it, expect } from 'vitest';
import { 
    routes_matcher,
    is_dynamic, 
    sort_routes, 
    routes_grouper,
    dynamic_routes_parser,
    get_root,
    normalize_path
} from 'ziko/router/internal-utils';

describe('routes_matcher', () => {
    it('should match static routes correctly', () => {
        expect(routes_matcher('/about', '/about')).toBe(true);
        expect(routes_matcher('/about', '/contact')).toBe(false);
    });

    it('should match single and multi dynamic parameters', () => {
        expect(routes_matcher('/users/[id]', '/users/42')).toBe(true);
        expect(routes_matcher('/users/[id]', '/users/42/profile')).toBe(false);
        expect(routes_matcher('/users/[userId]/posts/[postId]', '/users/1/posts/100')).toBe(true);
    });

    it('should match optional parameters with trailing +', () => {
        expect(routes_matcher('/tags/[tag]+', '/tags/javascript')).toBe(true);
        expect(routes_matcher('/tags/[tag]+', '/tags')).toBe(true);
        expect(routes_matcher('/shop/[category]/[id]+', '/shop/electronics/42')).toBe(true);
        expect(routes_matcher('/shop/[category]/[id]+', '/shop/electronics')).toBe(true);
    });

    it('should match required catch-all routes ([...slug])', () => {
        expect(routes_matcher('/files/[...path]', '/files/images/banner.png')).toBe(true);
        expect(routes_matcher('/files/[...path]', '/files/docs/2026/report.pdf')).toBe(true);
        expect(routes_matcher('/files/[...path]', '/files')).toBe(false);
    });

    it('should match optional catch-all routes ([[...slug]])', () => {
        expect(routes_matcher('/docs/[[...slug]]', '/docs/guide/getting-started')).toBe(true);
        expect(routes_matcher('/docs/[[...slug]]', '/docs')).toBe(true);
    });

    it('should handle complex combinations of routes', () => {
        expect(routes_matcher('/blog/[category]/[[...slug]]', '/blog/tech/news/update')).toBe(true);
        expect(routes_matcher('/blog/[category]/[[...slug]]', '/blog/tech')).toBe(true);
        expect(routes_matcher('/blog/[category]/[[...slug]]', '/blog')).toBe(false);
    });
});

describe('Route Utilities', () => {
    it('should correctly identify dynamic paths', () => {
        expect(is_dynamic('/about')).toBe(false);
        expect(is_dynamic('/users/[id]')).toBe(true);
        expect(is_dynamic('/files/[...slug]')).toBe(true);
        expect(is_dynamic('/docs/[[...slug]]')).toBe(true);
        expect(is_dynamic('/tags/[tag]+')).toBe(true);
    });

    it('should sort routes by priority (static -> dynamic -> catch-all -> optional catch-all)', () => {
        const routes = [
            '/docs/[[...slug]]',
            '/about',
            '/users/[id]',
            '/files/[...path]',
            '/users/profile'
        ];
        const sorted = sort_routes(routes);
        expect(sorted).toEqual([
            '/users/profile',
            '/about',
            '/users/[id]',
            '/files/[...path]',
            '/docs/[[...slug]]'
        ]);
    });

    it('should group route maps into static and dynamic sections', () => {
        const routeMap = {
            '/about': 'AboutComponent',
            '/users/[id]': 'UserComponent'
        };
        const grouped = routes_grouper(routeMap);
        expect(grouped).toEqual({
            static: { '/about': 'AboutComponent' },
            dynamic: { '/users/[id]': 'UserComponent' }
        });
    });

    it('should throw an error if an optional parameter is placed before the final segment', () => {
        const invalidMap = {
            '/users/[id]+/profile': 'InvalidComponent'
        };
        expect(() => routes_grouper(invalidMap)).toThrowError(
            /Invalid optional param position in route/
        );
    });
});


describe('dynamic_routes_parser', () => {
    it('should match static routes accurately', () => {
        expect(dynamic_routes_parser('/about', '/about')).toEqual({});
        expect(dynamic_routes_parser('/about', '/contact')).toEqual({});
    });

    it('should extract single dynamic parameters', () => {
        expect(dynamic_routes_parser('/users/[id]', '/users/42')).toEqual({ id: '42' });
        expect(dynamic_routes_parser('/users/[userId]/posts/[postId]', '/users/10/posts/500'))
            .toEqual({ userId: '10', postId: '500' });
    });

    it('should handle optional catch-all routes ([[...slug]])', () => {
        expect(dynamic_routes_parser('/docs/[[...slug]]', '/docs/guide/getting-started'))
            .toEqual({ slug: 'guide/getting-started' });
        expect(dynamic_routes_parser('/docs/[[...slug]]', '/docs'))
            .toEqual({ slug: '' });
    });

    it('should handle required catch-all routes ([...slug])', () => {
        expect(dynamic_routes_parser('/files/[...path]', '/files/images/logo.png'))
            .toEqual({ path: 'images/logo.png' });
        expect(dynamic_routes_parser('/files/[...path]', '/files'))
            .toEqual({});
    });

    it('should combine multiple dynamic and catch-all rules', () => {
        expect(dynamic_routes_parser('/shop/[category]/[[...slug]]', '/shop/electronics/phones/smartphones'))
            .toEqual({ category: 'electronics', slug: 'phones/smartphones' });
        expect(dynamic_routes_parser('/shop/[category]/[[...slug]]', '/shop/electronics'))
            .toEqual({ category: 'electronics', slug: '' });
    });

    it('should return empty object on route mismatch', () => {
        expect(dynamic_routes_parser('/users/[id]/profile', '/users/42/settings')).toEqual({});
    });
});


describe('get_root', () => {
    it('should return empty string for empty paths array', () => {
        expect(get_root([])).toBe('');
    });

    it('should find common root directory for standard file paths', () => {
        const paths = [
            '/src/routes/users/index.js',
            '/src/routes/posts/index.js',
            '/src/routes/settings/profile.js'
        ];
        expect(get_root(paths)).toBe('/src/routes/');
    });

    // it('should handle dynamic segments in paths gracefully', () => {
    //     const paths = [
    //         '/src/routes/users/[id]/index.js',
    //         '/src/routes/users/[id]/posts.js'
    //     ];
    //     expect(get_root(paths)).toBe('/src/routes/users/');
    // });

    it('should return empty or base slash if no common directory exists', () => {
        const paths = [
            '/src/index.js',
            '/app/main.js'
        ];
        expect(get_root(paths)).toBe('/');
    });

    it('should work correctly with single path input', () => {
        const paths = ['/var/www/html/index.php'];
        expect(get_root(paths)).toBe('/var/www/html/');
    });
});

// import { describe, it, expect } from 'vitest';
// import { normalize_path } from './normalize-path.js';

describe('normalize_path', () => {
    it('should normalize basic file paths under default root', () => {
        expect(normalize_path('./src/pages/about.js')).toBe('/about');
        expect(normalize_path('./src/pages/contact.tsx')).toBe('/contact');
    });

    it('should handle index files correctly', () => {
        expect(normalize_path('./src/pages/index.js')).toBe('/');
        expect(normalize_path('./src/pages/blog/index.ts')).toBe('/blog');
    });

    it('should strip route groups like (auth)', () => {
        expect(normalize_path('./src/pages/(auth)/login.jsx')).toBe('/login');
        expect(normalize_path('./src/pages/dashboard/(admin)/settings.js')).toBe('/dashboard/settings');
    });

    it('should handle flat dot notation without breaking bracketed segments', () => {
        expect(normalize_path('./src/pages/user.profile.js')).toBe('/user/profile');
        expect(normalize_path('./src/pages/posts/[...slug].js')).toBe('/posts/[...slug]');
    });

    it('should handle Windows-style backslashes', () => {
        expect(normalize_path('.\\src\\pages\\about.js')).toBe('/about');
    });

    it('should support custom roots and extensions', () => {
        expect(normalize_path('/app/views/home.vue', '/app/views', ['vue'])).toBe('/home');
    });
});