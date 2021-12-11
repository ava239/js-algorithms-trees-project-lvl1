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

  const { handler } = router.serve('/courses');
  expect(handler()).toEqual('courses!');

  const errorHandler = () => router.serve('/no_such_way');
  expect(errorHandler).toThrow(Error);
});

test('dynamic', () => {
  const routes = [
    {
      path: '/courses/:id',
      handler: (params) => `course ${params.id}!`,
    },
    {
      path: '/courses/:course_id/exercises/:id',
      handler: (params) => `course ${params.course_id}. exercise ${params.id}`,
    },
  ];

  const router = makeRouter(routes);

  const result = router.serve('/courses/php_trees');
  expect(result.handler(result.params)).toEqual('course php_trees!');

  const result2 = router.serve('/courses/php_trees/exercises/5');
  expect(result2.handler(result2.params)).toEqual('course php_trees. exercise 5');
});

test('methods', () => {
  const routes = [
    {
      method: 'GET',
      path: '/courses/:id',
      handler: (params) => `course ${params.id}!`,
    },
    {
      method: 'POST',
      path: '/courses',
      handler: () => 'created!',
    },
  ];

  const router = makeRouter(routes);

  const request = { path: '/courses', method: 'POST' };
  const result = router.serve(request);

  expect(result.handler(result.params)).toEqual('created!');
});

test('constraints', () => {
  const routes = [
    {
      path: '/courses/:course_id/exercises/:id',
      constraints: { id: /\d+/, course_id: (courseId) => courseId.startsWith('js') },
      handler: () => 'exercise!',
    },
  ];

  const router = makeRouter(routes);

  const result = router.serve({ path: '/courses/js/exercises/1' });

  expect(result.handler(result.params)).toEqual('exercise!');

  const errorHandler = () => router.serve('/courses/noop/exercises/noop');
  expect(errorHandler).toThrow(Error);
});
