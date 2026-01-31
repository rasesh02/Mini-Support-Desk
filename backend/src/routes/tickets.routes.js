import { Router } from "express";
import {getAllTickets,createTicket,getTicketById,updateTicket,deleteTicket} from '../controllers/ticket.controller.js';

const router = Router();


router.get('/tickets', getAllTickets);
router.post('/tickets', createTicket);
router.get('/tickets/:id', getTicketById);
router.patch('/tickets/:id', updateTicket);
router.delete('/tickets/:id', deleteTicket);

export default router;
