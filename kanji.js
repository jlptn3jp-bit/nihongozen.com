let kanjiList=[];

for(let x=1;x<=1000;x++){
kanjiList.push({
k:"漢字 "+x,
m:"Meaning "+x
});
}

let k=0;

function nextKanji(){
k++;
if(k>=kanjiList.length)k=0;

document.getElementById("kdata").innerText=
kanjiList[k].k+" = "+kanjiList[k].m;
}
