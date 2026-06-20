### Operasional Akademik

* menurunkan waktu pencarian dokumen akademik 80-95%, dari 10-30 menit menjadi <1 menit
* menurunkan pertanyaan berulang ke staf TU 50-80%, dengan chatbot yang mengakses dokumen sekolah secara langsung
* menurunkan beban administrasi guru 20-40%, dengan pencarian SOP, kurikulum, dan arsip secara instan
* meningkatkan kecepatan onboarding guru baru 50-70%, dari beberapa hari menjadi beberapa jam

### Generate Soal

* menurunkan waktu pembuatan soal 70-90%, dari 2-4 jam menjadi 10-30 menit
* meningkatkan jumlah variasi soal 3-10x, dengan generate otomatis dari materi pembelajaran
* menurunkan biaya penyusunan bank soal 30-60%, dengan otomatisasi pembuatan soal dan pembahasan
* mempercepat pembuatan latihan harian hingga 90%, dengan generate langsung dari materi di Google Drive

### Layanan Siswa & Orang Tua

* menurunkan volume chat manual ke admin 40-80%, dengan chatbot FAQ sekolah
* meningkatkan respons informasi sekolah hingga 24/7, dari jam kerja menjadi tanpa batas waktu
* menurunkan waktu respons pertanyaan umum 90-99%, dari beberapa jam menjadi hitungan detik
* meningkatkan kepuasan siswa dan orang tua 20-50%, dengan akses informasi yang lebih cepat

### WhatsApp Bot

* menurunkan beban customer service/admin 50-80%, dengan otomatisasi jawaban melalui WhatsApp
* meningkatkan jumlah pertanyaan yang dapat dilayani per hari 5-20x, tanpa penambahan staf
* meningkatkan tingkat respons 100%, dengan balasan instan untuk pertanyaan umum
* menurunkan kehilangan calon siswa akibat respons lambat 20-40%, dengan layanan otomatis 24/7

### Knowledge Management

* meningkatkan utilisasi dokumen sekolah 3-10x, dengan pencarian berbasis AI
* mengurangi kehilangan pengetahuan institusi hingga 80%, dengan sentralisasi dokumen dan informasi
* menurunkan duplikasi pekerjaan administrasi 30-60%, dengan akses pengetahuan yang terpusat
* meningkatkan akurasi informasi internal 40-70%, dengan sumber jawaban langsung dari dokumen resmi

### Dampak Finansial

* menurunkan kebutuhan jam kerja administratif 20-50%
* menurunkan biaya operasional layanan informasi 30-60%
* mengurangi kebutuhan penambahan staf administrasi hingga 1-3 FTE
* meningkatkan kapasitas layanan siswa dan orang tua 3-10x tanpa penambahan SDM
* meningkatkan efisiensi proses akademik dan administrasi secara keseluruhan 25-60%


# Komposisi Teknologi (Cost Efficient)

### Frontend

* Next.js
* Tailwind CSS
* Shadcn UI

### Backend

* NestJS atau ExpressJS
* Cron Job untuk sinkronisasi dokumen
* REST API

### Database

* PostgreSQL

  * users
  * documents
  * knowledge_base
  * chat_history
  * generated_questions

### Storage

* Google Drive (sumber data utama)
* Tidak perlu duplicate file ke server

### Vector Database

Pilihan termurah:

* PostgreSQL + pgvector

atau

* PostgreSQL + embedding disimpan langsung

Tidak perlu:

* Pinecone
* Weaviate
* Qdrant Cloud

di awal karena biaya bulanan akan naik.

### AI Model

#### Embedding

* BGE Small
* BGE Base

Self-host:

* Docker
* CPU saja cukup

atau

* Jina Embedding API

#### LLM

* DeepSeek API

Use case:

* Chatbot
* Generate Soal
* Ringkasan Materi
* FAQ

### WhatsApp

* Baileys

atau

* WhatsApp Business API jika client enterprise

---

# Arsitektur

```text
Google Drive
      ↓
Sync Service
      ↓
Document Parser
      ↓
Chunking
      ↓
Embedding
      ↓
PostgreSQL + pgvector
      ↓
Retrieval
      ↓
DeepSeek API
      ↓
Chatbot / WA Bot / Generate Soal
```

---

# Alur Sinkronisasi Dokumen

### 1. Integrasi Google Drive

Client login Google.

```text
Google OAuth
      ↓
Drive Access
      ↓
Pilih Folder
```

Simpan:

* folder id
* refresh token

---

### 2. Sync Dokumen

Cron:

```text
setiap 1 jam
```

atau

```text
manual sync
```

Flow:

```text
Google Drive
      ↓
ambil file baru
      ↓
pdf
docx
pptx
xlsx
txt
      ↓
extract text
```

---

### 3. Chunking

Misal:

```text
1000 token
overlap 200
```

hasil:

```text
Dokumen A

chunk_1
chunk_2
chunk_3
chunk_4
```

---

### 4. Embedding

```text
chunk
      ↓
embedding model
      ↓
vector
```

simpan:

```text
document_id
chunk
vector
metadata
```

ke PostgreSQL.

---

# Alur Chatbot

### User Bertanya

```text
Bagaimana prosedur ujian semester?
```

---

### Retrieval

```text
question
      ↓
embedding
      ↓
similarity search
      ↓
top 5 chunk
```

---

### Context Building

```text
Pertanyaan user
+
5 chunk terdekat
```

---

### DeepSeek

```text
Prompt
      ↓
DeepSeek
      ↓
Jawaban
```

---

### Output

```text
Menurut SOP Akademik...
```

---

# Alur Generate Soal

### Guru

```text
Buat 20 soal pilihan ganda
Bab 1 sampai Bab 3
```

---

### Retrieval

```text
Bab 1
Bab 2
Bab 3
```

dicari dari vector search.

---

### DeepSeek

Prompt:

```text
Buat 20 soal pilihan ganda
berdasarkan materi berikut
...
```

---

### Output

```text
20 soal
kunci jawaban
pembahasan
```

---

# Alur WhatsApp Bot

```text
Orang Tua
      ↓
WhatsApp
      ↓
Webhook
      ↓
Retrieval
      ↓
DeepSeek
      ↓
Jawaban
```

---

# Komponen yang Paling Mahal

Urutan biaya:

```text
1. LLM (DeepSeek)
2. Embedding
3. Storage
4. Server
```

---

# Versi Paling Murah untuk MVP

* VPS 4 Core 8 GB
* PostgreSQL
* pgvector
* DeepSeek API
* Google Drive API
* Baileys
* Next.js
* NestJS

Biaya operasional:

* VPS: Rp150rb - Rp300rb/bulan
* DeepSeek: Rp50rb - Rp500rb/bulan (tergantung usage)
* Domain: Rp20rb/bulan

Total realistis:

* Rp200rb - Rp800rb/bulan per client

sementara paket jual bisa Rp1,5 juta - Rp5 juta/bulan sehingga margin masih sangat besar.
