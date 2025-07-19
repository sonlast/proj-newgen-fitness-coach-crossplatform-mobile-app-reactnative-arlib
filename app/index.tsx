import React, { useEffect, useState, useCallback } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { Link, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMicrophone, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import LinearGradient_ from '@/components/LinearGradient_';
import BackgroundImage from '@/components/BackgroundImage';
import Loading from '@/components/Loading';
import { Fonts } from '@/constants/Fonts';
import { PATHS } from '@/constants/Routes';
import { INITIAL_COLORS, RECORDING_COLORS, STARTING_COLORS } from '@/constants/ColorTimes';
import { WEBSOCKET_URL, TRANSCRIBE_URL } from '@/constants/URLs';
import { APPNAME } from '@/constants/AppName';
import { uploadAudio } from '@/utils/supabase';
import { ColorState } from '@/types/colorstate';
import { CONSTANT_COLORS } from '@/constants/Colors';

const Index = () => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [colors, setColors] = useState<ColorState>(INITIAL_COLORS);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    const message = JSON.parse(event.data);
    if (message.type === 'transcription') {
      if (message.data === "End of Transcript") {
        console.log("Transcript completed.");
        return;
      }

      if (message.data && !message.data.includes("Partial Transcript")) {
        const cleanTranscription = message.data.replace(/[.,;!?]+$/, '').trim();
        setTranscription(cleanTranscription);
        setIsTranscribing(false);
        router.push({
          pathname: PATHS.SEARCH,
          params: { transcription: cleanTranscription }
        });
      } else {
        console.log('Partial Transcript:', message.data);
      }
    }
  }, [router]);

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);
    ws.onopen = () => console.log('WebSocket connection established');
    ws.onmessage = handleWebSocketMessage;
    ws.onerror = (error) => console.error('WebSocket error:', error);
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setIsTranscribing(false);
    };

    return () => ws.close();
  }, [handleWebSocketMessage]);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission to access microphone was denied');
        return;
      }

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
          outputFormat: "aac",
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
      setRecording(recording);
      setIsRecording(true);
      setColors(STARTING_COLORS);

      setTimeout(() => {
        setColors(RECORDING_COLORS);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsTranscribing(true);
      setColors(INITIAL_COLORS);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (!uri) throw new Error("Recording URI is null");

      const fileData = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileBlob = new Uint8Array(
        atob(fileData).split("").map((char) => char.charCodeAt(0))
      );

      const filePath = `recordings/${Date.now()}.m4a`;
      await uploadAudio(filePath, fileBlob);

      setRecording(null);
      setIsRecording(false);

      const response = await fetch(TRANSCRIBE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });

      if (!response.ok) throw new Error('Transcription request failed');

      const data = await response.json();
      console.log('Transcription:', data.transcription);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setIsTranscribing(false);
    }
  };

  useEffect(() => {
    Audio.requestPermissionsAsync().then(({ granted }) => {
      if (!granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient_ />
      <BackgroundImage />
      <View style={styles.container}>
        <Text style={styles.appName2}>{APPNAME.APPNAME2}</Text>
        <Text style={styles.appName}>{APPNAME.APPNAME}</Text>
        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          style={[styles.speakButton, { borderWidth: 3, borderColor: colors.border }]}
        >
          {isTranscribing ? (
            <Loading
              loaderStyle={styles.loader}
            />
          ) : (
            <FontAwesomeIcon icon={faMicrophone} size={50} style={{ color: colors.icon }} />
          )}
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={[styles.miscText, { color: colors.text }]}>
            {isRecording ? "TAP TO STOP" : "TAP TO SPEAK"}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.smallText}>OR</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.miscText}>Search Manually</Text>
        </View>
        <Link href={PATHS.SEARCH} asChild>
          <Pressable style={styles.searchButton}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size={20} style={styles.searchIcon} />
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  appName: {
    color: CONSTANT_COLORS.WHITE,
    fontSize: 60,
    fontFamily: Fonts.mainFont
  },
  appName2: {
    color: CONSTANT_COLORS.WHITE,
    fontSize: 30,
    fontFamily: Fonts.mainFont
  },
  speakButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
    margin: 20,
    borderRadius: 100,
    backgroundColor: CONSTANT_COLORS.WHITE,
    marginTop: 90,
    marginHorizontal: "auto"
  },
  searchButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    margin: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: CONSTANT_COLORS.WHITE,
    backgroundColor: CONSTANT_COLORS.BLACK,
    marginTop: 40,
    marginHorizontal: "auto"
  },
  miscText: {
    color: CONSTANT_COLORS.WHITE,
    fontSize: 18,
    fontFamily: Fonts.mainFont
  },
  smallText: {
    color: CONSTANT_COLORS.WHITE,
    fontSize: 14,
    fontFamily: Fonts.mainFont
  },
  textContainer: {
    marginTop: 40
  },
  loader: {
    width: 140,
    height: 140,
    marginTop: 40,
    marginBottom: 40,
    alignSelf: "center"
  },
  searchIcon: {
    color: "#fff"
  }
});

export default Index;