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
var teamsArr;
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
		row = $("<tr/>");
		index=0;
		for (let key in obj) {
      if (index === 0) {
        row.attr('id', obj[key]);
      }
			if (index > 0 && index < 6) {
				row.append($(`<td>${obj[key]}</td>`));
			}
			index++;
		}
    row.on('click', (event) => {
      populateTeam(event.currentTarget.id);
    });
		tableTeams.append(row);
	}

});

//populates the team with the selected team
function populateTeam(id) {
  let team = teamsArr.filter(el => el[Object.keys(el)[0]] === id)[0];
  console.log(team);
  let def_num = parseInt(team["def_num"]);
  let mid_num = parseInt(team["mid_num"]);
  let row0 = $("#row-0").html("");
  let row1 = $("#row-1").html("");
  let row2 = $("#row-2").html("");
  let row3 = $("#row-3").html("");
  let row4 = $("#row-4").html("");
  row0.append(createPlayerDiv(team["goal"]));
  for (let i = 0; i < 10; i++) {
    let playerId = team[`player${i+1}`];
    if (i < def_num) {
      row1.append(createPlayerDiv(playerId));
    } else if (i < def_num + mid_num) {
      row2.append(createPlayerDiv(playerId));
    } else {
      row3.append(createPlayerDiv(playerId));
    }
  }
  row4.append(createPlayerDiv(team["sub_goal"]));
  for (let i = 0; i < 4; i++) {
    let playerId = team[`sub${i+1}`];
    row4.append(createPlayerDiv(playerId));
  }
}

function createPlayerDiv(playerId) {
  let player = playersArr.filter(el => el[Object.keys(el)[0]] === playerId)[0];
  let mdiv = $("<div/>").css("display", "inline-block").css("height", "inherit");
  mdiv.append($(`<img src ="https://union.ic.ac.uk/acc/football/fantasy/images/shirt${player["team"]}.png"/>`).toggleClass("player-image"))
  .append($(`<div>${player["last_name"]}</div>`).toggleClass("player-text")).append($(`<div>${player["points_week"]}</div>`).toggleClass("player-text"));
  mdiv.toggleClass("space-evenly");
  return mdiv;
}


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
    addmarginRows();
  });
}

// Resizing left-teams and rows dynamically with margin
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

function addmarginRows() {
	let rows = $('.display-row');
	let bench  = $('#row-4');
	rows.css('margin-bottom', 0);
	rows.css('margin-top', 0);
	bench.css('margin-bottom', 0);
	bench.css('margin-top', 0);
	let padFrac = 0.1;
	let playerRowHeight = rows.height()
	let benchHeight = bench.height();
	rows.css('margin-bottom', playerRowHeight*padFrac);
	rows.css('margin-top', playerRowHeight*padFrac);
	bench.css('margin-top', (benchHeight - (playerRowHeight - 2*playerRowHeight*padFrac))/2 );
	bench.css('margin-bottom', (benchHeight - (playerRowHeight - 2*playerRowHeight*padFrac))/2);
}

resizeRows();
addmarginRows();
$(window).resize( function(){
	resizeRows();
	addmarginRows();
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
