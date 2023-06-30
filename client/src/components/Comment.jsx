/* eslint-disable react/prop-types */

import { useState } from 'react';
import { usePost } from '../contexts/PostContext';
import CommentList from './CommentList';
import IconButton from './IconButton';
import { FaEdit, FaHeart, FaReply, FaTrash } from 'react-icons/fa';
import { CommentForm } from './CommentForm';
import { useAsyncFn } from '../hooks/useAsync';
import { createComment } from '../services/comments';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const Comment = ({ id, message, user, createdAt }) => {
  const { post, getReplies, createLocalComment } = usePost();
  const childComments = getReplies(id);
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const createCommentFn = useAsyncFn(createComment);

  function onCommentReply(message) {
    return createCommentFn
      .execute({ postId: post.id, message, parentId: id })
      .then((comment) => {
        setIsReplying(false);
        createLocalComment(comment);
      });
  }

  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{user.name}</span>
          <span className="date">
            {dateFormatter.format(Date.parse(createdAt))}
          </span>
        </div>
        <div className="message">{message}</div>
        <div className="footer">
          <IconButton Icon={FaHeart} aria-label={'Like'}>
            2
          </IconButton>
          <IconButton
            isActive={isReplying}
            onClick={() => setIsReplying((prev) => !prev)}
            Icon={FaReply}
            aria-label={isReplying ? 'Cancel reply' : 'Reply'}
          />
          <IconButton Icon={FaEdit} aria-label={'Edit'} />
          <IconButton Icon={FaTrash} aria-label={'Delete'} color="danger" />
        </div>
      </div>
      {isReplying && (
        <div className="mt-1 ml-3">
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={createCommentFn.loading}
            error={createCommentFn.error}
          />
        </div>
      )}
      {childComments?.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${
              areChildrenHidden ? 'hide' : ''
            }`}
          >
            <button
              className="collapse-line"
              aria-label="Hide replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              <CommentList comments={childComments} />
            </div>
          </div>
          <button
            className={`btn mt-1 ${!areChildrenHidden ? 'hide' : ''}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            Show replies
          </button>
        </>
      )}
    </>
  );
};

export default Comment;
