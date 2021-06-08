function createElement(elemType, parent, content, attributes) {
  let newElem = document.createElement(elemType);
  for(const attribute in attributes) {
    newElem.setAttribute(attribute,attributes[attribute]);
  }
  newElem.textContent = content;
  document.querySelector(parent).appendChild(newElem);
  return newElem;
}

function removeElement(elem) {
  elem.remove();
}


