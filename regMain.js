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

<form action="/action_page.php" style="border:1px solid #ccc">
  <div class="container">
    <label><b>Email</b></label>
    <input type="text" placeholder="Enter Email" name="email" required>

    <label><b>Password</b></label>
    <input type="password" placeholder="Enter Password" name="psw" required>

    <label><b>Repeat Password</b></label>
    <input type="password" placeholder="Repeat Password" name="psw-repeat" required>
    <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>

    <div class="clearfix">
      <button type="submit" class="signupbtn">Sign Up</button>
    </div>
  </div>
</form>

</div>

`;


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
let subBtn = $('.signupbtn');
subBtn.click(function() {
	let password = $("[name = 'psw']").value();
	console.log('Your password is' + password);
})
