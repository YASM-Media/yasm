import {
  collection,
  doc,
  DocumentData,
  DocumentReference,
  Query,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { Thread } from '../../models/thread.model';
import { firebaseAuth, firebaseFirestore } from './../../utils/firebase';

export const listenToThreads = (): Query<DocumentData> => {
  const userId = firebaseAuth.currentUser!.uid;

  const threadsQuery = query(
    collection(firebaseFirestore, 'threads'),
    where('participants', 'array-contains', userId)
  );

  return threadsQuery;
};

export const listenToThread = (
  threadId: string
): DocumentReference<DocumentData> => {
  const threadDocument = doc(firebaseFirestore, 'threads', threadId);

  return threadDocument;
};

export const markThreadSeen = async (thread: Thread): Promise<void> => {
  try {
    const userId = firebaseAuth.currentUser!.uid;

    if (thread.seen.filter((id) => id === userId).length === 1) {
      return;
    }

    thread.seen.push(userId);
    const rawThread = thread.toJson();

    await setDoc(doc(firebaseFirestore, 'threads', thread.id), rawThread);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong, please try again later');
  }
};
