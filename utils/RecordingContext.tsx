import { createContext, useContext, ReactNode } from 'react';
import { useRecording } from '../hooks/useRecording';

interface RecordingContextType {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | undefined>;
  uri: string | null;
  isReady: boolean;
}

const RecordingContext = createContext<RecordingContextType | null>(null);

// Provider component for the recording context
export const RecordingProvider = ({ children }: { children: ReactNode }) => {
  const recordingState = useRecording();
  return (
    <RecordingContext.Provider value={recordingState}>
      {children}
    </RecordingContext.Provider>
  );
};

// Custom hook to use the recording context
export const useRecordingContext = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error('useRecordingContext must be used within a RecordingProvider');
  }
  return context;
};