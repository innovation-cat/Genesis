import {icon, hydrateIcons} from './icons.js';
import {modules, styles, qualities, templates, stages, statusNames, creationPaths, exampleShots} from './modules.js';
import {API, readStorage, writeStorage, backendCompatibilityError, connectionProblem} from './api.js';
import {stylePreview, storyIllustration} from './style-preview.js';
import {getUILanguage,setUILanguage,uiText,localize,startLocalization} from './i18n.js';
import {uiThemes,getUITheme,setUITheme,themeStorageKey} from './themes.js';
import {ModelCenter} from './model-center.js';
import {productionSummary,productionView} from './story-view.js';
import {loadStoryOptions,generationMode,generationOptionsHTML,storyBudget} from './story-options.js';
import {assetMetadata,loadVisualAssets,createVisualAsset,visualPayload,visualAssetCards,visualAssetPanel,selectedVisualAssets,visualAssetStorageKey,referenceBytes} from './visual-assets.js';

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaults = {provider:'OpenAI 兼容',model:'gpt-6.1-terra',base_url:'https://api.gptsapi.net/v1',proxy:'',workers:2,api_concurrency:1,api_timeout:600,api_retries:3,max_tokens:65536,planning_max_tokens:8192,repair_max_tokens:65536,model_output_limit:0,max_continuations:2,retries:3,tts_provider:'windows',tts_speed:1,tts_base_url:'',tts_model:'',tts_voice_zh:'alloy',tts_voice_en:'alloy'};
const preferenceKeys = Object.keys(defaults);
const storedPreferences = readStorage('code2x.preferences', {});
const saved = storedPreferences && typeof storedPreferences==='object' ? storedPreferences : {};
const config = {...defaults, ...Object.fromEntries(preferenceKeys.filter(k => k in saved).map(k => [k,saved[k]])), api_key:'',tts_api_key:''};
if ('max_tokens' in saved && !('repair_max_tokens' in saved)) config.repair_max_tokens=saved.max_tokens;
const isLocal = ['127.0.0.1','localhost'].includes(location.hostname);
// Resolve browser storage inside readStorage/writeStorage's guarded operation.
const sessionStore={getItem:key=>globalThis.sessionStorage.getItem(key),setItem:(key,value)=>globalThis.sessionStorage.setItem(key,value)};
const api = new API(readStorage('code2x.endpoint', isLocal ? location.origin : 'http://127.0.0.1:8765'), readStorage('code2x.token','',sessionStore));
const storyDefaults={brief:'一位旅行者沿着海岸寻找一座只在退潮时出现的灯塔。用一段宁静、克制的短片，讲述寻找与抵达，结尾留一点希望。',duration:'15',ratio:'16:9',quality:'1080p',strategy:'叙事故事',narrative:'线性叙事',aesthetic:'电影叙事',consistency:true,character:'年轻的旅行者，陶土色外套，深色背包。',location:'临海小镇、沿海列车与退潮后的灯塔。',look:'低饱和海蓝与暖沙色，自然光，宁静而有希望。',hybridBrief:'用程序建立海岸、灯塔和镜头路径，再由生成模型补充海浪、晨雾与光线的质感。'};
function exampleStory(){return {...storyDefaults,...Object.fromEntries(['brief','character','location','look','hybridBrief'].map(key=>[key,uiText(storyDefaults[key])]))};}
function localizedShots(){return exampleShots.map(shot=>({...shot,...Object.fromEntries(['title','camera','description','narration'].map(key=>[key,uiText(shot[key])]))}));}
const storedStory=readStorage('formaweave.story-draft',{});
const state = {
  path:readStorage('formaweave.creation-path','program'),storyTab:'board',selectedShot:'coast',references:[],
  story:{...exampleStory(),character:'',location:'',look:'',...Object.fromEntries(Object.keys(storyDefaults).filter(k=>typeof storedStory?.[k]===typeof storyDefaults[k]).map(k=>[k,storedStory[k]]))},
  shots:localizedShots(),hybridPreset:'structure',hybridStrength:65,hybridLocks:[true,true,true],
  visualSelections:{},visualAssets:loadVisualAssets(readStorage(visualAssetStorageKey,null),storedStory),
  storyOptions:loadStoryOptions(readStorage('formaweave.story-options',{})),
  view:'studio', module:'video', connected:false, health:null, config, backendError:'', connectionError:'', connectionKind:'',
  draft:{topic:'',duration:1,quality:'快速 480p',language:'中文',narration_language:'zh-CN',burn_subtitles:true,styleId:'math',...readStorage('code2x.draft',{})},
  jobs:[], active:null, tab:'preview', logLines:[], cursor:0, previewKey:'', recentKey:'', filter:'all', query:'', submitting:false, polling:false,
};
const modelCenter=new ModelCenter({legacy:config,api,toast});
let sourceRequest = 0;
let connectionAttempt=null, connectionRevision=0, lastConnectAt=0;
if(!creationPaths.some(path=>path.id===state.path))state.path='program';
if (!styles.some(style=>style.id===state.draft.styleId)) state.draft.styleId='math';
const terminal = job => ['completed','failed','cancelled'].includes(job?.status);
const lostNarrationConfig = job => job?.error === "'narration_language'";
const jobErrorMessage = job => lostNarrationConfig(job)
  ? '此任务由旧版服务创建，配音语言配置在传递时丢失。服务更新后，请刷新网页并重新创作；保留你当前选择的配音语言。'
  : job.error?.replace(/\bVQQA\b/gi,'视频创作');
