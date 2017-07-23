import * as _ from 'underscore';

export class EventPlayerVm {
    
    eventPlayer: any;
    player: any;

    constructor(){
        this.privateGoals = [];
    }

    name:string;
    playerId: string;
    score:number;
    privateGoals : GoalVm[];

    getCompletedPrivateGoals(){
        return _.where(this.privateGoals, g => g.isComplete);
    }
    getActivePrivateGoals(){
        return _.where(this.privateGoals, g => g.isComplete);
    }
}

export class GoalVm{
    text:string;
    pointValue: number;
    isComplete: boolean;
}


