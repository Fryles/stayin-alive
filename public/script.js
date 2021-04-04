import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
$(window).on('hashchange',function(){ 
  window.location.reload(); 
});
document.addEventListener("DOMContentLoaded", function () {
  var initialLoaded = 15;
  var path = window.location.hash.substr(1)
  console.log(path);
  switch (path) {
    case "/":
      loadExplore(initialLoaded);
      break;
    case "explore":
      loadExplore(initialLoaded);
      break;
    case "feed":
      loadFeed(initialLoaded);
      break;
    case "profile":
      loadProfile();
      break;
    case "post":
      postDia();
      break;
  }
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
  toDataURL(img, function (dataUrl) {
    img = dataUrl;
    console.log(img);
    $.ajax({
      url: window.location.origin + "/post",
      type: "POST",
      data: JSON.stringify({
        img: img,
        title: title,
        desc: desc,
      }),
      contentType: "application/json; charset=UTF-8",
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
  });
}
function changeDis(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#photoDis").attr("src", e.target.result).width(200).height(200);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

async function loadProfile() {
  console.log("laoding prof")
  const token = getCookie("token");
  if (token != "" || token == undefined) {
    const octokit = new Octokit({
      auth: token,
    });
    var data = await octokit.request("/user");
    data = data.data
    let usr = data.name;
    let pic = data.avatar_url;
    let bio =data.bio;
    var html = '<div class="prof-box"><div class="prof-header"><img class="prof-pic" src="'+pic+'"><h1>'+usr+'</h1></div><div class="prof-main">'+bio+'</div></div>'
    $(".main").append(html);

  } else {
    signUp();
  }
}
function loadExplore(reqs = 10) {
  clearBody();
  //TODO move list of posts to server to stop race condition and other bad things
  for (let i = 0; i < reqs; i++) {
    $.ajax({
      url: window.location.origin + "/explore",
      type: "GET",
      data: { index: i },
      dataType: "html",
      error: function (err) {
        console.log("Error:" + err);
      },
      success: function (msg) {
        if (msg != "") {
          var json = JSON.parse(msg);
          $(".main").append('<img src="' + json.img + '">');
        }
      },
    });
  }
}

function clearBody() {
  $(".main").empty();
}
function signUp() {
  window.location.href =
    "https://github.com/login/oauth/authorize?client_id=1683b396d56e593c5732";
}

//helper func from https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
//helper func for sending imgs over ajax
//https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}
