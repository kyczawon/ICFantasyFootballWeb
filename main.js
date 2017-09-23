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
<div id="left-body" class="col-sm-4"></div>
<div id="right-body" class="col-sm-8"></div>
`;


//populating the navigation bar
let navArr=["Teams", "Players", "Tables and Fixtures"];
for (let i=0; i < navArr.length; i++) {
	let id = navArr[i].toLowerCase().split(' ').join('-');
	let rightTable=$(`<table id="right-${id}"/>`);
	let leftDiv=$(`<div id="left-${id}"/>`);
	let li=$(`<li id="nav-${id}"/>`);
	if (i === 0) {
		leftDiv.addClass("leftactive");
		rightTable.addClass("rightactive");
		li.addClass("active");
	}
	leftDiv.addClass("left");
	$("#left-body").append(leftDiv);
	rightTable.addClass("right");
	$("#right-body").append(rightTable);
	let a=$("<a/>").text(navArr[i]);
	li.append(a);
	$("#nav-bar").append(li);
}

for (let i=0; i < 4; i++) {
	$(`<div id="row-${i}" class="display-row"/>`).appendTo($("#left-teams"));
}
$(`<div id="row-4"/>`).appendTo($("#left-teams"));

//set logo to nav-bar size
$("#logo").height($("#nav-bar").height());

//recieving teams from db and populating teams table
let tableTeams=$("#right-teams");
let teamArr;
$.get("https://union.ic.ac.uk/acc/football/android_connect/teams.php", (data) => {
  teamsArr = data;
	let index=0;
	let row = $("<tr/>")
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
      if (index === 0) {
        row.attr('id', obj[key]);
      }
			if (index > 0 && index < 6) {
				row.append($(`<td>${obj[key]}</td>`));
			}
      row.on('click', () => {
          console.log(row.attr('id'));
      });
			index++;
		}
		tableTeams.append(row);
	}

});

//recieving players from db and populating players table
let tablePlayers=$("#right-players");
let playersArr;
let currentTeam;
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
	currentTeam = playersArr[0]["team"];
	let url = "https://union.ic.ac.uk/acc/football/fantasy/images/shirt" + currentTeam + ".png";
	console.log(url);
	$('#team-shirt').prop("src", url);

});

//making tabs selected and appropriate content shown and hidden
var selectedNav = "#nav-teams";
var shownRight = "#right-teams";
var shownLeft = "#left-teams";
var array = Array.from($('#nav-bar').children());
var arrayTables = Array.from($('.right'));
var arrayDivsLeft = Array.from($('.left'));
for (let i = 0; i < array.length; i++) {
  array[i].addEventListener('click', () => {
		var mTable = arrayTables[i];
		var mDiv = $('.left').eq(i);
		// console.log(mDiv);
		$(shownLeft).hide();
		$(shownRight).removeClass("rightactive");
    $(selectedNav).removeClass("active");
    mTable.className += " rightactive";
    array[i].className += " active";
		mDiv.show();
    shownLeft = "#" + mDiv.attr("id");
    shownRight = "#" + mTable.id;
    selectedNav = "#" + array[i].id;
    resizeRows();
    addPaddingRows();
  });
}

// Resizing left-teams and rows dynamically with padding

function resizeRows() {
	if (shownLeft === "#left-teams") {
		let rows = $('.display-row');
		let bench  = $('#row-4');
		rows.css('padding-bottom', 0);
		rows.css('padding-top', 0);
		bench.css('padding-bottom', 0);
		bench.css('padding-top', 0);
		$(shownLeft).height($(shownLeft).width()*1.347);
		rows.height($(shownLeft).width()*1.031/4);
		bench.height($(shownLeft).width()*0.316);
	}
	
}
function addPaddingRows() {
	let rows = $('.display-row');
	let bench  = $('#row-4');
	rows.css('padding-bottom', 0);
	rows.css('padding-top', 0);
	bench.css('padding-bottom', 0);
	bench.css('padding-top', 0);
	let padFrac = 0.1;
	let playerRowHeight = rows.height()
	// console.log(playerRowHeight);
	let benchHeight = bench.height();
	rows.css('padding-bottom', playerRowHeight*padFrac);
	rows.css('padding-top', playerRowHeight*padFrac);
	bench.css('padding-top', (benchHeight - (playerRowHeight - 2*playerRowHeight*padFrac))/2 );
	bench.css('padding-bottom', (benchHeight - (playerRowHeight - 2*playerRowHeight*padFrac))/2);
	// console.log(rows.height());
}

resizeRows();
addPaddingRows();
$(window).resize( function(){
	resizeRows();
	addPaddingRows();
});

// splitting left-players into two colums
$('#left-players').append($('<h3 id="left-players-header">Player Name</h3>'));
$('#left-players').append($('<div id="left-players-image" class="col-xs-2"></div>').css('width', '50%'));
$('#left-players-image').append($('<img id = "team-shirt">'));
$('#left-players').append($('<div id="left-players-info" class="col-xs-2">Placeholder Info</div>').css('width', '50%'));

// fill left-players-image with currently active player

function changePlayerImage(currentTeam) {
	let url = "https://union.ic.ac.uk/acc/football/fantasy/images/shirt" + currentTeam + ".png";
	$('#team-shirt').prop("src", url).prop('width', '100%');
}
// changePlayerImage(currentTeam);