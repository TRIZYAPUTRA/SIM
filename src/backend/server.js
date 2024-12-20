import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcrypt';


const app = express();
const port = 5000;
 
// Middleware setup
app.use(cors());
app.use(bodyParser.json({ limit: '60mb' })); // For handling large image payloads
app.use(bodyParser.urlencoded({ limit: '60mb', extended: true }));

// URL koneksi
const DATABASE_URL = "mysql://avnadmin:AVNS_NlALO0ONDh4mfDAqt9b@mysql-c965247-achyartrizyaputra-80ce.j.aivencloud.com:3157/sim_app?ssl-mode=REQUIRED";

// Membuat koneksi database
const db = mysql.createConnection(DATABASE_URL);

const storage = multer.memoryStorage(); // Use memoryStorage to directly get the buffer in memory

const upload = multer({
  storage: storage, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept only image files
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  } 
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error koneksi:", err);
    return;
  }
  console.log("Berhasil terhubung ke database!");
});

// Endpoint login
app.post('/login', async (req, res) => {
  const { username, password } = req.body; 
  const query = 'SELECT * FROM akun WHERE username = ?';

  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    } 

    if (results.length > 0) {
      const user = results[0]; // Dapatkan user pertama
      const passwordMatch = await bcrypt.compare(password, user.password); // Bandingkan hash
      if (passwordMatch) {
        res.status(200).send({
          message: 'Login successful!',
          id: user.id,
          type: user.type
        });
      } else {
        res.status(401).send({ message: 'Username or password is incorrect!' });
      }
    } else {
      res.status(401).send({ message: 'Username or password is incorrect!' });
    }
  });
});
// Endpoint to get profile data by ID
app.get('/profile/:id',async  (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM profiles WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send('Error fetching profile data');
    if (result.length > 0) {
      const profile = result[0];
      if (profile.photo_url) {
        const photoBuffer = profile.photo_url; // If stored as BLOB
        const base64Photo = photoBuffer.toString('base64'); // Convert to base64
        profile.photo_url = `data:image/jpeg;base64,${base64Photo}`; // Adjust 'jpeg' based on the file format
      }
      res.status(200).json(profile);
    } else {
      res.status(404).send('Profile not found');
    }
  });
});

// Route to update profile
app.post('/update-profile', upload.single('photo'),async (req, res) => {
  const { id, name, nim, contact, email } = req.body;
  let photoBuffer = null;

  // If a photo file is uploaded, use its buffer data
  if (req.file) {
    photoBuffer = req.file.buffer; // req.file.buffer is the binary data of the image
  }

  // Check if photoBuffer exists and update profile accordingly
  if (photoBuffer) {
    const sql = 'UPDATE profiles SET name = ?, nim = ?, contact = ?, email = ?, photo_url = ? WHERE id = ?';
    db.query(sql, [name, nim, contact, email, photoBuffer, id], (err, result) => {
      if (err) {
        console.error('Error updating profile:', err); // Log error for debugging
        return res.status(500).send('Error updating profile');
      }
      res.status(200).json({ message: 'Profile updated successfully' });
    }); 
  } else {
    // If no photo is uploaded, just update other profile details
    const sql = 'UPDATE profiles SET name = ?, nim = ?, contact = ?, email = ? WHERE id = ?';
    db.query(sql, [name, nim, contact, email, id], (err, result) => {
      if (err) {
        console.error('Error updating profile:', err); // Log error for debugging
        return res.status(500).send('Error updating profile');
      }
      res.status(200).json({ message: 'Profile updated successfully' });
    });
  }
});

// Assuming the field name is 'photo', update 'image' to 'photo' if needed
app.post('/submit-complaint', upload.single('photo'),async (req, res) => {
  const { name, nim, contact,  fakultas, prodi, email, subject, description } = req.body;
  let imageUrl = null;

  // Check if a photo file is uploaded and set imageUrl to its buffer
  if (req.file) {
    imageUrl = req.file.buffer; // req.file.buffer holds the binary data of the image
  }

  // SQL query for inserting complaint into database
  const query = 'INSERT INTO complaints (name, nim, contact, fakultas, prodi, email, subject, description, image_url, validasi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)';
  db.query(query, [name, nim, contact,  fakultas, prodi, email, subject, description, imageUrl], (err, results) => {
    if (err) {
      console.error('Error inserting complaint:', err);
      return res.status(500).json({ message: 'Failed to submit complaint.' });
    }
    res.status(200).json({ message: 'Complaint submitted successfully!' });
  });
});

app.get('/complaints/:nim', async (req, res) => {
  const { nim } = req.params;
  const query = 'SELECT id, subject, description, TO_BASE64(image_url) AS image_url, validasi FROM complaints WHERE nim = ?';

  db.query(query, [nim], (err, results) => {
    if (err) {
      console.error('Error fetching complaints:', err);
      return res.status(500).json({ message: 'Failed to fetch complaints.' });
    }
    res.status(200).json(results);
  });
});

