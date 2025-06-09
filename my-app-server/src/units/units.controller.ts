import { Controller, Post, Body } from '@nestjs/common';

@Controller('units')
export class UnitsController {

    @Post('all') // Get all units
    getAllUnits() {
        return [
            {
                id: "UNIT-001",
                unitName: "Alpha Team",
                unitType: "Patrol Vehicle",
                location: "Downtown Station",
                vehicleReg: "ABC-1234",
                status: "Enabled"
            },
            {
                id: "UNIT-002",
                unitName: "Bravo Squad",
                unitType: "Emergency Response",
                location: "North Precinct",
                vehicleReg: "XYZ-5678",
                status: "Enabled"
            },
            {
                id: "UNIT-003",
                unitName: "Charlie Unit",
                unitType: "Traffic Control",
                location: "Highway Division",
                vehicleReg: "DEF-9012",
                status: "Disabled"
            },
            {
                id: "UNIT-004",
                unitName: "Delta Force",
                unitType: "SWAT Vehicle",
                location: "Central Command",
                vehicleReg: "GHI-3456",
                status: "Enabled"
            },
            {
                id: "UNIT-005",
                unitName: "Echo Team",
                unitType: "Motorcycle Unit",
                location: "East District",
                vehicleReg: "JKL-7890",
                status: "Enabled"
            },
            {
                id: "UNIT-006",
                unitName: "Foxtrot Division",
                unitType: "K9 Unit",
                location: "South Station",
                vehicleReg: "MNO-2468",
                status: "Disabled"
            },
            {
                id: "UNIT-007",
                unitName: "Golf Squad",
                unitType: "Patrol Vehicle",
                location: "West Precinct",
                vehicleReg: "PQR-1357",
                status: "Enabled"
            },
            // ... more units
        ];
    }

    @Post('single') // POST /units/get-single - Get single unit
    getSingleUnit(@Body() body: { id: string }) {
        return {
            id: body.id,
            unitName: "Alpha Team",
            unitType: "Patrol Vehicle",
            location: "Downtown Station",
            vehicleReg: "ABC-1234",
            status: "Enabled"
        };
    }

    @Post('create') // POST /units/create - Create new unit
    createUnit(@Body() unitData: any) {
        return {
            message: 'Unit created successfully',
            data: {
                id: `UNIT-${Date.now()}`,
                ...unitData
            }
        };
    }

    @Post('update') // POST /units/update - Update existing unit
    updateUnit(@Body() body: { id: string, data: any }) {
        return {
            message: `Unit ${body.id} updated successfully`,
            data: {
                id: body.id,
                ...body.data
            }
        };
    }

    @Post('delete') // POST /units/delete - Delete unit
    deleteUnit(@Body() body: { id: string }) {
        return {
            message: `Unit ${body.id} deleted successfully`,
            deletedId: body.id
        };
    }
}
