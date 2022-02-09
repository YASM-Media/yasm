import { DeleteThreadDto } from './../../dto/chat/delete-thread.dto';
import { DeleteMessageDto } from './../../dto/chat/delete-message.dto';
import { CreateMessageDto } from './../../dto/chat/create-message.dto';
import { CreateThreadDto } from './../../dto/chat/create-thread.dto';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  Query,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { Thread } from '../../models/thread.model';
import { firebaseAuth, firebaseFirestore } from './../../utils/firebase';
import { v4 } from 'uuid';
import { Chat } from '../../models/chat.model';

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

export const createNewThread = async (
  createThreadDto: CreateThreadDto
): Promise<string> => {
  try {
    const checkForDuplicateThreads = await checkForDuplicates(
      createThreadDto.participants
    );

    if (checkForDuplicateThreads !== 'EMPTY') return checkForDuplicateThreads;

    const thread = Thread.newThread(v4(), createThreadDto.participants);

    const rawThread = thread.toJson();

    await setDoc(doc(firebaseFirestore, 'threads', thread.id), rawThread);

    return thread.id;
  } catch (error) {
    console.log(error);

    throw new Error('Something went wrong, please try again later');
  }
};

export const createNewMessage = async (
  createMessageDto: CreateMessageDto
): Promise<void> => {
  try {
    const userId = firebaseAuth.currentUser!.uid;

    const newChat = Chat.newMessage(v4(), userId, createMessageDto.message);

    const threadDocument = await getDoc(
      doc(firebaseFirestore, 'threads', createMessageDto.threadId)
    );
    const rawThread = threadDocument.data();
    const thread = Thread.fromJson(rawThread);

    thread.messages.push(newChat);
    thread.seen = [userId];
    const updateRawThread = thread.toJson();

    await setDoc(doc(firebaseFirestore, 'threads', thread.id), updateRawThread);
  } catch (error) {
    console.log(error);

    throw new Error('Something went wrong, please try again later');
  }
};

export const deleteThread = async (
  deleteThreadDto: DeleteThreadDto
): Promise<void> =>
  await deleteDoc(doc(firebaseFirestore, 'threads', deleteThreadDto.threadId));

export const deleteMessage = async (
  deleteMessageDto: DeleteMessageDto
): Promise<void> => {
  try {
    const threadDocument = await getDoc(
      doc(firebaseFirestore, 'threads', deleteMessageDto.threadId)
    );
    const rawThread = threadDocument.data();
    const thread = Thread.fromJson(rawThread);

    thread.messages = thread.messages.filter(
      (message) => message.id !== deleteMessageDto.messageId
    );

    const updateRawThread = thread.toJson();

    await setDoc(doc(firebaseFirestore, 'threads', thread.id), updateRawThread);
  } catch (error) {
    console.log(error);

    throw new Error('Something went wrong, please try again later');
  }
};

const checkForDuplicates = async (participants: string[]): Promise<string> => {
  const originalParticipants = [...participants];
  const reversedParticipants = [...participants.reverse()];

  const firstThreadQuerySnapshot = query(
    collection(firebaseFirestore, 'threads'),
    where('participants', 'in', [originalParticipants])
  );

  const firstThreadDocuments = await (
    await getDocs(firstThreadQuerySnapshot)
  ).docs;

  const secondThreadQuerySnapshot = query(
    collection(firebaseFirestore, 'threads'),
    where('participants', 'in', [reversedParticipants])
  );

  const secondThreadDocuments = await (
    await getDocs(secondThreadQuerySnapshot)
  ).docs;

  if (firstThreadDocuments.length !== 0 && firstThreadDocuments[0].exists) {
    return firstThreadDocuments[0].id;
  } else if (
    secondThreadDocuments.length !== 0 &&
    secondThreadDocuments[0].exists
  ) {
    return secondThreadDocuments[0].id;
  } else {
    return 'EMPTY';
  }
};
