import Navbar from '../components/Navbar';
import InputPanel from '../components/InputPanel';
import PreviewPanel from '../components/PreviewPanel';
import HistoryDrawer from '../components/HistoryDrawer';

export default function WorkspacePage() {
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
    </div>
  );
}
