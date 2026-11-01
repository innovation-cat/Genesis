// UI copy only. Model prompts, user drafts, credentials and generated artifacts retain their original language.
export const translations = {
  '请在模型中心填写视频模型 ID。':'Enter a video model ID in Model center.',
  '请在模型中心填写视频模型 API Key。':'Enter your video model API key in Model center.',
  '计算服务返回了无效的数据，请检查服务地址或稍后重试。':'The compute service returned invalid data. Check the service URL or try again.',
  '计算服务返回了无效的作品列表，请稍后重试。':'The compute service returned an invalid creations list. Please try again.',
  '画面审阅尚未完成。':'Visual review has not finished yet.',
  '模型准备':'Model setup',
  '生成方式':'Generation options','完整增强':'Full enhancement','基础生成':'Basic generation','连贯故事':'Connected story',
  '镜头自动改进':'Automatic shot refinement','故事连贯性增强':'Story continuity',
  '审阅画面，调整提示词，保留更合适的候选。':'Review shots, refine prompts, and keep the best takes.',
  '记录人物、场景和道具状态，为后续镜头提供参考。':'Track characters, places and props to guide later shots.',
  '在故事状态和视觉参考的约束下，逐镜头审阅、改进并择优。':'Review and refine each shot using story state and visual references.',
  '独立审阅和改进每个镜头，使用用户参考图，不传递生成画面的记忆。':'Refine each shot independently using user references, without carrying generated images forward.',
  '建立故事状态并传递可信画面，每个镜头生成一次；仍会检查记忆的可信度。':'Carry story state and trusted images forward. Generate each shot once; memory still needs visual checks.',
  '规划分镜后，每个镜头生成一次，再组接成片；保留用户设定与参考图。':'Plan, generate each shot once, then assemble. User direction and references still apply.',
  '改进预算':'Refinement budget','达到目标或停止改善时提前结束，最多生成 16 个候选。':'Stop at the target or when improvement stalls, with up to 16 takes.',
  '请重启本机服务以加载新的生成方式选项。':'Restart the local service to load the generation options.',
  '未启用镜头审阅，仅校验视频格式与时长。':'Shot review is off. Only media format and duration were checked.',
  '仅检查连贯性，未执行提示词迭代。':'Continuity checks only; prompts were not iteratively refined.',
  '所用生成方式':'Generation options used','参考贴合':'Reference fidelity',
  '添加':'Add','未命名':'Untitled','选择人物':'Choose a character','选择场景':'Choose a location','应用到整个故事':'Applies to the whole story',
  '人物、场景与风格':'Characters, locations & style','按类型管理故事设定，选择一个对象编辑描述与参考图。':'Manage story direction by type. Select a subject to edit its description and references.',
  '尚未设置风格':'No style set','尚未添加人物':'No characters yet','尚未添加场景':'No locations yet',
  '添加需要保持一致的人物，或交给系统自动规划。':'Add characters you want to define, or let the system plan them.',
  '添加故事发生的地点，或交给系统自动规划。':'Add story locations, or let the system plan them.',
  '设置整个故事的色彩、光线与质感，也可以留空。':'Define color, lighting and texture for the story, or leave this empty.',
  '场景数量不能超过镜头数量，请增加镜头数或移除场景。':'The number of locations cannot exceed the number of shots. Add shots or remove a location.',
  '视觉设定':'Visual direction','可选':'Optional','人物':'Character','场景':'Location','全片风格':'Story style','人物设定':'Character direction','场景设定':'Location direction',
  '每个人物或场景单独建卡片，描述与参考图共同约束同一个对象。':'Give each character or location a card. Its description and images guide the same subject.',
  '张参考图':'reference images','添加人物':'Add character','添加场景':'Add location','添加全片风格':'Add story style','移除设定':'Remove visual subject',
  '名称':'Name','描述':'Description','描述外貌、服装和需要保持的特征':'Describe appearance, clothing and stable traits',
  '描述空间布局、环境和固定陈设':'Describe spatial layout, surroundings and fixed furnishings','描述全片的色彩、光线、材质与氛围':'Describe color, lighting, texture and atmosphere for the story',
  '仅用于该人物出现的镜头':'Used only in shots featuring this character','仅用于该场景的镜头':'Used only in shots at this location','用于整个故事的色彩、光线与质感':'Color, light and texture across the whole story',
  '图片参考':'Image references','添加参考图':'Add reference images','继续添加参考图':'Add more reference images',
  '可以只填写故事简报，由系统自动规划；需要固定人物或场景时，在这里添加。':'Start with a story brief and let the system plan. Add subjects here when you want to define a character or location.',
  '每个对象最多 3 张图，全故事最多 8 张。单张不超过 8 MB，合计不超过 32 MB。':'Up to 3 images per subject and 8 per story. Maximum 8 MB each and 32 MB in total.',
  '文字设定自动保存；参考图仅在当前页面保留，刷新后需重新添加。':'Descriptions save automatically. Images stay in this page session; add them again after refreshing.',
  '无效的视觉设定类型。':'Invalid visual subject type.','此类视觉设定已达到数量上限。':'This subject type has reached its limit.',
  '请为每个视觉对象填写名称。':'Give each visual subject a name.','视觉设定文字过长。':'Visual direction text is too long.',
  '同类视觉对象请使用不同名称。':'Use different names for subjects of the same type.','整个故事最多添加 8 张参考图。':'Add up to 8 reference images per story.',
  '参考图需要绑定到已有的视觉对象。':'Bind each image to an existing visual subject.','每个视觉对象最多添加 3 张参考图。':'Add up to 3 reference images per subject.',
  '故事参考图合计不能超过 32 MB。':'Story reference images must total no more than 32 MB.','参考图正在读取，请稍候。':'Reading reference images. Please wait.',
  '参考图边长须为 240–8000 像素，长宽比不超过 8:1。':'Image sides must be 240–8000 pixels, with an aspect ratio no greater than 8:1.',
  '请重启本机服务以加载视觉设定绑定。':'Restart the local service to load visual subject bindings.',
  '人物参考':'Character reference','场景参考':'Location reference','风格参考':'Style reference','镜头参考':'Shot reference',
  '每镜头需分配 2–30 秒，一个故事最多生成 16 个候选镜头。':'Allocate 2–30 seconds per shot, with up to 16 takes per story.',
  '视频创作':'Video creation','视频创作 · 画面审阅':'Video creation · Visual review','已停止本机等待。已提交的云端任务可能继续运行，请在服务商控制台查看。':'Local waiting has stopped. Submitted cloud tasks may continue; check your provider console.',
  '多镜头故事 · 连贯创作':'Multi-shot stories · Connected storytelling',
  '故事创作 · 已可用':'Story studio · Available','让每个镜头，都属于同一个故事。':'Every shot belongs to one story.',
  '从整体分镜到逐镜头审阅，':'From story planning to shot-by-shot review,','让人物、场景与故事自然承接。':'Keep characters, places and action connected.',
  '创作一个故事':'Create a story','故事简报':'Story brief','描述故事的起点、变化与结尾':'Describe the beginning, turning point and ending',
  '总时长（秒）':'Total duration (seconds)','镜头数量':'Number of shots','人物与视觉设定':'Characters and visual direction',
  '人物与外观':'Characters and appearance','地点与空间':'Locations and layout','作为故事的初始视觉参考':'Initial visual references for your story',
  '质量与生成预算':'Quality and generation budget','每镜头最多改进次数':'Maximum refinements per shot','目标质量（0–100）':'Target quality (0–100)',
  '达到目标后提前结束改进，始终保留更符合原始故事的镜头。':'Stop refining when the target is reached; keep the take that best serves the original story.',
  '生成我的故事':'Generate my story','分镜、镜头素材与制作记录保存在本机。':'Storyboards, takes and production records stay on this computer.',
  '故事成片':'Your story','成片预览':'Final film','故事分镜':'Storyboard','制作记录':'Production notes',
  '故事进度':'Story progress','个镜头':'shots','等待生成':'Planned','生成中':'Generating','已审阅':'Reviewed','已选定':'Selected',
  '分镜规划完成后，这里会显示镜头进度与审阅结果。':'Shot progress and review notes will appear after planning.',
  '历史视频任务。请在制作记录中查看画面审阅。':'Previous video creation. See Production notes for the visual review.',
  '部分镜头仍有审阅建议，见制作记录。':'Some shots have outstanding review notes. See Production notes.',
  '视频候选':'Take','查看选中镜头':'View selected take','叙事贴合':'Story alignment','人物一致':'Character identity',
  '场景连贯':'Location continuity','道具状态':'Prop state','镜头衔接':'Shot transition','画面质量':'Visual quality',
  '参考与状态记录':'References and state history','已存入后续镜头参考':'Saved visual references',
  '审阅依据抽样画面，分数是辅助判断；当前不评价音频。':'Reviews use sampled frames. Scores support judgment; audio is not evaluated.',
  '视觉连接':'Vision connection','生成镜头':'Generate shots','画面审阅':'Review shots','保持连贯':'Keep continuity','组接成片':'Assemble film',
  '正在逐镜头创作，完成后将自动组接。可在故事分镜中查看进度。':'Creating shots, then assembling your film. Follow progress in Storyboard.',
  '写下故事简报，设置镜头数量与总时长，开始创作。':'Write a story brief, choose the number of shots and total duration, then create.',
  '多镜头故事 · 逐镜头审阅':'Multi-shot story · Shot-by-shot review','故事创作已加入队列。':'Your story is queued.',
  '请重启本机服务以加载故事创作功能。':'Restart the local service to load story creation.',
  '多镜头故事 · 连贯创作':'Multi-shot stories · Continuity and review',
  '视频创作 · 已可用':'Video creation · Available','视频模型 · 视频创作 全局择优':'Video model · Best take selection',
  '已达到目标分数':'Target score reached','全局最高分停止改善':'Global best score has saturated','已达到改进轮数上限':'Refinement round limit reached',
  '生成与评估中':'Generating and evaluating','下载此候选 MP4':'Download candidate MP4','当前最佳':'Current best',
  '生成，审阅，再靠近你的想法。':'Generate, review, and refine your vision.',
  '视频模型生成视频，共用 VLM 提问与评估。':'Your video model generates; your shared VLM asks questions and evaluates.',
  '按原始需求择优，保留每轮结果。':'Select against the original intent. Keep every candidate.',
  '视频生成与质量改进':'Video generation and quality improvement',
  '工作模式':'Workflow mode','生成并迭代改进':'Generate and iteratively improve','仅评估已有视频':'Evaluate an existing video',
  '待评估视频 · MP4，最多 32 MB':'Video to evaluate · MP4, up to 32 MB',
  '视频提示词':'Video prompt','描述主体、动作、环境与镜头':'Describe subjects, actions, setting and camera',
  '单段时长（秒）':'Clip duration (seconds)','分辨率':'Resolution','画幅比例':'Aspect ratio','最多改进轮数':'Maximum refinement rounds',
  '质量与停止条件':'Quality and stopping criteria','目标分数（0–100）':'Target score (0–100)','停滞观察轮数':'Patience (rounds)',
  '最小改进分数':'Minimum score improvement','生成原生音频':'Generate native audio','模型提示词扩展':'Model prompt expansion',
  '参考图 · 可选，最多 3 张':'Reference images · optional, up to 3','添加人物、场景或风格参考':'Add character, setting or style references',
  '参考图将发送给视频模型和 VLM':'Reference images are sent to your video model and VLM',
  'VLM 使用按时间顺序抽取的画面评估，当前不评价音频。参考图在每轮保持不变。停止本机任务会结束等待，已提交的云端任务可能继续计费。':'The VLM evaluates ordered sampled frames, without audio. References stay fixed. Stopping locally ends waiting; submitted cloud tasks may still incur charges.',
  '开始 视频创作 生成':'Start video creation','开始 视频创作 评估':'Review a video','视频创作 生成结果':'Video results',
  '评估报告':'Evaluation report','提示词与问答':'Prompts and Q&A','迭代记录':'Iteration history',
  '每轮会调用视频与视觉模型 API。所有候选和评估报告保存在本机。':'Each round calls video and vision APIs. All candidates and reports are saved locally.',
  '生成后显示每轮分数、问答与最佳候选。':'Scores, Q&A and the best candidate appear here.',
  '全局分数始终针对原始需求。完整记录可在评估报告中查看。':'Global scores always use the original intent. See the evaluation report for full records.',
  '视觉预检':'Vision preflight','动态提问':'Question generation','视觉问答':'Visual Q&A','全局评分':'Global rating','提示词改进':'Prompt refinement',
  '生成后可查看各阶段的结果与运行日志。':'Inspect results and logs for every stage.',
  '填写提示词与模型配置，开始一次 视频创作 视频生成。':'Enter a brief and configure your models to start creating.',
  '视频创作 正在生成与评估。每轮结果会保存在此任务。':'Creating and reviewing takes. Each take is saved with this job.',
  "在模型中心配置共用 LLM / VLM 与视频模型的连接和 API Key。":"Configure the shared LLM / VLM and video model connections and API keys in Model center.",
  "打开“模型中心”，配置一套共用 LLM / VLM 和视频模型。程序构建固定使用 Manim，无需为每个阶段分配模型。测试模型会产生一次小额文本调用。":"Open Model center to configure one shared LLM / VLM and one video model. Programmatic video uses Manim; no per-stage assignment is needed. Testing makes a small text-model API call.",
  "打开“模型中心”：在服务连接中填写 Base URL 与 API Key，在模型配置中填写模型 ID，再为每个阶段分配模型。配置可复用，参数可按阶段覆盖。获取模型列表只读取目录；测试模型会产生一次小额调用。":"Open Model center: add the Base URL and API key under Connections, enter the model ID in a profile, then assign profiles to stages. Profiles are reusable and stage parameters can override defaults. Listing models reads the directory; testing makes a small API call.",
  "模型中心":"Model center", "选择模型配置":"Choose a model profile", "打开模型中心":"Open model center", "服务连接、API Key、模型配置和阶段分配统一在模型中心管理。":"Manage connections, API keys, model profiles and stage assignments in Model center.", "请在模型中心配置视频服务与 API Key。":"Configure a video service and API key in Model center.",
  "界面主题":"Themes", "为灵感，换一种氛围":"A DIFFERENT MOOD FOR YOUR IMAGINATION", "你的工作台，你的色彩。":"Your studio. Your atmosphere.",
  "六种氛围，一个创作空间。选择你喜欢的主题，让整个界面一起焕新。":"Six distinct moods for one creative space. Find your palette and make the whole studio feel like you.",
  "当前主题":"Current theme", "自动保存在此浏览器":"Saved automatically in this browser", "选择界面主题":"Choose an interface theme", "深色":"Dark", "浅色":"Light", "使用中":"Active", "应用主题":"Apply theme",
  "主题会同步调整背景、面板、文字、图标与控件。视频画面风格在创作设置中单独选择。":"Themes adapt backgrounds, panels, text, icons and controls together. Choose video visual styles separately in your creation settings.",
  "苔绿工坊":"Sage Atelier", "自然 · 温润 · 专注":"Natural · Warm · Focused", "奶油白与鼠尾草绿，像午后的安静工作室。":"Cream and sage, like a quiet studio in the afternoon.",
  "墨黑留白":"Ink Noir", "极简 · 墨色 · 秩序":"Minimal · Monochrome · Considered", "墨黑与银灰，像一间安静的现代艺廊。":"Ink black and silver grey. A quiet gallery for your ideas.",
  "海盐蓝调":"Coastal Blue", "清透 · 轻盈 · 开阔":"Airy · Light · Open", "海盐白与澄澈蓝，让灵感像海风一样流动。":"Salt white and clear blue. Let ideas flow like the sea breeze.",
  "暮色玫瑰":"Rose Clay", "柔和 · 艺术 · 感性":"Soft · Artistic · Expressive", "玫瑰、陶土与暖白，为创作添一点柔软。":"Rose, terracotta and warm white. A softer setting for creation.",
  "午夜航行":"Midnight Tide", "深邃 · 沉浸 · 宁静":"Deep · Immersive · Calm", "深海蓝中的一束青光，留给夜晚的创造者。":"A cyan glow in deep ocean blue, for those who create after dark.",
  "紫雾星轨":"Violet Nebula", "梦幻 · 未来 · 探索":"Dreamlike · Futuristic · Curious", "石墨紫与星云微光，为未成形的想象留白。":"Graphite violet and a nebula glow. Room for the yet unimagined.",
  "跳到主内容":"Skip to content", "主导航":"Main navigation", "Genesis 首页":"Genesis home", "创意工作室":"CREATIVE STUDIO",
  "开始新创作":"New creation", "工作空间":"Workspace", "创作工作台":"Creative studio", "我的作品":"My creations", "灵感模板":"Templates",
  "创作路径":"Creation paths", "构建精确的世界，":"Build precise worlds,", "也让意外发生。":"and leave room for surprise.", "以代码构建，以模型生成。":"Build with code. Create with models.",
  "探索 Genesis":"Explore Genesis", "使用指南":"Getting started", "连接设置":"Connections", "正在连接服务":"Connecting to the engine", "本地计算 · 自由创作":"Local computing · Creative freedom",
  "本地创作者":"Local creator", "以代码构建，以模型生成，让想象成形。":"Build with code. Create with models. Let imagination take form.",
  "本地引擎已连接":"Local engine connected", "等待服务配对":"Pairing required", "服务需要重启":"Restart required", "本地服务未连接":"Local engine disconnected",
  "隔离运行 · 准备就绪":"Isolated runtime · Ready", "服务已启动 · 请填写连接令牌":"Engine is running · Enter a pairing token", "检查服务地址 · 连接后自动恢复":"Check the address · Reconnects automatically", "点击配置计算服务":"Configure your compute service",
  "计算服务尚未连接。":"The compute service is not connected yet.", "已连接":"Connected", "未连接":"Disconnected", "计算服务":"Compute service", "后端地址":"Service URL", "连接令牌":"Pairing token", "本地同源访问自动配对":"Local pages pair automatically",
  "远程网页需粘贴本机连接令牌":"Paste the pairing token from your local workbench", "复制令牌":"Copy token", "连接计算服务":"Connect engine", "先双击":"First, launch", "。本机页面自动连接；GitHub 网页还需从本机工作台复制连接令牌并配对。令牌也可在":". Local pages connect automatically. For GitHub Pages, copy a pairing token from the local workbench. You can also find it in",
  "中读取，服务重启或新开网页后可能需要重新填写。":". You may need to pair again after restarting the service or opening a new tab.",
  "规划与代码模型":"Planning & code model", "用于现有程序构建流程":"For the existing code-driven workflow", "这里配置现有 Code2Video 的内容规划与代码模型。扩散 / 流匹配视频模型尚未接入，模型生成工作区目前仅供界面预览。":"Configure the model used for planning and code generation in Code2Video. Diffusion and flow-matching video models are not connected yet; their workspace is a UI preview.",
  "接口类型":"API type", "OpenAI 兼容":"OpenAI compatible", "Claude 原生":"Claude native", "Gemini 原生":"Gemini native", "模型 ID":"Model ID", "服务商提供的模型 ID":"Model ID provided by your service", "输入你的 API Key（不保存到磁盘）":"Enter your API key (not saved to disk)", "显示或隐藏 API Key":"Show or hide API key",
  "获取模型列表":"List models", "测试模型":"Test model", "小额调用":"Small API call", "生成使用你配置的模型服务，费用由服务商收取。":"Generation uses your configured model service. Your provider may charge for requests.",
  "配音服务":"Narration service", "TTS 引擎":"TTS engine", "Windows 本地语音 · 无需密钥":"Windows local voices · No API key", "语音 API · OpenAI 兼容":"Speech API · OpenAI compatible",
  "本地语音直接使用 Windows 已有的中文 / 英文声音，不安装系统组件。若缺少对应语言声音，可切换语音 API。语音服务与生成代码的模型分别配置。":"Local narration uses Chinese or English voices already installed in Windows. If a voice is unavailable, use a speech API. Configure narration separately from your planning and code model.",
  "配音语速":"Narration speed", "0.75 × · 舒缓":"0.75 × · Relaxed", "1 × · 标准":"1 × · Standard", "1.25 × · 轻快":"1.25 × · Brisk", "1.5 × · 快速":"1.5 × · Fast", "https://你的语音服务/v1":"https://your-speech-service/v1",
  "语音模型 ID":"Speech model ID", "语音接口密钥，仅当前会话":"Speech API key, for this session only", "中文声音 ID":"Chinese voice ID", "英文声音 ID":"English voice ID",
  "接口需支持 POST /audio/speech，接收 model、input、voice、speed、response_format=wav 并返回音频。确认声音支持所选语言；沿用下方 HTTP 代理和超时设置。":"The API must support POST /audio/speech with model, input, voice, speed and response_format=wav, and return audio. The selected voice must support the narration language. Proxy and timeout settings below also apply.",
  "高级设置":"Advanced settings", "HTTP 代理":"HTTP proxy", "留空继承当前代理，或填 direct 强制直连":"Leave blank to inherit the proxy, or enter direct", "渲染并行数":"Render workers", "API 并发":"Concurrent API calls", "响应超时（秒）":"Response timeout (seconds)", "临时故障重试":"Transient error retries", "代码修复次数":"Code repair attempts",
  "单次输出预算":"Per-response output budget", "使用推荐预算":"Use recommended budgets", "代码生成 Token":"Code generation tokens", "代码修复 Token":"Code repair tokens", "大纲与分镜 Token":"Planning & storyboard tokens", "模型单次输出上限":"Model response limit", "0：由服务商校验":"0: provider validates the limit", "截断后最多续写":"Maximum continuations",
  "输出预算可继续调高，实际支持范围由模型和服务商决定。模型单次上限填 0 时不预先限制；仅在服务商明确返回上限时自动适配。输出截断会有限次数续写，仍未完成则保留部分内容。续写会增加调用次数和费用，设为 0 可关闭。推理 Token 也可能计入预算；长输出可相应调高响应超时。":"Budgets can be increased within your model and provider limits. Set the model limit to 0 to let the provider validate it. Explicit provider limits are applied automatically. Truncated output can continue a limited number of times; incomplete results are retained. Continuations add calls and cost; set them to 0 to disable. Reasoning tokens may count toward the budget. Increase the timeout for long responses.",
  "密钥不写入浏览器持久存储":"Keys are not saved in persistent browser storage", "保存到本次会话":"Save for this session", "密钥仅用于本次会话":"Keys stay in this session", "关闭":"Close",
  "程序构建":"Programmatic", "模型生成":"Generative", "混合创作":"Hybrid", "精确的结构、运动与规则":"Precise structures, motion and rules", "从故事意图到生成式影像":"From story intent to generated imagery", "以程序定结构，以模型赋质感":"Code for structure. Models for appearance.",
  "已可用":"Available", "界面预览":"UI preview", "代码驱动":"Code driven", "选择创作路径":"Choose a creation path", "选择输出类型":"Choose an output type", "视频":"Video", "图像":"Image", "三维":"3D", "世界":"World", "游戏":"Game", "规划":"Planned", "规划中":"Planned",
  "让想象，":"Let imagination ", "以不同方式成形。":"take shape in new ways.", "精确构建，自由生成，或让两者交织。从这里开始你的下一个作品。":"Build precisely, generate freely, or weave both together. Your next creation starts here.", "本地创作空间":"Local creative workspace",
  "Manim · 程序渲染":"Manim · Code rendering", "扩散 / 流匹配 · 界面预览":"Diffusion / flow matching · UI preview", "程序 × 生成模型 · 界面预览":"Code × generative models · UI preview",
  "渲染引擎":"Renderer", "生成模型":"Generation model", "选择渲染引擎":"Choose a renderer", "选择生成模型":"Choose a generation model", "已接入":"Connected", "待接入":"Not connected", "引擎尚未接入":"Renderer not connected", "界面语言":"Interface language", "请先选择渲染引擎。":"Please select a renderer first.", "尚未接入。此工作区仅供预览，不会改用 Manim 执行。":" is not connected. This workspace is a preview; it will not run through Manim instead.",
  "把复杂的想法，讲清楚。":"Make complex ideas clear.", "代码控制每一处结构与运动，":"Code shapes every structure and movement,", "让知识、逻辑和创意看得见。":"making knowledge, logic and ideas visible.", "描述你的想法":"Describe your idea", "创作内容":"Creative brief", "让代码把抽象变具体":"Make the abstract tangible with code", "用代码，让抽象变得具体":"Make the abstract tangible with code",
  "例如：用直观的几何动画，解释勾股定理。\n展示面积如何变化，让每一步推导都清晰可见。":"For example: explain the Pythagorean theorem with geometric animation.\nShow how the areas change, making every step easy to follow.",
  "试试":"Try", "△ 勾股定理":"△ Pythagorean theorem", "∿ 傅里叶级数":"∿ Fourier series", "⌘ 神经网络":"⌘ Neural network", "画面设置":"Video settings", "新任务使用当前设置":"Applies to new creations", "目标时长":"Target duration", "画面质量":"Output quality",
  "快速 480p":"Fast 480p", "标准 720p":"Standard 720p", "高清 1080p":"High 1080p", "16:9 横屏":"16:9 landscape", "音画逐镜头对齐":"Shot-aligned audio and animation", "视觉风格":"Visual style", "数学之美":"Mathematical elegance", "蓝图解析":"Blueprint", "极简叙事":"Minimal narrative", "背景":"Background",
  "新任务与离线测试均生效，已有视频保持原样":"Applies to new jobs and offline tests; existing videos keep their appearance", "画面语言":"On-screen language", "配音语言":"Narration language", "中文":"Chinese", "中文解说":"Chinese narration", "无配音":"No narration", "将解说字幕嵌入画面":"Burn narration subtitles into the video", "AI 合成配音 · 支持独立音轨与 SRT / VTT 字幕。":"AI-generated narration · Separate audio and SRT / VTT subtitles.",
  "生成我的视频":"Generate video", "本地隔离渲染 · 可编辑源码 · 使用你自己的模型":"Local isolated rendering · Editable code · Your own model", "创作预览":"Creation preview", "视频预览":"Video preview", "内容分镜":"Storyboard", "源码":"Source", "生成流程":"Generation workflow", "最近创作":"Recent creations", "查看全部":"View all",
  "可以编辑简报、查看示例与体验操作；生成模型尚未接入。":"Edit briefs, explore examples and try the workflow. Generation models are not connected yet.", "从一个故事，到一个世界。":"From a story to a world.", "先确定你想表达的，再探索影像的可能。":"Start with what you want to say, then explore the imagery.", "让人物、镜头与情绪连成同一个故事。":"Weave characters, shots and emotion into one story.",
  "故事简报":"Story brief", "你想讲一个怎样的故事？":"What story would you like to tell?", "描述人物、情境、想传达的情绪，以及故事的转折。":"Describe the characters, situation, intended mood and turning point.", "从意图出发，不必先写镜头":"Start with intent, not a shot list", "参考素材":"References", "可选":"Optional", "载入示例":"Load example", "添加角色、场景或风格参考":"Add character, scene or style references", "PNG / JPG / WebP · 仅在本机预览":"PNG / JPG / WebP · Local preview only",
  "创作方向":"Creative direction", "将表达、叙事与美学分开设定":"Set the message, narrative and aesthetics separately", "创作策略":"Creative strategy", "叙事方式":"Narrative mode", "叙事故事":"Storytelling", "信息表达":"Informational", "情绪体验":"Emotional", "线性叙事":"Linear narrative", "人物视角":"Character perspective", "蒙太奇":"Montage", "视觉美学":"Visual aesthetic", "电影叙事":"Cinematic", "自然纪实":"Natural documentary", "风格动画":"Stylized animation", "计划时长（秒）":"Planned duration (seconds)", "画幅比例":"Aspect ratio",
  "保持角色与场景的一致性":"Keep characters and scenes consistent", "视觉设定贯穿所有镜头":"Carry the visual direction across every shot", "视频生成模型":"Video generation model", "预留扩散 / 流匹配模型接入":"Diffusion / flow-matching integration planned", "未接入":"Not connected", "保存简报":"Save brief", "查看创作流程":"Explore the workflow", "生成视频":"Generate video", "模型接入后开放":"Available after model integration",
  "导演工作台":"Director workspace", "示例项目 · 寻光":"Example project · Finding the Light", "分镜板":"Shot board", "视觉设定":"Visual direction", "创作流程":"Creative workflow", "工作区设计参考":"Workspace inspired by", "创意探索 · 全局一致性 · 局部精修":"Creative exploration · Global consistency · Local refinement",
  "分镜概念图 · 非生成视频":"Concept artwork · Not generated video", "示例分镜":"Example storyboard", "点击镜头查看与编辑":"Select a shot to inspect and edit", "画面与叙事":"Visuals and narrative", "时长":"Duration", "画面描述":"Visual description", "镜头语言":"Camera direction", "旁白 / 台词":"Narration / dialogue", "镜头时长（秒）":"Shot duration (seconds)", "这里编辑的是示例分镜；修改简报不会自动生成镜头。":"You are editing example shots. Changing the brief does not generate a new storyboard.",
  "寻光视觉设定概念图":"Finding the Light visual concept", "VISUAL BIBLE / 寻光":"VISUAL BIBLE / FINDING THE LIGHT", "让每个镜头，都属于同一个世界。":"Make every shot belong to the same world.", "角色锚点":"Character anchor", "场景锚点":"Scene anchor", "光线与视觉基调":"Lighting and visual tone", "示例色彩":"Example palette", "海蓝 / 暖沙 / 陶土":"Ocean / warm sand / terracotta", "视觉锚点用于表达跨镜头的一致性意图，当前不执行模型约束。":"Visual anchors express cross-shot consistency. Model constraints are not applied in this preview.",
  "探索创作方向":"Explore creative directions", "比较表达策略、叙事方式与美学，确定作品的方向。":"Explore message, narrative and aesthetics to find the creative direction.", "组织故事与剧本":"Develop the story and script", "把创作意图组织成有起承转合的叙事。":"Shape your intent into a narrative with a beginning, development and resolution.", "建立一致性资产":"Establish continuity assets", "明确人物、场景与视觉基调，作为跨镜头的参考。":"Define characters, settings and visual tone as references across shots.", "设计与审阅分镜":"Design and review the storyboard", "安排画面内容、镜头语言和节奏。":"Arrange visual content, camera direction and pacing.", "逐镜头生成影像":"Generate shot by shot", "未来接入扩散 / 流匹配模型，生成每个镜头。":"Future diffusion / flow-matching integrations will generate each shot.", "审阅、反馈与精修":"Review, feedback and refinement", "检查人物与叙事连续性，对局部问题反复修订。":"Check character and narrative continuity, then refine individual issues.", "组接成片":"Assemble the final film", "让镜头、声音和节奏成为完整的作品。":"Bring shots, sound and rhythm together into a complete film.",
  "流程设计 · 尚未执行":"Workflow design · Not executed", "创作不是一次输出，":"Creation is more than one output,", "而是不断靠近你的意图。":"it is a process of finding your intent.", "在整体方向与局部镜头之间，保留审阅和调整的空间。":"Leave room to review the whole direction and refine individual shots.", "审阅反馈 → 局部修订 → 再次审阅":"Review feedback → Local refinement → Review again", "交互流程示意":"Workflow concept",
  "最多添加 3 张参考图。":"You can add up to 3 reference images.", "请选择不超过 8 MB 的 PNG、JPG 或 WebP 图片。":"Choose a PNG, JPG or WebP image no larger than 8 MB.", "参考图读取失败。":"The reference image could not be read.", "移除参考图":"Remove reference image",
  "精确的骨架，自由的想象。":"Precise structure. Open imagination.", "让确定性的结构与运动，":"Bring deterministic structure and motion", "遇见生成式的外观与细节。":"together with generative appearance and detail.", "设计你的创作组合":"Design your creative combination", "结构到影像":"Structure to imagery", "用程序确定几何与镜头，再生成视觉外观。":"Define geometry and cameras with code, then generate the appearance.", "动画到质感":"Animation to atmosphere", "保留已有运动，用模型补充光影与细节。":"Keep the motion, then add lighting and detail with models.", "素材到场景":"Assets to scenes", "先生成视觉素材，再编排到程序场景中。":"Generate visual assets, then arrange them in a programmed scene.",
  "描述结构与外观如何配合":"Describe how structure and appearance should work together", "希望保留的程序约束":"Programmatic constraints to preserve", "几何结构":"Geometry", "镜头运动":"Camera motion", "时间与节奏":"Timing and pacing", "生成式外观的影响程度":"Generative appearance influence", "更贴近结构":"Preserve more structure", "更多生成式细节":"More generative detail", "保存创作意图":"Save creative intent", "进入程序构建":"Open programmatic workspace", "开始混合创作":"Start hybrid creation", "流程接入后开放":"Available after workflow integration",
  "从结构，到想象":"From structure to imagination", "流程概念示意":"Workflow concept", "灯塔场景的程序结构示意":"Lighthouse scene structure concept", "灯塔场景的外观概念插画":"Lighthouse appearance concept", "程序骨架":"Programmatic structure", "生成式外观示意":"Generative appearance concept", "让可控与意外，":"Let control and surprise", "在同一个画面里发生。":"share the same frame.", "保留场景骨架与相机路径，以生成模型补充材质、氛围和细节。也可以反向组合，将生成素材带入程序世界。":"Keep the scene structure and camera path, and let models add materials, atmosphere and detail. Or reverse the workflow and bring generated assets into a programmed world.",
  "程序结构":"Programmatic structure", "运动约束":"Motion constraints", "外观生成":"Generate appearance", "合成输出":"Final assembly", "插画与流程均为设计示意，当前未执行生成或渲染。":"The artwork and workflow are concepts. No generation or rendering is performed.", "从素材，到场景":"From assets to scenes", "保留运动，丰富质感":"Preserve motion, enrich texture", "生成素材的概念插画":"Generated asset concept artwork", "程序编排的场景结构示意":"Programmed scene layout concept", "生成素材示意":"Generated asset concept", "程序场景编排":"Programmatic scene layout", "原始动画结构":"Original animation structure", "光影与材质示意":"Lighting and material concept", "生成素材":"Generate assets", "程序编排":"Arrange with code", "交互约束":"Interaction constraints", "渲染输出":"Render output", "原始动画":"Original animation", "保留运动":"Preserve motion", "光影材质":"Lighting and materials", "先构思并生成角色、场景或材质素材，再放入程序场景，组织空间、行为与交互。":"Create character, scene or material assets first, then place them in a programmed scene to organize space, behavior and interaction.",
  "海岸上的来信":"A Letter on the Coast", "驶向微光":"Toward the Light", "抵达的时刻":"The Moment of Arrival", "远景 · 缓慢推进":"Wide shot · Slow push-in", "中景 · 平行跟随":"Medium shot · Parallel tracking", "全景 · 轻微环绕":"Wide shot · Gentle orbit",
  "清晨的海岸，穿陶土色外套的旅行者沿小径前行。远处的灯塔隐约出现在晨雾中。":"On an early-morning coast, a traveler in a terracotta coat follows a path. A distant lighthouse emerges through the mist.", "有些地方，只有慢下来才能看见。":"Some places reveal themselves only when we slow down.", "列车掠过海岸。窗框中的海面与旅行者的剪影呼应，光线从冷蓝转向温暖。":"A train moves along the coast. The sea framed by its window echoes the traveler's silhouette as the light shifts from cool blue to warm.", "沿着海风，把未说完的故事继续。":"Follow the sea breeze, and let the unfinished story continue.", "退潮后露出通往灯塔的路。旅行者在塔前停下，夕阳照亮海面，灯塔亮起第一束光。":"The falling tide reveals a path to the lighthouse. The traveler pauses as sunset lights the sea and the lighthouse sends out its first beam.", "原来，那束光一直在等你。":"That light, it turns out, has been waiting for you.",
  "一位旅行者沿着海岸寻找一座只在退潮时出现的灯塔。用一段宁静、克制的短片，讲述寻找与抵达，结尾留一点希望。":"A traveler follows the coast in search of a lighthouse that appears only at low tide. Tell a quiet, restrained story of searching and arriving, with a little hope at the end.", "年轻的旅行者，陶土色外套，深色背包。":"A young traveler in a terracotta coat with a dark backpack.", "临海小镇、沿海列车与退潮后的灯塔。":"A coastal town, a seaside train and a lighthouse revealed at low tide.", "低饱和海蓝与暖沙色，自然光，宁静而有希望。":"Muted ocean blue and warm sand, natural light, quiet and hopeful.", "用程序建立海岸、灯塔和镜头路径，再由生成模型补充海浪、晨雾与光线的质感。":"Build the coast, lighthouse and camera path with code, then use a generative model for the texture of waves, morning mist and light.",
  "你的下一个作品，从这里开始":"Your next creation starts here", "还没有创作？用一次离线渲染，点亮你的工作空间。":"No creations yet? Try an offline render to bring your workspace to life.", "试试离线渲染":"Try an offline render", "从灵感到成片":"From idea to final film", "等待你的第一个想法":"Ready for your first idea", "准备中":"Preparing", "内容规划":"Content planning", "分镜设计":"Storyboarding", "解说撰写":"Narration writing", "语音合成":"Speech synthesis", "代码生成":"Code generation", "动画渲染":"Animation rendering", "对齐合成":"Aligned assembly", "排队中":"Queued", "生成中":"Generating", "已完成":"Completed", "生成失败":"Generation failed", "已停止":"Stopped", "进行中":"In progress", "未完成":"Unfinished",
  "停止":"Stop", "重新创作":"Create again", "查看运行日志":"View run logs", "等待生成日志…":"Waiting for generation logs…", "生成后可查看每一步的分镜、代码与运行日志。":"Inspect storyboards, code and run logs as the creation progresses.", "配音 WAV":"Narration WAV", "时间轴 JSON":"Timeline JSON", "字幕 SRT":"Subtitles SRT", "字幕 VTT":"Subtitles VTT", "AI 合成配音":"AI-generated narration", "离线测试视频":"Offline test video", "实际生成视频":"Rendered video", "成品风格：":"Rendered style: ", "旧版本（未记录风格）":"Older version (style not recorded)", "正在读取实际视频参数…":"Reading actual video properties…", "下载 MP4":"Download MP4", "设计示意":"Design concept",
  "灵感示意：用几何图形可视化勾股定理":"Concept illustration: a geometric view of the Pythagorean theorem", "运行真实离线渲染测试":"Run a real offline rendering test", "正在把想法变成画面":"Turning your idea into visuals", "把公式，变成看得见的故事":"Turn formulas into visible stories", "完成渲染后，成品会出现在这里":"The finished video will appear here after rendering", "点击播放按钮，运行真实的离线渲染测试":"Press play to run a real offline rendering test", "生成说明":"Generation guide", "试运行":"Test render", "生成的 Manim 源码将在这里显示。":"Generated Manim source code will appear here.", "内容大纲与分镜将在规划完成后显示。":"The outline and storyboard will appear after planning.", "每一个画面，都有迹可循。":"Every frame has a traceable plan.", "选择文件":"Select a file", "正在读取…":"Loading…", "可复现、可修改的动画代码":"Reproducible, editable animation code", "从内容规划到分镜设计":"From content plan to storyboard", "当前任务实际生成的文件":"Files produced by this job", "源码包":"Source package", "试运行固定短片":"Fixed-length test clip", "文件读取失败，请重新连接服务。":"The file could not be read. Reconnect to the service.",
  "查看":"View", "离线测试":"Offline test", "复用":"Reuse", "用此设置重新创作":"Create again with these settings", "删除作品":"Delete creation", "停止任务":"Stop job", "让每个想法，都有作品。":"Give every idea a place to become real.", "视频、分镜和代码，保存在你自己的工作空间里。":"Videos, storyboards and code stay in your own workspace.", "全部作品":"All creations", "搜索你的作品…":"Search your creations…", "搜索作品":"Search creations", "没有符合条件的作品":"No matching creations", "你的作品集，等待第一段故事":"Your library is waiting for its first story", "开始一次创作，或试试无需 API 的离线渲染。":"Start a creation, or try an offline render without a model API.", "连接本地计算服务，即可查看保存的作品。":"Connect your local engine to view saved creations.", "开始创作":"Start creating", "连接服务":"Connect engine",
  "灵感，不必从零开始。":"You do not have to start from a blank canvas.", "选一个起点，加入你的想法，再决定用什么方式让它成形。":"Choose a starting point, add your idea, then decide how to bring it to life.", "可用于现有视频引擎":"Available for the current video engine", "使用模板":"Use template", "海岸故事的分镜插画":"Coastal story concept illustration", "寻光 · 一个关于寻找与抵达的故事":"Finding the Light · A story of searching and arriving", "从故事简报、角色设定到三幕分镜，体验生成式叙事的工作方式。":"Explore generative storytelling through a story brief, character direction and a three-shot storyboard.", "打开故事示例":"Open story example",
  "看得见的勾股定理":"The Pythagorean theorem, made visible", "数学 · 几何":"Math · Geometry", "用面积与几何动画，让抽象的公式变得直观。":"Make an abstract formula intuitive with area and geometry animation.", "用圆，画出一切":"Draw with circles", "数学 · 傅里叶":"Math · Fourier", "将多个旋转向量相加，逐步构建周期波形。":"Add rotating vectors to build a periodic waveform step by step.", "神经网络如何学习":"How neural networks learn", "AI · 神经网络":"AI · Neural networks", "把输入、权重与误差，串联成一个学习过程。":"Connect inputs, weights and error into a visible learning process.", "矩阵，让空间变形":"Matrices reshape space", "数学 · 线性代数":"Math · Linear algebra", "观察坐标网格与基向量，理解线性变换。":"Understand linear transformations through grids and basis vectors.", "排序算法的小剧场":"A little theater of sorting", "编程 · 算法":"Code · Algorithms", "让数组中的元素动起来，看懂冒泡排序。":"Animate array elements to understand bubble sort.", "为什么行星绕着太阳转":"Why planets orbit the Sun", "物理 · 运动":"Physics · Motion", "用速度向量与引力方向，解释轨道的形成。":"Explain orbits with velocity vectors and gravitational direction.",
  "用程序描述几何、行为与规则，让内容保持精确、可编辑。":"Describe geometry, behavior and rules with code to keep creations precise and editable.", "从语义与参考出发，让生成模型探索外观、场景与世界。":"Start with meaning and references, and let models explore appearances, scenes and worlds.", "在可控的结构与生成式的细节之间，组合你的创作方式。":"Combine controllable structure with generative detail.", "计算服务已连接，可以开始创作。":"The compute service is connected. You can start creating.", "正在检查计算服务…":"Checking the compute service…", "设置已保存。API Key 仅在当前页面会话中有效。":"Settings saved. API keys remain in this page session only.", "请先填写 API Key。":"Enter an API key first.", "正在获取模型列表…":"Loading the model list…", "正在进行一次小额模型调用…":"Making a small model test call…", "此工作区目前为界面预览，请切换到程序构建生成视频。":"This workspace is a UI preview. Switch to Programmatic to generate a video.", "正在创建任务…":"Creating the job…", "正在连接计算服务…":"Connecting to the compute service…", "写下你的想法，让创作开始。":"Write down your idea to start creating.", "请先填写模型 API Key 并保存到本次会话。":"Enter your model API key and save it for this session first.", "测试渲染已开始，将调用所配置的语音 API。":"The test render has started and will use your configured speech API.", "离线渲染已开始，无需调用模型 API。":"The offline render has started without a content-model API call.", "任务已加入队列，可在工作台查看进度。":"The job is queued. Follow its progress in the workspace.", "创作简报已保存在本机。":"Your creative brief has been saved locally.", "请先在本机工作台连接服务。":"Connect to the service in the local workbench first.", "连接令牌已复制。":"Pairing token copied.", "已填入推荐输出预算，保存后用于新任务。":"Recommended output budgets filled in. Save to apply them to new jobs.", "已复用创作设置，可修改主题后重新生成。":"Creation settings reused. Edit the topic and generate again.", "删除这份作品？":"Delete this creation?", "这会删除此任务的视频、代码和日志。此操作无法撤销。":"This deletes this job's video, code and logs. This action cannot be undone.", "确认删除":"Confirm deletion", "作品已删除。":"Creation deleted.",
  "请输入有效的 HTTP(S) 后端地址。":"Enter a valid HTTP(S) service URL.", "服务连接超时，请检查本地服务和网络。":"The connection timed out. Check the local service and network.", "无法访问计算服务。请确认地址和本地服务，并允许浏览器访问本地网络。":"The compute service is unreachable. Check its address and local service, and allow browser access to the local network.", "此地址不是 Code2X 计算服务，请检查计算服务地址。":"This address is not a Code2X compute service. Check the service URL.", "计算服务已启动，但渲染环境未就绪，请运行 Setup-Code2X.cmd。":"The service is running, but the render environment is not ready. Run Setup-Code2X.cmd.", "计算服务已启动，但此网页尚未配对。请从本机工作台复制连接令牌，粘贴到“连接令牌”后连接。":"The service is running, but this page is not paired. Copy the pairing token from the local workbench, paste it into Pairing token, then connect.", "计算服务已启动，但连接令牌已失效。请从本机工作台重新复制令牌并连接；重启服务后需要重新配对。":"The service is running, but the pairing token has expired. Copy a fresh token from the local workbench and connect again. Restarting the service requires re-pairing.", "连接令牌无效或服务已重启，请重新配对。":"The token is invalid or the service has restarted. Pair again.", "计算服务仍在运行旧版代码，无法完整应用创作参数。请关闭 Code2X 服务窗口，重新启动 Start-Code2X.cmd，再刷新网页后重新生成。":"The compute service is running older code and cannot apply all creation settings. Close its window, restart Start-Code2X.cmd, refresh this page and create again.",
  "此任务由旧版服务创建，配音语言配置在传递时丢失。服务更新后，请刷新网页并重新创作；保留你当前选择的配音语言。":"This job was created by an older service that lost the narration-language setting. After updating the service, refresh the page and create again with your chosen narration language.",
  "Genesis · 创意工作室":"Genesis · Creative studio", "开始你的第一次创作":"Start your first creation", "选择你的创作路径":"Choose your creation path", "使用现有 Code2Video / Manim 引擎；":" uses the existing Code2Video / Manim engine; ", "面向扩散与流匹配模型的故事创作；":" is for storytelling with diffusion and flow-matching models; ", "组合程序结构与生成式外观。后两者目前为界面预览，可以编辑本机简报与示例分镜，不会调用生成模型。视频之外的图像、三维、世界和游戏为规划中的工作区。":" combines programmatic structure with generative appearance. The latter two are UI previews for local briefs and example shots; they do not call generation models. Image, 3D, world and game workspaces are planned.",
  "以代码构建，以模型生成，让想象成形。从视频开始，逐步连接图像、三维、游戏和世界。":"Build with code, create with models, and let imagination take form. Start with video and expand into images, 3D, games and worlds.", "当前可用的是 Code2Video / Manim 动画。生成式模型、世界模型及混合工作流是后续研究方向，尚未开放生成功能。":"Code2Video / Manim animation is available today. Generative models, world models and hybrid workflows are future directions and do not generate content yet.",
  "1. 启动计算服务":"1. Start the compute service", "双击项目中的":"Launch", "，然后打开":" in the project, then open", "。首次安装可运行":". For first-time setup, run", "2. 先试一次离线渲染":"2. Try an offline render", "点击“试试离线渲染”，会真实生成勾股定理与线性变换的测试视频，验证中文、数学公式、动画和合成。测试内容固定，使用当前所选视觉风格、画面语言和配音语言，不使用内容模型 API。本地语音无需密钥；若改用语音 API，离线测试也会调用该语音服务。":"Choose Try an offline render to generate a fixed test clip about geometry and linear transformations. It uses your visual style, on-screen language and narration language without a content-model API. Windows voices need no key. If you select a speech API, the test uses that service.",
  "3. 连接你的模型":"3. Connect your model", "打开“连接设置”，填写服务商的 Base URL、模型 ID 和 API Key，保存到本次会话。获取模型列表只读取目录；测试模型会产生一次小额调用。":"Open Connections and enter your provider's Base URL, model ID and API key, then save for this session. Listing models reads the directory only; testing a model makes a small API call.",
  "4. 从想法到成片":"4. From idea to final film", "描述主题、设定时长与质量，点击生成。完成后可播放 MP4、下载视频与源码包，在分镜和源码页查看实际生成文件。配音语言可选择中文、英文或无配音，独立于画面语言。Planner 完成分镜后先生成逐镜头解说与 TTS，再对齐动画、配音和字幕。可下载 WAV、SRT / VTT 与时间轴 JSON。配音由 AI 合成。":"Describe your topic, set duration and quality, then generate. Play or download the MP4 and source package, and inspect actual storyboard and code files. Narration can be Chinese, English or off, independently of on-screen language. After storyboarding, narration and TTS are prepared shot by shot and aligned with animation and subtitles. WAV, SRT / VTT and timeline JSON are downloadable. Narration is AI-generated.",
  "在 GitHub Pages 上操作":"Using GitHub Pages", "保持本地服务运行，在网页连接设置中填写本机地址与连接令牌。令牌可在本机工作台复制，或从":"Keep the local service running and enter its URL and pairing token in Connections. Copy the token from the local workbench or read it from", "读取。浏览器询问本地网络权限时需要允许。":". Allow local-network access if the browser asks.", "GitHub Pages 负责界面，本地引擎负责生成。Python、依赖、FFmpeg、LaTeX 和缓存均在项目内。依赖隔离不等于代码安全沙箱；模型生成的 Python 代码以当前用户权限执行，仅连接可信模型和网页。":"GitHub Pages serves the interface; the local engine performs generation. Python, dependencies, FFmpeg, LaTeX and caches stay inside the project. Dependency isolation is not a security sandbox: generated Python runs with your user permissions. Use trusted model services and pages.", "基于":"Based on",
  "从一个想法，到一段可解释、可编辑的动画。":"From an idea to an explainable, editable animation.", "用代码描绘视觉，生成插画与图像。":"Describe visuals with code to create illustrations and images.", "让想法拥有形状，构建三维模型。":"Give ideas shape by building 3D models.", "构建可以探索的空间与世界。":"Build spaces and worlds to explore.", "将规则、故事与交互变成游戏。":"Turn rules, stories and interaction into games.",
  "程序渲染":"Code rendering", "未配置":"Not configured", "可用":"Available", "请选择":"Please select", "仅预览":"Preview only", "任务级选择":"For this creation", "模型来源":"Model source", "本地部署":"Local deployment", "远程服务":"Remote service", "服务 API":"Provider API", "配置模型来源":"Configure model source", "当前选择":"Current selection", "用于新作品":"For new creations", "图像生成":"Image generation", "文生视频":"Text to video", "图生视频":"Image to video", "自定义模型":"Custom model", "更多模型":"More models", "关键帧模型":"Keyframe model", "视频模型":"Video model", "模型与引擎":"Models & engines",
  "尚未接入":"Not connected", "生成引擎":"Generation engine", "该引擎尚未接入。":"This renderer is not connected yet.", "未选择":"Not selected", "新任务的渲染引擎":"Renderer for new creations", "新任务的生成模型":"Generation model for new creations", "配置连接":"Configure connection", "选择模型":"Choose a model", "请先选择生成模型。":"Please select a generation model first.",
  "所选渲染引擎尚未接入，不能执行生成。":"The selected renderer is not connected and cannot generate content.", "请选择渲染引擎":"Choose a renderer", "请选择生成模型":"Choose a generation model",
  "数学、图解与精确的二维动画。当前已接入。":"Mathematics, diagrams and precise 2D animation. Connected and available.", "三维场景、材质、灯光与动画。尚未接入。":"3D scenes, materials, lighting and animation. Not connected yet.", "组件驱动的视频与动态图形。尚未接入。":"Component-driven video and motion graphics. Not connected yet.", "浏览器中的三维场景与交互体验。尚未接入。":"3D scenes and interactive experiences in the browser. Not connected yet.", "视频生成模型系列。具体版本与服务将在接入后配置。":"Video model family. Specific versions and services will be configured after integration.", "图像生成模型系列。具体版本与服务将在接入后配置。":"Image model family. Specific versions and services will be configured after integration.", "为自部署或 API 视频模型保留的入口。尚未接入。":"Reserved for self-hosted or API-based video models. Not connected yet.", "为自部署或 API 图像模型保留的入口。尚未接入。":"Reserved for self-hosted or API-based image models. Not connected yet.",
  "自定义视频模型":"Custom video model", "自定义图像模型":"Custom image model", "界面语言不影响画面和配音语言":"Interface language is independent of on-screen and narration languages",
  "用户界面语言":"Interface language", "英语":"English", "简体中文":"简体中文", "新建":"New", "下一步":"Next", "返回":"Back", "预览":"Preview", "取消":"Cancel", "保存":"Save", "重试":"Retry", "重置":"Reset", "语言":"Language",
  "创作工作区":"CREATIVE WORKSPACE", "程序视频":"PROGRAMMATIC VIDEO", "生成式叙事":"GENERATIVE STORYTELLING", "混合创作工作区":"HYBRID CREATION", "创作意图":"YOUR CREATIVE INTENT", "本地预览":"LOCAL PREVIEW", "设计示例":"INSPIRATION", "正在创作":"WORK IN PROGRESS", "寻找微光":"FINDING THE LIGHT", "一个故事，同一个视觉世界。":"ONE STORY. ONE VISUAL WORLD.", "结构与想象相遇":"STRUCTURE MEETS IMAGINATION", "你的创作资料库":"YOUR CREATIVE LIBRARY", "一点灵感，可以走很远。":"A LITTLE SPARK GOES A LONG WAY", "一个工作台，无限可能。":"ONE STUDIO. MANY POSSIBILITIES.", "连接你的引擎":"CONNECT YOUR ENGINE", "代码 → 视频":"CODE → VIDEO", "代码 × 模型":"CODE × MODELS", "新上架":"NEW", "即将开放":"SOON"
};

