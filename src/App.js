
import './App.css';
import Post from "./components/Post/Post"
import logo from "./assets/LOGO.png"
import React, { useState, useEffect } from 'react';
import { db } from './firebase'

function App() {
  // State
  // In react you dont do direct manipulation 
  const [posts, setPosts] = useState([]);

  // USEEFFECT : Runs a piece of code based on a specific condition
  // if empty -> runs when the app component loads
  // if you put posts in then it will update when posts change
  useEffect(() => {
    //run it once when page loads/refreshes
    db.collection('posts').onSnapshot(snapshot => {
      //fires every time there is a change in the DB
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data(),
      })));
    })
  }, []);

  return (
    <div className="App">
      <div class="app__header">
        <img className="app__headerImage"
          src={logo}
        />
      </div>
      {
        posts.map(({ id, post }) => (
          // This makes sure only the post that is created/changed is refreshed
          // Makes things more efficient
          <Post
            key={id}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))
      }
    </div>
  );
}

export default App;
