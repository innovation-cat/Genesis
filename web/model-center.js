import {icon} from './icons.js';
import {getUILanguage} from './i18n.js';
import {readStorage,writeStorage} from './api.js';
import {modelStorageKey,simpleModelStorageKey,loadSimpleModels,simpleMetadata,sharedProgramModel,vqqaModels,cleanParams,validURL,wanBaseURL} from './model-config.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=(zh,en)=>getUILanguage()==='en'?en:zh;
const endpoints={openai:'https://api.openai.com/v1',claude:'https://api.anthropic.com',gemini:'https://generativelanguage.googleapis.com'};

export class ModelCenter{
  constructor({legacy,api,toast}){
    this.data=loadSimpleModels(readStorage(simpleModelStorageKey,null),readStorage(modelStorageKey,null),legacy);
    this.api=api;this.toast=toast;this.secrets=new Map();this.dirty=new Set();
  }
  status(kind){return this.secrets.has(kind)?t('密钥已填写','Key entered'):t('待填写密钥','Key needed');}
  summary(path){
    return `<div class="workspace-model-bar" data-no-localize><div class="workspace-model-tags">${path!=='generative'?`<span class="fixed-model">${icon('code')}Manim</span>`:''}${path!=='program'?`<span class="fixed-model">${icon('sparkles')}${t('视频模型','Video model')}</span>`:''}<span class="shared-model"><span>LLM / VLM</span><b title="${esc(this.data.text.model)}">${esc(this.data.text.model||t('未配置','Not configured'))}</b></span></div><button type="button" data-action="model-center">${icon('sliders')}${t('模型设置','Model settings')}${icon('arrow')}</button></div>`;
  }
  render(target){
    this.dirty.clear();
    target.innerHTML=`<div class="model-center simple-model-center" data-no-localize><div class="model-center-heading"><div><span class="eyebrow">GENESIS / MODEL CENTER</span><h1>${t('连接模型，开始创作。','Connect your models. Start creating.')}</h1><p>${t('共用 LLM / VLM 负责理解、规划与审阅，视频模型负责生成画面。为你的创作选择合适的模型。','Your shared LLM / VLM plans and reviews. Your video model brings each shot to life. Choose the models that fit your work.')}</p></div><button class="secondary-button" data-action="settings">${icon('server')}${t('计算与配音设置','Compute & speech')}</button></div><div class="simple-model-grid">${this.card('text')}${this.card('wan')}</div><p class="simple-key-note">${icon('lock')}${t('模型设置保存在此浏览器；API Key 仅在当前页面有效，刷新后需重新填写。','Model settings stay in this browser. API keys stay in page memory and must be re-entered after refreshing.')}</p></div>`;
    const root=target.querySelector('.model-center');
    root.addEventListener('input',event=>{const kind=event.target.closest('[data-model-form]')?.dataset.modelForm;if(kind)this.dirty.add(kind);});
    root.addEventListener('change',event=>{
      const form=event.target.closest('[data-model-form]');if(!form)return;
      this.dirty.add(form.dataset.modelForm);
      if(event.target.name==='protocol')form.elements.base_url.value=endpoints[event.target.value];
    });
    root.addEventListener('submit',event=>{
      const form=event.target;if(!form.matches('[data-model-form]'))return;
      event.preventDefault();try{this.save(form);}catch(error){this.toast(error.message,true);}
    });
    root.addEventListener('click',event=>this.click(event).catch(error=>this.toast(error.message,true)));
  }
  card(kind){
    const text=kind==='text',data=this.data[kind];
    const title=text?t('共用 LLM / VLM','Shared LLM / VLM'):t('视频模型','Video model');
    const subtitle=text?t('Prompt 扩展、分镜、解说、代码与评估共用同一模型。','One model for prompts, storyboards, narration, code and evaluation.'):t('连接视频生成服务，按所选模型支持的能力创作镜头。','Connect your video service and create shots using your model’s capabilities.');
    return `<form class="simple-model-card" data-model-form="${kind}"><div class="simple-model-card-heading"><span class="simple-model-icon ${kind}">${icon(text?'layers':'film')}</span><div><span class="eyebrow">${text?'UNDERSTAND & PLAN':'GENERATE VIDEO'}</span><h2>${title}</h2></div><span class="simple-model-status ${this.secrets.has(kind)?'ready':''}" data-key-status>${this.status(kind)}</span></div><p class="simple-model-description">${subtitle}</p>
    <label>${t('接口服务','API provider')}${text?`<select name="protocol"><option value="openai" ${data.protocol==='openai'?'selected':''}>${t('OpenAI 兼容','OpenAI compatible')}</option><option value="claude" ${data.protocol==='claude'?'selected':''}>${t('Claude 原生','Claude native')}</option><option value="gemini" ${data.protocol==='gemini'?'selected':''}>${t('Gemini 原生','Gemini native')}</option></select>`:`<div class="simple-fixed-provider">${icon('server')}${t('兼容的视频接口','Compatible video API')}<span>DashScope</span></div>`}</label>
    <label>${t('模型 ID','Model ID')}<input name="model" value="${esc(data.model)}" maxlength="200" required spellcheck="false" placeholder="${text?t('填写共用模型的 ID','Your shared model ID'):t('填写服务商提供的视频模型 ID','Video model ID from your provider')}"></label>
    <label>Base URL<input name="base_url" type="url" value="${esc(data.base_url)}" required maxlength="1000" spellcheck="false"></label>${text?'':`<p class="field-help">${t('填写 API 根地址（通常以 /api/v1 结尾）。粘贴完整的视频生成地址也会自动识别。','Enter the API root, usually ending in /api/v1. Full video-generation URLs are normalized automatically.')}</p>`}
    <label>API Key<div class="input-action"><input name="api_key" type="password" autocomplete="new-password" autocapitalize="off" spellcheck="false" maxlength="2000" placeholder="${this.keyPlaceholder(kind)}"><button type="button" data-model-eye aria-pressed="false" aria-label="${t('显示密钥','Show key')}">${icon('eye')}</button></div></label>
    <details class="simple-model-advanced"><summary>${t('更多设置','More settings')}${icon('chevron')}</summary>${text?`<div class="simple-parameter-grid">${[['max_tokens',t('输出 Token 预算','Output token budget'),1,2147483647,1],['temperature','Temperature',0,2,0.1],['api_timeout',t('超时（秒）','Timeout (s)'),30,3600,1],['api_retries',t('失败重试','Retries'),0,5,1]].map(([key,label,min,max,step])=>`<label>${label}<input name="${key}" type="number" min="${min}" max="${max}" step="${step}" value="${esc(data.params[key]??'')}" placeholder="${t('使用默认值','Use default')}"></label>`).join('')}</div>`:`<p class="field-help">${t('Key 与 Base URL 需属于同一地域；也可填写控制台提供的工作空间专属地址。','Your key and Base URL must use the same region. Workspace-specific endpoints from the console are supported.')}</p>`}<label>HTTP Proxy<input name="proxy" value="${esc(data.proxy)}" maxlength="500" placeholder="${t('留空继承代理，direct 强制直连','Blank inherits proxy; direct disables it')}"></label></details>
    <p class="simple-model-note">${text?t('各阶段共用这套连接与参数，无需重复分配。','Every stage shares this connection and its parameters.'):t('时长、分辨率、音频与参考图支持取决于所选模型。故事连贯性增强需要模型支持参考图。','Duration, resolution, audio and references depend on your model. Story continuity requires reference-image support.')}</p>
    <p class="simple-model-feedback" role="status" aria-live="polite" aria-atomic="true"></p><div class="simple-model-actions">${text?`<button type="button" class="secondary-button" data-model-test>${t('测试模型 · 小额调用','Test model · small API call')}</button>`:`<a href="https://help.aliyun.com/zh/model-studio/text-to-video-api-reference" target="_blank" rel="noreferrer">${t('接口文档','API documentation')} ↗</a>`}<button class="primary-button" type="submit">${icon('check')}${t('保存设置','Save settings')}</button></div></form>`;
  }
  keyPlaceholder(kind){return this.secrets.has(kind)?t('留空保留当前密钥','Leave blank to keep current key'):t('输入 API Key，仅当前页面有效','Enter an API key for this page session');}
  collect(form){
    const kind=form.dataset.modelForm,current=this.data[kind],model=form.elements.model.value.trim();
    if(!model)throw new Error(t('请填写模型 ID。','Enter a model ID.'));
    const values=Object.fromEntries(['max_tokens','temperature','api_timeout','api_retries'].filter(key=>form.elements[key]).map(key=>[key,form.elements[key].value]));
    return {...current,model,base_url:(kind==='wan'?wanBaseURL:validURL)(form.elements.base_url.value.trim()),proxy:form.elements.proxy.value.trim(),
      ...(kind==='text'?{protocol:form.elements.protocol.value,params:cleanParams({...current.params,...values},'text')}:{} )};
  }
  save(form){
    if(!form.reportValidity())return;
    const kind=form.dataset.modelForm,data=this.collect(form),key=form.elements.api_key.value.trim();
    this.data[kind]=data;if(key)this.secrets.set(kind,key);
    form.elements.base_url.value=data.base_url;
    writeStorage(simpleModelStorageKey,simpleMetadata(this.data));this.dirty.delete(kind);
    form.elements.api_key.value='';form.elements.api_key.type='password';form.elements.api_key.placeholder=this.keyPlaceholder(kind);
    const eye=form.querySelector('[data-model-eye]');eye.setAttribute('aria-pressed','false');eye.setAttribute('aria-label',t('显示密钥','Show key'));
    const badge=form.querySelector('[data-key-status]');badge.textContent=this.status(kind);badge.classList.toggle('ready',this.secrets.has(kind));
    const feedback=form.querySelector('.simple-model-feedback');feedback.textContent=t('设置已保存。','Settings saved.');feedback.dataset.state='success';
    this.toast(t('模型设置已保存。','Model settings saved.'));
  }
  async click(event){
    const button=event.target.closest('button'),form=button?.closest('[data-model-form]');if(!form)return;
    if(button.hasAttribute('data-model-eye')){const input=form.elements.api_key;input.type=input.type==='password'?'text':'password';button.setAttribute('aria-pressed',String(input.type==='text'));button.setAttribute('aria-label',input.type==='text'?t('隐藏密钥','Hide key'):t('显示密钥','Show key'));return;}
    if(!button.hasAttribute('data-model-test')||!form.reportValidity())return;
    const data=this.collect(form),secrets=new Map(this.secrets),key=form.elements.api_key.value.trim();if(key)secrets.set('text',key);
    const body=sharedProgramModel({...this.data,text:data},secrets),status=form.querySelector('.simple-model-feedback');
    if(button.disabled)return;
    button.disabled=true;status.dataset.state='pending';status.textContent=t('正在测试文本调用…','Testing a text call…');
    try{await this.api.request('/api/test',{method:'POST',body,timeout:60000});status.dataset.state='success';status.textContent=t('文本调用成功。','Text call succeeded.');}catch(error){status.dataset.state='error';status.textContent=error.message;}finally{button.disabled=false;}
  }
  leave(){return !this.dirty.size||confirm(t('有未保存的模型设置，放弃这些修改？','Discard unsaved model settings?'));}
  programPayload(){return sharedProgramModel(this.data,this.secrets);}
  generativePayload(){return vqqaModels(this.data,this.secrets);}
}
