import { Step } from './types';

export const STEPS_INFO = {
  [Step.SETUP_SUIT]: {
    title: "标记点粘贴 (Marker Placement)",
    description: "按照53点贴点标准，在演员的关键骨骼节点和肢体部位粘贴反光标记点。",
    hint: "请确保53个标记点全部正确覆盖头部、肩部、胸部、背部、手臂、手腕、骨盆、腿部及脚部。"
  },
  [Step.CALIBRATION_WAND]: {
    title: "动捕相机校准 (Camera Calibration)",
    description: "在捕捉区域内挥动T型校准手柄，通过覆盖不同高度和区域来计算摄像机的空间位置。",
    hint: "请手持校准杆在场地内均匀走动并挥舞，确保所有摄像机都能捕捉到校准杆的标记点。"
  },
  [Step.CALIBRATION_GROUND]: {
    title: "手套校准 (Glove Calibration)",
    description: "穿戴动捕手套并进行校准，确保手指动作捕捉的准确性。",
    hint: "请保持T-Pose，并按照指示依次进行张手和握拳动作以完成校准。"
  },
  [Step.SKELETON_CREATE]: {
    title: "创建骨骼 (Create Skeleton)",
    description: "让演员在场地中央保持T型姿势（T-Pose），软件将根据标记点位置解算人体骨骼模型。",
    hint: "演员必须保持绝对静止的T-Pose。点击“创建骨骼”按钮进行解算。"
  },
  [Step.DATA_RECORDING]: {
    title: "数据录制 (Data Recording)",
    description: "开始动作捕捉数据录制。确保系统处于Live模式且无标记点遮挡。",
    hint: "检查所有标记点是否清晰可见。点击录制按钮开始，完成动作后再次点击停止。"
  },
  [Step.COMPLETE]: {
    title: "训练完成 (Training Complete)",
    description: "恭喜！您已完成所有动作捕捉流程的学习。",
    hint: "您可以返回主菜单选择其他场景或进行理论考核。"
  }
};

export const MAX_SCORE = 100;
export const HINT_PENALTY = 5;
export const MISTAKE_PENALTY = 10;
export const EXAM_TIME_LIMIT = 15 * 60; // 15 minutes in seconds

export const EXAM_QUESTIONS = [
  {
    id: 1,
    question: "标准的全身动捕贴点模板，全身共需要几个点？",
    options: ["40 个", "50 个", "53 个", "63 个"],
    correctAnswer: 2 // C
  },
  {
    id: 2,
    question: "头部需要贴几个点？",
    options: ["3 个", "4 个", "5 个", "6 个"],
    correctAnswer: 2 // C
  },
  {
    id: 3,
    question: "以下哪种挥舞校准杆的姿势更规范？",
    options: ["上下挥舞", "左右挥舞", "8字挥舞"],
    correctAnswer: 2 // C
  },
  {
    id: 4,
    question: "在相机校准的过程中，身穿动捕服的演员应该怎么样？",
    options: ["呆在动捕区域", "离开动捕区域"],
    correctAnswer: 1 // B
  },
  {
    id: 5,
    question: "用来确定空间坐标系的关键工具是哪个？",
    options: ["T 型校准杆", "L 型校准杆"],
    correctAnswer: 1 // B
  },
  {
    id: 6,
    question: "房间坐标系的正方向是哪个？",
    options: ["L 型尺的短边所指的方向", "L 型尺的长边所指的方向"],
    correctAnswer: 0 // A
  },
  {
    id: 7,
    question: "手套动态校准的过程中，手部需要怎么运动？",
    options: ["逆时针转圈的同时划八字", "顺时针转圈的同时划八字"],
    correctAnswer: 1 // B
  },
  {
    id: 8,
    question: "7 校准的过程中，动捕演员要摆什么 Pose？",
    options: ["T Pose", "A Pose", "7 Pose"],
    correctAnswer: 2 // C
  },
  {
    id: 9,
    question: "创建骨骼之前是否需要框选动捕服身上的标记点？",
    options: ["需要", "不需要"],
    correctAnswer: 1 // B
  },
  {
    id: 10,
    question: "动捕演员离开动捕区域重新入场后，是否需要重新创建骨骼？",
    options: ["需要", "不需要"],
    correctAnswer: 1 // B
  }
];