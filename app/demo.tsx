import React, { useEffect } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCameraPermissions } from "expo-camera";
import { Fonts } from '@/constants/Fonts';
import { CAMERA_FACES } from '@/constants/CameraFaces';
import { FUNCTION_TYPE } from '@/constants/FunctionType';
import DemoOrTrack from '@/components/DemoOrTrack';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';

const Demo = () => {
  const [permission, requestPermission] = useCameraPermissions({});

  useEffect(() => {
    requestPermission();
  }, []);

  const navigatePermissions = async () => {
    if (Platform.OS === 'android') {
      await startActivityAsync(
        ActivityAction.APPLICATION_DETAILS_SETTINGS,
        { data: 'package:' + 'com.i_son.lastimosa.fitness_app_ar' }
      );
    } else {
      await Linking.openSettings();
    }
  }

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={navigatePermissions}>
            <Text style={styles.fallbackText}>Grant Camera Permissions</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <DemoOrTrack functionType={FUNCTION_TYPE.DEMO} cameraFace={CAMERA_FACES.BACK}/>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: 'white',
  },
  fallbackText: {
    fontSize: 20,
    fontFamily: Fonts.mainFont,
    textAlign: 'center',
    color: 'white',
    padding: 10,
  }
});

export default Demo;