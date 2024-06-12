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
      document.getElementsByClassName("active")[0].classList.remove("active")
      document.getElementById(player.guns[0].name).classList.add("active")
      break;
    case "2":
      player.switchGun(1);
      document.getElementsByClassName("active")[0].classList.remove("active")
      document.getElementById(player.guns[1].name).classList.add("active")
      break;
    case "3":
      player.switchGun(2);
      document.getElementsByClassName("active")[0].classList.remove("active")
      document.getElementById(player.guns[2].name).classList.add("active")
      break;
  }
});
