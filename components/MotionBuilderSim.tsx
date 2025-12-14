import React from 'react';
import { Activity, Wifi, Play, Pause, User, Settings, Link } from 'lucide-react';

interface Props {
  isStreaming: boolean;
  isConnected: boolean;
  onConnect: () => void;
  onDriveCharacter: () => void;
  characterDriven: boolean;
  scenario: string;
}

const MotionBuilderSim: React.FC<Props> = ({ 
  isStreaming, 
  isConnected, 
  onConnect, 
  onDriveCharacter,
  characterDriven,
  scenario
}) => {
  return (
    <div className="w-full h-full bg-[#1e1e1e] flex flex-col font-mono text-xs text-gray-400 border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
      {/* MB Header */}
      <div className="bg-[#2d2d2d] h-8 flex items-center px-4 justify-between border-b border-gray-700">
        <span className="font-bold text-gray-200">MotionBuilder 2025 - [未命名场景]</span>
        <div className="flex gap-2">
           <div className="w-3 h-3 rounded-full bg-red-500"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
           <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* MB Sidebar */}
        <div className="w-48 bg-[#252526] border-r border-gray-700 p-2 flex flex-col gap-2">
          <div className="uppercase font-bold text-gray-500 mb-1">导航器 (Navigator)</div>
          
          <div className="p-2 bg-[#333] rounded hover:bg-[#444] cursor-pointer">
             <div className="flex items-center gap-2 text-white">
                <User size={14} /> 角色骨骼 (Character)
             </div>
          </div>

          <div className="p-2 bg-[#333] rounded mt-4">
             <div className="flex items-center gap-2 mb-2 text-orange-400">
                <Wifi size={14} /> 设备 (Devices)
             </div>
             
             <div className="flex flex-col gap-2 pl-2">
                <div className="flex justify-between items-center">
                   <span>状态:</span>
                   <span className={isConnected ? "text-green-400" : "text-red-400"}>
                     {isConnected ? "在线 (Online)" : "离线 (Offline)"}
                   </span>
                </div>
                {isStreaming && !isConnected && (
                  <button 
                    onClick={onConnect}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500 transition"
                  >
                    连接数据源
                  </button>
                )}
                {isConnected && !characterDriven && (
                   <button 
                   onClick={onDriveCharacter}
                   className="bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-500 transition mt-2"
                 >
                   映射到角色 (Map)
                 </button>
                )}
             </div>
          </div>
        </div>

        {/* MB Viewport */}
        <div className="flex-1 bg-[#111] relative overflow-hidden flex items-center justify-center">
          {/* Grid Floor */}
          <div className="absolute inset-0 grid-bg opacity-30 transform perspective-1000 rotate-x-60"></div>

          {/* Character */}
          <div className={`transition-all duration-700 ${characterDriven ? 'opacity-100' : 'opacity-40 grayscale'}`}>
             <div className={`relative w-32 h-64 ${characterDriven ? 'animate-bounce' : ''}`}>
                 {/* Simple CSS Character */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full"></div> {/* Head */}
                 <div className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-24 bg-blue-600 rounded"></div> {/* Torso */}
                 <div className="absolute top-8 left-1/2 -translate-x-1/2 -ml-8 w-4 h-24 bg-blue-400 rounded origin-top rotate-12"></div> {/* L Arm */}
                 <div className="absolute top-8 left-1/2 -translate-x-1/2 ml-8 w-4 h-24 bg-blue-400 rounded origin-top -rotate-12"></div> {/* R Arm */}
                 <div className="absolute top-32 left-1/2 -translate-x-1/2 -ml-4 w-6 h-32 bg-blue-700 rounded origin-top -rotate-6"></div> {/* L Leg */}
                 <div className="absolute top-32 left-1/2 -translate-x-1/2 ml-4 w-6 h-32 bg-blue-700 rounded origin-top rotate-6"></div> {/* R Leg */}
             </div>
          </div>
          
          <div className="absolute bottom-4 right-4 text-xs text-gray-600">
             FPS: {characterDriven ? '59.94' : '0.00'} | Stream: {isStreaming ? '接收中' : '无数据'}
          </div>
        </div>
      </div>
      
      {/* MB Timeline */}
      <div className="h-12 bg-[#2d2d2d] border-t border-gray-700 flex items-center px-4 gap-4">
         <Play size={16} className="text-gray-400 hover:text-white cursor-pointer" />
         <Pause size={16} className="text-gray-400 hover:text-white cursor-pointer" />
         <div className="flex-1 h-2 bg-[#111] rounded relative">
            <div className={`absolute top-0 left-0 h-full bg-orange-500 w-1/3 ${characterDriven ? 'animate-[width_2s_linear_infinite]' : ''}`}></div>
         </div>
      </div>
    </div>
  );
};

export default MotionBuilderSim;