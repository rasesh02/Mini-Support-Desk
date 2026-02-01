import {Comment} from '../models/comment.model.js';
import {Ticket} from '../models/ticket.model.js';


export const getCommentsByTicketId = async (req, res) => {
  try {
    const {id} = req.params;
    const {page=1,limit=10} = req.query;
    
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);
    
    // Fetch comments
    const comments = await Comment.find({ ticketId: id }).sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // Get total count
    const total = await Comment.countDocuments({ ticketId: id });
    res.status(200).json({
      success: true,
      data: comments,
      pagination: {page: parseInt(page),limit: limitNum,total,totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};


export const createComment=async (req, res) => {
  try {
    const {id} = req.params;
    const {authorName, message} = req.body;
    
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({success: false,message: 'Ticket not found'
      });
    }
    
    if (!authorName || !message) {
      return res.status(400).json({
        success: false,
        message: 'Author name and message are required'
      });
    }
    
    const comment = new Comment({
      ticketId: id,
      authorName,
      message
    });
    await comment.save();
    
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(400).json({success: false,message: 'Error creating comment',error: error.message});
  }
};
