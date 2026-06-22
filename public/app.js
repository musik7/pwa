// Register service worker and handle beforeinstallprompt for install flow
let deferredPrompt = null;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((err) => console.error('SW register failed', err));
}

const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  deferredPrompt = e;
  // Show the install button
  if (installBtn) installBtn.style.display = 'block';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    // Show the prompt
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      console.log('userChoice', choice);
      deferredPrompt = null;
      installBtn.style.display = 'none';
    } catch (err) {
      console.error('Prompt failed', err);
    }
  });
}
