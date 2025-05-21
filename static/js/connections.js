
const DIFFICULTY_COLORS = {
  yellow: '#ffeb3b',
  green:  '#4caf50',
  blue:   '#2196f3',
  purple: '#9c27b0'
};

const connectionGroups = [
  { name: "Horribles surnoms de couple", words: ["Bébé","Biche","Lapin","Chat"],   difficulty: "yellow"  },
  { name: "Lieux de fornication",         words: ["Douche","Lit","Parc","Toilettes"], difficulty: "green"   },
  { name: "En lien avec la Bretagne",     words: ["Aber","Biniou","Gallec","Reverdie"],   difficulty: "blue"    },
  { name: "Malo[...]",                     words: ["Coeur","Coccyx","Cul","Tru"],     difficulty: "purple"  }
];

let selectedConn       = [];
let remainingConn      = [];
let connectionsContainer = document;  // will point at the current modal’s clone

/**
 * Builds or resets the Connections grid & “found” area
 * inside the passed container (your modal clone).
 * @param {HTMLElement} [container=document]
 */
function loadConnectionsGame(container = document) {
  // Remember which container we’re in
  connectionsContainer = container;

  // Reset state
  selectedConn  = [];
  remainingConn = connectionGroups.map(g => ({ ...g }));

  // Grab scoped elements
  const msg         = container.querySelector('#connections-message');
  const foundGroups = container.querySelector('#found-groups');
  const grid        = container.querySelector('#connections-grid');

  msg.textContent       = '';
  foundGroups.innerHTML = '';
  grid.innerHTML        = '';

  // Flatten & shuffle words
  const flat = connectionGroups
    .flatMap((g,i) => g.words.map(w => ({ word: w, groupIndex: i })))
    .sort(() => Math.random() - 0.5);

  // Create each tile and attach its click handler
  flat.forEach(({ word, groupIndex }) => {
    const tile = document.createElement('div');
    tile.className          = 'word-tile';
    tile.textContent        = word;
    tile.dataset.groupIndex = groupIndex;
    tile.addEventListener('click', () => toggleConn(tile));
    grid.appendChild(tile);
  });
}

/** Toggle a tile’s selected state */
function toggleConn(tile) {
  const w = tile.textContent;
  if (tile.classList.contains('selected')) {
    tile.classList.remove('selected');
    selectedConn = selectedConn.filter(x => x !== w);
  } else if (selectedConn.length < 4) {
    tile.classList.add('selected');
    selectedConn.push(w);
  }
}

/** Checks the current selection against remaining groups */
function checkConnections() {
  const container = connectionsContainer;
  const msg       = container.querySelector('#connections-message');

  if (selectedConn.length !== 4) {
    msg.textContent = '⚠️ Sélectionner 4 mots!';
    return;
  }

  const found = remainingConn.find(g =>
    selectedConn.every(w => g.words.includes(w))
  );

  if (!found) {
    msg.textContent = '❌ Groupe invalide.';
    return;
  }

  // Remove matched tiles from this container
  container.querySelectorAll('.word-tile').forEach(tile => {
    if (found.words.includes(tile.textContent)) {
      tile.remove();
    }
  });

  // Build the “found” row
  const groupContainer = document.createElement('div');
  groupContainer.className = 'found-group';

  const label = document.createElement('div');
  label.className   = 'found-label';
  label.textContent = found.name.toUpperCase();
  groupContainer.appendChild(label);

  const row = document.createElement('div');
  row.className = 'found-row';
  const col = DIFFICULTY_COLORS[found.difficulty];
  found.words.forEach(w => {
    const ft = document.createElement('div');
    ft.className             = 'found-tile';
    ft.textContent           = w;
    ft.style.backgroundColor = col;
    ft.style.color           = '#000';
    row.appendChild(ft);
  });
  groupContainer.appendChild(row);
  
  container.querySelector('#found-groups').appendChild(groupContainer);

  // Update state & message
  msg.textContent   = `✅ Catégorie ${found.name} trouvée!`;
  remainingConn     = remainingConn.filter(g => g !== found);
  selectedConn      = [];

  if (remainingConn.length === 0) {
    msg.textContent = '🎉 Bien joué!';
  }
}

// Expose to your HTML buttons
window.loadConnectionsGame = loadConnectionsGame;
window.checkConnections    = checkConnections;
