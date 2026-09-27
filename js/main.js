/**
 * THIỆP MỜI CƯỚI ONLINE: TRẦN HÀ & THANH TUYỀN
 * Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initEnvelope();
  initCountdown();
  initFlipbook();
  initGalleryLightbox();
  initCopySTK();
  initCalendar();
  initWishes();
  initRSVP();
  initPetalsAnimation();
  initNavigation();
  initScrollReveal();
});

/* ==========================================================================
   1. ENVELOPE MODAL OPENING EXPERIENCE
   ========================================================================== */
function initEnvelope() {
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const btnOpen = document.getElementById('btn-open-envelope');
  const btnClose = document.getElementById('btn-close-envelope');

  if (!envelopeOverlay) return;

  function closeEnvelope() {
    // Start music upon user click
    if (window.playWeddingMusic) {
      window.playWeddingMusic();
    }

    // Trigger heart burst
    createHeartBurst();

    // Hide envelope
    envelopeOverlay.classList.add('hidden');

    // Smooth scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (btnOpen) btnOpen.addEventListener('click', closeEnvelope);
  if (btnClose) btnClose.addEventListener('click', closeEnvelope);
}

function createHeartBurst() {
  const colors = ['#dfb842', '#f6e39b', '#ff4d6d', '#ff758f'];
  for (let i = 0; i < 30; i++) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.style.position = 'fixed';
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    heart.style.fontSize = Math.random() * 24 + 16 + 'px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '999999';
    heart.style.transition = 'all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)';
    heart.style.transform = 'translate(-50%, -50%) scale(0.5)';
    document.body.appendChild(heart);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 250 + 100;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;

    requestAnimationFrame(() => {
      heart.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(1.4)`;
      heart.style.opacity = '0';
    });

    setTimeout(() => heart.remove(), 1300);
  }
}

/* ==========================================================================
   2. COUNTDOWN TIMER (TO 18:30, OCT 02, 2026)
   ========================================================================== */
function initCountdown() {
  // Target: 2026-10-02 18:30:00 (GMT+7)
  const targetDate = new Date('2026-10-02T18:30:00+07:00').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. FLIPBOOK / CARD SLIDER VIEWER (10 PAGES) WITH 3-SECOND AUTO-PLAY
   ========================================================================== */
function initFlipbook() {
  const pages = document.querySelectorAll('.flip-page');
  const thumbs = document.querySelectorAll('.thumb-item');
  const prevBtn = document.querySelector('.flip-prev');
  const nextBtn = document.querySelector('.flip-next');
  const currentIndicator = document.getElementById('flip-current-page');
  const progressBar = document.getElementById('flip-progress-bar');
  const autoplayToggle = document.getElementById('flip-autoplay-toggle');
  const stage = document.querySelector('.flipbook-stage');

  if (!pages.length) return;

  let currentPage = 1;
  const totalPages = pages.length;
  let isAutoplay = true; // Chế độ tự động chuyển ảnh mỗi 3 giây bật mặc định
  let autoplayTimer = null;
  const SLIDE_DURATION = 3000; // 3 giây tự chuyển một ảnh
  let isUserInteracting = false;
  let isSectionVisible = true;

  function updateAutoplayButtonUI() {
    if (!autoplayToggle) return;
    const icon = autoplayToggle.querySelector('.autoplay-icon');
    const text = autoplayToggle.querySelector('.autoplay-text');

    if (isAutoplay) {
      autoplayToggle.classList.add('active');
      if (icon) icon.textContent = '⏸';
      if (text) text.textContent = 'Tự động lật (3s)';
    } else {
      autoplayToggle.classList.remove('active');
      if (icon) icon.textContent = '▶';
      if (text) text.textContent = 'Bật tự động lật (3s)';
    }
  }

  function resetAutoplay() {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }

    if (progressBar) {
      progressBar.classList.remove('running', 'paused');
      void progressBar.offsetWidth; // Buộc trình duyệt reflow để reset thanh tiến trình mượt mà
    }

    if (!isAutoplay || isUserInteracting || !isSectionVisible) {
      if (progressBar && (!isAutoplay || isUserInteracting)) {
        progressBar.classList.add('paused');
      }
      return;
    }

    if (progressBar) {
      progressBar.classList.add('running');
    }

    autoplayTimer = setTimeout(() => {
      showPage(currentPage < totalPages ? currentPage + 1 : 1);
    }, SLIDE_DURATION);
  }

  function showPage(pageIndex) {
    if (pageIndex < 1) pageIndex = 1;
    if (pageIndex > totalPages) pageIndex = totalPages;

    currentPage = pageIndex;

    pages.forEach((p, idx) => {
      if (idx + 1 === currentPage) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    thumbs.forEach((t, idx) => {
      if (idx + 1 === currentPage) {
        t.classList.add('active');
        t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        t.classList.remove('active');
      }
    });

    if (currentIndicator) {
      currentIndicator.textContent = `${currentPage} / ${totalPages}`;
    }

    // Khởi động lại đếm 3 giây cho trang mới
    resetAutoplay();
  }

  // Nút bật/tắt tự động chuyển ảnh
  if (autoplayToggle) {
    autoplayToggle.addEventListener('click', () => {
      isAutoplay = !isAutoplay;
      updateAutoplayButtonUI();
      resetAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showPage(currentPage > 1 ? currentPage - 1 : totalPages);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showPage(currentPage < totalPages ? currentPage + 1 : 1);
    });
  }

  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      showPage(idx + 1);
    });
  });

  // Vuốt chạm cảm ứng trên di động & tạm dừng khi chạm
  if (stage) {
    let startX = 0;
    stage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isUserInteracting = true;
      resetAutoplay();
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      isUserInteracting = false;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          showPage(currentPage < totalPages ? currentPage + 1 : 1);
        } else {
          showPage(currentPage > 1 ? currentPage - 1 : totalPages);
        }
      } else {
        resetAutoplay();
      }
    }, { passive: true });

    // Tạm dừng khi rê chuột trên máy tính để khách đọc nội dung
    stage.addEventListener('mouseenter', () => {
      isUserInteracting = true;
      resetAutoplay();
    });

    stage.addEventListener('mouseleave', () => {
      isUserInteracting = false;
      resetAutoplay();
    });
  }

  // Điều hướng bằng phím mũi tên
  document.addEventListener('keydown', (e) => {
    const flipSec = document.getElementById('flipbook');
    if (!flipSec) return;
    const rect = flipSec.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowRight') showPage(currentPage < totalPages ? currentPage + 1 : 1);
      if (e.key === 'ArrowLeft') showPage(currentPage > 1 ? currentPage - 1 : totalPages);
    }
  });

  // Tự động dừng khi người dùng cuộn khỏi khu vực thiệp để tiết kiệm pin/CPU
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isSectionVisible = entry.isIntersecting;
        resetAutoplay();
      });
    }, { threshold: 0.15 });

    const flipSec = document.getElementById('flipbook');
    if (flipSec) observer.observe(flipSec);
  }

  showPage(1);
  updateAutoplayButtonUI();
}

/* ==========================================================================
   4. FULLSCREEN GALLERY LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  if (!items.length || !lightbox || !lightboxImg) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   5. COPY BANK ACCOUNT (VIETCOMBANK)
   ========================================================================== */
function initCopySTK() {
  const copyBtn = document.getElementById('btn-copy-stk');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const stk = '1037938724';
    navigator.clipboard.writeText(stk).then(() => {
      showToast('Đã sao chép số tài khoản: ' + stk);
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = stk;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      showToast('Đã sao chép số tài khoản: ' + stk);
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

/* ==========================================================================
   6. ADD TO GOOGLE CALENDAR
   ========================================================================== */
function initCalendar() {
  const btnCal = document.getElementById('btn-add-calendar');
  if (!btnCal) return;

  btnCal.addEventListener('click', (e) => {
    e.preventDefault();
    const title = encodeURIComponent('Lễ Thành Hôn: Trần Hà & Thanh Tuyền');
    const details = encodeURIComponent('Kính mời bạn đến dự lễ thành hôn của Trần Hà & Thanh Tuyền! Tiệc mừng vào lúc 18h30 ngày 02/10/2026.');
    const location = encodeURIComponent('Ninh Bình & Phú Thọ');
    // 2026-10-02 18:30 to 22:00 (UTC: 20261002T113000Z / 20261002T150000Z)
    const dates = '20261002T113000Z/20261002T150000Z';
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(gCalUrl, '_blank');
  });
}

/* ==========================================================================
   TELEGRAM NOTIFICATION SERVICE
   Bot: @thiepcuoionlinethanhtuyen_bot
   Chat ID: 7182023192
   ========================================================================== */
const TELEGRAM_CONFIG = {
  token: '8949382099:AAGCiwyf9XEJAz4gmLv8NBL3h4tSV25-Zho',
  chatId: '7182023192'
};

async function sendTelegramNotification(htmlMessage) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.chatId,
        text: htmlMessage,
        parse_mode: 'HTML'
      })
    });
    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error('Lỗi gửi thông báo Telegram:', error);
    return false;
  }
}

function getNowFormatted() {
  const now = new Date();
  return now.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/* ==========================================================================
   7. GUESTBOOK / LỜI CHÚC MỪNG (GỬI VỀ TELEGRAM)
   ========================================================================== */
function initWishes() {
  const form = document.getElementById('wish-form');
  const feed = document.getElementById('wishes-feed');

  if (!form || !feed) return;

  const defaultWishes = [
    {
      name: 'Nguyễn Minh Quân',
      relation: 'Bạn Chú Rể',
      message: 'Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long, mãi mãi mặn nồng son sắc như ngày đầu nhé!',
      time: 'Vừa xong'
    },
    {
      name: 'Trần Thu Thảo',
      relation: 'Bạn Cô Dâu',
      message: 'Chúc cô dâu Thanh Tuyền xinh đẹp nhất ngày cưới và chú rể Trần Hà luôn yêu thương, che chở cho nhau suốt cuộc đời!',
      time: '1 giờ trước'
    },
    {
      name: 'Lê Hoàng Anh',
      relation: 'Đồng Nghiệp',
      message: 'Mừng hạnh phúc đôi bạn trẻ! Sớm sinh quý tử, gia đình êm ấm tràn ngập tiếng cười hạnh phúc nha!',
      time: '3 giờ trước'
    }
  ];

  function getStoredWishes() {
    try {
      const data = localStorage.getItem('wedding_wishes_hatuyen');
      if (data) return JSON.parse(data);
    } catch (e) {}
    return defaultWishes;
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem('wedding_wishes_hatuyen', JSON.stringify(wishes));
    } catch (e) {}
  }

  function renderWishes() {
    const list = getStoredWishes();
    feed.innerHTML = '';
    list.forEach(w => {
      const item = document.createElement('div');
      item.className = 'wish-item';
      item.innerHTML = `
        <div class="wish-sender">
          <span>${escapeHTML(w.name)}</span>
          <span class="wish-relation">${escapeHTML(w.relation || 'Khách mời')}</span>
        </div>
        <div class="wish-message">${escapeHTML(w.message)}</div>
        <div class="wish-time">${escapeHTML(w.time || 'Vừa xong')}</div>
      `;
      feed.appendChild(item);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('wish-name');
    const relationInput = document.getElementById('wish-relation');
    const messageInput = document.getElementById('wish-message');
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = nameInput.value.trim();
    const relation = relationInput.value.trim() || 'Khách Quý';
    const message = messageInput.value.trim();

    if (!name || !message) {
      showToast('Vui lòng nhập tên và lời chúc của bạn!');
      return;
    }

    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Đang gửi lời chúc...</span>';
    }

    const timeString = getNowFormatted();

    // 1. Gửi thông báo đến Telegram Bot
    const teleText = 
`💌 <b>CÓ LỜI CHÚC MỚI TỪ KHÁCH MỜI!</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Người gửi:</b> ${escapeHTML(name)}
👥 <b>Mối quan hệ:</b> ${escapeHTML(relation)}
💬 <b>Lời chúc:</b>
<i>"${escapeHTML(message)}"</i>
⏰ <b>Thời gian:</b> ${timeString}
💍 <b>Thiệp cưới:</b> Trần Hà & Thanh Tuyền`;

    await sendTelegramNotification(teleText);

    // 2. Lưu và hiển thị ngay trên website
    const newWish = {
      name: name,
      relation: relation,
      message: message,
      time: 'Vừa xong'
    };

    const currentWishes = getStoredWishes();
    currentWishes.unshift(newWish);
    saveWishes(currentWishes);
    renderWishes();

    nameInput.value = '';
    messageInput.value = '';

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }

    showToast('Cảm ơn lời chúc ngọt ngào của bạn! Đã gửi tới cô dâu & chú rể ❤');
    createHeartBurst();
  });

  renderWishes();
}

/* ==========================================================================
   8. RSVP FORM (XÁC NHẬN THAM DỰ - GỬI VỀ TELEGRAM)
   ========================================================================== */
function initRSVP() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('rsvp-name');
    const phoneInput = document.getElementById('rsvp-phone');
    const sideInput = document.getElementById('rsvp-side');
    const guestsInput = document.getElementById('rsvp-guests');
    const attendanceInput = document.getElementById('rsvp-attendance');
    const noteInput = document.getElementById('rsvp-note');
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const side = sideInput ? sideInput.value : '';
    const guests = guestsInput ? guestsInput.value : '';
    const attendance = attendanceInput ? attendanceInput.value : '';
    const note = noteInput ? noteInput.value.trim() : '';

    if (!name || !phone) {
      showToast('Vui lòng điền họ tên và số điện thoại!');
      return;
    }

    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Đang gửi xác nhận...</span>';
    }

    const timeString = getNowFormatted();

    // Gửi thông báo đến Telegram Bot
    const teleText = 
`📋 <b>XÁC NHẬN THAM DỰ MỚI (RSVP)</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Khách mời:</b> ${escapeHTML(name)}
📞 <b>Số điện thoại:</b> ${escapeHTML(phone)}
🏡 <b>Khách của:</b> ${escapeHTML(side)}
✅ <b>Xác nhận:</b> ${escapeHTML(attendance)}
👥 <b>Số lượng:</b> ${escapeHTML(guests)}
📝 <b>Lời nhắn / Ghi chú:</b> ${escapeHTML(note || 'Không có')}
⏰ <b>Thời gian:</b> ${timeString}
💍 <b>Thiệp cưới:</b> Trần Hà & Thanh Tuyền`;

    await sendTelegramNotification(teleText);

    const rsvpData = { name, phone, side, guests, attendance, note, date: new Date().toISOString() };
    try {
      const list = JSON.parse(localStorage.getItem('wedding_rsvp_list') || '[]');
      list.push(rsvpData);
      localStorage.setItem('wedding_rsvp_list', JSON.stringify(list));
    } catch (e) {}

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }

    showToast('Đã gửi xác nhận tham dự thành công! Cô dâu & Chú rể đã nhận được thông tin.');
    form.reset();
    createHeartBurst();
  });
}

/* ==========================================================================
   9. FALLING PETALS & GOLD HEARTS CANVAS ANIMATION
   ========================================================================== */
function initPetalsAnimation() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = window.innerWidth < 768 ? 16 : 28;
  const petals = [];

  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: Math.random() * 1.5 - 0.75,
      speedY: Math.random() * 1.2 + 0.6,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
      color: Math.random() > 0.4 ? 'rgba(223, 184, 66, ' + (Math.random() * 0.4 + 0.2) + ')' : 'rgba(255, 90, 120, ' + (Math.random() * 0.4 + 0.2) + ')'
    });
  }

  function drawHeart(x, y, size, color, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
    ctx.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.01) * 0.8 + p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      drawHeart(p.x, p.y, p.size, p.color, p.rotation);
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   10. MOBILE NAVIGATION & SMOOTH SCROLL
   ========================================================================== */
function initNavigation() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   11. SCROLL REVEAL UTILITY
   ========================================================================== */
function initScrollReveal() {
  document.body.classList.add('js-animate');
  const reveals = document.querySelectorAll('.reveal-on-scroll');

  function checkReveal() {
    const triggerBottom = window.innerHeight * 0.9;
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('revealed');
      }
    });
  }

  window.addEventListener('scroll', checkReveal);
  setTimeout(checkReveal, 100);
}

// Utility HTML escape
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
