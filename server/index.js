const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection (read from environment variable)
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/abdaa_entalek";
mongoose.connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// تعريف نموذج العميل
const clientSchema = new mongoose.Schema({
  name: String,
  phone: String,
  status: String,
  notes: String
});

const Client = mongoose.model("Client", clientSchema);

// إضافة عميل
app.post("/clients", async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).send(client);
  } catch (err) {
    console.error("Error creating client:", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

// تحديث عميل
app.put('/clients/:id', async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).send({ error: 'Client not found' });
    res.send(updated);
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// حذف عميل
app.delete('/clients/:id', async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ error: 'Client not found' });
    res.send({ message: 'تم الحذف' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// عرض كل العملاء
app.get("/clients", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const clients = await Client.find(filter);
    res.send(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// نموذج المندوب
const delegateSchema = new mongoose.Schema({
  name: String
});

const Delegate = mongoose.model("Delegate", delegateSchema);

// إضافة مندوب
app.post("/delegates", async (req, res) => {
  try {
    const delegate = new Delegate(req.body);
    await delegate.save();
    res.status(201).send(delegate);
  } catch (err) {
    console.error("Error creating delegate:", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

// عرض كل المندوبين
app.get("/delegates", async (req, res) => {
  try {
    const delegates = await Delegate.find();
    res.send(delegates);
  } catch (err) {
    console.error("Error fetching delegates:", err);
    res.status(500).send({ error: "Internal server error" });
  }
});

// حذف مندوب
app.delete("/delegates/:id", async (req, res) => {
  try {
    await Delegate.findByIdAndDelete(req.params.id);
    res.send({ message: "تم الحذف" });
  } catch (err) {
    console.error("Error deleting delegate:", err);
    res.status(500).send({ error: "Internal server error" });
  }
});
