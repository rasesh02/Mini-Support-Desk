import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 80,
    },
    description: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 2000,
    },
    status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
        default: 'OPEN',
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'LOW',
    }
}, {
    timestamps: true 
});

// Indexes for filtering and sorting
TicketSchema.index({ createdAt: -1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ title: 'text', description: 'text' }); // text index for search

export const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
