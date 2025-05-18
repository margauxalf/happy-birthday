// static/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // ① Grab modal elements
  const modal     = document.getElementById('game-modal');
  const modalBody = document.getElementById('modal-body');
  const btnClose  = document.getElementById('modal-close');

  // ② Close helper
  function closeModal() {
    modal.classList.add('hidden');
  }

  // ③ Main show‐modal function
  function showModalGame(gameId) {
    console.log('Opening game:', gameId);
    // clear old content
    modalBody.innerHTML = '';

    // find & clone the template section
    const template = document.getElementById(gameId);
    if (!template) {
      console.error(`No template with id="${gameId}" found`);
      return;
    }
    const clone = template.cloneNode(true);
    clone.classList.remove('hidden');
    clone.removeAttribute('id'); // avoid duplicate IDs

    // Rewrite any ←Back buttons to close the modal
    clone.querySelectorAll('button').forEach(btn => {
      if (btn.textContent.trim().startsWith('←')) {
        btn.onclick = closeModal;
      }
    });

    // Insert into modal
    modalBody.appendChild(clone);

    // Initialize the correct game inside **this** clone
    if (gameId === 'wordle') {
      loadWordleGame(clone);
    } else if (gameId === 'connections') {
      loadConnectionsGame(clone);
    }

    // Finally, show it
    modal.classList.remove('hidden');
  }

  // ④ Wire close icon and expose to global
  btnClose.addEventListener('click', closeModal);
  window.showModalGame = showModalGame;
  window.closeModalGame = closeModal;
});
