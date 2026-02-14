import React, { useEffect, useMemo, useRef } from "react";
import { Group } from "three";
import { useGraph } from "@react-three/fiber";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import type { GLTF } from "three-stdlib";

/**
 * If you want super-strong typing for nodes/materials,
 * you'd normally generate types with:
 * npx gltfjsx developer.glb --typescript
 * But here is a safe TSX version without generated types.
 */

type DeveloperProps = JSX.IntrinsicElements["group"] & {
  animationName?: "IDLE" | "HELLO" | "CLAP" | "VICTORY" | string;
};

type GLTFResult = GLTF & {
  nodes: Record<string, any>;
  materials: Record<string, any>;
};

const Developer: React.FC<DeveloperProps> = ({
  animationName = "IDLE",
  ...props
}) => {
  const group = useRef<Group>(null);

  const { scene } = useGLTF("/models/animations/developer.glb") as GLTFResult;

  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as {
    nodes: Record<string, any>;
    materials: Record<string, any>;
  };

  const { animations: idleAnimation } = useFBX("/models/animations/idle.fbx");
  const { animations: saluteAnimation } = useFBX("/models/animations/salute.fbx");
  const { animations: clappingAnimation } = useFBX(
    "/models/animations/clapping.fbx"
  );
  const { animations: victoryAnimation } = useFBX(
    "/models/animations/victory.fbx"
  );
  


  // Name the clips (guarded)
  if (idleAnimation[0]) idleAnimation[0].name = "IDLE";
  if (saluteAnimation[0]) saluteAnimation[0].name = "HELLO";
  if (clappingAnimation[0]) clappingAnimation[0].name = "CLAP";
  if (victoryAnimation[0]) victoryAnimation[0].name = "VICTORY";


  const clips = useMemo(
    () =>
      [idleAnimation[0], saluteAnimation[0], clappingAnimation[0], victoryAnimation[0],].filter(
        Boolean
      ),
    [idleAnimation, saluteAnimation, clappingAnimation, victoryAnimation,]
  );

  const { actions } = useAnimations(clips as any, group);

  useEffect(() => {
    const action = actions?.[animationName];
    if (action) action.reset().fadeIn(0.5).play();

    return () => {
      if (action) action.fadeOut(0.5);
    };
  }, [actions, animationName]);

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.Hips} />

      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />

      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />

      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
};

useGLTF.preload("/models/animations/developer.glb");

export default Developer;
