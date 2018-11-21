$('#main').html(`
<nav class="navbar navbar-inverse navbar-static-top">
  <div class="container-fluid">
		<div class="navbar-header">
					<img id="logo" src="https://union.ic.ac.uk/acc/football/fantasy/images/logo.png"></img>
		    </div>
		    <ul id="nav-bar" class="nav navbar-nav">
		    </ul>
		    <ul id="right-header" class="nav navbar-nav navbar-right">
		    </ul>
		</div>
	</div>
</nav>
<div id="body">
<div id="left-body" class="col-sm-4"></div>
<div id="right-body" class="col-sm-8"></div>
<div class='error' style='display:none'></div>
`);

var navArr=["Teams", "Players", "Rules", "Download Android App"];
var loggedin = Cookies.get('user_id') != undefined;
var teamCreated = (Cookies.get('team_id') != 0) || (!loggedin);
if (loggedin) {
  navArr.unshift("MyTeam");
  $("#right-header").append(`<li><a href="#"><span class="glyphicon glyphicon-user"></span> ${Cookies.get('username')}</a></li>
  <li><a href="#" onclick="logout();return false;"><span class="glyphicon glyphicon-log-out"></span> Log Out</a></li>`);
  var selectedNav = "#nav-myteam";
  var shownRight = "#right-myteam";
  var shownLeft = "#left-myteam";
} else {
  $("#right-header").append(`<li><a href="register.html"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
  <li><a href="login.html"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>`);
  var selectedNav = "#nav-teams";
  var shownRight = "#right-teams";
  var shownLeft = "#left-teams";
}

function logout() {
  Cookies.remove('user_id', { path: '/acc/football/fantasy' });
  Cookies.remove('team_id', { path: '/acc/football/fantasy' });
  Cookies.remove('admined_team', { path: '/acc/football/fantasy' });
  Cookies.remove('is_super_admin', { path: '/acc/football/fantasy' });
  Cookies.remove('username', { path: '/acc/football/fantasy' });
  window.location.href = "index.html";
}

//populating the navigation bar
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

$("#nav-download-android-app").children().eq(0).attr("href", "ICfantasy.apk");

for (let i=0; i < 5; i++) {
  $(`<div id="row-${i}" class="display-row"/>`).appendTo($(shownLeft));
}

//set logo to nav-bar size
$("#logo").height($("#nav-bar").height());

$("#left-rules").html(`<h2>Rules</h2><ul style="list-style-type:disc">
  <li>Squad consists of 16 players - 2 goalkeepers, 5 defenders, 5 midfielders and 4 forwards</li>
  <li>Budget is &pound;107m</li>
  <li>Points are awarded only for the starting XI and will be updated weekly</li>
  <li>Starting XI can only be swapped after points have been awarded for previous week and before first games on Wednesday (for now only from within the android app)</li>
  <li>You have to choose yourself (unless you're not part of ICUAFC)</li>
  <li>The scoring system is as follows:<br>
  appearance: 2pts<br>sub appearance: 1pt<br>goal: 4pts<br>assist: 3pts<br>motm: 5pts<br>own goal: -3pts<br>red card: -5pts<br>yellow card: -3pts<br>if you're a keeper or defender, goal: 5pts clean sheet: 3pts</li>
`);

if (!teamCreated) {
  var budget = 107;
  populateEmptyTeam();
  $("#left-body").append(`<input id="every-team-checkbox" type="checkbox" disabled> At least one player from every team<br>
  <input id="freshers-checkbox"type="checkbox" disabled> At least two freshers<br>
  <input id="max-3-checkbox" type="checkbox" checked disabled> Max three players from same team<br>
  Team name: <input id="team-name" type="text"><br>
  Remaining budget: &pound;<span id="budget">110</span>m<br>
  <div><button type="button" id="submitbtn">Submit Team</button></div>`);
  var max3Checkbox = $("#max-3-checkbox");
  var everyTeamCheckbox = $("#every-team-checkbox");
  var minFreshersCheckbox = $("#freshers-checkbox");
  $("#submitbtn").click(() => {
    let newTeam = $(".new-team-players");
    if (newTeam.length < 16) {
      $('.error').prop('innerHTML', "You need to complete your team first!");
      $('.error').fadeIn(400).delay(3000).fadeOut(400);
    } else {
      let message = "";
      if (everyTeamCheckbox.prop("checked") == false) {
          message += "You need at least one player from every team<br>";
      }
      if (minFreshersCheckbox.prop("checked") == false) {
          message += "You need at least 3 freshers in your team<br>";
      }
      if (max3Checkbox.prop("checked") == false) {
          message += "You can have at most 3 players from the same team<br>";
      }
      if ($("#team-name").val().length < 4) {
          message += "Your team name must be at least 4 characters long<br>";
      }
      if ($("#team-name").val().length > 50) {
          message += "Your team name must be at most 50 characters long<br>";
      }
      if (budget < 0) {
          message += "You can't exceed the budget<br>";
      }
      if (message === "") {
        addTeamToDB();
      } else {
          $('.error').prop('innerHTML', message);
          $('.error').fadeIn(400).delay(3000).fadeOut(400);
      }
    }
  });
}

