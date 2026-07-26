import React, { useState, useEffect } from 'react';
import { TaskComment } from '../../types';
import { subscribeComments, addComment } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { useRealtimeData } from '../../context/RealtimeDataContext';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { MessageSquare, Send, Smile } from 'lucide-react';

interface TaskCommentsSectionProps {
  taskId: string;
}

export const TaskCommentsSection: React.FC<TaskCommentsSectionProps> = ({ taskId }) => {
  const { currentUser, userProfile } = useAuth();
  const { users } = useRealtimeData();
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    const unsub = subscribeComments(taskId, (newComments) => {
      setComments(newComments);
    });
    return () => unsub();
  }, [taskId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentUser) return;

    try {
      setSubmitting(true);
      await addComment({
        taskId,
        authorId: currentUser.uid,
        authorName: userProfile?.fullName || 'User',
        authorPhoto: userProfile?.photoURL,
        content: content.trim(),
      });
      setContent('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setContent((prev) => prev + ' ' + emoji);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-400" />
          <span>Realtime Discussion ({comments.length})</span>
        </h4>
      </div>

      {/* Comment List */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 italic">
            No comments yet. Start the conversation!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.commentId} className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
              <UserAvatar name={comment.authorName} photoURL={comment.authorPhoto} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{comment.authorName}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-200 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Emoji Bar */}
      <div className="flex items-center gap-1.5 pt-1">
        {['👍', '🚀', '❤️', '🎉', '👀', '🔥'].map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => addEmoji(emoji)}
            className="px-2 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-xs transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Add Comment Input */}
      <form onSubmit={handleAddComment} className="flex items-center gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment... (use @name to mention team members)"
          className="flex-1 px-4 py-2.5 rounded-2xl glass-input text-xs focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
