'use strict';
// A presentation-only layer on top of planner v2. Original task IDs and stored data are unchanged.
const simpleOriginalXpRender=xpRender;
const SIMPLE_TABS=[['study','🌷 今日學習'],['studyCalendar','📅 學習日曆'],['studyGrowth','📊 學習成長'],['studyDiary','📝 學習日記'],['studyFocus','⏱️ 專注模式']];
let simpleGrowthSubject='bass',simpleGrowthSelected=0;
const SIMPLE_DESCRIPTIONS={study:'只要勾選完成的事項，其他設定都收起來。',studyCalendar:'想更改時段、排序或延期任務時，再來這裡調整。',studyGrowth:'每週成果、技能熟練度與雲端備份集中在這裡。',studyDiary:'心得可以自由記錄，不必每天填寫。',studyFocus:'選一項任務開始計時，結束後自動累計分鐘。'};
function simpleRender(){
 if(!['study','studyCalendar','studyGrowth','studyDiary','studyFocus'].includes(page))return;
 if(page==='studyDiary'){
  const x=xpRead(),date=studySelected,entry=x.days?.[date]||{};
  content(`<section class="simple-head"><span class="eyebrow">LEARNING JOURNAL</span><h2>📝 學習日記</h2><p>想寫再寫，不需要每天交作業。</p></section><section class="card"><label for="simpleDiaryDate">紀錄日期</label><input id="simpleDiaryDate" type="date" min="${STUDY_START}" max="${STUDY_END}" value="${date}"><label for="simpleDiaryText">今天的收穫與發現</label><textarea id="simpleDiaryText" rows="8" placeholder="今天學到了什麼？遇到什麼問題？有什麼想記下來的？">${esc(entry.journal||'')}</textarea><p id="simpleDiaryState" class="study-muted">輸入後會自動儲存在本機。</p></section>`);
  document.getElementById('simpleDiaryDate').onchange=e=>{if(xpValidDate(e.target.value)){studySelected=e.target.value;simpleRender()}};
  document.getElementById('simpleDiaryText').oninput=e=>{let z=xpRead();z.days||={};z.days[date]={...(z.days[date]||{}),journal:e.target.value.slice(0,10000)};if(xpSave(z))document.getElementById('simpleDiaryState').textContent='✓ 已自動儲存';};
 }else{
  simpleOriginalXpRender();
  const main=document.getElementById('content'),sections=[...main.querySelectorAll(':scope > section')];
  if(sections.length<7)return;
  const visibility={study:[0,1,2],studyCalendar:[0,1,2],studyGrowth:[0,4,5,6],studyFocus:[0,1,3]};
  sections.forEach((section,i)=>{section.hidden=!visibility[page].includes(i)});
  main.classList.remove('simple-today','simple-calendar','simple-growth','simple-focus');
  main.classList.add(({study:'simple-today',studyCalendar:'simple-calendar',studyGrowth:'simple-growth',studyFocus:'simple-focus'})[page]);
  if(page==='study'){
   const task=sections[2];task.querySelector('h2').textContent='✓ 今天要做的事';
   const date=studySelected,all=[...task.querySelectorAll('[data-xp-done]')],done=all.filter(el=>el.checked).length;
   const hint=task.querySelector('.study-muted');if(hint)hint.textContent='每項任務勾選後立即儲存。需要改時間或延期，請到「學習日曆」。';
   const status=document.createElement('div');status.className='simple-progress';status.innerHTML=`<strong>${done} / ${all.length} 項已完成</strong><div class="simple-track"><span style="width:${all.length?100*done/all.length:0}%"></span></div>`;
   task.insertBefore(status,task.querySelector('.xp-task'));
   // Keep only the low-energy toggle on the daily page; hide other explanatory copy with CSS.
  }
  if(page==='studyFocus'){
   sections[1].querySelector('h2').textContent='選擇練習日期';
   const taskList=sections[2];const choices=[...taskList.querySelectorAll('[data-xp-start]')].map(btn=>({id:btn.dataset.xpStart,text:xpTask(btn.dataset.xpStart).text}));
   const chooser=document.createElement('section');chooser.className='card';chooser.innerHTML=`<h2>🎯 選擇專注任務</h2><select id="simpleFocusTask"><option value="">請選擇今天要練習的事項</option>${choices.map(t=>`<option value="${esc(t.id)}" ${xpTimerTask===t.id?'selected':''}>${esc(t.text)}</option>`).join('')}</select><div class="study-actions"><button id="simpleFocusStart">▶ 開始專注</button></div>`;
   sections[3].before(chooser);
   chooser.querySelector('#simpleFocusStart').onclick=()=>{const id=chooser.querySelector('select').value;if(!id)return notice('請先選擇任務');if(xpTimer)xpTimerStop();xpTimerTask=id;xpTimerSeconds=0;xpTimerGo();simpleRender()};
  }
  if(page==='studyGrowth'){sections[0].querySelector('h2').textContent='🌱 學習成長';simpleGrowthRender(sections[4]);}
  if(page==='studyCalendar')sections[0].querySelector('h2').textContent='📅 51 天學習日曆';
  if(page==='studyFocus')sections[0].querySelector('h2').textContent='⏱️ 專注模式';
 }
 const main=document.getElementById('content'),head=main.querySelector('.simple-head, .study-hero');
 if(head){const tabs=document.createElement('nav');tabs.className='simple-tabs';tabs.setAttribute('aria-label','學習分頁');tabs.innerHTML=SIMPLE_TABS.map(([id,label])=>`<button type="button" class="${page===id?'selected':''}" data-simple-go="${id}">${label}</button>`).join('');head.after(tabs);tabs.querySelectorAll('[data-simple-go]').forEach(b=>b.onclick=()=>go(b.dataset.simpleGo));const description=document.createElement('p');description.className='simple-description';description.textContent=SIMPLE_DESCRIPTIONS[page];tabs.after(description)}
}
xpRender=function(){simpleRender()};

