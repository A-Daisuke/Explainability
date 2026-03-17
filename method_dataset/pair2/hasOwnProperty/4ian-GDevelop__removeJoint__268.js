function __method_wrapper__() {
    removeJoint(jointId: integer | string) {
      // Cast to string
      jointId = jointId.toString(10);

      // Delete the joint
      if (this.joints.hasOwnProperty(jointId)) {
        const joint = this.joints[jointId];

        // If we delete a joint attached to a gear joint, the gear will crash, so we must delete the gear joint first
        // Search in our joints list gear joints attached to this one we want to remove
        // The joint can be attached to a gear joint if it's revolute or prismatic only
        if (
          joint.GetType() === Box2D.e_revoluteJoint ||
          joint.GetType() === Box2D.e_prismaticJoint
        ) {
          for (const jId in this.joints) {
            if (this.joints.hasOwnProperty(jId)) {
              // Must check pointers because gears store non-casted joints (b2Joint)
              if (
                this.joints[jId].GetType() === Box2D.e_gearJoint &&
                (Box2D.getPointer(
                  (this.joints[jId] as Box2D.b2GearJoint).GetJoint1()
                ) === Box2D.getPointer(joint) ||
                  Box2D.getPointer(
                    (this.joints[jId] as Box2D.b2GearJoint).GetJoint2()
                  ) === Box2D.getPointer(joint))
              ) {
                // We could pass it a string, but lets do it right
                this.removeJoint(parseInt(jId, 10));
              }
            }
          }
        }

        // Remove the joint
        this.world.DestroyJoint(joint);
        delete this.joints[jointId];
      }
    }

}
