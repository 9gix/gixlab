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



var snowflake_count = 999;


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
	var fontBase = 1000;
	var fontSize = 70;
	var lineBase = 800;
	var lineHeight = 100;
	var ratio;

	var resizeCanvas = function(){
		canvas.width  = window.innerWidth;
		canvas.height = window.innerHeight;
		canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		initObject();
	}

	window.addEventListener('resize', resizeCanvas);


	
	// increasing the fps may cause the old snow coordinate missed from being clear.
	var fps = 120; 
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
	};

	var initObject = function(){
		ctx.fillStyle = 'white';
		var message = getURLParameter("message") || "Looking for the meaning of Life under the snow?";
		console.log(message);
		var lineHeight = parseInt(getURLParameter("line-height")) || getLineHeight();
		var font = getURLParameter("font") || getFont();
		ctx.font = font;
		fillTextMultiLine(ctx, message, canvas.width * 0.2, canvas.height * 0.20, canvas.width - canvas.width * 0.4, lineHeight);
		var from = getURLParameter("from") || "Eugene";
		ctx.fillStyle = 'pink';
		ctx.fillText("~ " + from, canvas.width - canvas.width * 0.5, canvas.height - 50);
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
		renderSnow();
		setTimeout(snowLoop, interval)
	};

	// Modified from: http://stackoverflow.com/a/21574562/764592
	function fillTextMultiLine(ctx, text, x, y, maxWidth, lineHeight) {
		var lines = text.split(/\\n/);
		for (var i = 0; i < lines.length; ++i) {
			y = wrapText(ctx, lines[i], x, y, maxWidth, lineHeight);
			y += lineHeight;
		}
	}

	// Modified from: http://stackoverflow.com/a/11582513/764592
	function getURLParameter(name) {
	    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
	}

	// Modified from: http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
	function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

		for(var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			}
			else {
				line = testLine;
			}
        }
        context.fillText(line, x, y);
        return y;
    }

    // Modified from http://stackoverflow.com/a/22948632/764592
    function getFont() {
	    var ratio = fontSize / fontBase;
	    var size = (0.5 * canvas.height + 0.5 * canvas.width) * ratio;
	    
	    return (size|0) + 'px Papyrus, Brush Script MT, Courier New';
	}

	function getLineHeight(){
		var ratio = lineHeight / lineBase;
		var size = (0.5 * canvas.height + 0.5 * canvas.width ) * ratio;
		return size;
	}

	return {};
})();
