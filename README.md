文案内容创作与发布助手

基于OpenClaw多智能体的短视频热点抓取、AI文案生成与一键发布系统设计与实现

项目概述

本项目旨在解决内容创作者在短视频平台运营中的效率痛点，通过构建Researcher、Writer、Designer、Publisher、Analyst五个专业化AI Agent协作流水线，实现从热点追踪、文案创作、视觉设计到自动发布、数据复盘的全链路自动化。帮助创作者将单篇笔记的创作发布周期从小时级缩短至分钟级，显著提升内容产出效率与流量获取能力。

功能特性

核心功能（Must Have）

- 热点调研：自动抓取热搜词、分析爆款笔记结构、挖掘关联关键词
- 笔记创作：生成含emoji的合规正文（≤500字）、多风格标题（3-5个）、推荐话题标签
- 封面设计：生成3:4竖版封面图并叠加标题文字
- 发布管理：支持API发布、定时发布（误差≤2分钟）、自动添加话题标签
- 数据复盘：采集阅读/点赞/收藏/评论/分享数据，输出优化建议
- 智能协作：五大Agent任务流水线调度与状态追踪

进阶功能（Should Have）

- 流量来源分析与爆款拆解
- 多图自动排版配文
- 发布前预览与一键发布
- SVG封面图生成

扩展功能（Could Have）

- 系列笔记批量生成
- 评论区高频问题AI辅助回复

系统架构

Agent分工与交互流程



  Agent名称   	核心职责           	输入          	输出            
  Researcher	热点调研、爆款分析、关键词挖掘	选题关键词       	热点简报、爆款分析报告   
  Writer    	正文创作、标题优化、标签推荐 	Researcher简报	笔记正文、标题列表、标签集合
  Designer  	封面生成、视觉排版      	笔记主题+文案     	3:4竖版封面图(.png)
  Publisher 	API发布、定时调度     	文案+封面图      	发布确认、笔记链接     
  Analyst   	数据追踪、流量复盘      	发布记录        	数据报告、优化建议     

技术栈

大模型

- DeepSeek V4 Flash（核心推理引擎）：中文理解能力强，响应速度1-3s
- Moonshot Kimi（兜底备用）：超长上下文支持

消息平台

- 飞书：支持多Bot配置、@触发、群聊协作、审批流，免费使用

存储方案

  数据类型     	存储路径          	格式   
  Agent协作文件	collab/       	.md  
  笔记文案     	output/notes/ 	.md  
  封面图片     	output/covers/	.png 
  系统配置     	openclaw.json 	.json

核心工具链

- OpenClaw Agent框架
- SVG图像生成工具
- 多引擎搜索API
- 平台开放API SDK

快速开始

环境要求

- Python 3.9+
- Node.js 16+
- OpenClaw CLI工具
- 飞书开发者账号（配置5个Bot）

安装步骤

    # 1. 克隆仓库
    git clone https://github.com/your-org/content-assistant.git
    cd content-assistant
    
    # 2. 安装依赖
    pip install -r requirements.txt
    npm install
    
    # 3. 配置环境变量
    cp .env.example .env
    # 填写DEEPSEEK_API_KEY、FEISHU_BOT_TOKEN等配置
    
    # 4. 初始化Agent
    openclaw agents init --config openclaw.json

配置说明

- openclaw.json：Agent注册、路由规则、权限配置
- permissions.json：Skill调用权限控制
- .env：API密钥、平台凭证等敏感信息

运行命令

    # 启动所有Agent
    openclaw agents start --all
    
    # 查看Agent状态
    openclaw agents list
    
    # 执行完整创作发布流程
    openclaw workflow run --template full-pipeline
    
    # 查看网关日志
    openclaw gateway logs --follow

项目结构

    1. 完整代码仓库(GitHub链接)+README
    2. 核心Skil源码(含单元测试)
    3. Agent配置文件
        - SOUL.md
        - AGENTS.md
        - MEMORY.md
    4. Agent协同验证: 消息流转截图/状态管理说明
    5. 渠道接入证据: 飞书/钉钉消息推送截图
    6. 安全配置: openclaw.json+安全测试报告
    7. 开发日志: 决策记录、遇到的问题与解决方案

API文档

（待补充）

已知问题

  问题描述           	影响等级	临时解决方案                       
  API发布偶发5xx错误   	中   	系统已配置自动重试机制（最多3次，间隔30秒）      
  封面图文字叠加位置偏移    	低   	手动调整Designer的SVG模板参数         
  长文本生成可能超过500字限制	中   	Writer已添加prompt约束+截断逻辑，建议人工复核
  热点采集延迟约15分钟    	低   	暂不影响非实时性选题，可通过缩短采集间隔缓解       

团队信息

  成员姓名	角色职责                                    
  马松月 	项目经理兼架构师：需求管理、进度跟踪、对外沟通、系统架构设计、Agent分工、技术选型
  张家诺 	开发工程师：Skill编码、Agent配置、集成联调              
  关雅馨 	文档/测试：文档编写、测试用例、Demo准备                  


