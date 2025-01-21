
const boids = [];
bucket = [];

const perceptionRadius = 50;

function setup(){
	cnv = createCanvas(windowWidth, 240);
	cnv.parent('banner');
	//createCanvas(720, 300);
	for(let i = 0; i < (width / perceptionRadius); i++){
		bucket.push([]);
		for(let j = 0; j < (height / perceptionRadius); j++){
			bucket[i].push([]);
		}
	}
	print(bucket);
	for(let i = 0; i < 100; i++){
		let x = random(width);
		let y = random(height);
		bucket[parseInt(Math.min(x / perceptionRadius, (width / perceptionRadius) - 1))][parseInt(Math.min(y / perceptionRadius, (height / perceptionRadius) - 1))].push(new Boid(x, y, perceptionRadius));
		boids.push(new Boid(x, y, perceptionRadius));
	}
	
}

function draw(){
	background(51);
	
	let newBucket = [];
	
	for(let i = 0; i < bucket.length; i++){
		newBucket.push([]);
		for(let j = 0; j < bucket[i].length; j++){
			newBucket[i].push([]);
		}
	}
	
	//let count = 0;
	for(let i = 0; i < bucket.length; i++){
		for(let j = 0; j < bucket[i].length; j++){	
			for(let boid of bucket[i][j]){
				//count ++;
				boid.flock(bucket); 
				boid.tick();
				boid.draw();
				let oldPos = createVector(boid.position.x, boid.position.y);
				let bucketXLength = bucket.length;
				let bucketYLength = bucket[0].length;
				let bucketX = (bucket.length + parseInt(Math.min(oldPos.x / perceptionRadius, (width / perceptionRadius) - 1))) % bucketXLength;
				let bucketY = (bucket[0].length + parseInt(Math.min(oldPos.y / perceptionRadius, (height / perceptionRadius) - 1))) % bucketYLength;
				newBucket[bucketX][bucketY].push(boid);
			}
		}
	}
	bucket = newBucket;

}