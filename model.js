
function Model(vertices, indices, colors, position)
{
	this.vertices = vertices;
	this.indices = indices;
	this.indexCount = indices.length;
	this.normalColor = [colors[0],colors[1],colors[2],colors[3]];
	this.colors = colors;
	this.position = position;
	this.indexBuffer = null;
	this.vertexBuffer = null;
	this.colorBuffer = null;
	this.programInfo = null;
	this.vertexShaderSource = "";
	this.fragmentShaderSource = "";
	this.rotation = 0;
	this.BoundingSphereRatio = 0
}



Model.prototype.setColor = function(color)
{	
	this.colors = []
	for (var i = 0 ; i < this.vertices.length; i++)
	{
		this.colors.push(color[0]);
		this.colors.push(color[1]);
		this.colors.push(color[2]);
		this.colors.push(color[3]);
	}
}

Model.prototype.computeBoundingSphere = function ()
{
	center = [0,0,0]

	var vertexLen = this.vertices.length / 3;

	for (var i = 0; i < vertexLen; i++)
	{
		center[0] += this.vertices[i * 3];
		center[1] += this.vertices[i * 3 + 1];
		center[2] += this.vertices[i * 3 + 2];
	}
	
	center[0] /= vertexLen;
	center[1] /= vertexLen;
	center[2] /= vertexLen;
		

	var maxDist = 0;	
	
	for (var i = 0; i < vertexLen; i++)
	{
		pt = [this.vertices[i * 3], this.vertices[i * 3 + 1], this.vertices[i * 3 + 2]];
		
		tmpDist = vec3.distance(pt,center);
		
		if (tmpDist > maxDist)
		{
			maxDist = tmpDist
		}
	}
	
	this.BoundingSphereRatio = maxDist;	
}
