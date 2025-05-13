import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { User } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Reset messages when selected user changes
  useEffect(() => {
    if (selectedUser?.id) {
      // Clear existing messages
      useChatStore.setState({ messages: [] });
      // Get new messages
      getMessages(selectedUser.id);
    }
  }, [selectedUser?.id, getMessages]);

  // Subscribe to new messages
  useEffect(() => {
    if (selectedUser?.id) {
      subscribeToMessages();
      return () => unsubscribeFromMessages();
    }
  }, [selectedUser?.id, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to bottom when messages change or selected user changes
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser?.id]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base-100">
        <p className="text-lg text-base-content/70">
          Select a user to start chatting
        </p>
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => {
          const isSender = message.senderID === authUser.id;
          return (
            <div
              key={message.id}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[75%] ${
                  isSender ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div className="avatar">
                  <div className="size-10 rounded-full bg-base-300 flex items-center justify-center overflow-hidden ring-2 ring-base-200">
                    {isSender ? (
                      authUser.profile?.imageUrl ? (
                        <img
                          src={authUser.profile.imageUrl}
                          alt="avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                          }}
                        />
                      ) : (
                        <User className="size-6 text-base-content/70" />
                      )
                    ) : selectedUser.profile?.imageUrl ? (
                      <img
                        src={selectedUser.profile.imageUrl}
                        alt="avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : (
                      <User className="size-6 text-base-content/70" />
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div
                  className={`flex flex-col gap-1.5 ${
                    isSender ? "items-end" : "items-start"
                  }`}
                >
                  {/* Message Card */}
                  <div
                    className={`rounded-xl border border-base-300 bg-base-200/80 shadow-lg px-5 py-3 max-w-[500px] break-words ${
                      isSender ? "ml-2" : "mr-2"
                    }`}
                  >
                    {message.content && (
                      <div className="mb-1 text-base-content">
                        {message.content}
                      </div>
                    )}
                    {message.image && (
                      <div className="mt-2">
                        <img
                          src={message.image}
                          alt="message"
                          className="rounded-lg max-w-[300px] max-h-[300px] object-cover border border-base-300"
                        />
                      </div>
                    )}
                    <div className="flex justify-end mt-2">
                      <span className="text-xs text-base-content/60 px-1">
                        {new Date(message.timeStamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
