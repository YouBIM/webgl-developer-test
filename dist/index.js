const canvas = document.getElementById('test');
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;

//Your Code
const context2D = canvas.getContext('2d');
context2D.font = "30px Arial";
context2D.fillText("Your cube here! :)", 100, 100);