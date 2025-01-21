
class Boid {
	constructor(x, y, pr) {
		this.position = createVector(x, y);
		this.velocity = p5.Vector.random2D();
		this.velocity.mult(random(4));
		this.acceleration = createVector();
		this.perceptionRadius = pr;
		this.maxForce = 0.15;
		this.maxSpeed = .7;
	}
	
	draw() {
		strokeWeight(8);
		stroke(255);
		point(this.position.x, this.position.y);
        if(this.position.x < this.perceptionRadius) point(this.position.x + width, this.position.y);
        if(width - this.position.x < this.perceptionRadius) point(this.position.x - width, this.position.y);
        if(this.position.y < this.perceptionRadius) point(this.position.x, this.position.y + height);
        if(height - this.position.y < this.perceptionRadius) point(this.position.x, this.position.y - height);
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
	
	flock(bucket){
		
		let bucketXLength = bucket.length;
		let bucketYLength = bucket[0].length;
		
		let avgDiff = createVector();
		let avgPos = createVector();
		let avgVel = createVector();
		let count = 0;
		let bucketX = parseInt(Math.min(this.position.x / this.perceptionRadius, (width / this.perceptionRadius) - 1));
		let bucketY = parseInt(Math.min(this.position.y / this.perceptionRadius, (height / this.perceptionRadius) - 1));
        let minBX = bucketX - 2;
        let maxBX = bucketX + 2;
        let minBY = bucketY - 2;
        let maxBY = bucketY + 2;
        // if(bucketX == 0) minBX -= 1;
        // if(bucketX == bucketXLength - 1) maxBX += 1;
        // if(bucketY == 0) minBY -= 1;
        // if(bucketY == bucketYLength - 1) maxBY += 1;
		for(let i = minBX; i <= maxBX; i++){
			for(let j = minBY; j <= maxBY; j++){
				for(let test of bucket[(i + bucketXLength) % bucketXLength][(j + bucketYLength) % bucketYLength]){
					let b = createVector(test.position.x, test.position.y);
                    if(i >= bucketXLength) b.x += width;
                    if(i < 0) b.x -= width;
                    if(j >= bucketYLength) b.y += height;
                    if(j < 0) b.y -= height;
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
                    if(d <= this.perceptionRadius) {
                        strokeWeight(1 - (d / this.perceptionRadius));
                        line(this.position.x, this.position.y, b.x, b.y);
                    }
				}
			}
		}
		
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

		avgVel.mult(1);
		avgPos.mult(1);
		avgDiff.mult(1.2);
		
		this.acceleration.add(avgVel);
		this.acceleration.add(avgPos);
		this.acceleration.add(avgDiff);
	}
}