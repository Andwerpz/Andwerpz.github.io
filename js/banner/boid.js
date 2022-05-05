
class Boid {
	constructor(x, y, pr) {
		this.position = createVector(x, y);
		this.velocity = p5.Vector.random2D();
		this.velocity.mult(random(4));
		this.acceleration = createVector();
		this.perceptionRadius = pr;
		this.maxForce = 0.2;
		this.maxSpeed = .7;
	}
	
	draw() {
		strokeWeight(8);
		stroke(255);
		point(this.position.x, this.position.y);
	}
	
	tick() {
	
		/*let bucketXLength = bucket.length;
		let bucketYLength = bucket[0].length;
	
		let bucketX = (bucket.length + parseInt(Math.min(this.position.x / this.perceptionRadius, (width / this.perceptionRadius) - 1))) % bucketXLength;
		let bucketY = (bucket[0].length + parseInt(Math.min(this.position.y / this.perceptionRadius, (height / this.perceptionRadius) - 1))) % bucketYLength;
		for(let i = 0; i < bucket[bucketX][bucketY].length; i++){
			if(bucket[bucketX][bucketY][i] == this){
				//print("REMOVE");
				bucket[bucketX][bucketY].splice(i, 1);
				break;
			}
		}*/
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
		/*bucketX = (bucket.length + parseInt(Math.min(this.position.x / this.perceptionRadius, (width / this.perceptionRadius) - 1))) % bucketXLength;
		bucketY = (bucket[0].length + parseInt(Math.min(this.position.y / this.perceptionRadius, (height / this.perceptionRadius) - 1))) % bucketYLength;
		bucket[bucketX][bucketY].push(this);*/
		//print("ADD");
	}
	
	flock(bucket){
		
		let bucketXLength = bucket.length;
		let bucketYLength = bucket[0].length;
		
		let avgDiff = createVector();
		let avgPos = createVector();
		let avgVel = createVector();
		let count = 0;
		let bucketX = bucket.length + parseInt(Math.min(this.position.x / this.perceptionRadius, (width / this.perceptionRadius) - 1));
		let bucketY = bucket[0].length + parseInt(Math.min(this.position.y / this.perceptionRadius, (height / this.perceptionRadius) - 1));
		//let output = "";
		for(let i = bucketX - 1; i <= bucketX + 1; i++){
			for(let j = bucketY - 1; j <= bucketY + 1; j++){
			//output += (i % bucketXLength) + " " + (j % bucketYLength) + ", ";
				for(let test of bucket[i % bucketXLength][j % bucketYLength]){
					
					let b = createVector(test.position.x, test.position.y);
					/*if(dist(this.position.x, this.position.y, b.x + width, b.y) < dist(this.position.x, this.position.y, b.x, b.y)){
						//print("PLUS WIDTH");
						b.x += width;
					}
					else if(dist(this.position.x, this.position.y, b.x - width, b.y) < dist(this.position.x, this.position.y, b.x, b.y)){
						//print("MINUS WIDTH");
						b.x -= width;
					}
					if(dist(this.position.x, this.position.y, b.x, b.y + height) < dist(this.position.x, this.position.y, b.x, b.y)){
						//print("PLUS HEIGHT");
						b.y += height;
					}
					else if(dist(this.position.x, this.position.y, b.x, b.y - height) < dist(this.position.x, this.position.y, b.x, b.y)){
						//print("MINUS HEIGHT");
						b.y -= height;
					}*/
					let d = dist(this.position.x, this.position.y, b.x, b.y);
					if(test != this && d <= this.perceptionRadius){
						count ++;
						
						//alignment
						avgVel.add(test.velocity);
						
						//cohesion
						avgPos.add(b);
					
						//separation
						let diff = p5.Vector.sub(this.position, b);
						diff.div(d * d);
						avgDiff.add(diff);
						
					}
					if(d <= this.perceptionRadius + 10){
						strokeWeight(Math.min((6 * this.perceptionRadius) / (d * d), 1));
						line(this.position.x, this.position.y, b.x, b.y);
					}
				}
			}
		}
		//print(output);
		
		if(count != 0){
		
			//alignment
			avgVel.div(count);
			avgVel.setMag(this.maxSpeed);
			avgVel.sub(this.velocity);	
			avgVel.limit(this.maxForce);
		
			//cohesion
			avgPos.div(count);
			avgPos.sub(this.position);
			avgPos.setMag(this.maxSpeed);
			avgPos.sub(this.velocity);	
			avgPos.limit(this.maxForce);
		
			//separation
			avgDiff.div(count);
			avgDiff.setMag(this.maxSpeed);
			avgDiff.sub(this.velocity);	
			avgDiff.limit(this.maxForce);
		}
		
		this.acceleration.set(0, 0);
		/*
		let alignment = this.align(boids);
		let cohesion = this.cohesion(boids);
		let separation = this.separation(boids);
		*/
		
		avgVel.mult(1);
		avgPos.mult(1);
		avgDiff.mult(1.2);
		
		this.acceleration.add(avgVel);
		this.acceleration.add(avgPos);
		this.acceleration.add(avgDiff);

	}
}