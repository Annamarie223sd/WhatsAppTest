export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'voice-call' | 'voice-message';
  imageUrl?: string;
  fileName?: string;
  fileSize?: string;
  status?: 'sent' | 'delivered' | 'read'; // 消息状态：已发送、已送达、已读
  subTitle?: string; // 语音通话时长或状态
  minutes?: number; // 语音通话分钟数
  seconds?: number; // 语音通话秒数
  duration?: number; // 语音消息时长（秒）
  waveform?: number[]; // 波形数据
  amplitude?: number; // 振幅 (0.1-1.0)
  frequency?: number; // 频率/周期 (1-10)
  isPlaying?: boolean; // 播放状态
  isEditing?: boolean; // 是否正在编辑
  originalText?: string; // 编辑前的原始文本
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastSeen?: Date;
  customStatus?: string; // 自定义状态信息
  avatarFile?: File; // 上传的头像文件
}

export interface ChatSettings {
  contactName: string;
  contactAvatar: string;
  myName: string;
  myAvatar: string;
  theme: 'light' | 'dark';
} 