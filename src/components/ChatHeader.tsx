import React from 'react';
import { Contact } from '../types';
import { Video, Phone, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  contact: Contact;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  return (
    <div className="chat-header">
      <div className="contact-info">
        <div className="avatar">
          <img src={contact.avatar} alt={contact.name} />
        </div>
        <div className="contact-details">
          <div className="contact-name">{contact.name}</div>
          <div className="contact-status">
            {contact.customStatus || '点击此处以查看联系人信息'}
          </div>
        </div>
      </div>
      
      <div className="header-actions">
        <button className="action-btn">
          <Video size={30} color="#212121" />
        </button>
        <button className="action-btn">
          <Phone size={25} color="#212121" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 