// Stable module IDs match the backend registry. Availability is supplied by /api/health.
// Program and story model workflows are live; hybrid remains a preview.
export const creationPaths = [
  {id:'program',name:'程序构建',english:'BUILD WITH CODE',icon:'code',description:'精确的结构、运动与规则',status:'已可用'},
  {id:'generative',name:'模型生成',english:'CREATE WITH MODELS',icon:'sparkles',description:'多镜头故事 · 连贯创作',status:'已可用'},
  {id:'hybrid',name:'混合创作',english:'WEAVE BOTH WORLDS',icon:'weave',description:'以程序定结构，以模型赋质感',status:'界面预览'},
];
export const exampleShots = [
  {id:'coast',title:'海岸上的来信',duration:5,camera:'远景 · 缓慢推进',description:'清晨的海岸，穿陶土色外套的旅行者沿小径前行。远处的灯塔隐约出现在晨雾中。',narration:'有些地方，只有慢下来才能看见。'},
  {id:'journey',title:'驶向微光',duration:5,camera:'中景 · 平行跟随',description:'列车掠过海岸。窗框中的海面与旅行者的剪影呼应，光线从冷蓝转向温暖。',narration:'沿着海风，把未说完的故事继续。'},
  {id:'lighthouse',title:'抵达的时刻',duration:5,camera:'全景 · 轻微环绕',description:'退潮后露出通往灯塔的路。旅行者在塔前停下，夕阳照亮海面，灯塔亮起第一束光。',narration:'原来，那束光一直在等你。'},
];
export const modules = [
  {id:'video',name:'Code to Video',icon:'video',available:true,description:'从一个想法，到一段可解释、可编辑的动画。'},
  {id:'image',name:'Code to Image',icon:'image',available:false,description:'用代码描绘视觉，生成插画与图像。'},
  {id:'3d',name:'Code to 3D',icon:'box',available:false,description:'让想法拥有形状，构建三维模型。'},
  {id:'world',name:'Code to World',icon:'globe',available:false,description:'构建可以探索的空间与世界。'},
  {id:'games',name:'Code to Games',icon:'game',available:false,description:'将规则、故事与交互变成游戏。'},
];
const styleResponse = await fetch(new URL('./video-styles.json', import.meta.url), {cache:'no-cache'});
if (!styleResponse.ok) throw new Error('视觉风格配置加载失败，请刷新网页。');
const styleCatalog = await styleResponse.json();
export const styles = styleCatalog.styles.map(style => ({...style, version:styleCatalog.version}));
const presetResponse=await fetch(new URL('./video-presets.json',import.meta.url),{cache:'no-cache'});
if(!presetResponse.ok)throw new Error('画质配置加载失败，请刷新网页。');
export const qualities=(await presetResponse.json()).qualities;
export const templates = [
  {id:'binary-search',label:'⌕ 二分查找',name:'二分查找：每次排除一半',tag:'编程 · 算法',art:'[ 1 … 15 ]',palette:'blue',style:'blueprint',description:'用有序数组展示查找范围如何逐步缩小。',prompt:'用动画讲解二分查找。在有序数组 [1, 3, 5, 7, 9, 11, 13, 15] 中查找数字 11，清楚标出左右边界和中点。逐步展示比较、排除一半范围和找到目标的过程，最后说明为什么它比逐个查找更高效。使用简短标签，避免堆叠文字。'},
  {id:'solar-orbits',label:'☉ 太阳系轨道',name:'太阳系里的公转节奏',tag:'科学 · 天文',art:'☉ ⟲ ◦',palette:'forest',style:'math',description:'观察地球与火星的简化轨道和不同公转节奏。',prompt:'用简化动画展示太阳、地球和火星的公转。太阳位于中央，用不同颜色标出地球、火星及各自的圆形示意轨道，展示两颗行星不同的公转节奏，并用一条从太阳指向行星的连线帮助观察位置变化。明确这是教学示意，尺寸、距离和时间不按真实比例。画面清晰，不增加其他天体。'},
  {id:'compound-growth',label:'↗ 复利增长',name:'复利：增长也会继续增长',tag:'数学 · 增长',art:'1.1ⁿ',palette:'clay',style:'minimal',description:'用逐年柱状图比较单利与复利的增长过程。',prompt:'用动画解释复利增长。假设初始数值为 1000，固定年增长率为 10%，观察 5 年变化。先展示第一年的计算，再逐年把增长部分加入下一年的计算基数，绘制清楚的柱状图。与每年固定增加 100 的单利作对比，标明年份和数值，说明两种计算方式为何逐渐拉开差距。'},
];
export const stages = [
  {id:'outline',name:'内容规划',icon:'file'}, {id:'storyboard',name:'分镜设计',icon:'layers'},
  {id:'narration',name:'解说撰写',icon:'file'}, {id:'tts',name:'语音合成',icon:'volume'},
  {id:'code',name:'代码生成',icon:'code'}, {id:'render',name:'动画渲染',icon:'film'}, {id:'merge',name:'对齐合成',icon:'check'},
];
export const statusNames = {queued:'排队中',running:'生成中',completed:'已完成',failed:'生成失败',cancelled:'已停止'};
