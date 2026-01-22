function getTerms() {
  
  const terms = [];
  const termElements = document.querySelectorAll('.SetPageTermsList-term');

  termElements.forEach(termEl => {
    const sides = termEl.querySelectorAll('.TermText');
    if (sides.length >= 2) {
      const word = sides[0].innerText.trim();
      const definition = sides[1].innerText.trim();
      terms.push({ word, definition });
    }
  });

  return terms;
}

function clickLoadMore(){
  const btn = document.querySelector('.SetPageTermsList-term').parentNode.querySelector("button");
  if(btn){
    btn.click();
    return true;
  } else{
    return false;
  }
}

// Make it accessible for popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.action){
    case "getTerms":
      sendResponse(getTerms());
      break;
    case "clickLoadMore":
      sendResponse(clickLoadMore());
      break;
  }
});