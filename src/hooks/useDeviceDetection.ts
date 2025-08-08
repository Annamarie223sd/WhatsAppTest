import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  deviceType: 'phone' | 'tablet' | 'desktop';
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    screenWidth: 0,
    screenHeight: 0,
    orientation: 'portrait',
    deviceType: 'desktop'
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      // 确保在客户端环境下运行
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      // 设备类型判断
      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;
      let deviceType: 'phone' | 'tablet' | 'desktop' = 'desktop';

      // 手机设备判断（包括屏幕尺寸和用户代理）
      const isMobileBySize = width <= 768;
      const isMobileByAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobileBySize || isMobileByAgent) {
        if (width <= 480) {
          isMobile = true;
          deviceType = 'phone';
        } else if (width <= 768) {
          isTablet = true;
          deviceType = 'tablet';
        } else {
          isDesktop = true;
          deviceType = 'desktop';
        }
      } else {
        isDesktop = true;
        deviceType = 'desktop';
      }

      const newDeviceInfo: DeviceInfo = {
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        orientation: orientation as 'portrait' | 'landscape',
        deviceType
      };
      
      setDeviceInfo(newDeviceInfo);
    };

    // 延迟初始化，确保DOM完全加载
    const timer = setTimeout(() => {
      updateDeviceInfo();
    }, 100);

    // 监听窗口大小变化
    window.addEventListener('resize', updateDeviceInfo);
    
    // 监听设备方向变化
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}; 