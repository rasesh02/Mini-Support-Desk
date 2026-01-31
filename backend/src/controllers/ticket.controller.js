import {Ticket} from '../models/ticket.model.js';


export const getAllTickets = async (req, res) => {
  try {
    const { q, status, priority, sort, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Filter by status
    if (status) {
      filter.status = status;
    }
    
    // Filter by priority
    if (priority) {
      filter.priority = priority;
    }
    
    // Build sort object
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort) {
      const sortFields = sort.split(',');
      sortOption = {};
      sortFields.forEach(field => {
        if (field.startsWith('-')) {
          sortOption[field.substring(1)] = -1;
        } else {
          sortOption[field] = 1;
        }
      });
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);
    
    // Execute query
    const tickets = await Ticket.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);
    
    // Get total count for pagination
    const total = await Ticket.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: tickets,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tickets',
      error: error.message
    });
  }
};


export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }
    const ticket = new Ticket({
      title,
      description,
      priority: priority || 'LOW',
      status: status || 'OPEN'
    });
    await ticket.save();

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(400).json({ success: false,message: 'Error creating ticket',error: error.message
    });
  }
};


export const getTicketById = async (req, res) => {
  try {
    const {id} = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({success: false,message: 'Ticket not found'});
    }
    
    res.status(200).json({success: true,data: ticket});
  } catch (error) {
    res.status(500).json({success: false,message: 'Error fetching ticket',error: error.message});
  }
};


export const updateTicket = async (req, res) => {
  try {
    const {id} = req.params;
    const {title, description, status, priority} = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating ticket',
      error: error.message
    });
  }
};


export const deleteTicket = async (req, res) => {
  try {
    const {id} = req.params;
    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    res.status(200).json({success: true,message: 'Ticket deleted successfully'
    });
  } catch (error) {
    res.status(500).json({success: false,message: 'Error deleting ticket',error: error.message});
  }
};
