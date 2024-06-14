function pauseGame() {
    gamePaused = !gamePaused;
    if (gamePaused) {
      pauseButton.innerHTML = "Resume";
      cancelAnimationFrame(mainGameLoop);
    } else {
      pauseButton.innerHTML = "Pause";
      mainGameLoop();
    }
  }
  
  function resetGame() {
    document.location.reload();
  }
  
  function gameOverFunction() {
    cancelAnimationFrame(mainGameLoop);
    gameOverPopup.style.visibility = "visible";
  }