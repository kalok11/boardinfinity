import mongoose from 'mongoose'
import moment from 'moment'

var now=moment();

const todolistSchema=mongoose.Schema({
  task_name:String,
  task_description: String,
  creator:String,
  duration: String,
  createdAt: { type: Date,  default: now.toDate() },
    expired: { type: Date},
});



export default mongoose.model('tasks',todolistSchema);
