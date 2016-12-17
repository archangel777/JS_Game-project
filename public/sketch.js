var socket;

var player
var line_space = 60
var field_radius
var other_players = {}
var projectiles = []

function setup() {
	createCanvas(windowWidth, windowHeight)

	socket = io.connect('localhost:3000')

	socket.on('start', start)
	socket.on('heartbeat', update_other_players)
}

function start(data) {
	var f_radius = data.f_radius
	random_starting_pos = createVector(random(-f_radius, f_radius), random(-f_radius, f_radius))
	random_starting_pos.limit(f_radius-50)

	socket.emit('start', {x:random_starting_pos.x, y:random_starting_pos.y})

	player = new Player(random_starting_pos.x, random_starting_pos.y)
	field_radius = f_radius
}

function draw() {
	if (player) {
		if (mouseIsPressed) player.shoot();
		background(0, 0, 0)
		translate(width/2-player.pos.x, height/2-player.pos.y)
		draw_field_borders()
		draw_background_lines()
		draw_projectiles(projectiles)

		draw_other_players()

		player.update_going_direction(keyIsDown(87), keyIsDown(83), keyIsDown(65), keyIsDown(68))
		player.update()
		player.show()

		socket.emit('update', {x:player.pos.x, y:player.pos.y, aim_x:player.aim_direction.x,aim_y:player.aim_direction.y})
	}
}

function update_other_players(other) {
	other_players = other
}

function draw_other_players() {
	for (var key in other_players) {
		var p = other_players[key]
		if (socket.id !== p._id) {
			new Player(p.x, p.y, p.aim_x, p.aim_y).show()
		}
	}
}

function draw_projectiles(projectiles) {
	for (var i = projectiles.length-1; i >= 0; i--) {
		var projectile = projectiles[i]
		if (projectile.alive === 0) {
			projectiles.splice(i, 1)
		}
		else {
			projectile.update()
			projectile.show()
		}
	}
}

function add_projectile(projectile) {
	projectiles.push(projectile)
}

function draw_field_borders() {
	push()
	translate(0,0)
	stroke(255,0,0)
	strokeWeight(10)
	fill(230, 255, 255)
	ellipse(0, 0, 2*field_radius, 2*field_radius)
	pop()
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw_background_lines() {
	stroke(0, 100)
	strokeWeight(2)
	push()
	translate(0,0)
	for (var i = -field_radius; i <= field_radius; i+=line_space) line(i, -field_radius, i, field_radius);
	for (var i = -field_radius; i <= field_radius; i+=line_space) line(-field_radius, i, field_radius, i);
	pop()
}