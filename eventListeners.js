document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "1":
      player.switchGun(0);
      break;
    case "2":
      player.switchGun(1);
      break;
    case "3":
      player.switchGun(2);
      break;
  }
});