// Skill growth: replaces only the old dense dropdown panel, retaining XP_SKILLS and x.skills storage.
function simpleGrowthRender(section){
 if(!section)return;
 const subjects=[['bass','🎸 Bass'],['sewing','🧵 縫紉'],['crochet','🧶 鉤針']];
 const sid=simpleGrowthSubject, names=XP_SKILLS[sid]||[],x=xpRead(),skills=x.skills||{};
 const level=i=>Math.max(0,Math.min(5,Number(skills[sid+'|'+i]?.level)||0));
 const explored=names.filter((_,i)=>level(i)>0).length,mastered=names.filter((_,i)=>level(i)>=3).length;
 const avg=names.length?(names.reduce((sum,_,i)=>sum+level(i),0)/names.length).toFixed(1):'0';
 simpleGrowthSelected=Math.min(simpleGrowthSelected,Math.max(0,names.length-1));
 const i=simpleGrowthSelected,k=sid+'|'+i,selected=skills[k]||{};
 const levelLabels=['尚未開始','初次接觸','理解基礎','可以運用','穩定熟練','靈活運用'];
 const symbol=n=>n>=4?'★':n>=3?'✦':n>0?'✿':'○';
 const state=n=>n>=4?'master':n>=3?'ready':n>0?'active':'new';
 section.innerHTML=`<div class="sg-head"><div><span class="eyebrow">MY SKILL GARDEN</span><h2>🌱 我的技能成長</h2><p class="study-muted">一科一頁，點亮每個學會的技能。熟練度由自己評估，不會因勾選任務自動升級。</p></div></div>
 <div class="sg-tabs" role="group" aria-label="技能科目">${subjects.map(([id,label])=>`<button type="button" data-sg-subject="${id}" class="${sid===id?'active':''}" aria-pressed="${sid===id}">${label}</button>`).join('')}</div>
 <div class="sg-stats"><div><small>已探索</small><strong>${explored} / ${names.length}</strong></div><div><small>可獨立運用</small><strong>${mastered}</strong></div><div><small>平均等級</small><strong>${avg}</strong></div></div>
 <div class="sg-tree" aria-label="${subjects.find(s=>s[0]===sid)[1]}技能樹">${names.map((name,j)=>`<div class="sg-node-wrap">${j?'<div class="sg-connector" aria-hidden="true"></div>':''}<button type="button" data-sg-node="${j}" class="sg-node sg-${state(level(j))} ${j===i?'sg-selected':''}" aria-pressed="${j===i}"><span class="sg-symbol" aria-hidden="true">${symbol(level(j))}</span><span class="sg-node-copy"><strong>${esc(name)}</strong><small>Lv.${level(j)} · ${levelLabels[level(j)]}</small></span><span aria-hidden="true">›</span></button></div>`).join('')}</div>
 <div class="sg-editor"><h3>${esc(names[i]||'技能')}</h3><p class="study-muted">調整等級後立即儲存；可選擇填寫作品、練習紀錄或老師回饋。</p><div class="sg-level-head"><label for="sgLevel">目前熟練度</label><strong id="sgLevelLabel">Lv.${level(i)} · ${levelLabels[level(i)]}</strong></div><input id="sgLevel" type="range" min="0" max="5" step="1" value="${level(i)}"><div class="sg-range-label"><span>Lv.0 尚未開始</span><span>Lv.5 靈活運用</span></div><label for="sgEvidence">學習證據（選填）</label><textarea id="sgEvidence" rows="3" maxlength="500" placeholder="例如：完成一件作品、錄下練習片段、老師回饋……">${esc(selected.evidence||'')}</textarea><p id="sgSaved" class="study-muted" role="status">更改等級會自動儲存，文字在離開欄位後儲存。</p></div>`;
 section.querySelectorAll('[data-sg-subject]').forEach(btn=>btn.onclick=()=>{simpleGrowthSubject=btn.dataset.sgSubject;simpleGrowthSelected=0;simpleGrowthRender(section)});
 section.querySelectorAll('[data-sg-node]').forEach(btn=>btn.onclick=()=>{simpleGrowthSelected=Number(btn.dataset.sgNode);simpleGrowthRender(section)});
 const save=(patch)=>{const z=xpRead();z.skills||={};z.skills[k]={...(z.skills[k]||{}),...patch};if(xpSave(z)){section.querySelector('#sgSaved').textContent='✓ 已儲存（若雲端同步已設定，將自動排入同步）';return true}return false};
 section.querySelector('#sgLevel').oninput=e=>{const n=Number(e.target.value);if(save({level:n})){const evidence=section.querySelector('#sgEvidence').value;simpleGrowthRender(section);section.querySelector('#sgEvidence').value=evidence}};
 section.querySelector('#sgEvidence').onchange=e=>save({evidence:e.target.value.slice(0,500)});
}
