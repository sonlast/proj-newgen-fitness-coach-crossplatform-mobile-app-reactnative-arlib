import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Fonts } from '@/constants/Fonts';
import { workoutImages } from '@/constants/Workout';
import { WorkoutData } from '@/types/workout';
import { useRouter } from 'expo-router';
import { router } from 'expo-router';
import { PATHS } from '@/constants/Routes'
import { FUNCTION_TYPE } from '@/constants/FunctionType';
import { CONSTANT_COLORS } from '@/constants/Colors';

type ModalRNPaperProps = {
  visible: boolean;
  onDismiss: () => void;
  selectedWorkout?: WorkoutData | null;
};

type Paths = typeof PATHS.DEMO | typeof PATHS.TRACK;

const ModalRNPaper = ({ visible, onDismiss, selectedWorkout }: ModalRNPaperProps) => {
  const workoutImage = selectedWorkout?.title
    ? workoutImages[selectedWorkout.title as keyof typeof workoutImages]
    : require('@/assets/images/icon.png')
  const ROUTER = useRouter();
  const MODAL_DISMISS_DELAY_MS = 200;

  const navigateToDemoOrTrack = (path: Paths) => {
    onDismiss();
    setTimeout(() => {
      ROUTER.push({
        pathname: path,
      })
    }, MODAL_DISMISS_DELAY_MS)
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          justifyContent: 'center',
          alignSelf: 'center',
          margin: 0,
          padding: 0,
          width: '100%',
          height: '30%',
        }}
        theme={{
          colors: {
            backdrop: 'rgba(3, 3, 3, 0.6)',
          }
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={workoutImage}
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>{selectedWorkout?.title || 'Workout'}</Text>
            <Text style={styles.modalDescription}>
              {selectedWorkout?.workoutDesc || 'No description available.'}
            </Text>
            <View style={styles.viewDemoAndTrackButton}>
              <Pressable
                onPress={() => navigateToDemoOrTrack(PATHS.DEMO)}
                style={styles.modalDemoAndTrackButton}
              >
                <Text style={styles.textDemoAndTrack}>
                  {FUNCTION_TYPE.CAPS_DEMO}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => navigateToDemoOrTrack(PATHS.TRACK)}
                style={styles.modalDemoAndTrackButton}
              >
                <Text style={styles.textDemoAndTrack}>
                  {FUNCTION_TYPE.CAPS_TRACK}
                </Text>
              </Pressable>
            </View>
            <Pressable
              style={styles.modalCloseButton}
              onPress={onDismiss}
            >
              <FontAwesomeIcon icon={faXmark} size={20} color={CONSTANT_COLORS.WHITE} />
            </Pressable>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 20,
    padding: 25,
    backgroundColor: CONSTANT_COLORS.GRAY,
    shadowColor: CONSTANT_COLORS.WHITE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: CONSTANT_COLORS.ORANGE,
    // elevation: 5,
    overflow: 'hidden',
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    color: CONSTANT_COLORS.WHITE,
    fontSize: 22,
    fontFamily: Fonts.mainFont,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDescription: {
    color: CONSTANT_COLORS.WHITE,
    fontSize: 16,
    fontFamily: Fonts.mainFont,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: CONSTANT_COLORS.GREEN,
    borderRadius: 20,
    padding: 5,
  },
  viewDemoAndTrackButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginHorizontal: 10
  },
  modalDemoAndTrackButton: {
    backgroundColor: CONSTANT_COLORS.GREEN,
    padding: 25,
    paddingHorizontal: 30,
    borderRadius: 100,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: CONSTANT_COLORS.GRAY,
  },
  textDemoAndTrack: {
    fontFamily: Fonts.mainFont,
    fontSize: 20,
    color: CONSTANT_COLORS.WHITE,
  }
})

export default ModalRNPaper;