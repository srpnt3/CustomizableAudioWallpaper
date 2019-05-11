document.addEventListener("DOMContentLoaded", function(e) {
  time();
});

function time() {
  var today = new Date();
  var day = getDay(today.getDay());
  var date = check(today.getDate());
  var month = check(today.getMonth() + 1);
  var year = today.getFullYear();
  var hours = check(today.getHours());
  var minutes = check(today.getMinutes());
  var seconds = check(today.getSeconds());
  document.getElementById("time").innerHTML = hours + ":" + minutes + ":" + seconds;
  document.getElementById("date").innerHTML = day + " " + date + "." + month + "." + year;
  setTimeout(time, 50);

  function check(x) {
    if (x < 10) {
      x = "0" + x;
    }
    return x;
  }

  function getDay(x) {
    switch (x) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        return "Noday";
    }
  }
}
