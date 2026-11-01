import {icon} from './icons.js';
import {uiText} from './i18n.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=value=>esc(uiText(value));
export const visualAssetLimits={character:6,location:8,style:1};
const labels={character:'人物',location:'场景',style:'全片风格'};
export const visualAssetStorageKey='formaweave.visual-assets';

export function assetMetadata(assets){
  return assets.map(({id,kind,name,description})=>({id,kind,name,description}));
}
export function loadVisualAssets(saved,legacy={}){
  if(Array.isArray(saved)){
    const ids=new Set(),counts={character:0,location:0,style:0};
    return saved.filter(a=>{
      if(!a||!Object.hasOwn(visualAssetLimits,a.kind)||!/^[A-Za-z][A-Za-z0-9_-]{0,79}$/.test(a.id)||ids.has(a.id)||typeof a.name!=='string'||typeof a.description!=='string')return false;
      ids.add(a.id);return ++counts[a.kind]<=visualAssetLimits[a.kind];
    }).map(a=>({id:a.id,kind:a.kind,name:a.name.slice(0,100),description:a.description.slice(0,1000)}));
  }
  return [['character','character','人物设定'],['location','location','场景设定'],['style','look','全片风格']]
    .filter(([,key])=>typeof legacy?.[key]==='string'&&legacy[key].trim())
    .map(([kind,key,name])=>({id:'imported-'+kind,kind,name:uiText(name),description:legacy[key].slice(0,1000)}));
}
export function createVisualAsset(kind,assets,id='asset-'+crypto.randomUUID()){
  if(!Object.hasOwn(visualAssetLimits,kind))throw new Error(uiText('无效的视觉设定类型。'));
  if(assets.filter(a=>a.kind===kind).length>=visualAssetLimits[kind])throw new Error(uiText('此类视觉设定已达到数量上限。'));
  let number=1,name=uiText(labels[kind]);
  if(kind!=='style'){
    while(assets.some(a=>a.kind===kind&&a.name===`${name} ${number}`))number++;
    name+=` ${number}`;
  }
  return {id,kind,name,description:''};
}
export function referenceBytes(ref){
  if(Number.isFinite(ref.size))return ref.size;
  const encoded=String(ref.url||'').split(',',2)[1]||'';
  return Math.max(0,Math.floor(encoded.length*3/4)-(encoded.endsWith('==')?2:encoded.endsWith('=')?1:0));
}
export function visualPayload(assets,references){
  const metadata=assetMetadata(assets).map(a=>({...a,name:a.name.trim(),description:a.description.trim()}));
  const names=new Set(),ids=new Set(),counts={character:0,location:0,style:0};
  for(const a of metadata){
    if(!Object.hasOwn(visualAssetLimits,a.kind)||!/^[A-Za-z][A-Za-z0-9_-]{0,79}$/.test(a.id)||ids.has(a.id))throw new Error(uiText('无效的视觉设定类型。'));
    if(!a.name)throw new Error(uiText('请为每个视觉对象填写名称。'));
    if(a.name.length>100||a.description.length>1000)throw new Error(uiText('视觉设定文字过长。'));
    const key=a.kind+':'+a.name.toLocaleLowerCase();
    if(names.has(key))throw new Error(uiText('同类视觉对象请使用不同名称。'));
    if(++counts[a.kind]>visualAssetLimits[a.kind])throw new Error(uiText('此类视觉设定已达到数量上限。'));
    ids.add(a.id);names.add(key);
  }
  if(references.length>8)throw new Error(uiText('整个故事最多添加 8 张参考图。'));
  const perAsset={};let total=0;
  for(const r of references){
    if(!ids.has(r.asset_id))throw new Error(uiText('参考图需要绑定到已有的视觉对象。'));
    perAsset[r.asset_id]=(perAsset[r.asset_id]||0)+1;
    if(perAsset[r.asset_id]>3)throw new Error(uiText('每个视觉对象最多添加 3 张参考图。'));
    total+=referenceBytes(r);
  }
  if(total>32*1024*1024)throw new Error(uiText('故事参考图合计不能超过 32 MB。'));
  return {assets:metadata,references:references.map(({asset_id,name,url})=>({asset_id,name,url}))};
}

export function selectedVisualAssets(assets,selections={}){
  if(typeof selections==='string'){const asset=assets.find(a=>a.id===selections);selections=asset?{[asset.kind]:asset.id}:{};}
  return Object.fromEntries(Object.keys(labels).map(kind=>[kind,assets.find(a=>a.kind===kind&&a.id===selections?.[kind])?.id||assets.find(a=>a.kind===kind)?.id||'']));
}

