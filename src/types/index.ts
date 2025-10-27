import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type Category = 'personal' | 'work' | 'ideas' | 'tasks';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: Category;
  userId: string;
  createdAt: FirebaseFirestoreTypes.Timestamp | Date;
  updatedAt: FirebaseFirestoreTypes.Timestamp | Date;
}

export interface NoteInput {
  title: string;
  content: string;
  category: Category;
}

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export type RootStackParamList = {
  Home: undefined;
  NoteEditor: { note?: Note } | undefined;
};
