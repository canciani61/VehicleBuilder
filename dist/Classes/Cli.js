import inquirer from "inquirer";
import Truck from "./Truck.js";
import Car from "./Car.js";
import Motorbike from "./Motorbike.js";
import Wheel from "./wheel.js";
class Cli {
    constructor(vehicles) {
        this.exit = false;
        this.vehicles = vehicles;
    }
    static generateVin() {
        return (Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15));
    }
    chooseVehicle() {
        inquirer
            .prompt([{
                type: 'list',
                name: 'selectedVehicleVin',
                message: 'Select a vehicle to perform an action on',
                choices: this.vehicles.map((vehicle) => ({
                    name: `${vehicle.vin} -- ${vehicle.make} ${vehicle.model}`,
                    value: vehicle.vin,
                })),
            }])
            .then((answers) => {
            this.selectedVehicleVin = answers.selectedVehicleVin;
            this.performActions();
        });
    }
    createVehicle() {
        inquirer
            .prompt([{
                type: 'list',
                name: 'vehicleType',
                message: 'Select a vehicle type',
                choices: ['Car', 'Truck', 'Motorbike'],
            }])
            .then((answers) => {
            if (answers.vehicleType === 'Car')
                this.createCar();
            else if (answers.vehicleType === 'Truck')
                this.createTruck();
            else if (answers.vehicleType === 'Motorbike')
                this.createMotorbike();
        });
    }
    createCar() {
        inquirer
            .prompt([ /* existing car prompts */])
            .then((answers) => {
            const car = new Car(Cli.generateVin(), answers.color, answers.make, answers.model, parseInt(answers.year), parseInt(answers.weight), parseInt(answers.topSpeed), []);
            this.vehicles.push(car);
            this.selectedVehicleVin = car.vin;
            this.performActions();
        });
    }
    createTruck() {
        inquirer
            .prompt([ /* truck prompts */])
            .then((answers) => {
            const truck = new Truck(Cli.generateVin(), answers.color, answers.make, answers.model, parseInt(answers.year), parseInt(answers.weight), parseInt(answers.topSpeed), [], parseInt(answers.towingCapacity));
            this.vehicles.push(truck);
            this.selectedVehicleVin = truck.vin;
            this.performActions();
        });
    }
    createMotorbike() {
        inquirer
            .prompt([ /* motorbike prompts */])
            .then((answers) => {
            const wheels = [
                new Wheel(parseInt(answers.frontWheelDiameter), answers.frontWheelBrand),
                new Wheel(parseInt(answers.rearWheelDiameter), answers.rearWheelBrand)
            ];
            const bike = new Motorbike(Cli.generateVin(), answers.color, answers.make, answers.model, parseInt(answers.year), parseInt(answers.weight), parseInt(answers.topSpeed), wheels);
            this.vehicles.push(bike);
            this.selectedVehicleVin = bike.vin;
            this.performActions();
        });
    }
    findVehicleToTow(truck) {
        inquirer
            .prompt([{
                type: 'list',
                name: 'vehicleToTow',
                message: 'Select a vehicle to tow',
                choices: this.vehicles.map((vehicle) => ({
                    name: `${vehicle.vin} -- ${vehicle.make} ${vehicle.model}`,
                    value: vehicle,
                })),
            }])
            .then((answers) => {
            if (answers.vehicleToTow.vin === truck.vin) {
                console.log("Cannot tow itself!");
            }
            else {
                truck.tow(answers.vehicleToTow);
            }
            this.performActions();
        });
    }
    performActions() {
        const currentVehicle = this.vehicles.find(v => v.vin === this.selectedVehicleVin);
        const actions = [
            'Print details',
            'Start vehicle',
            'Accelerate 5 MPH',
            'Decelerate 5 MPH',
            'Stop vehicle',
            'Turn right',
            'Turn left',
            'Reverse',
            ...(currentVehicle instanceof Truck ? ['Tow another vehicle'] : []),
            ...(currentVehicle instanceof Motorbike ? ['Do a wheelie'] : []),
            'Select or create another vehicle',
            'Exit',
        ];
        inquirer
            .prompt([{
                type: 'list',
                name: 'action',
                message: 'Select an action',
                choices: actions,
            }])
            .then((answers) => {
            switch (answers.action) {
                case 'Print details':
                    currentVehicle?.printDetails();
                    break;
                case 'Start vehicle':
                    currentVehicle?.start();
                    break;
                case 'Accelerate 5 MPH':
                    currentVehicle?.accelerate(5);
                    break;
                case 'Decelerate 5 MPH':
                    currentVehicle?.decelerate(5);
                    break;
                case 'Stop vehicle':
                    currentVehicle?.stop();
                    break;
                case 'Turn right':
                    currentVehicle?.turn('right');
                    break;
                case 'Turn left':
                    currentVehicle?.turn('left');
                    break;
                case 'Reverse':
                    currentVehicle?.reverse();
                    break;
                case 'Tow another vehicle':
                    if (currentVehicle instanceof Truck) {
                        this.findVehicleToTow(currentVehicle);
                        return;
                    }
                    break;
                case 'Do a wheelie':
                    if (currentVehicle instanceof Motorbike) {
                        currentVehicle.wheelie();
                    }
                    break;
                case 'Select or create another vehicle':
                    this.startCli();
                    return;
                default:
                    this.exit = true;
            }
            if (!this.exit)
                this.performActions();
        });
    }
    startCli() {
        inquirer
            .prompt([{
                type: 'list',
                name: 'CreateOrSelect',
                message: 'Create new or select existing vehicle?',
                choices: ['Create a new vehicle', 'Select an existing vehicle'],
            }])
            .then((answers) => {
            answers.CreateOrSelect === 'Create a new vehicle'
                ? this.createVehicle()
                : this.chooseVehicle();
        });
    }
}
export default Cli;
