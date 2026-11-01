import {icon} from './icons.js';
import {uiText} from './i18n.js';

const t=value=>uiText(value);
export function loadStoryOptions(saved={}){
  if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
  return {duration:Number.isInteger(saved.duration)?saved.duration:30,shot_count:Number.isInteger(saved.shot_count)?saved.shot_count:3,
    resolution:['480P','720P','1080P'].includes(saved.resolution)?saved.resolution:'480P',ratio:['16:9','9:16','1:1'].includes(saved.ratio)?saved.ratio:'16:9',
    audio:typeof saved.audio==='boolean'?saved.audio:true,
    auto_refine:typeof saved.auto_refine==='boolean'?saved.auto_refine:saved.max_iterations!==0,
    continuity:typeof saved.continuity==='boolean'?saved.continuity:true,
    max_iterations:Number.isInteger(saved.max_iterations)?Math.max(1,Math.min(2,saved.max_iterations)):1,
    target_score:typeof saved.target_score==='number'&&Number.isFinite(saved.target_score)?saved.target_score:90};
}

export function generationMode({auto_refine=true,continuity=true}={}){
  if(auto_refine&&continuity)return {id:'complete',title:'完整增强',description:'在故事状态和视觉参考的约束下，逐镜头审阅、改进并择优。'};
  if(auto_refine)return {id:'refine',title:'镜头自动改进',description:'独立审阅和改进每个镜头，使用用户参考图，不传递生成画面的记忆。'};
  if(continuity)return {id:'continuity',title:'连贯故事',description:'建立故事状态并传递可信画面，每个镜头生成一次；仍会检查记忆的可信度。'};
  return {id:'basic',title:'基础生成',description:'规划分镜后，每个镜头生成一次，再组接成片；保留用户设定与参考图。'};
}

export function storyBudget(options){
  const attempts=options.auto_refine?1+options.max_iterations:1;
  const count=options.shot_count;
  const valid=Number.isInteger(count)&&count>=2&&count<=8&&Number.isInteger(options.duration)&&options.duration>=count*2&&options.duration<=Math.min(120,count*30)&&
    (!options.auto_refine||(Number.isInteger(options.max_iterations)&&options.max_iterations>=1&&options.max_iterations<=2&&Number.isFinite(options.target_score)&&options.target_score>=0&&options.target_score<=100))&&count*attempts<=16;
  const qualityInvalid=options.auto_refine&&(!Number.isInteger(options.max_iterations)||options.max_iterations<1||options.max_iterations>2||!Number.isFinite(options.target_score)||options.target_score<0||options.target_score>100);
  return {attempts,maximum:count*attempts,valid,reason:valid?null:qualityInvalid?'quality':'budget'};
}

export function generationOptionsHTML(options){
  const mode=generationMode(options);
  return `<section class="generation-options" aria-labelledby="generation-options-title"><div class="generation-options-heading"><h3 id="generation-options-title">${t('生成方式')}</h3><span id="generation-mode" class="generation-mode-badge" data-mode="${mode.id}">${t(mode.title)}</span></div>
  <div class="feature-toggle-grid">${[
    ['auto_refine','refresh','镜头自动改进','审阅画面，调整提示词，保留更合适的候选。'],
    ['continuity','link','故事连贯性增强','记录人物、场景和道具状态，为后续镜头提供参考。']
  ].map(([key,glyph,title,description])=>`<label class="feature-toggle"><input type="checkbox" role="switch" name="${key}" class="feature-switch-input" aria-label="${t(title)}" ${options[key]?'checked':''}><span class="feature-toggle-heading">${icon(glyph)}<strong>${t(title)}</strong><span class="feature-switch-track" aria-hidden="true"><i></i></span></span><span class="feature-toggle-description">${t(description)}</span></label>`).join('')}</div>
  <p id="generation-mode-description" class="generation-mode-description">${t(mode.description)}</p>
  <details id="refinement-settings" class="refinement-settings" ${options.auto_refine?'':'hidden'}><summary>${t('改进预算')}${icon('chevron')}</summary><div class="parameter-row"><label class="ui-field">${t('每镜头最多改进次数')}<input name="max_iterations" type="number" min="1" max="2" value="${options.max_iterations}" required ${options.auto_refine?'':'disabled'}></label><label class="ui-field">${t('目标质量（0–100）')}<input name="target_score" type="number" min="0" max="100" value="${options.target_score}" required ${options.auto_refine?'':'disabled'}></label></div><p>${t('达到目标或停止改善时提前结束，最多生成 16 个候选。')}</p></details></section>`;
}
