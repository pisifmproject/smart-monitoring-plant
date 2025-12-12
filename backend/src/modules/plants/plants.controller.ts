import { Request, Response } from 'express';
import { plantsService } from './plants.service';

export const plantsController = {
    async getAll(req: Request, res: Response) {
        const plants = await plantsService.getAllPlants();
        res.json(plants);
    },

    async create(req: Request, res: Response) {
        try {
            const plant = await plantsService.createPlant(req.body);
            res.status(201).json(plant);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const plant = await plantsService.getPlantById(id);
            if (plant) {
                res.json(plant);
            } else {
                res.status(404).json({ message: 'Plant not found' });
            }
        } catch (err) {
             console.error('DB Error:', err);
             res.status(500).json({ error: 'Database error' });
        }
    },

    async getMachines(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const machines = await plantsService.getMachinesByPlantId(id);
            res.json(machines);
        } catch (err) {
             console.error('DB Error:', err);
             res.status(500).json({ error: 'Database error' });
        }
    },

    async getLVMDPs(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const panels = await plantsService.getLVMDPByPlantId(id);
            res.json(panels);
        } catch (err) {
             console.error('DB Error:', err);
             res.status(500).json({ error: 'Database error' });
        }
    }
};
