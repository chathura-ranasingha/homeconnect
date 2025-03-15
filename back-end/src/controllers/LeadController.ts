import { Request, Response } from "express";
import { AppDataSource } from "../ormconfig";
import { Lead } from "../entities/Lead";
import { User } from "../entities/User";
import { Property } from "../entities/Property";
import { Reservation } from "../entities/Reservation";
import { Sale } from "../entities/Sale"; // Import Sale entity

export class LeadController {
  // Get all leads with filtering and pagination
  static async getAllLeads(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        agentId,
        startDate,
        endDate,
        page = 1,
        pageSize = 10,
      } = req.query;

      const filter: any = {};

      if (status) {
        filter.status = status;
      }

      if (agentId) {
        filter.assignedAgent = {
          id: agentId,
        };
      }

      if (startDate && endDate) {
        filter.inquiryDate = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        };
      }

      const limit = Number(pageSize);
      const offset = (Number(page) - 1) * limit;

      const totalLeads = await AppDataSource.getRepository(Lead).count({
        where: filter,
        relations: ["assignedAgent"],
      });

      const leads = await AppDataSource.getRepository(Lead).find({
        where: filter,
        relations: ["assignedAgent"],
        take: limit,
        skip: offset,
        order: { inquiryDate: "DESC" },
      });

      const totalPages = Math.ceil(totalLeads / limit);

      const agents = await AppDataSource.getRepository(User).find({
        where: { role: "agent" },
        select: ["id", "username"],
      });

      res.status(200).json({
        data: {
          leads,
          agents,
          pagination: {
            currentPage: Number(page),
            pageSize: Number(pageSize),
            totalItems: totalLeads,
            totalPages,
          },
        },
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Server Error" });
    }
  }

  // Create a new lead
  static async createLead(req: Request, res: Response): Promise<any> {
    try {
      const lead = new Lead();
      lead.name = req.body.name;
      lead.contactInfo = req.body.contactInfo;
      lead.source = req.body.source;
      lead.status = req.body.status;
      lead.inquiryDate = new Date();

      const savedLead = await AppDataSource.getRepository(Lead).save(lead);
      return res.status(201).json(savedLead);
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ error: "Error creating lead" });
    }
  }

  // Assign an agent to a lead
  static async assignAgent(req: Request, res: Response): Promise<any> {
    try {
      const leadId = req.params.id;
      const { agentId, followUpStatus, preferredPropertyType, budget, notes } =
        req.body;

      if (!agentId) {
        return res.status(400).json({ error: "Agent ID is required" });
      }

      const lead = await AppDataSource.getRepository(Lead).findOne({
        where: { id: leadId },
        relations: ["assignedAgent"],
      });

      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      if (lead.status !== "Unassigned") {
        return res
          .status(400)
          .json({ error: "Lead must be in 'Unassigned' state to be assigned" });
      }

      const agent = await AppDataSource.getRepository(User).findOne({
        where: { id: agentId, role: "agent" },
      });

      if (!agent) {
        return res
          .status(404)
          .json({ error: "Agent not found or not authorized" });
      }

      lead.assignedAgent = agent;
      lead.status = "Assigned";

      if (followUpStatus) lead.followUpStatus = followUpStatus;
      if (preferredPropertyType)
        lead.preferredPropertyType = preferredPropertyType;
      if (budget) lead.budget = budget;
      if (notes) lead.notes = notes;

      await AppDataSource.getRepository(Lead).save(lead);

      res.status(200).json({
        message: "Lead successfully assigned",
        lead,
      });
    } catch (error) {
      console.error("Error assigning lead:", error);
      res.status(500).json({ error: "Server Error" });
    }
  }

  // Create a reservation for a lead
  static async createReservation(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const {
        propertyId,
        reservationDate,
        reservationFee,
        expectedClosingDate,
      } = req.body;

      if (
        !propertyId ||
        !reservationDate ||
        !reservationFee ||
        !expectedClosingDate
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const leadRepository = AppDataSource.getRepository(Lead);
      const propertyRepository = AppDataSource.getRepository(Property);
      const reservationRepository = AppDataSource.getRepository(Reservation);

      const lead = await leadRepository.findOne({
        where: { id: parseInt(id) },
      });
      const property = await propertyRepository.findOne({
        where: { id: propertyId },
      });

      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      const reservation = new Reservation();
      reservation.lead = lead;
      reservation.property = property;
      reservation.reservationDate = new Date(reservationDate);
      reservation.reservationFee = reservationFee;
      reservation.expectedClosingDate = new Date(expectedClosingDate);

      lead.status = "Reservation";
      await leadRepository.save(lead);

      await reservationRepository.save(reservation);

      return res
        .status(201)
        .json({ message: "Reservation created successfully", reservation });
    } catch (error) {
      console.error("Error creating reservation:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  // Add financial approval status to a reservation
  static async financialApproved(req: Request, res: Response): Promise<any> {
    try {
      const { financialStatus, loanAmount, paymentPlan } = req.body;
      const leadId = req.params.id;

      if (!financialStatus || !loanAmount || !paymentPlan) {
        return res.status(400).json({
          error:
            "Missing required fields: financialStatus, loanAmount, paymentPlan",
        });
      }

      if (financialStatus !== "Approved" && financialStatus !== "Rejected") {
        return res.status(400).json({
          error: 'Financial status must be either "Approved" or "Rejected"',
        });
      }

      const reservationRepository = AppDataSource.getRepository(Reservation);
      const leadRepository = AppDataSource.getRepository(Lead);

      const lead = await leadRepository.findOne({
        where: { id: leadId },
        relations: ["reservation"],
      });

      if (!lead || !lead.reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      const reservation = lead.reservation;

      reservation.financialStatus = financialStatus;
      reservation.loanAmount = loanAmount;
      reservation.paymentPlan = paymentPlan;

      if (financialStatus === "Approved") {
        lead.status = "Financials Approved";
      } else {
        lead.status = "Unassigned";
        reservation.financialStatus = "Cancelled";
      }

      await leadRepository.save(lead);
      await reservationRepository.save(reservation);

      return res.status(200).json({
        message: "Financial status updated successfully",
        reservation,
      });
    } catch (error) {
      console.error("Error updating financial status:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  // Add legal finalized status to a reservation
  static async legalFinalized(req: Request, res: Response): Promise<any> {
    try {
      const { contractSigned, legalNotes } = req.body;
      const leadId = req.params.id;

      if (contractSigned === undefined) {
        return res.status(400).json({
          error: "Missing required fields: contractSigned, legalNotes",
        });
      }

      const reservationRepository = AppDataSource.getRepository(Reservation);
      const leadRepository = AppDataSource.getRepository(Lead);

      const lead = await leadRepository.findOne({
        where: { id: leadId },
        relations: ["reservation"],
      });

      if (!lead || !lead.reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      const reservation = lead.reservation;

      reservation.contractSigned = contractSigned;
      reservation.legalNotes = legalNotes;

      lead.status = "Legal Finalized";

      await leadRepository.save(lead);
      await reservationRepository.save(reservation);

      return res.status(200).json({
        message: "Legal status updated successfully",
        reservation,
      });
    } catch (error) {
      console.error("Error updating legal status:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  }

  // Mark a lead as Sold
  static async sold(req: Request, res: Response): Promise<any> {
    try {
      const leadId = req.params.id;
      const { saleDate, finalSalePrice, commissionDetails } = req.body;

      if (!saleDate || !finalSalePrice || !commissionDetails) {
        return res.status(400).json({
          error:
            "Missing required fields: saleDate, finalSalePrice, commissionDetails",
        });
      }

      const leadRepository = AppDataSource.getRepository(Lead);
      const saleRepository = AppDataSource.getRepository(Sale);

      const lead = await leadRepository.findOne({
        where: { id: leadId },
        relations: ["sale"],
      });

      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      const sale = new Sale();
      sale.saleDate = new Date(saleDate);
      sale.finalSalePrice = finalSalePrice;
      sale.commissionDetails = commissionDetails;
      sale.lead = lead;

      lead.status = "Sold";

      await leadRepository.save(lead);
      await saleRepository.save(sale);

      return res.status(200).json({
        message: "Lead marked as sold",
        sale,
      });
    } catch (error) {
      console.error("Error marking lead as sold:", error);
      return res.status(500).json({ error: "Server Error" });
    }
  }
}
