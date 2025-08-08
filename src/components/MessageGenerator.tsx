import React, { useState, useRef } from 'react';
import { Message } from '../types';
import { Plus, Image, File, Send, Upload, X, Phone } from 'lucide-react';

interface MessageGeneratorProps {
  onSendMessage: (message: Message) => void;
}

const MessageGenerator: React.FC<MessageGeneratorProps> = ({ onSendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'image' | 'file' | 'voice-call' | 'voice-message'>('text');
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [sender, setSender] = useState<'me' | 'other'>('me');
  const [messageTime, setMessageTime] = useState<string>('');
  const [voiceMinutes, setVoiceMinutes] = useState('');
  const [voiceSeconds, setVoiceSeconds] = useState('');
  const [voiceMessageMinutes, setVoiceMessageMinutes] = useState('');
  const [voiceMessageSeconds, setVoiceMessageSeconds] = useState('');
  const [amplitude, setAmplitude] = useState(0.5);
  const [frequency, setFrequency] = useState(5);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateMessage = () => {
    const message: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender, // 用选择的 sender
      timestamp: messageTime ? new Date(messageTime) : new Date(),
      type: messageType,
      imageUrl: messageType === 'image' ? (imagePreview || imageUrl || '/匿名.png') : undefined,
      fileName: messageType === 'file' ? (uploadedFile?.name || fileName) : undefined,
      fileSize: messageType === 'file' ? (uploadedFile ? formatFileSize(uploadedFile.size) : fileSize) : undefined,
      status: sender === 'me' ? 'read' : undefined, // 自己发送的消息默认已读
    };

    onSendMessage(message);
    
    // 重置表单
    setMessageText('');
    setImageUrl('');
    setFileName('');
    setFileSize('');
    setMessageType('text');
    setUploadedImage(null);
    setUploadedFile(null);
    setImagePreview('');
    setMessageTime('');
  };

  const generateRandomMessage = () => {
    const randomTexts = [
      '你好！',
      '今天天气怎么样？',
      '在忙什么呢？',
      '晚上一起吃饭吗？',
      '这个项目进展如何？',
      '周末有什么计划？',
      '最近工作还顺利吗？',
      '记得按时吃饭哦！',
      '明天见！',
      '谢谢你的帮助！'
    ];

    const randomSender = Math.random() > 0.5 ? 'me' : 'other';
    const randomMessage: Message = {
      id: Date.now().toString(),
      text: randomTexts[Math.floor(Math.random() * randomTexts.length)],
      sender: randomSender,
      timestamp: new Date(),
      type: 'text',
      status: randomSender === 'me' ? 'read' : undefined, // 自己发送的消息默认已读
    };

    onSendMessage(randomMessage);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('请选择图片文件！');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setFileName(file.name);
      setFileSize(formatFileSize(file.size));
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setImagePreview('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="message-generator">
      <div className="generator-tabs">
        <button 
          className={`tab ${messageType === 'text' ? 'active' : ''}`}
          onClick={() => setMessageType('text')}
        >
          文本消息
        </button>
        <button 
          className={`tab ${messageType === 'image' ? 'active' : ''}`}
          onClick={() => setMessageType('image')}
        >
          图片消息
        </button>
        <button 
          className={`tab ${messageType === 'file' ? 'active' : ''}`}
          onClick={() => setMessageType('file')}
        >
          文件消息
        </button>
        <button 
          className={`tab ${messageType === 'voice-call' ? 'active' : ''}`}
          onClick={() => setMessageType('voice-call')}
        >
          <Phone size={16} /> 语音通话
        </button>
        <button 
          className={`tab ${messageType === 'voice-message' ? 'active' : ''}`}
          onClick={() => setMessageType('voice-message')}
        >
          语音消息
        </button>
      </div>

      <div className="generator-content">
        <div className="sender-select" style={{marginBottom: '8px'}}>
          <label style={{marginRight: '12px'}}>
            <input type="radio" value="me" checked={sender === 'me'} onChange={() => setSender('me')} /> 我
          </label>
          <label>
            <input type="radio" value="other" checked={sender === 'other'} onChange={() => setSender('other')} /> 他
          </label>
        </div>

        {messageType === 'text' && (
          <div className="text-input">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="输入消息内容..."
              rows={3}
            />
          </div>
        )}

        {messageType === 'image' && (
          <div className="image-input">
            <div className="upload-section">
              <button 
                type="button" 
                className="upload-btn"
                onClick={() => imageInputRef.current?.click()}
              >
                <Upload size={16} />
                上传图片
              </button>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="或输入图片URL"
              />
            </div>
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="预览" />
                <button 
                  className="remove-btn"
                  onClick={removeUploadedImage}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="图片说明（可选）..."
              rows={2}
            />
          </div>
        )}

        {messageType === 'file' && (
          <div className="file-input">
            <div className="upload-section">
              <button 
                type="button" 
                className="upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={16} />
                上传文件
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
            
            {uploadedFile && (
              <div className="file-preview">
                <div className="file-info">
                  <File size={20} />
                  <span>{uploadedFile.name}</span>
                  <span className="file-size">{formatFileSize(uploadedFile.size)}</span>
                </div>
                <button 
                  className="remove-btn"
                  onClick={removeUploadedFile}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            {!uploadedFile && (
              <>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="文件名"
                />
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="文件大小（如：2.5 MB）"
                />
              </>
            )}
            
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="文件说明（可选）..."
              rows={2}
            />
          </div>
        )}

        {messageType === 'voice-call' && (
          <div className="voice-call-input">
            <div style={{marginBottom: '8px'}}>语音通话内容（可自定义）：</div>
            <input
              type="text"
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder="语音通话"
              style={{marginBottom: '8px', width: '100%'}}
            />
            <div style={{marginBottom: '8px'}}>通话时长：</div>
            <div style={{display: 'flex', gap: 8, marginBottom: '8px'}}>
              <input
                type="number"
                min="0"
                value={voiceMinutes}
                onChange={e => setVoiceMinutes(e.target.value)}
                placeholder="分钟"
                style={{width: '60px'}}
              />
              <span style={{lineHeight: '32px'}}>分</span>
              <input
                type="number"
                min="0"
                value={voiceSeconds}
                onChange={e => setVoiceSeconds(e.target.value)}
                placeholder="秒"
                style={{width: '60px'}}
              />
              <span style={{lineHeight: '32px'}}>秒</span>
            </div>
            <div style={{marginBottom: '8px'}}>通话时间：</div>
            <input
              type="datetime-local"
              value={messageTime}
              onChange={e => setMessageTime(e.target.value)}
              style={{marginBottom: '8px', width: '100%'}}
            />
          </div>
        )}

        {messageType === 'voice-message' && (
          <div className="voice-message-input">
            <div style={{marginBottom: '8px'}}>语音消息时长：</div>
            <div style={{display: 'flex', gap: 8, marginBottom: '12px'}}>
              <input
                type="number"
                min="0"
                max="59"
                value={voiceMessageMinutes}
                onChange={e => setVoiceMessageMinutes(e.target.value)}
                placeholder="分钟"
                style={{width: '60px'}}
              />
              <span style={{lineHeight: '32px'}}>分</span>
              <input
                type="number"
                min="0"
                max="59"
                value={voiceMessageSeconds}
                onChange={e => setVoiceMessageSeconds(e.target.value)}
                placeholder="秒"
                style={{width: '60px'}}
              />
              <span style={{lineHeight: '32px'}}>秒</span>
            </div>
            
            <div style={{marginBottom: '8px'}}>振幅 (0.1-1.0)：</div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={amplitude}
              onChange={e => setAmplitude(parseFloat(e.target.value))}
              style={{marginBottom: '8px', width: '100%'}}
            />
            <div style={{fontSize: '12px', color: '#666', marginBottom: '12px'}}>当前值: {amplitude}</div>
            
            <div style={{marginBottom: '8px'}}>频率 (1-10)：</div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={frequency}
              onChange={e => setFrequency(parseInt(e.target.value))}
              style={{marginBottom: '8px', width: '100%'}}
            />
            <div style={{fontSize: '12px', color: '#666', marginBottom: '12px'}}>当前值: {frequency}</div>
          </div>
        )}

        <div className="time-select" style={{marginBottom: '8px'}}>
          <label>消息时间：</label>
          <input
            type="datetime-local"
            value={messageTime}
            onChange={e => setMessageTime(e.target.value)}
            style={{marginLeft: '8px'}}
          />
        </div>

        <div className="generator-actions">
          <button className="random-btn" onClick={generateRandomMessage}>
            <Plus size={16} />
            生成随机消息
          </button>
          <button className="send-btn" onClick={() => {
            if (messageType === 'voice-call') {
              let subTitle = '';
              if (voiceMinutes && voiceSeconds) {
                subTitle = `${voiceMinutes}分${voiceSeconds}秒`;
              } else if (voiceMinutes) {
                subTitle = `${voiceMinutes}分`;
              } else if (voiceSeconds) {
                subTitle = `${voiceSeconds}秒`;
              }
              const message: Message = {
                id: Date.now().toString(),
                text: messageText || '语音通话',
                sender,
                timestamp: messageTime ? new Date(messageTime) : new Date(),
                type: 'voice-call',
                status: sender === 'me' ? 'read' : undefined,
                subTitle,
              };
              onSendMessage(message);
              setMessageText('');
              setMessageTime('');
              setVoiceMinutes('');
              setVoiceSeconds('');
              setMessageType('text');
              return;
            }
            
            if (messageType === 'voice-message') {
              // 计算总时长（秒）
              const minutes = parseInt(voiceMessageMinutes) || 0;
              const seconds = parseInt(voiceMessageSeconds) || 0;
              const duration = minutes * 60 + seconds;
              
              if (duration <= 0) {
                alert('请输入语音消息时长！');
                return;
              }
              const points = Math.floor(10 * 4); // 增加到80个点，生成更多条形
              
              // 高级随机波形生成算法
              const waveform = Array.from({ length: points }, (_, i) => {
                // 使用更多随机种子来增加复杂性
                const seed1 = Math.sin(i * 0.5 + Date.now() * 0.001 + Math.random() * 100);
                const seed2 = Math.cos(i * 0.3 + Date.now() * 0.002 + Math.random() * 200);
                const seed3 = Math.random();
                const seed4 = Math.random();
                const seed5 = Math.random();
                
                // 创建更多随机模式
                const patterns = [
                  // 正弦波模式 - 随机频率
                  Math.abs(Math.sin(i * (0.5 + seed3 * 2) + seed1)) * (0.3 + seed4 * 0.7),
                  // 余弦波模式 - 随机频率
                  Math.abs(Math.cos(i * (0.8 + seed4 * 3) + seed2)) * (0.2 + seed5 * 0.8),
                  // 随机噪声模式 - 更大范围
                  seed3 * (0.1 + seed4 * 0.9),
                  // 脉冲模式 - 随机阈值
                  seed3 > (0.3 + seed4 * 0.4) ? (0.5 + seed5 * 0.5) : (0.1 + seed3 * 0.3),
                  // 渐变模式 - 随机方向
                  seed4 > 0.5 ? (i / points) * (0.5 + seed3 * 0.5) + 0.1 : (1 - i / points) * (0.4 + seed4 * 0.6) + 0.2,
                  // 反向渐变模式 - 随机方向
                  seed5 > 0.5 ? (1 - i / points) * (0.3 + seed3 * 0.7) + 0.1 : (i / points) * (0.6 + seed4 * 0.4) + 0.1,
                  // 完全随机模式
                  Math.random() * (0.2 + seed3 * 0.8),
                  // 指数模式
                  Math.pow(seed3, seed4) * (0.3 + seed5 * 0.7),
                  // 对数模式
                  Math.log(1 + seed3 * 9) * (0.2 + seed4 * 0.8),
                  // 三角函数混合模式
                  (Math.sin(i * seed3 * 5) + Math.cos(i * seed4 * 3)) * 0.5 * (0.3 + seed5 * 0.7),
                ];
                
                // 随机选择多个模式并混合
                const selectedPatterns = [];
                for (let j = 0; j < 3; j++) {
                  const patternIndex = Math.floor(Math.random() * patterns.length);
                  selectedPatterns.push(patterns[patternIndex]);
                }
                
                // 混合选中的模式
                const selectedPattern = selectedPatterns.reduce((sum, pattern) => sum + pattern, 0) / selectedPatterns.length;
                
                // 添加大量随机变化
                const randomNoise = (Math.random() - 0.5) * 0.8;
                const timeBasedVariation = Math.sin(Date.now() * 0.01 + i * 0.1 + Math.random() * 10) * 0.4;
                const positionBasedVariation = Math.cos(i * 0.2 + Math.random() * 5) * 0.3;
                const extraRandomness = (Math.random() - 0.5) * 0.6;
                
                // 混合所有变化
                let finalValue = selectedPattern + randomNoise + timeBasedVariation + positionBasedVariation + extraRandomness;
                
                // 确保值在合理范围内
                finalValue = Math.max(0.05, Math.min(1.0, finalValue));
                
                // 应用振幅设置
                return finalValue * amplitude;
              });
              
              const message: Message = {
                id: Date.now().toString(),
                text: `语音消息 (${duration}秒)`,
                sender,
                timestamp: messageTime ? new Date(messageTime) : new Date(),
                type: 'voice-message',
                status: sender === 'me' ? 'read' : undefined,
                duration,
                waveform,
                amplitude,
                frequency,
                isPlaying: false,
              };
              onSendMessage(message);
              setVoiceMessageMinutes('');
              setVoiceMessageSeconds('');
              setAmplitude(0.5);
              setFrequency(5);
              setMessageTime('');
              setMessageType('text');
              return;
            }
            
            generateMessage();
          }}>
            <Send size={16} />
            发送消息
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator; 