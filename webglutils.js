TWO_PI = 180

// Visitors and Utils
class webglutils 
{
	static buildShader (gl, vertexShaderSource, framgentShaderSource)
	{
		const glContext = gl;
	
		// Load Shader Function
		var loadShader = function (glContext, shaderType, shaderSource)
		{
			const shader = glContext.createShader(shaderType);
			glContext.shaderSource(shader, shaderSource);
			glContext.compileShader(shader);
		
			if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
				alert("Cannot compile shader: " + glContext.getShaderInfoLog(shader));
				glContext.deleteShader(shader);
				return null;
			}

			return shader;
		}
		
		// Load shaderSource
		const vertexShader = loadShader(glContext, glContext.VERTEX_SHADER, vertexShaderSource);
		if (vertexShader === null)
		{
			return null;
		}
			
		const fragmentShader = loadShader(glContext, glContext.FRAGMENT_SHADER, framgentShaderSource);
		if (fragmentShader === null)
		{
			return null;
		}
			
		// Build Shaders
		const shaderProg = glContext.createProgram();
		glContext.attachShader(shaderProg, vertexShader);
		glContext.attachShader(shaderProg, fragmentShader);
		glContext.linkProgram(shaderProg);
		
		if (!glContext.getProgramParameter(shaderProg, glContext.LINK_STATUS)) {
			return null;
		}

