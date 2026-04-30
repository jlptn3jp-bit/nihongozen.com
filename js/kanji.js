async function loadKanji() {
    const res = await fetch("data/kanji.json");
    const data = await res.json();

    let output = "";

    data.forEach(k => {
        output += `
            <div class="kanji-card">
                <h2>${k.character}</h2>
                <p>Meaning: ${k.meaning}</p>
                <p>Reading: ${k.reading}</p>
            </div>
        `;
    });

    document.getElementById("kanji").innerHTML = output;
}
