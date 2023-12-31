import PropTypes from 'prop-types';
import { useState } from 'react';

export const CommentForm = ({
  loading,
  error,
  onSubmit,
  autoFocus = false,
  initialValue = '',
}) => {
  const [message, setMessage] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message).then(() => setMessage(''));
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="comment-form-row">
        <textarea
          autoFocus={autoFocus}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
        />
        <button className="btn" disabled={loading} type="submit">
          {loading ? 'Loading' : 'Post'}
        </button>
      </div>
      <div className="error-msg">{error}</div>
    </form>
  );
};

CommentForm.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  initialValue: PropTypes.string,
};