const fileFor = (job, kind) => kind==='video'&&job?.config.workflow==='story' ? (job.status==='completed'?job.artifacts?.find(a=>a.name==='final_video.mp4'):null) : (kind==='video'&&job?.artifacts?.find(a=>a.name==='final_video.mp4'))||job?.artifacts?.find(a => a.kind === kind);
const shortDate = value => new Intl.DateTimeFormat(getUILanguage()==='en'?'en-US':'zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value));
const sizeText = size => size > 1048576 ? `${(size/1048576).toFixed(1)} MB` : `${Math.round(size/1024)} KB`;

function toast(message, error=false) {
  const el=document.createElement('div'); el.className=`toast${error?' error':''}`; el.textContent=uiText(message);
  $('#toast-region').append(el); setTimeout(()=>el.remove(),6500);
}
function mountLanguageControl(){
  const label=document.createElement('label');label.className='ui-language-control';
  label.innerHTML=`${icon('globe')}<select id="ui-language" aria-label="界面语言"><option value="en" data-user-content>English</option><option value="zh-CN" data-user-content>中文</option></select>`;
  $('.header-actions').prepend(label);$('#ui-language').value=getUILanguage();
}
function switchLanguage(language){
  if(state.view==='models'&&!modelCenter.leave()){$('#ui-language').value=getUILanguage();return;}
  setUILanguage(language);render();setConnection(state.connected,state.connectionError||undefined);
  $('#ui-language').value=getUILanguage();localize();
}
function persistDraft() { writeStorage('code2x.draft',state.draft); }
function setConnection(connected, message) {
  state.connected=connected;
  state.connectionError=connected?'':message||'计算服务尚未连接。';
  $('#sidebar-status').textContent=connected?'本地引擎已连接':state.connectionKind==='pairing'?'等待服务配对':state.connectionKind==='restart'?'服务需要重启':'本地服务未连接';
  $('#sidebar-detail').textContent=connected?'隔离运行 · 准备就绪':state.connectionKind==='pairing'?'服务已启动 · 请填写连接令牌':state.connectionKind==='offline'?'检查服务地址 · 连接后自动恢复':'点击配置计算服务';
  $('#connection-status').textContent=message || (connected?'已连接':'未连接');
  for (const el of [$('#sidebar-dot'),$('#header-dot')]) el.classList.toggle('online',connected);
}
async function connect(notify=false) {
  const key=api.endpoint+'\n'+api.token;
  if(!connectionAttempt || connectionAttempt.key!==key) {
    const client=new API(api.endpoint,api.token);
    const revision=connectionRevision;
    lastConnectAt=Date.now();
    const attempt={key,promise:null};
    connectionAttempt=attempt;
    attempt.promise=establishConnection(client,revision).finally(()=>{if(connectionAttempt===attempt)connectionAttempt=null;});
  }
  const connected=await connectionAttempt.promise;
  if(notify)toast(connected?'计算服务已连接，可以开始创作。':state.connectionError,!connected);
  return connected;
}
async function establishConnection(client,revision) {
  try {
    const {health,jobs}=await client.connect({pageOrigin:location.origin});
    if(revision!==connectionRevision)return false;
    state.health=health;
    state.backendError='';state.connectionKind='';api.token=client.token;
    for (const descriptor of health.modules || []) {
      const known = modules.find(module => module.id === descriptor.id);
      if (known) Object.assign(known, descriptor);
    }
    writeStorage('code2x.endpoint',api.endpoint); writeStorage('code2x.token',api.token,sessionStore);
    state.jobs=jobs;
    setConnection(true);
    if ($('#settings-dialog').open) $('#settings-form').elements.token.value=api.token;
    $('#runtime-checks').innerHTML=Object.entries(health.runtime.checks).map(([name,ok])=>`<span>${icon(ok?'check':'close')}${esc(name)}</span>`).join('');
    updateJobCount(); updateRecent(true);
    if (!state.active) {
      const running=state.jobs.find(j=>!terminal(j));
      if (running) await selectJob(running.id,false);
    }
    return true;
  } catch(error) {
    if(revision!==connectionRevision)return false;
    state.health=error.health||null;state.connectionKind=error.kind;
    state.backendError=error.kind==='restart'?error.message:'';
    setConnection(false,error.message);
    return false;
  }
}
function nav() {
  document.body.dataset.creationPath=state.path;
  $('#engine-nav').innerHTML=creationPaths.map(path=>`<button class="engine-item path-nav ${state.path===path.id&&state.view==='studio'?'active':''}" data-path="${path.id}" aria-pressed="${state.path===path.id}" title="${path.name} · ${path.status}"><span class="path-nav-icon">${icon(path.icon)}</span><span class="path-nav-label">${path.name}<small>${path.id==='program'?'代码驱动':path.id==='generative'?'故事创作 · 已可用':'界面预览'}</small></span>${path.id!=='hybrid'?'<i class="nav-ready-dot"></i>':'<span class="nav-preview-dot"></span>'}</button>`).join('');
  document.querySelectorAll('[data-view]').forEach(el=>el.classList.toggle('active',el.dataset.view===state.view));
  $('#breadcrumb-title').textContent=state.view==='studio'?creationPaths.find(p=>p.id===state.path).name:({projects:'我的作品',themes:'界面主题',models:'模型中心'}[state.view]);
}
function render() {
  nav(); state.previewKey=''; state.recentKey='';
  if (state.view==='models') modelCenter.render($('#main'));
  else if (state.view==='themes') renderThemes();
  else if (state.view==='projects') renderProjects();
  else if (state.path==='generative') renderGenerative();
  else if (state.path==='hybrid') {renderHybrid();updateHybridPreview();}
  else renderStudio();
  scrollSelectedPath();
  updateExecutionState();localize();
}
function scrollSelectedPath(){
  const switcher=$('.path-switcher'),selected=$('.path-card.selected');
  if(switcher&&selected&&switcher.scrollWidth>switcher.clientWidth)switcher.scrollLeft+=selected.getBoundingClientRect().left-switcher.getBoundingClientRect().left-(switcher.clientWidth-selected.offsetWidth)/2;
}
function navigate(view='studio',module='video',path=state.path) {
  if(state.view==='models'&&!modelCenter.leave())return;
  module='video';
  if(view==='studio'&&state.active&&(state.active.config.creation_path||'program')!==path){state.active=null;state.logLines=[];state.cursor=0;}
  state.view=view;state.module=module;state.path=path;writeStorage('formaweave.creation-path',path);
  const hash=view!=='studio'?view:`studio/${path}/${module}`;
  if (location.hash!==`#${hash}`) history.replaceState(null,'',`#${hash}`);
  render(); window.scrollTo({top:0,behavior:'instant'});
}
function updateExecutionState(){
  const button=$('#generate-button');if(button){button.disabled=state.submitting;if(!state.submitting)button.innerHTML=`${icon('play')}${uiText('生成我的视频')}<span class="shortcut">Ctrl ↵</span>`;}
  const modelCard=$('.model-connection-preview');
  if(modelCard){modelCard.querySelector('strong').textContent=modelCenter.data.wan.model;modelCard.querySelector('small').textContent=modelCenter.status('wan');for(const el of modelCard.querySelectorAll('strong,small'))el.setAttribute('data-user-content','');}
}
function workspaceIntro() {
  return `<section class="workspace-intro"><div><span class="eyebrow">GENESIS / CREATIVE WORKSPACE</span><h1>让想象，<em>以不同方式成形。</em></h1><p>精确构建，自由生成，或让两者交织。从这里开始你的下一个作品。</p></div><span class="studio-edition"><i></i>本地创作空间</span></section>
    <div class="path-switcher" role="group" aria-label="选择创作路径">${creationPaths.map((path,i)=>`<button type="button" data-path="${path.id}" class="path-card ${state.path===path.id?'selected':''}" aria-pressed="${state.path===path.id}"><span class="path-card-icon">${icon(path.icon)}</span><span class="path-card-copy"><span class="path-card-name">${path.name}<small>${path.status}</small></span><span class="path-card-description">${path.description}</span></span><span class="path-card-index">0${i+1}</span></button>`).join('')}</div>
    ${modelCenter.summary(state.path)}`;
}
function renderStudio() {
  $('#main').innerHTML=`
    ${workspaceIntro()}<div class="workspace-heading"><div><span class="workspace-kicker">PROGRAMMATIC VIDEO</span><h2>把复杂的想法，讲清楚。</h2></div><p>代码控制每一处结构与运动，<br>让知识、逻辑和创意看得见。</p></div>
    <div class="studio-grid">
      <section class="panel compose-panel" aria-labelledby="compose-title">
        <div class="panel-heading"><h2 class="panel-title" id="compose-title">${icon('code')}描述你的想法</h2><span class="quiet-label">CODE → VIDEO</span></div>
        <form id="create-form">
          <label class="field-label" for="topic">创作内容<span class="hint">让代码把抽象变具体</span></label>
          <div class="prompt-wrap"><textarea id="topic" name="topic" maxlength="4000" required placeholder="例如：用动画讲解二分查找。\n逐步缩小查找范围，让每一步比较都清晰可见。">${esc(state.draft.topic)}</textarea><div class="prompt-bottom"><span>${icon('code')}用代码，让抽象变得具体</span><span id="char-count">${state.draft.topic.length} / 4000</span></div></div>
          <div class="suggestions"><span>试试</span>${templates.map(t=>`<button type="button" class="suggestion" data-template="${esc(t.id)}">${esc(t.label)}</button>`).join('')}</div>
          <div class="field-label settings-label">画面设置<span class="hint">新任务使用当前设置</span></div>
          <div class="parameter-row"><div><label for="duration">目标时长</label><select id="duration" name="duration">${[1,2,3,5].map(n=>`<option value="${n}" ${n===state.draft.duration?'selected':''}>约 ${n} 分钟</option>`).join('')}</select></div><div><label for="quality">画面质量</label><select id="quality" name="quality">${qualities.map(q=>`<option value="${q.label}" ${q.label===state.draft.quality?'selected':''}>${q.label} · ${q.width}×${q.height} · ${q.fps} fps</option>`).join('')}</select></div></div>
          <div class="aspect-info"><span>${icon('expand')}16:9 横屏</span><span>${icon('volume')}音画逐镜头对齐</span></div>
          <span class="style-label">视觉风格</span><div class="style-options">${styles.map(s=>`<button type="button" class="style-option ${state.draft.styleId===s.id?'selected':''}" data-style="${s.id}" aria-pressed="${state.draft.styleId===s.id}"><span class="style-art ${s.id}">${s.id==='math'?'a² + b²':s.id==='blueprint'?icon('box'):'<i></i><i></i><i></i>'}</span><span class="style-name">${s.name}<i></i></span></button>`).join('')}</div><p id="style-description" class="style-description" aria-live="polite"></p>
          <div class="section-divider"></div><div class="parameter-row"><div><label for="language">画面语言</label><select id="language" name="language"><option ${state.draft.language==='中文'?'selected':''}>中文</option><option ${state.draft.language==='English'?'selected':''}>English</option></select></div><div><label for="narration_language">配音语言</label><select id="narration_language" name="narration_language">${[['zh-CN','中文解说'],['en-US','English narration'],['none','无配音']].map(([id,label])=>`<option value="${id}" ${state.draft.narration_language===id?'selected':''}>${label}</option>`).join('')}</select></div></div>
          <div class="speech-note"><label class="subtitle-choice"><input id="burn_subtitles" name="burn_subtitles" type="checkbox" ${state.draft.burn_subtitles?'checked':''}>将解说字幕嵌入画面</label><p>AI 合成配音 · 支持独立音轨与 SRT / VTT 字幕。</p></div>
          <button type="submit" id="generate-button" class="generate-button">${icon('play')}生成我的视频<span class="shortcut">Ctrl ↵</span></button>
          <div class="generation-note">${icon('lock')}本地隔离渲染 · 可编辑源码 · 使用你自己的模型</div>
        </form>
      </section>
      <div class="preview-column"><section class="panel preview-panel" aria-labelledby="preview-title"><div class="preview-header"><h2 class="panel-title" id="preview-title">${icon('video')}创作预览</h2><span id="preview-badge" class="badge">WORK IN PROGRESS</span></div><div class="preview-tabs" role="tablist" aria-label="创作内容"><button class="preview-tab" id="tab-preview" data-tab="preview" role="tab">${icon('play')}视频预览</button><button class="preview-tab" id="tab-outline" data-tab="outline" role="tab">${icon('layers')}内容分镜</button><button class="preview-tab" id="tab-source" data-tab="source" role="tab">${icon('code')}源码</button></div><div id="preview-body" class="preview-body" role="tabpanel"></div></section><section class="panel pipeline-panel" id="pipeline" aria-label="生成流程"></section></div>
    </div>
    <section class="recent-section"><div class="section-heading"><h2>${icon('clock')}最近创作</h2><button data-view="projects">查看全部${icon('arrow')}</button></div><div id="recent-jobs"></div></section>`;
  updateStyleSelection();updatePreview(true);updatePipeline();updateRecent(true);
}
function storySelect(label,key,options) {
  return `<label class="ui-field" for="story-${key}">${label}<select id="story-${key}" data-story-field="${key}">${options.map(value=>`<option ${state.story[key]===value?'selected':''}>${esc(value)}</option>`).join('')}</select></label>`;
}
function previewNotice() {
  return `<div class="workspace-notice">${icon('info')}<span><strong>界面预览</strong>可以编辑简报、查看示例与体验操作；生成模型尚未接入。</span><span class="notice-end">LOCAL PREVIEW</span></div>`;
}
function renderGenerative(){
  const v=state.storyOptions;
  $('#main').innerHTML=`${workspaceIntro()}<div class="workspace-heading"><div><span class="workspace-kicker">STORY STUDIO</span><h2>让每个镜头，都属于同一个故事。</h2></div><p>从整体分镜到逐镜头审阅，<br>让人物、场景与故事自然承接。</p></div>
  <div class="studio-grid story-main-grid"><section class="panel compose-panel"><div class="panel-heading"><h2 class="panel-title">${icon('sparkles')}创作一个故事</h2><span class="quiet-label">BRIEF → FILM</span></div>
  <form id="story-form"><label class="field-label" for="story-brief">故事简报</label><div class="prompt-wrap"><textarea id="story-brief" data-story-field="brief" maxlength="4000" required>${esc(state.story.brief)}</textarea><div class="prompt-bottom"><span>描述故事的起点、变化与结尾</span><span id="story-count">${state.story.brief.length} / 4000</span></div></div>
  <div class="parameter-row"><label class="ui-field">总时长（秒）<input name="duration" type="number" min="4" max="120" value="${v.duration}" required></label><label class="ui-field">镜头数量<input name="shot_count" type="number" min="2" max="8" value="${v.shot_count}" required></label></div>
  <div class="parameter-row"><label class="ui-field">分辨率<select name="resolution">${['480P','720P','1080P'].map(x=>`<option ${x===v.resolution?'selected':''}>${x}</option>`).join('')}</select></label><label class="ui-field">画幅比例<select name="ratio">${['16:9','9:16','1:1'].map(x=>`<option ${x===v.ratio?'selected':''}>${x}</option>`).join('')}</select></label></div>
  <button type="button" class="visual-settings-shortcut" data-action="visual-settings">${icon('layers')}<span><strong>人物、场景与风格</strong><small id="visual-settings-summary" data-user-content></small></span>${icon('arrow')}</button>
  ${generationOptionsHTML(v)}
  <label class="subtitle-choice"><input name="audio" type="checkbox" ${v.audio?'checked':''}>生成原生音频</label><p id="story-budget" class="editor-hint" aria-live="polite"></p>
  <button type="submit" id="story-generate" class="generate-button" ${state.submitting?'disabled':''}>${icon('play')}生成我的故事<span class="shortcut">Ctrl ↵</span></button><p class="generation-note">分镜、镜头素材与制作记录保存在本机。</p></form></section>
  <div class="preview-column"><section class="panel preview-panel"><div class="preview-header"><h2 class="panel-title">${icon('video')}故事成片</h2><span id="preview-badge" class="badge">STORY</span></div><div class="preview-tabs" role="tablist"><button class="preview-tab" id="tab-preview" data-tab="preview" role="tab">成片预览</button><button class="preview-tab" id="tab-outline" data-tab="outline" role="tab">故事分镜</button><button class="preview-tab" id="tab-source" data-tab="source" role="tab">制作记录</button></div><div id="preview-body" class="preview-body" role="tabpanel"></div></section><section class="panel pipeline-panel" id="pipeline"></section><section class="panel production-summary" id="production-trajectory" aria-live="polite"></section></div></div><section class="visual-settings visual-settings-workspace" id="visual-settings" aria-label="视觉设定"></section>`;
  updateStoryBudget();renderVisualSettings();updatePreview(true);updatePipeline();updateProductionReport();
}
function updateStoryBudget(){
  const form=$('#story-form');if(!form)return;
  const options={...state.storyOptions};
  for(const key of ['duration','shot_count','max_iterations','target_score'])options[key]=Number(form.elements[key].value);
  for(const key of ['resolution','ratio'])options[key]=form.elements[key].value;
  for(const key of ['audio','auto_refine','continuity'])options[key]=form.elements[key].checked;
  state.storyOptions=options;writeStorage('formaweave.story-options',options);
  const budget=storyBudget(options),mode=generationMode(options);
  form.elements.duration.setCustomValidity(!budget.valid&&budget.reason!=='quality'?uiText('每镜头需分配 2–30 秒，一个故事最多生成 16 个候选镜头。'):'');
  for(const key of ['max_iterations','target_score'])form.elements[key].disabled=!options.auto_refine;
  $('#refinement-settings').hidden=!options.auto_refine;
  $('#generation-mode').textContent=uiText(mode.title);$('#generation-mode').dataset.mode=mode.id;
  $('#generation-mode-description').textContent=uiText(mode.description);
  $('#story-budget').textContent=getUILanguage()==='en'?`${options.shot_count} shots · ${options.auto_refine?'up to':'exactly'} ${budget.maximum} video generations. Story planning still uses your configured model.`:`${options.shot_count} 个镜头 · ${options.auto_refine?'最多':'固定'} ${budget.maximum} 次视频生成。分镜规划仍会调用模型。`;
}
let productionRequest=0,activeProduction=null;
async function updateProductionReport(){
  const target=$('#production-trajectory'),job=state.active;if(!target)return;
  if(activeProduction?.jobId!==job?.id)activeProduction=null;
  const artifact=job?.artifacts?.find(a=>a.name==='story-report.json')||job?.artifacts?.find(a=>a.name==='vqqa-report.json');
  if(!artifact){target.innerHTML=productionSummary(null);if(state.path==='generative'&&state.tab!=='preview')$('#preview-body').innerHTML=productionView(null,state.tab,()=>null);return;}
  const request=++productionRequest;
  try{
    const response=await fetch(api.fileURL(job.id,artifact.path),{signal:AbortSignal.timeout(8000)});if(!response.ok)return;
    let report=await response.json();if(terminal(job)&&report.status==='running'&&report.workflow==='story')report={...report,status:job.status,shots:report.shots.map(s=>s.status==='generating'?{...s,status:job.status==='cancelled'?'cancelled':'failed'}:s)};if(request!==productionRequest||target!==$('#production-trajectory')||job.id!==state.active?.id)return;
    activeProduction={jobId:job.id,report};target.innerHTML=productionSummary(report);
    renderProductionTab();localize();
  }catch{/* Job polling retries report loading. */}
}
function renderProductionTab(){
  if(state.path!=='generative'||state.tab==='preview')return;
  const target=$('#preview-body');if(!target)return;
  const report=activeProduction?.jobId===state.active?.id?activeProduction?.report:null;
  const opens=new Set([...target.querySelectorAll('details[open]')].map(el=>[...target.querySelectorAll('details')].indexOf(el)));
  const scroll=target.querySelector('.production-records')?.scrollTop||0;
  target.innerHTML=productionView(report,state.tab,name=>{const file=state.active?.artifacts?.find(a=>a.name===name);return file?api.fileURL(state.active.id,file.path):null;});
  if(target.querySelector('.production-records'))target.querySelector('.production-records').scrollTop=scroll;
  [...target.querySelectorAll('details')].forEach((el,i)=>{if(opens.has(i))el.open=true;});
}
async function generateStory(){
  if(state.submitting)return;if(pendingReferenceUploads)throw new Error('参考图正在读取，请稍候。');const form=$('#story-form');updateStoryBudget();const unnamed=state.visualAssets.find(a=>!a.name.trim());if(unnamed){state.visualSelections[unnamed.kind]=unnamed.id;renderVisualSettings(unnamed.kind);document.querySelector(`[data-asset-id="${unnamed.id}"][data-asset-field="name"]`)?.focus();}if(!form?.reportValidity())return;visualPayload(state.visualAssets,state.references);if(state.visualAssets.filter(a=>a.kind==='location').length>Number(form.elements.shot_count.value))throw new Error('场景数量不能超过镜头数量，请增加镜头数或移除场景。');
  state.submitting=true;$('#story-generate').disabled=true;
  try{
    if(!state.connected&&!await connect(false)){openSettings();throw new Error(state.connectionError);}
    const health=await api.request('/api/health',{publicRequest:true});const compatibility=backendCompatibilityError(health);if(compatibility)throw new Error(compatibility);
    if(!health.capabilities?.story_video)throw new Error('请重启本机服务以加载故事创作功能。');
    if(!health.capabilities?.visual_bindings)throw new Error('请重启本机服务以加载视觉设定绑定。');
    if(!health.capabilities?.story_controls)throw new Error('请重启本机服务以加载新的生成方式选项。');
    let models;try{models=modelCenter.generativePayload();}catch(error){navigate('models');throw error;}
    for(const key of ['duration','shot_count','max_iterations','target_score'])state.storyOptions[key]=Number(form.elements[key].value);
    for(const key of ['resolution','ratio'])state.storyOptions[key]=form.elements[key].value;
    state.storyOptions.audio=form.elements.audio.checked;writeStorage('formaweave.story-options',state.storyOptions);
    const {shot_count,max_iterations,target_score,auto_refine,continuity,...video}=state.storyOptions;
    if(pendingReferenceUploads)throw new Error('参考图正在读取，请稍候。');
    const visual=visualPayload(state.visualAssets,state.references);persistVisualAssets();
    const job=await api.request('/api/jobs',{method:'POST',body:{...models,...video,module:'video',creation_path:'generative',workflow:'story',topic:state.story.brief,references:visual.references,story:{shot_count,assets:visual.assets,auto_refine,continuity},vqqa:auto_refine?{max_iterations,target_score}:{max_iterations:0}},timeout:30000});
    state.jobs.unshift(job);state.active=job;activeProduction=null;state.logLines=[];state.cursor=0;state.tab='outline';navigate('studio','video','generative');toast('故事创作已加入队列。');
  }finally{state.submitting=false;if($('#story-generate'))$('#story-generate').disabled=false;localize();}
}

function updateStoryContent() {
  const target=$('#story-content');if(!target)return;
  document.querySelectorAll('[data-story-tab][role="tab"]').forEach(button=>{
    const selected=button.dataset.storyTab===state.storyTab;button.classList.toggle('active',selected);
    button.setAttribute('aria-selected',selected);button.tabIndex=selected?0:-1;
  });
  target.setAttribute('aria-labelledby',`story-tab-${state.storyTab}`);
  if(state.storyTab==='board') {
    const shot=state.shots.find(s=>s.id===state.selectedShot)||state.shots[0];const index=state.shots.indexOf(shot);
    target.innerHTML=`<div class="concept-stage"><img src="${storyIllustration(shot.id)}" data-user-content alt="${esc(shot.title)}"><div class="concept-topline"><span>分镜概念图 · 非生成视频</span><span>0${index+1} / 0${state.shots.length}</span></div><div class="concept-caption"><small>FINDING THE LIGHT</small><strong data-user-content>${esc(shot.title)}</strong><span data-user-content>${esc(shot.camera)}</span></div><span class="frame-corner top-left"></span><span class="frame-corner bottom-right"></span></div>
      <div class="filmstrip-heading"><strong>示例分镜<span id="shot-total">${state.shots.reduce((sum,s)=>sum+s.duration,0)} 秒 / ${state.shots.length} 个镜头</span></strong><span>点击镜头查看与编辑</span></div><div class="story-filmstrip">${state.shots.map((s,i)=>`<button class="shot-card ${s.id===shot.id?'selected':''}" data-shot="${s.id}" aria-pressed="${s.id===shot.id}"><span class="shot-thumbnail"><img src="${storyIllustration(s.id)}" alt=""><i>0${i+1}</i><small>${s.duration}s</small></span><span data-user-content>${esc(s.title)}</span></button>`).join('')}</div>
      <div class="shot-editor"><div class="shot-editor-heading"><strong>${icon('sliders')}镜头 0${index+1} · 画面与叙事</strong><label>时长<input type="number" min="1" max="30" step="1" data-shot-field="duration" value="${shot.duration}" aria-label="镜头时长（秒）">s</label></div><label class="ui-field">画面描述<textarea rows="2" maxlength="500" data-shot-field="description">${esc(shot.description)}</textarea></label><div class="shot-detail-row"><label class="ui-field">镜头语言<input maxlength="80" data-shot-field="camera" value="${esc(shot.camera)}"></label><label class="ui-field">旁白 / 台词<input maxlength="200" data-shot-field="narration" value="${esc(shot.narration)}"></label></div><p class="editor-hint">${icon('info')}这里编辑的是示例分镜；修改简报不会自动生成镜头。</p></div>`;
  } else if(state.storyTab==='direction') {
    target.innerHTML=`<div class="visual-bible"><div class="visual-bible-art"><img src="${storyIllustration('lighthouse')}" alt="寻光视觉设定概念图"><span>VISUAL BIBLE / 寻光</span></div><div class="bible-body"><div class="bible-heading"><div><span class="workspace-kicker">ONE STORY. ONE VISUAL WORLD.</span><h3>让每个镜头，都属于同一个世界。</h3></div>${icon('link')}</div><label class="ui-field">角色锚点<input data-story-field="character" maxlength="200" value="${esc(state.story.character)}"></label><label class="ui-field">场景锚点<input data-story-field="location" maxlength="200" value="${esc(state.story.location)}"></label><label class="ui-field">光线与视觉基调<textarea data-story-field="look" maxlength="300" rows="2">${esc(state.story.look)}</textarea></label><div class="bible-palette"><span>示例色彩</span>${['#344F53','#8FA5A0','#D9CBB3','#C58866','#E8D5BB'].map(color=>`<i style="background:${color}" title="${color}"></i>`).join('')}<small>海蓝 / 暖沙 / 陶土</small></div><p class="editor-hint">视觉锚点用于表达跨镜头的一致性意图，当前不执行模型约束。</p></div></div>`;
  } else {
    const workflow=[['compass','探索创作方向','比较表达策略、叙事方式与美学，确定作品的方向。'],['file','组织故事与剧本','把创作意图组织成有起承转合的叙事。'],['link','建立一致性资产','明确人物、场景与视觉基调，作为跨镜头的参考。'],['layers','设计与审阅分镜','安排画面内容、镜头语言和节奏。'],['film','逐镜头生成影像','未来接入扩散 / 流匹配模型，生成每个镜头。'],['eye','审阅、反馈与精修','检查人物与叙事连续性，对局部问题反复修订。'],['check','组接成片','让镜头、声音和节奏成为完整的作品。']];
    target.innerHTML=`<div class="workflow-preview"><div class="workflow-intro"><span class="preview-pill">流程设计 · 尚未执行</span><h3>创作不是一次输出，<br>而是不断靠近你的意图。</h3><p>在整体方向与局部镜头之间，保留审阅和调整的空间。</p></div><ol class="director-steps">${workflow.map(([glyph,title,description],i)=>`<li><span class="director-step-icon">${icon(glyph)}</span><div><small>0${i+1}</small><strong>${title}</strong><p>${description}</p></div></li>`).join('')}</ol><div class="refinement-note">${icon('refresh')}审阅反馈 → 局部修订 → 再次审阅<span>交互流程示意</span></div></div>`;
  }
}
function persistVisualAssets(){writeStorage(visualAssetStorageKey,assetMetadata(state.visualAssets));}
function updateVisualSummary(){
  const target=$('#visual-settings-summary');if(!target)return;
  const people=state.visualAssets.filter(a=>a.kind==='character').length,places=state.visualAssets.filter(a=>a.kind==='location').length,style=state.visualAssets.some(a=>a.kind==='style');
  target.textContent=getUILanguage()==='en'?`${people} characters · ${places} locations · ${style?'Style set':'Automatic style'}`:`${people} 个人物 · ${places} 个场景 · ${style?'已设置风格':'自动规划风格'}`;
}
function renderVisualSettings(kind){
  const target=$('#visual-settings');if(!target)return;
  state.visualSelections=selectedVisualAssets(state.visualAssets,state.visualSelections);
  const panel=kind&&target.querySelector(`[data-visual-panel="${kind}"]`);
  if(panel){panel.innerHTML=visualAssetPanel(state.visualAssets,state.references,kind,state.visualSelections[kind]);$('#visual-image-count').textContent=`${state.references.length} / 8 ${uiText('张参考图')}`;}
  else target.innerHTML=visualAssetCards(state.visualAssets,state.references,state.visualSelections);
  target.querySelectorAll('[data-add-asset-reference]').forEach(button=>{button.disabled=state.references.length>=8||state.references.filter(r=>r.asset_id===button.dataset.addAssetReference).length>=3;});
  updateVisualSummary();localize();
}
let pendingReferenceUploads=0,referenceUploadQueue=Promise.resolve();
function queueReferences(files,assetId){
  const asset=state.visualAssets.find(a=>a.id===assetId);if(!asset)return Promise.resolve();
  pendingReferenceUploads++;
  const task=referenceUploadQueue.catch(()=>{}).then(()=>addReferences(files,asset));
  referenceUploadQueue=task;
  return task.finally(()=>{pendingReferenceUploads--;renderVisualSettings(asset.kind);});
}
async function addReferences(files,asset){
  for(const file of files){
    if(!state.visualAssets.includes(asset))return;
    if(state.references.filter(r=>r.asset_id===asset.id).length>=3)throw new Error('每个视觉对象最多添加 3 张参考图。');
    if(state.references.length>=8)throw new Error('整个故事最多添加 8 张参考图。');
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8*1024*1024)throw new Error('请选择不超过 8 MB 的 PNG、JPG 或 WebP 图片。');
    if(state.references.reduce((sum,r)=>sum+referenceBytes(r),0)+file.size>32*1024*1024)throw new Error('故事参考图合计不能超过 32 MB。');
    const url=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('参考图读取失败。'));reader.readAsDataURL(file);});
    const image=new Image();image.src=url;await image.decode();
    if(Math.min(image.naturalWidth,image.naturalHeight)<240||Math.max(image.naturalWidth,image.naturalHeight)>8000||Math.max(image.naturalWidth,image.naturalHeight)/Math.min(image.naturalWidth,image.naturalHeight)>8)throw new Error('参考图边长须为 240–8000 像素，长宽比不超过 8:1。');
    if(!state.visualAssets.includes(asset))return;
    state.references.push({id:'ref-'+crypto.randomUUID(),asset_id:asset.id,name:file.name,url,size:file.size});
  }
}
function renderHybrid() {
  const presets=[['structure','结构到影像','用程序确定几何与镜头，再生成视觉外观。'],['polish','动画到质感','保留已有运动，用模型补充光影与细节。'],['assets','素材到场景','先生成视觉素材，再编排到程序场景中。']];
  $('#main').innerHTML=`${workspaceIntro()}<div class="workspace-heading"><div><span class="workspace-kicker">HYBRID CREATION</span><h2>精确的骨架，自由的想象。</h2></div><p>让确定性的结构与运动，<br>遇见生成式的外观与细节。</p></div>${previewNotice()}<div class="hybrid-layout"><section class="panel hybrid-panel"><div class="panel-heading"><h2 class="panel-title">${icon('weave')}设计你的创作组合</h2><span class="quiet-label">CODE × MODELS</span></div><div class="hybrid-presets">${presets.map(([id,title,description],i)=>`<button data-hybrid-preset="${id}" class="hybrid-preset ${state.hybridPreset===id?'selected':''}" aria-pressed="${state.hybridPreset===id}"><span>0${i+1}</span><div><strong>${title}</strong><small>${description}</small></div>${icon('arrow')}</button>`).join('')}</div><label class="ui-field hybrid-brief-label" for="hybrid-brief">描述结构与外观如何配合<textarea id="hybrid-brief" data-story-field="hybridBrief" rows="4" maxlength="1000">${esc(state.story.hybridBrief)}</textarea></label><div class="hybrid-constraints"><span class="style-label">希望保留的程序约束</span><label><input type="checkbox" checked>几何结构</label><label><input type="checkbox" checked>镜头运动</label><label><input type="checkbox" checked>时间与节奏</label></div><label class="hybrid-range">生成式外观的影响程度<span id="hybrid-strength-value">${state.hybridStrength}%</span><input id="hybrid-strength" type="range" min="0" max="100" value="${state.hybridStrength}"><small>更贴近结构<span>更多生成式细节</span></small></label><div class="story-actions"><button class="secondary-button" data-action="save-story">${icon('file')}保存创作意图</button><button class="primary-button" data-path="program">进入程序构建${icon('arrow')}</button></div><button class="generate-button future-generate" disabled>${icon('weave')}开始混合创作<span>流程接入后开放</span></button></section><section class="panel hybrid-canvas"><div class="preview-header"><h2 class="panel-title">${icon('layers')}从结构，到想象</h2><span class="preview-pill">流程概念示意</span></div><div class="hybrid-comparison"><div class="hybrid-visual"><img src="${storyIllustration('lighthouse',{wireframe:true})}" alt="灯塔场景的程序结构示意"><span>01 / 程序骨架</span></div><div class="hybrid-bridge">${icon('weave')}</div><div class="hybrid-visual"><img src="${storyIllustration('lighthouse')}" alt="灯塔场景的外观概念插画"><span>02 / 生成式外观示意</span></div></div><div class="hybrid-canvas-caption"><span class="workspace-kicker">STRUCTURE MEETS IMAGINATION</span><h3>让可控与意外，<br>在同一个画面里发生。</h3><p>保留场景骨架与相机路径，以生成模型补充材质、氛围和细节。也可以反向组合，将生成素材带入程序世界。</p></div><div class="hybrid-flow">${[['code','程序结构'],['camera','运动约束'],['sparkles','外观生成'],['film','合成输出']].map(([glyph,name],i)=>`<span>${icon(glyph)}${name}</span>${i<3?icon('arrow'):''}`).join('')}</div><p class="editor-hint">插画与流程均为设计示意，当前未执行生成或渲染。</p></section></div>`;
}
function updateHybridPreview() {
  if(!$('.hybrid-canvas'))return;
  const reverse=state.hybridPreset==='assets',polish=state.hybridPreset==='polish';
  const visuals=document.querySelectorAll('.hybrid-visual');
  visuals.forEach((visual,i)=>{visual.querySelector('img').src=storyIllustration('lighthouse',{wireframe:reverse?i===1:i===0});visual.querySelector('img').alt=reverse?(i===0?'生成素材的概念插画':'程序编排的场景结构示意'):(i===0?'程序结构示意':'生成式外观概念插画');visual.querySelector('span').textContent=reverse?(i===0?'01 / 生成素材示意':'02 / 程序场景编排'):polish?(i===0?'01 / 原始动画结构':'02 / 光影与材质示意'):(i===0?'01 / 程序骨架':'02 / 生成式外观示意');});
  $('.hybrid-canvas .preview-header h2').innerHTML=icon('layers')+(reverse?'从素材，到场景':polish?'保留运动，丰富质感':'从结构，到想象');
  const steps=reverse?[['sparkles','生成素材'],['layers','程序编排'],['camera','交互约束'],['film','渲染输出']]:polish?[['film','原始动画'],['link','保留运动'],['sparkles','光影材质'],['film','合成输出']]:[['code','程序结构'],['camera','运动约束'],['sparkles','外观生成'],['film','合成输出']];
  $('.hybrid-flow').innerHTML=steps.map(([glyph,name],i)=>`<span>${icon(glyph)}${name}</span>${i<3?icon('arrow'):''}`).join('');
  $('.hybrid-canvas-caption p').textContent=reverse?'先构思并生成角色、场景或材质素材，再放入程序场景，组织空间、行为与交互。':'保留场景骨架与相机路径，以生成模型补充材质、氛围和细节。也可以反向组合，将生成素材带入程序世界。';
  document.querySelectorAll('.hybrid-constraints input').forEach((input,i)=>{input.dataset.hybridLock=String(i);input.checked=state.hybridLocks[i];});
}
function updateStyleSelection() {
  const selected=styles.find(style=>style.id===state.draft.styleId);
  document.querySelectorAll('[data-style]').forEach(button=>{
    const style=styles.find(style=>style.id===button.dataset.style);
    button.classList.toggle('selected',style.id===selected.id);
    button.setAttribute('aria-pressed',style.id===selected.id);
    const art=button.querySelector('.style-art');
    art.style.backgroundColor=style.palette.background;art.style.color=style.palette.primary;
    art.style.setProperty('--preview-grid',style.palette.grid);
    art.style.setProperty('--preview-secondary',style.palette.secondary);
    art.style.setProperty('--preview-tertiary',style.palette.tertiary);
  });
  const description=$('#style-description');
  if(description) description.textContent=`${selected.name} · 背景 ${selected.palette.background} · 新任务与离线测试均生效，已有视频保持原样`;
}
function updateJobCount() { $('#project-count').textContent=state.jobs.length; }
function jobCard(job) {
  const poster=fileFor(job,'image'); const video=fileFor(job,'video');
  return `<article class="job-card ${job.id===state.active?.id?'active-job':''}"><button class="job-image" data-action="view-job" data-job="${job.id}" data-i18n-keep="aria-label" aria-label="${uiText('查看')} ${esc(job.title)}">${poster?`<img src="${esc(api.fileURL(job.id,poster.path))}" data-user-content alt="${esc(job.title)}" loading="lazy">`:`<span class="job-placeholder">${icon(job.status==='running'?'refresh':'film',job.status==='running'?'loading-spinner':'')}</span>`}<span class="status-badge">${esc(statusNames[job.status]||job.status)}</span></button><div class="job-card-body"><h3 data-user-content title="${esc(job.title)}">${esc(job.title)}</h3><div class="job-meta"><span>${shortDate(job.created_at)}</span><span>${esc((job.config.quality||'').split(' ').pop())} · ${job.config.creation_path==='generative'?(job.config.workflow==='story'?'故事创作':'视频创作'):job.config.demo?'离线测试':'Manim'}</span></div><div class="job-actions"><button data-action="view-job" data-job="${job.id}">${icon('play')}查看</button>${video?`<a href="${esc(api.fileURL(job.id,video.path,true))}" download>${icon('download')}MP4</a>`:''}<button data-action="reuse" data-job="${job.id}" title="用此设置重新创作">${icon('refresh')}复用</button>${terminal(job)?`<button class="delete-job" data-action="delete" data-job="${job.id}" aria-label="删除作品">${icon('trash')}</button>`:`<button class="delete-job" data-action="cancel" data-job="${job.id}" title="停止任务">${icon('stop')}</button>`}</div></div></article>`;
}
function updateRecent(force=false) {
  updateJobCount();
  const target=$('#recent-jobs'); if(!target) return;
  const key=JSON.stringify(state.jobs.map(j=>[j.id,j.status,j.artifacts?.length]));
  if(!force && key===state.recentKey) return; state.recentKey=key;
  target.innerHTML=state.jobs.length?`<div class="job-grid">${state.jobs.slice(0,3).map(jobCard).join('')}</div>`:`<div class="recent-empty"><div><span class="empty-icon">${icon('folder')}</span><div><strong>你的下一个作品，从这里开始</strong><p>还没有创作？用一次离线渲染，点亮你的工作空间。</p></div></div><button data-action="demo">${icon('play')}试试离线渲染</button></div>`;
}
function updatePipeline() {
  const target=$('#pipeline'); if(!target) return;
  const job=state.active;
  const generative=job?.config.creation_path==='generative'||(!job&&state.path==='generative');
  const features=job?.config.story||state.storyOptions;
  let pipelineStages=generative&&(!job||job.config.workflow==='story')?[{id:'preflight',name:'模型准备',icon:'eye'},{id:'plan',name:'故事分镜',icon:'file'},{id:'generate',name:'生成镜头',icon:'film'},{id:'review',name:'画面审阅',icon:'eye'},{id:'memory',name:'保持连贯',icon:'link'},{id:'assemble',name:'组接成片',icon:'check'}]:generative?[{id:'preflight',name:'视觉预检',icon:'eye'},{id:'generate',name:'生成视频',icon:'film'},{id:'questions',name:'动态提问',icon:'file'},{id:'answers',name:'视觉问答',icon:'eye'},{id:'global_score',name:'全局评分',icon:'check'},{id:'refine',name:'提示词改进',icon:'refresh'}]:job&&(!job.config.narration_language||job.config.narration_language==='none')?stages.filter(s=>!['narration','tts'].includes(s.id)):stages;
  if(generative&&(!job||job.config.workflow==='story'))pipelineStages=pipelineStages.filter(s=>(s.id!=='memory'||features.continuity!==false)&&(s.id!=='review'||features.auto_refine!==false||features.continuity!==false));
  let index=pipelineStages.findIndex(s=>s.id===(job?.stage==='continuity_plan'?'plan':job?.stage==='refine'&&job.config.workflow==='story'?'review':job?.stage));
  if(job?.status==='completed') index=pipelineStages.length;
  const wasOpen=$('#task-logs')?.open;
  const oldLog=$('#log-content');const logScroll=oldLog?.scrollTop||0;
  const followLog=!oldLog || oldLog.scrollHeight-oldLog.clientHeight-logScroll<10;
  const label=job?(statusNames[job.status]||'准备中'):'等待你的第一个想法';
  target.innerHTML=`<div class="pipeline-header"><strong>从灵感到成片</strong><span>${job?esc(label):generative?esc(uiText(generationMode(features).title)):'7 STEPS'}</span></div><div class="pipeline-stages">${pipelineStages.map((s,i)=>`<div class="pipeline-step ${i<index?'done':i===index&&job?.status==='running'?'running':''}"><span>${icon(i<index?'check':s.icon)}</span>${s.name}</div>`).join('')}</div>${job?`<div class="task-progress"><div class="progress-track"><i id="progress-width"></i></div><div class="progress-detail"><span>${esc(label)} · ${job.progress}%${job.tokens?.total_tokens?` · ${job.tokens.total_tokens.toLocaleString()} tokens`:''}</span>${!terminal(job)?`<button data-action="cancel" data-job="${job.id}">${icon('stop')}停止</button>`:`<button data-action="${job.config.demo?'demo':'reuse'}" data-job="${job.id}">重新创作${icon('refresh')}</button>`}</div></div>${job.error?`<div class="error-box" data-user-content>${esc(jobErrorMessage(job))}</div>`:''}<details id="task-logs" class="logs-panel" ${wasOpen?'open':''}><summary>查看运行日志</summary><pre id="log-content"></pre></details>`:`<div class="pipeline-note">${icon('info')}生成后可查看各阶段的结果与运行日志。</div>`}`;
  if($('#progress-width')) $('#progress-width').style.width=`${Math.max(0,Math.min(100,job.progress))}%`;
  if($('#log-content')) {const log=$('#log-content');log.textContent=state.logLines.join('').replace(/^@@CODE2X.*$/gm,'').replace(/\bVQQA\b/gi,'创作').replace(/\bCANVAS\b/g,'故事').trim() || '等待生成日志…';log.scrollTop=followLog?log.scrollHeight:logScroll;}
}
function updatePreview(force=false) {
  const target=$('#preview-body');if(!target) return;
  const job=state.active; const key=JSON.stringify([job?.id,state.tab,job?.status,job?.artifacts?.map(a=>[a.path,a.size])]);
  if(!force&&key===state.previewKey) return; state.previewKey=key;
  document.querySelectorAll('[data-tab]').forEach(el=>{const selected=el.dataset.tab===state.tab;el.classList.toggle('active',selected);el.setAttribute('aria-selected',selected);el.tabIndex=selected?0:-1;});
  target.setAttribute('aria-labelledby',`tab-${state.tab}`);
  $('#preview-badge').textContent=job?(statusNames[job.status]||'准备中'):state.path==='generative'?'STORY':'INSPIRATION';
  if(state.path==='generative'&&!fileFor(job,'video')&&state.tab==='preview'){
    target.innerHTML=`<div class="empty-pane">${icon('film')}<p>${job?(terminal(job)?esc(statusNames[job.status])+'，请查看运行日志。':'正在逐镜头创作，完成后将自动组接。可在故事分镜中查看进度。'):'写下故事简报，设置镜头数量与总时长，开始创作。'}</p></div>`;return;
  }
  if(state.path==='generative'&&state.tab!=='preview'){renderProductionTab();return;}
  if(state.tab==='preview') {
    const video=fileFor(job,'video'); const poster=fileFor(job,'image');
    const vtt=job?.artifacts?.find(a=>a.name==='subtitles.vtt');
    const voiced=job?.config.narration_language && job.config.narration_language!=='none';
    const track=vtt?`<track kind="subtitles" src="${esc(api.fileURL(job.id,vtt.path))}" srclang="${job.config.narration_language==='zh-CN'?'zh':'en'}" label="${job.config.narration_language==='zh-CN'?'中文':'English'}" ${job.config.burn_subtitles?'':'default'}>`:'';
    const downloads=voiced?`<div class="speech-downloads"><span>${icon('volume')}${job.config.narration_language==='zh-CN'?'中文解说':'English narration'} · AI 合成配音</span>${['narration.wav','subtitles.srt','subtitles.vtt','timeline.json'].map(name=>{const file=job.artifacts.find(a=>a.name===name);return file?`<a href="${esc(api.fileURL(job.id,file.path,true))}" download>${name==='narration.wav'?'配音 WAV':name==='timeline.json'?'时间轴 JSON':name.endsWith('.srt')?'字幕 SRT':'字幕 VTT'}</a>`:'';}).join('')}</div>`:'';
    const illustration=styles.find(style=>style.id===(job?.config.style_id || state.draft.styleId)) || styles[0];
    target.innerHTML=video?`<div class="video-stage"><video id="result-video" crossorigin="anonymous" controls playsinline preload="metadata" ${poster?`poster="${esc(api.fileURL(job.id,poster.path))}"`:''} src="${esc(api.fileURL(job.id,video.path))}">${track}</video></div><div class="preview-caption"><div><strong data-user-content>${esc(job.title)}</strong><p>${esc(job.config.quality)} · ${sizeText(video.size)} · ${job.config.demo?'离线测试视频':'实际生成视频'}<br>${job.config.creation_path==='generative'?(job.config.workflow==='story'?'多镜头故事 · 逐镜头审阅':'视频创作 · 画面审阅'):'成品风格：'+esc(job.config.style_name || "旧版本（未记录风格）")}<br><span id="actual-video-settings">正在读取实际视频参数…</span></p></div><button data-action="download" data-job="${job.id}">${icon('download')}下载 MP4</button></div>${downloads}`:
      `<div class="video-stage"><img src="${esc(stylePreview(illustration,getUILanguage()))}" alt="灵感示意：用几何图形可视化勾股定理"><span class="preview-sample-label">${esc(illustration.name)} · 设计示意</span><button class="preview-play" data-action="demo" aria-label="运行真实离线渲染测试">${icon('play')}</button></div><div class="video-bar">${icon('play')}<span>—:—</span><span class="track"></span><span>16:9</span>${icon('volume')}</div><div class="preview-caption"><div><strong>${job?'正在把想法变成画面':'把公式，变成看得见的故事'}</strong><p>${job?'完成渲染后，成品会出现在这里':'点击播放按钮，运行真实的离线渲染测试'}</p></div><button data-action="${job?'help':'demo'}">${icon(job?'info':'play')}${job?'生成说明':'试运行'}</button></div>`;
    if(video)showActualVideoSettings(job);
  } else {
    const files=(job?.artifacts||[]).filter(a=>state.tab==='source'?(job?.config.creation_path==='generative'?a.name.endsWith('.json'):(a.name.endsWith('.py')||a.name.endsWith('.partial.txt'))):a.name.endsWith('.json')).sort((a,b)=>Number(b.name==='vqqa-report.json')-Number(a.name==='vqqa-report.json')||Number(a.name.startsWith('_'))-Number(b.name.startsWith('_')));
    if(!files.length) {target.innerHTML=`<div class="empty-pane">${icon(state.tab==='source'?'code':'layers')}<p>${state.tab==='source'?'生成的 Manim 源码将在这里显示。':'内容大纲与分镜将在规划完成后显示。'}<br>每一个画面，都有迹可循。</p>${job?'':'<button class="secondary-button" data-action="demo">试试离线渲染</button>'}</div>`;return;}
    target.innerHTML=`<div class="source-view"><select id="source-file" aria-label="选择文件">${files.map(a=>`<option value="${esc(a.path)}">${esc(a.name)}</option>`).join('')}</select><pre id="source-content">正在读取…</pre></div><div class="preview-caption"><div><strong>${state.tab==='source'?'可复现、可修改的动画代码':'从内容规划到分镜设计'}</strong><p>当前任务实际生成的文件</p></div><button data-action="archive" data-job="${job.id}">${icon('download')}源码包</button></div>`;
    loadSource(files[0].path);
  }
}
async function loadSource(path) {
  const request=++sourceRequest; const jobId=state.active?.id;
  try {
    const response=await fetch(api.fileURL(jobId,path),{signal:AbortSignal.timeout(8000)});
    if(!response.ok) throw new Error('文件读取失败，请重新连接服务。');
    const text=await response.text(); if(request===sourceRequest&&jobId===state.active?.id&&$('#source-content')) $('#source-content').textContent=text;
  } catch(error){if(request===sourceRequest&&$('#source-content')) $('#source-content').textContent=error.message;}
}
function showActualVideoSettings(job) {
  const video=$('#result-video');const output=$('#actual-video-settings');
  if(!video||!output)return;
  let actualFPS=null;
  const format=seconds=>{const total=Math.round(seconds);return `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;};
  const show=(duration,width,height,fps)=>{
    if(state.active?.id!==job.id||$('#actual-video-settings')!==output)return;
    output.textContent=`${job.config.mode==='evaluate'?'已有视频':job.config.demo?'试运行固定短片':`目标 ${job.config.duration} ${job.config.creation_path==='generative'?'秒':'分钟'}`} · 实际 ${format(duration)} · ${width}×${height}${fps?` · ${fps} fps`:''}`;
  };
  video.addEventListener('loadedmetadata',()=>show(video.duration,video.videoWidth,video.videoHeight,actualFPS),{once:true});
  if(video.readyState>=1)show(video.duration,video.videoWidth,video.videoHeight);
  const file=job.artifacts.find(a=>a.name==='render-report.json');
  if(file)fetch(api.fileURL(job.id,file.path)).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(r=>{actualFPS=r.fps;show(r.duration,r.width,r.height,r.fps);}).catch(()=>{});
}
async function selectJob(id, navigateTo=true) {
  if(!state.connected)return openSettings();
  const data=await api.request(`/api/jobs/${id}`);
  state.active=data.job;state.logLines=data.logs.lines;state.cursor=data.logs.cursor;state.tab='preview';
  if(navigateTo)navigate('studio','video',data.job.config.creation_path||'program');else {updatePreview(true);updatePipeline();updateProductionReport();}
}
function renderProjects() {
  $('#main').innerHTML=`<section class="page-heading"><span class="eyebrow">YOUR CREATIVE LIBRARY</span><h1>让每个想法，都有作品。</h1><p>视频、分镜和代码，保存在你自己的工作空间里。</p></section><div class="project-toolbar"><div class="filter-buttons">${[['all','全部作品'],['completed','已完成'],['running','进行中'],['failed','未完成']].map(([id,name])=>`<button data-filter="${id}" class="${state.filter===id?'active':''}">${name}</button>`).join('')}</div><input id="project-search" class="search-input" placeholder="搜索你的作品…" aria-label="搜索作品" value="${esc(state.query)}"></div><div id="project-list"></div>`;
  updateProjectList();
  const note=document.createElement('p');note.className='editor-hint';
  const limit=state.health?.job_retention_limit||10;
  note.textContent=getUILanguage()==='en'?`Only the ${limit} most recent creations are kept. Older creations and their files are automatically removed; active tasks are kept until they finish.`:`仅保留最近 ${limit} 个作品，过期作品及其文件自动清理；活动任务结束后再清理。`;
  $('.page-heading').append(note);
}
function updateProjectList() {
  const target=$('#project-list');if(!target) return;
  const jobs=state.jobs.filter(j=>(state.filter==='all'||(state.filter==='running'?!terminal(j):state.filter==='failed'?['failed','cancelled'].includes(j.status):j.status===state.filter))&&j.title.toLowerCase().includes(state.query.toLowerCase()));
  target.innerHTML=jobs.length?`<div class="job-grid">${jobs.map(jobCard).join('')}</div>`:`<div class="empty-page">${icon('folder')}<h3>${state.jobs.length?'没有符合条件的作品':'你的作品集，等待第一段故事'}</h3><p>${state.connected?'开始一次创作，或试试无需 API 的离线渲染。':'连接本地计算服务，即可查看保存的作品。'}</p><button class="primary-button" data-action="${state.connected?'new':'settings'}">${state.connected?'开始创作':'连接服务'}${icon('arrow')}</button></div>`;
}
function themePreview(theme){
  return `<span class="theme-preview" data-theme-preview="${theme.id}" data-motif="${theme.motif}" aria-hidden="true"><span class="mini-sidebar"><i class="mini-brand"></i><i class="mini-create"></i><i class="mini-nav"></i><i class="mini-nav active"></i><i class="mini-nav"></i><i class="mini-nav"></i><i class="mini-bottom"></i></span><span class="mini-workspace"><span class="mini-topbar"><i></i><b></b></span><span class="mini-main"><i class="mini-eyebrow"></i><i class="mini-title"></i><i class="mini-subtitle"></i><span class="mini-choices"><i></i><i></i><i></i></span><span class="mini-panels"><span class="mini-form"><b></b><i class="mini-input"></i><span class="mini-fields"><i></i><i></i></span><i class="mini-cta"></i></span><span class="mini-scene"><i class="mini-orbit"></i><i class="mini-orb"></i><i class="mini-dot"></i></span></span></span></span></span>`;
}
function updateThemeSelection(){
  const theme=getUITheme();
  document.querySelectorAll('[data-theme-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.themeChoice===theme.id)));
  if($('#current-theme-name'))$('#current-theme-name').textContent=uiText(theme.name);
  localize();
}
function renderThemes(){
  $('#main').innerHTML=`<section class="theme-heading"><div><span class="eyebrow">为灵感，换一种氛围</span><h1>你的工作台，你的色彩。</h1><p>六种氛围，一个创作空间。选择你喜欢的主题，让整个界面一起焕新。</p></div><div class="theme-heading-art" aria-hidden="true"><i></i><i></i><i>${icon('palette')}</i></div></section><div class="theme-toolbar"><div class="theme-current" role="status" aria-live="polite"><i class="theme-current-dot"></i><span>当前主题</span><strong id="current-theme-name">${getUITheme().name}</strong></div><span class="theme-saved">${icon('check')}自动保存在此浏览器</span></div><div class="theme-grid" role="group" aria-label="选择界面主题">${uiThemes.map(theme=>`<button type="button" class="theme-card" data-theme-choice="${theme.id}" aria-pressed="${getUITheme().id===theme.id}" aria-labelledby="theme-name-${theme.id}" aria-describedby="theme-description-${theme.id}">${themePreview(theme)}<span class="theme-card-body"><span class="theme-card-heading"><span class="theme-card-name" id="theme-name-${theme.id}">${theme.name}</span><span class="theme-scheme">${icon(theme.scheme==='dark'?'moon':'sun')}${theme.scheme==='dark'?'深色':'浅色'}</span></span><span class="theme-mood">${theme.mood}</span><span class="theme-description" id="theme-description-${theme.id}">${theme.description}</span><span class="theme-card-footer"><span class="theme-palette" aria-hidden="true">${['sidebar','surface','accent','action','decor'].map(key=>`<i data-theme-swatch="${key}"></i>`).join('')}</span><span class="theme-use theme-use-active">${icon('check')}使用中</span><span class="theme-use theme-use-idle">应用主题${icon('arrow')}</span></span></span></button>`).join('')}</div><p class="theme-note">${icon('sliders')}<span>主题会同步调整背景、面板、文字、图标与控件。视频画面风格在创作设置中单独选择。</span></p>`;
  // CSSOM properties also work under the local server's strict style-src policy.
  for(const theme of uiThemes){
    const card=document.querySelector(`[data-theme-choice="${theme.id}"]`);
    for(const [key,value] of Object.entries(theme.tokens))card.querySelector('.theme-preview').style.setProperty('--p-'+key,value);
    card.querySelectorAll('[data-theme-swatch]').forEach(swatch=>swatch.style.setProperty('--swatch',theme.tokens[swatch.dataset.themeSwatch]));
  }
}
function applyTemplate(id) {
  const template=templates.find(t=>t.id===id);if(!template)return;
  state.draft.topic=template.prompt;state.draft.styleId=template.style;persistDraft();navigate('studio','video','program');$('#topic')?.focus();
}
function openSettings() {
  const form=$('#settings-form');
  for(const [k,v] of Object.entries(state.config)) if(form.elements[k])form.elements[k].value=v;
  form.elements.endpoint.value=api.endpoint;form.elements.token.value=api.token;
  updateSpeechSettings();
  if(!$('#settings-dialog').open)$('#settings-dialog').showModal();
}
function updateSpeechSettings() {
  const form=$('#settings-form');
  const enabled=form.elements.tts_provider.value==='api';
  $('#speech-api-fields').hidden=!enabled;
  for(const name of ['tts_base_url','tts_model','tts_voice_zh','tts_voice_en']) form.elements[name].required=enabled;
}
function collectSettings() {
  const form=$('#settings-form'); const result={};
  for(const key of [...preferenceKeys,'api_key','tts_api_key'])result[key]=form.elements[key]?(typeof defaults[key]==='number'?Number(form.elements[key].value):form.elements[key].value.trim()):state.config[key];
  return result;
}
function configureEndpoint(endpoint, token) {
  const previous=api.endpoint,previousToken=api.token;api.configure(endpoint,token);
  if(previous!==api.endpoint||previousToken!==api.token){connectionRevision++;state.connectionKind='';state.backendError='';setConnection(false,'正在检查计算服务…');}
  if(previous!==api.endpoint){state.jobs=[];state.active=null;state.health=null;state.logLines=[];state.cursor=0;}
}
async function connectFromForm() {
  const form=$('#settings-form');configureEndpoint(form.elements.endpoint.value.trim(),form.elements.token.value);
  return connect(true);
}
async function saveSettings(event) {
  event.preventDefault(); if(!event.target.reportValidity())return;
  configureEndpoint(event.target.elements.endpoint.value.trim(),event.target.elements.token.value);
  state.config=collectSettings();
  writeStorage('code2x.preferences',Object.fromEntries(preferenceKeys.map(k=>[k,state.config[k]])));
  writeStorage('code2x.endpoint',api.endpoint);writeStorage('code2x.token',api.token,sessionStore);
  if(await connect(false)){$('#settings-dialog').close();toast('设置已保存。API Key 仅在当前页面会话中有效。');}
  else toast(state.connectionError,true);
}
async function generate(demo=false) {
  if(state.path!=='program'||state.module!=='video'){toast('此工作区目前为界面预览，请切换到程序构建生成视频。');return;}
  if(state.submitting)return;
  state.submitting=true;
  const button=$('#generate-button');if(button){button.disabled=true;button.innerHTML=`${icon('refresh','loading-spinner')}${state.connected?'正在创建任务…':'正在连接计算服务…'}`;}
  try {
    if(!state.connected&&!await connect(false)){openSettings();toast(state.connectionError,true);return;}
    const form=$('#create-form');
    if(form){state.draft.duration=Number(form.elements.duration.value);state.draft.quality=form.elements.quality.value;persistDraft();}
    if(!demo&&!state.draft.topic.trim()){$('#topic')?.focus();toast('写下你的想法，让创作开始。');return;}
    let models={};
    if(!demo){try{models=modelCenter.programPayload();}catch(error){navigate('models');toast(error.message,true);return;}}
    // Recheck the running process immediately before enqueueing; code can change after the page connects.
    const health=await api.request('/api/health',{publicRequest:true,timeout:4000});
    state.backendError=backendCompatibilityError(health);
    if(state.backendError){setConnection(false,state.backendError);throw new Error(state.backendError);}
    const job=await api.request('/api/jobs',{method:'POST',body:{...state.config,...models,...state.draft,style_id:state.draft.styleId,style:styles.find(s=>s.id===state.draft.styleId).prompt,module:'video',demo},timeout:10000});
    state.jobs.unshift(job);state.active=job;state.logLines=[];state.cursor=0;state.tab='preview';navigate('studio');
    toast(demo?(state.config.tts_provider==='api'&&state.draft.narration_language!=='none'?'测试渲染已开始，将调用所配置的语音 API。':'离线渲染已开始，无需调用模型 API。'):'任务已加入队列，可在工作台查看进度。');
  } finally {state.submitting=false;updateExecutionState();localize();}
}
async function refresh() {
  if(state.polling)return;
  if(!state.connected){if(!connectionAttempt&&Date.now()-lastConnectAt>=10000&&['','offline'].includes(state.connectionKind))await connect(false);return;}
  state.polling=true;
  try {
    const data=await api.request('/api/jobs');const oldJobs=state.jobs;state.jobs=data.jobs;
    for(const job of state.jobs){const old=oldJobs.find(j=>j.id===job.id);if(old&&!terminal(old)&&terminal(job))toast(`${job.config.demo?'离线测试':job.title.slice(0,18)}${job.status==='completed'?'已完成':' · '+statusNames[job.status]}`,job.status==='failed');}
    if(state.active){
      const old=state.active;
      if(!state.jobs.some(job=>job.id===old.id)){state.active=null;state.logLines=[];state.cursor=0;}
      else{const detail=await api.request(`/api/jobs/${old.id}?cursor=${state.cursor}`);state.active=detail.job;state.logLines.push(...detail.logs.lines);state.logLines=state.logLines.slice(-1000);state.cursor=detail.logs.cursor;}
      updatePreview();updatePipeline();updateProductionReport();
    }
    updateRecent(); if(state.view==='projects')updateProjectList();
  } catch(error) {
    const problem=connectionProblem(error,{health:state.health,token:api.token});
    state.connectionKind=problem.kind;setConnection(false,problem.message);toast(problem.message,true);
  } finally {state.polling=false;}
}
function download(url) {const a=document.createElement('a');a.href=url;a.download='';document.body.append(a);a.click();a.remove();}
function showInfo(kind) {
  $('#info-title').textContent=kind==='roadmap'?'Genesis · 创意工作室':'开始你的第一次创作';
  $('#info-body').innerHTML=kind==='roadmap'?`<p>以代码构建，以模型生成，让想象成形。从视频开始，逐步连接图像、三维、游戏和世界。</p>${modules.map(m=>`<div class="roadmap-row">${m.name}<span>${m.available?'已接入 · Manim':'规划中 · 预留适配器'}</span></div>`).join('')}<div class="info-callout">当前可用的是 Code2Video / Manim 动画。生成式模型、世界模型及混合工作流是后续研究方向，尚未开放生成功能。</div>`:
    `<h3>1. 启动计算服务</h3><p>双击项目中的 <code>Start-Code2X.cmd</code>，然后打开 <code>http://127.0.0.1:8765</code>。首次安装可运行 <code>Setup-Code2X.cmd</code>。</p><h3>2. 先试一次离线渲染</h3><p>点击“试试离线渲染”，会真实生成勾股定理与线性变换的测试视频，验证中文、数学公式、动画和合成。测试内容固定，使用当前所选视觉风格、画面语言和配音语言，不使用内容模型 API。本地语音无需密钥；若改用语音 API，离线测试也会调用该语音服务。</p><h3>3. 连接你的模型</h3><p>打开“模型中心”，配置一套共用 LLM / VLM 和视频模型。程序构建固定使用 Manim，无需为每个阶段分配模型。测试模型会产生一次小额文本调用。</p><h3>4. 从想法到成片</h3><p>描述主题、设定时长与质量，点击生成。完成后可播放 MP4、下载视频与源码包，在分镜和源码页查看实际生成文件。配音语言可选择中文、英文或无配音，独立于画面语言。Planner 完成分镜后先生成逐镜头解说与 TTS，再对齐动画、配音和字幕。可下载 WAV、SRT / VTT 与时间轴 JSON。配音由 AI 合成。</p><h3>在 GitHub Pages 上操作</h3><p>保持本地服务运行，在网页连接设置中填写本机地址与连接令牌。令牌可在本机工作台复制，或从 <code>data/access-token.txt</code> 读取。浏览器询问本地网络权限时需要允许。</p><div class="info-callout">GitHub Pages 负责界面，本地引擎负责生成。Python、依赖、FFmpeg、LaTeX 和缓存均在项目内。依赖隔离不等于代码安全沙箱；模型生成的 Python 代码以当前用户权限执行，仅连接可信模型和网页。</div><p>基于 <a href="https://github.com/showlab/Code2Video" target="_blank" rel="noreferrer">showlab / Code2Video</a> · MIT License</p>`;
  if(kind!=='roadmap')$('#info-body').insertAdjacentHTML('afterbegin','<h3>选择你的创作路径</h3><p><strong>程序构建</strong>使用现有 Code2Video / Manim 引擎；<strong>模型生成</strong>面向扩散与流匹配模型的故事创作；<strong>混合创作</strong>组合程序结构与生成式外观。模型生成支持故事规划、逐镜头创作、人物与场景参考、画面审阅和自动组接。混合创作目前为界面预览。视频之外的图像、三维、世界和游戏为规划中的工作区。</p>');
  $('#info-dialog').showModal();
}

document.addEventListener('click', async event=>{
  const el=event.target.closest('button,[data-view],[data-template],[data-close]');if(!el)return;
  try {
    if(el.dataset.close){$('#'+el.dataset.close).close();return;}
    if(el.dataset.themeChoice){setUITheme(el.dataset.themeChoice);updateThemeSelection();return;}
    if(el.dataset.path){navigate('studio',state.module,el.dataset.path);return;}
    if(el.dataset.storyTab){state.storyTab=el.dataset.storyTab;updateStoryContent();return;}
    if(el.dataset.shot){state.selectedShot=el.dataset.shot;updateStoryContent();return;}
    if(el.dataset.aesthetic){state.story.aesthetic=el.dataset.aesthetic;writeStorage('formaweave.story-draft',state.story);document.querySelectorAll('[data-aesthetic]').forEach(button=>{button.classList.toggle('selected',button.dataset.aesthetic===state.story.aesthetic);button.setAttribute('aria-pressed',button.dataset.aesthetic===state.story.aesthetic);});return;}
    if(el.dataset.addVisual){const asset=createVisualAsset(el.dataset.addVisual,state.visualAssets);state.visualAssets.push(asset);state.visualSelections[asset.kind]=asset.id;persistVisualAssets();renderVisualSettings(asset.kind);document.querySelector(`[data-select-visual="${asset.id}"]`)?.scrollIntoView({block:'nearest',inline:'nearest'});document.querySelector(`[data-asset-id="${asset.id}"][data-asset-field="name"]`)?.focus();return;}
    if(el.dataset.removeVisual){const kind=state.visualAssets.find(a=>a.id===el.dataset.removeVisual)?.kind;state.visualAssets=state.visualAssets.filter(a=>a.id!==el.dataset.removeVisual);state.references=state.references.filter(r=>r.asset_id!==el.dataset.removeVisual);persistVisualAssets();renderVisualSettings(kind);return;}
    if(el.dataset.selectVisual){const asset=state.visualAssets.find(a=>a.id===el.dataset.selectVisual);if(asset){state.visualSelections[asset.kind]=asset.id;renderVisualSettings(asset.kind);document.querySelector(`[data-select-visual="${asset.id}"]`)?.focus();}return;}
    if(el.dataset.addAssetReference){document.querySelector(`[data-asset-upload="${el.dataset.addAssetReference}"]`)?.click();return;}
    if(el.dataset.removeReference!==undefined){const ref=state.references.find(r=>r.id===el.dataset.removeReference),kind=state.visualAssets.find(a=>a.id===ref?.asset_id)?.kind;state.references=state.references.filter(r=>r.id!==el.dataset.removeReference);renderVisualSettings(kind);return;}
    if(el.dataset.hybridPreset){state.hybridPreset=el.dataset.hybridPreset;renderHybrid();updateHybridPreview();updateExecutionState();localize();return;}
    if(el.dataset.view){navigate(el.dataset.view);return;}
    if(el.dataset.module){navigate('studio',el.dataset.module);return;}
    if(el.dataset.template){applyTemplate(el.dataset.template);return;}
    if(el.dataset.tab){state.tab=el.dataset.tab;updatePreview();return;}
    if(el.dataset.style){state.draft.styleId=el.dataset.style;persistDraft();updateStyleSelection();if(!fileFor(state.active,'video'))updatePreview(true);return;}
    if(el.dataset.filter){state.filter=el.dataset.filter;renderProjects();return;}
    const id=el.dataset.job;
    switch(el.dataset.action){
      case 'visual-settings':$('#visual-settings')?.scrollIntoView({behavior:'smooth',block:'start'});break;
      case 'new':if(state.path==='generative'){state.active=null;activeProduction=null;Object.assign(state.story,{brief:'',character:'',location:'',look:''});writeStorage('formaweave.story-draft',state.story);state.visualAssets=[];state.visualSelections={};persistVisualAssets();state.references=[];state.tab='preview';}if(state.path==='program'){state.active=null;state.draft.topic='';state.tab='preview';persistDraft();}navigate('studio','video');$('#topic')?.focus();$('#story-brief')?.focus();$('#hybrid-brief')?.focus();break;

      case 'save-story':writeStorage('formaweave.story-draft',state.story);toast('创作简报已保存在本机。');break;
      case 'story-example':state.story=exampleStory();state.shots=localizedShots();state.selectedShot='coast';state.storyTab='board';writeStorage('formaweave.story-draft',state.story);navigate('studio','video','generative');break;
      case 'settings':openSettings();break;
      case 'model-center':$('#settings-dialog').close();navigate('models');break;
      case 'connect':el.disabled=true;try{await connectFromForm();}finally{el.disabled=false;}break;
      case 'copy-token':if(!api.token)throw new Error('请先在本机工作台连接服务。');await navigator.clipboard.writeText(api.token);toast('连接令牌已复制。');break;
      case 'token-defaults':for(const key of ['max_tokens','planning_max_tokens','repair_max_tokens','max_continuations'])$('#settings-form').elements[key].value=defaults[key];toast('已填入推荐输出预算，保存后用于新任务。');break;
      case 'help':showInfo('help');break;
      case 'roadmap':showInfo('roadmap');break;
      case 'demo':await generate(true);break;
      case 'view-job':await selectJob(id);break;
      case 'cancel':{const cloud=state.jobs.find(j=>j.id===id)?.config.creation_path==='generative';await api.request(`/api/jobs/${id}/cancel`,{method:'POST'});await refresh();if(cloud)toast('已停止本机等待。已提交的云端任务可能继续运行，请在服务商控制台查看。');break;}
      case 'reuse':{const job=state.jobs.find(j=>j.id===id);if(!job)return;const c=job.config;if(c.creation_path==='generative'){state.story.brief=c.topic;Object.assign(state.storyOptions,{duration:c.workflow==='story'?c.duration:30,shot_count:c.story?.shot_count||3,resolution:c.resolution,ratio:c.ratio,audio:c.audio,auto_refine:typeof c.story?.auto_refine==='boolean'?c.story.auto_refine:c.vqqa?.max_iterations!==0,continuity:c.story?.continuity!==false,max_iterations:Math.max(1,Math.min(2,c.vqqa?.max_iterations??1)),target_score:c.vqqa?.target_score??90});for(const k of ['character','location','look'])if(c.story?.[k]!==undefined)state.story[k]=c.story[k];state.visualAssets=loadVisualAssets(c.story?.assets??null,c.story||{});state.visualSelections={};persistVisualAssets();state.references=[];state.active=null;writeStorage('formaweave.story-draft',state.story);writeStorage('formaweave.story-options',state.storyOptions);navigate('studio','video','generative');toast('已复用提示词和参数；参考图请重新添加。');break;}Object.assign(state.draft,{topic:c.demo?'':c.topic,duration:c.duration,quality:c.quality,language:c.language,narration_language:c.narration_language||(lostNarrationConfig(job)?state.draft.narration_language:'none'),burn_subtitles:c.burn_subtitles!==false,styleId:c.style_id || (c.style?.includes("蓝图")?"blueprint":c.style?.includes("极简")?"minimal":"math")});state.active=null;persistDraft();navigate('studio','video','program');toast('已复用创作设置，可修改主题后重新生成。');break;}
      case 'download':{const job=state.jobs.find(j=>j.id===id)||state.active;const file=fileFor(job,'video');if(file)download(api.fileURL(id,file.path,true));break;}
      case 'archive':download(api.archiveURL(id));break;
      case 'delete':{
        $('#info-title').textContent='删除这份作品？';$('#info-body').innerHTML=`<p>这会删除此任务的视频、代码和日志。此操作无法撤销。</p><div class="info-callout">${esc(state.jobs.find(j=>j.id===id)?.title)}</div><button class="primary-button" data-action="confirm-delete" data-job="${id}">确认删除</button>`;$('#info-dialog').showModal();break;
      }
      case 'confirm-delete':await api.request(`/api/jobs/${id}`,{method:'DELETE'});if(state.active?.id===id)state.active=null;$('#info-dialog').close();await refresh();render();toast('作品已删除。');break;
    }
  }catch(error){toast(error.message,true);}
});
document.addEventListener('submit',event=>{
  if(event.target.id==='story-form'){event.preventDefault();generateStory().catch(e=>toast(e.message,true));}
  if(event.target.id==='create-form'){event.preventDefault();generate().catch(e=>toast(e.message,true));}
  if(event.target.id==='settings-form')saveSettings(event).catch(e=>toast(e.message,true));
});
document.addEventListener('input',event=>{
  if(event.target.dataset.assetField){const asset=state.visualAssets.find(a=>a.id===event.target.dataset.assetId);if(asset&&['name','description'].includes(event.target.dataset.assetField)){asset[event.target.dataset.assetField]=event.target.value;persistVisualAssets();if(event.target.dataset.assetField==='name'){const card=event.target.closest('[data-visual-object]');const tab=event.target.closest('[data-visual-panel]')?.querySelector(`[data-visual-name="${asset.id}"]`);if(tab)tab.textContent=asset.name||uiText('未命名');card?.querySelector('[data-remove-visual]')?.setAttribute('aria-label',uiText('移除设定')+' '+asset.name);card?.querySelector('[data-reference-drop]')?.setAttribute('aria-label',uiText('图片参考')+' '+asset.name);}}return;}
  if(event.target.closest('#story-form'))updateStoryBudget();
  if(event.target.dataset.storyField){const key=event.target.dataset.storyField;if(key in storyDefaults){state.story[key]=event.target.type==='checkbox'?event.target.checked:event.target.value;writeStorage('formaweave.story-draft',state.story);if(key==='brief'&&$('#story-count'))$('#story-count').textContent=`${state.story.brief.length} / 4000`;}return;}
  if(event.target.dataset.shotField){const shot=state.shots.find(s=>s.id===state.selectedShot);const key=event.target.dataset.shotField;if(shot&&['duration','description','camera','narration'].includes(key)){if(key==='duration'){const duration=Number(event.target.value);if(!Number.isInteger(duration)||duration<1||duration>30)return;shot.duration=duration;if($('#shot-total'))$('#shot-total').textContent=`${state.shots.reduce((sum,s)=>sum+s.duration,0)} 秒 / ${state.shots.length} 个镜头`;const durationLabel=document.querySelector(`[data-shot="${shot.id}"] small`);if(durationLabel)durationLabel.textContent=`${duration}s`;}else{shot[key]=event.target.value;if(key==='camera')document.querySelector('.concept-caption>span').textContent=shot.camera;}}return;}
  if(event.target.id==='hybrid-strength'){state.hybridStrength=Number(event.target.value);$('#hybrid-strength-value').textContent=state.hybridStrength+'%';return;}
  if(event.target.id==='topic'){state.draft.topic=event.target.value;$('#char-count').textContent=`${event.target.value.length} / 4000`;persistDraft();}
  if(event.target.id==='project-search'){state.query=event.target.value;updateProjectList();}
});
document.addEventListener('change',event=>{
  if(event.target.closest('#story-form')&&['auto_refine','continuity'].includes(event.target.name)){updateStoryBudget();updatePipeline();localize();return;}
  if(event.target.id==='ui-language'){switchLanguage(event.target.value);return;}
  if(event.target.dataset.hybridLock!==undefined){state.hybridLocks[Number(event.target.dataset.hybridLock)]=event.target.checked;return;}
  if(event.target.dataset.assetUpload){const files=Array.from(event.target.files),asset=event.target.dataset.assetUpload;event.target.value='';queueReferences(files,asset).catch(error=>toast(error.message,true));return;}
  if(event.target.matches('select[data-story-field]')){state.story[event.target.dataset.storyField]=event.target.value;writeStorage('formaweave.story-draft',state.story);return;}
  if(['duration','quality','language','narration_language'].includes(event.target.id)){state.draft[event.target.id]=event.target.id==='duration'?Number(event.target.value):event.target.value;persistDraft();}
  if(event.target.id==='burn_subtitles'){state.draft.burn_subtitles=event.target.checked;persistDraft();}
  if(event.target.name==='tts_provider')updateSpeechSettings();
  if(event.target.id==='source-file')loadSource(event.target.value);
  if(event.target.name==='provider'){
    const urls={'OpenAI 兼容':'https://api.openai.com/v1','Claude 原生':'https://api.anthropic.com','Gemini 原生':'https://generativelanguage.googleapis.com'};
    $('#settings-form').elements.base_url.value=urls[event.target.value];
  }
});
document.addEventListener('keydown',event=>{
  const switcher=event.target.closest('.visual-subject-switcher');
  if(switcher&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
    event.preventDefault();const tabs=[...switcher.querySelectorAll('[data-select-visual]')];let index=tabs.indexOf(event.target.closest('button'));
    if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else index=(index+(event.key==='ArrowLeft'?-1:1)+tabs.length)%tabs.length;
    tabs[index]?.click();return;
  }
  if((event.ctrlKey||event.metaKey)&&event.key==='Enter'&&$('#story-form')&&!document.querySelector('dialog[open]')){event.preventDefault();generateStory().catch(e=>toast(e.message,true));return;}
  if(event.target.matches('[data-theme-choice]')&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)){
    event.preventDefault();const cards=[...document.querySelectorAll('[data-theme-choice]')];let index=cards.indexOf(event.target);
    if(event.key==='Home')index=0;else if(event.key==='End')index=cards.length-1;else index=(index+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)+cards.length)%cards.length;
    cards[index].focus();return;
  }
  if(event.target.closest('.story-tabs')&&['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();const tabs=['board','direction','workflow'];state.storyTab=tabs[(tabs.indexOf(state.storyTab)+(event.key==='ArrowRight'?1:2))%3];updateStoryContent();$(`#story-tab-${state.storyTab}`).focus();return;}
  if(event.target.closest('.preview-tabs')&&['ArrowLeft','ArrowRight'].includes(event.key)){
    event.preventDefault();const tabs=['preview','outline','source'];const direction=event.key==='ArrowRight'?1:-1;state.tab=tabs[(tabs.indexOf(state.tab)+direction+3)%3];updatePreview();$(`#tab-${state.tab}`).focus();return;
  }
  if((event.ctrlKey||event.metaKey)&&event.key==='Enter'&&$('#create-form')&&!document.querySelector('dialog[open]')){event.preventDefault();generate().catch(e=>toast(e.message,true));}
  if(event.key.toLowerCase()==='n'&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.target.closest('input,textarea,select,dialog')){$('[data-action="new"]').click();}
});
document.addEventListener('dragover',event=>{const zone=event.target.closest('[data-reference-drop]');if(zone){event.preventDefault();zone.classList.add('drag-active');}});
document.addEventListener('dragleave',event=>{const zone=event.target.closest('[data-reference-drop]');if(zone&&!zone.contains(event.relatedTarget))zone.classList.remove('drag-active');});
document.addEventListener('drop',event=>{const zone=event.target.closest('[data-reference-drop]');if(zone){event.preventDefault();zone.classList.remove('drag-active');queueReferences(Array.from(event.dataTransfer.files),zone.dataset.referenceDrop).catch(error=>toast(error.message,true));}});
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
function readRoute(){
  const hash=location.hash.slice(1);const parts=hash.split('/');
  if(parts[0]==='studio'&&creationPaths.some(p=>p.id===parts[1])){state.view='studio';state.path=parts[1];state.module='video';history.replaceState(null,'',`#studio/${state.path}/video`);}
  else if(parts[0]==='module'&&modules.some(m=>m.id===parts[1])){state.view='studio';state.module='video';state.path='program';history.replaceState(null,'','#studio/program/video');}
  else if(['studio','projects','themes','templates','models'].includes(hash))state.view=hash==='templates'?'themes':hash;
}
window.addEventListener('storage',event=>{if(event.key===themeStorageKey||event.key===null){let id;try{id=JSON.parse(event.newValue??'null');}catch{}setUITheme(id,{persist:false});updateThemeSelection();}});
window.addEventListener('hashchange',()=>{readRoute();render();window.scrollTo({top:0,behavior:'instant'});});
window.addEventListener('resize',()=>requestAnimationFrame(scrollSelectedPath));
mountLanguageControl();hydrateIcons();startLocalization();
readRoute();
render();connect();setInterval(refresh,2000);
