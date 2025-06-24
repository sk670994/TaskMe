// server/server.js
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');
const cors = require('@fastify/cors');

const FILES_DIR = path.join(__dirname, 'files');

// Enable CORS for frontend communication
fastify.register(cors, {
  origin: "*"
});

// List all files
fastify.get('/api/files', async (request, reply) => {
  try {
    const files = fs.readdirSync(FILES_DIR);
    return files;
  } catch (err) {
    reply.code(500).send({ error: 'Failed to read files' });
  }
});

// Get file content
fastify.get('/api/files/:filename', async (request, reply) => {
  const { filename } = request.params;
  const filePath = path.join(FILES_DIR, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return { filename, content };
  } catch (err) {
    reply.code(404).send({ error: 'File not found' });
  }
});

// Create a new file
fastify.post('/api/files', async (request, reply) => {
  const { title, content } = request.body;
  const fileName = title.replace(/\s+/g, '') + '.txt';
  const filePath = path.join(FILES_DIR, fileName);
  try {
    fs.writeFileSync(filePath, content);
    reply.code(201).send({ message: 'File created successfully' });
  } catch (err) {
    reply.code(500).send({ error: 'Failed to create file' });
  }
});

// Update a file
fastify.put('/api/files/:filename', async (request, reply) => {
  const { filename } = request.params;
  const { newTitle, content } = request.body;
  const oldPath = path.join(FILES_DIR, filename);
  const newPath = path.join(FILES_DIR, newTitle.replace(/\s+/g, '') + '.txt');
  try {
    if (oldPath !== newPath) fs.renameSync(oldPath, newPath);
    fs.writeFileSync(newPath, content);
    reply.send({ message: 'File updated successfully' });
  } catch (err) {
    reply.status(500).send({ error: "Edit failed" });
  }
});

// Delete a file
fastify.delete('/api/files/:filename', async (request, reply) => {
  const { filename } = request.params;
  const filePath = path.join(FILES_DIR, filename);
  try {
    fs.unlinkSync(filePath);
    reply.send({ message: 'File deleted successfully' });
  } catch (err) {
    reply.status(500).send({ error: 'Failed to delete file' });
  }
});

// Basic health check
fastify.get('/', async () => {
  return { message: 'Fastify API is running!' };
});

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server is running on ${address}`);
});
