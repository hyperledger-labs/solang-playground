import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const BACKEND_URL = 'http://localhost:9000';

jest.setTimeout(30000);

describe('Given the server provides the built frontend', () => {
  test('When a request is made', async () => {
    await expect(axios.get(`${BACKEND_URL}/`)).resolves.toHaveProperty('status', 200);
  });
});

describe('Given the server provides a working compile endpoint', () => {
  test('When a compile request is made', async () => {
    const source = fs
      .readFileSync(path.join(__dirname, '../../../crates/browser/tests/mock_document.sol'))
      .toString();

    await expect(
      axios.post(`${BACKEND_URL}/compile`, {
        source,
      })
    ).resolves.toMatchObject({ status: 200, data: { type: 'SUCCESS' } });
  });
});
