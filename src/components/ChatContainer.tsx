import React, { useRef, useEffect, useState } from 'react';
import { Message, Contact } from '../types';
import ChatMessage from './ChatMessage';
import { format, isToday, isYesterday } from 'date-fns';

interface ChatContainerProps {
  messages: Message[];
  onDoubleClick?: () => void;
  contact?: Contact;
  myAvatar?: string;
  onMessageUpdate?: (messageId: string, newText: string) => void;
}

// 替换 KHMER_WEEKDAYS 为中文星期
const CN_WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function getDateDividerLabel(date: Date) {
  if (isToday(date)) return '今天';
  if (isYesterday(date)) return '昨天';
  // MM月dd日 周X（中文）
  const monthDay = format(date, 'MM月dd日');
  const weekDay = CN_WEEKDAYS[date.getDay()];
  return `${monthDay} 星期${weekDay}`;
}

const DateDivider: React.FC<{ date: Date }> = ({ date }) => (
  <div className="date-divider">
    {getDateDividerLabel(date)}
  </div>
);

// 自定义日期显示组件
const CustomDateDisplay: React.FC<{ date: Date; onDateChange: (date: Date) => void }> = ({ date, onDateChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dateInput, setDateInput] = useState(format(date, 'yyyy-MM-dd'));

  const handleDateSubmit = () => {
    try {
      const newDate = new Date(dateInput);
      if (!isNaN(newDate.getTime())) {
        onDateChange(newDate);
      }
    } catch (error) {
      console.error('Invalid date:', error);
    }
    setIsEditing(false);
  };

  const formatDisplayDate = (date: Date) => {
    const monthDay = format(date, 'M月d日');
    const weekDay = CN_WEEKDAYS[date.getDay()];
    return `${monthDay} 周${weekDay}`;
  };

  return (
    <div className="custom-date-display">
      {isEditing ? (
        <div className="date-editor">
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            onBlur={handleDateSubmit}
            onKeyPress={(e) => e.key === 'Enter' && handleDateSubmit()}
            autoFocus
          />
        </div>
      ) : (
        <div className="date-display" onClick={() => setIsEditing(true)}>
          {formatDisplayDate(date)}
        </div>
      )}
    </div>
  );
};

// 加密提示组件
const EncryptionNotice: React.FC = () => (
  <div className="encryption-notice">
    <div className="encryption-icon">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
      </svg>
    </div>
    <div className="encryption-text">
      消息和通话已进行端到端加密。只有此对话中的成员可以查看、收听或分享。
      <span className="learn-more">了解更多</span>
    </div>
  </div>
);

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, onDoubleClick, contact, myAvatar, onMessageUpdate }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [customDate, setCustomDate] = useState(new Date());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick();
    }
  };

  let lastDate: string | null = null;
  const sortedMessages = [...messages].sort((a, b) => {
    const t1 = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
    const t2 = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
    return t1 - t2;
  });
  return (
    <div className="chat-container" onDoubleClick={handleDoubleClick}>
      <div className="messages-list">
        <CustomDateDisplay date={customDate} onDateChange={setCustomDate} />
        <EncryptionNotice />
        {sortedMessages.map((message, idx) => {
          const prev = sortedMessages[idx - 1];
          const msgDate = message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp);
          const prevDate = prev ? (prev.timestamp instanceof Date ? prev.timestamp : new Date(prev.timestamp)) : null;
          const isSameDay = prevDate && format(prevDate, 'yyyy-MM-dd') === format(msgDate, 'yyyy-MM-dd');
          const showTail = !prev || !isSameDay || prev.sender !== message.sender;
          const dateStr = format(msgDate, 'yyyy-MM-dd');
          const showDateDivider = !lastDate || lastDate !== dateStr;
          const elements = [];
          if (showDateDivider) {
            elements.push(<DateDivider key={`date-${dateStr}-${idx}`} date={msgDate} />);
            lastDate = dateStr;
          }
          elements.push(
            <ChatMessage key={message.id} message={message} showTail={showTail} contact={contact} myAvatar={myAvatar} onMessageUpdate={onMessageUpdate} />
          );
          return elements;
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer; 