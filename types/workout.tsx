export type WorkoutTitle =
  | 'Push Ups'
  | 'Sit Ups'
  | 'Planks'
  | 'Squats'
  | 'Pull Ups'
  | 'Lunges'
  | 'Burpees'
  | 'Jumping Jacks'
  | 'Mountain Climbers'
  | 'High Knees';

export type WorkoutData = {
  id: string;
  title: WorkoutTitle;
  workoutDesc: string;
}