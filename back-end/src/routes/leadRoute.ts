import { Router } from "express";
import { LeadController } from "../controllers/LeadController";

const router = Router();

/**
 * @swagger
 * /api/leads:
 *   get:
 *     summary: Retrieve all leads
 *     description: Fetch all leads available in the system
 *     responses:
 *       200:
 *         description: List of leads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   status:
 *                     type: string
 */
router.get("/", LeadController.getAllLeads);

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Create a new lead
 *     description: Creates a new lead with the provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lead created successfully
 */
router.post("/", LeadController.createLead);

/**
 * @swagger
 * /api/leads/{id}/assign:
 *   put:
 *     summary: Assign an agent to the lead
 *     description: Assign a specific agent to a lead based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Lead ID to assign the agent to.
 *         schema:
 *           type: string
 *       - in: body
 *         name: agent
 *         description: The agent information to assign to the lead.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             agentId:
 *               type: number
 *               description: The unique ID of the agent to assign to the lead.
 *               example: 4  # Update this with a string example
 *             followUpStatus:
 *               type: string
 *               description: Status of the follow-up with the lead.
 *               example: "Pending"
 *             preferredPropertyType:
 *               type: string
 *               description: The preferred property type of the lead.
 *               example: "Apartment"
 *             budget:
 *               type: number
 *               description: Budget for the lead.
 *               example: 300000
 *             notes:
 *               type: string
 *               description: Additional notes for the lead.
 *               example: "Looking for a 2-bedroom apartment"
 *     responses:
 *       200:
 *         description: Lead successfully assigned to the agent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lead assigned to agent successfully."
 *       400:
 *         description: Invalid request, possible incorrect agent ID or lead ID.
 *       404:
 *         description: Lead or agent not found.
 *       500:
 *         description: Internal server error.
 */

router.put("/:id/assign", LeadController.assignAgent);

/**
 * @swagger
 * /api/leads/{id}/reserve:
 *   post:
 *     summary: Create a reservation for the lead
 *     description: Create a reservation for a specific lead by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Lead ID to reserve the property for.
 *         schema:
 *           type: string
 *       - in: body
 *         name: reservation
 *         description: Reservation details to be created for the lead.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             propertyId:
 *               type: number
 *               description: The ID of the property to reserve.
 *               example: 1
 *             reservationDate:
 *               type: string
 *               format: date-time
 *               description: The date and time when the reservation is made.
 *               example: "2025-03-20T10:00:00"
 *             reservationFee:
 *               type: number
 *               description: The fee associated with the reservation.
 *               example: 5000
 *             expectedClosingDate:
 *               type: string
 *               format: date-time
 *               description: The expected closing date for the reservation.
 *               example: "2025-05-15T00:00:00"
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reservation created successfully."
 *       400:
 *         description: Invalid request, possible missing or invalid parameters.
 *       404:
 *         description: Lead or property not found.
 *       500:
 *         description: Internal server error.
 */

router.post("/:id/reserve", LeadController.createReservation);

/**
 * @swagger
 * /api/leads/{id}/financials:
 *   put:
 *     summary: Update financial status for the lead
 *     description: Mark the financials for the lead with a financial status, loan amount, and payment plan.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Lead ID whose financial status is being updated.
 *         schema:
 *           type: string
 *       - in: body
 *         name: financials
 *         description: Financial details to be updated for the lead.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             financialStatus:
 *               type: string
 *               description: The current financial status of the lead.
 *               example: "Rejected"
 *             loanAmount:
 *               type: number
 *               description: The loan amount associated with the lead.
 *               example: 250000
 *             paymentPlan:
 *               type: string
 *               description: The payment plan chosen for the loan.
 *               example: "Installment"
 *     responses:
 *       200:
 *         description: Financials updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Financials updated successfully."
 *       400:
 *         description: Invalid request, possible incorrect financial details.
 *       404:
 *         description: Lead not found.
 *       500:
 *         description: Internal server error.
 */

router.put("/:id/financials", LeadController.financialApproved);

/**
 * @swagger
 * /api/leads/{id}/legal:
 *   put:
 *     summary: Finalize legal process for the lead
 *     description: Finalize the legal process for the lead by updating contract status and legal notes.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Lead ID whose legal process is being finalized.
 *         schema:
 *           type: string
 *       - in: body
 *         name: legalDetails
 *         description: Legal details to be updated for the lead.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             contractSigned:
 *               type: boolean
 *               description: Indicates whether the contract has been signed for the lead.
 *               example: true
 *             legalNotes:
 *               type: string
 *               description: Notes regarding the legal process for the lead.
 *               example: "All documents are finalized"
 *     responses:
 *       200:
 *         description: Legal process finalized successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Legal process finalized successfully."
 *       400:
 *         description: Invalid request, possible missing or incorrect legal details.
 *       404:
 *         description: Lead not found.
 *       500:
 *         description: Internal server error.
 */

router.put("/:id/legal", LeadController.legalFinalized);

/**
 * @swagger
 * /api/leads/{id}/legal:
 *   post:
 *     summary: Finalize legal process for the lead
 *     description: Finalize the legal process for the lead by updating contract status and legal notes.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Lead ID whose legal process is being finalized.
 *         schema:
 *           type: string
 *       - in: body
 *         name: legalDetails
 *         description: Legal details to be updated for the lead.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             contractSigned:
 *               type: boolean
 *               description: Indicates whether the contract has been signed for the lead.
 *               example: true
 *             legalNotes:
 *               type: string
 *               description: Notes regarding the legal process for the lead.
 *               example: "All documents are finalized"
 *     responses:
 *       200:
 *         description: Legal process finalized successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Legal process finalized successfully."
 *       400:
 *         description: Invalid request, possible missing or incorrect legal details.
 *       404:
 *         description: Lead not found.
 *       500:
 *         description: Internal server error.
 */

router.post("/:id/sold", LeadController.sold);

export default router;
