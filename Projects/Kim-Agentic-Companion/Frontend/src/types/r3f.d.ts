import type { ThreeElements } from "@react-three/fiber";

// React 19 moved JSX types into React.JSX — augment both namespaces
declare module "react" {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
