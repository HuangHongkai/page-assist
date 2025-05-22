const urlInput = document.getElementById('url-input');
const visitBtn = document.getElementById('visit-btn');
const iframeContainer = document.getElementById('underside-iframe-container');
const firstTimeGuide = document.getElementById('first-time-guide');
const closeButton = document.getElementById('close-btn');
const logo = document.getElementById('logo');

// 保存和恢复iframe URL的函数
function saveIframeUrl() {
  const currentUrl = iframeContainer.src;
  localStorage.setItem('lastIframeUrl', currentUrl);
}

function restoreIframeUrl() {
  const lastUrl = localStorage.getItem('lastIframeUrl') || 'http://192.168.31.221:8410/app/bc880743-850a-44e5-b073-9bf6ef4719f0/configuration?debug=1';
  if (lastUrl) {
    iframeContainer.src = lastUrl;
  }
}

// 检查是否是第一次使用插件，并在加载时恢复iframe URL
function checkFirstTime() {
  let isFirstTime = localStorage.getItem('isFirstTime');
  if (!isFirstTime) {
    firstTimeGuide.style.display = 'block';
    localStorage.setItem('isFirstTime', 'false');
  }
  restoreIframeUrl(); // 在这里调用恢复iframe URL的函数
}

// 打开URL在iframe中
function openUrlInIframe(url) {
  iframeContainer.src = url;
  saveIframeUrl(); // 在打开新URL时保存当前URL
  firstTimeGuide.style.display = 'none';
}

visitBtn.addEventListener('click', () => {
  let url = urlInput.value;
  url = ensureHttps(url);
  openUrlInIframe(url);
});

urlInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    let url = urlInput.value;
    url = ensureHttps(url);
    openUrlInIframe(url);
  }
});

function ensureHttps(url) {
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/; // 正则表达式来匹配IP地址
  if (ipRegex.test(url)) {
    return 'http://' + url;
  } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}


// 显示和隐藏搜索栏的函数
function hideSearchBar() {
  document.querySelector('.search-bar').style.display = 'none';
  iframeContainer.classList.add('fullscreen-iframe');
  // logo.style.display = 'block';
}

function showSearchBar() {
  document.querySelector('.search-bar').style.display = 'flex';
  iframeContainer.classList.remove('fullscreen-iframe');
  logo.style.display = 'none';
}

closeButton.addEventListener('click', hideSearchBar);
logo.addEventListener('click', showSearchBar);

const urlHistory = document.getElementById('url-history');

// 存储历史URL的函数
function saveUrlHistory(url) {
  let history = localStorage.getItem('urlHistory');
  history = history ? JSON.parse(history) : [];
  history.unshift(url);
  history = history.slice(0, 4); // 只保留最近的4个历史URL
  localStorage.setItem('urlHistory', JSON.stringify(history));
}

// 显示历史URL的函数
function showUrlHistory() {
  let history = localStorage.getItem('urlHistory');
  history = history ? JSON.parse(history) : [];
  urlHistory.innerHTML = '';
  history.forEach(url => {
    const a = document.createElement('a');
    a.textContent = url;
    a.addEventListener('click', () => {
      urlInput.value = url;
      openUrlInIframe(url);
      urlHistory.style.display = 'none';
    });
    urlHistory.appendChild(a);
  });
  urlHistory.style.display = 'block';
}

// 隐藏历史URL的函数
function hideUrlHistory() {
  urlHistory.style.display = 'none';
}

visitBtn.addEventListener('click', () => {
  let url = urlInput.value;
  url = ensureHttps(url);
  openUrlInIframe(url);
  saveUrlHistory(url);
});

urlInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    let url = urlInput.value;
    url = ensureHttps(url);
    openUrlInIframe(url);
    saveUrlHistory(url);
  }
});

urlInput.addEventListener('focus', showUrlHistory);
document.addEventListener('click', function(event) {
  if (event.target !== urlInput && event.target.parentNode !== urlHistory) {
    hideUrlHistory();
  }
});


// 在插件加载时检查是否是第一次使用，并恢复iframe URL
checkFirstTime();

