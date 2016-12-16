var player
var line_space = 40
var field_min_radius = 200
var field_radius_limit = 1000
var field_shrink_rate = 0.2
var x_min = -1000, x_max = 1000
var y_min = -1000, y_max = 1000
var projectiles = []

function setup() {
	createCanvas(windowWidth, windowHeight)
	player = new Player()
}

function draw() {
	if (mouseIsPressed) player.shoot();
	field_radius_limit = max(field_min_radius, field_radius_limit-field_shrink_rate)
	background(0, 0, 0)
	translate(width/2-player.pos.x, height/2-player.pos.y)
	draw_field_borders()
	draw_background_lines()
	draw_projectiles(projectiles)
	player.update_going_direction(keyIsDown(87), keyIsDown(83), keyIsDown(65), keyIsDown(68))
	player.update()
	player.show()
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
	ellipse(0, 0, 2*field_radius_limit, 2*field_radius_limit)
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
	for (var i = x_min; i <= x_max; i+=line_space) line(i, y_min, i, y_max);
	for (var i = y_min; i <= y_max; i+=line_space) line(x_min, i, x_max, i);
	pop()
}