const escapeRegExp=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const englishToChinese=new Map();
for(const [zh,en] of Object.entries(translations))if(!englishToChinese.has(en))englishToChinese.set(en,zh);
const chineseFragments=Object.keys(translations).filter(key=>/[\u3400-\u9fff]/.test(key)&&key.length>=2).sort((a,b)=>b.length-a.length);
const chinesePattern=new RegExp(chineseFragments.map(escapeRegExp).join('|'),'g');
const englishFragments=[...englishToChinese.keys()].filter(key=>key.length>=8).sort((a,b)=>b.length-a.length);
const englishPattern=new RegExp(englishFragments.map(escapeRegExp).join('|'),'g');
const languageKey='formaweave.ui-language';
function normalizeLanguage(language){return language==='zh-CN'?'zh-CN':'en';}
let language='en';
try {const saved=globalThis.localStorage?.getItem(languageKey);language=normalizeLanguage(saved==='en'||saved==='zh-CN'?saved:saved?JSON.parse(saved):'en');} catch {language='en';}
export function getUILanguage(){return language;}

function dynamicText(text,locale){
  if(locale==='en'){
    text=text.replace(/^计算服务返回了无效的响应（HTTP (\d+)），请检查服务地址或稍后重试。$/,'The compute service returned an invalid response (HTTP $1). Check the service URL or try again.');
    text=text.replace(/^初始生成 1 次，加上最多 (\d+) 次改进。达到阈值或分数停滞时提前停止。$/, 'One initial generation and up to $1 refinement rounds. Stops early when the target is reached or scores saturate.');
    text=text.replace(/候选 (\d+) · GS/g,'Candidate $1 · GS').replace(/目标\s*(\d+)\s*秒/g,'Target $1 seconds');
    text=text.replace(/^(.+?) 尚未接入。此工作区仅供预览，不会改用 Manim 执行。$/,(_,name)=>`${name} is not connected. This workspace is a preview; it will not run through Manim instead.`);
    text=text.replace(/约\s*(\d+)\s*分钟/g,'About $1 min').replace(/目标\s*(\d+)\s*分钟/g,'Target $1 min');
    text=text.replace(/(\d+)\s*秒\s*\/\s*(\d+)\s*个镜头/g,'$1 seconds / $2 shots');
    text=text.replace(/镜头\s*(\d+)\s*·\s*画面与叙事/g,'Shot $1 · Visuals and narrative');
    text=text.replace(/已获取\s*(\d+)\s*个模型。在模型 ID 输入框中选择或输入。/g,'Found $1 models. Choose or enter a model ID.');
    text=text.replace(/模型调用成功：([\s\S]*?)（(\d+) tokens）/g,'Model test succeeded: $1 ($2 tokens)');
    text=text.replace(/^让(.+)，成为下一个可能。$/,(_,kind)=>`Let ${uiText(kind,'en').toLowerCase()} become your next possibility.`);
    text=text.replace(/^当前预留此工作区，尚未接入(.+)生成。$/,(_,kind)=>`This workspace is reserved for future ${uiText(kind,'en').toLowerCase()} generation.`);
    text=text.replace(/^返回(.+)的视频工作区$/,(_,path)=>`Back to the ${uiText(path,'en')} video workspace`);
    text=text.replace(/的原创分镜概念插画/g,' original storyboard concept artwork');
    text=text.replace(/服务响应\s*(\d+)/g,'Service response $1');
    text=text.replace(/实际\s+(\d+:\d+)/g,'Actual $1');
    text=text.replace(/(\d+)\s*个镜头/g,'$1 shots');
    text=text.replace(/生成后可查看每一步的分镜、代码与运行日志。/g,translations['生成后可查看每一步的分镜、代码与运行日志。']);
  }else{
    text=text.replace(/^(\d+) STEPS$/,'$1 步骤');
    text=text.replace(/About (\d+) min/g,'约 $1 分钟').replace(/Target (\d+) min/g,'目标 $1 分钟');
    text=text.replace(/(\d+) seconds \/ (\d+) shots/g,'$1 秒 / $2 个镜头');
    text=text.replace(/Shot (\d+) · Visuals and narrative/g,'镜头 $1 · 画面与叙事');
  }
  return text;
}
export function uiText(value,locale=language){
  if(typeof value!=='string'||!value)return value;
  locale=normalizeLanguage(locale);
  const trimmed=value.trim();
  const mapped=locale==='en'?translations[trimmed]:englishToChinese.get(trimmed);
  if(mapped!==undefined)return value.replace(trimmed,mapped);
  let result=dynamicText(value,locale);
  result=locale==='en'?result.replace(chinesePattern,key=>translations[key]):result.replace(englishPattern,key=>englishToChinese.get(key));
  return result;
}

