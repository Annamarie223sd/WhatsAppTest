import React, { useState, useRef } from 'react';
import { Contact } from '../types';
import { Upload, X, Crop, User, Edit3 } from 'lucide-react';

interface ContactEditorProps {
  contact: Contact;
  onContactUpdate: (contact: Contact) => void;
  myAvatar?: string;
  onMyAvatarUpdate?: (avatar: string) => void;
}

const ContactEditor: React.FC<ContactEditorProps> = ({ contact, onContactUpdate, myAvatar, onMyAvatarUpdate }) => {
  const [contactName, setContactName] = useState(contact.name);
  const [customStatus, setCustomStatus] = useState(contact.customStatus || '点击此处以查看联系人信息');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(contact.avatar);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  
  // 我的头像状态
  const [myAvatarFile, setMyAvatarFile] = useState<File | null>(null);
  const [myAvatarPreview, setMyAvatarPreview] = useState<string>(myAvatar || '/default-avatar.jpg');
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const myAvatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('请选择图片文件！');
      }
    }
  };

  const handleMyAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setMyAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          const avatarUrl = e.target?.result as string;
          setMyAvatarPreview(avatarUrl);
          if (onMyAvatarUpdate) {
            onMyAvatarUpdate(avatarUrl);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert('请选择图片文件！');
      }
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('/匿名.png');
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  const removeMyAvatar = () => {
    setMyAvatarFile(null);
    setMyAvatarPreview('/default-avatar.jpg');
    if (myAvatarInputRef.current) {
      myAvatarInputRef.current.value = '';
    }
    if (onMyAvatarUpdate) {
      onMyAvatarUpdate('/default-avatar.jpg');
    }
  };

  const saveContact = () => {
    const updatedContact: Contact = {
      ...contact,
      name: contactName,
      customStatus: customStatus,
      avatar: avatarPreview,
      avatarFile: avatarFile || undefined
    };
    onContactUpdate(updatedContact);
  };

  const handleNameEdit = () => {
    if (isEditingName) {
      saveContact();
    }
    setIsEditingName(!isEditingName);
  };

  const handleStatusEdit = () => {
    if (isEditingStatus) {
      saveContact();
    }
    setIsEditingStatus(!isEditingStatus);
  };

  return (
    <div className="contact-editor">
      <h3>联系人信息设置</h3>
      
      {/* 联系人头像上传区域 */}
      <div className="avatar-upload-section">
        <h4>联系人头像</h4>
        <div className="avatar-preview">
          <img src={avatarPreview} alt="联系人头像" />
          <div className="avatar-overlay">
            <button 
              className="avatar-upload-btn"
              onClick={() => avatarInputRef.current?.click()}
            >
              <Upload size={16} />
            </button>
            {avatarFile && (
              <button 
                className="avatar-remove-btn"
                onClick={removeAvatar}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          style={{ display: 'none' }}
        />
        <p className="avatar-hint">点击头像上传新图片</p>
      </div>

      {/* 我的头像上传区域 */}
      <div className="avatar-upload-section">
        <h4>我的头像</h4>
        <div className="avatar-preview">
          <img src={myAvatarPreview} alt="我的头像" />
          <div className="avatar-overlay">
            <button 
              className="avatar-upload-btn"
              onClick={() => myAvatarInputRef.current?.click()}
            >
              <Upload size={16} />
            </button>
            {myAvatarFile && (
              <button 
                className="avatar-remove-btn"
                onClick={removeMyAvatar}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <input
          ref={myAvatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleMyAvatarUpload}
          style={{ display: 'none' }}
        />
        <p className="avatar-hint">点击头像上传新图片</p>
      </div>

      {/* 联系人姓名编辑 */}
      <div className="contact-field">
        <label>
          <User size={16} />
          联系人姓名
        </label>
        <div className="editable-field">
          {isEditingName ? (
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              onBlur={handleNameEdit}
              onKeyPress={(e) => e.key === 'Enter' && handleNameEdit()}
              autoFocus
            />
          ) : (
            <div className="field-display" onClick={handleNameEdit}>
              <span>{contactName}</span>
              <Edit3 size={14} />
            </div>
          )}
        </div>
      </div>

      {/* 联系人状态编辑 */}
      <div className="contact-field">
        <label>
          <User size={16} />
          联系人状态
        </label>
        <div className="editable-field">
          {isEditingStatus ? (
            <input
              type="text"
              value={customStatus}
              onChange={(e) => setCustomStatus(e.target.value)}
              onBlur={handleStatusEdit}
              onKeyPress={(e) => e.key === 'Enter' && handleStatusEdit()}
              autoFocus
            />
          ) : (
            <div className="field-display" onClick={handleStatusEdit}>
              <span>{customStatus}</span>
              <Edit3 size={14} />
            </div>
          )}
        </div>
      </div>

      {/* 保存按钮 */}
      <button className="save-contact-btn" onClick={saveContact}>
        保存联系人信息
      </button>
    </div>
  );
};

export default ContactEditor; 