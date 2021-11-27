import { test, expect } from '@jest/globals';
import makeRouter from '../src/router.js';

test('basic', () => {
  const routes = [
    {
      path: '/courses',
      handler: () => 'courses!',
    },
    {
      path: '/courses/basics',
      handler: () => 'basics',
    },
  ];

  const router = makeRouter(routes);

  const path = '/courses';
  const handler = router.serve(path);
  expect(handler()).toEqual('courses!');

  const errorHandler = () => router.serve('/no_such_way');
  expect(errorHandler).toThrow(Error);
});
