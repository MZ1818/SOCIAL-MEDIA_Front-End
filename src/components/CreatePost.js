import React, { useState } from "react";
import "./CreatePost.scss";
import Avatar from "./Avatar";
import backgroundDummyImg from "../assets/background.jpg";
import { BsCardImage } from "react-icons/bs";
import { axiosClient } from "../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/slices/appConfigSlice";
import { getUserProfile } from "../redux/slices/postsSlice";

const CreatePost = () => {
  const [postImg, setPostImg] = useState("");
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();
  const myProfile = useSelector((state) => state.appConfigReducer.myProfile);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setPostImg(fileReader.result);
      }
    };
  };

  const handlePostSubmit = async () => {
    try {
      dispatch(setLoading(true));
      const result = await axiosClient.post("/post", {
        caption,
        postImg,
      });
      console.log("post done", result);
      dispatch(getUserProfile({ userId: myProfile._id }));
    } catch (error) {
      console.log("what is the error", error);
    } finally {
      dispatch(setLoading(false));
      setCaption("");
      setPostImg("");
    }
  };

  return (
    <div className="CreatePost">
      <div className="left-part-create-post">
        <Avatar src={myProfile?.avatar?.url} />
      </div>
      <div className="right-part-create-post">
        <input
          value={caption}
          type="text"
          className="captionInput"
          placeholder="What's on your mind?"
          onChange={(e) => setCaption(e.target.value)}
        />

        {postImg && (
          <div className="img-container">
            <img className="post-img" src={postImg} alt="post-img" />
          </div>
        )}

        <div className="bottom-part">
          <div className="input-post-img">
            <label htmlFor="inputImg" className="labelImg">
              <BsCardImage />
            </label>
            <input
              className="inputImg"
              id="inputImg"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button
            className="post-button btn-primary"
            onClick={handlePostSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
