async function loadLessons(level) {
    const res = await fetch(`data/jlpt/${level}.json`);
    const data = await res.json();

    let output = "";

    data.lessons.forEach((lesson, index) => {
        output += `
            <div class="lesson-card">
                <h3>${lesson.title}</h3>
                <p>${lesson.description}</p>
                <button onclick="openLesson(${index})">Start</button>
            </div>
        `;
    });

    document.getElementById("lessons").innerHTML = output;
}
