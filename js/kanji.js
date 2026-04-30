let kanjiList = [];
let kIndex = 0;

async function loadKanji(){
  let res = await fetch("data/kanji.json");
  kanjiList = await res.json();
  kIndex = 0;
  showKanji();
}

function showKanji(){
  document.getElementById("kdata").innerText =
    kanjiList[kIndex].kanji + " = " + kanjiList[kIndex].meaning;
}

function nextKanji(){
  kIndex++;
  if(kIndex >= kanjiList.length) kIndex = 0;
  showKanji();
}
