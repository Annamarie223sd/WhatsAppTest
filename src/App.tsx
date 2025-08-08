import React, { useState, useRef } from 'react';
import { Message, Contact } from './types';
import ChatHeader from './components/ChatHeader';
import ChatContainer from './components/ChatContainer';
import Sidebar from './components/Sidebar';
import ChatInputBar from './components/ChatInputBar';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import './App.css';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const deviceInfo = useDeviceDetection();
  const sidebarControlsRef = useRef<{ showToggle: () => void } | null>(null);
  const [contact, setContact] = useState<Contact>({
    id: '1',
    name: '联系人名称',
    avatar: '/匿名.png',
    status: 'online',
    customStatus: '点击此处以查看联系人信息',
  });
  const [myAvatar, setMyAvatar] = useState<string>('/default-avatar.jpg');

  const handleSendMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleContactUpdate = (updatedContact: Contact) => {
    setContact(updatedContact);
  };

  const handleMessageUpdate = (messageId: string, newText: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, text: newText }
          : msg
      )
    );
  };

  const exportChat = () => {
    const chatData = {
      contact: contact,
      messages: messages,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `whatsapp-chat-${contact.name}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    if (window.confirm('确定要清空所有聊天记录吗？')) {
      setMessages([]);
    }
  };

  const generateSampleChat = () => {
    const sampleMessages: Message[] = [
      {
        id: '1',
        text: '你好！',
        sender: 'other',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
      },
      {
        id: '2',
        text: '你好！最近怎么样？',
        sender: 'me',
        timestamp: new Date(Date.now() - 3500000),
        type: 'text',
        status: 'read', // 已读
      },
      {
        id: '3',
        text: '还不错，工作比较忙',
        sender: 'other',
        timestamp: new Date(Date.now() - 3400000),
        type: 'text',
      },
      {
        id: '4',
        text: '注意身体，别太累了',
        sender: 'me',
        timestamp: new Date(Date.now() - 3300000),
        type: 'text',
        status: 'delivered', // 已送达
      },
      {
        id: '5',
        text: '谢谢关心！',
        sender: 'other',
        timestamp: new Date(Date.now() - 3200000),
        type: 'text',
      },
    ];

    setMessages(sampleMessages);
  };

  const handleSidebarControlsReady = (controls: { showToggle: () => void }) => {
    sidebarControlsRef.current = controls;
  };

  const handleChatDoubleClick = () => {
    if (deviceInfo.isMobile && sidebarControlsRef.current) {
      sidebarControlsRef.current.showToggle();
    }
  };

  return (
    <div className={`app ${deviceInfo.deviceType}`}>
      <div className="chat-layout">
        <ChatHeader contact={contact} />
        <ChatContainer 
          messages={messages} 
          onDoubleClick={handleChatDoubleClick}
          contact={contact}
          myAvatar={myAvatar}
          onMessageUpdate={handleMessageUpdate}
        />
      </div>
      
      <Sidebar
        onSendMessage={handleSendMessage}
        onGenerateSampleChat={generateSampleChat}
        onExportChat={exportChat}
        onClearChat={clearChat}
        onContactUpdate={handleContactUpdate}
        contact={contact}
        onToggleReady={handleSidebarControlsReady}
        myAvatar={myAvatar}
        onMyAvatarUpdate={setMyAvatar}
      />
      <ChatInputBar />
    </div>
  );
};

export default App; 


