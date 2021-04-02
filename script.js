document.addEventListener("DOMContentLoaded", function () {
  loadExplore(15);
});

function postDia() {
  //shennanigans to give input an onchnage
  var wrapper = document.createElement("div");
  wrapper.innerHTML =
    '<input type="text" id="Title" placeholder="Title"><input type="text" id="Desc" placeholder="Description"><input type="file" onchange="changeDis(this)">';
  swal({
    title: "Upload your photo",
    icon: "placeholder.png",
    content: wrapper,
    buttons: ["Cancel", "Do it!"],
  }).then((result) => {
    if (result) {
      post();
    }
  });
  //make custom img easier to find and change as user uploads img
  $(".swal-icon--custom").children()[0].id = "photoDis";
}
function post() {
  var img = $("#photoDis").attr("src");
  var title = $("#Title").val();
  var desc = $("#Desc").val();
  toDataURL(img, function(dataUrl) {
    img = dataUrl;
    $.ajax({
      url: "./post",
      type: "POST",
      data: {
        'img':img,
        'title':title,
        'desc':desc,
    },
      dataType: "json",
      error: function (err) {
        //swal
        console.log("Error:" + err);
      },
      success: function (msg) {
        //swal
        console.log(msg);
      },
    });
  })
  
}
function changeDis(input) {
  console.log(input);
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#photoDis").attr("src", e.target.result).width(200).height(200);
    };

    reader.readAsDataURL(input.files[0]);
  }
}
function loadExplore(reqs = 10) {
  //CLEAR items
  //TODO move list of posts to server to stop race condition
  for (i = 0; i < reqs; i++) {
    $.ajax({
      url: "./explore",
      type: "GET",
      data: { index: i },
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

//helper func for sending imgs over ajax
//https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}
