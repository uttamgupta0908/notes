import { Category } from '../types';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const CATEGORIES: Category[] = ['personal', 'work', 'ideas', 'tasks'];

export const formatDate = (
  timestamp: FirebaseFirestoreTypes.Timestamp | Date | undefined,
): string => {
  if (!timestamp) return 'Just now';

  const date = 'toDate' in timestamp ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
};