		return shaderProg;		
	}
	
	
	static createBuffers (gl, model)
	{
		const vertexBuffer = gl.createBuffer();		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);		
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);	
		
	    const colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.colors), gl.STATIC_DRAW);
  		  
		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
		
		model.indexBuffer = indexBuffer;
		model.vertexBuffer = vertexBuffer;
		model.colorBuffer = colorBuffer;
		return model;
	}

	static getProjectionMatrix(fov, near, far, width, height)
	{
		const fieldOfView = fov * Math.PI / TWO_PI;  
		const aspect = width / height;
		const zNear = near;
		const zFar = far;
		const projectionMatrix = mat4.create();

		mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
		return projectionMatrix;
	}
	
	static getWorldMatrix(traslation, cubeRotation)
	{
		const modelViewMatrix = mat4.create();		
		mat4.translate(modelViewMatrix, modelViewMatrix, traslation); 
		mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);   
		mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 1, 0]);       
		return modelViewMatrix;
	}

	static getRandomColor()
	{
		return [Math.random(), Math.random(), Math.random(), 1.0];
	}

	static computeInverse(s) {
	  var i, s, d, inv, det;


	  var d = this.elements;
	  var inv = mat4.create();

	  inv[0]  =   s[5]*s[10]*s[15] - s[5] *s[11]*s[14] - s[9] *s[6]*s[15]
				+ s[9]*s[7] *s[14] + s[13]*s[6] *s[11] - s[13]*s[7]*s[10];
	  inv[4]  = - s[4]*s[10]*s[15] + s[4] *s[11]*s[14] + s[8] *s[6]*s[15]
				- s[8]*s[7] *s[14] - s[12]*s[6] *s[11] + s[12]*s[7]*s[10];
	  inv[8]  =   s[4]*s[9] *s[15] - s[4] *s[11]*s[13] - s[8] *s[5]*s[15]
				+ s[8]*s[7] *s[13] + s[12]*s[5] *s[11] - s[12]*s[7]*s[9];
	  inv[12] = - s[4]*s[9] *s[14] + s[4] *s[10]*s[13] + s[8] *s[5]*s[14]
				- s[8]*s[6] *s[13] - s[12]*s[5] *s[10] + s[12]*s[6]*s[9];

	  inv[1]  = - s[1]*s[10]*s[15] + s[1] *s[11]*s[14] + s[9] *s[2]*s[15]
				- s[9]*s[3] *s[14] - s[13]*s[2] *s[11] + s[13]*s[3]*s[10];
	  inv[5]  =   s[0]*s[10]*s[15] - s[0] *s[11]*s[14] - s[8] *s[2]*s[15]
				+ s[8]*s[3] *s[14] + s[12]*s[2] *s[11] - s[12]*s[3]*s[10];
	  inv[9]  = - s[0]*s[9] *s[15] + s[0] *s[11]*s[13] + s[8] *s[1]*s[15]
				- s[8]*s[3] *s[13] - s[12]*s[1] *s[11] + s[12]*s[3]*s[9];
	  inv[13] =   s[0]*s[9] *s[14] - s[0] *s[10]*s[13] - s[8] *s[1]*s[14]
				+ s[8]*s[2] *s[13] + s[12]*s[1] *s[10] - s[12]*s[2]*s[9];

	  inv[2]  =   s[1]*s[6]*s[15] - s[1] *s[7]*s[14] - s[5] *s[2]*s[15]
				+ s[5]*s[3]*s[14] + s[13]*s[2]*s[7]  - s[13]*s[3]*s[6];
	  inv[6]  = - s[0]*s[6]*s[15] + s[0] *s[7]*s[14] + s[4] *s[2]*s[15]
				- s[4]*s[3]*s[14] - s[12]*s[2]*s[7]  + s[12]*s[3]*s[6];
	  inv[10] =   s[0]*s[5]*s[15] - s[0] *s[7]*s[13] - s[4] *s[1]*s[15]
				+ s[4]*s[3]*s[13] + s[12]*s[1]*s[7]  - s[12]*s[3]*s[5];
	  inv[14] = - s[0]*s[5]*s[14] + s[0] *s[6]*s[13] + s[4] *s[1]*s[14]
				- s[4]*s[2]*s[13] - s[12]*s[1]*s[6]  + s[12]*s[2]*s[5];

	  inv[3]  = - s[1]*s[6]*s[11] + s[1]*s[7]*s[10] + s[5]*s[2]*s[11]
				- s[5]*s[3]*s[10] - s[9]*s[2]*s[7]  + s[9]*s[3]*s[6];
	  inv[7]  =   s[0]*s[6]*s[11] - s[0]*s[7]*s[10] - s[4]*s[2]*s[11]
				+ s[4]*s[3]*s[10] + s[8]*s[2]*s[7]  - s[8]*s[3]*s[6];
	  inv[11] = - s[0]*s[5]*s[11] + s[0]*s[7]*s[9]  + s[4]*s[1]*s[11]
				- s[4]*s[3]*s[9]  - s[8]*s[1]*s[7]  + s[8]*s[3]*s[5];
	  inv[15] =   s[0]*s[5]*s[10] - s[0]*s[6]*s[9]  - s[4]*s[1]*s[10]
				+ s[4]*s[2]*s[9]  + s[8]*s[1]*s[6]  - s[8]*s[2]*s[5];

	  det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
	  if (det === 0) {
		return inv;
	  }

	  det = 1 / det;
	  for (i = 0; i < 16; i++) {
		inv[i] = inv[i] * det;
	  }

	  return inv;
	}
	
	
	static getRay(ix,iy, width, height, projectionMatrix)
	{		
		//Normalize Device Coordinate
		var nx = ix / width * 2 - 1;
		var ny = 1 - iy / height * 2;
		const inverseProjMatrix = webglutils.computeInverse(projectionMatrix);
		

		var vectorStartMat = vec4.create();
		vectorStartMat[0] = nx;
		vectorStartMat[1] = ny;
		vectorStartMat[2] = -1.0;
		vectorStartMat[3] = 1.0;	
		

		var vectorEndMat = vec4.create();
		vectorEndMat[0] = nx;
		vectorEndMat[1] = ny;
		vectorEndMat[2] = 1.0;
		vectorEndMat[3] = 1.0;

		
		var vec4Near = vec4.create();
		var vec4Far = vec4.create();	
			
		vec4Near = mat4.multiply(vec4Near, inverseProjMatrix, vectorStartMat ); 
		vec4Far = mat4.multiply(vec4Far, inverseProjMatrix, vectorEndMat);
	
		vec4Near[0] /= vec4Near[3];
		vec4Near[1] /= vec4Near[3];
		vec4Near[2] /= vec4Near[3];

		vec4Far[1] /= vec4Far[3];
		vec4Far[2] /= vec4Far[3];
		vec4Far[3] /= vec4Far[3];

		var rayNear	= vec3.create();
		rayNear[0] = vec4Near[0];
		rayNear[1] = vec4Near[1];
		rayNear[2] = vec4Near[2];
		
		var rayFar	= vec3.create();
		rayFar[0] = vec4Far[1];
		rayFar[1] = vec4Far[0];
		rayFar[2] = vec4Far[2];

		return {start:rayNear, end:rayFar};
	}	

	static checkCollision(rayStart, rayEnd, model, projectionMatrix)
	{
		var vRayNorm = vec3.create();
		vRayNorm[0] = rayEnd[0] - rayStart[0];
		vRayNorm[1] = rayEnd[1] - rayStart[1];
		vRayNorm[2] = rayEnd[2] - rayStart[2];
		
		vRayNorm = vec3.normalize(vRayNorm, vRayNorm);
		
		var vRayToCenter = vec3.create();
		vRayToCenter[0] = model.position[0] - rayStart[0];
		vRayToCenter[1] = model.position[1] - rayStart[1];
		vRayToCenter[2] = model.position[2] - rayStart[2];

		
		var tProj = vec3.dot(vRayToCenter,vRayNorm);
		var radius2 = Math.sqrt(model.BoundingSphereRatio);

		var oppLenSqr = vec3.dot(vRayToCenter,vRayToCenter) - (tProj * tProj); 
		if(oppLenSqr <= radius2)
		{
			return true;
		}		

		return false;
	}			
}



