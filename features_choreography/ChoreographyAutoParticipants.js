import CommandInceptor from 'diagram-js/lib/command/CommandInterceptor'
import {is} from 'bpmn-js/lib/util/ModelUtil';

//this class is an Inceptor in the standard diagram-js command stack
//to allow a new choreography task to have a a starting initiator and responder

export default class ChoreographyAutoParticipants extends CommandInceptor{
    constructor(eventBus, bpmnFactory, modeling){
        super(eventBus);

        this.postExecute(['shape.create', 'shape.append'], ({context}) => {
            const {shape, parent} = context;

            if(!shape || !is(shape, 'choreography:ChoreographyTask')) return;

            const taskBo = shape.businessObject;
            if(taskBo.initiatingParticipantRef || (taskBo.participantRef || []).length) return;

            const parentBo = parent?.businessObject;
            if(!parentBo) return;

            const initiator = bpmnFactory.create('choreography:Initiator', {name: 'Initiator'});
            const responder = bpmnFactory.create('choreography:Responder', {name: 'Responder'});

            modeling.updateModdleProperties(shape, parentBo, {
                participants: [...(parentBo.participants || []), initiator, responder]
            });

            modeling. updateModdleProperties(shape, taskBo, {
                initiatingParticipantRef: initiator,
                participantRef: [responder]
            })
        })
    }
}

ChoreographyAutoParticipants.$inject = ['eventBus', 'bpmnFactory', 'modeling'];