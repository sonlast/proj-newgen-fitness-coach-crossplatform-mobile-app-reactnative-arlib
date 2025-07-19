import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { Image, Keyboard, Pressable, StyleSheet, SafeAreaView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Fonts } from '@/constants/Fonts';
import { CONSTANT_COLORS } from '@/constants/Colors';
import { faClockRotateLeft, faMicrophone, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Input } from '@rneui/themed';
import { useLocalSearchParams } from 'expo-router';
import LinearGradient_ from '@/components/LinearGradient_';
import BackgroundImage from '@/components/BackgroundImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
//! MODAL FROM REACT NATIVE BOTTOM SHEET
import ModalBottomSheet from '@/components/modals/bottom-modals/ModalBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
//! MODAL FROM REACT NATIVE PAPER
import ModalRNPaper from '@/components/modals/pop-up-modals/ModalRNPaper';
//! USE FLASHLIST
import { FlashList } from '@shopify/flash-list';
//! IMPORTS FOR WORKOUTS
import { WorkoutData } from '@/types/workout';
import { workoutImages, workouts } from '@/constants/Workout'
import { APPNAME } from '@/constants/AppName';

type workoutProps = {
  workout: WorkoutData;
  setSelectedWorkout: Dispatch<SetStateAction<WorkoutData | null>>;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

const Workout = ({ workout, setSelectedWorkout, setModalVisible }: workoutProps) => {
  return (
    <View style={styles.workout}>
      <Pressable
        onPress={() => {
          setSelectedWorkout(workout);
          setModalVisible(true);
        }}
      >
        <View style={styles.verticalContent}>
          <View style={styles.imageContainer}>
            <Image
              source={workoutImages[workout.title] || require('@/assets/images/icon.png')}
              style={styles.workoutImage}
            />
          </View>
          {/* <View style={styles.workoutTextDescContainer}> */}
          <Text style={styles.workoutText}>
            {workout.title}
          </Text>
          {/* <Text style={styles.workoutDesc}>
              {workout.workoutDesc}
            </Text> */}
          {/* </View> */}
        </View>
      </Pressable>
    </View>
  )
}

const Search = () => {
  const [searching, setSearching] = useState('');
  const [filterWorkouts, setFilterWorkouts] = useState(workouts);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutData | null>(null);
  const { transcription } = useLocalSearchParams();
  //! MODAL FROM REACT NATIVE BOTTOM SHEET
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);


  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const savedSearches = await AsyncStorage.getItem('recentSearches');
        if (savedSearches) {
          setRecentSearches(JSON.parse(savedSearches));
        }
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    };

    loadRecentSearches();
  }, []);

  const updateSearch = (searching: any) => {
    setSearching(searching);
    setShowRecent(searching === '');
  }

  const addToRecentSearches = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    try {
      const updatedSearches = [
        searchTerm,
        ...recentSearches.filter(item => item.toLowerCase() !== searchTerm.toLowerCase())
      ].slice(0, 5); // Keep only 5 most recent items

      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const handleTranscription = useCallback((text: string) => {
    if (text && text !== 'Real-time transcription in progress') {
      setSearching(text);
      addToRecentSearches(text);
    }
  }, [addToRecentSearches]);

  useEffect(() => {
    if (transcription) {
      const cleanTranscription = transcription as string;
      setSearching(cleanTranscription);
      addToRecentSearches(cleanTranscription);
      setShowRecent(false);
    }
  }, [transcription]);

  useEffect(() => {
    if (searching) {
      setFilterWorkouts(
        workouts.filter(workout =>
          workout.title.toLowerCase().includes(searching.toLowerCase())
        )
      );
      setShowRecent(false);
    } else {
      setFilterWorkouts(workouts);
    }
  }, [searching]);

  const handleRecentSearchPress = (searchTerm: string) => {
    setSearching(searchTerm);
    addToRecentSearches(searchTerm);
    setShowRecent(false);
  };

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem('recentSearches');
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient_ />
      <BackgroundImage />
      {/* //! MODAL FROM REACT NATIVE BOTTOM SHEET */}
      <ModalBottomSheet ref={bottomSheetModalRef} onTranscription={handleTranscription} onClose={handleDismissModal} />
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
          setShowRecent(false);
        }}
      >
        <View style={styles.content}>
          <Text style={styles.appName2}>{APPNAME.APPNAME2}</Text>
          <Text style={styles.appName}>{APPNAME.APPNAME}</Text>
          <Input
            placeholder='Search workout...'
            placeholderTextColor={CONSTANT_COLORS.BLACK}
            value={searching}
            onChangeText={updateSearch}
            onFocus={() => searching === '' && setShowRecent(true)}
            containerStyle={styles.containerStyle}
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            onPressIn={(e) => e.stopPropagation()}
            rightIcon={
              searching ? (
                <Pressable
                  onPress={() => {
                    setSearching('');
                    setShowRecent(true);
                  }}
                  style={styles.searchIconContainer}
                  hitSlop={{
                    top: 5,
                    right: 5,
                    bottom: 5,
                    left: 5,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faXmark}
                    size={20}
                    color='#fff'
                  />
                </Pressable>
              ) : (
                <Pressable
                  style={styles.searchIconContainer}
                  onPress={() => {
                    // ! MODAL FROM REACT-NATIVE-BOTTOM-SHEET < -------------------------------------------------------------------------
                    handlePresentModalPress();
                  }}
                >
                  <FontAwesomeIcon
                    //TODO: STT Feature in Search Screen
                    icon={faMicrophone}
                    // icon={faMagnifyingGlass}
                    color="#fff"
                    size={20}
                  />
                </Pressable>
              )
            }
            autoFocus={false}
            autoComplete='off'
            cursorColor={'#fff'}
          />
          {showRecent && recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <View style={styles.recentHeader}>
                <FontAwesomeIcon icon={faClockRotateLeft} color="#fff" size={16} />
                <Text style={styles.recentTitle}>Recent Searches</Text>
                <Pressable onPress={clearRecentSearches} style={styles.clearButton}>
                  <Text style={styles.clearText}>CLEAR</Text>
                </Pressable>
              </View>
              {recentSearches.map((searchTerm, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleRecentSearchPress(searchTerm)}
                  style={styles.recentItem}
                >
                  <Text style={styles.recentText}>
                    {searchTerm}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
          {/* //! MODAL FROM REACT NATIVE PAPER */}
          <ModalRNPaper visible={modalVisible} onDismiss={() => setModalVisible(false)} selectedWorkout={selectedWorkout} />
          <View style={{ flex: 1, height: '100%' }}>
            <FlashList
              data={filterWorkouts}
              numColumns={2}
              estimatedItemSize={200}
              renderItem={({ item }) => <Workout workout={item} setSelectedWorkout={setSelectedWorkout} setModalVisible={setModalVisible} />}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              onScrollBeginDrag={() => {
                Keyboard.dismiss();
                setShowRecent(false);
              }}
              ListHeaderComponent={
                searching !== '' ? (
                  <View style={{ marginBottom: 20 }}>
                    <Text style={styles.miscText}>Matched {filterWorkouts.length === 0 ? "no" : filterWorkouts.length === 1 ? "a" : filterWorkouts.length} result{filterWorkouts.length !== 1 ? 's' : ''}</Text>
                    {
                      filterWorkouts.length === 0 && (
                        <Text style={styles.fallBackText}>
                          Sorry, we couldn't find any workout that matches your search.
                        </Text>)
                    }
                  </View>
                ) : null
              }
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 3,
  },
  content: {
    flex: 1,
    marginTop: 40,
    marginHorizontal: '7%',
    zIndex: 3,
  },
  appName: {
    color: CONSTANT_COLORS.WHITE,
    fontSize: 24,
    fontFamily: Fonts.mainFont,
    textAlign: 'center',
  },
  appName2: {
    color: CONSTANT_COLORS.WHITE,
    fontSize: 14,
    fontFamily: Fonts.mainFont,
    textAlign: 'center',
  },
  containerStyle: {
    marginTop: 10,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  inputContainer: {
    backgroundColor: CONSTANT_COLORS.WHITE,
    borderRadius: 50,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: CONSTANT_COLORS.ORANGE,
  },
  input: {
    color: CONSTANT_COLORS.BLACK,
    fontSize: 15,
    fontFamily: Fonts.mainFont,
    marginLeft: 25,
  },
  searchIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -2,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: CONSTANT_COLORS.GREEN,
    borderRadius: 50,
    height: 45,
    width: 45,
  },
  workoutDesc: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.mainFont,
  },
  miscText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.mainFont,
  },
  fallBackText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: Fonts.mainFont,
    textAlign: 'center',
    marginTop: 100,
  },
  recentSearchesContainer: {
    position: 'absolute',
    top: 95, // Adjust this value based on your header height
    left: '3%',
    right: '3%',
    backgroundColor: '#666',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
    zIndex: 10, // Higher than FlatList
    elevation: 10, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.mainFont,
    marginLeft: 8,
    flex: 1,
  },
  clearButton: {
    padding: 5,
  },
  clearText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: Fonts.mainFont,
  },
  recentItem: {
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  recentText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Fonts.mainFont,
  },
  //! FLASTLIST GRID STYLES
  workout: {
    flex: 1,
    height: 130,
    padding: 12,
    marginVertical: 15,
    marginHorizontal: 5,
    backgroundColor: CONSTANT_COLORS.GRAY,
    borderRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: CONSTANT_COLORS.ORANGE,
    shadowColor: '#fff',
    elevation: 15,
  },
  verticalContent: {
    height: '100%',
    padding: 5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#666',
    borderRadius: 50,
  },
  workoutImage: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  workoutText: {
    color: CONSTANT_COLORS.WHITE,
    fontSize: 16,
    fontFamily: Fonts.mainFont,
    marginTop: 10,
    textAlign: 'center',
  },
})

export default Search;