import { useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import { uploadAudio } from '@/utils/supabase'; // Adjust the import path as needed

export const useRecording = () => {
  const [isReady, setIsReady] = useState(false);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    (async () => {
      try {
        const { granted } = await AudioModule.requestRecordingPermissionsAsync();
        if (!isMounted.current) return;
        
        if (!granted) {
          Alert.alert('Permission to access microphone was denied');
          return;
        }

        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });

        setIsReady(true);
      } catch (error) {
        console.error('Error during audio setup:', error);
      }
    })();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const startRecording = async () => {
    if (!isReady) {
      console.warn('Audio recorder is not ready yet.');
      return;
    }
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async (): Promise<string | undefined> => {
    try {
      if (recorderState.isRecording) {
        await audioRecorder.stop();

        const uri = audioRecorder.uri;
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
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  };

  return {
    isReady,
    isRecording: recorderState.isRecording,
    startRecording,
    stopRecording,
    uri: audioRecorder.uri,
  };
};