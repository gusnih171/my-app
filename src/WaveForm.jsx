//Imports and Setup
import { useRef, useEffect } from "react";
import useSize from "./useSize";
import './WaveFormCss.css';

//Animation Function
function animateBars(analyser, canvas, canvasCtx, dataArray, bufferLength) {
  analyser.getByteFrequencyData(dataArray);
  canvasCtx.fillStyle = "#000000";
  const HEIGHT = canvas.height / 2;
  const barWidth = Math.ceil(canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] / 255) * HEIGHT;
    const orangeShade = Math.floor((dataArray[i] / 255) * 5);
    const orangeHex = ["#eeba77", "#ebaf60", "#e69833", "#e69441", "#da871b"][orangeShade];
    canvasCtx.fillStyle = orangeHex;
    canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    x += barWidth + 1;
  }
}
// The WaveForm Component
const WaveForm = ({ analyzerData }) => {
  const canvasRef = useRef(null);
  const { dataArray, analyzer, bufferLength } = analyzerData;
  const [width, height] = useSize();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyzer) return;
    const canvasCtx = canvas.getContext("2d");

    const animate = () => {
      requestAnimationFrame(animate);
      canvas.width = width;
      canvas.height = height;
      canvasCtx.translate(0, canvas.offsetHeight / 2 - 115);
      animateBars(analyzer, canvas, canvasCtx, dataArray, bufferLength);
    };

    animate();
  }, [dataArray, analyzer, bufferLength, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};
//Export
export default WaveForm;