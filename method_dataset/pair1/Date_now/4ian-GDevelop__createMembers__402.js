  const createMembers = async () => {
    await delay(2000);
    if (members && members.length < 2) {
      // No accounts created, we create a bunch of them
      setMembers(initialMembers);
      setMemberships(
        initialMemberships.map(membership => ({
          userId: membership.userId,
          teamId: membership.teamId,
          createdAt: membership.createdAt,
        }))
      );
    } else {
      if (!members) return;
      // We create the accounts one by one (batch creation won't work, only single addition button)
      const newMembers = [...members];
      const newUserId = `user${random(1000, 1000)}`;
      // $FlowIgnore - the whole user object is not needed for this component
      const newUser: User = {
        id: newUserId,
        email: `${newUserId}@naver.com`,
        username: null,
      };
      newMembers.push(newUser);
      const newMemberships = [...memberships];
      newMemberships.push({
        userId: newUser.id,
        teamId: 'teamId',
        createdAt: Date.now(),
        groups: null,
      });
      setMemberships(newMemberships);
      setMembers(newMembers);
    }
  };
