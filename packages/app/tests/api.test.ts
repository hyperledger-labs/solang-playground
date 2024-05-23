import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const BACKEND_URL = 'http://localhost:9000';

jest.setTimeout(30000);

describe('Ensuring the server serves the built frontend', () => {
  test('Verifying a successful response upon making a request', async () => {
    await expect(axios.get(`${BACKEND_URL}/`)).resolves.toHaveProperty('status', 200);
  });
});

describe('Ensuring the server’s compile endpoint is operational', () => {
  test('Verifying a successful compile request', async () => {
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
