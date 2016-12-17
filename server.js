var express = require('express')

var app = express()
var server = app.listen(3000)

app.use(express.static('public'))

var socket = require('socket.io')
var io = socket(server)

//================================================================================================

var field_min_radius = 200
var field_radius_limit = 1000
var field_shrink_rate = 0.2
var connected_players = {}
var projectiles = []

setInterval(heartbeat, 10)
function heartbeat() {
	io.sockets.emit('heartbeat', connected_players)
}

io.sockets.on('connection', new_connection)
function new_connection(socket) {
	console.log('new connection: ' + socket.id)

	socket.emit('start', {f_radius:field_radius_limit, p_radius:25})

	socket.on('start', function(player_start_data) {
		var player = new Player(socket.id, player_start_data.x, player_start_data.y)
		connected_players[socket.id] = player
	})

	socket.on('update', function(player_coordinates) {
		var p = connected_players[socket.id]
		if (p) {
			p.x = player_coordinates.x
			p.y = player_coordinates.y
			p.aim_x = player_coordinates.aim_x
			p.aim_y = player_coordinates.aim_y
		}
	})

	socket.on('new_projectile', function() {

	})

	socket.on('disconnect', function() {
		console.log(socket.id + ' disconnected')
		delete connected_players[socket.id]
	})
}

//================================================================================================

function Player(_id, x, y) {
	this._id = _id

	this.attr = {
		cooldown:15,
		current_cooldown:0,
		radius:25,
		gun_width:20,
		gun_length:45,
		max_speed:4,
		projectile_speed:6
	}

	this.x = x 
	this.y = y
	this.aim_x = 0.01
	this.aim_y = 0.01
}