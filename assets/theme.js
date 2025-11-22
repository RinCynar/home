// Simple theme helper for Material You-like accents and light/dark mode
(function(){
  function hexToRgb(hex){
    if(!hex) return null;
    const h = hex.replace('#','');
    const bigint = parseInt(h.length===3? h.split('').map(c=>c+c).join('') : h,16);
    return [(bigint>>16)&255, (bigint>>8)&255, bigint&255];
  }

  function applyAccent(hex){
    const rgb = hexToRgb(hex) || [103,80,164];
    document.documentElement.style.setProperty('--accent-color', hex);
    document.documentElement.style.setProperty('--accent-color-rgb', rgb.join(','));
    // also mirror to md token
    document.documentElement.style.setProperty('--md-sys-primary', hex);
  }

  function getSavedAccent(){
    try{ return localStorage.getItem('accentColor'); }catch(e){return null}
  }

  function saveAccent(hex){
    try{ localStorage.setItem('accentColor', hex); }catch(e){}
  }

  // initialize
  const savedAccent = getSavedAccent();
  if(savedAccent) applyAccent(savedAccent);

  // expose helper
  window.MUITheme = {
    setAccent(hex){ applyAccent(hex); saveAccent(hex); },
    getAccent(){ return getSavedAccent(); }
  };

  // sync theme preference (light/dark) to document class if present
  try{
    const saved = localStorage.getItem('theme');
    if(saved==='light') document.documentElement.classList.add('light-theme');
    else if(saved==='dark') document.documentElement.classList.remove('light-theme');
  }catch(e){}

})();
