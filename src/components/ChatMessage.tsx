import React, { useState, useRef, useEffect } from 'react';
import { Message, Contact } from '../types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ChatMessageProps {
  message: Message;
  showTail?: boolean;
  contact?: Contact;
  myAvatar?: string;
  onMessageUpdate?: (messageId: string, newText: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, showTail, contact, myAvatar, onMessageUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm', { locale: zhCN });
  };

  // 格式化时长为 分钟:秒数 格式
  const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 从 minutes 和 seconds 字段格式化时长
  const formatDurationFromFields = (minutes?: number, seconds?: number) => {
    if (minutes !== undefined && seconds !== undefined) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return null;
  };

  // 当进入编辑模式时，自动聚焦并选中文本
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  // 处理编辑开始
  const handleEditStart = () => {
    if (message.type === 'text' && message.sender === 'me') {
      setIsEditing(true);
      setEditText(message.text);
    }
  };

  // 处理编辑保存
  const handleEditSave = () => {
    if (editText.trim() !== '' && editText !== message.text && onMessageUpdate) {
      onMessageUpdate(message.id, editText.trim());
    }
    setIsEditing(false);
  };

  // 处理编辑取消
  const handleEditCancel = () => {
    setEditText(message.text);
    setIsEditing(false);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const renderReadReceipts = () => {
    // 只有自己发送的消息才显示状态
    if (message.sender !== 'me') {
      return null;
    }
    
    const messageStatus = message.status || 'read'; // 默认状态为已读
    
    switch (messageStatus) {
      case 'sent':
        return (
          <div className="read-receipts sent">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832Z"/>
            </svg>
          </div>
        );
      case 'delivered':
        return (
          <div className="read-receipts delivered">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832Z"/>
            </svg>
          </div>
        );
      case 'read':
        return (
          <div className="read-receipts read">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="read-receipts read">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z"/>
            </svg>
          </div>
        );
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="message-image" style={{ position: 'relative' }}>
            <img 
              src={message.imageUrl || '/default-image.jpg'} 
              alt="图片消息"
              className="message-image-content"
            />
            {message.text && (
              <div className="message-image-caption">{message.text}</div>
            )}
            <div className="image-message-time">
              {formatTime(message.timestamp)}
              {message.sender === 'me' && renderReadReceipts()}
            </div>
          </div>
        );
      case 'voice-call':
        return (
          <div className="voice-call-message">
            <div className="voice-call-icon">
              <svg viewBox="0 0 1024 1024" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                <circle cx="512" cy="512" r="512" fill="#fff"/>
                <g>
                  <path
                    d="M399.658667 141.354667l36.693333 86.485333c15.957333 37.674667 7.082667 82.005333-21.930667 109.568L333.568 414.122667c4.992 45.909333 20.437333 91.093333 46.293333 135.552a370.261333 370.261333 0 0 0 96.853334 110.72l97.109333-32.384c36.821333-12.245333 76.885333 1.834667 99.413333 34.986666l52.608 77.226667c26.24 38.570667 21.504 91.733333-11.050666 124.416l-34.858667 35.072c-34.730667 34.858667-84.352 47.488-130.218667 33.152-108.373333-33.749333-207.914667-134.101333-298.794666-300.928-91.008-167.082667-123.136-308.864-96.341334-425.301333 11.264-48.981333 46.122667-88.021333 91.690667-102.570667l45.909333-14.677333c43.050667-13.738667 89.045333 8.490667 107.477334 51.968z"
                    fill="#212121"
                    transform="rotate(-25 511 512)"
                  />
                  <path
                    d="M629.248 85.333333h279.637333l4.266667 0.64 4.181333 1.152 2.730667 1.152a30.762667 30.762667 0 0 1 9.216 6.4l1.706667 1.877334 1.877333 2.389333 2.218667 3.669333 1.706666 3.925334 1.194667 4.266666 0.554667 3.882667v0.512l0.085333 0.853333v278.784a32 32 0 0 1-63.701333 4.352l-0.256-4.352-0.042667-200.32-265.386667 265.557334a32 32 0 0 1-41.642666 3.114666l-3.584-3.072a32 32 0 0 1-3.114667-41.685333l3.114667-3.584L829.354667 149.333333l-200.106667 0.042667a32 32 0 0 1-31.701333-27.648l-0.298667-4.352a32 32 0 0 1 27.648-31.701333l4.352-0.298667z"
                    fill="#212121"
                    transform="rotate(-5 511 512) translate(511,512) scale(0.8,0.8) translate(-551,-512)"
                  />
                </g>
              </svg>
            </div>
            <div className="voice-call-content">
              <div className="voice-call-title">{message.text || '语音通话'}</div>
              {(() => {
                // 优先使用 minutes 和 seconds 字段格式化时长
                const formattedDuration = formatDurationFromFields(message.minutes, message.seconds);
                if (formattedDuration) {
                  return <div className="voice-call-duration">{formattedDuration}</div>;
                }
                // 如果没有 minutes/seconds，使用 subTitle
                if (message.subTitle) {
                  return <div className="voice-call-duration">{message.subTitle}</div>;
                }
                // 默认显示未接听
                return <div className="voice-call-duration" style={{ color: '#597156', fontWeight: '300' }}>未接听</div>;
              })()}
            </div>
            <div className="voice-call-time" style={{ color: '#597156' }}>{formatTime(message.timestamp)}</div>
          </div>
        );
      case 'voice-message':
        return (
          <div className={`voice-message-content ${message.sender === 'me' ? 'voice-sent' : 'voice-received'}`}>
            {/* 接收方布局：播放按钮 + 波形 + 头像 */}
            {message.sender !== 'me' ? (
              <>
                <button className="voice-play-btn">
                  <svg width="25" height="25" viewBox="0 0 16 16" fill="#656565" >
                    <path d="M4 2 Q4 2 4.5 2.5 L11.5 8 Q12 8.5 11.5 9 L4.5 13.5 Q4 14 3.5 13.5 L3.5 2.5 Q4 2 4.5 2.5 Z"/>
                  </svg>
                </button>
                <div className="voice-message-center">
                  <div className="voice-message-waveform">
                    <canvas 
                      width="650" 
                      height="100" 
                      className="waveform-canvas"
                      ref={(canvas) => {
                        if (canvas) {
                          const ctx = canvas.getContext('2d');
                          if (ctx) {
                            ctx.clearRect(0, 0, 650, 100);
                            ctx.fillStyle = '#89b48e';
                            
                            // 如果没有数据点，显示小圆点
                            if (!message.waveform || message.waveform.length === 0) {
                              ctx.beginPath();
                              ctx.arc(325, 50, 2, 0, 2 * Math.PI);
                              ctx.fill();
                              return;
                            }
                            // 如果只有一个数据点，显示为大圆球
                            if (message.waveform.length === 1) {
                              ctx.beginPath();
                              ctx.arc(325, 50, 10, 0, 2 * Math.PI);
                              ctx.fill();
                              return;
                            }
                            
                            const barWidth = 650 / message.waveform.length;
                            const maxHeight = 200;
                            
                            message.waveform.forEach((value, i) => {
                              const x = i * barWidth;
                              const height = Math.abs(value) * maxHeight;
                              const y = 50 - height / 2;
                              const barX = x + barWidth * 0.3;
                              const barW = barWidth * 0.7;
                              
                              ctx.beginPath();
                              ctx.roundRect(barX, y, barW, height, 4);
                              ctx.fill();
                            });
                          }
                        }
                      }}
                    />
                  </div>
                  <span className="voice-dot"></span>
                </div>
                {contact && (
                  <div className="voice-message-avatar-right">
                    <img src={contact.avatar} alt="联系人头像" />
                    <div className="voice-avatar-mic-indicator">
                      <svg width="20" height="20" viewBox="0 0 1024 1024" fill="#1bac64" transform="scale(1.1,1.4)">
                        <path d="M512 637.1c106.5 0 193.7-87.2 193.7-193.7V257.7C705.7 151.2 618.5 64 512 64c-106.6 0-193.7 87.2-193.7 193.7v185.7c0 106.5 87.1 193.7 193.7 193.7zM834.9 403c-22.3 0-40.4 18.1-40.4 40.4 0 155.8-126.7 282.5-282.5 282.5S229.5 599.2 229.5 443.4c0-22.3-18.1-40.4-40.4-40.4s-40.4 18.1-40.4 40.4c0 183.9 137.3 336.1 314.8 359.9v108.3c0 26.6 21.8 48.4 48.4 48.4 26.6 0 48.4-21.8 48.4-48.4V803.3c177.5-23.8 314.8-176.1 314.8-359.9 0.1-22.3-17.9-40.4-40.2-40.4z" />
                      </svg>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* 发送方布局：保持原有样式 */
              <>
                <div className="voice-message-controls">
                  {myAvatar && (
                    <div className="voice-message-avatar">
                      <img src={myAvatar} alt="我的头像" />
                      <svg className="voice-avatar-mic" width="20" height="20" viewBox="0 0 1024 1024" transform="scale(1,1.2)" fill="black">
                      <path d="M512 637.1c106.5 0 193.7-87.2 193.7-193.7V257.7C705.7 151.2 618.5 64 512 64c-106.6 0-193.7 87.2-193.7 193.7v185.7c0 106.5 87.1 193.7 193.7 193.7zM834.9 403c-22.3 0-40.4 18.1-40.4 40.4 0 155.8-126.7 282.5-282.5 282.5S229.5 599.2 229.5 443.4c0-22.3-18.1-40.4-40.4-40.4s-40.4 18.1-40.4 40.4c0 183.9 137.3 336.1 314.8 359.9v108.3c0 26.6 21.8 48.4 48.4 48.4 26.6 0 48.4-21.8 48.4-48.4V803.3c177.5-23.8 314.8-176.1 314.8-359.9 0.1-22.3-17.9-40.4-40.2-40.4z" fill="#2c2c2c" />
                      </svg>
                    </div>
                  )}
                  <button className="play-btn">
                    <svg width="25" height="25" viewBox="0 0 16 16" fill="#50634f">
                      <path d="M4 2 Q4 2 4.5 2.5 L11.5 8 Q12 8.5 11.5 9 L4.5 13.5 Q4 14 3.5 13.5 L3.5 2.5 Q4 2 4.5 2.5 Z"/>
                    </svg>
                  </button>
                  <span className="voice-dot"></span>
                </div>
                <div className="voice-message-waveform">
                  <canvas 
                    width="650" 
                    height="100" 
                    className="waveform-canvas"
                    ref={(canvas) => {
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.clearRect(0, 0, 650, 100);
                          ctx.fillStyle = '#90ae90';
                          
                          // 如果没有数据点，显示小圆点
                          if (!message.waveform || message.waveform.length === 0) {
                            ctx.beginPath();
                            ctx.arc(325, 50, 2, 0, 2 * Math.PI);
                            ctx.fill();
                            return;
                          }
                          // 如果只有一个数据点，显示为大圆球
                          if (message.waveform.length === 1) {
                            ctx.beginPath();
                            ctx.arc(325, 50, 10, 0, 2 * Math.PI);
                            ctx.fill();
                            return;
                          }
                          
                          const barWidth = 650 / message.waveform.length;
                          const maxHeight = 200;
                          
                          message.waveform.forEach((value, i) => {
                            const x = i * barWidth;
                            const height = Math.abs(value) * maxHeight;
                            const y = 50 - height / 2;
                            const barX = x + barWidth * 0.3;
                            const barW = barWidth * 0.7;
                            
                            ctx.beginPath();
                            ctx.roundRect(barX, y, barW, height, 4);
                            ctx.fill();
                          });
                        }
                      }
                    }}
                  />
                </div>
              </>
            )}
          </div>
        );
      case 'file':
        return (
          <div className="message-file">
            <div className="file-icon">📎</div>
            <div className="file-info">
              <div className="file-name">{message.fileName}</div>
              <div className="file-size">{message.fileSize}</div>
            </div>
          </div>
        );
      default:
        return (
          <div className="message-row">
            {isEditing ? (
              <div className="message-edit-container">
                <textarea
                  ref={textareaRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleEditSave}
                  className="message-edit-textarea"
                  rows={1}
                />
                <div className="message-edit-actions">
                  <button 
                    className="edit-save-btn"
                    onClick={handleEditSave}
                    title="保存 (Enter)"
                  >
                    ✓
                  </button>
                  <button 
                    className="edit-cancel-btn"
                    onClick={handleEditCancel}
                    title="取消 (Esc)"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span 
                  className={`message-text ${message.sender === 'me' && message.type === 'text' ? 'editable' : ''}`}
                  onClick={handleEditStart}
                  title={message.sender === 'me' && message.type === 'text' ? '点击编辑消息' : ''}
                >
                  {message.text}
                </span>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                  {renderReadReceipts()}
                </div>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`message-container ${message.sender === 'me' ? 'my-message' : 'other-message'}`}>
      <div className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}>
        {showTail && (
          message.sender === 'me'
            ? <span className="bubble-tail bubble-tail-right" />
            : <span className="bubble-tail bubble-tail-left" />
        )}
        {renderMessageContent()}
        {message.type === 'voice-message' && (
          <div className={`voice-message-time ${message.sender !== 'me' ? 'voice-time-received' : ''}`}>
            {message.duration && (
              <span className="voice-duration">{formatDuration(message.duration)}</span>
            )}
            {formatTime(message.timestamp)}
            {message.sender === 'me' && renderReadReceipts()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 