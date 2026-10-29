// Polyfill TextEncoder & TextDecoder untuk Jest
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const request = require('supertest');
const app = require('../src/app');
const store = require('../src/store');

describe('Notes API', () => {
  beforeEach(() => {
    store.reset();
  });

  test('GET /notes - return empty array initially', async () => {
    const res = await request(app).get('/notes');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /notes - create new note', async () => {
    const newNote = { title: 'Test Note', content: 'Test Content' };
    const res = await request(app).post('/notes').send(newNote);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newNote.title);
    expect(res.body.content).toBe(newNote.content);
  });

  test('GET /notes/:id - return note by id', async () => {
    const created = store.addNote({ title: 'Sample', content: 'Content' });
    const res = await request(app).get(`/notes/${created.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Sample');
  });

  test('GET /notes/:id - return 404 if not found', async () => {
    const res = await request(app).get('/notes/9999');
    expect(res.statusCode).toBe(404);
  });

  test('DELETE /notes/:id - delete note', async () => {
    const created = store.addNote({ title: 'To Delete', content: 'Bye' });
    const res = await request(app).delete(`/notes/${created.id}`);

    expect(res.statusCode).toBe(204);
    expect(store.getAll()).toHaveLength(0);
  });
});