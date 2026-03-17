function __method_wrapper__() {
  authorize(session: MCPSession, permission: string): boolean {
    if (!this.config.enabled || !session.authenticated) {
      return !this.config.enabled; // If auth disabled, allow all
    }

    const permissions = session.authData?.permissions || [];

    // Check for wildcard permission
    if (permissions.includes('*')) {
      return true;
    }

    // Check for exact permission match
    if (permissions.includes(permission)) {
      return true;
    }

    // Check for prefix-based permissions (e.g., "tools.*" matches "tools.list")
    for (const perm of permissions) {
      if (perm.endsWith('*') && permission.startsWith(perm.slice(0, -1))) {
        return true;
      }
    }

    this.logger.warn('Authorization denied', {
      sessionId: session.id,
      user: session.authData?.user,
      permission,
      userPermissions: permissions,
    });

    return false;
  }

}