//recieving teams from db and populating teams table
var teamsArr;
$.get("../android_connect/teams.php", (data) => {
  teamsArr = data;
	createTable(data, "#right-teams", (event) => populateTeam(event.currentTarget.id.match(/\d+$/)[0]));
  if (playersArr != null && teamCreated) {
      if (loggedin) {
        populateTeam(Cookies.get('team_id'));
      } else {
        populateTeam(firstTeamId);
      }
  }
});

var firstTeamId;
var firstPlayerId;
function createTable(data, id, callback = {}, filter = "none") {
  parentTable = $(id);
  let index=0;
	let row = $("<tr/>");
  var thead = $("<thead/>");
	for (let key in data[0]) {
		if (index > 0 && (index < 5 || id !== "#right-teams")) { //or required to show only part of teams table
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
    if (i === 0 && id === "#right-players") {//make the first player on the list active
      row.toggleClass("rowactive");
      firstPlayerId = obj[Object.keys(obj)[0]];
      selectedRow = "#" + firstPlayerId;
    }
		index=0;
    if (obj["position"] === filter || filter === "none") {
  		for (let key in obj) {
        if (index === 0) {
          row.attr('id', `table-row-${obj[key]}`);
        }
  			if (index > 0 && (index < 5 || id !== "#right-teams")) {//or required to show only part of teams table
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
	}
  parentTable.append(tbody);
  if (!teamCreated) {
    updateCheckboxes();
  }
}

function updateCheckboxes() {
  let newTeam = $(".new-team-players");
  var fresherNum = 0;
  var team1Num = 0;
  var team2Num = 0;
  var team3Num = 0;
  var team4Num = 0;
  var team5Num = 0;
  var team6Num = 0;
  var team7Num = 0;
  for (let j = 0; j < newTeam.length; j++) {
    let id = newTeam[j].id.match(/\d+$/)[0];
    let player = playersArr.filter(el => el[Object.keys(el)[0]] === id)[0];
    $(`#table-row-${id}`).remove();
    if (player["is_fresher"] == 1) {
      fresherNum++;
    }
    switch (player["team"]) {
      case '1': team1Num++;
          break;
      case '2': team2Num++;
          break;
      case '3': team3Num++;
          break;
      case '4': team4Num++;
          break;
      case '5': team5Num++;
          break;
      case '6': team6Num++;
          break;
      case '7': team7Num++;
          break;
    }
  }
  if (team1Num > 3 || team2Num > 3 || team3Num > 3 || team4Num > 3 || team5Num > 3 || team6Num > 3 || team7Num > 3) {
      max3Checkbox.prop('checked', false);
  } else {
      max3Checkbox.prop('checked', true);
  }
  if (team1Num > 0 && team2Num > 0 && team3Num > 0 && team4Num > 0 && team5Num > 0 && team6Num > 0 && team7Num > 0) {
      everyTeamCheckbox.prop('checked', true);
  } else {
      everyTeamCheckbox.prop('checked', false);
  }
  if (fresherNum >= 2) {
      minFreshersCheckbox.prop('checked', true);
  } else {
      minFreshersCheckbox.prop('checked', false);
  }
}

//populates the team with the selected team
var selectedRow;
function populateTeam(id) {
  let team = teamsArr.filter(el => el[Object.keys(el)[0]] === id)[0];
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
  spaceRowsEvenly();
}

function populateEmptyTeam() {
  let row0 = $("#row-0").html("");
  let row1 = $("#row-1").html("");
  let row2 = $("#row-2").html("");
  let row3 = $("#row-3").html("");
  let row4 = $("#row-4").html("");
  for (let i = 0; i < 16; i++) {
    if (i == 0) {
      row0.append(createEmptyPlayerDiv(i, "GK"));
    } else if (i < 4) {
      row1.append(createEmptyPlayerDiv(i, "DEF"));
    } else if (i < 8) {
      row2.append(createEmptyPlayerDiv(i, "MID"));
    } else if (i < 11) {
      row3.append(createEmptyPlayerDiv(i, "FWD"));
    } else if (i == 11){
      row4.append(createEmptyPlayerDiv(i, "GK"));
    } else if (i < 14){
      row4.append(createEmptyPlayerDiv(i, "DEF"));
    } else if (i == 14){
      row4.append(createEmptyPlayerDiv(i, "MID"));
    } else {
      row4.append(createEmptyPlayerDiv(i, "FWD"));
    }
  }
  spaceRowsEvenly();
}

function addTeamToDB(usr, psw) {
  let newTeam = $(".new-team-players");
  let ids = [];
  for (let i = 0; i < newTeam.length; i++) {
    ids.push(newTeam[i].id.match(/\d+$/)[0]);
  }
	$.get("../android_connect/add_team.php", {user_id: Cookies.get('user_id'), name: $("#team-name").val(),
  owner: Cookies.get('username'), price: 107 - budget, goal: ids[0], player1: ids[1], player2: ids[2],
  player3: ids[3], player4: ids[4], player5: ids[5], player6: ids[6], player7: ids[7], player8: ids[8],
  player9: ids[9], player10: ids[10], sub_goal: ids[11], sub1: ids[12], sub2: ids[13], sub3: ids[14],
  sub4: ids[15]}, function(data) {
		if (data === 'failure') {
			$('.error').prop('innerHTML', data);
			$('.error').fadeIn(400).delay(3000).fadeOut(400);
		} else {
      let user = data[0];
      document.cookie = `team_id=${user[Object.keys(user)[0]]}; path=../index.html`;
      window.location.href = "index.html";
    }
	});
}

function spaceRowsEvenly() {
  for (let j = 0; j < 5; j++) {
    let rowDivs = $(`#row-${j}`).children();
    for (let i = 0; i < rowDivs.length; i++) {
      rowDivs[i].style.width = `${100/rowDivs.length}%`;
    }
  }
}

function populatePlayer(id) {
  let player = playersArr.filter(el => el[Object.keys(el)[0]] === id)[0];
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
  let mdiv = $(`<div id="player-${player["player_id"]}"/>`).css("display", "inline-block").css("height", "inherit");
  mdiv.append($(`<div/>`).css("background-image", `url(https://union.ic.ac.uk/acc/football/fantasy/images/shirt${player["team"]}.png)`).toggleClass("player-image"))
  .append($(`<div>${player["last_name"]}</div>`).toggleClass("player-text")).append($(`<div>${player["points_week"]} | ${parseInt(player["points_week"])+parseInt(player["points"])}</div>`).toggleClass("player-text"));
  return mdiv;
}

var selectedPlayer = "#blank-1";
function createEmptyPlayerDiv(posId, pos) {
  let mdiv = $(`<div id="blank-${posId}"/>`).css("display", "inline-block").css("height", "inherit");
  mdiv.append($(`<div/>`).css("background-image", "url(https://union.ic.ac.uk/acc/football/fantasy/images/shirt.png)").toggleClass("player-image"));
  mdiv.on('click', () => {
    mdiv.toggleClass("player-selected");
    $(selectedPlayer).removeClass("player-selected");
    selectedPlayer = "#" + mdiv.attr('id');
    $(".right").html("");
    createTable(playersArr, "#right-myteam", (event) => updatePlayer(posId, event.currentTarget.id.match(/\d+$/)[0], pos), pos)
  });
  return mdiv;
}

function updatePlayer(posId, playerId, pos, first = true) {
  let player = playersArr.filter(el => el[Object.keys(el)[0]] === playerId)[0];
  budget -= player["price"];
  if (first) {
    let mdiv = createPlayerDiv(playerId);
    $(`#blank-${posId}`).replaceWith(mdiv.toggleClass("new-team-players").on('click', () => {
      mdiv.toggleClass("player-selected");
      $(selectedPlayer).removeClass("player-selected");
      selectedPlayer = "#" + mdiv.attr('id');
      $(".right").html("");
      createTable(playersArr, "#right-myteam", (event) => updatePlayer(playerId, event.currentTarget.id.match(/\d+$/)[0], pos, false), pos)
    }));
  } else {
    let mdiv = createPlayerDiv(playerId);
    let player2 = playersArr.filter(el => el[Object.keys(el)[0]] === posId)[0];
    budget += parseInt(player2["price"]);
    $(`#player-${posId}`).replaceWith(mdiv.toggleClass("new-team-players").on('click', () => {
      mdiv.toggleClass("player-selected");
      $(selectedPlayer).removeClass("player-selected");
      selectedPlayer = "#" + mdiv.attr('id');
      $(".right").html("");
      createTable(playersArr, "#right-myteam", (event) => updatePlayer(playerId, event.currentTarget.id.match(/\d+$/)[0], pos, false), pos)
    }));
  }
  $('#budget').text(budget);
  spaceRowsEvenly();
  updateCheckboxes();
}

//recieving players from db and populating players table
let playersArr;
let currentTeam;
$.get("../android_connect/players.php", (data) => {
	playersArr = data;
	createTable(data, "#right-players", (event) => populatePlayer(event.currentTarget.id.match(/\d+$/)[0]));
	currentTeam = playersArr[0]["team"];
	let url = "https://union.ic.ac.uk/acc/football/fantasy/images/shirt" + currentTeam + ".png";
	$('#team-shirt').prop("src", url);
  if (teamsArr != null && teamCreated) {
    if (loggedin) {
      populateTeam(Cookies.get('team_id'));
    } else {
      populateTeam(firstTeamId);
    }
  }
});

//making tabs selected and appropriate content shown and hidden
var array = Array.from($('#nav-bar').children());
var arrayTables = Array.from($('.right'));
var arrayDivsLeft = Array.from($('.left'));
for (let i = 0; i < array.length-1; i++) { //-1 because last tab only downloads apk
  array[i].addEventListener('click', () => {
		var mTable = arrayTables[i];
		var mDiv = $('.left').eq(i);
    if (shownLeft === "#left-teams" || shownLeft === "#left-myteam") {
      $(shownLeft).empty();
    }
		$(shownLeft).hide();
		$(shownRight).removeClass("rightactive");
    $(selectedNav).removeClass("active");
    mTable.className += " rightactive";
    array[i].className += " active";
		mDiv.show();
    shownLeft = "#" + mDiv.attr("id");
    shownRight = "#" + mTable.id;
    selectedNav = "#" + array[i].id;
    for (let i=0; i < 5; i++) {
      $(`<div id="row-${i}" class="display-row"/>`).appendTo($(shownLeft));
    }
    resizeRows();
    addmarginRows();

    $(selectedRow).removeClass("rowactive");
    switch (shownRight) {
      case "#right-myteam":
        if (teamCreated) {
          populateTeam(Cookies.get("team_id"));
        } else {
          populateEmptyTeam();
        }
        //activateDragAndDrop();
        break;
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

// function activateDragAndDrop() {
//   let subs = $('#row-4').children();
//   for (let i = 0; i < subs.length; i++){
//     console.log(subs.eq(i));
//     // subs.eq(i).draggable({
//     //   start: (event) => dragStart(event);
//     // });
//   }
//   let row1 = $('#row-1').children();
//   for (let i = 0; i < row1.length; i++){
//
//   }
// }
//
// function dragStart(event) {
//   console.log('drag started')
//   for (let j = 0; j < 5; j++) {
//     let rowDivs = $(`#row-${j}`).children();
//     for (let i = 0; i < rowDivs.length; i++) {
//       console.log(rowDivs[i].getAttribute('id'));
//     }
//   }
// }

// Resizing left-teams and rows dynamically with margin
function resizeRows() {
	if (shownLeft === "#left-teams" || shownLeft === "#left-myteam") {
		let rows = $('.display-row');
		let bench  = $('#row-4');
		rows.css('margin-top', 0);
		bench.css('margin-top', 0);
		$(shownLeft).height($(shownLeft).width()*1.347);
		rows.height($(shownLeft).width()*1.031/4*1/1.2);
		bench.height($(shownLeft).width()*0.28*1/1.2);
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
	bench.css('margin-top', (benchHeight - (playerRowHeight - playerRowHeight*margFrac))*1 );
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