export function visualAssetPanel(assets,references,kind,activeId){
  const members=assets.filter(a=>a.kind===kind);
  const selected=members.find(a=>a.id===activeId)||members[0];
  const addLabel=kind==='character'?'添加人物':kind==='location'?'添加场景':'添加全片风格';
  const scopes={character:'仅用于该人物出现的镜头',location:'仅用于该场景的镜头',style:'用于整个故事的色彩、光线与质感'};
  const placeholders={character:'描述外貌、服装和需要保持的特征',location:'描述空间布局、环境和固定陈设',style:'描述全片的色彩、光线、材质与氛围'};
  const empty={character:'添加需要保持一致的人物，或交给系统自动规划。',location:'添加故事发生的地点，或交给系统自动规划。',style:'设置整个故事的色彩、光线与质感，也可以留空。'};
  const glyph=kind==='character'?'eye':kind==='location'?'globe':'palette';
  const images=selected?references.filter(r=>r.asset_id===selected.id):[];
  return `<div class="visual-panel-heading"><h3 id="visual-title-${kind}">${icon(glyph)}${t(labels[kind])}<small>${members.length} / ${visualAssetLimits[kind]}</small></h3><button type="button" class="visual-panel-add" data-add-visual="${kind}" ${members.length>=visualAssetLimits[kind]?'disabled':''} aria-label="${uiText(addLabel)}">${icon('plus')}${t('添加')}</button></div>
  ${members.length?(kind!=='style'?`<div class="visual-subject-switcher" role="tablist" aria-label="${uiText(kind==='character'?'选择人物':'选择场景')}">${members.map(a=>{
    const count=references.filter(r=>r.asset_id===a.id).length;
    return `<button type="button" role="tab" id="visual-tab-${esc(a.id)}" aria-selected="${a.id===selected.id}" aria-controls="visual-editor-${kind}" tabindex="${a.id===selected.id?0:-1}" data-select-visual="${esc(a.id)}" class="visual-subject-tab ${a.id===selected.id?'selected':''}"><span data-visual-name="${esc(a.id)}" data-user-content>${esc(a.name)||t('未命名')}</span><small>${count} / 3</small></button>`;
  }).join('')}</div>`:`<div class="visual-style-scope">${icon('link')}${t('应用到整个故事')}</div>`):''}
  ${selected?`<div id="visual-editor-${kind}" class="visual-subject-editor" data-visual-object="${esc(selected.id)}" ${kind!=='style'?`role="tabpanel" aria-labelledby="visual-tab-${esc(selected.id)}"`:''}>
    <div class="visual-name-row"><label class="ui-field">${t('名称')}<input form="story-form" data-asset-id="${esc(selected.id)}" data-asset-field="name" maxlength="100" value="${esc(selected.name)}" required></label><button type="button" class="visual-object-remove" data-remove-visual="${esc(selected.id)}" aria-label="${uiText('移除设定')} ${esc(selected.name)}" data-i18n-keep="aria-label">${icon('trash')}</button></div>
    <label class="ui-field">${t('描述')}<textarea form="story-form" rows="3" data-asset-id="${esc(selected.id)}" data-asset-field="description" maxlength="1000" placeholder="${uiText(placeholders[kind])}">${esc(selected.description)}</textarea></label>
    <div class="visual-object-scope">${icon('link')}<span>${t(scopes[kind])}</span></div>
    <div class="visual-object-references" data-reference-drop="${esc(selected.id)}" aria-label="${uiText('图片参考')} ${esc(selected.name)}" data-i18n-keep="aria-label"><input type="file" class="visual-reference-input" data-asset-upload="${esc(selected.id)}" accept="image/png,image/jpeg,image/webp" multiple hidden>
    <div class="visual-bound-images">${images.map(r=>`<div class="reference-thumb"><img src="${esc(r.url)}" alt="${esc(r.name)}" data-user-content><button type="button" data-remove-reference="${esc(r.id)}" aria-label="${uiText('移除参考图')} ${esc(r.name)}" data-i18n-keep="aria-label">${icon('close')}</button><small data-user-content>${esc(r.name)}</small></div>`).join('')}</div>
    <button type="button" class="visual-reference-add" data-add-asset-reference="${esc(selected.id)}" ${images.length>=3||references.length>=8?'disabled':''}>${icon('upload')}${t(images.length?'继续添加参考图':'添加参考图')}<small>${images.length} / 3</small></button></div></div>`:`<div class="visual-panel-empty">${icon(glyph)}<strong>${t(kind==='style'?'尚未设置风格':kind==='character'?'尚未添加人物':'尚未添加场景')}</strong><p>${t(empty[kind])}</p></div>`}`;
}

export function visualAssetCards(assets,references,selections={}){
  const selected=selectedVisualAssets(assets,selections);
  return `<div class="visual-settings-heading"><div><span class="workspace-kicker">STORY DIRECTION</span><h2>${t('人物、场景与风格')}<small>${t('可选')}</small></h2><p>${t('按类型管理故事设定，选择一个对象编辑描述与参考图。')}</p></div><span id="visual-image-count" class="visual-image-count">${references.length} / 8 ${t('张参考图')}</span></div>
  <div class="visual-panels">${Object.keys(labels).map(kind=>`<section class="panel visual-type-panel" data-visual-panel="${kind}" aria-labelledby="visual-title-${kind}">${visualAssetPanel(assets,references,kind,selected[kind])}</section>`).join('')}</div>
  <div class="visual-settings-notes"><span>${t('每个对象最多 3 张图，全故事最多 8 张。单张不超过 8 MB，合计不超过 32 MB。')}</span><span>${t('文字设定自动保存；参考图仅在当前页面保留，刷新后需重新添加。')}</span></div>`;
}