// Endpoint to get total complaints count
app.get('/complaints/count/:nim', async (req, res) => {
  const { nim } = req.params;
  const query = 'SELECT COUNT(*) AS total FROM complaints WHERE nim = ?';
  db.query(query, [nim], (err, result) => {
    if (err) {
      console.error('Error fetching total complaints:', err);
      return res.status(500).json({ message: 'Failed to retrieve total complaints.' });
    }
    res.json({ total: result[0].total });
  });
});

app.get('/dashboard/total', async (req, res) => {
  const query = 'SELECT COUNT(*) AS total FROM complaints';
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Failed to retrieve total complaints.' });
    res.json({ success: true, total: result[0].total });
  });
});

// Resolved complaints endpoint
app.get('/dashboard/resolved', async (req, res) => {
  const query = 'SELECT COUNT(*) AS resolved FROM complaints WHERE validasi = 1';
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Failed to retrieve resolved complaints.' });
    res.json({ success: true, resolved: result[0].resolved});
  });
});

// Endpoint to get resolved complaints count
app.get('/complaints/resolved/:nim', async (req, res) => {
  const { nim } = req.params;
  const query = 'SELECT COUNT(*) AS resolved FROM complaints WHERE nim = ? AND validasi = 1';
  db.query(query, [nim], (err, result) => {
    if (err) {
      console.error('Error fetching resolved complaints:', err);
      return res.status(500).json({ message: 'Failed to retrieve resolved complaints.' });
    }
    res.json({ resolved: result[0].resolved });
  });
});

