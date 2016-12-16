function Player() {

	this.attr = {
		cooldown:15,
		current_cooldown:0,
		radius:25,
		gun_width:20,
		gun_length:45,
		max_speed:4,
		projectile_speed:6
	}

	this.going_direction = {
		u:false,
		d:false,
		l:false,
		r:false
	}

	this.pos = createVector(0,0)
	this.real_speed = createVector(0, 0)
	this.aux_speed = createVector(0, 0)
	this.acceleration = createVector(0, 0)
	this.aim_direction = createVector(0.01, 0.01)

	this.update = function() {
		this.aim_direction = createVector(pmouseX - width/2, pmouseY-height/2)
		this.aux_speed.lerp(this.real_speed, 0.08)
		this.pos.add(this.aux_speed)
		this.pos.limit(field_radius_limit-this.attr.radius)
		if (this.attr.current_cooldown > 0) this.attr.current_cooldown--;
	}

	this.update_going_direction = function(u, d, l, r) {
		if (u !== this.going_direction.u || d !== this.going_direction.d || l !== this.going_direction.l || r !== this.going_direction.r) {
			this.going_direction.u = u
			this.going_direction.d = d
			this.going_direction.l = l
			this.going_direction.r = r
			var new_dir = createVector(0,0)
			if (u === true) {
				new_dir.add(createVector(0,-10))
			}
			if (d === true) {
				new_dir.add(createVector(0, 10))
			}
			if (l === true) {
				new_dir.add(createVector(-10,0))
			}
			if (r === true) {
				new_dir.add(createVector(10, 0))
			}
			new_dir.setMag(this.attr.max_speed)
			this.real_speed = new_dir
		}
	}

	this.show = function() {
		this.show_gun()
		fill(150,0,255)
		noStroke()
		ellipse(this.pos.x, this.pos.y, this.attr.radius*2, this.attr.radius*2)
	}

	this.show_gun = function() {
		fill(100)
		noStroke()
		push()
		translate(this.pos.x, this.pos.y)
		rotate(atan2(this.aim_direction.y, this.aim_direction.x))
		var aux = this.aim_direction.copy()
		aux.setMag(20)
		rect(0, -this.attr.gun_width/2, this.attr.gun_length, this.attr.gun_width)
		pop()
	}

	this.projectile_initial_pos = function() {
		var direction = this.aim_direction.copy()
		direction.setMag(this.attr.gun_length)
		var pos = createVector(this.pos.x, this.pos.y)
		pos.add(direction)
		return pos
	}

	this.shoot = function() {
		if (this.attr.current_cooldown === 0) {
			this.attr.current_cooldown = this.attr.cooldown

			add_projectile(new Projectile(this.projectile_initial_pos(), this.aim_direction.copy(), this.attr.gun_width/2, this.attr.projectile_speed))
		}
	}
}

function Projectile(pos, vel, r, max_spd) {
	this.max_speed = max_spd
	this.speed = vel
	this.speed.setMag(this.max_speed)
	this.alive = 1
	this.pos = pos
	
	this.radius = r

	this.update = function() {
		this.pos.add(this.speed)
		if (this.pos.mag() > field_radius_limit) this.alive = 0;
	}

	this.show = function() {
		fill(255,0,0)
		noStroke()
		ellipse(this.pos.x , this.pos.y, this.radius*2, this.radius*2)
	}
}