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
		      <li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
		    </ul>
		</div>
	</div>
</nav>
<div id="body">

<form style="border:1px solid #ccc">
  <div class="container">
	<label><b>Username</b></label>
	<input type="text" placeholder="Username" id="username" required>

    <label><b>Email</b></label>
	<input type="text" placeholder="Email" id="email" required>
	
	<label><b>Repeat Email</b></label>
    <input type="text" placeholder="Repeat Email" id="rep-email" required>

    <label><b>Password</b></label>
    <input type="password" placeholder="Enter Password" id="psw" required>

    <label><b>Repeat Password</b></label>
    <input type="password" placeholder="Repeat Password" id="rep-psw" required>
    <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>

    <div>
      <button type="button" class="signupbtn">Sign Up</button>
    </div>
  </div>
</form>

</div>
<div class='error' style='display:none'></div>

`;


// Hidden error message



//populating the navigation bar
let navArr=["Teams", "Players", "Tables and Fixtures"];
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

function checkForm(usr, email1, email2, psw1, psw2) {
	let message = '';
	if (usr.length < 4) {
		message += "Enter a username that is at least 4 characters long. \n";
	} else if (usr.length> 29) {
		message += "Unfortunately your username is too long. \n";
	} else if (!(validateEmail(email1))) {
		message += "Enter a valid email. \n";
	} else if (email1 !== email2) {
		message += "Emails don't match. \n";
	}
	if (psw1.length< 8) {
		message += "Enter a password that is at least 8 characters long. \n";
	} else if (psw1.length > 29) {
		message += "Unfortunately your password is too long. \n";
	} else if (psw1 !== psw2) {
		message += "Passwords don't match. \n";
	}
	if (message === '') {
		return [true, message];
	} else {
		return [false, message]
	}
}


function sendForm(eml, usr, psw1) {
	$.get("../android_connect/check_username&email.php", {username: "\"" + usr + "\"", email: "\"" + eml + "\""}, function(data) {
		if (data === 'success') {
			$.get("../android_connect/add_user.php", {username: "\"" + usr + "\"", email: "\"" + eml + "\"", password: "\"" + psw1 + "\""}, function(data2) {
				if (data2 === 'success') {
					let body = $('.container');
					body.empty();
					body.append($('<p>Please check your email for a link you will need to visit in order to confirm your registration.</p>'));

				} else {
					$('.error').prop('innerHTML', 'Something went wrong.');
					$('.error').fadeIn(400).delay(3000).fadeOut(400);
				}
			});
		} else {
			$('.error').prop('innerHTML', data);
			$('.error').fadeIn(400).delay(3000).fadeOut(400);
		}
	});
}

let subBtn = $('.signupbtn');
subBtn.click(function() {
	let psw1 = $("#psw").prop("value");
	let usr = $("#username").prop("value");
	let email1 = $("#email").prop("value");
	let email2 = $("#rep-email").prop("value");
	let psw2 = $("#rep-psw").prop("value");
	let check = checkForm(usr, email1, email2, psw1, psw2);
	
	if (!(check[0])) {
		$('.error').prop('innerHTML', check[1]);
		$('.error').fadeIn(400).delay(3000).fadeOut(400);
	} else {
		sendForm(email1, usr, psw1);
	}
})
