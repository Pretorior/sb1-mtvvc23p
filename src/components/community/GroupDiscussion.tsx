import React, { useState } from 'react';
import { MessageSquare, Heart, Flag, MoreHorizontal, Image, Send, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
  replies?: Message[];
}

interface GroupDiscussionProps {
  groupId: string;
  discussion: {
    id: string;
    title: string;
    messages: Message[];
  };
  onSendMessage: (content: string, parentId?: string) => void;
  onLikeMessage: (messageId: string) => void;
  onReportMessage: (messageId: string, reason: string) => void;
}

export function GroupDiscussion({ groupId, discussion, onSendMessage, onLikeMessage, onReportMessage }: GroupDiscussionProps) {
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage, replyTo);
      setNewMessage('');
      setReplyTo(null);
    }
  };

  const handleReport = (messageId: string) => {
    setReportingMessageId(messageId);
    setShowReportModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* En-tête de la discussion */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">{discussion.title}</h2>
      </div>

      {/* Messages */}
      <div className="p-6 space-y-6">
        {discussion.messages.map((message) => (
          <div key={message.id} className="space-y-4">
            <div className="flex gap-4">
              <Link to={`/profile/${message.userId}`}>
                <img
                  src={message.userAvatar}
                  alt={message.userName}
                  className="w-10 h-10 rounded-full"
                />
              </Link>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      to={`/profile/${message.userId}`}
                      className="font-medium text-gray-900 hover:text-malibu-500"
                    >
                      {message.userName}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onLikeMessage(message.id)}
                      className={`p-1 rounded-full transition-colors ${
                        message.liked
                          ? 'text-apricot-500'
                          : 'text-gray-400 hover:text-apricot-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${message.liked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => setReplyTo(message.id)}
                      className="p-1 text-gray-400 hover:text-malibu-500 rounded-full"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReport(message.id)}
                      className="p-1 text-gray-400 hover:text-apricot-500 rounded-full"
                    >
                      <Flag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-gray-600">{message.content}</div>
                
                {/* Réponses */}
                {message.replies && message.replies.length > 0 && (
                  <div className="mt-4 pl-8 space-y-4">
                    {message.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-4">
                        <Link to={`/profile/${reply.userId}`}>
                          <img
                            src={reply.userAvatar}
                            alt={reply.userName}
                            className="w-8 h-8 rounded-full"
                          />
                        </Link>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <Link
                                to={`/profile/${reply.userId}`}
                                className="font-medium text-gray-900 hover:text-malibu-500"
                              >
                                {reply.userName}
                              </Link>
                              <p className="text-sm text-gray-500">
                                {new Date(reply.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onLikeMessage(reply.id)}
                                className={`p-1 rounded-full transition-colors ${
                                  reply.liked
                                    ? 'text-apricot-500'
                                    : 'text-gray-400 hover:text-apricot-500'
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${reply.liked ? 'fill-current' : ''}`} />
                              </button>
                              <button
                                onClick={() => handleReport(reply.id)}
                                className="p-1 text-gray-400 hover:text-apricot-500 rounded-full"
                              >
                                <Flag className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 text-gray-600">{reply.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire de message */}
      <div className="p-6 border-t border-gray-100">
        <form onSubmit={handleSubmit}>
          {replyTo && (
            <div className="mb-4 flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">
                Répondre à un message
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Votre message..."
                className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none"
                rows={1}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <Image className="w-5 h-5" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-malibu-500 text-white rounded-full hover:bg-malibu-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Modal de signalement */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Signaler ce message
            </h3>
            <div className="space-y-4">
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Raison du signalement..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-malibu-300 focus:outline-none resize-none h-32"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportingMessageId(null);
                    setReportReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (reportingMessageId && reportReason.trim()) {
                      onReportMessage(reportingMessageId, reportReason);
                      setShowReportModal(false);
                      setReportingMessageId(null);
                      setReportReason('');
                    }
                  }}
                  className="px-4 py-2 bg-apricot-500 text-white rounded-full hover:bg-apricot-600 transition-colors"
                >
                  Signaler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}