
function Renderer (cvs) 
{ 
	this.canvas = cvs;
	this.width = this.canvas.clientWidth;
	this.height = this.canvas.clientHeight;
	this.gl = null;
	this.models = [];
	this.isDrawing = false;
	this.lastTime = 0;
	this.projectionMatrix = webglutils.getProjectionMatrix(45, 0.1, 100.0, this.width, this.height);
}

Renderer.prototype.initRenderer = function ()
{
	//  Check canvas
	if (!this.canvas)
	{
		alert("Missing canvas");
		return false;
	}
	
	// Load GL Context
	this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
	if (!this.gl) 
	{
		alert("Unable to load gl.");
		return false;
	}
	
	return true;
}

Renderer.prototype.loadShaders = function (vertexShaderSource, fragmentShaderSource)
{
	if (!this.gl) 
	{
		alert("WebGL instance is not loaded!");
		return null;
	}
	
	var shaderProgram = webglutils.buildShader(this.gl, vertexShaderSource, fragmentShaderSource);
	
	if(shaderProgram === null)
	{
		alert("Unable to initialize the shader: " + this.gl.getProgramInfoLog(shaderProgram));
		return null;
	}		
	
	
	const programInfo = {
    program: shaderProgram,
    attribLocations: {
	  vertexPosition: this.gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
	  vertexColor: this.gl.getAttribLocation(shaderProgram, 'aVertexColor'),	  
    },
    uniformLocations: {
	  projectionMatrix: this.gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
	  modelViewMatrix: this.gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),	  
    },
	};
  
	
	return programInfo;
}

Renderer.prototype.clean = function ()
{
	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  
	this.gl.clearDepth(1.0);                 
	this.gl.enable(this.gl.DEPTH_TEST);           
	this.gl.depthFunc(this.gl.LEQUAL);            
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);	
}

Renderer.prototype.addModel = function (model)
{
	if (model.vertexBuffer != null && model.indexBuffer != null &&
		model.vertexShaderSource != "" && model.fragmentShaderSource != "")
	{		
		var programInfo = this.loadShaders(model.vertexShaderSource,model. fragmentShaderSource);
		
		if (programInfo != null)
		{
			model.programInfo = programInfo;
			this.models.push(model);
			return true;
		}
	}
	
	return false;
}

Renderer.prototype.update = function (currTime, elapsedTime)
{
	// Add animations here!	
}

Renderer.prototype.onMouseUp = function(ev)
{

}

Renderer.prototype.onMouseDown = function(ev)
{
	var ray = webglutils.getRay(ev.clientX, ev.clientY, this.width, this.height, this.projectionMatrix);	
	let rayStart = ray.start;
	let rayEnd = ray.end;
	
	for (modelIndex in this.models)
	{
		let model = this.models[modelIndex]	
		
		if (webglutils.checkCollision(rayStart, rayEnd, model, this.projectionMatrix))
		{
			let randomColor = webglutils.getRandomColor();			
			model.setColor(randomColor);
		}
		else
		{
			model.setColor(model.normalColor);
		}
		
		this.gl.deleteBuffer(model.colorBuffer);
		
		model = webglutils.createBuffers(this.gl, model);		
	}	
}

Renderer.prototype.onMouseMove = function(ev)
{	

}

Renderer.prototype.initEventHandlers = function ()
{
	this.canvas.onmousedown = (ev) => {this.onMouseDown(ev)};
    document.onmouseup = (ev) => {this.onMouseUp(ev)};
    document.onmousemove = (ev) => {this.onMouseMove(ev);};
	window.onbeforeunload = () => {this.cleanModels();};
}


Renderer.prototype.draw = function (currTime, elapsedTime)
{
	this.clean();	
	var gl = this.gl;
	
	for (modelIndex in this.models)
	{
		let model = this.models[modelIndex];
		
		const modelMatrix = webglutils.getWorldMatrix(model.position, model.rotation);
		
		model.rotation += elapsedTime * 0.001
		
		// Read the vertex buffer
		{
			const numComponents = 3;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
			gl.vertexAttribPointer(model.programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
			gl.enableVertexAttribArray(model.programInfo.attribLocations.vertexPosition);
		  }

		
		  // Read the color buffer
		  {
			const numComponents = 4;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
			gl.vertexAttribPointer(model.programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
			gl.enableVertexAttribArray(model.programInfo.attribLocations.vertexColor);
		  }
	  

		  // Set the index we want to draw
		  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);

		  gl.useProgram(model.programInfo.program);

		  // Set the shader uniforms
		  gl.uniformMatrix4fv(model.programInfo.uniformLocations.projectionMatrix, false, this.projectionMatrix);
		  gl.uniformMatrix4fv(model.programInfo.uniformLocations.modelViewMatrix, false, modelMatrix);

		  {
			const vertexCount = model.indexCount;
			const type = gl.UNSIGNED_SHORT;
			const offset = 0;
			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
		  }
	}
}

Renderer.prototype.tick = function ()
{	
	var currTime = new Date().getTime();
	var elapsedTime = currTime - this.lastTime;
	this.update(currTime, elapsedTime);
	this.draw(currTime, elapsedTime);	
	this.lastTime = currTime;
}


Renderer.prototype.start = function (animationFrame)
{
	if (this.isDrawing === false)
	{
		this.isDrawing = true;
		var anim = animationFrame;
		anim(this.tick);
	}
}

Renderer.prototype.cleanModels = function()
{
	let tmpModels = []
	let modelLen = this.models.length;
	
	for (modelIndex in this.models)
	{
		tmpModels.push(this.models[modelIndex]);
	}
	
	for (var i= 0; i < modelLen ; i++)
	{
		this.models.pop();
	}
	
	for (var i= 0; i < modelLen ; i++)
	{
		this.gl.delteShader(tmpModels[i].programInfo.program);
		this.gl.deleteBuffer(tmpModels[i].vertexBuffer);
		this.gl.deleteBuffer(tmpModels[i].colorBuffer);
		this.gl.deleteBuffer(tmpModels[i].indexBuffer);
	}
}
