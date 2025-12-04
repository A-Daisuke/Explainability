/**
 * ユーザー情報を管理するクラス
 */
class UserManager {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  /**
   * 新しいユーザーを追加
   */
  addUser(name, email) {
    if (!name || !email) {
      throw new Error('Name and email are required');
    }

    const user = {
      id: this.nextId++,
      name: name,
      email: email,
      createdAt: new Date()
    };

    this.users.push(user);
    return user;
  }

  /**
   * IDでユーザーを検索
   */
  findUserById(id) {
    return this.users.find(user => user.id === id) || null;
  }
}

module.exports = UserManager;