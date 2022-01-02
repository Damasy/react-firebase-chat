import React, { useEffect, useState, useRef } from 'react';
import './App.css';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {getFirestore , query, addDoc, collection, limit, orderBy, serverTimestamp } from 'firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseApp = initializeApp ({
  apiKey: "AIzaSyDiWE0xhhkq-AXjrePkJ48zlGlJ9rFBjFo",
  authDomain: "react-firebase-chat-a5155.firebaseapp.com",
  projectId: "react-firebase-chat-a5155",
  storageBucket: "react-firebase-chat-a5155.appspot.com",
  messagingSenderId: "342592383196",
  appId: "1:342592383196:web:dac3aab26b0fad663b6c19",
  measurementId: "G-7MYKWHE1TD"
});

const auth = getAuth();
const db = getFirestore(firebaseApp);

function App() {
  const [user] = useAuthState(auth);
  
  useEffect(() => {
    onAuthStateChanged(auth, authUser => {
      
    })
  }, [])

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}


function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    console.log(provider, 'provider')
    signInWithPopup(auth, provider);
  }
  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => signOut(auth)}>Sign Out</button>
  )
}

function ChatRoom() {
  const messageRef = collection(db, 'messages');
  const [formValue, setFormValue] = useState('');
  const qry = query(messageRef, orderBy('createdAt'), limit(25));

  const dummy = useRef();

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await addDoc(messageRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');

    dummy.current.scrollIntoView({behavior: 'smooth'})
  }

  const [messages] = useCollectionData(qry, { idField: 'id' })
  
  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

        <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
    </>
  )
}

function ChatMessage({ message }) {
  const { text, uid, photoURL } = message;
  console.log(message, 'message', message.uid, message.id)
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return(
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt={uid} />
      <p>{text}</p>
    </div>
  )
}

export default App;