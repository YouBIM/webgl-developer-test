
const cubeVertices = [ /* front */  -1.0, -1.0,  1.0,   1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  -1.0,  1.0,  1.0, 
				       /* back  */  -1.0, -1.0, -1.0,   1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  -1.0,  1.0, -1.0];
 
const cubeColors = [ 1.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0, 1.0,
1.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0, 1.0];

const cubeIndices = [ /* front */ 0, 1, 2,   2, 3, 0, /* top    */ 1, 5, 6,   6, 2, 1,
				      /* back  */ 7, 6, 5,   5, 4, 7, /* bottom */ 4, 0, 3,   3, 7, 4,
				      /* left  */ 4, 5, 1, 	1, 0, 4,  /* right  */ 3, 2, 6,   6, 7, 3];

				 
// Vertex shader program
const cubeVSSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

// Fragment shader program
const cubeFSSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;
