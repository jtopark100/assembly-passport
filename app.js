// ===== (1) 이전 SW/캐시 영향 제거: 첫 로드 1회만 실행
(function resetSW(){
  try{
    const KEY='sw_cleaned_R2';
    if('serviceWorker' in navigator && !localStorage.getItem(KEY)){
      navigator.serviceWorker.getRegistrations?.().then(rs=>{
        rs.forEach(r=>{ if(r.scope.includes('/assembly-passport/')) r.unregister(); });
      }).finally(()=>{
        localStorage.setItem(KEY,'1');
        // 쿼리 파라미터로 강제 새로고침
        if(!location.search.includes('v=')){
          location.replace(location.pathname+'?v='+Date.now()+location.hash);
        }
      });
    }
  }catch(e){}
})();

// ===== (2) 라우팅: 해시(#/route) 기반
const VIEWS = ['home','passport','upload','ranking','admin'];
function show(view){
  VIEWS.forEach(id=>{
    const el = document.getElementById('view-'+id);
    if(!el) return;
    el.classList.toggle('show', id===view);
  });
  window.scrollTo({top:0,behavior:'instant'});
}
function onHash(){
  const v = (location.hash.replace(/^#\/?/,'') || 'home');
  show( VIEWS.includes(v) ? v : 'home' );
}
window.addEventListener('hashchange', onHash);
window.addEventListener('DOMContentLoaded', ()=>{
  // 버튼 클릭 -> 해시 변경
  document.querySelectorAll('[data-route]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const v = btn.getAttribute('data-route');
      // 해시 변경(차단되면 fallback으로 직접 표시)
      try { location.hash = '#/'+v; } catch(e) { show(v); }
    }, {passive:true});
  });
  onHash(); // 초기 진입 시 현재 해시 반영
});