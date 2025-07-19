import React from "react";
import { StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

interface WorkoutSkeletonProps {
  count?: number;
}

const WorkoutSkeleton = ({ count = 5 }: WorkoutSkeletonProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <MotiView
          key={index}
          style={styles.skeletonItem}
          transition={{ type: 'timing' }}
          from={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
        >
          {/* Image placeholder */}
          <Skeleton colorMode="dark" radius="round" height={50} width={50} />
          
          {/* Text content placeholders */}
          <View style={styles.textContainer}>
            <Skeleton colorMode="dark" width={'60%'} height={20} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode="dark" width={'90%'} height={16} />
          </View>
        </MotiView>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
  skeletonItem: {
    padding: 12,
    marginVertical: 15,
    backgroundColor: '#000',
    borderRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderColor: '#fff',
    shadowColor: '#fff',
    elevation: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
});

export default WorkoutSkeleton;