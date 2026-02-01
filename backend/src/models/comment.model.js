import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
    authorName: {
        type: String,
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500,
    }
}, {
    timestamps: { createdAt: true, updatedAt: false } 
});

// Compound index for fast retrieval of recent comments by ticket
CommentSchema.index({ ticketId: 1, createdAt: -1 });

export const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

