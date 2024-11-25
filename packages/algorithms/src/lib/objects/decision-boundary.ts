import {
  PlaneGeometry,
  ShaderMaterial,
  DataTexture,
  RGBAFormat,
  FloatType,
  Vector2,
  Vector3,
} from "three";
import { Renderable, RenderableObject } from "./renderable";

export class DecisionBoundary implements Renderable {
  public object: RenderableObject;

  constructor(
    regionData: Array<{ x: number; y: number; prediction: number }>,
    colors?: { pos: Vector2; neg: Vector2 },
  ) {
    // Create a data texture from our predictions
    const size = Math.sqrt(regionData.length);
    const data = new Float32Array(size * size * 4);

    // Fill texture with prediction data
    regionData.forEach((point, i) => {
      data[i * 4] = point.prediction; // R channel stores prediction
      data[i * 4 + 3] = 1; // A channel set to 1
    });

    const predictionTexture = new DataTexture(
      data,
      size,
      size,
      RGBAFormat,
      FloatType,
    );
    predictionTexture.needsUpdate = true;

    colors ??= {
      pos: new Vector2(0x4c / 0xff, 0xaf / 0xff),
      neg: new Vector2(0xf4 / 0xff, 0x43 / 0xff),
    };

    // Create shader material
    const material = new ShaderMaterial({
      transparent: true,
      uniforms: {
        predictionTexture: { value: predictionTexture },
        textureSize: { value: new Vector2(size, size) },
        colorPos: { value: colors.pos },
        colorNeg: { value: colors.neg },
      },
      vertexShader: `
         varying vec2 vUv;
         void main() {
           vUv = uv;
           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
         }
       `,
      fragmentShader: `
         uniform sampler2D predictionTexture;
         uniform vec2 textureSize;
         uniform vec2 colorPos;
         uniform vec2 colorNeg;
         varying vec2 vUv;
 
         void main() {
           vec2 texCoord = vUv;
           
           // Sample nearby predictions for smoothing
           float dx = 1.0 / textureSize.x;
           float dy = 1.0 / textureSize.y;
           
           float c0 = texture2D(predictionTexture, texCoord).r;
           float c1 = texture2D(predictionTexture, texCoord + vec2(dx, 0.0)).r;
           float c2 = texture2D(predictionTexture, texCoord + vec2(-dx, 0.0)).r;
           float c3 = texture2D(predictionTexture, texCoord + vec2(0.0, dy)).r;
           float c4 = texture2D(predictionTexture, texCoord + vec2(0.0, -dy)).r;
           
           // Average predictions for smoothing
           float prediction = (c0 + c1 + c2 + c3 + c4) / 5.0;
           
           // Interpolate colors
           vec3 color;
           if(prediction > 0.0) {
             color = vec3(colorPos.x, colorPos.y, 0.5);
           } else {
             color = vec3(colorNeg.x, colorNeg.y, 0.36);
           }
           
           // Smooth transition near boundary
           float confidence = abs(prediction);
           float alpha = 0.3;
           
           gl_FragColor = vec4(color, alpha);
         }
       `,
    });

    // Create a single plane geometry for the entire visualization
    const geometry = new PlaneGeometry(100, 100);

    this.object = new RenderableObject({
      three: {
        geometry,
        material,
        position: new Vector3(50, 50, -1), // Center the plane
      },
      name: "DecisionBoundary",
    });
  }

  getRenderProps() {
    return this.object.getRenderProps();
  }

  getKey() {
    return this.object.getKey();
  }

  getTooltip() {
    return null;
  }
}
