import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Grid, Typography, Box } from '@mui/material';
import axios from 'axios';

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch the list of available files from the server
  const fetchFiles = async () => {
    setLoading(true);
    try {
      // Replace with the appropriate API endpoint that lists your available files
      const response = await axios.get('http://localhost:8000/generated-files/');
      setFiles(response.data.files); // Assuming the response contains a 'files' array
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  // Download the file
  const downloadFile = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:8000/generated-files/${fileName}`, {
        responseType: 'blob', // Expect binary data
      });
      
      // Create a URL and trigger the download
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, padding: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Attendance Sheet Files
      </Typography>
      <Grid container spacing={4} justifyContent="center" marginTop={20}> 
        {loading ? (
          <Typography>Loading files...</Typography>
        ) : (
          files.map((file, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{file}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => downloadFile(file)}
                    fullWidth
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default App;
