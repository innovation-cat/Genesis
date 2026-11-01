// Persistent metadata and page-memory credentials deliberately travel separately.
export const modelStorageKey='genesis.models.v1';
export const protocols=[['openai','OpenAI 兼容'],['claude','Claude 原生'],['gemini','Gemini 原生'],['dashscope','阿里云百炼 · DashScope 视频'],['video','自定义视频 / 图像 API']];
export const modelKinds=[['text','语言模型 · LLM'],['vision','视觉语言模型 · VLM'],['video','视频生成模型'],['image','图像生成模型']];
export const paths=[['program','程序构建'],['generative','模型生成'],['hybrid','混合创作']];
export const stageCatalog={
  outline:{name:'Prompt 扩展与内容规划',kinds:['text','vision'],live:true},
  storyboard:{name:'分镜设计',kinds:['text','vision'],live:true},
  narration:{name:'解说撰写',kinds:['text','vision'],live:true},
  code:{name:'代码生成',kinds:['text','vision'],live:true},
  repair:{name:'代码修复',kinds:['text','vision'],live:true},
  video:{name:'视频生成',kinds:['video']},
  image:{name:'图像 / 关键帧生成',kinds:['image']},
  evaluation:{name:'视觉评估',kinds:['vision']},
};
export function stagesFor(path){return path==='program'?['outline','storyboard','narration','code','repair','evaluation']:path==='generative'?['outline','storyboard','image','video','evaluation']:['outline','storyboard','code','repair','image','video','evaluation'];}
export const parameterFields={
  text:[['max_tokens','输出 Token 预算',1,2147483647,1],['temperature','Temperature',0,2,0.1],['api_timeout','响应超时（秒）',30,3600,1],['api_retries','临时故障重试',0,5,1],['model_output_limit','模型单次输出上限',0,2147483647,1],['max_continuations','截断后最多续写',0,8,1]],
  video:[['duration','单镜头时长（秒）',1,120,1],['seed','Seed',0,2147483647,1],['steps','采样步数',1,1000,1],['guidance','Guidance',0,100,0.1]],
  image:[['seed','Seed',0,2147483647,1],['steps','采样步数',1,1000,1],['guidance','Guidance',0,100,0.1]],
};
export function fieldsFor(kind){return parameterFields[kind==='vision'?'text':kind]||[];}
export function cleanParams(value,kind){
  const result={};
  for(const [key,label,min,max,step] of fieldsFor(kind)){
    if(value?.[key]===undefined||value[key]==='')continue;
    const number=Number(value[key]);
    if(!Number.isFinite(number)||number<min||number>max||(step===1&&!Number.isInteger(number)))throw new Error(`${label}: ${min}–${max}`);
    result[key]=number;
  }
  if(['video','image'].includes(kind))for(const [key,allowed] of [['resolution',['480p','720p','1080p','4K']],['aspect_ratio',['16:9','9:16','1:1']]]){
    if(value?.[key]!==undefined&&value[key]!==''){
      if(!allowed.includes(value[key]))throw new Error(`Invalid ${key}`);
      result[key]=value[key];
    }
  }
  return result;
}
export function validURL(value){
  const url=new URL(value);
  if(!['http:','https:'].includes(url.protocol)||!url.hostname||url.username||url.password||url.search||url.hash)throw new Error('Base URL 必须是有效的 HTTP(S) 地址，不能包含密钥、参数或密码。');
  return value.replace(/\/$/,'');
}
export function wanBaseURL(value){
  const base=validURL(value.trim()),suffix='/services/aigc/video-generation/video-synthesis';
  return base.endsWith(suffix)?base.slice(0,-suffix.length):base;
}
export function initialModels(legacy={}){
  const protocol={'Claude 原生':'claude','Gemini 原生':'gemini'}[legacy.provider]||'openai';
  return {version:1,connections:[{id:'legacy',name:'默认语言服务',protocol,base_url:legacy.base_url||'https://api.gptsapi.net/v1',proxy:legacy.proxy||''}],profiles:[{id:'default-text',name:'默认语言模型',connection:'legacy',kind:'text',model:legacy.model||'gpt-6.1-terra',params:{api_timeout:legacy.api_timeout||600,api_retries:legacy.api_retries??3}}],defaultText:'default-text',routes:{program:{},generative:{},hybrid:{}}};
}
export function metadata(data){
  // Whitelist at every level: credentials can never be serialized by this module.
  return {version:1,defaultText:data.defaultText,connections:data.connections.map(c=>({id:c.id,name:c.name,protocol:c.protocol,base_url:c.base_url,proxy:c.proxy||''})),profiles:data.profiles.map(p=>({id:p.id,name:p.name,connection:p.connection,kind:p.kind,model:p.model,params:cleanParams(p.params,p.kind)})),routes:Object.fromEntries(paths.map(([path])=>[path,Object.fromEntries(stagesFor(path).map(stage=>{
    const binding=data.routes?.[path]?.[stage]||{};
    return [stage,{profile:binding.profile||'',params:cleanParams(binding.params,stageCatalog[stage].kinds[0])}];
  }))]))};
}
export function loadModels(saved,legacy){
  try{
    if(saved?.version!==1||!Array.isArray(saved.connections)||!Array.isArray(saved.profiles))return initialModels(legacy);
    const result=metadata(saved);
    for(const c of result.connections)if(!protocols.some(([id])=>id===c.protocol))throw new Error('protocol');
    for(const p of result.profiles)if(!modelKinds.some(([id])=>id===p.kind))throw new Error('kind');
    return result;
  }catch{return initialModels(legacy);}
}
export function resolveStage(data,path,stage){
  const binding=data.routes?.[path]?.[stage]||{};
  const inherited=!binding.profile;
  const profile=data.profiles.find(p=>p.id===(binding.profile||(stageCatalog[stage].kinds.includes('text')?data.defaultText:'')));
  if(!profile||!stageCatalog[stage].kinds.includes(profile.kind))return {binding,inherited,profile:null,connection:null,params:{}};
  return {binding,inherited,profile,connection:data.connections.find(c=>c.id===profile.connection),params:{...profile.params,...binding.params}};
}
export function runtimeModel(resolved,secrets){
  const {profile,connection,params}=resolved;
  if(!profile||!connection)throw new Error('请先分配模型配置。');
  if(!profile.model?.trim())throw new Error('请填写模型 ID。');
  if(!['openai','claude','gemini'].includes(connection.protocol))throw new Error('该模型接口尚未接入执行。');
  const api_key=secrets.get(connection.id)||'';
  if(!api_key)throw new Error(`API Key · ${connection.name}`);
  return {provider:protocols.find(([id])=>id===connection.protocol)[1],base_url:validURL(connection.base_url),proxy:connection.proxy||'',api_key,model:profile.model,...params,profile_name:profile.name};
}
export function programModels(data,secrets,{voiced=true}={}){
  const stage_models={};
  for(const stage of stagesFor('program').filter(s=>stageCatalog[s].live&&(s!=='narration'||voiced)))stage_models[stage]=runtimeModel(resolveStage(data,'program',stage),secrets);
  return {...Object.fromEntries(['provider','base_url','api_key','model','profile_name'].map(key=>[key,stage_models.code[key]])),stage_models};
}