const textSources=new WeakMap();
const attributeSources=new WeakMap();
const excluded='pre,code,script,style,[data-user-content],[data-no-localize]';
const textExcluded=excluded+',textarea,input';
const attributes=['aria-label','title','placeholder','alt'];
function skipped(element,selector=excluded){return !element||Boolean(element.closest?.(selector));}
function translateTextNode(node){
  if(skipped(node.parentElement,textExcluded)||!node.data.trim())return;
  const option=node.parentElement?.closest?.('option');
  if(option&&!option.hasAttribute('value'))option.setAttribute('value',option.value);
  let source=textSources.get(node);
  // A renderer may reuse a text node; distinguish that write from our own last translation.
  if(!source||node.data!==source.rendered){source={original:node.data,rendered:node.data};textSources.set(node,source);}
  const next=uiText(source.original);
  if(node.data!==next)node.data=next;
  source.rendered=next;
}
function translateElement(element){
  if(skipped(element))return;
  if(element.tagName==='OPTION'&&!element.hasAttribute('value'))element.setAttribute('value',element.value);
  let sources=attributeSources.get(element);
  if(!sources){sources=new Map();attributeSources.set(element,sources);}
  for(const attribute of attributes){
    if((element.getAttribute('data-i18n-keep')||'').split(/\s+/).includes(attribute))continue;
    if(!element.hasAttribute(attribute))continue;
    const current=element.getAttribute(attribute);
    let source=sources.get(attribute);
    if(!source||current!==source.rendered){source={original:current,rendered:current};sources.set(attribute,source);}
    const next=uiText(source.original);
    if(current!==next)element.setAttribute(attribute,next);
    source.rendered=next;
  }
}
export function localize(root=globalThis.document){
  if(!root||!globalThis.document)return;
  if(root.nodeType===3){translateTextNode(root);return;}
  if(root.nodeType===1&&skipped(root))return;
  if(root.nodeType===1)translateElement(root);
  // Process option values before their text changes, preserving canonical backend enum values.
  root.querySelectorAll?.('option').forEach(option=>{if(!skipped(option)&&!option.hasAttribute('value'))option.setAttribute('value',option.value);});
  const walker=document.createTreeWalker(root,0x1|0x4);
  for(let node=walker.nextNode();node;node=walker.nextNode()){
    if(node.nodeType===1)translateElement(node);else translateTextNode(node);
  }
}
export function setUILanguage(value){
  language=normalizeLanguage(value);
  try {globalThis.localStorage?.setItem(languageKey,JSON.stringify(language));} catch { /* Session-only use still works. */ }
  if(globalThis.document){
    document.documentElement.lang=language;
    document.documentElement.dataset.uiLanguage=language;
    document.title=language==='en'?'Genesis — Let imagination take form':'Genesis — 让想象成形';
    localize(document);
  }
  return language;
}
let observer;
let scheduled=false;
const pending=new Set();
function queueLocalization(root){
  if(!root)return;
  pending.add(root);
  if(scheduled)return;
  scheduled=true;
  queueMicrotask(()=>{
    scheduled=false;
    const roots=[...pending];pending.clear();
    for(const item of roots)if(item.isConnected!==false)localize(item);
  });
}
export function startLocalization(){
  if(!globalThis.document)return ()=>{};
  setUILanguage(language);
  if(!observer&&globalThis.MutationObserver){
    observer=new MutationObserver(records=>{
      for(const record of records){
        if(record.type==='childList')for(const node of record.addedNodes)queueLocalization(node.nodeType===3?node:node);
        else queueLocalization(record.target);
      }
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});
  }
  return ()=>{observer?.disconnect();observer=undefined;pending.clear();};
}
