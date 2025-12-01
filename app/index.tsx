import BackgroundImage from '@/components/BackgroundImage';
import LinearGradient_ from '@/components/LinearGradient_';
import Loading from '@/components/Loading';
import { APPNAME } from '@/constants/AppName';
import { CONSTANT_COLORS } from '@/constants/Colors';
import { INITIAL_COLORS, RECORDING_COLORS, STARTING_COLORS } from '@/constants/ColorTimes';
import { Fonts } from '@/constants/Fonts';
import { PATHS } from '@/constants/Routes';
import { TRANSCRIBE_URL, WEBSOCKET_URL } from '@/constants/URLs';
import { ColorState } from '@/types/colorstate';
import { useRecordingContext } from '@/utils/RecordingContext';
import { faMagnifyingGlass, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useIsFocused } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

const Index = () => {
  const { isRecording, startRecording, stopRecording } = useRecordingContext();
  const router = useRouter();
  const isFocused = useIsFocused();
  const [colors, setColors] = useState<ColorState>(INITIAL_COLORS);
  const [transcription, setTranscription] = useState('');
  const [textRecording, setTextRecording] = useState("TAP TO SPEAK");
  const transcriptionRef = useRef("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    transcriptionRef.current = transcription;
  }, [transcription])

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    const message = JSON.parse(event.data);
    if (message.type === 'transcription') {
      if (message.data === "End of Transcript") {
        console.log("Transcript completed.");
        const finalTranscript = transcriptionRef.current.trim();
        if (finalTranscript && isFocused) {
          setIsTranscribing(false);
          router.push({
            pathname: PATHS.SEARCH,
            params: { transcription: finalTranscript }
          });
        }
        return;
      }

      if (message.data && !message.data.includes("Partial Transcript")) {
        const cleanTranscription = message.data.replace(/[.,;!?]+$/, '').trim();
        setTranscription(cleanTranscription);
        console.log('Transcription:', cleanTranscription);
      } else {
        console.log('Partial Transcript:', message.data);
      }
    }
  }, [router, setIsTranscribing, setTranscription, isFocused]);

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

  const handleRecordingPress = async () => {
    if (isRecording) {
      // Logic for stopping recording
      setIsTranscribing(true);
      setColors(INITIAL_COLORS);

      try {
        const filePath = await stopRecording();
        if (!filePath) {
          throw new Error("Recording stop failed.");
        }

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
        Alert.alert('Error', 'Failed to transcribe audio.');
      } finally {
        setIsTranscribing(false);
      }
    } else {
      // Logic for starting recording
      setTranscription('');
      startRecording();
      setTextRecording("TAP TO SPEAK");
      setColors(STARTING_COLORS);
      setTimeout(() => {
        setColors(RECORDING_COLORS);
      }, 1000);
    }
  };

  useEffect(() => {
    if (isRecording) {
      setColors(RECORDING_COLORS);
    } else {
      setColors(INITIAL_COLORS);
    }
  }, [isRecording]);

  return (
    <View style={styles.container}>
      <LinearGradient_ />
      <BackgroundImage />
      <View style={styles.container}>
        <Text style={styles.appName2}>{APPNAME.APPNAME2}</Text>
        <Text style={styles.appName}>{APPNAME.APPNAME}</Text>
        <Pressable
          onPress={handleRecordingPress}
          style={[styles.speakButton, { borderWidth: 3, borderColor: colors.border }]}
        >
          {isTranscribing ? (
            <Loading loaderStyle={styles.loader} />
          ) : (
            <FontAwesomeIcon icon={faMicrophone} size={50} style={{ color: colors.icon }} />
          )}
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={[styles.miscText, { color: colors.text }]}>
            {!isRecording ? textRecording : isRecording ? "TAP TO STOP" : null}
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