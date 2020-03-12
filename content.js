var defaultColourRules = [
  {
    colour: 'lightgreen',
    withLabels: ['story', 'green', 'epic'],
    repoNameContains: ['-planning', '-stories']
  },
  {
    colour: 'pink',
    withLabels: ['production issue', 'pipeline break','critical','build break', 'pink'],
    repoNameContains: ['-support','-incidents', '-test', '-tickets']
  },
  {
     colour: 'lightyellow',
     withLabels: ['chore', 'enhancement', 'usability', 'bug', 'yellow'],
     repoNameContains: ['-debt', '-chore', '-usability']
  },
  {
    colour: 'lightblue',
    withLabels: ['rca-improvement', 'rca', 'blue'],
    repoNameContains: ['-rca-tasks', '-rca']
  }
]


var colourRules = defaultColourRules

function repaint() {
  var cards = document.getElementsByClassName('zhc-issue-card');
  let sidebar = document.getElementsByClassName('zhc-sidebar')[0];
  chrome.storage.sync.get('toggles', function(data) {
    if (data.toggles.hidesidebar) {
      sidebar.setAttribute('style', "visibility: hidden; width: 0;");
    } else {
      sidebar.removeAttribute('style');
    }
    for (var i = 0, l = cards.length; i < l; i++) {
      var card = cards[i];
      var spans = card.getElementsByTagName('span');
      for (var j= 0; j< spans.length; j++) {
        paintCard(spans[j], card, !data.toggles.colourissue);
      }
    }
  });
}

function paintCard(span, card, reset) {
  if (reset) {
    card.style.backgroundColor = 'white';
  } else {
    colourRules.forEach(function(rule) {
        if (
          typeof span.textContent === 'string' &&
          (rule.withLabels.includes(span.textContent.toLowerCase()) || rule.repoNameContains.some(r => span.textContent.includes(r)))
        ) {
          card.style.backgroundColor = rule.colour;
        }
    })
  }
}

let painting = false
const paintDebounce = 5

function check () {
  setTimeout(() => {
    if (!document.getElementsByClassName('zh-app__workspace')[0]) {
      check()
    } else {
      document.getElementsByClassName('zh-app__workspace')[0].addEventListener('DOMSubtreeModified', () => {
        if (!painting) {
          painting = true
            repaint();
          setTimeout(() => {
            painting = false
          }, paintDebounce)
        }
      });
    }
  }, paintDebounce);
}

check();
