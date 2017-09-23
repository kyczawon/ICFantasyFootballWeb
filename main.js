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
		      <li><a href="#"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
		      <li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
		    </ul>
		</div>
	</div>
</nav>
<div id="body">
<div id="left-body" class="col-sm-6"><div id="pitch" class = "leftactive"></div></div>
<div id="right-body" class="col-sm-6"><table id="teams" class="table rightactive"/><table id="players" class="table"/></div>
`;


//populating  the navigation bar
let navArr=["Teams", "Players", "Tables and Fixtures"];
for (let i=0; i < navArr.length; i++) {
	let li=$(`<li id="nav-${navArr[i].toLowerCase().split(' ').join('-')}"/>`);
	if (i === 0) {
		li.addClass("active");
	}
	let a=$("<a/>").text(navArr[i]);
	li.append(a);
	$("#nav-bar").append(li);
}

for (let i=0; i < 5; i++) {
	$(`<div id="row-${i}" class="display-row"/>`).appendTo($("#pitch"));
}

//set logo to nav-bar size
$("#logo").height($("#nav-bar").height());

//recieving teams from db and populating teams table
let tableTeams=$("#teams");
$.get("https://union.ic.ac.uk/acc/football/android_connect/teams.php", (data) => {
	let index=0;
	let row=$("<tr/>")
	for (let key in data[0]) {
		if (index > 0 && index < 6) {;
			row.append($(`<th>${key}</th>`));
			tableTeams.append(row);
		}
		index++;
	}
	for (let i=0; i < data.length; i++) {
		let obj=data[i];
		row=$("<tr/>");
		index=0;
		for (let key in obj) {
			if (index > 0 && index < 6) {
				row.append($(`<td>${obj[key]}</td>`));
			}
			index++;
		}
		tableTeams.append(row);
	}

});

//recieving players from db and populating players table
let tablePlayers=$("#players");
let playersArr;
$.get("https://union.ic.ac.uk/acc/football/android_connect/players.php", (data) => {
	playersArr = data;
	let row=$("<tr/>")
	let index=0;
	for (let key in data[0]) {
		if (index > 0) {
			row.append($(`<th>${key.split('_').join(' ')}</th>`));
			tablePlayers.append(row);
		}
		index++;
	}
	for (let i=0; i < data.length; i++) {
		let obj=data[i];
		row=$("<tr/>");
		index=0;
		for (let key in obj) {
			if (index > 0) {
				row.append($(`<td>${obj[key]}</td>`));
			}
			index++;
		}
		tablePlayers.append(row);
	}

});

//making tabs selected and appropriate content shown and hidden
var selectedNav = "nav-teams";
var shownTable = "teams";
var array = Array.from($('#nav-bar').children());
var arrayTables = Array.from($('.table'));
for (let i = 0; i < array.length; i++) {
  array[i].addEventListener('click', () => {
		var mTable = arrayTables[i];
		$("#" + shownTable).removeClass("rightactive");
    $("#" + selectedNav).removeClass("active");
    array[i].className += " active";
    mTable.className += " rightactive";
    selectedNav = array[i].id;
    shownTable = mTable.id;
  });
}

// Resizing pitch and rows dynamically
$('#pitch').height($('#pitch').width()*1.347);
$('.display-row').height($('#pitch').height()/5);



$(window).resize( function(){
	// console.log('resize')
	$('#pitch').height($('#pitch').width()*1.347);
	$('.display-row').height($('#pitch').height()/5);
	
})