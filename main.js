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
<div id="left-body" class="col-sm-4"></div>
<div id="right-body" class="col-sm-8"></div>
`;


//populating the navigation bar
let navArr=["Teams", "Players", "Tables and Fixtures"];
for (let i=0; i < navArr.length; i++) {
	let id = navArr[i].toLowerCase().split(' ').join('-');
	let rightTable=$(`<table id="right-${id}" class = "table table-striped"/>`);
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

for (let i=0; i < 5; i++) {
	$(`<div id="row-${i}" class="display-row"/>`).appendTo($("#left-teams"));
}

//set logo to nav-bar size
$("#logo").height($("#nav-bar").height());

//recieving teams from db and populating teams table
var teamsArr;
$.get("../android_connect/teams.php", (data) => {
  teamsArr = data;
	createTable(data, "#right-teams", (event) => populateTeam(event.currentTarget.id));
  if (playersArr != null) {
    populateTeam(firstTeamId);
  }
});

var firstTeamId;
var firstPlayerId;
function createTable(data, id, callback = {}) {
  parentTable = $(id);
  let index=0;
	let row = $("<tr/>");
  var thead = $("<thead/>");
	for (let key in data[0]) {
		if (index > 0 && (index < 6 || id !== "#right-teams")) { //or required to show only part of teams table
			row.append($(`<th>${key.split('_').join(' ')}</th>`));
			thead.append(row);
		}
		index++;
	}
  parentTable.append(thead);
  var tbody = $("<tbody/>");
	for (let i=0; i < data.length; i++) {
		let obj=data[i];
		row = $("<tr/>");
    if (i === 0 && id === "#right-teams") {//make the first team on the list active
      row.toggleClass("rowactive");
      firstTeamId = obj[Object.keys(obj)[0]];
      selectedRow = "#" + firstTeamId;
    }
    if (i === 0 && id === "#right-players") {//make the first team on the list active
      row.toggleClass("rowactive");
      firstPlayerId = obj[Object.keys(obj)[0]];
      selectedRow = "#" + firstPlayerId;
    }
		index=0;
		for (let key in obj) {
      if (index === 0) {
        row.attr('id', obj[key]);
      }
			if (index > 0 && (index < 6 || id !== "#right-teams")) {//or required to show only part of teams table
				row.append($(`<td>${obj[key]}</td>`));
			}
			index++;
		}
    row.on('click', (event) => callback(event)).on('click', (event) => {
        $(selectedRow).removeClass("rowactive");
        event.currentTarget.className += " rowactive";
        selectedRow = "#" + event.currentTarget.id;
    });
		tbody.append(row);
	}
  parentTable.append(tbody)
}

//populates the team with the selected team
var selectedRow;
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

function populatePlayer(id) {
  let player = playersArr.filter(el => el[Object.keys(el)[0]] === id)[0];
  console.log(player);
  $('#left-players-header').text(player["first_name"] + " " + player["last_name"]);
  $('#left-players-sub-header').text(player["position"] + " in the " + getTeamString(player["team"]) + " team");
  $('#left-players-info').html(`
    Points: ${player["points"]}<br/>
    Points This Week: ${player["points_week"]}<br/>
    Apps: ${player["appearances"]}<br/>
    Subs: ${player["sub_appearances"]}<br/>
    Goals: ${player["goals"]}<br/>
    Assists: ${player["assists"]}<br/>
    MOTMs: ${player["motms"]}<br/>
    Clean Sheets: ${player["clean_sheets"]}<br/>
    Yellows: ${player["yellow_cards"]}<br/>
    Red Cards: ${player["red_cards"]}<br/>
    Own Goals: ${player["own_goals"]}<br/>`
  );
  $('#team-shirt').prop("src", `https://union.ic.ac.uk/acc/football/fantasy/images/shirt${player["team"]}.png`);
}

function getTeamString(num) {
  switch (num) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return num + "th";
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
let playersArr;
let currentTeam;
$.get("../android_connect/players.php", (data) => {
	playersArr = data;
	createTable(data, "#right-players", (event) => populatePlayer(event.currentTarget.id));
	currentTeam = playersArr[0]["team"];
	let url = "https://union.ic.ac.uk/acc/football/fantasy/images/shirt" + currentTeam + ".png";
	console.log(url);
	$('#team-shirt').prop("src", url);
  if (teamsArr != null) {
    populateTeam(firstTeamId);
  }
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

    $(selectedRow).removeClass("rowactive");
    switch (shownRight) {
      case "#right-teams":
        populateTeam(firstTeamId);
        selectedRow = "#" + firstTeamId;
        break;
      case "#right-players":
        populatePlayer(firstPlayerId);
        selectedRow = "#" + firstPlayerId;
        break;
    }
    $(selectedRow).addClass("rowactive");
  });
}

// Resizing left-teams and rows dynamically with margin
function resizeRows() {
	if (shownLeft === "#left-teams") {
		let rows = $('.display-row');
		let bench  = $('#row-4');
		rows.css('margin-top', 0);
		bench.css('margin-top', 0);
		$(shownLeft).height($(shownLeft).width()*1.347);
		rows.height($(shownLeft).width()*1.031/4*1/1.2);
		bench.height($(shownLeft).width()*0.316*1/1.2);
	}

}

function addmarginRows() {
	let rows = $('.display-row');
	let bench  = $('#row-4');
	rows.css('margin-top', 0);
	bench.css('margin-top', 0);
	bench.css('margin-bottom', 0);
	let margFrac = 0.2;
	let playerRowHeight = rows.height();
	let benchHeight = bench.height();
	rows.css('margin-top', playerRowHeight*margFrac);
	bench.css('margin-top', (benchHeight - (playerRowHeight - playerRowHeight*margFrac))/4 );
	bench.css('margin-bottom', (benchHeight - (playerRowHeight - playerRowHeight*margFrac))/4 );

}

resizeRows();
addmarginRows();
$(window).resize( function(){
	resizeRows();
	addmarginRows();
});

// splitting left-players into two colums
$('#left-players').append($('<h3 id="left-players-header">Player Name</h3>'));
$('#left-players').append($('<h4 id="left-players-sub-header">Player position</h4>'));
$('#left-players').append($('<div id="left-players-image" class="col-xs-2"></div>').css('width', '50%'));
$('#left-players-image').append($('<img id = "team-shirt">'));
$('#left-players').append($('<div id="left-players-info" class="col-xs-2">Placeholder Info</div>').css('width', '50%'));

// fill left-players-image with currently active player
function changePlayerImage(currentTeam) {
	let url = "https://union.ic.ac.uk/acc/football/fantasy/images/shirt" + currentTeam + ".png";
	$('#team-shirt').prop("src", url).prop('width', '100%');
}
