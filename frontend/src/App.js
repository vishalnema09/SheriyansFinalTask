import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Grid, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/images';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length) {
      setFile(acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
      setCompressedUrl(null);
      setError('');
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleUploadAndCompress = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      // Upload
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Compress
      const compressRes = await axios.post(`${API_URL}/compress`, {
        filename: uploadRes.data.filename,
      });
      setCompressedUrl(`http://localhost:5000${compressRes.data.compressedUrl}`);
    } catch (err) {
      setError('Upload or compression failed.');
    }
    setLoading(false);
  };

  const handleDownloadCompressed = async () => {
    if (!compressedUrl) return;
    setDownloading(true);
    try {
      const response = await axios.get(compressedUrl, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', compressedUrl.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Download failed.');
    }
    setDownloading(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        AI-Powered Intelligent Image Compression
      </Typography>
      <Box {...getRootProps()} sx={{ border: '2px dashed #888', p: 4, textAlign: 'center', mb: 2, cursor: 'pointer', bgcolor: isDragActive ? '#f0f0f0' : 'inherit' }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the image here...</Typography>
        ) : (
          <Typography>Drag & drop an image here, or click to browse (JPG/PNG, max 5MB)</Typography>
        )}
      </Box>
      {preview && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <Typography variant="subtitle1">Original</Typography>
              <img src={preview} alt="Original" style={{ maxWidth: '100%', maxHeight: 300 }} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <Typography variant="subtitle1">Compressed</Typography>
              {loading ? <CircularProgress /> : compressedUrl ? (
                <img src={compressedUrl} alt="Compressed" style={{ maxWidth: '100%', maxHeight: 300 }} />
              ) : <Typography color="text.secondary">No compressed image yet</Typography>}
            </Paper>
          </Grid>
        </Grid>
      )}
      {error && <Typography color="error" align="center">{error}</Typography>}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleUploadAndCompress} disabled={!file || loading}>
          Compress Image
        </Button>
        {compressedUrl && (
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={handleDownloadCompressed}
            disabled={downloading}
            startIcon={downloading ? <CircularProgress size={20} /> : null}
          >
            {downloading ? 'Downloading...' : 'Download Compressed'}
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default App; 