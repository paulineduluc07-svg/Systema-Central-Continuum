"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  SMAA,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function PostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      {/* SMAA anti-aliasing — cleaner than FXAA */}
      <SMAA />

      {/* Bloom — subtle, targets only very bright highlights */}
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.7}
      />

      {/* Vignette — cinematic edge darkening */}
      <Vignette
        offset={0.22}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
