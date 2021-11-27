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

test('empty', () => {
  makeRouter();
  expect(1).toEqual(1);
});
