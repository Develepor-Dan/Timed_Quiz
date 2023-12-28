document.addEventListener('DOMContentLoaded', function () {
     function printHighscores() {
       // either get scores from localstorage or set to empty array
       const highscores =
         JSON.parse(window.localStorage.getItem('highscores')) || [];
   
       // sort highscores by score property in descending order
       highscores.sort((a, b) => b.score - a.score);
   
       const olEl = document.getElementById('highscores');
   
       highscores.forEach((score) => {
         // create li tag for each high score
         const liTag = document.createElement('li');
         liTag.textContent = `${score.initials} - ${score.score}`;
   
         // display on page
         olEl.appendChild(liTag);
       });
     }
   
     function clearHighscores() {
       window.localStorage.removeItem('highscores');
       window.location.reload();
     }
   
     document.getElementById('clear').addEventListener('click', clearHighscores);
   
     // run function when page loads
     printHighscores();
   });
   