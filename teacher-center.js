'use strict';
/* Teacher dashboard. All student data is read-only here; legacy pair-specific tools use selectedPair. */
let teacherPairs=[], teacherSelectedId=null, teacherCache=new Map(), teacherFilter='';
function teacherPairSelected(){return teacherPairs.find(p=>p.student_id===teacherSelectedId)||teacherPairs[0]||null}
function teacherDisplay(p){return p.student_label||p.student_name||('學生 '+String(p.student_id).slice(0,8))}
async function teacherLoadPairs(){
 if(!user||role!=='teacher')return;
 const {data,error}=await client.from('music_pairs').select('*').eq('teacher_id',user.id).order('id',{ascending:true});
 if(error){notice('學生清單讀取失敗：'+error.message);return}
 teacherPairs=data||[];
 if(!teacherPairs.some(p=>p.student_id===teacherSelectedId))teacherSelectedId=teacherPairs[0]?.student_id||null;
 const chosen=teacherPairSelected();pair=chosen||null;
 if(chosen)await loadPairData();
}
async function teacherSelectStudent(id){
 if(role!=='teacher')return;
 const p=teacherPairs.find(p=>p.student_id===id);if(!p)return;
 teacherSelectedId=id;pair=p;await loadPairData();
 if(page==='teacherCenter')teacherCenter();else render();
}
function teacherStudentPicker(){return `<div class="teacher-picker"><label for="teacherStudentSelect">目前查看的學生</label><select id="teacherStudentSelect">${teacherPairs.map(p=>`<option value="${esc(p.student_id)}" ${p.student_id===teacherSelectedId?'selected':''}>${esc(teacherDisplay(p))}</option>`).join('')}</select></div>`}
function teacherBindPicker(){const el=$('teacherStudentSelect');if(el)el.onchange=()=>teacherSelectStudent(el.value)}
async function teacherGetStudentData(id){
 const [practice,sync]=await Promise.all([
  client.from('practice_days').select('practice_date,data').eq('user_id',id).order('practice_date',{ascending:false}).limit(300),
  client.from('learning_sync_fields').select('namespace,path_key,value').eq('user_id',id).eq('namespace','bass').limit(2000)
 ]);
 if(practice.error)throw practice.error;
 if(sync.error)throw sync.error;
 const data={practice:practice.data||[],skills:sync.data||[]};teacherCache.set(id,data);return data;
}
function teacherSkillSummary(rows){
 const levels=new Map();for(const r of rows){let path;try{path=JSON.parse(r.path_key)}catch{continue}
 if(path[0]!=='levels'||path.length<3)continue;
 const skill=path[1];if(path[2]==='level')levels.set(skill,Number(r.value)||0);
 }
 return {total:levels.size,started:[...levels.values()].filter(n=>n>0).length,ready:[...levels.values()].filter(n=>n>=3).length,levels};
}
async function teacherCenter(){
 if(!user||role!=='teacher'){content(card('老師教學中心','請使用已配對的老師帳號登入。'));return}
 if(!teacherPairs.length){content(`<div class="hero"><h2>🎓 老師教學中心</h2><p>目前沒有配對學生。請先在 Supabase 建立 music_pairs 配對紀錄。</p></div>`);return}
 const rows=teacherPairs.filter(p=>teacherDisplay(p).toLowerCase().includes(teacherFilter.toLowerCase()));
 content(`<div class="hero"><span class="eyebrow">TEACHER DASHBOARD</span><h2>🎓 老師教學中心</h2><p>管理多位已配對學生，切換後可使用原本的聯絡簿、挑戰與印章。</p></div>
 <div class="teacher-metrics"><div class="card"><small>已配對學生</small><h2>${teacherPairs.length}</h2></div><div class="card"><small>目前選擇</small><h2>${esc(teacherDisplay(teacherPairSelected()))}</h2></div></div>
 <section class="card"><h2>學生清單</h2><input id="teacherSearch" placeholder="搜尋學生暱稱或編號" value="${esc(teacherFilter)}"><div class="teacher-list">${rows.map(p=>`<button class="teacher-student ${p.student_id===teacherSelectedId?'selected':''}" data-student-id="${esc(p.student_id)}"><strong>🎸 ${esc(teacherDisplay(p))}</strong><small>${p.student_id===teacherSelectedId?'目前選取':'查看學生資料'} · ${esc(String(p.student_id).slice(0,8))}</small></button>`).join('')||'<p>找不到符合的學生。</p>'}</div></section>
 <section class="card"><h2>學生學習檔案</h2>${teacherStudentPicker()}<div class="buttons"><button data-go="teacherDiary" class="ghost">📖 練習日誌</button><button data-go="contact" class="ghost">💌 聯絡簿</button><button data-go="challenges" class="ghost">🏆 作業驗收</button><button data-go="stamps" class="ghost">🍊 印章</button></div><div id="teacherStudentData"><p class="hint">正在載入學生的 Bass 練習紀錄…</p></div></section>`);
 $('teacherSearch').oninput=e=>{teacherFilter=e.target.value;document.querySelectorAll('[data-student-id]').forEach(b=>{const p=teacherPairs.find(x=>x.student_id===b.dataset.studentId);b.hidden=!teacherDisplay(p).toLowerCase().includes(teacherFilter.toLowerCase())})};
 document.querySelectorAll('[data-student-id]').forEach(b=>b.onclick=()=>teacherSelectStudent(b.dataset.studentId));
 teacherBindPicker();document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
 const id=teacherSelectedId;try{const d=await teacherGetStudentData(id);if(page!=='teacherCenter'||teacherSelectedId!==id)return;
 const recent=d.practice.slice(0,30),mins=recent.reduce((n,r)=>n+(Number(r.data?.minutes)||0),0),skill=teacherSkillSummary(d.skills);
 $('teacherStudentData').innerHTML=`<div class="teacher-metrics"><div class="teacher-metric"><strong>${recent.length}</strong><small>最近 30 筆練習紀錄</small></div><div class="teacher-metric"><strong>${(mins/60).toFixed(1)}h</strong><small>最近 30 筆累計</small></div><div class="teacher-metric"><strong>${skill.started}</strong><small>已開始的 Bass 技能</small></div><div class="teacher-metric"><strong>${skill.ready}</strong><small>達 Lv.3 的技能</small></div></div><h3>近期練習</h3>${recent.slice(0,12).map(r=>`<div class="teacher-log"><b>${esc(r.practice_date)}</b><span>${esc(r.data?.song||r.data?.teacherSong||'未填曲目')} · ${esc(r.data?.minutes||0)} 分鐘 · BPM ${esc(r.data?.bpm||'—')}</span></div>`).join('')||'<p class="hint">尚無可讀取的練習紀錄。</p>'}<h3>Bass 技能進度</h3><div class="teacher-skills">${[...skill.levels].filter(([_,v])=>v>0).slice(0,60).map(([k,v])=>`<span class="teacher-skill">${esc(typeof BG_SKILLS!=='undefined'?(BG_SKILLS.find(s=>s.id===k)?.name||k):k)} · Lv.${v}</span>`).join('')||'<p class="hint">尚無技能資料，或學生尚未同步技能圖鑑。</p>'}</div><p class="hint">老師端為唯讀檢視。技能資料僅顯示學生已同步的 Bass 等級，不包含個人縫紉／鉤針日記。</p>`;
 }catch(e){if(page==='teacherCenter'&&teacherSelectedId===id)$('teacherStudentData').innerHTML=`<p class="hint">資料讀取失敗：${esc(e.message)}。請確認已執行附帶的老師讀取權限 SQL。</p>`}
}
