// Application appearance only. This catalog is independent of video styles and model inputs.
export const themeStorageKey='formaweave.ui-theme';
export const defaultTheme='sage';
const palette=(canvas,surface,sidebar,field,elevated,text,muted,subtle,border,accent,soft,action,onAction,decor,program,generative,hybrid)=>({canvas,surface,sidebar,field,elevated,text,muted,subtle,border,accent,soft,action,'on-action':onAction,decor,program,generative,hybrid});
export const uiThemes=[
  {id:'sage',name:'苔绿工坊',mood:'自然 · 温润 · 专注',description:'奶油白与鼠尾草绿，像午后的安静工作室。',scheme:'light',motif:'botanical',
    tokens:palette('#f6f7f1','#fffef9','#edf0e5','#fafbf5','#e6ecdc','#2c3c30','#56664d','#5e6c55','#d8dfcf','#4c6842','#e8efdd','#344d35','#fffef5','#99623d','#4c6842','#386e70','#885d35')},
  // Keep the saved ID so existing selections automatically adopt the new black theme.
  {id:'paper',name:'墨黑留白',mood:'极简 · 墨色 · 秩序',description:'墨黑与银灰，像一间安静的现代艺廊。',scheme:'dark',motif:'editorial',
    tokens:palette('#101010','#191919','#141414','#121212','#292929','#f2f1ee','#c3c0ba','#a5a39e','#3a3a3a','#d6d3cb','#2d2c29','#e4e0d7','#1b1a18','#d2af83','#d0cdc5','#b8c9c6','#d5ba95')},
  {id:'ocean',name:'海盐蓝调',mood:'清透 · 轻盈 · 开阔',description:'海盐白与澄澈蓝，让灵感像海风一样流动。',scheme:'light',motif:'tides',
    tokens:palette('#f0f6fa','#fbfdff','#e6eff5','#f4f9fd','#dceaf4','#213b50','#4c6579','#53697c','#cddde9','#276a9a','#e0edf8','#235e86','#ffffff','#996526','#306b93','#2c7176','#805e34')},
  {id:'rose',name:'暮色玫瑰',mood:'柔和 · 艺术 · 感性',description:'玫瑰、陶土与暖白，为创作添一点柔软。',scheme:'light',motif:'petals',
    tokens:palette('#fbf4f0','#fffaf7','#f4e7e1','#fcf5f1','#eedad4','#4a3036','#80575f','#79575e','#e4cdca','#91485e','#f4e2e8','#853f56','#fff7f3','#a45b35','#874d62','#4d665a','#87512f')},
  {id:'midnight',name:'午夜航行',mood:'深邃 · 沉浸 · 宁静',description:'深海蓝中的一束青光，留给夜晚的创造者。',scheme:'dark',motif:'orbits',
    tokens:palette('#101c29','#172839','#122231','#122333','#233c50','#e3eef5','#a8bdcd','#91abc0','#30495e','#74d0d1','#203f4b','#86d5d5','#102e35','#e4b782','#a8cca4','#74d0d1','#e5b57d')},
  {id:'violet',name:'紫雾星轨',mood:'梦幻 · 未来 · 探索',description:'石墨紫与星云微光，为未成形的想象留白。',scheme:'dark',motif:'nebula',
    tokens:palette('#1c1928','#292437','#211d30','#221e30','#383048','#f0eaf9','#c1b4d3','#ad9fbe','#493e59','#c9acf2','#3d3052','#cbb0ef','#30213e','#e8b397','#c7b4e4','#a4d3ce','#e2b7a0')},
];
export function resolveTheme(id){return uiThemes.find(theme=>theme.id===id)||uiThemes.find(theme=>theme.id===defaultTheme);}
function savedTheme(){
  try{return resolveTheme(JSON.parse(globalThis.localStorage?.getItem(themeStorageKey)??'null')).id;}
  catch{return defaultTheme;}
}
let selectedTheme=savedTheme();
export function getUITheme(){return resolveTheme(selectedTheme);}
export function setUITheme(id,{persist=true,document:doc=globalThis.document}={}){
  const theme=resolveTheme(id);selectedTheme=theme.id;
  if(persist){try{globalThis.localStorage?.setItem(themeStorageKey,JSON.stringify(theme.id));}catch{/* Appearance still works for this session. */}}
  if(doc){
    const root=doc.documentElement;
    root.dataset.uiTheme=theme.id;root.dataset.colorScheme=theme.scheme;
    root.style.colorScheme=theme.scheme;
    for(const [key,value] of Object.entries(theme.tokens))root.style.setProperty('--ui-'+key,value);
    const dark=theme.scheme==='dark';
    const states=dark?{success:'#a9d7ac',error:'#ffc3b2','error-soft':'#442b30',warning:'#f2ce96','warning-soft':'#3f3328'}:{success:'#3b6b45',error:'#9e3e31','error-soft':'#fff0ea',warning:'#80581d','warning-soft':'#fff4df'};
    for(const [key,value] of Object.entries(states))root.style.setProperty('--ui-'+key,value);
    doc.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme.tokens.canvas);
  }
  return theme;
}
// Loaded before app.js: apply the preference without touching drafts or content settings.
if(globalThis.document)setUITheme(selectedTheme,{persist:false});
