# 文案内容创作与发布助手 

## 项目名称
一句话说明项目是什么：AI 驱动的文案内容创作与发布全流程自动化助手

## 项目概述
本项目旨在为内容创作者提供从选题调研、内容创作到发布管理的全流程自动化解决方案。通过多智能体协作模式，实现热点追踪、文案生成、封面设计和平台发布的一站式服务，帮助创作者提升内容生产效率和质量。系统支持单平台深度运营，聚焦笔记类内容创作场景，兼顾创作效率与内容质量。

## 功能特性
- **选题调研**：自动抓取热搜关键词、分析爆款笔记结构、挖掘领域热词
- **内容创作**：基于选题生成符合平台规范的正文、多风格标题和话题标签
- **视觉设计**：根据笔记内容自动生成适配平台的 3:4 竖版封面图
- **发布管理**：支持 API 一键发布和定时发布功能，自动添加话题标签
- **智能协作**：多 Agent 分工协作，实现全流程自动化任务流水线
- **状态追踪**：所有任务状态可查，操作日志完整可追溯

## 系统架构
### 系统分层架构

![](架构图.png)

### Agent 分工与交互流程
| Agent 名称 | 职责 | 输入 | 输出 | 交互流程 |
|-----------|------|------|------|----------|
| Researcher | 热点调研、爆款笔记分析、关键词挖掘 | 选题关键词 | 热点简报 + 爆款分析 | → Analyst |
| Analyst | 爆款拆解 + 选题评级（S/A/B/C） | 热点简报 | commend-notes.md, topic-suggest.md | → Writer |
| Writer | 笔记正文创作、标题优化、文案风格适配 | Researcher简报 | 笔记正文 + 标题 + 标签 | → Designer |
| Designer | 封面图生成、配图排版、视觉风格统一 | 笔记主题 + 文案 | 封面图.png | → Publisher |
| Publisher | API发布、定时发送、标签话题管理 | 文案 + 封面 | 发布确认 + 链接 | → Analyst（数据反馈） |

**消息格式规范**
- Researcher → Analyst：热点简报（JSON格式）
- Analyst → Writer：选题分析报告 + 爆款笔记拆解（JSON格式）
- Writer → Designer：笔记主题 + 文案（文本格式）
- Designer → Publisher：封面图.png + 文案（文件+文本）
- Publisher → Analyst：发布记录（JSON格式）
- Analyst → Researcher：数据报告（JSON格式）

## 技术栈
### 大模型
- **DeepSeek V4 Flash**：核心推理引擎，中文能力强，响应速度快
- **Moonshot Kimi**：兜底备用模型，支持超长上下文处理

### 开发平台
- **飞书**：消息协作平台，支持多 Bot 部署和 @ 触发
- **Node.js**：后端开发语言，v24.0.0 或更高版本
- **OpenClaw**：多智能体协作框架

### 工具依赖
- **Web Search/Fetch**：热点数据采集
- **SVG/PNG 生成**：封面图设计
- **API 调用**：平台发布功能

### 数据存储
- Agent 协作数据：collab/ 目录（.md 格式）
- 笔记文案：output/notes/ 目录（.md 格式）
- 封面图：output/covers/ 目录（.png 格式）
- 配置文件：openclaw.json（JSON 格式）

## 快速开始
### 环境要求
- Node.js: v24.0.0 或更高版本
- 操作系统: Ubuntu 24.04 (WSL2) / Linux / macOS
- 内存: 8GB 以上（推荐 16GB）
- 存储: 至少 20GB 可用空间

### 安装步骤
```bash
# 克隆仓库到本地
git clone https://github.com/u-zjn/openclaw.git

# 安装项目依赖
npm install

# 全局安装 OpenClaw CLI
npm install -g openclaw-cli
```

### 配置说明
```bash
# 备份默认配置
cp openclaw.json openclaw.json.backup

# 编辑配置文件（需填入 API Key 等信息）
vim openclaw.json
```

**关键配置项**：
```json
{
  "gateway": {
    "port": 3000,
    "logLevel": "info"
  },
  "agents": {
    "researcher": {
      "enabled": true,
      "apiKey": "YOUR_DEEPSEEK_API_KEY"
    },
    "analyst": {
      "enabled": true,
      "apiKey": "YOUR_DEEPSEEK_API_KEY"
    },
    "writer": {
      "enabled": true,
      "apiKey": "YOUR_DEEPSEEK_API_KEY"
    },
    "designer": {
      "enabled": true,
      "apiKey": "YOUR_DEEPSEEK_API_KEY"
    },
    "publisher": {
      "enabled": true,
      "zhihuCookie": "YOUR_ZHIHU_COOKIE"
    }
  }
}
```

### 运行命令
```bash
# 启动 OpenClaw Gateway
openclaw gateway start

# 启动所有 Agent
openclaw agent start all

# 执行全流程测试
openclaw pipeline run full --input "领域关键词: 科技"
```

## 项目结构
```
openclaw/
├── collab/                 # Agent 协作数据目录
├── output/                 # 输出目录
│   ├── notes/             # 生成的笔记文案
│   ├── covers/            # 生成的封面图
│   └── zhihu-credentials.json  # 知乎发布配置
├── researcher/            # Researcher Agent 代码
├── analyst/               # Analyst Agent 代码
├── writer/                # Writer Agent 代码
├── designer/              # Designer Agent 代码
├── publisher/             # Publisher Agent 代码
├── openclaw.json          # 系统配置文件
└── package.json           # 项目依赖配置
```

## 已知问题
| Bug 描述 | 影响等级 | 状态 |
|---------|----------|------|
| 部分特殊关键词可能导致 Researcher 采集结果不准确 | 中 | 未修复 |
| Designer 生成的封面图文字叠加位置偶尔偏移 | 低 | 未修复 |
| 知乎发布时偶尔出现 Cookie 过期检测不及时 | 中 | 未修复 |
| 大流量场景下 Gateway 性能可能下降 | 高 | 优化中 |

## 团队信息
| 成员姓名 | 分工 |
| -------- | ---- |
| 马松月   | 项目经理兼架构师：需求管理、进度跟踪、对外沟通、系统架构设计、Agent 分工、技术选型 |
| 张家诺   | 开发工程师：Skill 编码、Agent 配置、集成联调 |
| 关雅馨   | 文档/测试：文档编写、测试用例、Demo 准备 |

---

**文档版本**: v2.0
**最后更新**: 2026-07-20
