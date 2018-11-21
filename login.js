const main=document.getElementById('main');
main.innerHTML=`
<nav class="navbar navbar-inverse navbar-static-top">
  <div class="container-fluid">
		<div class="navbar-header">
					<img id="logo" src="https://union.ic.ac.uk/acc/football/fantasy/images/logo.png"></img>
		    </div>
		    <ul id="nav-bar" class="nav navbar-nav">
		    </ul>
		    <ul class="nav navbar-nav navbar-right">
		      <li><a href="register.html"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
		      <li><a href="login.html"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
		    </ul>
		</div>
	</div>
</nav>
<div id="body">

<form style="border:1px solid #ccc">
  <div class="container">
	<label><b>Username</b></label>
	<input type="text" placeholder="Username" id="username" required>

    <label><b>Password</b></label>
	<input type="password" placeholder="Password" id="password" required>
    <div>
      <button type="button" class="loginbtn">Login</button>
    </div>
  </div>
</form>

</div>
<div class='error' style='display:none'></div>

`;


// Hidden error message



//populating the navigation bar
let navArr=["Main Page"];
for (let i=0; i < navArr.length; i++) {
	let id = navArr[i].toLowerCase().split(' ').join('-');
	let rightTable=$(`<table id="right-${id}"/>`);
	let leftDiv=$(`<div id="left-${id}"/>`);
	let li=$(`<li id="nav-${id}"/>`);
	leftDiv.addClass("left");
	$("#left-body").append(leftDiv);
	rightTable.addClass("right");
	$("#right-body").append(rightTable);
	let a=$("<a/>").text(navArr[i]);
	li.append(a);
	$("#nav-bar").append(li);
	if (i === 0) {
		leftDiv.addClass("leftactive");
		rightTable.addClass("rightactive");
		li.addClass("active");
		a.prop("href", "index.html")
	}
}

//set logo to nav-bar size
$("#logo").height($("#nav-bar").height());

//add onClick listener to submit button

function validateEmail(mail) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
		return true;
	}
	return false;
}


function checkUser(usr, psw) {
	$.get("../android_connect/check_user.php", {username: usr, password: psw}, function(data) {
    console.log(data);
		if (data === 'Invalid username or password') {
			$('.error').prop('innerHTML', data);
			$('.error').fadeIn(400).delay(3000).fadeOut(400);
		} else {
      let user = data[0];
      document.cookie = `user_id=${user.user_id}; path=../index.html`;
      document.cookie = `team_id=${user.team_id}; path=../index.html`;
      document.cookie = `admined_team=${user.admined_team}; path=../index.html`;
      document.cookie = `is_super_admin=${user.is_super_admin}; path=../index.html`;
      document.cookie = `username=${usr}; path=../index.html`;
      window.location.href = "index.html";
    }
	});
}

let subBtn = $('.loginbtn');
subBtn.click(function() {
	let psw = $("#password").prop("value");
	let usr = $("#username").prop("value");
  if (psw === "" || usr === "") {
    $('.error').prop('innerHTML', "Enter your username and password");
    $('.error').fadeIn(400).delay(3000).fadeOut(400);
 } else {
   checkUser(usr, psw);
 }
})
