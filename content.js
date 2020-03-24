function handleColour(applyColour, colourSettings) {
  if (!Array.isArray(colourSettings.widgets)) {
    console.error('Invalid colour settings!')
    console.error(colourSettings)
    return
  }
  colourSettings.widgets.forEach(widget => {
    let elements = document.getElementsByClassName(widget.className);
    for (let element of elements) {
      let colour = 'white'
      if (applyColour) {
        widget.rules.forEach(rule => {
          if (typeof rule.colour !== 'string' || !Array.isArray(rule.textMatchers)) {
            console.error('Invalid colour rule!')
            console.error(rule)
            return
          }
          const shouldColour = rule.textMatchers.some(matcher => {
            let subTextElements = element.getElementsByClassName(matcher.className)
            let equalResult = false
            let endsWithResult = false
            let startsWithResult = false
            let includesResult = false
            for (let subTextElement of subTextElements) {
              if (Array.isArray(matcher.equal)) {
                equalResult = equalResult || matcher.equal.some(eqText => subTextElement.textContent.toLowerCase() === eqText.toLowerCase())
              }
              if (Array.isArray(matcher.endsWith)) {
                endsWithResult = endsWithResult || matcher.endsWith.some(suffixText => subTextElement.textContent.toLowerCase().endsWith(suffixText.toLowerCase()))
              }
              if (Array.isArray(matcher.startsWith)) {
                startsWithResult = startsWithResult || matcher.startsWith.some(suffixText => subTextElement.textContent.toLowerCase().startsWith(suffixText.toLowerCase()))
              }
              if (Array.isArray(matcher.includes)) {
                includesResult = includesResult || matcher.includes.some(suffixText => subTextElement.textContent.toLowerCase().includes(suffixText.toLowerCase()))
              }
              if (equalResult || endsWithResult || startsWithResult || includesResult) {
                break
              }
            }
            return equalResult || endsWithResult || startsWithResult || includesResult
          })
          if (shouldColour) {
            colour = rule.colour;
          }
        })
      }
      element.style.backgroundColor = colour;
    }
  })
}

function handleHide(hideoptions, hideSettings) {
  if (!Array.isArray(hideSettings.widgets)) {
    console.error('Invalid hide settings!')
    console.error(hideSettings)
    return
  }
  hideSettings.widgets.forEach(widget => {
    let elements = document.getElementsByClassName(widget.className);
    for (let element of elements) {
      if (hideoptions) {
        element.setAttribute('style', "visibility: hidden; width: 0; height:0;");
      } else {
        element.removeAttribute('style');
      }
    }
  })

}

function repaint() {
  chrome.storage.sync.get(['toggles', 'profile'], function (data) {
    if (data.profile.hide) {
      handleHide(data.toggles.hideoptions, data.profile.hide)
    }

    if (data.profile.colour) {
      handleColour(data.toggles.applycolour, data.profile.colour)
    }
  });
}

let painting = false
const paintDebounce = 5

function check() {
  setTimeout(() => {
    chrome.storage.sync.get(['profile'], function (data) {
      if (!document.getElementsByClassName(data.profile.className)[0]) {
        check()
      } else {
        document.getElementsByClassName(data.profile.className)[0].addEventListener('DOMSubtreeModified', () => {
          if (!painting) {
            painting = true
            repaint();
            setTimeout(() => {
              painting = false
            }, paintDebounce)
          }
        });
      }
    });
  }, paintDebounce);
}

check();
