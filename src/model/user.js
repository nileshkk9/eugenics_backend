const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const UsersSchema = Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true
    },
    phoneNumber: { type: String, required: true, unique: true },

    pinCode: { type: Number, required: true },
    privilage: { type: String, default: "NORMAL", enum: ['NORMAL', 'ADMIN'] },
    testResult: {
        type: String, default: "NEGATIVE", enum: ['POSITIVE', 'NEGATIVE']

    },
    covidWorker: {
        type: mongoose.Schema.Types.ObjectId,
    }
});
const User = mongoose.model("Users", UsersSchema);
module.exports = User;