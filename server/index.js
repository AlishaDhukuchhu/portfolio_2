const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve uploads folder statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file uploads
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage });

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth Routes ---
app.post('/api/auth/setup', async (req, res) => {
  try {
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      return res.status(400).json({ error: 'Admin already exists' });
    }
    
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { email, password: hashedPassword }
    });
    
    res.json({ message: 'Admin created successfully', adminId: admin.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });
    
    if (!admin) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// --- Project Routes ---
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await prisma.project.create({
      data: req.body
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Experience Routes ---
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/experiences', async (req, res) => {
  try {
    const experience = await prisma.experience.create({
      data: req.body
    });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/experiences/:id', async (req, res) => {
  try {
    const experience = await prisma.experience.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/experiences/:id', async (req, res) => {
  try {
    await prisma.experience.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Case Studies Routes ---
app.get('/api/case-studies', async (req, res) => {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(caseStudies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/case-studies', async (req, res) => {
  try {
    const caseStudy = await prisma.caseStudy.create({
      data: req.body
    });
    res.json(caseStudy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/case-studies/:id', async (req, res) => {
  try {
    await prisma.caseStudy.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Case Study deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Case Study Block Routes ---
app.get('/api/case-studies/:caseStudyId/blocks', async (req, res) => {
  try {
    const blocks = await prisma.caseStudyBlock.findMany({
      where: { caseStudyId: req.params.caseStudyId },
      orderBy: { order: 'asc' }
    });
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/case-studies/:caseStudyId/blocks', async (req, res) => {
  try {
    // Get highest order
    const lastBlock = await prisma.caseStudyBlock.findFirst({
      where: { caseStudyId: req.params.caseStudyId },
      orderBy: { order: 'desc' }
    });
    const order = lastBlock ? lastBlock.order + 1 : 0;

    const block = await prisma.caseStudyBlock.create({
      data: {
        ...req.body,
        caseStudyId: req.params.caseStudyId,
        order
      }
    });
    res.json(block);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/blocks/reorder', async (req, res) => {
  try {
    const { blocks } = req.body; // Array of { id, order }
    const updates = blocks.map(b => 
      prisma.caseStudyBlock.update({
        where: { id: b.id },
        data: { order: b.order }
      })
    );
    await prisma.$transaction(updates);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/blocks/:id', async (req, res) => {
  try {
    const block = await prisma.caseStudyBlock.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(block);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/blocks/:id', async (req, res) => {
  try {
    await prisma.caseStudyBlock.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Block deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Navigation API
app.get('/api/navigation', async (req, res) => {
  try {
    const navItems = await prisma.navigationItem.findMany({ orderBy: { order: 'asc' } });
    res.json(navItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/navigation', async (req, res) => {
  try {
    const item = await prisma.navigationItem.create({ data: req.body });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/navigation/:id', async (req, res) => {
  try {
    await prisma.navigationItem.delete({ where: { id: req.params.id } });
    res.json({ message: 'Navigation item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Global Settings API
app.get('/api/settings/:key', async (req, res) => {
  try {
    const setting = await prisma.globalSetting.findUnique({
      where: { key: req.params.key }
    });
    if (setting) {
      res.json(JSON.parse(setting.value));
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await prisma.globalSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) }
    });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- Media Library Routes ---
app.get('/api/media', (req, res) => {
  try {
    const files = fs.readdirSync(path.join(__dirname, 'uploads'));
    const mediaUrls = files.map(file => `http://localhost:${PORT}/uploads/${file}`);
    res.json(mediaUrls);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read media directory' });
  }
});

app.post('/api/media', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`CRM Backend running on http://localhost:${PORT}`);
});
