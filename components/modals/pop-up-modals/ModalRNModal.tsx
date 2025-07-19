import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Fonts } from '@/constants/Fonts'

type ModalRNModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedWorkout?: {
    title: string;
    workoutDesc: string;
  } | null;
}

const ModalRNModal = ({ visible, onClose, selectedWorkout }: ModalRNModalProps) => {
  const image = '../../../assets/images/icon.png'

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView
          intensity={50}
          tint="systemChromeMaterialDark"
          style={StyleSheet.absoluteFill}
        />
        {/* <View style={styles.modalOverlay} /> */}
      </TouchableWithoutFeedback>

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={require(image)}
            style={styles.modalImage}
          />
          <Text style={styles.modalTitle}>{selectedWorkout?.title || 'Workout'}</Text>
          <Text style={styles.modalDescription}>
            {selectedWorkout?.workoutDesc || 'No description available.'}
          </Text>
          <Pressable
            style={styles.modalCloseButton}
            onPress={onClose}
          >
            <FontAwesomeIcon icon={faXmark} size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
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
    color: '#fff',
    fontSize: 22,
    fontFamily: Fonts.mainFont,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDescription: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.mainFont,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 5,
  },
});

export default ModalRNModal;