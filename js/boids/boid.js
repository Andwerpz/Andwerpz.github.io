
class Boid {
	constructor() {
		this.position = createVector(random(width), random(height));
		this.velocity = p5.Vector.random2D();
		this.velocity.mult(random(4));
		this.acceleration = createVector();
		this.perceptionRadius = 50;
		this.maxForce = 0.2;
		this.maxSpeed = 2;
	}
	
	draw() {
		strokeWeight(8);
		stroke(255);
		point(this.position.x, this.position.y);
	}
	
	tick() {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		if(this.position.x > width){
			this.position.x -= width;
		}
		if(this.position.y > height){
			this.position.y -= height;
		}
		if(this.position.x < 0){
			this.position.x += width;
		}
		if(this.position.y < 0){
			this.position.y += height;
		}
	}
	
	align(boids){
		let avg = createVector();
		let count = 0;
		for(let b of boids){
			let d = dist(this.position.x, this.position.y, b.position.x, b.position.y);
			if(b != this && d <= this.perceptionRadius){
				avg.add(b.velocity);
				count ++;
			}
		}
		if(count != 0){
			avg.div(count);
			avg.setMag(this.maxSpeed);
			avg.sub(this.velocity);	
			avg.limit(this.maxForce);
		}
		return avg;
	}
	
	cohesion(boids){
		let avg = createVector();
		let count = 0;
		for(let b of boids){
			let d = dist(this.position.x, this.position.y, b.position.x, b.position.y);
			if(b != this && d <= this.perceptionRadius){
				avg.add(b.position);
				count ++;
			}
		}
		if(count != 0){
			avg.div(count);
			avg.sub(this.position);
			avg.setMag(this.maxSpeed);
			avg.sub(this.velocity);	
			avg.limit(this.maxForce);
		}
		return avg;
	}
	
	separation(boids){
		let avg = createVector();
		let count = 0;
		for(let b of boids){
			let d = dist(this.position.x, this.position.y, b.position.x, b.position.y);
			if(b != this && d <= this.perceptionRadius){
				let diff = p5.Vector.sub(this.position, b.position);
				diff.div(d * d);
				avg.add(diff);
				count ++;
				strokeWeight(Math.min((100 * this.perceptionRadius) / (d * d), 1));
				line(this.position.x, this.position.y, b.position.x, b.position.y);
			}
		}
		if(count != 0){
			avg.div(count);
			avg.setMag(this.maxSpeed);
			avg.sub(this.velocity);	
			avg.limit(this.maxForce);
		}
		return avg;
	}
	
	flock(boids){
		this.acceleration.set(0, 0);
		let alignment = this.align(boids);
		let cohesion = this.cohesion(boids);
		let separation = this.separation(boids);
		/*
		alignment.mult(alignSlider.value());
		cohesion.mult(cohesionSlider.value());
		separation.mult(separationSlider.value());
		*/
		this.acceleration.add(alignment);
		this.acceleration.add(cohesion);
		this.acceleration.add(separation);
	}
}