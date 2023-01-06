const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
content: {
    type: String,
    required: true
},
completed: {
    type: Boolean,
    default: false,
    required: true
},
owner: {
    type: String,
    required: true
}
})
module.exports = mongoose.model('TodoTask',todoTaskSchema);