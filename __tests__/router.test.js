import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { test, expect } from '@jest/globals';
import makeRouter from '../src/router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const read = (filePath) => fs.readFileSync(filePath, 'utf-8').trim();
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const getFixture = (id) => read(getFixturePath(`${id}`)); // eslint-disable-line

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

  expect(router.serve('/no_such_way')).toThrow(Error);
});
