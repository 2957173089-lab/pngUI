import { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import InputPanel from '../components/InputPanel';
import PreviewPanel from '../components/PreviewPanel';
import HistoryDrawer from '../components/HistoryDrawer';
import SettingsModal from '../components/SettingsModal';
import { useStore } from '../store/useStore';

export default function WorkspacePage() {
  const showSettings = useStore((s) => s.showSettings);
  const setShowSettings = useStore((s) => s.setShowSettings);
  const apiKey = useStore((s) => s.apiKey);
  const hasAutoOpened = useRef(false);

  // ─── 首次进入 + 未配置 API Key → 自动弹出配置面板 ───
  useEffect(() => {
    if (!hasAutoOpened.current && !apiKey.trim()) {
      const timer = setTimeout(() => {
        setShowSettings(true);
        hasAutoOpened.current = true;
      }, 800); // 延迟 800ms，让页面先渲染出来
      return () => clearTimeout(timer);
    }
    hasAutoOpened.current = true;
  }, [apiKey, setShowSettings]);

  return (
    <div className="bg-app h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Input Panel */}
        <div className="relative z-10 border-r border-white/30 bg-white/30 backdrop-blur-xl">
          <InputPanel />
        </div>
        {/* Right: Preview Panel */}
        <PreviewPanel />
      </div>
      <HistoryDrawer />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
