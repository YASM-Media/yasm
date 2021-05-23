import firebase from 'firebase/app';
import 'firebase/storage';
import { firebaseConfig } from '../keys/firebaseKeys';

firebase.initializeApp(firebaseConfig);
export const firebaseStorage = firebase.storage().ref();
