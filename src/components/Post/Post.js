import React from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";

function Post({ username, caption, imageUrl }) {

  return (
    <div className="post">
      {/* header */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          src="/static/images/avatar/1.jpg"
          alt={username}
        />
        <h3>{username}</h3>
      </div>

      {/* post image */}
      <img
        className="post__image"
        src={imageUrl}
      />
      
      {/* post caption */}
      <h4 class="post__text"><strong>{username}</strong> {caption}</h4>
    </div>
  )
}

export default Post

