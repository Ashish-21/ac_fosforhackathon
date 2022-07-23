import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import List from "@mui/material/List";
import { CommentModel } from "../../Models/DataModels";
import {
  getUserComments,
  createUserComment,
} from "../../Services/CommentsService/CommentsApi";
import CommentBox from "./CommentBox";

interface Ownprops {
  postID?: string;
  userID?: string;
}

function CommentList({ postID, userID }: Ownprops) {
  const [allCommentsData, setAllCommentsData] = useState<CommentModel[]>([]);
  useEffect(() => {
    getUserComments()
      .then((data) => {
        setAllCommentsData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getReplyForComment = (commentId: string) => {
    return allCommentsData
      .filter((com) => com.parentId === commentId && com.postID === postID)
      .sort(
        (coma, comb) =>
          new Date(coma.createdAt).getTime() -
          new Date(comb.createdAt).getTime()
      );
  };

  const postComment = (com: string, parentId: string) => {
    console.log(com, parentId);
    createUserComment(com, null, "1", "Ashish", "12").then((data) =>
      setAllCommentsData([data, ...allCommentsData])
    );
  };

  return (
    <>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {allCommentsData
          .filter(
            (c) =>
              c.postID === postID && c.userID === userID && c.parentId === null
          )
          .map((comment) => (
            <Comment
              commentData={comment}
              key={comment.id}
              replyComment={getReplyForComment(comment.id)}
            />
          ))}
      </List>
      <CommentBox label="Send" handleSubmit={postComment} />
    </>
  );
}

export default CommentList;
