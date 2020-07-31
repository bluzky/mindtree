
const colors = ["#FFC312", "#C4E538", "#12CBC4", "#FDA7DF", "#ED4C67", "#F79F1F", "#A3CB38", "#1289A7",
"#D980FA", "#B53471", "#833471", "#9980FA", "#0652DD", "#009432", "#EE5A24", "#EA2027", "#006266", "#5758BB", "#6F1E51"];

function randomInt(max){
    return Math.floor(Math.random() * max);
}
module.exports = () => {
  let index = randomInt(colors.length);
  return colors[index];
}
