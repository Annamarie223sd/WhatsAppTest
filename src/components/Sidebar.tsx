import React, { useState, useEffect, useRef } from 'react';
import { Download, Settings, Trash2, X, User } from 'lucide-react';
import MessageGenerator from './MessageGenerator';
import ContactEditor from './ContactEditor';
import { Message, Contact } from '../types';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface SidebarProps {
  onSendMessage: (message: Message) => void;
  onGenerateSampleChat: () => void;
  onExportChat: () => void;
  onClearChat: () => void;
  onContactUpdate: (contact: Contact) => void;
  contact: Contact;
  onToggleReady?: (controls: { showToggle: () => void }) => void;
  myAvatar?: string;
  onMyAvatarUpdate?: (avatar: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSendMessage,
  onGenerateSampleChat,
  onExportChat,
  onClearChat,
  onContactUpdate,
  contact,
  onToggleReady,
  myAvatar,
  onMyAvatarUpdate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showToggle, setShowToggle] = useState(true);
  const [togglePosition, setTogglePosition] = useState({ x: window.innerWidth - 70, y: 20 }); // 调整到右上角
  const [isDragging, setIsDragging] = useState(false);
  const [showHideZones, setShowHideZones] = useState(false);
  const [activeTab, setActiveTab] = useState<'generator' | 'contact'>('generator');
  const toggleRef = useRef<HTMLButtonElement>(null);
  const deviceInfo = useDeviceDetection();
  const [showVoiceCallModal, setShowVoiceCallModal] = useState(false);
  const [voiceCallTime, setVoiceCallTime] = useState('');

  useEffect(() => {
    // 桌面端默认显示侧边栏
    if (deviceInfo.isDesktop) {
      setIsOpen(true);
      setShowToggle(false); // 桌面端隐藏齿轮按钮
    } else {
      setIsOpen(false);
      setShowToggle(true); // 移动端显示齿轮按钮
    }
  }, [deviceInfo.isDesktop]);

  // 暴露控制函数给父组件
  useEffect(() => {
    if (onToggleReady) {
      onToggleReady({
        showToggle: () => {
          setShowToggle(true);
        }
      });
    }
  }, [onToggleReady]);

  // 添加调试信息
  useEffect(() => {
    // 移除调试信息
  }, [showToggle, isOpen, deviceInfo]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const diffX = startX - currentX;
      
      if (diffX > 50) { // 向左滑动超过50px
        setIsOpen(false);
      } else if (diffX < -50) { // 向右滑动超过50px
        setIsOpen(true);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  // 检查是否在隐藏区域内
  const checkHideZone = (x: number, y: number) => {
    const screenWidth = window.innerWidth;
    const hideZoneWidth = 40; // 减小隐藏区域宽度从80px到40px
    
    // 左侧隐藏区域
    if (x <= hideZoneWidth) {
      return 'left';
    }
    
    // 右侧隐藏区域
    if (x >= screenWidth - hideZoneWidth - 50) { // 减去齿轮按钮宽度
      return 'right';
    }
    
    return null;
  };

  // 齿轮按钮拖动功能
  const handleToggleMouseDown = (e: React.MouseEvent) => {
    if (deviceInfo.isDesktop) return;
    
    e.preventDefault(); // 防止触发点击事件
    setIsDragging(true);
    setShowHideZones(true);
    const startX = e.clientX - togglePosition.x;
    const startY = e.clientY - togglePosition.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - startX;
      const newY = e.clientY - startY;
      
      // 限制在屏幕范围内
      const maxX = window.innerWidth - 50;
      const maxY = window.innerHeight - 50;
      
      const clampedX = Math.max(0, Math.min(newX, maxX));
      const clampedY = Math.max(0, Math.min(newY, maxY));
      
      setTogglePosition({
        x: clampedX,
        y: clampedY
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      setShowHideZones(false);
      
      // 使用鼠标释放时的位置检查隐藏区域
      const finalX = e.clientX - startX;
      const finalY = e.clientY - startY;
      const maxX = window.innerWidth - 50;
      const maxY = window.innerHeight - 50;
      const clampedX = Math.max(0, Math.min(finalX, maxX));
      const clampedY = Math.max(0, Math.min(finalY, maxY));
      
      // 检查是否在隐藏区域
      const hideZone = checkHideZone(clampedX, clampedY);
      
      if (hideZone) {
        setShowToggle(false);
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 齿轮按钮触摸拖动功能
  const handleToggleTouchStart = (e: React.TouchEvent) => {
    if (deviceInfo.isDesktop) return;
    
    // 移除preventDefault，改用其他方式防止点击事件
    setIsDragging(true);
    setShowHideZones(true);
    const touch = e.touches[0];
    const startX = touch.clientX - togglePosition.x;
    const startY = touch.clientY - togglePosition.y;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const newX = touch.clientX - startX;
      const newY = touch.clientY - startY;
      
      // 限制在屏幕范围内
      const maxX = window.innerWidth - 50;
      const maxY = window.innerHeight - 50;
      
      const clampedX = Math.max(0, Math.min(newX, maxX));
      const clampedY = Math.max(0, Math.min(newY, maxY));
      
      setTogglePosition({
        x: clampedX,
        y: clampedY
      });
    };

    const handleTouchEnd = (e: TouchEvent) => {
      setIsDragging(false);
      setShowHideZones(false);
      
      // 使用触摸结束时的位置检查隐藏区域
      const touch = e.changedTouches[0];
      const finalX = touch.clientX - startX;
      const finalY = touch.clientY - startY;
      const maxX = window.innerWidth - 50;
      const maxY = window.innerHeight - 50;
      const clampedX = Math.max(0, Math.min(finalX, maxX));
      const clampedY = Math.max(0, Math.min(finalY, maxY));
      
      // 检查是否在隐藏区域
      const hideZone = checkHideZone(clampedX, clampedY);
      
      if (hideZone) {
        setShowToggle(false);
      }
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const toggleSidebar = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
    }
  };

  const handleSendVoiceCall = () => {
    setShowVoiceCallModal(true);
    setVoiceCallTime('');
  };

  const handleVoiceCallConfirm = () => {
    const message: Message = {
      id: Date.now().toString(),
      text: '你已发起语音通话',
      sender: 'me',
      timestamp: voiceCallTime ? new Date(voiceCallTime) : new Date(),
      type: 'voice-call',
      status: 'read',
    };
    onSendMessage(message);
    setShowVoiceCallModal(false);
  };

  // 桌面端显示
  if (deviceInfo.isDesktop) {
    return (
      <div className="sidebar desktop-sidebar">
        <div className="sidebar-header">
          <h2>聊天记录生成器</h2>
          <p>创建和编辑WhatsApp聊天记录</p>
        </div>

        <div className="sidebar-tabs">
          <button 
            className={`sidebar-tab ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            <Settings size={16} />
            消息生成
          </button>
          <button 
            className={`sidebar-tab ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <User size={16} />
            联系人设置
          </button>
        </div>

        <div className="sidebar-actions">
          <button className="action-button" onClick={onGenerateSampleChat}>
            <Settings size={16} />
            生成示例聊天
          </button>
          <button className="action-button" onClick={onExportChat}>
            <Download size={16} />
            导出聊天记录
          </button>
          <button className="action-button danger" onClick={onClearChat}>
            <Trash2 size={16} />
            清空聊天记录
          </button>
          <button className="action-button" onClick={handleSendVoiceCall}>
            发送语音通话消息
          </button>
        </div>

        <div className="sidebar-content">
          {activeTab === 'generator' && (
            <MessageGenerator onSendMessage={onSendMessage} />
          )}
          {activeTab === 'contact' && (
            <ContactEditor 
              contact={contact} 
              onContactUpdate={onContactUpdate}
              myAvatar={myAvatar}
              onMyAvatarUpdate={onMyAvatarUpdate}
            />
          )}
        </div>
      </div>
    );
  }

  // 移动端显示
  return (
    <>
      {/* 隐藏区域指示器 */}
      {showHideZones && (
        <>
          <div className="hide-zone left-hide-zone">
            <div className="hide-zone-content">
              <Settings size={24} />
              <span>隐藏</span>
            </div>
          </div>
          <div className="hide-zone right-hide-zone">
            <div className="hide-zone-content">
              <Settings size={24} />
              <span>隐藏</span>
            </div>
          </div>
        </>
      )}
      
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* 移动端侧边栏 */}
      <div 
        className={`sidebar mobile-sidebar ${isOpen ? 'open' : ''}`}
        onTouchStart={handleTouchStart}
      >
        <div className="sidebar-header">
          <div className="sidebar-header-content">
            <h2>聊天记录生成器</h2>
            <p>创建和编辑WhatsApp聊天记录</p>
          </div>
          <button 
            className="close-sidebar-btn"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-tabs">
          <button 
            className={`sidebar-tab ${activeTab === 'generator' ? 'active' : ''}`}
            onClick={() => setActiveTab('generator')}
          >
            <Settings size={16} />
            消息生成
          </button>
          <button 
            className={`sidebar-tab ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <User size={16} />
            联系人设置
          </button>
        </div>

        <div className="sidebar-actions">
          <button className="action-button" onClick={onGenerateSampleChat}>
            <Settings size={16} />
            生成示例聊天
          </button>
          <button className="action-button" onClick={onExportChat}>
            <Download size={16} />
            导出聊天记录
          </button>
          <button className="action-button danger" onClick={onClearChat}>
            <Trash2 size={16} />
            清空聊天记录
          </button> 
        </div>

        <div className="sidebar-content">
          {activeTab === 'generator' && (
            <MessageGenerator onSendMessage={onSendMessage} />
          )}
          {activeTab === 'contact' && (
            <ContactEditor 
              contact={contact} 
              onContactUpdate={onContactUpdate}
              myAvatar={myAvatar}
              onMyAvatarUpdate={onMyAvatarUpdate}
            />
          )}
        </div>
      </div>
      
      {/* 可拖动的齿轮按钮 */}
      {showToggle && (
        <button 
          ref={toggleRef}
          className={`sidebar-toggle ${isDragging ? 'dragging' : ''}`}
          style={{
            left: `${togglePosition.x}px`,
            top: `${togglePosition.y}px`
          }}
          onClick={toggleSidebar}
          onMouseDown={handleToggleMouseDown}
          onTouchStart={handleToggleTouchStart}
        >
          <Settings size={20} />
        </button>
      )}
      {/* 语音通话时间选择弹窗 */}
      {showVoiceCallModal && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 260 }}>
            <div style={{ marginBottom: 12 }}>选择语音通话时间：</div>
            <input
              type="datetime-local"
              value={voiceCallTime}
              onChange={e => setVoiceCallTime(e.target.value)}
              style={{ marginBottom: 16, width: '100%' }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowVoiceCallModal(false)}>取消</button>
              <button onClick={handleVoiceCallConfirm} disabled={!voiceCallTime}>确定</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar; 