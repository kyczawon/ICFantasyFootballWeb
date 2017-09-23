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
    row.on('click', (event) => {});
		tbody.append(row);
	}
  parentTable.append(tbody)
}

//Creates an empty team
function createteam(id) {
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
});


// Resizing left-teams and rows dynamically with margin
function resizeRows() {
	let rows = $('.display-row');
	let bench  = $('#row-4');
	rows.css('margin-top', 0);
	bench.css('margin-top', 0);
	$("#left-teams").height($("#left-teams").width()*1.347);
	rows.height($("#left-teams").width()*1.031/4*1/1.2);
	bench.height($("#left-teams").width()*0.316*1/1.2);
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
