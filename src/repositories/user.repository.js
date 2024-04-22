const UserModel = require("../models/user.model");

class UserRepository {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }
}

module.exports = UserRepository;
