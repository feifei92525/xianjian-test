'use strict';
// A presentation-only layer on top of planner v2. Original task IDs and stored data are unchanged.
const simpleOriginalXpRender=xpRender;
const SIMPLE_TABS=[['study','🌷 今日學習'],['studyCalendar','📅 學習日曆'],['studyGrowth','📊 學習成長'],['studyDiary','📝 學習日記'],['studyFocus','⏱️ 專注模式']];
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
  if(page==='studyGrowth')sections[0].querySelector('h2').textContent='🌱 學習成長';
  if(page==='studyCalendar')sections[0].querySelector('h2').textContent='📅 51 天學習日曆';
  if(page==='studyFocus')sections[0].querySelector('h2').textContent='⏱️ 專注模式';
 }
 const main=document.getElementById('content'),head=main.querySelector('.simple-head, .study-hero');
 if(head){const tabs=document.createElement('nav');tabs.className='simple-tabs';tabs.setAttribute('aria-label','學習分頁');tabs.innerHTML=SIMPLE_TABS.map(([id,label])=>`<button type="button" class="${page===id?'selected':''}" data-simple-go="${id}">${label}</button>`).join('');head.after(tabs);tabs.querySelectorAll('[data-simple-go]').forEach(b=>b.onclick=()=>go(b.dataset.simpleGo));const description=document.createElement('p');description.className='simple-description';description.textContent=SIMPLE_DESCRIPTIONS[page];tabs.after(description)}
}
xpRender=function(){simpleRender()};
