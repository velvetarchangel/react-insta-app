
import './App.css';
import Post from "./components/Post/Post";
import logo from "./assets/LOGO.png";
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from "./components/ImageUpload/ImageUpload"

//Material UI styling for Modal
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  // State
  // In react you dont do direct manipulation 
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  
  //State for the modal
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  //State of posts
  const [posts, setPosts] = useState([]);

  //State of form in modal
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // USEEFFECT : Runs a piece of code based on a specific condition
  // if empty -> runs when the app component loads
  // if you put posts in then it will update when posts change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);          // uses cookie tracking
      } else {
        setUser(null)
      }
    })

    return () => {
      // perform some cleanup actions basically if the trigger fires multiple 
      // times it makes sure to kill the previous trigger so there is no 
      // parallel threading
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    //run it once when page loads/refreshes
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //fires every time there is a change in the DB
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data(),
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    //creates the user
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src={logo}>
              </img>
            </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}>
              </Input>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}>
              </Input>
              
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              >
              </Input>
              <Button onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src={logo}>
              </img>
            </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}>
              </Input>
              
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              >
              </Input>
              <Button onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage"
          src={logo}
        />
        {user ?  (
          <Button onClick={() => auth.signOut()}> Log Out </Button>
        ): (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Log In</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
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
      
      {user?.displayName ? 
      (<ImageUpload username={user.displayName}/>
        ): (
          <h3> Log in to upload</h3>
        )
      }
    </div>
  );
}

export default App;
