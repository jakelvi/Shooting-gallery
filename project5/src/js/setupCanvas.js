const setupCanvas = (canvasId) => {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return { canvas, ctx };
};

export default setupCanvas;
