const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const LinkSchema = new mongoose.Schema({
  title: String,
  url: String
});
const Link = mongoose.model('Link', LinkSchema);

app.get('/api/shortlinks', async (req, res) => {
  const links = await Link.find();
  res.json(links);
});

app.post('/api/shortlinks', async (req, res) => {
  const { title, url } = req.body;
  const link = new Link({ title, url });
  await link.save();
  res.json({ message: 'Link added!' });
});

app.delete('/api/shortlinks/:id', async (req, res) => {
  await Link.findByIdAndDelete(req.params.id);
  res.json({ message: 'Link deleted!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
