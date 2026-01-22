const termsList_tbody = document.querySelector('#terms-list tbody');
const termsList_count = document.getElementById("terms-list-count");
const statusDiv = document.getElementById("status");
const downloadBtn = document.getElementById('downloadBtn');

let terms = [];

function extract(){

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    chrome.tabs.sendMessage(tabs[0].id, { action: "getTerms" }, (response) => {

      if (chrome.runtime.lastError) {
        statusDiv.innerHTML = `<span style="color: red;">Website not supported</span>`;
        termsList_tbody.innerHTML = `
        <tr>
          <td colspan="2">No terms found</td>
        </tr>
        `;
        return;
      }

      terms = response || [];

      if (!terms || terms.length === 0) {
        statusDiv.innerHTML = `<span style="color:red;">No terms found</span>`;
        termsList_tbody.innerHTML = `
        <tr>
          <td colspan="2">No terms found</td>
        </tr>
        `;
        return;
      }

      termsList_count.textContent = `Found: ${terms.length}`;

      termsList_tbody.innerHTML = "";
      terms.forEach(t => {
        termsList_tbody.innerHTML += `
        <tr>
          <td>${t.word}</td>
          <td>${t.definition}</td>
        </tr>
        `;
      });

      statusDiv.innerHTML = `<span style="color:green;">All terms loaded</span>`;

    });

  });

}

function clickLoadMore() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    chrome.tabs.sendMessage(tabs[0].id, { action: "clickLoadMore" }, (response) => {

      if (chrome.runtime.lastError) {
        statusDiv.innerHTML = `<span style="color: red;">Website not supported</span>`;
        termsList_tbody.innerHTML = `
        <tr>
          <td colspan="2">No terms found</td>
        </tr>
        `;
        return;
      }

      if(response){
        setTimeout(clickLoadMore, 2500);
      } else {
        statusDiv.innerHTML = `Extracting terms<span class="spinner"></span>`;
        extract();
      }

    });

  });
}
clickLoadMore();


// CSV Download
downloadBtn.addEventListener('click', () => {
  if (!terms || terms.length === 0) {
    document.getElementById("downloadFeedback").textContent = "No terms to export";
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,";
  terms.forEach(function(word) {
    const term = word.word.trim();
    const definition = word.definition.trim();
    csvContent += `"${term.replace(/"/g, '""')}","${definition.replace(/"/g, '""')}"\r\n`;
  });
  csvContent = csvContent.trim();

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.style.display = "none";
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `quizlet-words.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
