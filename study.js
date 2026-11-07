'use strict';
const STUDY_ROWS = [["11/07", "比較平織與針織、布紋方向及垂墜，製作測試紀錄", "短針、中長針、長針密度試片", "錄製 Fingerstyle 雙指交替與跨弦基準影片"], ["11/08", "比較棉布、府綢、斜紋、亞麻的挺度與用途", "環狀起針及短針圓形加針", "雙指交替、八分音符、音量一致"], ["11/09", "雪紡、薄紗、緞面防滑車縫與熨燙測試", "圓形平片逐圈加針", "課前 Fingerstyle 預習，課後整理老師回饋"], ["11/10", "測試布料彈性、縮水、預洗與整燙", "讀懂圓形織圖和針目符號", "跨弦與 Raking 控制"], ["11/11", "完成 6–8 種布料樣本卡及選布筆記", "量測圓片直徑、針數和密度", "固定速度交替撥弦與制音檢查"], ["11/12", "測量人體尺寸，整理裙型參考與鬆份", "研究漁夫帽、貝雷帽帽型結構", "Fingerstyle 十六分音符均勻度"], ["11/13", "繪製裙裝基礎紙型、標示縫份及尺寸", "選第一頂帽子的織圖和線材", "W1 技術基準複測與問題整理"], ["11/14", "裙原型：腰臀、臀高與省道配置", "第一頂帽子帽頂起針", "E、A 弦音名定位"], ["11/15", "裁剪裙裝胚布、組合前後片", "帽頂加針、檢查平整度", "D、G 弦音名定位"], ["11/16", "胚布省道、側縫與腰部暫固定", "帽頂完成並量測", "四弦找音，課後整理指板問題"], ["11/17", "第一次試穿，記錄腰臀鬆份及裙長", "帽身直筒編織、控制針數", "C、G 大調音階"], ["11/18", "修正紙型並練習 A 字裙展開", "繼續帽身，維持密度", "大調音階跨弦與根音定位"], ["11/19", "正式裙布選材、預洗與裁剪", "帽身高度量測與修正", "F、D 大調音階，聽辨根音"], ["11/20", "正式裙身車縫、省道、側縫與拉鍊", "完成帽身、準備帽簷", "W2 指板找音與音階測驗"], ["11/21", "裙裝腰頭與內部縫份處理", "帽簷加針與弧度控制", "大三和弦 1–3–5 定位"], ["11/22", "裙裝下擺、整燙及試穿", "繼續帽簷、檢查邊緣", "小三和弦 1–♭3–5"], ["11/23", "修正腰頭、臀部合身度", "帽簷收邊與藏線", "三和弦轉位及課堂重點"], ["11/24", "第一件裙裝完工、拍照與修版紀錄", "第一頂帽子依線材洗整、定型", "I–V–vi–IV 和弦根音及三和弦"], ["11/25", "上衣原型：胸腰圍、肩寬、背長", "試戴帽子，修正尺寸", "屬七和弦琶音"], ["11/26", "上衣前後片原型、胸省位置", "研究第二頂帽子的造型", "大七與小七和弦琶音"], ["11/27", "袖原型：袖山、袖肥與袖窿", "第二頂帽子試片、選線", "W3 琶音定位錄音驗收"], ["11/28", "澎袖紙型展開、袖山抽褶與袖口鬆份", "第二頂帽子起針及帽頂", "十六分音符重音移位"], ["11/29", "上衣胚布前後片裁剪與組裝", "第二頂帽子帽頂加針", "切分節奏與 Ghost Note"], ["11/30", "澎袖胚布、袖山抽褶與測試", "第二頂帽頂完成", "課堂節奏重點與技術檢討"], ["12/01", "上衣胚布裝袖、第一次試穿", "第二頂帽子帽身", "節拍器只打第 2、4 拍"], ["12/02", "修正肩線、袖窿、胸圍與袖山", "帽身花樣與針法變化", "同一 Groove 的力度與重音變化"], ["12/03", "正式布料抽褶、熨燙與縫份測試", "第二頂帽身完成", "搭配鼓循環練 Kick 與 Snare"], ["12/04", "正式澎袖上衣裁剪、標記", "設計第二頂帽簷", "W4 Groove 錄音回聽"], ["12/05", "上衣肩縫、側縫、省道或抽褶", "第二頂帽簷編織", "和弦進行根音與五度"], ["12/06", "澎袖製作、袖口處理", "帽簷完成及收邊", "Bass line 節奏動機設計"], ["12/07", "裝袖及袖窿修整", "第二頂帽子定型試戴", "課堂和聲應用、課後複習"], ["12/08", "領口貼邊與內部整理", "比較兩頂帽子的版型差異", "原創 8 小節 Bass line 初稿"], ["12/09", "上衣下擺、整燙、試穿", "第二頂帽子成品拍照", "加入經過音、切分與變化"], ["12/10", "上衣合身修正、完成拍照", "整理兩頂帽子的織圖與紀錄", "Bass line 音色、力度及制音"], ["12/11", "檢討裙裝與上衣製作問題", "新花樣、織片試作", "錄製原創 8 小節 Bass line"], ["12/12", "原創服裝三款草圖，選一款", "研究帽簷與花樣變化", "聽寫 2 小節節奏型"], ["12/13", "原創服裝選布、材質與結構分析", "配色、換線試片", "聽寫簡單根音進行"], ["12/14", "原創作品紙型設計、尺寸表", "帽花或蝴蝶結配件起針", "課堂視奏弱點整理"], ["12/15", "原創紙型展開、裁剪規劃", "帽子小配件繼續", "低音譜表與節奏視奏"], ["12/16", "原創胚布裁剪、初步組裝", "配件收邊與整形", "聽寫 4 小節簡單旋律"], ["12/17", "原創作品第一次試穿、標記", "讀織圖與針數計算", "比較 Rock／Pop Groove"], ["12/18", "原創作品修版、確認正式布料", "完成帽子裝飾配件", "W6 聽寫及視奏驗收"], ["12/19", "正式布料裁剪、標記", "個人化帽飾製作", "即興只用根音、三度、五度"], ["12/20", "原創作品主體組裝", "加減針、造型調整", "即興加入七度與經過音"], ["12/21", "原創作品關鍵結構製作", "修正帽飾尺寸", "課堂即興句型檢討"], ["12/22", "原創作品領口、袖口或開合", "帽飾細節修整", "兩小節動機發展即興"], ["12/23", "原創作品縫份及內部整理", "作品整理、依線材洗整", "完整歌曲分段精修"], ["12/24", "原創作品下擺、整燙、試穿", "鉤針作品攝影", "錄製 16 小節即興"], ["12/25", "原創作品最後合身修正", "整理織圖筆記", "完整歌曲第一次正式錄影"], ["12/26", "原創服裝完工、整燙、拍攝", "帽子與配件總整理", "期末 Fingerstyle、音階、琶音測驗"], ["12/27", "整理紙型、胚布及修版紀錄", "兩頂帽子及配件成品攝影", "期末 Groove、即興與完整歌曲錄音"], ["12/28", "完成服裝作品集頁面", "檢查成品與尺寸紀錄", "課堂回顧，比較 W1 與 W8 錄音"], ["12/29", "縫紉期末成果與下一期清單", "鉤針織圖與作品總驗收", "Bass 最終自評、下一期技術目標"]];
const STUDY_START='2026-11-09',STUDY_END='2026-12-29';
// 重新安排 51 天：保留原課程循序，最後一天整合期末成果。
STUDY_ROWS.splice(50,3, ['12/29','完成原創服裝總檢查、拍攝作品與整理紙型作品集','完成兩頂帽子整理、拍照與針法紀錄','完整歌曲錄音、Groove 與即興成果驗收、整理下一階段目標']);
const STUDY_SUBJECTS=[{id:'sewing',name:'🪡 縫紉',target:1080},{id:'crochet',name:'🧶 鉤針',target:600},{id:'bass',name:'🎸 Bass',target:1050}];
const STUDY_MILESTONES=[['11/15','布料樣本卡、Bass 基準錄音'],['11/26','第一件裙子與第一頂帽子'],['12/06','澎袖胚布與 Groove 錄音'],['12/13','澎袖上衣、第二頂帽子、8 小節 Bass line'],['12/20','原創服裝階段驗收'],['12/29','三技能期末成果整理與錄音']];
const STUDY_SHIFTS={'11/09':'Room2 12:45–16:30；Bass 課 16:30–18:00（銜接衝突）','11/12':'Room2 17:30–21:45','11/14':'Room2 13:45–17:45','11/15':'Room2 17:30–21:45','11/16':'Room2 12:45–16:30；Bass 課 16:30–18:00（銜接衝突）','11/18':'Room2 12:45–17:00','11/19':'Room2 17:30–21:45','11/21':'Room2 15:30–21:45','11/22':'Room2 09:45–14:00','11/23':'Room2 12:45–16:30；Bass 課 16:30–18:00（銜接衝突）','11/26':'Room2 17:30–21:45','11/28':'Room2 15:30–21:45','11/29':'Room2 13:45–17:45','11/30':'Room2 12:45–16:30；Bass 課 16:30–18:00（銜接衝突）'};
let studySelected=(today()>=STUDY_START&&today()<=STUDY_END)?today():STUDY_START;
function studyDate(i){let d=new Date(2026,10,9+i);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function studyIndex(d){return STUDY_ROWS.findIndex((_,i)=>studyDate(i)===d)}
function studyKey(){return 'xianjian-study-v1-'+(user?.id||'guest')}
function studyRead(){try{let x=JSON.parse(localStorage.getItem(studyKey())||'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch{return {}}}
function studyWrite(x){try{localStorage.setItem(studyKey(),JSON.stringify(x));return true}catch(e){notice('進修紀錄儲存失敗：'+e.message);return false}}
function studyEntry(d,s){return studyRead()[d]?.[s]||{}}
// 將每科當日的課程拆成可獨立勾選的學習事項；保留原始課程順序。
function studyItems(date,subjectId){
 const i=studyIndex(date),j=STUDY_SUBJECTS.findIndex(s=>s.id===subjectId);
 const source=STUDY_ROWS[i]?.[j+1]||'';
 return source.split(/[、，,；;]/).map(x=>x.trim()).filter(Boolean);
}
function studyChecks(entry,items){
 if(Array.isArray(entry?.checks))return items.map((_,i)=>entry.checks[i]===true);
 // 舊版只有科目完成狀態，已完成時視為所有細項完成。
 return items.map(()=>entry?.status==='done');
}
function studySubjectComplete(date,sid,data){
 const e=data[date]?.[sid]||{},items=studyItems(date,sid);
 return items.length>0&&studyChecks(e,items).every(Boolean);
}
function studyDayCounts(date,data){
 let total=0,done=0;
 for(const s of STUDY_SUBJECTS){const items=studyItems(date,s.id),checks=studyChecks(data[date]?.[s.id],items);total+=items.length;done+=checks.filter(Boolean).length}
 return {total,done};
}
function studySlots(date){
 const day=new Date(date+'T12:00:00').getDay(), shift=STUDY_SHIFTS[date.slice(5)]||'';
 // 建議時段；不與工作/固定課程硬性綁定，允許自由調整。
 if(shift.includes('09:45'))return ['14:30–17:30','18:30–20:10','20:20–22:50'];
 if(shift.includes('12:45')||shift.includes('13:45')||shift.includes('15:30'))return ['08:30–10:30','10:40–11:40','下班後或彈性補練'];
 if(shift.includes('17:30'))return ['08:30–11:30','12:30–14:10','14:20–16:50'];
 if(day===1)return ['08:30–11:30','11:40–13:20','Bass 課 16:30–18:00＋課後回顧'];
 if(day===2)return ['08:30–11:30','15:30–17:10','17:20–19:50'];
 return ['09:00–12:00','13:00–14:40','15:00–17:30'];
}
function studyPage(){
 const data=studyRead(),idx=studyIndex(studySelected),row=STUDY_ROWS[idx]||STUDY_ROWS[0],week=Math.floor(Math.max(0,idx)/7),weekStart=week*7;
 const day=new Date(studySelected+'T12:00:00').getDay(),dayName=['日','一','二','三','四','五','六'][day];
 const fixed=day===1?'Bass 課 16:30–18:00':day===2?'助教 12:30–15:00':'';
 const note=STUDY_SHIFTS[studySelected.slice(5)]||fixed||(studySelected>='2026-12-01'?'12 月 Room2 班表尚待確認':'無已知固定班次');
 const slots=studySlots(studySelected);
 const weekDates=Array.from({length:Math.min(7,51-weekStart)},(_,i)=>studyDate(weekStart+i));
 const sums=STUDY_SUBJECTS.map(s=>({ ...s, minutes:weekDates.reduce((n,d)=>n+(Number(data[d]?.[s.id]?.minutes)||0),0),done:weekDates.filter(d=>studySubjectComplete(d,s.id,data)).length}));
 const totalDone=STUDY_ROWS.reduce((n,_,i)=>n+studyDayCounts(studyDate(i),data).done,0),totalTasks=STUDY_ROWS.reduce((n,_,i)=>n+studyDayCounts(studyDate(i),data).total,0);
 content(`<section class="study-hero"><span class="eyebrow">MY CREATIVE LEARNING JOURNEY</span><h2>51 天每日學習手帳 ✿</h2><p>2026/11/9–12/29 · 縫紉 × 鉤針 × Bass<br>依照每天的學習安排逐項勾選，記錄時數、心得與作品成果。</p></section>
 <div class="study-summary">${sums.map(s=>`<div><span class="study-muted">${s.name} · 每週目標 ${(s.target/60).toFixed(1)}h</span><strong>${(s.minutes/60).toFixed(1)}h</strong><div class="study-bar"><i style="width:${Math.min(100,s.minutes/s.target*100)}%"></i></div><span class="study-muted">本週 ${s.done}/${weekDates.length} 天完成</span></div>`).join('')}</div>
 <section class="card"><div class="row between"><h2>第 ${week+1} 週課程</h2><span class="tag">全期已勾選 ${totalDone}/${totalTasks} 個學習事項</span></div><div class="study-tabs"><button id="studyPrev" ${week===0?'disabled':''}>← 上一週</button><button id="studyToday">今天</button><button id="studyNext" ${week>=7?'disabled':''}>下一週 →</button></div><div class="study-week">${weekDates.map(d=>{let n=studyIndex(d),done=studyDayCounts(d,data).done===studyDayCounts(d,data).total;return `<button class="${d===studySelected?'active':''} ${done?'done':''}" data-study-date="${d}">${d.slice(5)}<small>${['日','一','二','三','四','五','六'][new Date(d+'T12:00:00').getDay()]}</small></button>`}).join('')}</div><div class="field"><label for="studyDateInput">跳至日期</label><input type="date" id="studyDateInput" min="${STUDY_START}" max="${STUDY_END}" value="${studySelected}"></div><p class="study-muted">Day ${idx+1} / 51 · 當日已勾選 ${studyDayCounts(studySelected,data).done}/${studyDayCounts(studySelected,data).total} 個學習事項 · 每個小項目獨立勾選、自動儲存</p><p class="study-muted">${esc(studySelected)}（${dayName}）｜${esc(note)}${fixed&&!note.includes(fixed)?'；'+fixed:''}</p><p class="study-muted">下方時間是建議安排，可依工作、體力自由調整；Bass 每日目標 150 分鐘。已完成的學習細項會自動打勾儲存。</p></section>
 ${STUDY_SUBJECTS.map((s,j)=>{let e=studyEntry(studySelected,s.id),items=studyItems(studySelected,s.id),checks=studyChecks(e,items),done=checks.filter(Boolean).length;return `<section class="study-item ${done===items.length?'study-completed':''}"><div class="row between"><h2>${s.name}</h2><span class="tag">${done}/${items.length} 項</span></div><div class="study-time-row"><span>🕒 ${esc(slots[j])}</span><span>建議 ${s.id==='sewing'?'180':s.id==='crochet'?'100':'150'} 分鐘 · 可彈性調整</span></div><p class="study-muted">${esc(row[j+1])}</p><div class="study-subtasks">${items.map((item,i)=>`<label class="study-subtask ${checks[i]?'is-checked':''}"><input type="checkbox" data-study-subcheck="${s.id}" data-subindex="${i}" ${checks[i]?'checked':''}><span>${esc(item)}</span></label>`).join('')}</div><div class="study-fields"><div><label for="studyStatus-${s.id}">完成狀態</label><select id="studyStatus-${s.id}"><option value="todo" ${!e.status||e.status==='todo'?'selected':''}>尚未開始</option><option value="partial" ${e.status==='partial'?'selected':''}>部分完成</option><option value="done" ${e.status==='done'?'selected':''}>已完成</option><option value="postponed" ${e.status==='postponed'?'selected':''}>延期</option></select></div><div><label for="studyMinutes-${s.id}">實際分鐘</label><input id="studyMinutes-${s.id}" type="number" min="0" max="1440" value="${Number(e.minutes)||0}"></div></div><label for="studyNote-${s.id}">心得、卡關與下次目標</label><textarea id="studyNote-${s.id}" placeholder="今天學到什麼？有什麼需要修改？">${esc(e.note||'')}</textarea></section>`}).join('')}
 <section class="card"><div class="study-actions"><button id="studySave">💾 儲存今天的三項紀錄</button><button id="studyExport" class="ghost">⬇ 匯出進修備份 JSON</button><button id="studyImport" class="ghost">⬆ 匯入進修備份</button><input id="studyImportFile" type="file" accept="application/json,.json" hidden></div><p class="study-muted">目前進修紀錄僅儲存在這台裝置的瀏覽器（依登入帳號區分），尚未同步 Supabase；更換裝置或清除瀏覽器資料可能遺失。請定期匯出備份。原有 Bass 雲端練習紀錄不受影響，這裡的 Bass 時數也不會自動加到舊統計。</p></section>
 <section class="card"><h2>作品與技術驗收里程碑</h2>${STUDY_MILESTONES.map(([date,label])=>`<div class="entry"><b>${date}</b>　${esc(label)}</div>`).join('')}<p class="study-muted">期末：裙裝、澎袖上衣、原創服裝、兩頂鉤針帽，以及 Bass 指板／琶音／Groove／即興／完整歌曲錄音。</p></section>`);
 document.querySelectorAll('[data-study-date]').forEach(b=>b.onclick=()=>{studySelected=b.dataset.studyDate;render()});
 $('studyPrev').onclick=()=>{studySelected=studyDate(Math.max(0,weekStart-7));render()};
 $('studyNext').onclick=()=>{studySelected=studyDate(Math.min(50,weekStart+7));render()};
 $('studyToday').onclick=()=>{studySelected=studyIndex(today())>=0?today():STUDY_START;render()};
 $('studyDateInput').onchange=e=>{if(studyIndex(e.target.value)<0)return notice('請選 11/9–12/29 之間的日期');studySelected=e.target.value;render()};
 function saveStudyDay(message){
  let all=studyRead(),dayData={...(all[studySelected]||{})};
  for(let s of STUDY_SUBJECTS){
   let minutes=Number($('studyMinutes-'+s.id).value);
   if(!Number.isFinite(minutes)||minutes<0||minutes>1440)return notice('練習分鐘必須在 0–1440 之間');
   let checks=[...document.querySelectorAll(`[data-study-subcheck="${s.id}"]`)].map(el=>el.checked);
   let status=$('studyStatus-'+s.id).value;
   if(checks.length&&checks.every(Boolean))status='done';
   else if(status==='done')status=checks.some(Boolean)?'partial':'todo';
   else if(checks.some(Boolean)&&status==='todo')status='partial';
   dayData[s.id]={...(dayData[s.id]||{}),status,checks,minutes,note:$('studyNote-'+s.id).value.slice(0,10000)};
  }
  all[studySelected]=dayData;
  if(studyWrite(all)){render();notice(message||'✓ 已儲存所有細項進度')}
 }
 document.querySelectorAll('[data-study-subcheck]').forEach(box=>box.onchange=()=>saveStudyDay('✓ 這個學習事項已自動儲存'));
 document.querySelectorAll('[id^="studyStatus-"]').forEach(select=>select.onchange=()=>{
  const sid=select.id.slice('studyStatus-'.length);
  if(select.value==='done')document.querySelectorAll(`[data-study-subcheck="${sid}"]`).forEach(box=>box.checked=true);
  if(select.value==='todo')document.querySelectorAll(`[data-study-subcheck="${sid}"]`).forEach(box=>box.checked=false);
  saveStudyDay('✓ 完成狀態已更新');
 });
 $('studySave').onclick=()=>saveStudyDay('✓ 三項進修紀錄與細項進度已儲存');
 $('studyExport').onclick=()=>{let blob=new Blob([JSON.stringify({version:1,plan:'2026-11-09/2026-12-29',records:studyRead()},null,2)],{type:'application/json'});let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='xianjian-study-backup-'+today()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)};
 $('studyImport').onclick=()=>$('studyImportFile').click();
 $('studyImportFile').onchange=async e=>{let f=e.target.files?.[0];if(!f)return;try{let obj=JSON.parse(await f.text());if(obj.version!==1||!obj.records||typeof obj.records!=='object'||Array.isArray(obj.records))throw Error('備份格式不符');if(!confirm('匯入會合併同日期的進修紀錄，並覆蓋重複日期。確定嗎？'))return;let merged={...studyRead()};for(let [date,subjects] of Object.entries(obj.records)){if(studyIndex(date)<0||!subjects||typeof subjects!=='object')continue;let row={...(merged[date]||{})};for(let s of STUDY_SUBJECTS){let r=subjects[s.id];if(!r||typeof r!=='object')continue;row[s.id]={status:['todo','partial','done','postponed'].includes(r.status)?r.status:'todo',minutes:Math.max(0,Math.min(1440,Number(r.minutes)||0)),note:String(r.note||'').slice(0,10000),checks:Array.isArray(r.checks)?r.checks.map(Boolean):undefined}}merged[date]=row}if(studyWrite(merged)){render();notice('✓ 已匯入進修紀錄')}}catch(err){notice('匯入失敗：'+err.message)}};
}
