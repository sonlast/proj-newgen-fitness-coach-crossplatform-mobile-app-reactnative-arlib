import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { uploadAudio } from './supabase';

export const startRecording = async () => {
  try {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      throw new Error('Permission to record audio was not granted.');
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync({
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
      android: {
        extension: '.m4a',
        outputFormat: 2,
        audioEncoder: 3,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
      ios: {
        extension: '.m4a',
        outputFormat: 'aac',
        audioQuality: 127,
        sampleRate: 44100,
        numberOfChannels: 2,  
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
      web: {
        mimeType: 'audio/webm',
        bitsPerSecond: 128000,
      },
    });
    await recording.startAsync();
    return recording;
  } catch (error) {
    console.error('Error starting recording:', error);
  }
};

export const stopRecording = async (recording: Audio.Recording): Promise<string> => {
  try {
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    if (!uri) {
      throw new Error('Recording URI is not available.');
    }

    const fileData = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileBlob = new Uint8Array(
      atob(fileData).split('').map((char) => char.charCodeAt(0))
    );

    const filePath = `recordings/${Date.now()}.m4a`;
    await uploadAudio(filePath, fileBlob);

    await FileSystem.deleteAsync(uri, {idempotent: true});

    return filePath;
  } catch (error) {
    console.error('Error stopping recording:', error);
    throw error;
  }
}