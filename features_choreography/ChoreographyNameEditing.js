import { isAny } from 'bpmn-js/lib/util/ModelUtil';
import { getOriginal, toPoint } from 'diagram-js/lib/util/Event';

const HIGH_PRIORITY = 3000;
const TASK_TYPES = [ 'choreography:ChoreographyTask' ];
const REMOVABLE_PARENT_COLLECTIONS = [ 'participants', 'flowElements', 'artifacts', 'rootElements' ];

export default function ChoreographyNameEditing(eventBus, modeling, canvas, elementRegistry) {
    eventBus.on('element.dblclick', HIGH_PRIORITY, function(event) {
        const element = event.element;

        if (!isAny(element, TASK_TYPES)) {
            return;
        }

        const position = getDiagramPosition(event, canvas);

        if (!position) {
            return;
        }

        const relativeY = position.y - element.y;
        const height = element.height;
        const topHeight = height / 3;
        const bottomStart = (2 * height) / 3;
        const bottomHeight = height / 3;
        const businessObject = element.businessObject;

        // Edit initiator if the click is in the upper third.
        if (relativeY >= 0 && relativeY < topHeight) {
            const initiator = businessObject?.initiatingParticipantRef;

            if (!initiator) {
                return false;
            }

            const nextName = window.prompt('Initiator-Name', initiator.name || '');

            if (nextName === null) {
                return false;
            }

            modeling.updateModdleProperties(element, initiator, {
                name: nextName.trim()
            });

            return false;
        }

        // Edit responder row if the click is in the lower third.
        if (relativeY >= bottomStart && relativeY <= height) {
            const responders = businessObject?.participantRef || [];

            if (!responders.length) {
                return false;
            }

            const rowHeight = bottomHeight / responders.length;
            const rowIndex = Math.min(
                responders.length - 1,
                Math.floor((relativeY - bottomStart) / rowHeight)
            );
            const responder = responders[rowIndex];

            if (!responder) {
                return false;
            }

            const nextName = window.prompt(`Responder ${rowIndex + 1}-Name`, responder.name || '');

            if (nextName === null) {
                return false;
            }

            const trimmedName = nextName.trim();

            if (!trimmedName) {
                removeResponderReference(element, responder, modeling);
                removeResponderIfOrphan(element, responder, modeling, elementRegistry);
                return false;
            }

            modeling.updateModdleProperties(element, responder, {
                name: trimmedName
            });

            return false;
        }
    });
}

ChoreographyNameEditing.$inject = [ 'eventBus', 'modeling', 'canvas', 'elementRegistry' ];

function getDiagramPosition(event, canvas) {
    const originalEvent = getOriginal(event);
    const point = originalEvent && toPoint(originalEvent);

    if (!point) {
        return null;
    }

    const viewbox = canvas.viewbox();
    const containerRect = canvas.getContainer().getBoundingClientRect();

    return {
        x: viewbox.x + (point.x - containerRect.left) / viewbox.scale,
        y: viewbox.y + (point.y - containerRect.top) / viewbox.scale
    };
}

function removeResponderReference(element, responder, modeling) {
    const task = element.businessObject;
    const participantRefs = task?.participantRef || [];
    const updatedParticipantRefs = participantRefs.filter((ref) => ref !== responder);

    modeling.updateModdleProperties(element, task, {
        participantRef: updatedParticipantRefs
    });
}

function removeResponderIfOrphan(element, responder, modeling, elementRegistry) {
    if (isStillReferenced(responder, elementRegistry)) {
        return;
    }

    const parent = responder.$parent;

    if (!parent) {
        return;
    }

    for (const property of REMOVABLE_PARENT_COLLECTIONS) {
        const collection = parent[property];

        if (!Array.isArray(collection) || !collection.includes(responder)) {
            continue;
        }

        modeling.updateModdleProperties(element, parent, {
            [property]: collection.filter((item) => item !== responder)
        });

        return;
    }
}

function isStillReferenced(responder, elementRegistry) {
    const tasks = elementRegistry.filter((element) => isAny(element, TASK_TYPES));

    return tasks.some((taskElement) => {
        const businessObject = taskElement.businessObject;
        const responders = businessObject?.participantRef || [];

        return businessObject?.initiatingParticipantRef === responder || responders.includes(responder);
    });
}
