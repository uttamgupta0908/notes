import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Note, NoteInput } from '../types';

export const notesCollection = firestore().collection('notes');

export const createNote = async (
  userId: string,
  noteData: NoteInput,
): Promise<Note> => {
  try {
    const note = {
      ...noteData,
      userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await notesCollection.add(note);
    return { id: docRef.id, ...note } as Note;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const updateNote = async (
  noteId: string,
  noteData: Partial<NoteInput>,
): Promise<void> => {
  try {
    await notesCollection.doc(noteId).update({
      ...noteData,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<void> => {
  try {
    await notesCollection.doc(noteId).delete();
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const getUserNotes = (
  userId: string,
  callback: (notes: Note[]) => void,
): (() => void) => {
  return notesCollection
    .where('userId', '==', userId)
    .orderBy('updatedAt', 'desc')
    .onSnapshot(
      (snapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
        const notes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Note[];
        callback(notes);
      },
      error => {
        console.error('Error fetching notes:', error);
      },
    );
};

export { auth };
