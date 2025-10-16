import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Fonts } from '@/constants/Fonts';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { useRecordingContext } from '@/utils/RecordingContext';
import Loading from '@/components/Loading';

type ModalBottomSheetProps = {
  onTranscription: (text: string) => void;
  onClose?: () => void;
};

const ModalBottomSheet = forwardRef<BottomSheetModal, ModalBottomSheetProps>(({ onTranscription, onClose }, ref) => {
  const { isRecording, startRecording, stopRecording } = useRecordingContext();

  const snapPoints = useMemo(() => ['25%'], []); // Changed from 25% to 50% for better visibility
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pulseAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        onPress={() => {
          // Make sure recording is stopped when backdrop is pressed
          if (isRecording) {
            stopAndCleanup(false);
          }
        }}
      />
    ),
    [isRecording]
  );

  const pulse = useCallback(() => {
    if (pulseAnimation.current) {
      pulseAnimation.current.stop();
    }

    pulseAnimation.current = Animated.loop(
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        })
      ])
    );
    pulseAnimation.current.start();
  }, [scaleAnim]);

  const stopAndCleanup = async (shouldTranscribe: boolean = true) => {
    try {
      setIsTranscribing(shouldTranscribe);
      if (isRecording) {
        if (shouldTranscribe) {
          const filePath = await stopRecording();

          const response = await fetch('https://ar-fitcoach.onrender.com/transcribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filePath }),
          });

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

          const data = await response.json();
          if (!data.transcription) {
            throw new Error('No transcription found');
          }

          const cleanTranscription = data.transcription
            .replace(/[.,;!?]+$/, '')
            .trim();

          onTranscription(cleanTranscription);
        } else {
          await stopRecording();
        }
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      onTranscription('');
    } finally {
      setIsTranscribing(false);
      setIsMounted(false);
      onClose?.();
    }
  };

  const startRecordingOnMount = async () => {
    try {
      setIsMounted(true);
      await startRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsMounted(false);
      onClose?.();
    }
  };

  useEffect(() => {
    if (isMounted) {
      pulse();
    } else {
      if (pulseAnimation.current) {
        pulseAnimation.current.stop();
      }
      scaleAnim.setValue(1);
    }

    return () => {
      if (pulseAnimation.current) {
        pulseAnimation.current.stop();
      }
    };
  }, [isMounted, pulse, scaleAnim]);

  return (
    <BottomSheetModal
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      backgroundStyle={{ backgroundColor: '#333' }}
      handleIndicatorStyle={{ backgroundColor: 'transparent' }} // Made the indicator more visible
      backdropComponent={renderBackdrop}
      onDismiss={() => {
        if (isRecording) {
          stopAndCleanup(false);
        }
      }}
      onChange={(index) => {
        if (index === 1) { // Changed from 0 to 1 to match the index prop
          startRecordingOnMount();
        } else if (index === -1 && isRecording) {
          stopAndCleanup(false);
        }
      }}
    >
      <BottomSheetView
        style={{
          backgroundColor: '#333',
          height: 270,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={styles.titleText}>
          Speak To Search
        </Text>
        <View style={{ padding: 40 }}>
          <Pressable onPress={() => isRecording && stopAndCleanup(true)}>
            <Animated.View
              style={[
                styles.micButton,
                {
                  transform: [{ scale: scaleAnim }],
                  borderColor: isTranscribing ? '#000' : isRecording ? '#ff0000': '#666',
                }
              ]}
            >
              {isTranscribing ? (
                <View style={styles.loaderContainer}>
                  <Loading loaderStyle={{ width: 120, height: 120 }} />
                </View>
              ) : (
                <FontAwesomeIcon icon={faMicrophone} size={50} color={isRecording ? '#f00' : '#000'} />
              )}
            </Animated.View>
          </Pressable>
          <Text style={styles.statusText}>
            {isTranscribing ? 'Processing...' : isRecording ? 'Tap to stop' : 'Tap to speak'}
          </Text>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  // !! STYLES FOR REACT NATIVE BOTTOM 
  titleText: {
    fontFamily: Fonts.mainFont,
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#fff',
  },
  micButton: {
    backgroundColor: '#fff',
    borderRadius: 60,
    // padding: 20,
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  statusText: {
    color: '#fff',
    fontFamily: Fonts.mainFont,
    textAlign: 'center',
    marginTop: 10,
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ModalBottomSheet;