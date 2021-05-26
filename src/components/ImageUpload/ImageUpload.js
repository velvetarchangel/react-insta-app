import React, {useState} from 'react';
import './ImageUpload.css';
import { Button, Input } from '@material-ui/core';
import { storage, db } from '../../firebase';
import firebase from "firebase";

function ImageUpload({username}) {
  //define state variables
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  const handleUpload = () => {
    const uploadImage = storage.ref(`images/${image.name}`).put(image);
    // progressbar
    uploadImage.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.log(error.message);
      },
      //complete function triggers once image is done uploading
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            // post image in the database
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username
            });

            setProgress(0);
            setCaption('');
            setImage(null);
          })
      }
    )
  }

  return (
    <div className="imageupload">
      <progress className="imageupload__progressbar" 
                value={progress} max='100' />
      <Input type="text" placeholder="Enter a caption ..." 
      onChange={event => setCaption(event.target.value)} 
      value={caption}></Input>
      <Input type="file" onChange={handleChange}></Input>
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  )
}

export default ImageUpload