// Current studio scope: one shared LLM/VLM and one DashScope Wan connection.
// Keep previous advanced metadata untouched so simplifying the UI loses no saved setup.
export const simpleModelStorageKey='genesis.models.simple.v1';
export function simpleMetadata(data){
  const text=data.text||{},wan=data.wan||{};
  const string=(value,fallback='',limit=200)=>typeof value==='string'?value.slice(0,limit):fallback;
  return {version:1,text:{protocol:['openai','claude','gemini'].includes(text.protocol)?text.protocol:'openai',
    model:string(text.model,'gpt-6.1-terra'),base_url:string(text.base_url,'https://api.gptsapi.net/v1',1000),proxy:string(text.proxy,'',500),params:cleanParams(text.params,'text')},
    wan:{model:string(wan.model),base_url:string(wan.base_url,'https://dashscope.aliyuncs.com/api/v1',1000),proxy:string(wan.proxy,'',500),params:cleanParams(wan.params,'video')}};
}
export function loadSimpleModels(saved,advanced,legacy={}){
  if(saved?.version===1&&saved.text&&saved.wan){try{return simpleMetadata(saved);}catch{/* Recover from invalid saved parameters below. */}}
  const data=loadModels(advanced,legacy);
  const text=data.profiles.find(p=>p.id===data.defaultText&&['text','vision'].includes(p.kind))||data.profiles.find(p=>['text','vision'].includes(p.kind));
  const textConnection=data.connections.find(c=>c.id===text?.connection);
  const wanProfiles=data.profiles.filter(p=>p.kind==='video'&&data.connections.some(c=>c.id===p.connection&&c.protocol==='dashscope'));
  const wan=wanProfiles.find(p=>p.id===data.routes?.generative?.video?.profile)||wanProfiles[0];
  const wanConnection=data.connections.find(c=>c.id===wan?.connection)||data.connections.find(c=>c.protocol==='dashscope');
  return simpleMetadata({text:{...textConnection,model:text?.model||legacy.model||'gpt-6.1-terra',params:text?.params||{}},
    wan:{...wanConnection,model:wan?.model||'',params:wan?.params||{}}});
}
export function sharedProgramModel(data,secrets){
  const text=data.text;
  const result=runtimeModel({profile:{model:text.model,name:'LLM / VLM'},connection:{id:'text',name:'LLM / VLM',...text},params:text.params},secrets);
  if(text.params.max_tokens!==undefined){result.planning_max_tokens=text.params.max_tokens;result.repair_max_tokens=text.params.max_tokens;}
  return result;
}

export function vqqaModels(data,secrets){
  const text=sharedProgramModel(data,secrets),wan=data.wan;
  if(!wan.model?.trim())throw new Error('请在模型中心填写视频模型 ID。');
  const api_key=secrets.get('wan');if(!api_key)throw new Error('请在模型中心填写视频模型 API Key。');
  return {...text,wan:{model:wan.model,base_url:wanBaseURL(wan.base_url),proxy:wan.proxy||'',api_key,provider:'DashScope'}};
}
