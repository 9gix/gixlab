"use strict";
/* 
Snow simulation
by Eugene


Future Attribute
---------

Environment:
- temperature
- wind
- airpressure
- gravity
- color = black

Snowflake:
- melt
- form
- coordinate
- color = white

Object:
- Bounding Coordinate
- color = not black.

*/



var snowflake_count = 15000;


function Snowflake(x, y){
	this.x = x;
	this.y = y;
	this.old_x = x;
	this.old_y = y;
	this.timeout = 10;
	this.isStopped = false;
}

Snowflake.prototype.restartTimeout = function(){
	this.timeout = 10;
}

Snowflake.prototype.tickTimeout = function(){
	this.timeout -= 1;
}

function randint(max) {
	return Math.floor(Math.random() * max);
}

var Snow = (function(){	


	var canvas = document.getElementById('snow-canvas');
	var ctx = canvas.getContext('2d');
	var canvasData;


	var resizeCanvas = function(){
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
		canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		initObject();
	}

	window.addEventListener('resize', resizeCanvas);


	
	// increasing the fps may cause the old snow coordinate missed from being clear.
	var fps = 20; 
	var interval = 1000 / fps;

	document.addEventListener("DOMContentLoaded", function(event){
		resizeCanvas();
		init();
	});

	var snowflakes = [];

	var init = function(){
		initSnow();
		initObject();
		snowLoop();
		renderSnow();
	};

	var drawPixel = function(x, y, r, g, b, a){
		var index = (x + y * canvas.width) * 4;
		canvasData.data[index + 0] = r;
		canvasData.data[index + 1] = g;
		canvasData.data[index + 2] = b;
		canvasData.data[index + 3] = a;
	};

	var drawSnowflake = function(x, y){
		drawPixel(x, y, 200, 200, 255, 220);
	};

	var clearSnowflake = function(x, y){
		drawPixel(x, y, 0, 0, 0, 0);
	};


	var updateCanvas = function(){
		ctx.putImageData(canvasData, 0, 0);
	};

	var clearCanvas = function(){
		for (var i = 0; i < canvasData.data.length; i++){
			canvasData.data[i] = 0;
		}
	}

	var renderSnow = function(){
		for (var i = 0; i < snowflakes.length; i++){
			var snowflake = snowflakes[i];
			clearSnowflake(snowflake.old_x, snowflake.old_y);
			drawSnowflake(snowflake.x, snowflake.y);
		}
		updateCanvas();
		window.requestAnimationFrame(renderSnow);
	};

	var initObject = function(){
		ctx.fillStyle = 'white';
		ctx.font = '144px Papyrus, Brush Script MT, Courier New';
		ctx.fillText("Gix Snow", 50, 200);
		ctx.font = '72px Brush Script MT, Papyrus, Courier New';
		ctx.fillText("by Eugene", 150, 300);
		canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	};

	var initSnow = function(){
    	for (var i = 0; i < snowflake_count; i++){
    		var snowflake = new Snowflake(
    			randint(canvas.width),
    			randint(canvas.height));
    		snowflakes.push(snowflake);
    	}
	}

	var isEmptySpace = function(x, y){
		var index = (x + y * canvas.width) * 4;
		var data = canvasData.data
		return (data[index + 0] === 0 &&
				data[index + 1] === 0 && 
				data[index + 2] === 0 && 
				data[index + 3] === 0);
	}

	var createSnowflake = function(){
		return new Snowflake(randint(canvas.width), 0);
	}

	var snowLoop = function(){
		// Snow Logic
		var flake_count = snowflakes.length;

		for (var i = 0; i < flake_count; i++){
			var snowflake = snowflakes[i];

			snowflake.old_x = snowflake.x;
			snowflake.old_y = snowflake.y;
			var new_x = snowflake.x + randint(2) - randint(2);
			var new_y = snowflake.y + 1;

			if (isEmptySpace(new_x, new_y)){
				snowflake.x = new_x;
				snowflake.y = new_y;
			} else {
				if (snowflake.timeout === 0){
					if (isEmptySpace(snowflake.x + 1, snowflake.y + 1)){
						snowflake.x += 1;
						snowflake.y += 1;
						snowflake.restartTimeout();
					} else if (isEmptySpace(snowflake.x - 1, snowflake.y + 1)){
						snowflake.x -= 1;
						snowflake.y += 1;
						snowflake.restartTimeout();
					} else if (!snowflake.isStopped){
						snowflakes.push(createSnowflake());
						snowflake.isStopped = true;
					}
				} else {
					snowflake.tickTimeout();
				}
			}
		}

		setTimeout(snowLoop, interval)
	};

	return {};
})();
