import express from 'express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
// import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
// import FormData from 'form-data';
import dotenv from 'dotenv';
// import { Readable } from 'stream'; // Import Readable from 'stream'

import { RealtimeClient } from '@speechmatics/real-time-client';
import fs from 'fs';
import path from 'path';
import { WebSocket, WebSocketServer } from 'ws';

dotenv.config();

const app = express();
const server = createServer(app);
const port = 3000;

app.use(bodyParser.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  process.env.EXPO_PUBLIC_SUPABASE_KEY || ''
);

const SPEECHMATICS_API_KEY = process.env.EXPO_PUBLIC_SPEECHMATICS_API_KEY;
// const SPEECHMATICS_URL = 'https://asr.api.speechmatics.com/v2/jobs';
const SPEECHMATICS_RT_URL = "https://mp.speechmatics.com/v1/api_keys?type=rt";

if (!SPEECHMATICS_API_KEY) {
  throw new Error('Speechmatics API key is missing');
}

const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', (ws: any) => {
  console.log('New client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('Client disconnected'); 
    clients.delete(ws); 
  });
});

async function fetchJWT(): Promise<string> {
  const apiKey = SPEECHMATICS_API_KEY;
  const uRL = SPEECHMATICS_RT_URL;

  const resp = await fetch(uRL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      ttl: 3600,
    }),
  });

  if (!resp.ok) {
    throw new Error('Bad response from API');
  }

  return (await resp.json()).key_value;
}

const broadcastTranscription = (message: string) => {
  clients.forEach((client: any) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'transcription', data: message}));
    }
  });
};

async function transcribeFileRealTime(filePath: string) {
  const client = new RealtimeClient();
  let finalText = '';

  client.addEventListener('receiveMessage', ({ data }) => {
    if (data.message === 'AddPartialTranscript') {
      const partialText = data.results
        .map((r) => r.alternatives?.[0].content)
        .join(' ');
      console.log(`Partial Transcript: ${partialText}`);
      broadcastTranscription(partialText);
    } else if (data.message === 'AddTranscript') {
      const text = data.results.map((r) => r.alternatives?.[0].content).join(' ');
      finalText += text;
      console.log(`Final Transcript: ${finalText}`);
      broadcastTranscription(finalText);  
    } else if (data.message === 'EndOfTranscript') {
      console.log('End of Transcript');
      broadcastTranscription('End of Transcript');
    }
  });

  const jwt = await fetchJWT();
  const fileStream = fs.createReadStream(filePath, {
    highWaterMark: 4096, // avoid sending faster than real-time
  });

  await client.start(jwt, {
    transcription_config: {
      language: 'en',
      enable_partials: true,
    },
  });

  fileStream.on('data', (sample: any) => {
    client.sendAudio(sample);
  });

  fileStream.on('end', () => {
    client.stopRecognition();
  });
}

app.post('/transcribe', async (req: any, res: any) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    console.log('Downloading file from Supabase Storage:', filePath);

    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('ar-fitcoach')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      return res.status(500).json({ error: 'Failed to download audio file' });
    }

    console.log('File downloaded successfully');

    const assetsDir = path.join(__dirname, 'assets/temp_audio');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    // Convert the ArrayBuffer to a Buffer
    const audioBuffer = Buffer.from(await fileData.arrayBuffer());

    const localFilePath = path.join(assetsDir, 'temp_audio.m4a');
    await fs.promises.writeFile(localFilePath, audioBuffer);

    await transcribeFileRealTime(localFilePath);

    res.json({ transcription: 'Real-time transcription in progress' });
  } catch (error) {
    console.error('Error in transcription:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});