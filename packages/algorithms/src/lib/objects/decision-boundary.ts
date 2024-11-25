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

// Add interface for configuration
interface DecisionBoundaryConfig {
  colors?: {
    pos: Vector2;
    neg: Vector2;
  };
  position?: {
    x: number;
    y: number;
    z: number;
  };
  size?: {
    width: number;
    height: number;
  };
}

export class DecisionBoundary implements Renderable {
  public object: RenderableObject;

  constructor(
    regionData: Array<{ x: number; y: number; prediction: number }>,
    config?: DecisionBoundaryConfig,
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

    const colors = config?.colors ?? {
      pos: new Vector2(0x4c / 0xff, 0xaf / 0xff),
      neg: new Vector2(0xf4 / 0xff, 0x43 / 0xff),
    };

    // Use provided position and size or fallback to defaults
    const pos = config?.position ?? { x: 75, y: 75, z: -1 };
    const planeSize = config?.size ?? { width: 150, height: 150 };

    // Create shader material with colors
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
 
         float samplePrediction(vec2 coord) {
           return texture2D(predictionTexture, coord).r;
         }
 
         void main() {
           vec2 texCoord = vUv;
           float dx = 1.0 / textureSize.x;
           float dy = 1.0 / textureSize.y;
           
           // Gaussian blur kernel (3x3)
           float kernel[9] = float[9](
             0.0625, 0.125, 0.0625,
             0.125,  0.25,  0.125,
             0.0625, 0.125, 0.0625
           );
           
           // Apply Gaussian blur
           float prediction = 0.0;
           int idx = 0;
           for(int y = -1; y <= 1; y++) {
             for(int x = -1; x <= 1; x++) {
               vec2 offset = vec2(float(x) * dx, float(y) * dy);
               prediction += kernel[idx] * samplePrediction(texCoord + offset);
               idx++;
             }
           }
           
           // Calculate gradient for edge detection (using Sobel operator)
           float gx = 
             samplePrediction(texCoord + vec2(-dx, -dy)) * -1.0 +
             samplePrediction(texCoord + vec2(-dx,  dy)) * -1.0 +
             samplePrediction(texCoord + vec2(-dx,  0.0)) * -2.0 +
             samplePrediction(texCoord + vec2( dx, -dy)) *  1.0 +
             samplePrediction(texCoord + vec2( dx,  dy)) *  1.0 +
             samplePrediction(texCoord + vec2( dx,  0.0)) *  2.0;
             
           float gy = 
             samplePrediction(texCoord + vec2(-dx, -dy)) * -1.0 +
             samplePrediction(texCoord + vec2( 0.0,-dy)) * -2.0 +
             samplePrediction(texCoord + vec2( dx, -dy)) * -1.0 +
             samplePrediction(texCoord + vec2(-dx,  dy)) *  1.0 +
             samplePrediction(texCoord + vec2( 0.0, dy)) *  2.0 +
             samplePrediction(texCoord + vec2( dx,  dy)) *  1.0;
           
           float gradientMagnitude = sqrt(gx * gx + gy * gy);
           
           // Color interpolation
           vec3 posColor = vec3(colorPos.x, colorPos.y, 0.5);
           vec3 negColor = vec3(colorNeg.x, colorNeg.y, 0.36);
           float t = smoothstep(-0.2, 0.2, prediction);
           vec3 color = mix(negColor, posColor, t);
           
           // Enhanced edge visibility
           float edgeIntensity = smoothstep(0.0, 0.8, gradientMagnitude);
           float alpha = mix(0.2, 0.5, edgeIntensity);
           
           gl_FragColor = vec4(color, alpha);
         }
       `,
    });

    const geometry = new PlaneGeometry(planeSize.width, planeSize.height);

    this.object = new RenderableObject({
      three: {
        geometry,
        material,
        position: new Vector3(pos.x, pos.y, pos.z),
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
