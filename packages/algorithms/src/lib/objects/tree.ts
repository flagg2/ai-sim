import {
  MeshStandardMaterial,
  SphereGeometry,
  CylinderGeometry,
  Euler,
  Vector2,
  Vector3,
} from "three";
import { Renderable, ThreeProps } from "./renderable";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import helvetiker from "three/examples/fonts/helvetiker_regular.typeface.json";

type TreeNode = {
  value: string;
  position: Vector2;
  isLeaf?: boolean;
  children?: TreeNode[];
};

/**
 * Renders a tree in 2D space.
 */
export class Tree implements Renderable {
  private font: any;

  constructor(private rootNode: TreeNode) {
    const loader = new FontLoader();
    this.font = loader.parse(helvetiker);
  }

  private getTextGeometry(text: string): ThreeProps {
    const geometry = new TextGeometry(text, {
      font: this.font,
      size: 4,
      height: 0.5,
      curveSegments: 12,
      bevelEnabled: false,
    });

    geometry.computeBoundingBox();
    const centerOffset = geometry.boundingBox!.getCenter(new Vector3());
    geometry.translate(-centerOffset.x, -centerOffset.y, 0);

    return {
      geometry,
      material: {
        dark: new MeshStandardMaterial({ color: "#ffffff" }),
        light: new MeshStandardMaterial({ color: "#000000" }),
      },
      position: new Vector3(0, 0, 0),
    };
  }

  private buildTreeProps(node: TreeNode): ThreeProps[] {
    const props: ThreeProps[] = [];

    if (!node.position) {
      console.warn("Node position is undefined:", node);
      return props;
    }

    const nodePosition = new Vector3(node.position.x, node.position.y, 0);

    props.push({
      geometry: new SphereGeometry(3),
      material: new MeshStandardMaterial({
        color: node.isLeaf ? "#4CAF50" : "#2196F3",
      }),
      position: nodePosition.clone(),
    });

    const textProps = this.getTextGeometry(node.value);
    props.push({
      ...textProps,
      position: new Vector3(nodePosition.x, nodePosition.y + 8, 0),
    });

    if (node.children?.length) {
      node.children.forEach((child) => {
        if (!child.position) {
          console.warn("Child position is undefined:", child);
          return;
        }

        const start = nodePosition.clone();
        const end = new Vector3(child.position.x, child.position.y, 0);
        const direction = new Vector2().subVectors(end, start);
        const distance = direction.length();

        props.push({
          geometry: new CylinderGeometry(0.5, 0.5, distance),
          material: {
            dark: new MeshStandardMaterial({
              color: "#ffffff",
              opacity: 0.3,
              transparent: true,
            }),
            light: new MeshStandardMaterial({
              color: "#000000",
              opacity: 0.3,
              transparent: true,
            }),
          },
          position: new Vector3(start.x, start.y, 0).lerp(
            new Vector3(end.x, end.y, 0),
            0.5,
          ),
          rotation: new Euler(
            0,
            0,
            Math.atan2(direction.y, direction.x) - Math.PI / 2,
          ),
        });

        props.push(...this.buildTreeProps(child));
      });
    }

    return props;
  }

  public getKey(): string {
    return "tree3d";
  }

  public getRenderProps(): ThreeProps[] {
    return this.buildTreeProps(this.rootNode);
  }

  public getTooltip(): React.ReactNode {
    return null;
  }
}
