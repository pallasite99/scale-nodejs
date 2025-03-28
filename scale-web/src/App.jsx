import React, { useState } from 'react';
import {
  Container, Button, TextField, Typography, Box, ToggleButtonGroup, ToggleButton,
  Paper, Table, TableBody, TableRow, TableCell, TableHead
} from '@mui/material';
import { motion } from 'framer-motion';
import { encodeCompact } from './encoder';
import { decodeCompact } from './decoder';

export default function App() {
  const [mode, setMode] = useState('encode');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [steps, setSteps] = useState([]);

  const handleRun = () => {
    try {
      if (mode === 'encode') {
        const num = parseInt(input);
        const { hex, steps } = encodeCompact(num);
        setResult('0x' + hex);
        setSteps(steps);
      } else {
        const { value, steps } = decodeCompact(input);
        setResult(value.toString());
        setSteps(steps);
      }
    } catch (err) {
      setResult('Error');
      setSteps([err.message]);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          SCALE Encoder / Decoder
        </Typography>

        <Box textAlign="center" mb={2}>
          <ToggleButtonGroup
            color="primary"
            exclusive
            value={mode}
            onChange={(e, newMode) => {
              if (newMode) {
                setMode(newMode);
                setInput('');
                setResult('');
                setSteps([]);
              }
            }}
          >
            <ToggleButton value="encode">Encode</ToggleButton>
            <ToggleButton value="decode">Decode</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField
          fullWidth
          label={mode === 'encode' ? 'Enter integer' : 'Enter hex string'}
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRun}
          sx={{ mb: 3 }}
        >
          Run
        </Button>

        <Typography variant="h6">Result:</Typography>
        <Paper variant="outlined" sx={{ p: 2, fontFamily: 'monospace', mb: 2 }}>
          {result}
        </Paper>

        {steps.length > 0 && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 3 }}>Step-by-Step Breakdown:</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="5%"><strong>#</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {steps.map((s, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.4 }}
                  >
                    <TableCell>{i + 1}</TableCell>
                    <TableCell style={{ whiteSpace: 'pre-wrap' }}>{s}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Paper>
    </Container>
  );
}
