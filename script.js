document.addEventListener("DOMContentLoaded", function () {
  loadExplore(15);
});
function loadExplore(reqs = 10) {
  //TODO move list of posts to server to stop race condition
  for (i = 0; i < reqs; i++) {
    $.ajax({
      url: "./explore",
      type: "GET",
      data: i.toString(),
      dataType: "html",
      error: function (err) {
        console.log("Error:" + err);
      },
      success: function (msg) {
        console.log(msg);
      },
    });
  }
}
