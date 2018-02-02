

function start_app()
{
	const canvas = document.querySelector('#glcanvas');
	var renderer = new Renderer(canvas);
	
	var success = renderer.initRenderer();
	
	if (!success)
	{
		alert("Unable to init renderer");
		return;
	}
	
	// Attach window, canvas and document events
	renderer.initEventHandlers();

	// Init drawing loop
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
							   window.webkitRequestAnimationFrame || window.msRequestAnimationFrame  ||
							   function(f){return setTimeout(f, 1000/60)}
	
	loop = function loop (){		
		window.requestAnimationFrame(loop);
		renderer.tick();
	}
	
	loop();
	
	// Create models
	cube = new Model(cubeVertices, cubeIndices, cubeColors, [-0.0, 0.0, -6.0]);
	cube.computeBoundingSphere();
	
	cube.vertexShaderSource = cubeVSSource;
	cube.fragmentShaderSource = cubeFSSource;
	
	// Create Buffers	
	cube = webglutils.createBuffers(renderer.gl, cube);
	
	// Add model to renderer
	success = renderer.addModel(cube);
	if (!success)
	{
		alert("Unable to load model!");
		return;
	}
}

start_app();