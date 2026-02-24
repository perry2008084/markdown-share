const previewEl = document.getElementById("preview");
const metaEl = document.getElementById("meta");
const themeToggle = document.getElementById("themeToggle");
const socialShareBtn = document.getElementById("socialShareBtn");
const paletteSwatches = document.querySelectorAll(".palette-swatch");
const socialShareModal = document.getElementById("socialShareModal");
const closeModal = document.getElementById("closeModal");

// 初始化多语言支持 - 等待 DOM 和所有脚本加载完成
document.addEventListener('DOMContentLoaded', function() {
  if (window.I18n) {
    // 设置当前语言并更新页面
    const savedLang = localStorage.getItem('language') || window.I18n.detectLanguage();
    window.I18n.setLanguage(savedLang);
    window.I18n.updatePageLanguage();

    // 监听语言选择器变化
    const selector = document.getElementById('languageSelector');
    if (selector) {
      selector.value = window.I18n.currentLang;
      selector.addEventListener('change', function(e) {
        window.I18n.setLanguage(e.target.value);
        window.I18n.updatePageLanguage();
      });
    }
  }
});

// 主题切换
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  const savedColor = localStorage.getItem("themeColor") || "ocean";
  document.body.className = savedTheme + "-theme";
  applyThemeColor(savedColor);
}

function toggleTheme() {
  const currentTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.className = newTheme + "-theme";
  localStorage.setItem("theme", newTheme);
}

function applyThemeColor(color) {
  document.body.dataset.themeColor = color;
  localStorage.setItem("themeColor", color);
  paletteSwatches.forEach((swatch) => {
    swatch.classList.toggle("is-active", swatch.dataset.themeColor === color);
  });
}

paletteSwatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    applyThemeColor(swatch.dataset.themeColor);
  });
});

initTheme();
themeToggle.addEventListener("click", toggleTheme);

// 触摸手势支持
let lastTouchEnd = 0;
document.addEventListener("touchend", (e) => {
  const now = Date.now();
  if (now - lastTouchEnd < 300) {
    // 双击放大
    if (e.target.closest(".preview-body")) {
      togglePreviewZoom(e.target.closest(".preview-body"));
    }
  }
  lastTouchEnd = now;
}, false);

function togglePreviewZoom(element) {
  if (element.style.fontSize === "18px") {
    element.style.fontSize = "14px";
  } else {
    element.style.fontSize = "18px";
  }
}

// 社交媒体分享
function openSocialShare() {
  socialShareModal.classList.remove("hidden");
}

function closeSocialShare() {
  socialShareModal.classList.add("hidden");
}

socialShareBtn.addEventListener("click", openSocialShare);
closeModal.addEventListener("click", closeSocialShare);
socialShareModal.addEventListener("click", (e) => {
  if (e.target === socialShareModal) {
    closeSocialShare();
  }
});

document.querySelectorAll(".social-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const platform = btn.dataset.platform;
    const url = location.href;
    const title = window.I18n?.t("查看我的 Markdown 分享") || "查看我的 Markdown 分享";
    shareToSocial(platform, url, title);
  });
});

function shareToSocial(platform, url, title) {
  const shareUrls = {
    wechat: () => {
      // 微信需要复制链接
      copyToClipboard(url);
      alert(window.I18n?.t("链接已复制，请在微信中粘贴分享") || "链接已复制，请在微信中粘贴分享");
    },
    qq: () => {
      window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, "_blank");
    },
    weibo: () => {
      window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, "_blank");
    },
    twitter: () => {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank");
    }
  };

  if (shareUrls[platform]) {
    shareUrls[platform]();
    closeSocialShare();
  }
}

const parts = location.pathname.split("/");
const id = parts[parts.length - 1];

loadShare();

async function loadShare() {
  try {
    const res = await fetch(`/api/share/${id}`);
    if (!res.ok) {
      throw new Error(window.I18n?.t("加载中...") || "加载中...");
    }
    const data = await res.json();
    const previewRes = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: data.content })
    });
    const previewData = await previewRes.json();
    previewEl.innerHTML = previewData.html;
    const time = new Date(data.createdAt).toLocaleString();
    metaEl.textContent = `${window.I18n?.t("加载中...") || "加载中..."} ${time}`;
  } catch (err) {
    metaEl.textContent = err.message || (window.I18n?.t("加载中...") || "加载中...");
  }
}

// 复制到剪贴板（供社交媒体分享使用）
function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  } catch (err) {
    console.error("复制失败:", err);
    alert(window.I18n?.t("复制失败，请手动复制链接") || "复制失败，请手动复制链接");
  }
}
