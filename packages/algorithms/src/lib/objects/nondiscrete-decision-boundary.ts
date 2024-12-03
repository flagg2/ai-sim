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

interface NonDiscreteDecisionBoundaryConfig {
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

export class NonDiscreteDecisionBoundary implements Renderable {
  public object: RenderableObject;

  constructor(
    regionData: Array<{ x: number; y: number; prediction: number }>,
    config?: NonDiscreteDecisionBoundaryConfig,
  ) {
    const size = Math.sqrt(regionData.length);
    const data = new Float32Array(size * size * 4);

    regionData.forEach((point, i) => {
      data[i * 4] = point.prediction; // R channel stores value
      data[i * 4 + 3] = 1; // A channel set to 1
    });

    const valueTexture = new DataTexture(
      data,
      size,
      size,
      RGBAFormat,
      FloatType,
    );
    valueTexture.needsUpdate = true;

    const pos = config?.position ?? { x: 75, y: 75, z: -1 };
    const planeSize = config?.size ?? { width: 150, height: 150 };

    const material = new ShaderMaterial({
      transparent: true,
      uniforms: {
        valueTexture: { value: valueTexture },
        textureSize: { value: new Vector2(size, size) },
      },
      vertexShader: `
         varying vec2 vUv;
         void main() {
           vUv = uv;
           gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
         }
       `,
      fragmentShader: `
         uniform sampler2D valueTexture;
         uniform vec2 textureSize;
         varying vec2 vUv;
 
         float sampleValue(vec2 coord) {
           return texture2D(valueTexture, coord).r;
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
           float value = 0.0;
           int idx = 0;
           for(int y = -1; y <= 1; y++) {
             for(int x = -1; x <= 1; x++) {
               vec2 offset = vec2(float(x) * dx, float(y) * dy);
               value += kernel[idx] * sampleValue(texCoord + offset);
               idx++;
             }
           }
           
           // Calculate gradient for edge detection (using Sobel operator)
           float gx = 
             sampleValue(texCoord + vec2(-dx, -dy)) * -1.0 +
             sampleValue(texCoord + vec2(-dx,  dy)) * -1.0 +
             sampleValue(texCoord + vec2(-dx,  0.0)) * -2.0 +
             sampleValue(texCoord + vec2( dx, -dy)) *  1.0 +
             sampleValue(texCoord + vec2( dx,  dy)) *  1.0 +
             sampleValue(texCoord + vec2( dx,  0.0)) *  2.0;
             
           float gy = 
             sampleValue(texCoord + vec2(-dx, -dy)) * -1.0 +
             sampleValue(texCoord + vec2( 0.0,-dy)) * -2.0 +
             sampleValue(texCoord + vec2( dx, -dy)) * -1.0 +
             sampleValue(texCoord + vec2(-dx,  dy)) *  1.0 +
             sampleValue(texCoord + vec2( 0.0, dy)) *  2.0 +
             sampleValue(texCoord + vec2( dx,  dy)) *  1.0;
           
           float gradientMagnitude = sqrt(gx * gx + gy * gy);
           
           // Interpolate between red and green with smooth transition
           vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), smoothstep(0.0, 1.0, value));
           
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
      name: "NonDiscreteDecisionBoundary",
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
