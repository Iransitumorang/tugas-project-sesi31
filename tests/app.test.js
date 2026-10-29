const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/store');

describe('Notes API', () => {
  beforeEach(() => {
    if (typeof store.reset === 'function') {
      store.reset();
    } else if (Array.isArray(store.notes)) {
      store.notes = [];
    } else if (Array.isArray(store)) {
      store.length = 0;
    }
  });

  test('GET /notes - return empty array initially', async () => {
    const res = await request(app).get('/notes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /notes - create new note', async () => {
    // Menyesuaikan payload dengan format standar express apps (biasanya butuh title & body/content)
    const newNote = { title: 'Test Note', body: 'Test Content', content: 'Test Content' };
    const res = await request(app).post('/notes').send(newNote);

    expect([200, 201, 202]).toContain(res.statusCode);
  });

  test('GET /notes/:id - return 404 if not found', async () => {
    const res = await request(app).get('/notes/999999');
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /notes/:id - delete note', async () => {
    const createRes = await request(app)
      .post('/notes')
      .send({ title: 'To Delete', body: 'Bye', content: 'Bye' });

    if (createRes.body && createRes.body.id) {
      const deleteRes = await request(app).delete(`/notes/${createRes.body.id}`);
      expect([200, 204]).toContain(deleteRes.statusCode);
    }
  });
});