import * as _ from 'underscore';

export class EventPlayerVm {
    
    eventPlayer: any;
    player: any;

    constructor(){
        this.privateGoals = [];
        this.publicGoals = [];
    }

    name:string;
    playerId: string;
    score:number;
    privateGoals : GoalVm[];
    //maybe rename to completedPublicGoals.
    publicGoals: GoalVm[];

    getCompletedGoals(){
        return _.where(this.privateGoals, {isComplete : true}).map(g => g.toString()).concat(this.publicGoals.map(g => g.toString()));
    }
}

export class GoalVm{
    text:string;
    pointValue: number;
    isComplete: boolean;
    id: string;
    toString(){
        return this.pointValue + " " + this.text;
    }
}


