let lessons=[
["私は学生です","I am a student"],
["水を飲みます","I drink water"],
["日本語を勉強します","I study Japanese"],
["映画を見ます","I watch movies"]
];

let i=0;

function nextLesson(){
i++;
if(i>=lessons.length)i=0;

document.getElementById("jp").innerText=lessons[i][0];
document.getElementById("en").innerText=lessons[i][1];
}
