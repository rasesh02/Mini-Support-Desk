import { Router } from "express";
import {getCommentsByTicketId,createComment} from '../controllers/comment.controller.js';

const router = Router();

router.get('/tickets/:id/comments', getCommentsByTicketId);
router.post('/tickets/:id/comments', createComment);

export default router;