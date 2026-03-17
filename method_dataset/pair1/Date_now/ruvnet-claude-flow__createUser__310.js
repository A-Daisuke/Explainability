function __method_wrapper__() {
  async createUser(userData: {
    email: string;
    password: string;
    role: UserRole;
    isActive?: boolean;
  }): Promise<User> {
    // Check if email already exists
    const existingUser = Array.from(this.users.values()).find(u => u.email === userData.email);
    if (existingUser) {
      throw new AuthenticationError('Email already exists');
    }

    const userId = `user_${Date.now()}_${nanoid(8)}`;
    const passwordHash = await this.hashPassword(userData.password);
    const permissions = ROLE_PERMISSIONS[userData.role] || [];

    const user: User = {
      id: userId,
      email: userData.email,
      passwordHash,
      role: userData.role,
      permissions,
      apiKeys: [],
      isActive: userData.isActive ?? true,
      loginAttempts: 0,
      mfaEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(userId, user);

    this.logger.info('User created', {
      userId,
      email: userData.email,
      role: userData.role,
    });

    return user;
  }

}