app.get('/complaints/:nim', async (req, res) => {
  const { nim } = req.params;
  const query = 'SELECT * FROM complaints WHERE nim = ?';
  db.query(query, [nim], (err, results) => {
    if (err) {
      console.error('Error fetching complaints:', err);
      return res.status(500).json({ message: 'Failed to fetch complaints' });
    }
    res.status(200).json(results);
  });
});
// API untuk mendapatkan tanggapan berdasarkan complaint_id
app.get('/responses/:complaintId', async (req, res) => {
  const { complaintId } = req.params;
  const query = 'SELECT * FROM responses WHERE complaint_id = ?';
  db.query(query, [complaintId], (err, results) => {
    if (err) {
      console.error('Error fetching responses:', err);
      return res.status(500).json({ message: 'Failed to fetch responses' });
    }
    res.status(200).json(results);
  });
});
app.get('/complaints/', async (req, res) => {
  const query = 'SELECT * ,TO_BASE64(image_url) AS image_url FROM complaints';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching responses:', err);
      return res.status(500).json({ message: 'Failed to fetch responses' });
    }
    res.status(200).json(results);
  });
});
app.get('/akun', async (req, res) => {
  const query = `
    SELECT 
      akun.id, 
      akun.username, 
      akun.password, 
      akun.type, 
      profiles.name,
      profiles.fakultas,
      profiles.prodi, 
      profiles.contact, 
      profiles.email 
    FROM akun 
    LEFT JOIN profiles ON akun.id = profiles.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching responses:', err);
      return res.status(500).json({ message: 'Failed to fetch responses' });
    }
    res.status(200).json(results);
  });
});


// API untuk menambahkan tanggapan
// app.post('/responses', async (req, res) => {
//   const { complaint_id, message, sender } = req.body;
//   const query = 'INSERT INTO responses (complaint_id, message, sender) VALUES (?, ?, ?)';
//   db.query(query, [complaint_id, message, sender], (err, results) => {
//     if (err) {
//       console.error('Error inserting response:', err);
//       return res.status(500).json({ message: 'Failed to submit response' });
//     }
//     res.status(200).json({ message: 'Response submitted successfully!' });
//   });
// });

app.put('/complaints/:id', async (req, res) => {
  const { id } = req.params;
  const { subject, description } = req.body;
  const query = 'UPDATE complaints SET subject = ?, description = ? WHERE id = ?';
  db.query(query,[
      subject,
      description,
      id],
      (err) => { 
        if (err) {
          console.error('Error Update response:', err);
          return res.status(500).json({ message: 'Failed to submit response' });
        }
        res.status(200).json({ message: 'Response submitted successfully!' });
      });
});

app.delete('/complaints/delete/:id', async (req, res) =>{
  const { id } = req.params;
  const query = 'DELETE FROM complaints WHERE id = ?';
  db.query(query,[
      id
    ],(err) => {
          if (err) {
            console.error('Error Delete response:', err);
            return res.status(500).json({ message: 'Failed to submit response' });
          }
          res.status(200).json({ message: 'Response submitted successfully!' });
        });
        const resetAutoIncrementQuery = 'ALTER TABLE complaints AUTO_INCREMENT = 1';
        db.query(resetAutoIncrementQuery, (err, results) => {
          if (err) {
            console.error('Error executing ALTER TABLE:');
            return;
          }
          console.log('ALTER TABLE berhasil dijalankan:');
        });
});
app.put('/akun/:id', async (req, res) => { 
  const { id } = req.params;
  const { username, password, type, name, fakultas, prodi, contact, email } = req.body;

  try {
    // Ambil password lama dari database
    const getPasswordQuery = 'SELECT password FROM akun WHERE id = ?';
    db.query(getPasswordQuery, [id], async (err, results) => {
      if (err) {
        console.error('Error fetching current password:', err);
        return res.status(500).json({ message: 'Failed to fetch account data' });
      }

      // Jika tidak ada hasil, akun tidak ditemukan
      if (results.length === 0) {
        return res.status(404).json({ message: 'Account not found' });
      }

      const currentPassword = results[0].password;

      // Cek apakah password sudah di-hash atau tidak berubah
      let hashedPassword = currentPassword;
      if (password && password !== currentPassword) {
        const saltRounds = 10; // Tingkat kesulitan hashing
        hashedPassword = await bcrypt.hash(password, saltRounds);
      }

      const query = `
        UPDATE akun
        LEFT JOIN profiles ON akun.id = profiles.id
        SET
          akun.username = ?,
          akun.password = ?,
          akun.type = ?,
          profiles.nim = ?,
          profiles.name = ?,
          profiles.fakultas = ?,
          profiles.prodi = ?,
          profiles.contact = ?,
          profiles.email = ?
        WHERE akun.id = ?
      `;
 
      db.query(
        query,
        [username, hashedPassword, type, username, name, fakultas, prodi, contact, email, id],
        (err) => {
          if (err) {
            console.error('Error updating account:', err);
            return res.status(500).json({ message: 'Failed to update account' });
          }
          res.status(200).json({ message: 'Account updated successfully!' });
        }
      );
    });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ message: 'Error updating account' });
  }
});

app.post('/akun', async (req, res) => {
  const { username, password, type, name, fakultas, prodi, contact, email } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Mulai transaksi
    db.beginTransaction((err) => {
      if (err) {
        console.error('Transaction start error:', err);
        return res.status(500).json({ message: 'Error starting transaction' });
      }

      // Tambahkan data ke tabel akun
      const akunQuery = 'INSERT INTO akun (username, password, type) VALUES (?, ?, ?)';
      db.query(akunQuery, [username, hashedPassword, type], (err, akunResult) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error inserting into akun:', err);
            res.status(500).json({ message: 'Error inserting into akun' });
          });
        }

        const akunId = akunResult.insertId;

        // Tambahkan data ke tabel profiles
        const profileQuery = 'INSERT INTO profiles (id, nim, name, fakultas, prodi, contact, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(profileQuery, [akunId, username ,name, fakultas, prodi, contact, email], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error inserting into profiles:', err);
              res.status(500).json({ message: 'Error inserting into profiles' });
            });
          } 

          // Commit transaksi
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error('Transaction commit error:', err);
                res.status(500).json({ message: 'Error committing transaction' });
              });
            }

            res.status(200).json({ message: 'Account created successfully!' });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ message: 'Error creating account' });
  }
});


app.delete('/akun/delete/:id', async (req, res) =>{
  const { id } = req.params;
  const query = 'DELETE akun, profiles FROM akun LEFT JOIN profiles ON akun.id = profiles.id WHERE akun.id = ?';
  db.query(query,[
      id
    ],(err) => {
          if (err) {
            console.error('Error Delete response:', err);
            return res.status(500).json({ message: 'Failed to submit response' });
          }
          res.status(200).json({ message: 'Response submitted successfully!' });
        });
        const resetAutoIncrementQueryakun = 'ALTER TABLE akun AUTO_INCREMENT = 1';
        db.query(resetAutoIncrementQueryakun,(err, results) => {
          if (err) {
            console.error('Error executing ALTER TABLE:');
            return;
          }
          console.log('ALTER TABLE berhasil dijalankan:');
        });
        const resetAutoIncrementQuery = 'ALTER TABLE profiles AUTO_INCREMENT = 1';
        db.query(resetAutoIncrementQuery, (err, results) => {
          if (err) {
            console.error('Error executing ALTER TABLE:'); 
            return;
          }
          console.log('ALTER TABLE berhasil dijalankan:');
        });
});

app.put('/complaints/validate/:id', (req, res) => {
  const { id } = req.params;
  const { validasi } = req.body;

  console.log('Request data:', { id, validasi }); // Logging input

  const query = 'UPDATE complaints SET validasi = ? WHERE id = ?';
  db.query(query, [validasi, id], (err, results) => {
    if (err) {
      console.error('Error updating validation:', err);
      return res.status(500).json({ message: 'Failed to update validation' });
    }
    console.log('Validation updated:', results); // Logging hasil query
    res.status(200).json({ message: 'Validation updated successfully' });
  }); 
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
