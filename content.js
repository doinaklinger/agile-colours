let styleCacheForHiddenElements = {}


function handleColour(applyColour, colourSettings) {
  if (!Array.isArray(colourSettings.widgets)) {
    console.error('Invalid colour settings!')
    console.error(colourSettings)
    return
  }
  colourSettings.widgets.forEach(widget => {
    let elements = getElementsByQuery(document, widget.queryType, widget.queryText, widget.className);
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
            let subTextElements = getElementsByQuery(element, matcher.queryType, matcher.queryText, matcher.className)
            if (matcher.children) {
              // flatten children other than use a recursive function
              let childrenSubTextElements = []
              for (let subTextElement of subTextElements) {
                childrenSubTextElements.push(...getElementsByQuery(subTextElement, matcher.children.queryType, matcher.children.queryText, matcher.className))
              }
              subTextElements = childrenSubTextElements
              matcher = matcher.children
            }
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

function getElementsByQuery(parentElement, queryType, queryText, legacyClassName) {
  if (!queryType && legacyClassName) {
    // support old syntax
    return parentElement.getElementsByClassName(legacyClassName)
  }
  // dummy replacement of jquery selectors
  switch (queryType) {
    case 'className':
      return parentElement.getElementsByClassName(queryText)
    case 'tagName':
      return parentElement.getElementsByTagName(queryText)
    case 'name':
      return parentElement.getElementsByName(queryText)
    case 'id':
      return [parentElement.getElementById(queryText)]
    default:
      console.error(`invalid query type ${queryType}, with text ${queryText}`)
  }
}

function handleHide(hideoptions, hideSettings) {
  if (!Array.isArray(hideSettings.widgets)) {
    console.error('Invalid hide settings!')
    console.error(hideSettings)
    return
  }
  hideSettings.widgets.forEach(widget => {
    // only works for the first element found
    let element = getElementsByQuery(document, widget.queryType, widget.queryText, widget.className)[0];
    let cachedStyleInfo = styleCacheForHiddenElements[`${widget.queryType}-${widget.queryText}-${widget.className}`]
    if (hideoptions) {
      if (!cachedStyleInfo) {
        cachedStyleInfo = {
          hidden: true,
          cachedStyles: {}
        }
        if (widget.stylePropertiesOverrides) {
          for (let propertyName in widget.stylePropertiesOverrides) {
            cachedStyleInfo.cachedStyles[propertyName] = element.style.getPropertyValue(propertyName)
            element.style.setProperty(propertyName, widget.stylePropertiesOverrides[propertyName])
          }
        } else {
          // legacy logic

          const eHeight = element.style.getPropertyValue("height")
          const eWidth = element.style.getPropertyValue("width")
          if (!eHeight) {
            cachedStyleInfo.cachedStyles["height"] = ''
            element.style.setProperty("height", '0px')

          }
          if (!eWidth) {
            cachedStyleInfo.cachedStyles["width"] = ''
            element.style.setProperty("width", '0px')
          }


          cachedStyleInfo.cachedStyles["visibility"] = ''
          element.style.setProperty("visibility", 'hidden')

        }
        styleCacheForHiddenElements[`${widget.queryType}-${widget.queryText}-${widget.className}`] = cachedStyleInfo
      }
      // else already hidden do nothing

    } else {
      if (cachedStyleInfo?.hidden) {
        for (let propertyName in cachedStyleInfo.cachedStyles) {
          if (cachedStyleInfo.cachedStyles[propertyName] !== '') {
            element.style.setProperty(propertyName, cachedStyleInfo.cachedStyles[propertyName])
          } else {
            element.style.removeProperty(propertyName)
          }
        }
        delete styleCacheForHiddenElements[`${widget.queryType}-${widget.queryText}-${widget.className}`]
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
      if (!getElementsByQuery(document, data.profile.queryType, data.profile.queryText, data.profile.className)[0]) {
        check()
      } else {
        getElementsByQuery(document, data.profile.queryType, data.profile.queryText, data.profile.className)[0].addEventListener('DOMSubtreeModified', () => {
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
