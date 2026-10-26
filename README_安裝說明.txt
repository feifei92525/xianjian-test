弦間小日子 2.0 — 網頁完整功能版
================================
檔案：index.html、styles.css、app.js、supabase-upgrade.sql

部署
1. 將 index.html、styles.css、app.js 上傳到 xianjian-test GitHub Repository 根目錄，取代舊版三檔。
2. GitHub Pages 選 main / (root)，等待發布。
3. 網站可在不登入時使用部分本機練習功能；雙人功能需完成下方資料庫設定。

Supabase 設定（管理員操作）
1. 請先備份原本的 practice_days 資料表。SQL 不會刪除它。
2. 在原本 Supabase 專案 SQL Editor 執行 supabase-upgrade.sql。先確認目前沒有同名但結構不同的資料表。
3. 兩位各自以 Email 密碼登入一次，於 Authentication > Users 取得兩位 UUID。
4. 在 SQL Editor 執行：
   insert into public.music_pairs(student_id,teacher_id)
   values ('學生 UUID','老師 UUID');
5. 登出再登入，師生功能就會顯示。只有老師帳號可頒發印章與驗收挑戰。
6. 若要使用 Google 登入：Supabase Authentication > Providers > Google 設定 Google OAuth；並將 GitHub Pages 網址加入 Authentication > URL Configuration > Redirect URLs。

重要注意
- app.js 已使用你原本提供的 Supabase publishable key；這是公開用的 publishable key，不是 service_role。
- 請勿將 service_role 或其他私密金鑰放到 GitHub。
- 練習紀錄沿用 practice_days，但新版的 minutes 欄位與舊版 actualHours 可能並存；程式保留舊 JSON 欄位。
- 同日多裝置同時編輯可能仍有最後寫入者覆蓋的風險；建議同一時間只在一台裝置修改。
- 舊版 bassJourneyV2 或 bassJourneyDB 的純本機資料不會自動匯入；需先在舊版同步到 Supabase 或另行遷移。
- 尚未進行真實 Supabase 帳號端對端測試，正式使用前建議備份並確認兩位帳號權限。
