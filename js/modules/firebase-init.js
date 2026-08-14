import { firebaseConfig } from '../firebase-config.js';

let scriptsRef = null;

export function initializeFirebase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
}

export function initFirestoreRefs() {
    scriptsRef = firebase.firestore().collection('scripts');
    return scriptsRef;
}

export function getScriptsRef() {
    return scriptsRef;
}