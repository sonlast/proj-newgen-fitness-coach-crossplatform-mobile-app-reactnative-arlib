import { WorkoutData, WorkoutTitle } from "@/types/workout";
// EXPORT WORKOUTS FROM HERE

export const workoutImages = {
  'Push Ups': require('../assets/images/workouts/push_ups/push_ups.jpg'),
  'Sit Ups': require('../assets/images/workouts/sit_ups/sit_ups.jpg'),
  'Planks': require('../assets/images/workouts/planks/planks.png'),
  'Squats': require('../assets/images/workouts/squats/squats.jpg'),
  'Pull Ups': require('../assets/images/icon.png'),
  'Lunges': require('../assets/images/workouts/lunges/lunges.png'),
  'Burpees': require('../assets/images/icon.png'),
  'Jumping Jacks': require('../assets/images/workouts/jumping_jacks/jumping_jacks.jpg'),
  'Mountain Climbers': require('../assets/images/workouts/mountain_climbers/mountain_climbers.jpg'),
  'High Knees': require('../assets/images/workouts/high_knees/high_knees.jpg'),
}

export const workouts: WorkoutData[] = [
  {
    id: '1',
    title: 'Push Ups',
    workoutDesc: 'Push ups are a great way to work out your chest, shoulders, and triceps.',
  },
  {
    id: '2',
    title: 'Sit Ups',
    workoutDesc: 'Sit ups are a great way to work out your core.',
  },
  {
    id: '3',
    title: 'Planks',
    workoutDesc: 'Planks are a great way to work out your core.',
  },
  {
    id: '4',
    title: 'Squats',
    workoutDesc: 'Squats are a great way to work out your legs.',
  },
  {
    id: '5',
    title: 'Pull Ups',
    workoutDesc: 'Pull ups are a great way to work out your back and biceps.',
  },
  {
    id: '6',
    title: 'Lunges',
    workoutDesc: 'Lunges are a great way to work out your legs.',
  },
  {
    id: '7',
    title: 'Burpees',
    workoutDesc: 'Burpees are a great way to work out your whole body.',
  },
  {
    id: '8',
    title: 'Jumping Jacks',
    workoutDesc: 'Jumping jacks are a great way to work out your whole body.',
  },
  {
    id: '9',
    title: 'Mountain Climbers',
    workoutDesc: 'Mountain climbers are a great way to work out your whole body.',
  },
  {
    id: '10',
    title: 'High Knees',
    workoutDesc: 'High knees are a great way to work out your whole body.',
  },
]
