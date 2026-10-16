const $ = id => document.getElementById(id);
let tab, pickedSelector = null;
const say = msg => { $('status').textContent = msg; };
async function init() {
  [tab] = await chrome.tabs.query({active:true,currentWindow:true});
  let url; try { url = new URL(tab.url); } catch { url = null; }
  $('scope').textContent = url ? `Правила сохраняются локально для ${url.hostname}` : 'Эта страница недоступна для расширения.';
  $('pick').disabled = !url;
  const {pendingPick} = await chrome.storage.local.get('pendingPick');
  if (pendingPick?.tabId === tab.id) {
    pickedSelector = pendingPick.selector;
    $('replacement').placeholder = `Текст выбранного элемента: ${pendingPick.preview}`;
    $('save').disabled = false;
    say(`Выбран элемент: ${pickedSelector}`);
    await chrome.storage.local.remove('pendingPick');
  }
  await showRules();
}
async function showRules() {
  let host; try { host = new URL(tab.url).hostname; } catch { return; }
  const {rules=[]} = await chrome.storage.local.get('rules');
  const list = $('rules'); list.replaceChildren();
  rules.filter(r=>r.host===host).forEach(r=>{
    const li=document.createElement('li'), label=document.createElement('span'), del=document.createElement('button');
    label.textContent=`${r.selector} → ${r.text}`; del.textContent='Удалить';
    del.onclick=async()=>{const data=await chrome.storage.local.get('rules');await chrome.storage.local.set({rules:data.rules.filter(x=>x.id!==r.id)});await showRules();};
    li.append(label,del);list.append(li);
  });
  if (!list.children.length) { const li=document.createElement('li');li.textContent='Пока нет правил';list.append(li); }
}
$('pick').onclick=async()=>{
  try {
    await chrome.scripting.executeScript({target:{tabId:tab.id},files:['content.js']});
    await chrome.tabs.sendMessage(tab.id,{type:'PICK'});
    window.close();
  } catch { say('Не удалось включить пипетку на этой странице.'); }
};
$('save').onclick=async()=>{
  if(!pickedSelector)return;
  const host=new URL(tab.url).hostname, text=$('replacement').value;
  if(!text.trim()){say('Введите текст замены.');return;}
  const {rules=[]}=await chrome.storage.local.get('rules');
  rules.push({id:crypto.randomUUID(),host,selector:pickedSelector,text});
  await chrome.storage.local.set({rules});
  say('Сохранено. Правило сработает при следующей загрузке страницы.');
  $('save').disabled=true;pickedSelector=null;await showRules();
};
init();
