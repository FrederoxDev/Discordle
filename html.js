export function generateHtml(data) {
  let html = "";

  data.forEach((word) => {
    word.forEach((letter) => {
      html += `<div class="grid-item ${letter.color}">${letter.letter.toUpperCase()}</div>\n`;
    });
  });

  // For each word not included, draw empty boxes
  for (var i = 0; i < 6 - data.length; i++)
  {
    for (var j = 0; j < 6; j++) html += `<div class="grid-item empty"></div>`;
  }

  return `<html><head><style>${css}</style></head><body><div class="grid-container">${html}</div></body></html>`;
}

const css = 
`
body {
  width: min-content;
  height: min-content;
  background-color: #121213;
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
}

.grid-container {
  display: grid;
  width: 550px;
  height: 660px;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  grid-template-rows: repeat(6, 1fr);
}

.grid-item {
  font-weight: bold;
  color: #fff;
  width: 100px;
  height: 100px;
  font-size: 50px;

  display: flex;
  justify-content: center;
  text-align: center;
  align-content: center;
  flex-direction: column;
}

.green {
  background-color: #6aaa64;
}

.yellow {
  background-color: #c9b458;
}

.grey {
  background-color: #3a3a3c;
}

.empty {
  border: 2px solid #3a3a3c;
}
`