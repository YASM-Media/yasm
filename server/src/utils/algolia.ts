import algoliasearch from 'algoliasearch';

const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_KEY,
);

export const userIndex = client.initIndex('users');
export const postIndex = client.initIndex('posts');
