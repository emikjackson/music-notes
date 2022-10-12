import { error } from '@sveltejs/kit';

// To do a server load, make this a page.server.js instead! https://kit.svelte.dev/docs/routing#page-page-server-js
 
export function load({ params }) {
  if (params.slug === 'hello-world') {
    return {
      title: 'Hello world!',
      content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
    };
  }
 
  throw error(404, 'Not found');
}