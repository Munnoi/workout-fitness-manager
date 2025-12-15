import { useState, useEffect } from 'react';
import { contactAPI } from '../../services/api';
import { FiMail, FiCheck, FiClock, FiAlertCircle, FiSend } from 'react-icons/fi';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.status = filter;
      const response = await contactAPI.list(params);
      setMessages(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) return;

    setSending(true);
    try {
      await contactAPI.reply(selectedMessage.id, {
        admin_reply: reply,
        status: 'resolved',
      });
      setReply('');
      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (messageId, status) => {
    try {
      await contactAPI.reply(messageId, { status });
      fetchMessages();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-orange-500" />;
      case 'in_progress':
        return <FiAlertCircle className="text-blue-500" />;
      case 'resolved':
        return <FiCheck className="text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Contact Messages</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">Manage user feedback and inquiries</p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6 transition-colors duration-200">
          <div className="flex space-x-2">
            {['', 'pending', 'in_progress', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  filter === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status === '' ? 'All' : status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow transition-colors duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                Messages ({messages.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
                <FiMail className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600 transition-colors duration-200" />
                <p>No messages found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 ${
                      selectedMessage?.id === message.id ? 'bg-primary/5 dark:bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(message.status)}
                          <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">{message.subject}</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                          {message.name} &lt;{message.email}&gt;
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 transition-colors duration-200">
                          {message.message}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs capitalize transition-colors duration-200 ${getStatusColor(
                            message.status
                          )}`}
                        >
                          {message.status.replace('_', ' ')}
                        </span>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 transition-colors duration-200">
                          {new Date(message.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow transition-colors duration-200">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-200">Message Details</h2>
            </div>

            {selectedMessage ? (
              <div className="p-4">
                <div className="mb-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs capitalize transition-colors duration-200 ${getStatusColor(
                      selectedMessage.status
                    )}`}
                  >
                    {selectedMessage.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200">
                  {selectedMessage.subject}
                </h3>

                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-200">
                  <p>From: {selectedMessage.name}</p>
                  <p>Email: {selectedMessage.email}</p>
                  <p>Date: {new Date(selectedMessage.created_at).toLocaleString()}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 transition-colors duration-200">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap transition-colors duration-200">{selectedMessage.message}</p>
                </div>

                {selectedMessage.admin_reply && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4 transition-colors duration-200">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-1 transition-colors duration-200">Your Reply:</p>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap transition-colors duration-200">
                      {selectedMessage.admin_reply}
                    </p>
                  </div>
                )}

                {selectedMessage.status !== 'resolved' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                        Reply
                      </label>
                      <textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                        placeholder="Type your reply..."
                      />
                    </div>

                    <button
                      onClick={handleReply}
                      disabled={sending || !reply.trim()}
                      className="w-full flex items-center justify-center py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors duration-200"
                    >
                      <FiSend className="mr-2" />
                      {sending ? 'Sending...' : 'Send Reply & Resolve'}
                    </button>
                  </>
                )}

                {selectedMessage.status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'in_progress')}
                    className="w-full mt-2 py-2 px-4 border border-blue-500 text-blue-500 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
                  >
                    Mark as In Progress
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
                <FiMail className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600 transition-colors duration-200" />
                <p>Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
